from flask import Flask, render_template
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

import config

db=SQLAlchemy()
migrate = Migrate()

# create_app 함수 내에서 선언하면 다른 모듈에서 import 할 수 없다.
# 따라서 함수 밖에서 생성하고 실제 객체 초기화는 create_app 에서
# 수행하는 패턴 사용.

def create_app(): # 플라스크의 어플리케이션 팩토리
    app = Flask(__name__, static_url_path="/statics", static_folder="statics")
    app.config.from_object(config)
    bcrypt = Bcrypt(app)
    app.config['UPLOAD_FOLDER'] = './statics/test_img/'
    app.config['UPLOAD_ROI'] = './statics/roid/'
    app.config['UPLOAD_TW3'] = './statics/tw3_roi/'
    app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'bmp'])
    app.config['DCM_EXTENSIONS'] = set(['dcm'])
    app.secret_key = 'why would I tell you my secret key?'

    # config.py 에 작성한 항목들을 app.config 환경변수로
    # 읽어드린다.

    # ORM
    db.init_app(app)
    migrate.init_app(app, db)

    from .views import labeling_view, login_view, select_view
    app.register_blueprint(login_view.bp)
    # main_views.py 파일에서 생성한 블루프린트 객체를 bp에 등록
    app.register_blueprint(labeling_view.bp)
    app.register_blueprint(select_view.bp)

    return app