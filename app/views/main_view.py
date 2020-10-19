
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
from flask_bcrypt import Bcrypt
import distutils.core
import re
import scipy, numpy, shutil, os, nibabel
import sys, getopt
import mxnet as mx
import imageio, base64
import pathlib
import string
from flask import current_app as app
from sqlalchemy import text

from app.lib.fill_json import fill_json
from app.lib.transform_to_xml import transform_to_xml
from app.lib.json_seperator import json_seperator
from app import BASE_DIR, db
bp = Blueprint('main',__name__,url_prefix='/',template_folder='templates')


# checking image extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in bp.config['ALLOWED_EXTENSIONS']

@bp.route('/')
def loginpage():
    if session.get('user'):
        return redirect('/record')
    else: 
        return redirect('/authen/login')

@bp.route('/get_image_data',methods=['GET'])
def get_image_data():
    print('get image data render')
    if request.method == 'GET':
        print("###",session)
        # print('##',request.args.get('file_names'))
        file_name = request.args.get('file_names')
        projec_name = request.args.get('projec_names')
        image_path = 'statics/test_img/'
        full_path = image_path + session['userID']+'/'+str(projec_name)+'/'+file_name
        # img_data = img.get_fdata()
        try:
            file = send_file(full_path, mimetype='application/octet-stream',as_attachment=True,  attachment_filename=file_name)
            print(type(file))
            return file
        except FileNotFoundError:
            abort(404)
    else:
        return json.dumps({"result": False})


#Select project
@bp.route('/sel_project', methods=['GET'])
def sel_project():
    print('select project render')
    _userId = session['userID']

    filename = request.args.get('filename', type=str, default="None")
    print(filename)
    with open(BASE_DIR + "/statics/test_json/" +_userId + "/" + filename, 'r') as json_file:
        js_file = json_file.readline()
    
    file = pathlib.Path(BASE_DIR + "/statics/test_json/" +_userId + "/" + filename)
    file_text = file.read_text(encoding='utf-8')
    json_data = json.loads(file_text)
    _filenames = json_data['_via_img_metadata'][list(json_data['_via_img_metadata'].keys())[0]]['filename']

    fname = os.path.splitext(BASE_DIR + "/statics/test_json/" + _userId + "/" +filename)
    fname = os.path.split(fname[0])
    _fname = fname[1] #확장자 없는 load할 파일명

    if len(filename.split("/")) == 1:    # select a fracture or kneeOA project (ex)project_20190809.json)
        user_name = session['user']
        data = db.executeAll(text("""SELECT project_type FROM user_info WHERE email = '${user_name}' and project_name = '${_fname}.json';""")).fetchall()
        
        print(data)
        direc = BASE_DIR + "/statics/test_img/" + _userId + "/" + filename.split(".")[0] + "/"
        data[0][0] == 'Brain' # select a Brain project
                
    return render_template('3d_viewer.html', js_file=str(js_file), fname=_fname, direc=direc, first=first, proj='f', filedata = 'f')

