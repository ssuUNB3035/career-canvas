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
			dbConnection.commit()
			result = cursor.fetchone()
			
			return result
	except Exception as e:
		print(f'Error executing updatePortfolio: {e}')
		return e
	finally:
		cursor.close()
		dbConnection.close()

def addSubPortfolio(portfolioId, title, content):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('addSubPortfolio', (portfolioId,title, content))
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

def updateSubPortfolio(subEntryId, title, content, media_src):
	dbConnection = pymysql.connect(settings.DBHOST,
										settings.DBUSER,
										settings.DBPASSWD,
										settings.DBDATABASE,
										charset='utf8mb4',
										cursorclass= pymysql.cursors.DictCursor)

	try:
		with dbConnection.cursor() as cursor:
			cursor.callproc('updateSubPortfolio', (subEntryId, title, content, media_src))
			result = cursor.fetchone()
			dbConnection.commit()
	except Exception as e:
		print(f'Error executing updateSubPortfolio: {e}')
		return None
	finally:
		cursor.close()
		dbConnection.close()

	return result