# backend/api/db.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from backend folder
backend_dir = os.path.dirname(os.path.dirname(__file__))  # Go up to backend folder
env_path = os.path.join(backend_dir, ".env")

print(f"Looking for .env file at: {env_path}")
print(f".env file exists: {os.path.exists(env_path)}")

load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB", "pig_farm_db")  # Default database name

# Print debug info
print(f"MONGO_URI found: {'Yes' if MONGO_URI else 'No'}")
print(f"MONGO_DB: {MONGO_DB}")

if not MONGO_URI:
    print("❌ MONGO_URI not found in environment variables")
    print(f"Checked .env file location: {env_path}")
    
    # Show available environment variables for debugging
    mongo_vars = [key for key in os.environ.keys() if 'MONGO' in key.upper()]
    if mongo_vars:
        print("Found these MONGO-related environment variables:")
        for key in mongo_vars:
            print(f"  {key}: {os.environ[key]}")
    else:
        print("No MONGO-related environment variables found")
    
    # Try to read .env file manually
    if os.path.exists(env_path):
        print("Attempting to read .env file manually:")
        try:
            with open(env_path, 'r') as f:
                content = f.read()
                print("First 100 characters of .env file:")
                print(repr(content[:100]))
        except Exception as e:
            print(f"Error reading .env file: {e}")
    
    raise RuntimeError("MONGO_URI not set in environment. Please check your .env file in the backend folder.")

# Create async client
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]  # Use the variable value, not string literal

async def test_connection():
    """Test the MongoDB connection"""
    try:
        # Test the connection
        await client.admin.command('ping')
        collections = await db.list_collection_names()
        print(f"✅ Connected to MongoDB database: {MONGO_DB}")
        print(f"Available collections: {collections if collections else 'None (new database)'}")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

# Connection info
print(f"Database name: {MONGO_DB}")
print(f"MongoDB URI configured: {'Yes' if MONGO_URI else 'No'}")