#Save project
@bp.route('/save_project', methods=['POST'])
def save_project():
    print("save project render")
    if request.method == 'POST':
        project_content = request.json['_via_project']
        _filename = request.json['filename']
        _fname = _filename.split(".")[0]
        _first = request.json['_first']
        
        project_type = 'Brain'
        _email = session['user']
        _project_name = _filename
        _date = datetime.now()
        _nowdate = _date.strftime('%Y-%m-%d %H:%M:%S')
        _userId = session['userID']
        _dic_img = BASE_DIR + "/statics/test_img/" + _userId + "/" + _fname + "/"
        _dic_xml = BASE_DIR + "/statics/test_xml/" + _userId + "/" + _fname + "/"
        _dic_json = BASE_DIR + "/statics/test_json/" + _userId + "/"
        _dic_sep_json = _dic_json + _fname + "/"

        _image_filename_list = request.json['_via_image_filename_list'] # 해당 프로젝트에 저장되는 이미지 리스트

        if not os.path.isdir(BASE_DIR + "/statics/test_xml/" + _userId + "/"):
            os.mkdir(BASE_DIR + "/statics/test_xml/" + _userId + "/")
        if not os.path.isdir(_dic_xml):
            os.mkdir(_dic_xml)
        if not os.path.isdir(_dic_json):
            os.mkdir(_dic_json)
        if not os.path.isdir(_dic_sep_json):
            os.mkdir(_dic_sep_json)

        # update project on DB
        user_name = session['user']
        data = db.executeAll("""SELECT project_name FROM user_info WHERE email = '${user_name}';""").fetchall()
        

        dataDB = []
        for x in data:
            dataDB.append(x[0])
        if len(data) != 0:
            if str(_filename) in dataDB:
                # 기존 프로젝트를 로드해서 수정할 때
                data = db.executeAll("""UPDATE user_info SET date = '${_nowdate}' WHERE project_name = '${_filename}';""").fetchall()
                with app.database.connect() as conn:
                    conn.commit()
            else:
                data = db.executeAll(    #기존에 프로젝트를 생성한 적 있던 사용자가 새 프로젝트를 만들 때
                    "INSERT INTO user_info(email, project_name, project_type, date) VALUES('" + str(_email) + "', '" + str(_project_name) + "','" + str(project_type) + "'," + str(_nowdate) + ");").fetchall()
                
                with app.database.connect() as conn:
                    conn.commit()
        else:
            data = db.executeAll(   #사용자가 첫 프로젝트를 생성할 때
                text("INSERT INTO user_info(email, project_name, project_type, date) VALUES('" + str(_email) + "', '" + str(_project_name) + "','" + str(project_type) + "','" + _nowdate + "');")).fetchall()
            print(data)
            with app.database.connect() as conn:
                conn.commit()

        # temp_img => test_img
        if os.path.isdir(BASE_DIR + "/statics/temp_img/" + _userId):
            filenames = os.listdir(BASE_DIR + "/statics/temp_img/" + _userId + "/")
            for filename in filenames:
                if filename not in _image_filename_list:  # test_img 폴더에 복사해야하는 이미지 외 다른 이미지가 존재할 시 삭제
                    os.remove(BASE_DIR + "/statics/temp_img/"+_userId+"/"+filename)
            distutils.dir_util._path_created = {}
            distutils.dir_util.copy_tree(BASE_DIR + "/statics/temp_img/" + _userId + "/", _dic_img)
            shutil.rmtree(BASE_DIR + "/statics/temp_img/" + _userId + "/")

        # test_img 내 파일목록
        _filenames = os.listdir(BASE_DIR + "/statics/test_img/" + _userId + "/" + _fname)

        # 기존 age, gender list 생성
        _db_age_list = []
        _db_gender_list = []
        # 기존 radius, styloid, scaphoid list 생성
        _db_radius_list = []
        _db_styloid_list = []
        _db_scaphoid_list = []

        
        # brain 프로젝트 저장시
        study_Data = db.executeAll(text("SELECT img_name, age, gender FROM brain_info WHERE email = '" + session['user'] + "' AND project_img = '" + _project_name.split('.')[0] + "';")).fetchall()
        for idx, data in enumerate(study_data):
            _study_num=data[0].split(".")[0][0:5]
            _db_age_list.append([_study_num, data[1]])
            _db_gender_list.append([_study_num, data[2]])

        # save project.json
        with open(_dic_json + str(_filename), "w") as json_file:
            _sep_project_name = _project_name.split(".")[0]
            project_content = fill_json.fill(project_content, _db_age_list, _db_gender_list)
            json.dump(project_content, json_file)

            # 각 img별로 DB에 넣기 위해 list 생성
            img_list = [x for x in project_content['_via_img_metadata'].keys()]
            # inserted code - modify json_info TABLE
            for img in img_list:
                # 이미지 갯수별로 파일 저장
                transform_to_xml.create_xml(project_content, img, _dic_img, _dic_xml, _first)
                # json 나누어 저장
                json_seperator.seperate(project_content, img, _userId, _fname)
                # DB query에 사용할 변수
                json_name = img.split(".")[0]+".json"
                # write seyeon 20200121
                _studynum = img[0:5]
                _dir_num = img[5:6]
                if _dir_num == '1' :
                    _direction = "AP/PA"
                elif _dir_num == "2" :
                    _direction = "Lateral"
                else :
                    _direction = "Oblique"

                _studynum = img.split("_")[0]
                _dir_num = img.split("_")[1].split(".")[0]
                _direction = re.findall("[a-zA-Z+]", _dir_num)
                if _direction[0] == "A":
                    _direction = "AP/PA"
                elif _direction[0] == "L":
                    _direction = "Lateral"
                elif _direction[0] == "O":
                    _direction = "Oblique"
                else:
                    _direction = _direction[0]

                _age = project_content['_via_img_metadata'][img]['file_attributes']['age']
                if _age == '':
                    _age = '-1'
                _age = int(_age)
                _gender = project_content['_via_img_metadata'][img]['file_attributes']['gender']
                _filesize = project_content['_via_img_metadata'][img]['size']

                # save brain project on DB
                print(project_content['_via_img_metadata'])
                json_data = db.executeAll(text("SELECT * FROM brain_info WHERE email = '" + session[
                    'user'] + "' AND project_img = '" + _sep_project_name + "' AND img_name = '" + json_name + "';")).fethall()

                # 기존 data가 없을 때
                if len(json_data) == 0:
                    json_data = db.executeAll(
                        text("INSERT INTO brain_info(email, img_name, project_img, age, gender) VALUES('" + _email + "', '" + json_name + "', '" + str(_sep_project_name) + "', '" + str(_age) + "', '" + str(_gender) + "');")).fecthall()
                    
                    with app.database.connect() as conn:
                        conn.commit()
                else:
                    json_data = db.executeAll(text("UPDATE brain_info SET" + " age = '" + str(_age) + "', gender = '" + str(_gender) + "' WHERE email = '" + session['user'] + "' AND project_img = '" + str(_sep_project_name) + "' AND img_name = '" + str(json_name) + "';")).fecthall()
                    with app.database.connect() as conn:
                        conn.commit()


        # 이미지 리스트에서 삭제한 이미지에 대한 DB와 서버에 있는 파일들을 삭제 (DB 삭제전 서버파일 먼저 삭제시 오류 발생)
        for filename in _filenames:
            if filename not in _image_filename_list:
                json_data = db.executeAll(text("DELETE FROM brain_info WHERE project_img='"+_fname+"' AND img_name LIKE '" + filename.split(".")[0] + ".json';")).fecthall()
                with app.database.connect() as conn:
                    conn.commit()
                os.remove(BASE_DIR + "/statics/test_img/" + _userId + "/" + _fname + "/" + filename)
                os.remove(BASE_DIR + "/statics/test_json/" + _userId + "/" + _fname + "/" + filename.split(".")[0] + ".json")
                os.remove(BASE_DIR + "/statics/test_xml/" + _userId + "/" + _fname + "/" + filename.split(".")[0] + ".xml")

        return json.dumps({"result": True})
    else:
        return json.dumps({"result": False})

