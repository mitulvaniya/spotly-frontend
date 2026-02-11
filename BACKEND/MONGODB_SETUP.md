# MongoDB Atlas Setup - Step by Step

## 🎯 Goal
Get your free MongoDB database running in the cloud in 3 minutes.

---

## Step 1: Create Account (30 seconds)

1. Open: https://www.mongodb.com/cloud/atlas/register
2. Click **"Sign up with Google"** (fastest) or use email
3. Complete registration

---

## Step 2: Create Free Cluster (1 minute)

1. After login, you'll see "Deploy a cloud database"
2. Click **"Create"** under the FREE tier (M0)
3. Choose:
   - **Cloud Provider**: AWS (recommended)
   - **Region**: Choose closest to you (e.g., Mumbai for India)
   - **Cluster Name**: Leave as "Cluster0" or name it "spotly"
4. Click **"Create Deployment"** (bottom right)
5. **IMPORTANT**: You'll see a security quickstart:
   - **Username**: `spotly`
   - **Password**: Click "Autogenerate Secure Password" and **COPY IT**
   - Click **"Create Database User"**

---

## Step 3: Network Access (30 seconds)

1. You'll see "Where would you like to connect from?"
2. Choose **"My Local Environment"**
3. Click **"Add My Current IP Address"**
4. **Also add**: Click "Add IP Address" again
   - Enter: `0.0.0.0/0` (allows from anywhere)
   - Description: "Allow all"
   - Click "Add Entry"
5. Click **"Finish and Close"**

---

## Step 4: Get Connection String (30 seconds)

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Drivers"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://spotly:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with the password you copied earlier
6. **Add `/spotly`** before the `?` to specify database name:
   ```
   mongodb+srv://spotly:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/spotly?retryWrites=true&w=majority
   ```

---

## Step 5: Update Backend .env

1. Open `BACKEND/.env` file
2. Replace the `MONGODB_URI` line with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://spotly:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/spotly?retryWrites=true&w=majority
   ```
3. Save the file

---

## Step 6: Seed Database & Start Backend

Open terminal in `BACKEND` folder:

```bash
cd BACKEND
npm run seed
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Database seeded successfully!
📊 Summary:
   - Users: 3
   - Spots: 5
🔐 Test Credentials:
   Admin: admin@spotly.com / admin123
   Business Owner: owner@spotly.com / owner123
   User: user@spotly.com / user123
```

Then start the server:
```bash
npm run dev
```

---

## ✅ Verification

Test the API:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 🎉 Done!

Your backend is now running with:
- ✅ MongoDB Atlas cloud database
- ✅ 3 test users
- ✅ 5 sample spots
- ✅ All API endpoints ready

**Next**: Start the frontend with `npm run dev` in the `frontend` folder!

---

## 🐛 Troubleshooting

**"MongoServerError: bad auth"**
- Check password in connection string
- Make sure you replaced `<password>` with actual password

**"Could not connect to any servers"**
- Check network access allows 0.0.0.0/0
- Verify cluster is running (not paused)

**"Database user not found"**
- Go to Database Access in Atlas
- Make sure user `spotly` exists with correct password
