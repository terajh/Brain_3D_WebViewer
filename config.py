db = {
    'user'     : 'root',		
    'password' : 'dkd352487',		
    'host'     : 'localhost',	
    'port'     : 3306,			
    'database' : 'crescom'		
}

DB_URL = f"mysql+mysqlconnector://{db['user']}:{db['password']}@{db['host']}:{db['port']}/{db['database']}?charset=utf8"