@bp.route('/new_project', methods=['GET'])
def new_project():
    print('new project render')
    print("###",session)
    first = request.args.get('first', type=int, default=5)   #new 'fracture' project -> first=0
    _userId = session['userID']
    _date = datetime.now()
    _nowdate = _date.strftime('%Y%m%d%H%M')
    _fname = "project_"+_nowdate
    direc = BASE_DIR + "/statics/test_img/" + _userId + "/" + _fname + "/"
    return render_template('3d_viewer.html', fname=_fname, direc=direc, first=first, proj='f', filedata = 'f')

                

#upload images to server
@bp.route('/upload_img', methods=['POST'])
def upload_img():
    print("upload img render")
    if request.method == 'POST':
        img_files = request.files.getlist('files[]')

        #잘못된 규칙의 파일명 upload시 temp_img 폴더에 저장되는것 방지
        wrong_list = request.form['_via_wrong_img_list[]']
        wrong_list = wrong_list.split(',')
        if not os.path.isdir(BASE_DIR+ "/statics/temp_img/"+session['userID']+"/"):
            os.mkdir(BASE_DIR + "/statics/temp_img/"+session['userID'])
        for file in img_files:
            filename = secure_filename(file.filename)
            if filename not in wrong_list:
                file.save(BASE_DIR + "/statics/temp_img/"+session['userID']+"/"+filename) # 유저마다의 파일에 저장된다.

        return json.dumps({"result": True})

    else:
        return json.dumps({"result": True})

