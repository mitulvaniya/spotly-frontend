# 🚀 SPOTLY Backend - Railway Deployment (Step-by-Step)

## ⚡ Quick Deploy to Railway

### Step 1: Create Railway Account (2 minutes)

1. **Open your browser** and go to: **https://railway.app**

2. **Click "Login"** (top right)

3. **Select "Login with GitHub"**

4. **Authorize Railway** to access your GitHub

5. You'll see the Railway dashboard

---

### Step 2: Create New Project (1 minute)

1. **Click "New Project"** (big button in center or top right)

2. **Select "Deploy from GitHub repo"**

3. **Choose your SPOTLY repository** from the list

4. **Important**: If you have a monorepo structure:
   - Railway will ask for the root directory
   - Enter: `BACKEND` (or leave blank if backend is in root)

5. **Click "Deploy"**

Railway will start building automatically!

---

### Step 3: Add Environment Variables (5 minutes)

While it's building, let's add environment variables:

1. **Click on your deployed service** (in the Railway dashboard)

2. **Click "Variables" tab** (top menu)

3. **Click "+ New Variable"** and add these ONE BY ONE:

#### Basic Configuration
```
NODE_ENV=production
```
Click "Add" ✅

```
PORT=5000
```
Click "Add" ✅

#### MongoDB Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spotly?retryWrites=true&w=majority
```
**⚠️ IMPORTANT**: Replace with YOUR actual MongoDB Atlas connection string!

To get your MongoDB URI:
- Go to MongoDB Atlas → Clusters → Connect
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your actual database password

Click "Add" ✅

#### JWT Secrets (Generate Random Strings)

**For Windows PowerShell**, run this command to generate a secure random string:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Copy the output and use it for JWT_SECRET:
```
JWT_SECRET=<paste_your_generated_string_here>
```
Click "Add" ✅

**Run the command again** for a different string:
```
JWT_REFRESH_SECRET=<paste_another_generated_string_here>
```
Click "Add" ✅

#### Cloudinary Configuration

Get these from your Cloudinary dashboard (https://cloudinary.com/console):

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
```
Click "Add" ✅

```
CLOUDINARY_API_KEY=your_api_key
```
Click "Add" ✅

```
CLOUDINARY_API_SECRET=your_api_secret
```
Click "Add" ✅

#### Frontend URL (Add Later)
```
FRONTEND_URL=https://your-frontend.vercel.app
```
**Note**: If you already have your Vercel URL, add it now. Otherwise, add it after frontend deployment.

Click "Add" ✅

---

### Step 4: Wait for Deployment (2-3 minutes)

1. **Go to "Deployments" tab**

2. **Watch the build logs** (you'll see npm install, build, etc.)

3. **Wait for "Success"** status ✅

4. If it fails:
   - Check the logs for errors
   - Verify all environment variables are correct
   - Click "Redeploy" to try again

---

### Step 5: Get Your Backend URL (1 minute)

1. **Click "Settings" tab**

2. **Scroll to "Networking" section**

3. **Click "Generate Domain"** (if not already generated)

4. **Copy your public URL**
   - It will look like: `spotly-backend-production.up.railway.app`
   - Or: `your-project-name.railway.app`

5. **Save this URL!** You'll need it for:
   - Testing the backend
   - Connecting your frontend

---

### Step 6: Test Your Backend (1 minute)

1. **Open your browser**

2. **Visit**: `https://your-backend-url.railway.app/api/health`
   (Replace with your actual Railway URL)

3. **You should see**:
   ```json
   {
     "status": "ok",
     "message": "SPOTLY API is running"
   }
   ```

4. **If you see this** ✅ **YOUR BACKEND IS LIVE!**

5. **If you see an error**:
   - Check environment variables (especially MONGODB_URI)
   - Check deployment logs
   - Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

### Step 7: Update MongoDB Atlas Network Access (If Needed)

If you get database connection errors:

1. **Go to MongoDB Atlas** (https://cloud.mongodb.com)

2. **Click "Network Access"** (left sidebar)

3. **Click "Add IP Address"**

4. **Select "Allow Access from Anywhere"**
   - IP Address: `0.0.0.0/0`
   - Comment: "Railway deployment"

5. **Click "Confirm"**

6. **Wait 1-2 minutes** for changes to apply

7. **Go back to Railway** and click "Redeploy"

---

## ✅ Success Checklist

- [ ] Railway account created
- [ ] Project deployed from GitHub
- [ ] All environment variables added
- [ ] Deployment shows "Success" status
- [ ] Public URL generated
- [ ] Health endpoint returns success
- [ ] MongoDB connection working

---

## 🎯 Your Backend URLs

**Save these for reference:**

```
Railway Dashboard: https://railway.app/project/___________
Backend API URL:   https://_____________________________.railway.app
Health Check:      https://_____________________________.railway.app/api/health
```

---

## 🔄 Next Steps

### If Frontend is Already Deployed:

1. **Update Frontend Environment Variable**:
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to: `https://your-backend.railway.app/api`
   - Redeploy frontend

2. **Update Backend CORS**:
   - Go to Railway → Variables
   - Update `FRONTEND_URL` to your Vercel URL
   - Railway will auto-redeploy

3. **Test End-to-End**:
   - Visit your Vercel frontend
   - Try signing in
   - Test all features

### If Frontend Not Deployed Yet:

1. Follow the frontend deployment guide
2. Use your Railway backend URL in frontend env variables

---

## 🆘 Troubleshooting

### "Build Failed"
- Check build logs in Railway
- Verify `package.json` has correct scripts
- Ensure all dependencies are listed

### "Cannot Connect to Database"
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access
- Ensure database user has correct permissions

### "API Returns 500 Error"
- Check deployment logs
- Verify all environment variables are set
- Check JWT_SECRET and JWT_REFRESH_SECRET are set

### "CORS Error"
- Update FRONTEND_URL in Railway variables
- Ensure it matches your Vercel URL exactly
- Wait for Railway to redeploy

---

## 💰 Railway Pricing

**Free Tier:**
- $5 free credit per month
- ~500 hours of usage
- Perfect for SPOTLY!

**After Free Credit:**
- ~$5/month for small apps
- Pay only for what you use

---

## 🎉 Congratulations!

Once you see the health check working, your backend is **LIVE and accessible worldwide**!

**Your SPOTLY backend is now deployed!** 🚀
