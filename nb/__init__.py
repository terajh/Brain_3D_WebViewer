# -*- coding: utf-8 -*-

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
import transform_to_xml
from datetime import datetime
from flaskext.mysql import MySQL
from contextlib import closing
from flask_bcrypt import Bcrypt
import distutils.core
import re
import json_seperator
import fill_json
import scipy, numpy, shutil, os, nibabel
import sys, getopt
import mxnet as mx
import imageio, base64
import pathlib
# change main path when copy to other device
#main_path = '/home/crescom01/Downloads/via_final/Labeling'
#os.chdir(main_path)
class NDArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, mx.nd.NDArray):
            return obj.asnumpy().tolist()
        return json.JSONEncoder.default(self, obj)

mysql = MySQL()

app = Flask(__name__, static_url_path="/statics", static_folder="statics")

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'dkd352487'
app.config['MYSQL_DATABASE_DB'] = 'crescom'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

bcrypt = Bcrypt(app)

app.config['UPLOAD_FOLDER'] = '../statics/test_img/'
app.config['UPLOAD_ROI'] = '../statics/roid/'
app.config['UPLOAD_TW3'] = '../statics/tw3_roi/'
app.config["CLIENT_IMAGES"] = '/home/ubuntu/Desktop/dev/Papaya-master/statics/test_img/'
# app.config['MODAL'] = './static/Uploads/'
app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'bmp'])
app.config['DCM_EXTENSIONS'] = set(['dcm'])
app.secret_key = 'why would I tell you my secret key?'



# checking image extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

@app.route('/get_image_data',methods=['GET'])
def get_image_data():
    print('get image data render')
    if request.method == 'GET':
        # print('##',request.args.get('file_names'))
        file_name = request.args.get('file_names')
        projec_name = request.args.get('projec_names')
        image_path = 'statics/test_img/'
        full_path = image_path+session['userID']+'/'+str(projec_name)+'/'+file_name
        # img = nibabel.load(full_path)
        # img_data = img.get_fdata()
        try:
            file = send_file(full_path, mimetype='application/octet-stream',as_attachment=True,  attachment_filename=file_name)
            print(type(file))
            return file
        except FileNotFoundError:
            abort(404)
    else:
        return json.dumps({"result": False})


# connect first or select page
@app.route('/')
def main():
    if session.get('user'):
        return redirect('/record')
    else:
        return render_template('login/login.html')

# checking login information under DB
@app.route('/validateLogin', methods=['POST'])
def validateLogin():
    print("validationlogin render")
    if request.method == 'POST':
        try:
            _username = request.form['inputEmail']
            _password = request.form['inputPassword']
            
            with closing(mysql.connect()) as con:
                with closing(con.cursor()) as cursor:
                    cursor.execute("SELECT * FROM member WHERE email = '" + _username + "';")
                    data = cursor.fetchall()
                    
                    if len(data) > 0:
                            if data[0][4] == 1:
                                
                                # if bcrypt.check_password_hash(str(data[0][3]), _password):
                                if str(data[0][3]==_password):
                                    session['user'] = data[0][2]
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
            print(e)
            return render_template('error.html', error=str(e))
    else:
        return render_template('error.html', error='Bad try to access')
