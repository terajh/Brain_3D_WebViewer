
from flask import Flask, render_template, json, request, redirect, session, send_from_directory, Blueprint, make_response
from flask import send_file
from flask_paginate import Pagination, get_page_parameter
from flask.json import JSONEncoder
import os, cv2, shutil
import numpy as np
from xml.etree.ElementTree import Element,SubElement, dump, ElementTree
from werkzeug.utils import secure_filename
import codecs
from PIL import Image
from datetime import datetime
from flaskext.mysql import MySQL
from contextlib import closing
from app import flask_bcrypt
import distutils.core
import re
import scipy, numpy, shutil, os, nibabel
import sys, getopt
import mxnet as mx
import imageio, base64
import pathlib

from flask import current_app as app
from sqlalchemy import text

from app.lib.fill_json import fill_json
from app.lib.transform_to_xml import transform_to_xml
from app.lib.json_seperator import json_seperator

from app import db

bp = Blueprint('authen',__name__,url_prefix='/authen',template_folder='templates')


@bp.route('/login')
def loginpage():
    return render_template('login/login.html')

# checking login information under DB
@bp.route('/validateLogin', methods=['POST'])
def validateLogin():
    print("validationlogin render")
    if request.method == 'POST':
        try:
            _username = request.form['inputEmail']
            _password = request.form['inputPassword']
            print(_username, _password)
            data = db.executeAll("SELECT * FROM member WHERE email = '" + _username + "';")
            print(data)
            if len(data) > 0:
                    if data[0]['authorize'] == 1:
                        # if bcrypt.check_password_hash(str(data[0][3]), _password):
                        if str(data[0]['password']==_password):
                            session['user'] = data[0]['email']
                            _id01 = session['user'].split("@")
                            _id02 = _id01[1].split(".")
                            _userId = _id01[0] + _id02[0]
                            session['userID'] = _userId
                            return redirect('/record')
                        else:
                            return render_template('error.html', error='Wrong Password.')
                    else:
                        return render_template('error.html', error='Unauthorized member')
            else:
                return render_template('error.html', error='Wrong Email address or Non-member.')

        except Exception as e:
            print("vali error", e)
            return render_template('error.html', error=str(e))
    else:
        return render_template('error.html', error='Bad try to access')
# check email from DB when join
@bp.route('/checkId', methods=['GET', 'POST'])
def checkId():
    print('checkId render')
    if request.method == 'POST':
        _checkEmail = request.json['dueId']

        data = db.executeAll("SELECT COUNT(*) FROM member WHERE email = '" + str(_checkEmail) + "';")
        return json.dumps(data[0]['COUNT(*)'])
    else:
        return render_template('error.html', error='Bad try to access')

# join member and add DB
@bp.route('/signUp',methods=['POST','GET'])
def signUp():
    if request.method == 'POST':
        try:
            print('signUp');
            _name = request.form['inputName']
            _email = request.form['inputEmail']
            _password = request.form['inputPassword']
            _authorize = "1"
            now = datetime.now()
            _nowDatetime = now.strftime('%Y/%m/%d %H:%M:%S')
            if _name and _email and _password:
                _hashed_password = flask_bcrypt.generate_password_hash(_password).decode('utf-8')
                chkMem = db.executeAll("SELECT name FROM member WHERE email = '" + str(_email) + "';")
                print('##',len(chkMem))
                if len(chkMem) == 0:

                    data = db.executeAll("INSERT INTO member(name, email, password, authorize, joinDate) VALUES('"+_name+"', '"+_email+"', '"+_hashed_password+"', '"+_authorize+"', '"+_nowDatetime+"');")
                    # db.commit()
                    content = "New applyer name: " + _name + " and email: " + _email
                    # mail_apache(1, content, "nanjun1@naver.com")
                return render_template('response.html', result='Success to join, please wait to receive authorision email')
            else:
                return render_template('error.html', error='Wrong and miss information for join')

        except Exception as e:
            print(e)
            return render_template('error.html', error='Try login. If not, join again please.')
    else:
        return render_template('error.html', error='Bad try to access')
# logout
@bp.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

# connect join page
@bp.route('/showSignUp')
def showSignUp():
    print('show sign up render')
    if session.get('user'):
        return render_template('select/sel_pro.html')
    else:
        return render_template('login/join.html')

# connect to find password page
@bp.route('/showPassword')
def showPassword():
    print('show password render')
    if session.get('user'):
        return render_template('select/sel_pro.html')
    else:
        return render_template('login/password.html')
