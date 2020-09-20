# -*- coding: utf-8 -*-
from flask import Flask, send_from_directory, Blueprint, json
from flaskext.mysql import MySQL
from contextlib import closing
from flask_bcrypt import Bcrypt

mysql = MySQL()

class NDArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, mx.nd.NDArray):
            return obj.asnumpy().tolist()
        return json.JSONEncoder.default(self, obj)

def create_app():
    app = Flask(__name__, static_url_path="/statics", static_folder="statics")

    from .views import main_view, authen_view
    from .api import big_file
    app.register_blueprint(authen_view.bp,url_prefix='/authen')
    app.register_blueprint(main_view.bp,url_prefix='/')
    app.register_blueprint(big_file.bp,url_prefix='/file')
    app.config.from_envvar('APP_CONFIG_FILE')

    # MySQL configurations
    # app.config['MYSQL_DATABASE_USER'] = MYSQL_DATABASE_USER
    # app.config['MYSQL_DATABASE_PASSWORD'] = MYSQL_DATABASE_PASSWORD
    # app.config['MYSQL_DATABASE_DB'] = MYSQL_DATABASE_DB
    # app.config['MYSQL_DATABASE_HOST'] = MYSQL_DATABASE_HOST

    mysql.init_app(app)
    bcrypt = Bcrypt(app)

    # app.config['UPLOAD_FOLDER'] = '../statics/test_img/'
    # app.config['UPLOAD_ROI'] = '../statics/roid/'
    # app.config['UPLOAD_TW3'] = '../statics/tw3_roi/'
    # app.config["CLIENT_IMAGES"] = '/home/ubuntu/Desktop/dev/Papaya-master/statics/test_img/'
    # # app.config['MODAL'] = './static/Uploads/'
    # app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'bmp'])
    # app.config['DCM_EXTENSIONS'] = set(['dcm'])
    app.secret_key = 'why would I tell you my secret key?'

    return app
