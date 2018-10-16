import os
import logging
import logging.handlers

root = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
log_path = os.path.join(root, 'logs')
static_path = os.path.join(root, 'static')
