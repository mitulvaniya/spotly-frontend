# SPOTLY Backend Setup Guide

## Quick Start Options

You have two options for the database:

### Option 1: MongoDB Atlas (Recommended - Cloud, Free)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free"
   - Sign up with Google/GitHub or email

2. **Create a Cluster**
   - Choose FREE tier (M0)
   - Select a region close to you
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `spotly`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://spotly:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://spotly:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/spotly?retryWrites=true&w=majority
   ```
   Replace `YOUR_PASSWORD` with your actual password and add `/spotly` before the `?`

### Option 2: Local MongoDB

1. **Download MongoDB**
   - Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server for Windows
   - Run the installer

2. **Install MongoDB**
   - Choose "Complete" installation
   - Install as a Service
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB**
   - MongoDB should auto-start as a service
   - Or run: `net start MongoDB`

4. **Verify Installation**
   ```bash
   mongod --version
   ```

5. **Update .env** (already set for local)
   ```env
   MONGODB_URI=mongodb://localhost:27017/spotly
   ```

---

## Cloudinary Setup (Required for Image Uploads)

1. **Create Cloudinary Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Click "Sign Up for Free"
   - Sign up with Google/GitHub or email

2. **Get API Credentials**
   - After login, go to Dashboard
   - You'll see:
     - Cloud Name
     - API Key
     - API Secret

3. **Update .env File**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

---

## Running the Backend

1. **Seed the Database** (First time only)
   ```bash
   cd BACKEND
   npx ts-node src/scripts/seed.ts
   ```

   This creates:
   - 3 test users (admin, business owner, regular user)
   - 5 sample spots with real data

2. **Start the Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   🚀 Server running in development mode on port 5000
   📍 API available at http://localhost:5000/api
   💚 Health check at http://localhost:5000/health
   ```

3. **Test the API**
   
   Open a new terminal and test:
   ```bash
   # Health check
   curl http://localhost:5000/health

   # Login as admin
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@spotly.com\",\"password\":\"admin123\"}"

   # Get all spots
   curl http://localhost:5000/api/spots
   ```

---

## Test Credentials

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@spotly.com | admin123 |
| Business Owner | owner@spotly.com | owner123 |
| Regular User | user@spotly.com | user123 |

---

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running (local) or Atlas cluster is active
- Verify connection string in `.env`
- Check network access settings in Atlas (allow your IP)

### Port 5000 Already in Use
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000

### Cloudinary Upload Fails
- Verify credentials in `.env`
- Check if Cloudinary account is active
- Images will work with placeholder URLs even without Cloudinary

---

## Next Steps

Once the backend is running:

1. ✅ Test all endpoints with Postman/Thunder Client
2. ✅ Create frontend API service layer
3. ✅ Connect frontend authentication
4. ✅ Replace mock data with real API calls
5. ✅ Deploy to production

---

## Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Seed database
npx ts-node src/scripts/seed.ts

# Lint code
npm run lint
```
