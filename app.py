#!/usr/bin/env python3

# Imports - Pulled from WorkSession 8
import sys
import os
import json
from flask import Flask, jsonify, abort, request, make_response, session
from flask_restful import reqparse, Resource, Api
from flask_session import Session

from ldap3 import Server, Connection, ALL
from ldap3.core.exceptions import *
import ssl #include ssl libraries

import settings # Our server and db settings, stored in settings.py

import db_utils as db

####################################################################################
# Set Up Flask Object
#
flask = Flask(__name__)

# Set Server-side session config: Save sessions in the local app directory.
flask.secret_key = settings.SECRET_KEY
flask.config['SESSION_TYPE'] = 'filesystem'
flask.config['SESSION_COOKIE_NAME'] = 'peanutButter'
flask.config['SESSION_COOKIE_DOMAIN'] = settings.APP_HOST

Session(flask)

####################################################################################
# Error handlers
#
@flask.errorhandler(400) # decorators to add to 400 response
def not_found(error):
	return make_response(jsonify( { 'status': 'Bad request' } ), 400)

@flask.errorhandler(404) # decorators to add to 404 response
def not_found(error):
	return make_response(jsonify( { 'status': 'Resource not found' } ), 404)

@flask.errorhandler(500) # decorators to add to 500 response
def not_found(error):
	return make_response(jsonify( { 'status': 'Internal server error' } ), 500)


####################################################################################
# Static Endpoints
#
class Root(Resource):
	def get(self):
		return flask.send_static_file('index.html')

class API(Resource):
	def get(self):
		return flask.send_static_file('dev.html')

####################################################################################
# Ease of access methods
#
def auth():
	if 'username' in session:
		username = session['username']
		return True
	else:
		return False

####################################################################################
# Flask-Session endpoint declarations
####################################################################################
#
# Userlogin: #/user/login  
# 	POST Logs user into the system
# 	GET Checks if user is logged into the system   
# 	DELETE Logs out current logged in user session
#
class UserLogin(Resource):
	
	def post(self):
	# POST: Set Session and return Cookie
	# 
		if not request.json:
			abort(400) # bad request

		# Parse the json
		parser = reqparse.RequestParser()
		try:
 			# Check for required attributes in json document, create a dictionary
			parser.add_argument('username', type=str, required=True)
			parser.add_argument('password', type=str, required=True)
			request_params = parser.parse_args()
		except:
			abort(400) # bad request

		if request_params['username'] in session: # If the user is logged in
			response = {'status': 'success'}
			responseCode = 200
		else:
			try:
				ldapServer = Server(host=settings.LDAP_HOST)
				ldapConnection = Connection(ldapServer,
					raise_exceptions=True,
					user='uid='+request_params['username']+', ou=People,ou=fcs,o=unb',
					password = request_params['password'])
				ldapConnection.open()
				ldapConnection.start_tls()
				ldapConnection.bind()
				
				# At this point we have sucessfully authenticated.
				# DB Connection 
				
				session['username'] = request_params['username']
				print(session)
				result = db.getOrCreateUser(session['username'])
				
				response = {'status': 'success', 'user': result }
				responseCode = 201
			except LDAPException:
				response = {'status': 'Access denied'}
				responseCode = 403
			finally:
				ldapConnection.unbind()

		return make_response(jsonify(response), responseCode)
  
	def get(self):
	# GET: Check Cookie data with Session data
	#
		if auth():
			username = session['username']
			response = {'status': 'success'}
			responseCode = 200
		else:
			response = {'status': 'fail'}
			responseCode = 403

		return make_response(jsonify(response), responseCode)
	
	def delete(self):
	# DELETE: Clear session
	#
		if 'username' in session:
			session.clear()
			response = {'status': 'success'}
			responseCode = 204
		else:
			response = {'status': 'fail'}
			responseCode = 403

		return make_response(jsonify(response), responseCode)
# end UserLogin
####################################################################################
#
# User: #/user/<userID> 
# 	GET Gets a user profile
#	PUT Updates a user profile
#
class User(Resource):
	
	def get(self, userID):
	# GET: Gets a user profile
		try:
			user = db.getUser(userID)
		except Exception as e:
			print(f'Error executing Get User: {e}')
			abort(500)
		
		if user:
			return make_response(jsonify(user), 200) 	
		else:
			response = "{'status': 'fail'}"
			responseCode = 404
			return make_response(jsonify(response), responseCode) 	

	def put(self, userID):
		if not auth():
			response = {'status': 'fail'}
			responseCode = 403
			return make_response(jsonify(response), responseCode)

		if not request.json:
			abort(404) # bad request
		
		parser = reqparse.RequestParser()
		try:
 			# Check for required attributes in json document, create a dictionary
			parser.add_argument('userId', type=int, required=False)
			parser.add_argument('userName', type=str, required=False)
			parser.add_argument('displayName', type=str, required=False)
			parser.add_argument('intro', type=str, required=False)
			parser.add_argument('media_id', type=int, required=False)
			request_params = parser.parse_args()
		except:
			abort(400) # bad request
		
		user = db.userFormat(request_params)
		
		if user['userName'] != session['username']:
			response = {'status': 'You dont hae the permission to update the requested resource, username is not in current Session.'}
			responseCode = 403
			return make_response(jsonify(response), responseCode)
			

		response = db.updateUser(user)
		return make_response(jsonify("{'status': 'Success'}"), 200) 
#end User
####################################################################################
#
# User: #/users
# 	GET Gets a list of all users
#
class Users(Resource):
	
	def get(self):
	# GET: Gets a user profile
			result = db.getAllUsers()
			response = {"status": "success", "users": result}
			return make_response(jsonify(response), 200) 