# check email from DB when join
@app.route('/checkId', methods=['GET', 'POST'])
def checkId():
    print('checkId render')
    if request.method == 'POST':
        _checkEmail = request.json['dueId']

        with closing(mysql.connect()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute("SELECT COUNT(*) FROM member WHERE email = '" + str(_checkEmail) + "';")
                data = cursor.fetchall()
        return json.dumps(data[0][0])
    else:
        return render_template('error.html', error='Bad try to access')

# join member and add DB
@app.route('/signUp',methods=['POST','GET'])
def signUp():
    if request.method == 'POST':
        try:
            _name = request.form['inputName']
            _email = request.form['inputEmail']
            _password = request.form['inputPassword']
            _authorize = "1"
            now = datetime.now()
            _nowDatetime = now.strftime('%Y/%m/%d %H:%M:%S')
            if _name and _email and _password:
                with closing(mysql.connect()) as conn:
                    with closing(conn.cursor()) as cursor:
                        _hashed_password = bcrypt.generate_password_hash(_password).decode('utf-8')
                        cursor.execute("SELECT name FROM member WHERE email = '" + str(_email) + "';")
                        chkMem = cursor.fetchall()
                        if len(chkMem) == 0:
                            cursor.execute("INSERT INTO member(name, email, password, authorize, joinDate) VALUES('"+_name+"', '"+_email+"', '"+_hashed_password+"', '"+_authorize+"', '"+_nowDatetime+"');")
                            data = cursor.fetchall()
                            conn.commit()
                            content = "New boneage applyer name: " + _name + " and email: " + _email
                            # mail_apache(1, content, "nanjun1@naver.com")
                        return render_template('response.html', result='Success to join, please wait to receive authorision email')
            else:
                return render_template('error.html', error='Wrong and miss information for join')

        except Exception as e:
            return render_template('error.html', error='Try login. If not, join again please.')
    else:
        return render_template('error.html', error='Bad try to access')
# logout
@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')


#Select project
@app.route('/sel_project', methods=['GET'])
def sel_project():
    print('select project render')
    _userId = session['userID']

    filename = request.args.get('filename', type=str, default="None")
    print(filename)
    with open("./statics/test_json/" +_userId + "/" + filename, 'r') as json_file:
        js_file = json_file.readline()
    

    file = pathlib.Path("./statics/test_json/" +_userId + "/" + filename)
    file_text = file.read_text(encoding='utf-8')
    json_data = json.loads(file_text)

    _filenames = json_data['_via_img_metadata'][list(json_data['_via_img_metadata'].keys())[0]]['filename']



    fname = os.path.splitext("./statics/test_json/" + _userId + "/" +filename)
    fname = os.path.split(fname[0])
    _fname = fname[1] #확장자 없는 load할 파일명

    if len(filename.split("/")) == 1:    # select a fracture or kneeOA project (ex)project_20190809.json)
        with closing(mysql.connect()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute("SELECT project_type FROM user_info WHERE email = '" + session['user'] +"' and project_name = '" +str(_fname) +".json';")
                data = cursor.fetchall()
                print(data)
                direc = "./statics/test_img/" + _userId + "/" + filename.split(".")[0] + "/"

                if data[0][0] == 'Fracture':   # select a fracture project
                    first = 1
                elif data[0][0] == 'Knee OA':  # select a KneeOA project
                    first = 4
                elif data[0][0] == 'Brain': # select a Brain project
                    first = 6

    else:    # select a fracture or kneeOA image(ex)32_A1.json)
        direc = "./statics/test_img/" + _userId + "/" + filename.split("/")[0] + "/"
        first = 2
    

    if first == 5 or first == 6:
        return render_template('papaya3d.html', js_file=str(js_file), fname=_fname, direc=direc, first=first, proj='f', filedata = 'f')
    else : 
        return render_template('via2d.html', js_file=str(js_file), fname=_fname, direc=direc, first=first)

#Save project
@app.route('/save_project', methods=['POST'])
def save_project():
    print("save project render")
    if request.method == 'POST':
        project_content = request.json['_via_project']
        _filename = request.json['filename']
        _fname = _filename.split(".")[0]
        _first = request.json['_first']
        if _first == 0 or _first == 1:
            project_type = 'Fracture'
        elif _first == 3 or _first == 4:
            project_type = 'Knee OA'
        elif _first == 5 or _first == 6:
            project_type = 'Brain'
        _email = session['user']
        _project_name = _filename
        _date = datetime.now()
        _nowdate = _date.strftime('%Y-%m-%d %H:%M:%S')
        _userId = session['userID']
        _dic_img = "./statics/test_img/" + _userId + "/" + _fname + "/"
        _dic_xml = "./statics/test_xml/" + _userId + "/" + _fname + "/"
        _dic_json = "./statics/test_json/" + _userId + "/"
        _dic_sep_json = _dic_json + _fname + "/"

        _image_filename_list = request.json['_via_image_filename_list'] # 해당 프로젝트에 저장되는 이미지 리스트

        if not os.path.isdir("./statics/test_xml/" + _userId + "/"):
            os.mkdir("./statics/test_xml/" + _userId + "/")

        if not os.path.isdir(_dic_xml):
            os.mkdir(_dic_xml)
        if not os.path.isdir(_dic_json):
            os.mkdir(_dic_json)
        if not os.path.isdir(_dic_sep_json):
            os.mkdir(_dic_sep_json)

        # update project on DB
        with closing(mysql.connect()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute("SELECT project_name FROM user_info WHERE email = '" + session['user'] + "';")
                data = cursor.fetchall()

                dataDB = []
                for x in data:
                    dataDB.append(x[0])
                if len(data) != 0:
                    if str(_filename) in dataDB:
                        if _first == 0 or _first == 3:  #새 프로젝트에서 중복된 프로젝트명으로 저장하려고 할 때 project_save_confirmed(input)(via2d.html)로 false 전송
                            return json.dumps({"result": False})
                        else:
                            cursor.execute(  # 기존 프로젝트를 로드해서 수정할 때
                                "UPDATE user_info SET date = '" + _nowdate + "' WHERE project_name = '" + _filename + "';")
                            data = cursor.fetchall()
                            conn.commit()
                    else:
                        cursor.execute(    #기존에 프로젝트를 생성한 적 있던 사용자가 새 프로젝트를 만들 때
                            "INSERT INTO user_info(email, project_name, project_type, date) VALUES('" + _email + "', '" + _project_name + "','" + project_type + "','"+ _nowdate + "');")
                        data = cursor.fetchall()
                        conn.commit()
                else:
                    cursor.execute(   #사용자가 첫 프로젝트를 생성할 때
                        "INSERT INTO user_info(email, project_name, project_type, date) VALUES('" + _email + "', '" + _project_name + "','" + project_type + "','"+ _nowdate + "');")
                    data = cursor.fetchall()
                    conn.commit()

                # temp_img => test_img
                if os.path.isdir("./statics/temp_img/" + _userId):
                    filenames = os.listdir("./statics/temp_img/" + _userId + "/")
                    for filename in filenames:
                        if filename not in _image_filename_list:  # test_img 폴더에 복사해야하는 이미지 외 다른 이미지가 존재할 시 삭제
                            os.remove("./statics/temp_img/"+_userId+"/"+filename)
                    distutils.dir_util._path_created = {}
                    distutils.dir_util.copy_tree("./statics/temp_img/" + _userId + "/", _dic_img)
                    shutil.rmtree("./statics/temp_img/" + _userId + "/")

                # test_img 내 파일목록
                _filenames = os.listdir("./statics/test_img/" + _userId + "/" + _fname)

                # 기존 age, gender list 생성
                _db_age_list = []
                _db_gender_list = []
                # 기존 radius, styloid, scaphoid list 생성
                _db_radius_list = []
                _db_styloid_list = []
                _db_scaphoid_list = []

                # fracture 프로젝트 저장시
                if project_type == 'Fracture':
                    # modified
                    # 기존 DB에 저장된 study, age, gender, radius, styloid, scaphoid 값 load -> fill_json에 넘겨줄 것
                    cursor.execute("SELECT study_num, age, gender, radius, styloid, scaphoid FROM json_info WHERE email = '" + session[
                        'user'] + "' AND project_name = '" + _project_name.split('.')[0] + "';")
                    study_data = cursor.fetchall()

                    for idx, data in enumerate(study_data):
                        _db_age_list.append([data[0], data[1]])
                        _db_gender_list.append([data[0], data[2]])
                        _db_radius_list.append([data[0], data[3]])
                        _db_styloid_list.append([data[0], data[4]])
                        _db_scaphoid_list.append([data[0], data[5]])

                # knee oa 프로젝트 저장시
                elif project_type == "Knee OA":
                    cursor.execute("SELECT img_name, age, gender FROM kl_info WHERE email = '" + session[
                        'user'] + "' AND project_img = '" + _project_name.split('.')[0] + "';")
                    study_data = cursor.fetchall()
                    for idx, data in enumerate(study_data):
                        _study_num=data[0].split(".")[0][0:5]
                        _db_age_list.append([_study_num, data[1]])
                        _db_gender_list.append([_study_num, data[2]])
                # brain 프로젝트 저장시
                else:
                    cursor.execute("SELECT img_name, age, gender FROM brain_info WHERE email = '" + session[
                        'user'] + "' AND project_img = '" + _project_name.split('.')[0] + "';")
                    study_data = cursor.fetchall()
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

                        # save fracture project on DB
                        if project_type == 'Fracture':
                            _db_region_list=[]
                            # 먼저 fx_region의 각각 항목들을 default값으로 setting : 0(false)
                            _radius = 0
                            _styloid = 0
                            _scaphoid = 0

                            cursor.execute("SELECT * FROM json_info WHERE email = '" + session[
                                'user'] + "' AND project_name = '" + _sep_project_name + "' AND filename = '" + json_name + "';")
                            json_data = cursor.fetchall()

                            # 기존 data가 없을 때
                            if len(json_data) == 0:
                                print('기존 데이터가 없습니다.')
                                cursor.execute(
                                    "INSERT INTO json_info(email, filename, project_name, study_num, direction, age, gender, filesize, radius, styloid, scaphoid) VALUES('"
                                    + _email + "', '" + json_name + "', '" + str(_sep_project_name) + "', '" + str(_studynum) + "', '" + str(_direction) + "', '" + str(_age)
                                    + "', '" + str(_gender) + "', '" + str(_filesize) + "', '" + str(_radius) + "', '" + str(_styloid) + "', '" + str(_scaphoid) + "');")
                                json_data = cursor.fetchall()
                                conn.commit()
                            else:
                                cursor.execute("UPDATE json_info SET study_num = '" + str(_studynum) +
                                               "', direction = '" + _direction + "', age = '" + str(_age) + "', gender = '" +
                                               _gender + "', filesize = '" + str(_filesize) + "', radius = '" + str(_radius) + "', styloid = '" + str(_styloid)
                                               + "', scaphoid = '" + str(_scaphoid) + "' WHERE email = '" + session['user'] + "' AND project_name = '"
                                               + str(_sep_project_name) + "' AND filename = '" + str(json_name) + "';")
                                json_data = cursor.fetchall()
                                conn.commit()

                        # save KneeOA project on DB
                        elif project_type == 'Knee OA':
                            print( project_content['_via_img_metadata'][img])
                            _kl = project_content['_via_img_metadata'][img]['file_attributes']['KL-grade']
                            _sc = project_content['_via_img_metadata'][img]['file_attributes']['Sclerosis']
                            _jsw = project_content['_via_img_metadata'][img]['file_attributes']['Joint Space Width']

                            cursor.execute("SELECT * FROM kl_info WHERE email = '" + session[
                                'user'] + "' AND project_img = '" + _sep_project_name + "' AND img_name = '" + json_name + "';")
                            json_data = cursor.fetchall()

                            # 기존 data가 없을 때
                            if len(json_data) == 0:
                                cursor.execute(
                                    "INSERT INTO kl_info(email, img_name, project_img, KL_grade, sclerosis, jsw, age, gender) VALUES('" + _email + "', '" + json_name + "', '" + str(_sep_project_name) + "', '" + str(_kl) + "', '" + str(_sc) + "', '" + str(_jsw) + "', '" + str(_age) + "', '" + str(_gender) + "');")
                                json_data = cursor.fetchall()
                                conn.commit()
                            else:
                                cursor.execute("UPDATE kl_info SET KL_grade = '" + _kl + "', sclerosis = '" + _sc + "', jsw = '" + _jsw + "', age = '" + str(
                                    _age) + "', gender = '" + _gender + "' WHERE email = '" + session['user'] + "' AND project_img = '" + str(
                                    _sep_project_name) + "' AND img_name = '" + str(json_name) + "';")
                                json_data = cursor.fetchall()
                                conn.commit()
                        # save brain project on DB
                        else:
                            print(project_content['_via_img_metadata'])
                            cursor.execute("SELECT * FROM brain_info WHERE email = '" + session[
                                'user'] + "' AND project_img = '" + _sep_project_name + "' AND img_name = '" + json_name + "';")
                            json_data = cursor.fetchall()

                            # 기존 data가 없을 때
                            if len(json_data) == 0:
                                cursor.execute(
                                    "INSERT INTO brain_info(email, img_name, project_img, age, gender) VALUES('" + _email + "', '" + json_name + "', '" + str(_sep_project_name) + "', '" + str(_age) + "', '" + str(_gender) + "');")
                                json_data = cursor.fetchall()
                                conn.commit()
                            else:
                                cursor.execute("UPDATE brain_info SET" + " age = '" + str(_age) + "', gender = '" + str(_gender) + "' WHERE email = '" + session['user'] + "' AND project_img = '" + str(_sep_project_name) + "' AND img_name = '" + str(json_name) + "';")
                                json_data = cursor.fetchall()
                                conn.commit()


                # 이미지 리스트에서 삭제한 이미지에 대한 DB와 서버에 있는 파일들을 삭제 (DB 삭제전 서버파일 먼저 삭제시 오류 발생)
                for filename in _filenames:
                    if filename not in _image_filename_list:
                        if project_type == 'Fracture':
                            cursor.execute("DELETE FROM json_info WHERE project_name= '"+_fname+"' AND filename LIKE '" + filename.split(".")[0] + ".json';")
                        elif project_type == 'Knee OA':
                            cursor.execute("DELETE FROM kl_info WHERE project_img='"+_fname+"' AND img_name LIKE '" + filename.split(".")[0] + ".json';")
                        else:
                            cursor.execute("DELETE FROM brain_info WHERE project_img='"+_fname+"' AND img_name LIKE '" + filename.split(".")[0] + ".json';")

                        json_data = cursor.fetchall()
                        conn.commit()
                        os.remove("./statics/test_img/" + _userId + "/" + _fname + "/" + filename)
                        os.remove("./statics/test_json/" + _userId + "/" + _fname + "/" + filename.split(".")[0] + ".json")
                        os.remove("./statics/test_xml/" + _userId + "/" + _fname + "/" + filename.split(".")[0] + ".xml")

        return json.dumps({"result": True})
    else:
        return json.dumps({"result": False})

@app.route('/new_project', methods=['GET'])
def new_project():
    print('new project render')
    first = request.args.get('first', type=int, default=0)   #new 'fracture' project -> first=0, new 'kneeOA' project -> first=3
    _userId = session['userID']
    _date = datetime.now()
    _nowdate = _date.strftime('%Y%m%d%H%M')
    _fname = "project_"+_nowdate
    print(first, _fname)
    direc = "./statics/test_img/" + _userId + "/" + _fname + "/"
    if first == 5:
        return render_template('papaya3d.html', fname=_fname, direc=direc, first=first, proj='f', filedata = 'f')
    else : 
        return render_template('via2d.html', fname=_fname, direc=direc, first=first)

                

#upload images to server
@app.route('/upload_img', methods=['POST'])
def upload_img():
    print("upload img render")
    if request.method == 'POST':
        img_files = request.files.getlist('files[]')

        #잘못된 규칙의 파일명 upload시 temp_img 폴더에 저장되는것 방지
        wrong_list = request.form['_via_wrong_img_list[]']
        wrong_list = wrong_list.split(',')
        if not os.path.isdir("./statics/temp_img/"+session['userID']+"/"):
            os.mkdir("./statics/temp_img/"+session['userID'])

        for file in img_files:
            filename = secure_filename(file.filename)
            if filename not in wrong_list:
                file.save("./statics/temp_img/"+session['userID']+"/"+filename) # 유저마다의 파일에 저장된다.

        return json.dumps({"result": True})

    else:
        return json.dumps({"result": False})

# connect sel_pro02 page and UX
@app.route('/record', methods=['GET', 'POST'])
def record():
    if session.get('user'):
        userId = session['user']
        _userId = userId.split("@")[0]
        NumArticle = 10
        search = False

        with closing(mysql.connect()) as con:
            with closing(con.cursor()) as cursor:
                page = request.args.get(get_page_parameter(), type=int, default=1)
                start_article = (page - 1) * NumArticle
                cursor.execute("SELECT SUBSTRING_INDEX(project_name, '.', 1) as project_name_print, rid, project_name, project_type, date FROM user_info WHERE email = '" + str(
                    userId) + "' ORDER BY rid DESC" + " LIMIT " + str(
                    start_article) + ", " + str(NumArticle) + ";")
                ownrecord = cursor.fetchall()

                # get DB list from selected option in history page

                cursor.execute("SELECT COUNT(*) FROM user_info WHERE email = '" + str(userId) + "';")
                total_cnt = cursor.fetchall()

        pagination = Pagination(page=page, total=total_cnt[0][0], search=search, per_page=NumArticle,
                                record_name='ownrecord', css_framework='bootstrap3')
        return render_template('select/sel_pro.html', ownrecord=ownrecord, pagination=pagination)
    else:
        return render_template('error.html', error='Unauthorized Access')

# connect sel_study01 page and UX
@app.route('/study_record', methods=['GET', 'POST'])
def study_record():
    print('study record render')
    if session.get('user'):
        userId = session['user']
        _userId = userId.split('@')[0]
        NumArticle = 10
        search = False

        chose_opt = request.args.get('chose_opt', type=int, default=1)
        with closing(mysql.connect()) as conn:
            with closing(conn.cursor()) as cursor:

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
                cursor.execute(
                    "SELECT SUBSTRING_INDEX(filename, '.', 1) as filename_print,filename, project_name, direction, age, gender FROM json_info WHERE "
                    + option + " LIMIT " + str(
                        start_article) + ", " + str(NumArticle) + ";")
                ownrecord = cursor.fetchall()
                cursor.execute("SELECT COUNT(*) FROM json_info WHERE " + option + ";")
                total_cnt = cursor.fetchall()

        pagination = Pagination(page=page, total=total_cnt[0][0], search=search, per_page=NumArticle, record_name='ownrecord', css_framework='bootstrap3')

        return render_template('select/sel_study.html', ownrecord=ownrecord, pagination=pagination)
    else:
        return render_template('error.html', error='Unauthorized Access')

# connect sel_KL page and UX
@app.route('/knee_record', methods=['GET', 'POST'])
def knee_record():
    print('knee record render')
    if session.get('user'):
        userId = session['user']
        _userId = userId.split('@')[0]
        NumArticle = 10
        search = False

        chose_opt = request.args.get('chose_opt', type=int, default=1)

        with closing(mysql.connect()) as conn:
            with closing(conn.cursor()) as cursor:

                page = request.args.get(get_page_parameter(), type=int, default=1)
                start_article = (page - 1) * NumArticle

                if chose_opt == 1:
                    option = "email = '" + userId + "' ORDER BY kid DESC "
                elif chose_opt == 2:
                    option = "email = '" + userId + "' ORDER BY project_img ASC, img_name ASC "
                elif chose_opt == 3:
                    option = "email = '" + userId + "' ORDER BY project_img DESC, img_name ASC "
                elif chose_opt == 14:
                    option = "email = '" + userId + "' AND KL_grade = 'None' ORDER BY kid DESC "
                elif chose_opt == 4:
                    option = "email = '" + userId + "' AND KL_grade = 'KL-0' ORDER BY kid DESC "
                elif chose_opt == 5:
                    option = "email = '" + userId + "' AND KL_grade = 'KL-1' ORDER BY kid DESC "
                elif chose_opt == 6:
                    option = "email = '" + userId + "' AND KL_grade = 'KL-2' ORDER BY kid DESC "
                elif chose_opt == 7:
                    option = "email = '" + userId + "' AND KL_grade = 'KL-3' ORDER BY kid DESC "
                elif chose_opt == 8:
                    option = "email = '" + userId + "' AND KL_grade = 'KL-4' ORDER BY kid DESC "
                elif chose_opt == 9:
                    option = "email = '" + userId + "' ORDER BY age ASC "
                elif chose_opt == 10:
                    option = "email = '" + userId + "' ORDER BY age DESC "
                elif chose_opt == 11:
                    option = "email = '" + userId + "' AND gender = 'Male' ORDER BY kid DESC "
                elif chose_opt == 12:
                    option = "email = '" + userId + "' AND gender = 'Female' ORDER BY kid DESC "
                elif chose_opt == 13:
                    option = "email = '" + userId + "' AND gender = 'None' ORDER BY kid DESC "

                cursor.execute(
                    "SELECT SUBSTRING_INDEX(img_name, '.', 1) as img_name_print, img_name, project_img, KL_grade, sclerosis, jsw, age, gender FROM kl_info WHERE " + option + " LIMIT " + str(
                        start_article) + ", " + str(NumArticle) + ";")
                ownrecord = cursor.fetchall()

                cursor.execute("SELECT COUNT(*) FROM kl_info WHERE " + option + ";")
                total_cnt = cursor.fetchall()

        pagination = Pagination(page=page, total=total_cnt[0][0], search=search, per_page=NumArticle,
                                record_name='ownrecord', css_framework='bootstrap3')

        return render_template('select/sel_KL.html', ownrecord=ownrecord, pagination=pagination)
    else:
        return render_template('error.html', error='Unauthorized Access')

# delete checked list in record page and user_info table of DB
@app.route('/del_project', methods=['POST'])
def del_project():
    print('del project render')
    if request.method == 'POST':
        success = 1
        _userId = session['userID']

        for rid in request.json['deleteList']:
            if rid:
                with closing(mysql.connect()) as conn:
                    with closing(conn.cursor()) as cursor:
                        cursor.execute("SELECT project_name, project_type FROM user_info WHERE rid='"+rid+"';")
                        dataDB = cursor.fetchall()
                        project_name = dataDB[0][0].split(".")[0]
                        # 해당 프로젝트의 폴더, 파일 삭제
                        if os.path.isdir("./statics/test_img/"+_userId+"/"+project_name):
                            shutil.rmtree("./statics/test_img/"+_userId+"/"+project_name+"/")
                        if os.path.isdir("./statics/test_xml/"+_userId+"/"+project_name):
                            shutil.rmtree("./statics/test_xml/"+_userId+"/"+project_name+"/")
                        if os.path.isdir("./statics/test_json/"+_userId+"/"+project_name):
                            shutil.rmtree("./statics/test_json/"+_userId+"/"+project_name+"/")
                        if os.path.exists("./statics/test_json/"+_userId+"/"+dataDB[0][0]):
                            os.remove("./statics/test_json/"+_userId+"/"+dataDB[0][0])
                        # 해당 프로젝트 DB 삭제
                        if dataDB[0][1] == 'Fracture':
                            cursor.execute("DELETE FROM json_info WHERE project_name = '" + project_name + "';")
                        else:
                            cursor.execute("DELETE FROM kl_info WHERE project_img = '" + project_name + "';")
                        cursor.execute("DELETE FROM user_info WHERE rid = '" + rid + "';")
                        data = cursor.fetchall()
                        conn.commit()

        return json.dumps({'success': success}) # python 객체를 json 형태로 변환
    else:
        return render_template('error.html', error='Bad try to access')

# connect join page
@app.route('/showSignUp')
def showSignUp():
    print('show sign up render')
    if session.get('user'):
        return render_template('select/sel_pro.html')
    else:
        return render_template('login/join.html')

# connect to find password page
@app.route('/showPassword')
def showPassword():
    print('show password render')
    if session.get('user'):
        return render_template('select/sel_pro.html')
    else:
        return render_template('login/password.html')

@app.route('/get_nii')
def get_nii():
    print('show password render')
    if session.get('user'):
        return render_template('select/sel_pro.html')
    else:
        return render_template('login/password.html')

# checking dcm extension
def dcm_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['DCM_EXTENSIONS']

if __name__ == "__main__":
    # app.run(host='59.13.125.147', port=29188)
    app.run(debug=True)
