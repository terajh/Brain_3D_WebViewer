import pymysql
from .config import db

class Database():
    def __init__(self):
        # self.db = pymysql.connect(host='localhost',
        #                         user='root',
        #                         password='dkd352487',
        #                         db='crescom',
        #                         charset='utf8')
        self.db = pymysql.connect(db['host'],
                                db['user'],
                                db['password'],
                                db['database'],
                                charset='utf8')
        self.cursor = self.db.cursor(pymysql.cursors.DictCursor)
    
    def execute(self, query, args={}):
        self.cursor.execute(query, args)

    def executeOne(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.corsor.fetchone()
        return row
    
    def executeAll(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchall()
        return row

    def commit(self):
        self.db.commit()

