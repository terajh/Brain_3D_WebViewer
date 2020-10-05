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

bp = Blueprint('file',__name__,url_prefix='/file',template_folder='templates')