# connect sel_pro02 page and UX
@bp.route('/record', methods=['GET', 'POST'])
def record():
    if session.get('user'):
        userId = session['user']
        _userId = userId.split("@")[0]
        NumArticle = 10

        
        search = False

        page = request.args.get(get_page_parameter(), type=int, default=1)
        start_article = (page - 1) * NumArticle
        ownrecord = db.executeAll("SELECT SUBSTRING_INDEX(project_name, '.', 1) as project_name_print, rid, project_name, project_type, date FROM user_info WHERE email = '" + str(
            userId) + "' ORDER BY rid DESC" + " LIMIT " + str(
            start_article) + ", " + str(NumArticle) + ";")

        # get DB list from selected option in history page

        total_cnt = db.executeAll("SELECT COUNT(*) FROM user_info WHERE email = '" + str(userId) + "';")
        print(total_cnt)
        
        total_cnt = total_cnt[0]['COUNT(*)']
        pagination = Pagination(page=page, total=total_cnt, search=search, per_page=NumArticle,
                                record_name='ownrecord', css_framework='bootstrap3')
        return render_template('select/sel_pro.html', ownrecord=ownrecord, pagination=pagination)
    else:
        return render_template('error.html', error='Unauthorized Access')

# connect sel_study01 page and UX
@bp.route('/study_record', methods=['GET', 'POST'])
def study_record():
    print('study record render')
    if session.get('user'):
        userId = session['user']
        _userId = userId.split('@')[0]
        NumArticle = 10
        search = False

        chose_opt = request.args.get('chose_opt', type=int, default=1)

        page = request.args.get(get_page_parameter(), type=int, default=1)
        start_article = (page - 1) * NumArticle

        if chose_opt == 1:
            option = "email = '" + userId + "' ORDER BY jid DESC "
        elif chose_opt == 2:
            option = "email = '" + userId + "' ORDER BY project_name ASC, filename ASC "
        elif chose_opt == 3:
            option = "email = '" + userId + "' ORDER BY project_name DESC, filename ASC "
        elif chose_opt == 4:
            option = "email = '" + userId + "' AND direction = 'AP/PA' ORDER BY jid DESC "
        elif chose_opt == 5:
            option = "email = '" + userId + "' AND direction = 'Lateral' ORDER BY jid DESC "
        elif chose_opt == 6:
            option = "email = '" + userId + "' AND direction = 'Oblique' ORDER BY jid DESC "
        elif chose_opt == 7:
            option = "email = '" + userId + "' ORDER BY age ASC "
        elif chose_opt == 8:
            option = "email = '" + userId + "' ORDER BY age DESC "
        elif chose_opt == 9:
            option = "email = '" + userId + "' AND gender = 'Male' ORDER BY jid DESC "
        elif chose_opt == 10:
            option = "email = '" + userId + "' AND gender = 'Female' ORDER BY jid DESC "
        elif chose_opt == 11:
            option = "email = '" + userId + "' AND gender = 'None' ORDER BY jid DESC "
        elif chose_opt == 12:
            option = "email = '" + userId + "' AND radius = 1 ORDER BY jid DESC "
        elif chose_opt == 13:
            option = "email = '" + userId + "' AND styloid = 1 ORDER BY jid DESC "
        elif chose_opt == 14:
            option = "email = '" + userId + "' AND scaphoid = 1 ORDER BY jid DESC "
        elif chose_opt == 15:
            option = "email = '" + userId + "' AND radius = 1 AND styloid = 1 ORDER BY jid DESC "
        elif chose_opt == 16:
            option = "email = '" + userId + "' AND radius = 1 AND scaphoid = 1 ORDER BY jid DESC "
        elif chose_opt == 17:
            option = "email = '" + userId + "' AND styloid = 1 AND scaphoid = 1 ORDER BY jid DESC "
        elif chose_opt == 18:
            option = "email = '" + userId + "' AND radius = 1 AND styloid = 1 AND scaphoid = 1 ORDER BY jid DESC "
        ownrecord = db.executeAll(
            "SELECT SUBSTRING_INDEX(filename, '.', 1) as filename_print,filename, project_name, direction, age, gender FROM json_info WHERE "
            + option + " LIMIT " + str(
                start_article) + ", " + str(NumArticle) + ";")
        total_cnt = db.executeAll("SELECT COUNT(*) FROM json_info WHERE " + option + ";")

        pagination = Pagination(page=page, total=total_cnt[0][0], search=search, per_page=NumArticle, record_name='ownrecord', css_framework='bootstrap3')

        return render_template('select/sel_study.html', ownrecord=ownrecord, pagination=pagination)
    else:
        return render_template('error.html', error='Unauthorized Access')

