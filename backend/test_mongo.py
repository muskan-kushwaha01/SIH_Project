from pymongo import MongoClient

uri = "mongodb+srv://muskankushwaha018_db_user:7PHzJZ4VH2iEfYQv@bioraksha.xlj4kio.mongodb.net/pig_farm_db"

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    db = client["pig_farm_db"]
    print("✅ Connected to MongoDB!")
    print("Databases:", client.list_database_names())
except Exception as e:
    print("❌ Connection failed:", e)
