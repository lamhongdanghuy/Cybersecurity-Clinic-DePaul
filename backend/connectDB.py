import os
from sshtunnel import SSHTunnelForwarder
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
import paramiko
import pandas as pd

class DatabaseConnection:
    def __init__(self):
        self.ssh_host = '18.216.233.27'
        self.ssh_username = 'ubuntu'
        self.ssh_password = None
        self.ssh_port = 22
        self.db_port = 3306
        self.db_username = 'Admin'
        self.db_password = 'Hhe^3828jsu37s92j'
        self.db_name = 'CyberSecurity'
        self.localhost = '127.0.0.1'

    def get_pem(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        self.filename = os.path.join(parent_dir, 'DePaul-Guardian-Clinic.pem')
        return self.filename
        
    def create_tunnel(self):
        filename = self.get_pem()
        mypkey = paramiko.RSAKey.from_private_key_file(filename, password= None)
        self.tunnel = SSHTunnelForwarder((self.ssh_host, self.ssh_port), ssh_username=self.ssh_username, ssh_pkey=mypkey, remote_bind_address=(self.localhost, self.db_port))
        self.tunnel.start()

    def close_tunnel(self):
        self.tunnel.close()

    def generate_engine(self):
        self.local_bind_port = int(self.tunnel.local_bind_port)
        self.engine = create_engine(f'mysql+pymysql://{self.db_username}:{self.db_password}@{self.localhost}:{self.local_bind_port}/{self.db_name}')
        self.Session = sessionmaker(bind=self.engine)

    def start_connection(self):
        self.create_tunnel()
        self.generate_engine()
        self.session = self.Session()
        
    def select_query(self, query):
        self.start_connection()
        data = pd.read_sql_query(query, self.engine)
        self.close_tunnel()
        return data
    
    def insert_query(self, query):
        self.start_connection()
        self.session.execute(text(query))
        self.session.commit()
        self.session.close()
        self.end_connection() 
    
    def end_connection(self):
        self.session.commit()
        self.session.close()
        self.close_tunnel()