#end Users
####################################################################################
#
# Portfolio: #/portfolio/<string:userID>
# 	GET Gets a user portfolio
#	PUT Updates a user portfolio
#	POST Creates a user portfolio
#
class Portfolios(Resource):
	def get(self, userID):
		try:
			result = db.getPortfolio(userID)
			print(result)
			response = {'status': 'success', 'portfolios': result }
			return make_response(jsonify(response), 200)
		except:
			return make_response(jsonify("{'status': 'fail'}"), 500) 

	def post(self, userID):
		if not request.json:
			abort(404) # bad request

		if not auth():
			response = {'status': 'fail'}
			responseCode = 403
			return make_response(jsonify(response), responseCode)

		parser = reqparse.RequestParser()
		try:
			parser.add_argument('title', type=str, required=True)
			request_params = parser.parse_args()
			#print(request_params)
			print(userID)
			result = db.addPortfolio(userID, request_params['title'])
		except:
			abort(500)
		return make_response(jsonify(result), 200)
	
	def put(self, userID):
		if not request.json:
			abort(404) # bad request

		if not auth():
			response = {'status': 'fail'}
			responseCode = 403
			return make_response(jsonify(response), responseCode)


		parser = reqparse.RequestParser()
		try:
			parser.add_argument('portfolioId', type=int, required=True)
			parser.add_argument('title', type=str, required=True)
			request_params = parser.parse_args()
			
			result = db.updatePortfolio(userID, request_params['portfolioId'], request_params['title'])
		except:
			abort(500)
		
		response = {'status': 'success', 'stuff': result }
		return make_response(jsonify(result), 200)

# Portfolio: #/portfolio/<string:userID>/<string:portfolioId>
# 	DELETE delete a user portfolio
class Portfolio(Resource):
	def delete(self, userID, portfolioId):
		if not auth():
			response = {'status': 'fail'}
			responseCode = 403
			return make_response(jsonify(response), responseCode)

		try:
			#print(request_params)
			result = db.deletePortfolio(userID, portfolioId)
		except:
			abort(500)
		return make_response(jsonify(result), 200)
		
#end Portfolio
####################################################################################
#
# SubPortfolio: #/portfolio/<string:userID>/subportfolio
# 	GET Gets a user subportfolio
#	PUT Updates a user subportfolio
#	POST Creates a user subportfolio
#	DELETE deletes a user subportfolio
#
class SubPortfolios(Resource):
	def post(self, userID, portfolioId):
		# if not request.json:
		# 	abort(404) # bad request
		
		parser = reqparse.RequestParser()
		try:
 			# Check for required attributes in json document, create a dictionary
			parser.add_argument('title', type=str, required=True)
			parser.add_argument('content', type=str, required=True)
			
			request_params = parser.parse_args()
			print(request_params)
			response = db.addSubPortfolio(portfolioId, request_params['title'], request_params['content'])
		except:
			abort(400) # bad request

		return make_response(jsonify(response), 200)

	def put(self, userID, portfolioId):
		# if not request.json:
		# 	abort(404) # bad request

		if not auth():
			response = {'status': 'fail'}
			responseCode = 403
			return make_response(jsonify(response), responseCode)
		
		parser = reqparse.RequestParser()
		try:
 			# Check for required attributes in json document, create a dictionary
			parser.add_argument('subEntryId', type=str, required=True)
			parser.add_argument('title', type=str, required=True)
			parser.add_argument('content', type=str, required=True)
			parser.add_argument('media_src', type=int, required=False)
			request_params = parser.parse_args()
			print(request_params)
			response = db.updateSubPortfolio(request_params['subEntryId'], request_params['title'], request_params['content'], request_params['media_src'])
		except:
			abort(400) # bad request

		return make_response(jsonify(response), 200)

	def get(self, userID, portfolioId):	
		# if not request.json:
		# 	abort(404) # bad request

		try:
			result = db.getSubPortfolios(portfolioId)
		except:
			abort(500)
		response = {'status': 'success', 'subPortfolios': result }
		return make_response(jsonify(response), 200)
		
class SubPortfolio(Resource):
	def delete(self, userID, portfolioId, subEntryId):
		if not request.json:
			abort(404) # bad request

		if not auth():
			response = {'status': 'fail'}
			responseCode = 403
			return make_response(jsonify(response), responseCode)

		try:
			#print(request_params)
			result = db.deleteSubPortfolio(subEntryId)
		except:
			abort(500)
		return make_response(jsonify(result), 200)
####################################################################################
#
# Create API Object
api = Api(flask)
api.add_resource(Root,'/')
api.add_resource(API,'/dev')
api.add_resource(UserLogin, '/user/login')
api.add_resource(User, '/user/<string:userID>') 
api.add_resource(Users, '/users')

api.add_resource(Portfolios, '/portfolio/<string:userID>')
api.add_resource(Portfolio, '/portfolio/<string:userID>/<int:portfolioId>')
api.add_resource(SubPortfolios, '/portfolio/<string:userID>/subportfolio/<int:portfolioId>')
api.add_resource(SubPortfolio, '/portfolio/<string:userID>/subportfolio/<int:portfolioId>/<int:subEntryId>')

#api.add_resource(UserPost, '/user/<string:userID>/user_post') 
#api.add_resource(Connection, '/user/string:<userID>/connection')

# api.add_resource(test, '/test')
#############################################################################
#
# Main Method
#
if __name__ == "__main__":
	
	context = ('cert.pem', 'key.pem') # Identify the certificates you've generated.
	
	flask.run(
		host=settings.APP_HOST,
		port=settings.APP_PORT,
		ssl_context=context,
		debug=settings.APP_DEBUG)
