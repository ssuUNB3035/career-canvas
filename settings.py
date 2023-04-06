# settings.py
#
# Use this to store environment variables
#
APP_HOST = 'cs3103.cs.unb.ca'

# Your port number: last 5 digits of your studentid. 
# If value > 65535, subtract 30000.
# If the value is < 1025, then add 1024
APP_PORT = 8021 # Change this to your port number
APP_DEBUG = True

DBHOST = 'localhost'
DBUSER = 'ssu'
DBPASSWD = 'X7qF2HTO'
DBDATABASE = DBUSER

SECRET_KEY = 'd41d8cd98f00b204e9800998ecf8427e'

LDAP_HOST =  'ldap-student.cs.unb.ca'