# delete checked list in record page and user_info table of DB
@bp.route('/del_project', methods=['POST'])
def del_project():
    print('del project render')
    if request.method == 'POST':
        success = 1
        _userId = session['userID']

        for rid in request.json['deleteList']:
            if rid:
                dataDB = db.executeAll("SELECT project_name, project_type FROM user_info WHERE rid='"+rid+"';")
                project_name = dataDB[0][0].split(".")[0]
                # 해당 프로젝트의 폴더, 파일 삭제
                if os.path.isdir(BASE_DIR + "/statics/test_img/"+_userId+"/"+project_name):
                    shutil.rmtree(BASE_DIR + "/statics/test_img/"+_userId+"/"+project_name+"/")
                if os.path.isdir(BASE_DIR + "/statics/test_xml/"+_userId+"/"+project_name):
                    shutil.rmtree(BASE_DIR + "/statics/test_xml/"+_userId+"/"+project_name+"/")
                if os.path.isdir(BASE_DIR + "/statics/test_json/"+_userId+"/"+project_name):
                    shutil.rmtree(BASE_DIR + "/statics/test_json/"+_userId+"/"+project_name+"/")
                if os.path.exists(BASE_DIR + "/statics/test_json/"+_userId+"/"+dataDB[0][0]):
                    os.remove(BASE_DIR + "/statics/test_json/"+_userId+"/"+dataDB[0][0])
                # 해당 프로젝트 DB 삭제
                db.execute("DELETE FROM brain_info WHERE project_img = '" + project_name + "';")
                db.execute("DELETE FROM user_info WHERE rid = '" + rid + "';")
                db.commit()

        return json.dumps({'success': success}) # python 객체를 json 형태로 변환
    else:
        return render_template('error.html', error='Bad try to access')

@bp.route('/get_nii')
def get_nii():
    print('show password render')
    if session.get('user'):
        return render_template('select/sel_pro.html')
    else:
        return render_template('login/password.html')

# # checking dcm extension
# def dcm_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1] in bp.config['DCM_EXTENSIONS']
