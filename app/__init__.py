# -*- coding: utf-8 -*-
from flask import Flask, send_from_directory, Blueprint, json
from flaskext.mysql import MySQL
from contextlib import closing
from flask_bcrypt import Bcrypt
from .models import models
import pymysql
import os
# from .config import config_by_name
from sqlalchemy import create_engine, text
from dbModule import Database

# import config
flask_bcrypt = None
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db = Database()

class NDArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, mx.nd.NDArray):
            return obj.asnumpy().tolist()
        return json.JSONEncoder.default(self, obj)

def create_app():
    app = Flask(__name__, static_url_path="/statics", static_folder="statics")
    global flask_bcrypt
    flask_bcrypt = Bcrypt(app)
    from .views import main_view, authen_view
    from .api import filemanager
    # from .api import big_file
    app.config.from_pyfile('config.py')
    
    app.register_blueprint(main_view.bp, url_prefix='/')
    app.register_blueprint(authen_view.bp, url_prefix='/authen')

    # for APIs
    app.register_blueprint(filemanager.bp, url_prefix='/file')

    app.secret_key = "newjack_bridge"
    return app
