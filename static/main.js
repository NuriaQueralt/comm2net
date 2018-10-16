function confirmFileSubmit(){
    var input  = document.getElementById('fileToUpload'); // get the input
    var file   = input.files[0];                  // assuming single file, no multiple
    var reader = new FileReader();

    reader.onload = function(e) {
        var text = reader.result;                 // the entire file

        var firstLine = text.split('\n').shift(); // first line
        //var columns = firstLine.split("\t");
        var columns = firstLine.split(",");

        var previewTableDiv = document.getElementById('previewTableDiv'); // get the input



        var tbl = document.createElement('table');
            tbl.className = "table table-striped";
            tbl.style.width = '100%';

            var thead = document.createElement('thead');

            var tr = document.createElement('tr');

            var td = document.createElement('td');
            td.style.width = "150"
            td.appendChild(document.createTextNode("Column Name"))
            tr.appendChild(td)

            var td = document.createElement('td');
            td.style.width = "150"
            td.appendChild(document.createTextNode("Role"))
            tr.appendChild(td)

            thead.appendChild(tr);

            tbl.appendChild(thead);

            var tbdy = document.createElement('tbody');

            for (var i = 0; i < columns.length; i++) {
                var tr = document.createElement('tr');
                for (var j = 0; j <= 1; j++) {
                    var td = document.createElement('td');
                    if(j == 0) {
                        td.style.width = "150"
                        td.appendChild(document.createTextNode(columns[i]))
                    } else {
                        //td.appendChild(document.createTextNode("checkbox"))
                        td.innerHTML = "<select id=\"role" + i + "\"  >\n" +
                            "  <option>--Select value type--</option>\n" +
                            "  <option tag='" + columns[i] + "'>Source Node</option>\n" +
                            "  <option tag='" + columns[i] + "'>Target Node</option>\n" +
                            "  <option tag='" + columns[i] + "'>Edge Interaction</option>\n" +
                            "</select>";
                    }

                    tr.appendChild(td)
                }
                tbdy.appendChild(tr);
            }
            tbl.appendChild(tbdy);
            previewTableDiv.appendChild(tbl)
        console.log(firstLine);                   // use the console for debugging
    }

    reader.readAsText(file, 'UTF-8');             // or whatever encoding you're using
                                                  // UTF-8 is default, so this argument
}

function submitData() {
    var loadPlan = checkTable();
    console.log(loadPlan);

    var input  = document.getElementById('fileToUpload'); // get the input
    var file   = input.files[0];                  // assuming single file, no multiple

    var nodeInput  = document.getElementById('fileToUploadNode');
    var nodeFile   = nodeInput.files[0];


        var ndexServerURI = ""; //"http://localhost:8183";
        var url = ndexServerURI + "/v1/upload";

        var XHR = new XMLHttpRequest();
        var FD  = new FormData();

        var blob = new Blob([nodeFile], { type: "text/plain"});
        var blob2 = new Blob([file], { type: "text/plain"});

       // data.append("myfile", myBlob, "filename.txt");
        //FD.append('CXNetworkStream', blob);
        FD.append('file', blob2);
        FD.append('nodeFile', blob);
        FD.append('source', loadPlan["Source"]);
        FD.append('target', loadPlan["Target"]);
        FD.append('edge', loadPlan["Edge"]);
        FD.append('nodeFileIDColumn', loadPlan["NodeIDColumn"]);

        console.log("here");

        XHR.addEventListener('load', function(event) {

            if (XHR.readyState === XHR.DONE) {
                if (XHR.status === 200 || XHR.status === 201) {
                    var newUUID = XHR.responseText;
                    onSuccess(XHR.responseText);
                }
            }
        //    alert('Yeah! Data sent and response loaded.');
        });

        // We define what will happen in case of error
        XHR.addEventListener('error', function(event) {
         //   alert('Oups! Something goes wrong.');
            onError(XHR.responseText);
        });

        XHR.open('POST', url);
        //XHR.setRequestHeader("Authorization", "Basic " + btoa("scratch:scratch"));

        // We just send our FormData object, HTTP headers are set automatically
        //var foo =  XHR.send({'files': {"upload": "ABC", "plan": "xyz"}});
        var foo =  XHR.send(FD);



}


function checkTable() {
    var returnValue = {};
    var roleDiv = document.getElementById("previewTableDiv");
    var roles = roleDiv.getElementsByTagName("select");
    for(var i=0;i<roles.length; i++){
        if(roles[i].options[roles[i].selectedIndex].value == "Source Node"){
            returnValue["Source"] = roles[i].options[roles[i].selectedIndex].attributes["tag"].value;
        } else if(roles[i].options[roles[i].selectedIndex].value == "Target Node"){
            returnValue["Target"] = roles[i].options[roles[i].selectedIndex].attributes["tag"].value;
        } else if(roles[i].options[roles[i].selectedIndex].value == "Edge Interaction"){
            returnValue["Edge"] = roles[i].options[roles[i].selectedIndex].attributes["tag"].value;
        }
    }

    var nodeId = document.getElementById("nodeId");
    if(nodeId != null) {
        returnValue["NodeIDColumn"] = nodeId.options[nodeId.selectedIndex].value;
        console.log(returnValue["NodeIDColumn"]);
    }

    return returnValue;
}



function confirmFileSubmitNode(){
    var input  = document.getElementById('fileToUploadNode'); // get the input
    var file   = input.files[0];                  // assuming single file, no multiple
    var reader = new FileReader();

    reader.onload = function(e) {
        var text = reader.result;                 // the entire file

        var firstLine = text.split('\n').shift(); // first line
        //var columns = firstLine.split("\t");
        var columns = firstLine.split(",");

        var previewTableDiv = document.getElementById('previewTableDivNode'); // get the input

        var tbl = document.createElement('table');
            tbl.className = "table table-striped";
            tbl.style.width = '100%';

            var thead = document.createElement('thead');

            var tr = document.createElement('tr');

            var td = document.createElement('td');
            td.style.width = "150"
            td.appendChild(document.createTextNode("Select Node ID"))
            tr.appendChild(td)
            thead.appendChild(tr);

            tbl.appendChild(thead);


            var tbdy = document.createElement('tbody');
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var nodeSelectText = "<select id='nodeId'  >\n" +
                "  <option>--Select value type--</option>\n";
            for (var i = 0; i < columns.length; i++) {
                nodeSelectText += "  <option tag='" + columns[i] + "'>" + columns[i] + "</option>\n";
            }

            nodeSelectText += "</select>";
            td.innerHTML = nodeSelectText;
            tr.appendChild(td)
            tbdy.appendChild(tr);
            tbl.appendChild(tbdy);
            previewTableDiv.appendChild(tbl)
        console.log(firstLine);                   // use the console for debugging
    }

    reader.readAsText(file, 'UTF-8');             // or whatever encoding you're using
                                                  // UTF-8 is default, so this argument
}

