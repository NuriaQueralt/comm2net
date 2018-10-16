import sys
import argparse
import bottle
import pandas as pd
from bottle import Bottle, HTTPError, request, redirect, static_file
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
import os
import csv
from io import StringIO
import xlrd
import ndex2
import app
import tempfile

from pandas import ExcelFile


path_this = os.path.dirname(os.path.abspath(__file__))
os.environ["PATH"] += os.pathsep + os.path.join(path_this, '..')
print(os.environ["PATH"])

bottle.BaseRequest.MEMFILE_MAX = 1024 * 1024

api = Bottle()


upload_server = 'dev.ndexbio.org'
upload_username = 'scratch'
upload_password = 'scratch'

# default to the network analysis app index page
@api.get('/')
def index():
    redirect('/static/index.html')

# generic API to serve any resource in the static directory
@api.get('/static/<filepath:path>')
def static(filepath):
    return static_file(filepath, root=app.static_path)

@api.get('/v1/networks')
def get_networks():

    return 'get_networks complete'


@api.post('/v1/upload')
def upload_file():
    try:
        data = request.files.get('file')
        node_data = request.files.get('nodeFile')
    except Exception as e:
        raise HTTPError(500, e)

    if data and data.file:
        if (request.query.alpha):
            alpha = request.query.alpha

        if (request.query.beta):
            beta = request.query.beta

        source_column = request.forms.get('source')
        target_column = request.forms.get('target')
        edge_column = request.forms.get('edge')
        node_file_id_col = request.forms.get('nodeFileIDColumn')

        with tempfile.NamedTemporaryFile('wb', delete=False) as f:
            f.write(data.file.read())
            f_name = f.name
            f.close()

        with open(f_name, 'r') as tsvfile:
            header = [h.strip() for h in tsvfile.readline().split(',')]
            edge_attrs = [e for e in header if e not in [source_column, target_column, edge_column]]

            df = pd.read_csv(tsvfile,delimiter=',',engine='python',names=header)

            nice_cx = ndex2.create_nice_cx_from_pandas(df, source_field=source_column, target_field=target_column,
                                                       source_node_attr=[], target_node_attr=[], edge_attr=edge_attrs,
                                                       edge_interaction=edge_column) #NiceCXNetwork()

        if node_data and node_data.file:
            with tempfile.NamedTemporaryFile('wb', delete=False) as f2:
                f2.write(node_data.file.read())
                f_name2 = f2.name
                f2.close()

            with open(f_name2, 'r') as tsvfile2:
                header2 = [h.strip() for h in tsvfile2.readline().split(',')]
                dtype_set = {h_n: str for h_n in header2}

                df2 = pd.read_csv(tsvfile2, delimiter=',', engine='python', names=header2, dtype=dtype_set)

                for index, row in df2.iterrows():
                    node_name_lookup = {node.get('n'): node.get('@id') for node_id, node in nice_cx.get_nodes()}
                    node_id = node_name_lookup.get(row[node_file_id_col])
                    for header_column in header2:
                        if header_column != node_file_id_col:
                            if header_column == 'name':
                                nice_cx.add_node_attribute(property_of=node_id, name='name_attr',
                                                           values=row[header_column])
                            else:
                                nice_cx.add_node_attribute(property_of=node_id, name=header_column,
                                                           values=row[header_column])

        upload_message = nice_cx.upload_to(upload_server, upload_username, upload_password)

        nice_cx.print_summary()

        return upload_message


@api.post('/v1/upload/excel')
def upload_file():
    try:
        data = request.files.get('file')
    except Exception as e:
        raise HTTPError(500, e)

    if data and data.file:
        if (request.query.alpha):
            alpha = request.query.alpha

        if (request.query.beta):
            beta = request.query.beta

        wb = xlrd.open_workbook(file_contents=data.file.read())

        df = pd.read_excel(wb, engine='xlrd')

        source_column = request.forms.get('source')
        target_column = request.forms.get('target')
        edge_column = request.forms.get('edge')

        nice_cx = ndex2.create_nice_cx_from_pandas(df, source_field='CDS Mutation', target_field='Gene Symbol',
                                                  source_node_attr=['Primary Tissue'], target_node_attr=['Gene ID'],
                                                  edge_attr=[])

        #upload_message = nice_cx.upload_to(upload_server, upload_username, upload_password)

        nice_cx.print_summary()

# run the web server
def main():
    status = 0
    parser = argparse.ArgumentParser()
    parser.add_argument('port', nargs='?', type=int, help='HTTP port', default=8383)
    args = parser.parse_args()

    print('starting web server on port %s' % args.port)
    print('press control-c to quit')
    try:
        server = WSGIServer(('0.0.0.0', args.port), api, handler_class=WebSocketHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print('exiting main loop')
    except Exception as e:
        exit_str = 'could not start web server: %s' % e
        print(exit_str)
        status = 1

    print('exiting with status %d', status)
    return status


if __name__ == '__main__':
    sys.exit(main())
