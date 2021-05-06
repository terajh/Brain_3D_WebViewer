from flaskext.mysql import MySQL
from contextlib import closing

mysql = MySQL()

class models:
    def __init__(self):
        self.db = mysql

    def connect(self, mysql):
        with closing(mysql.connect()) as con:
            with closing(con.cursor()) as cursor:
                return cursor

    def get_db(self):
        return self.db