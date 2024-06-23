from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import time
import random


import os

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SECRET_KEY'] = 'secret123'
    app.config['JWT_SECRET_KEY'] = 'secret1234'

    CORS(
        app,
        resources={r"*": {"origins": ["*"]}},
        allow_headers=["Authorization", "Content-Type","app-version"],
        methods=["GET", "POST", "OPTIONS"],
        supports_credentials=True,
        max_age=86400
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return jsonify({'status': 200})

    @app.route('/register', methods=['POST'])
    def register():
        if version_check(request):
            return jsonify({'message': 'Invalid version'}), 200
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(
            data['password']).decode('utf-8')
        new_user = User(username=data['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully', 'status':201}), 201

    def version_check(data):
        version = request.headers['App-Version']
        version_parts = version.split('.')
        target_version = '1.2.0'
        target_parts = target_version.split('.')
        
        for i in range(min(len(version_parts), len(target_parts))):
            if int(version_parts[i]) < int(target_parts[i]):
                return True
            elif int(version_parts[i]) > int(target_parts[i]):
                return False
        return False


    @app.route('/login', methods=['POST'])
    def login():
        if version_check(request):
            return jsonify({'message': 'Invalid version'}), 200
        data = request.get_json()
        user = User.query.filter_by(username=data["username"]).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(
                identity={'username': user.username})
            return jsonify({'token': access_token}), 200
        return jsonify({'message': 'Invalid credentials'}), 401
    
    @app.route('/logout', methods=['GET'])
    def logout():
        if version_check(request):
            return jsonify({'message': 'Invalid version'}), 200
        # Maybe add a blacklist? 
        #https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens
        return jsonify({'message': 'logout successful', 'status':200}), 200

    @app.route('/user', methods=['GET'])
    @jwt_required()
    def user():
        if version_check(request):
            return jsonify({'message': 'Invalid version'}), 200
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user['username']).first()
        if user:
            user_info = {
                'username': user.username,
                'id': user.id,
                'motto': user.motto
            }
            return user_info, 200
        else:
            return jsonify({'message': 'invalid login'}), 404
    

    @app.route('/upload',methods=['POST'])
    def upload():
        data = request.files['audio']
        username = request.form['username']
        transcript = transcribe_audio(data)
        user = User.query.filter_by(username=username).first()
        user.motto = transcript
        db.session.commit()
        return jsonify({'data':transcript}), 200
        
    def transcribe_audio(data):
        # Simulate transcript
        delay = random.randint(1,2) # 5 to 15 is too long
        time.sleep(delay)  
        transcript = "Sample motto"
        return transcript
    

    return app






class User(db.Model):# 
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    motto = db.Column(db.String(500), nullable=True)


if __name__ == '__main__':
    app = create_app()
    app.run(port=3002, debug=True)
