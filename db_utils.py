import pymysql.cursors
import settings
import cgitb
import sys
import os
import app
cgitb.enable()

def getOrCreateUser(username):    
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass=pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('getUser', (username,))
			result = cursor.fetchall()
			#print(result)
			if not result:
				cursor.callproc('createUser', (username,))
				result = cursor.fetchall()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing getOrCreateUser: {e}')
		return e
	finally: 
		cursor.close()
		dbConnection.close()

	return result

def getAllUsers():
	dbConnection = pymysql.connect(settings.DBHOST,
									settings.DBUSER,
									settings.DBPASSWD,
									settings.DBDATABASE,
									charset='utf8mb4',
									cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('getallusers')
			result = cursor.fetchall()
			#dbConnection.commit()
	except Exception as e:
		print(f'Error executing getAllUsers: {e}')
		return e
	finally:
		dbConnection.close()

	return result

def getUser(userID):
	user_list = getAllUsers()
	for user in user_list:
		if user['userId'] == userID:
			return user
		elif user['userName'] == userID:
			return user
	
	return False

def userFormat(user):
	userData = getUser(user['userId'])
	userData.update(user)
	return userData

def updateUser(user):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('updateUser', (user['userId'], user['displayName'], user['intro'], user['media_id']))
			result = cursor.fetchone()
			dbConnection.commit()
			return result
	except Exception as e:
		print(f'Error executing updateUser: {e}')
		return e
	finally:
		cursor.close()
		dbConnection.close()

def getPortfolio(user_id):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('getPortfolios', (user_id,))
			result = cursor.fetchall()
			print(result)
	except Exception as e:
		print(f'Error executing getPortfolios: {e}')
		return e
	finally:
		cursor.close()
		dbConnection.close()

	return result

def addPortfolio(user_id, title):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)
	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('addPortfolio', (user_id, title))
			result = cursor.fetchall()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing addPortfolio: {e}')
		return e
	finally:
		cursor.close()
		dbConnection.close()
	return result

def deletePortfolio(user_id, portfolio_id):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('deletePortfolio', (user_id, portfolio_id))
			dbConnection.commit()
			result = cursor.fetchAll()
	except Exception as e:
		print(f'Error executing deletePortfolio: {e}')
		return None

	finally:
		cursor.close()
		dbConnection.close()

	return result

def updatePortfolio(user_id, portfolio_id, title):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('updatePortfolio', (user_id, portfolio_id, title))
			result = cursor.fetchone()
			
			return result
	except Exception as e:
		print(f'Error executing updatePortfolio: {e}')
		return e
	finally:
		cursor.close()
		dbConnection.close()

def addSubPortfolio(portfolioId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('addSubPortfolio', (portfolioId,))
			result = cursor.fetchone()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing addSubPortfolio: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result

def deleteSubPortfolio(subEntryId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('deleteSubPortfolio', (subEntryId,))
			dbConnection.commit()
			return True
	except Exception as e:
		print(f'Error executing deleteSubPortfolio: {e}')
		return False
	finally:
		cursor.close()
		dbConnection.close()

def getSubPortfolios(portfolioId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('getSubPortfolios', (portfolioId,))
			result = cursor.fetchall()
	except Exception as e:
		print(f'Error executing getSubPortfolios: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result

def updateSubPortfolio(subEntryId, content, media_src):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('updateSubPortfolio', (subEntryId, content, media_src))
			result = cursor.fetchone()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing updateSubPortfolio: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result

def addConnection(userId, targetId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('addConnection', (userId, targetId))
			result = cursor.fetchone()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing addConnection: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result

def deleteConnection(connectionId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('deleteConnection', (connectionId,))
			dbConnection.commit()
			return True
	except Exception as e:
		print(f'Error executing deleteConnection: {e}')
		return False
	finally:
		cursor.close()
		dbConnection.close()

def getConnections(userId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('getConnections', (userId,))
			result = cursor.fetchall()
	except Exception as e:
		print(f'Error executing getConnections: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result

def addPost(userId, content, media_src):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('addPost', (userId, content, media_src))
			result = cursor.fetchone()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing addPost: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result

def deletePost(postId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('deleteSubPortfolio', (postId,))
			dbConnection.commit()
			return True
	except Exception as e:
		print(f'Error executing deletePost: {e}')
		return False
	finally:
		cursor.close()
		dbConnection.close()

	return result

def getPosts(userId):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('getPosts', (userId,))
			result = cursor.fetchall()
	except Exception as e:
		print(f'Error executing getPosts: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result

def updatePost(postId, content, media_src):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('updatePost', (postId, content, media_src))
			result = cursor.fetchone()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing updatePost: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result