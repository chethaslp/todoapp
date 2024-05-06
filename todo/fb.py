import firebase_admin
from firebase_admin import credentials, auth


cred = credentials.Certificate("././cred.json")
firebase_admin.initialize_app(cred)

auth = auth