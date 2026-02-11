# 🚀 SPOTLY Backend - Render Deployment (100% FREE Forever!)

## ✅ Why Render?

- **FREE FOREVER** - No credit card required
- **No time limits** - Unlike Railway's 30-day trial
- **Easy deployment** - Similar to Railway
- **Auto-deploys** from GitHub

**Only limitation**: Free tier sleeps after 15 min of inactivity (wakes up automatically on first request)

---

## 🎯 Quick Deploy Steps

### Step 1: Create Render Account (2 minutes)

1. **Go to**: **https://render.com**

2. **Click "Get Started"** (top right)

3. **Sign up with GitHub**

4. **Authorize Render** to access your repositories

5. You'll see the Render dashboard

---

### Step 2: Create Web Service (1 minute)

1. **Click "New +"** (top right)

2. **Select "Web Service"**

3. **Connect your GitHub repository**:
   - Find and select your SPOTLY repository
   - Click "Connect"

4. **Configure the service**:
   - **Name**: `spotly-backend` (or any name you like)
   - **Region**: Choose closest to you (e.g., Singapore, Frankfurt)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `BACKEND` (if backend is in subfolder, otherwise leave blank)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. **Select Plan**: **FREE** ✅

6. **Click "Create Web Service"** (but DON'T deploy yet!)

---

### Step 3: Add Environment Variables (5 minutes)

Before deploying, add environment variables:

1. **Scroll down to "Environment Variables"** section

2. **Click "Add Environment Variable"**

3. **Add these variables ONE BY ONE**:

#### Basic Configuration
```
Key: NODE_ENV
Value: production
```
Click "Add" ✅

```
Key: PORT
Value: 5000
```
Click "Add" ✅

#### MongoDB Connection
```
Key: MONGODB_URI
Value: mongodb+srv://spotly:8Wk9pzIn10zXnVjx@cluster0.mfh0iks.mongodb.net/spotly?appName=Cluster0
```
Click "Add" ✅

#### JWT Secrets

**Option 1: Generate Secure Secrets (Recommended)**

Run this in PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Then add:
```
Key: JWT_SECRET
Value: <paste_your_generated_string>
```
Click "Add" ✅

Run the command again for a different string:
```
Key: JWT_REFRESH_SECRET
Value: <paste_another_generated_string>
```
Click "Add" ✅

**Option 2: Use Temporary Secrets (Change Later)**
```
Key: JWT_SECRET
Value: spotly-production-secret-2026-change-later
```

```
Key: JWT_REFRESH_SECRET
Value: spotly-production-refresh-2026-change-later
```

#### Cloudinary (Optional - Skip for now)
```
Key: CLOUDINARY_CLOUD_NAME
Value: (leave empty or skip)
```

```
Key: CLOUDINARY_API_KEY
Value: (leave empty or skip)
```

```
Key: CLOUDINARY_API_SECRET
Value: (leave empty or skip)
```

#### Frontend URL (Add after Vercel deployment)
```
Key: FRONTEND_URL
Value: https://your-frontend.vercel.app
```
*If you already have your Vercel URL, add it now. Otherwise, add it later*

---

### Step 4: Deploy! (3-5 minutes)

1. **Scroll to the bottom**

2. **Click "Create Web Service"**

3. **Render will start building**:
   - You'll see the build logs in real-time
   - Wait for "Build successful" ✅
   - Then wait for "Deploy live" ✅

4. **First deployment takes 3-5 minutes**

---

### Step 5: Get Your Backend URL (1 minute)

1. **At the top of the page**, you'll see your service URL:
   - Format: `https://spotly-backend.onrender.com`
   - Or: `https://your-service-name.onrender.com`

2. **Copy this URL** - you'll need it!

---

### Step 6: Test Your Backend (1 minute)

1. **Visit**: `https://your-service-name.onrender.com/api/health`

2. **You should see**:
   ```json
   {
     "status": "ok",
     "message": "SPOTLY API is running"
   }
   ```

3. **✅ If you see this, YOUR BACKEND IS LIVE!**

4. **⚠️ Note**: First request might take 30-60 seconds if the service was sleeping

---

### Step 7: Keep Service Awake (Optional)

Free tier sleeps after 15 min of inactivity. To keep it awake:

**Option 1: Use a Ping Service (Recommended)**
- Sign up at: **https://uptimerobot.com** (free)
- Add your health check URL: `https://your-service.onrender.com/api/health`
- Set interval: 14 minutes
- This will ping your service every 14 min to keep it awake

**Option 2: Accept the Sleep**
- First request after sleep takes ~30 seconds
- Subsequent requests are instant
- Good enough for development/testing

---

## 🔧 MongoDB Atlas Setup (If Needed)

If you get database connection errors:

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com

2. **Network Access** (left sidebar)

3. **Add IP Address** → **Allow Access from Anywhere**
   - IP: `0.0.0.0/0`
   - Comment: "Render deployment"

4. **Confirm** and wait 2 minutes

5. **Go back to Render** → **Manual Deploy** → **Deploy latest commit**

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] Web service created
- [ ] All environment variables added
- [ ] Service deployed successfully
- [ ] Public URL obtained
- [ ] Health endpoint returns success
- [ ] MongoDB connection working

---

## 🎯 Your Backend Info

**Save these:**

```
Render Dashboard:  https://dashboard.render.com
Backend URL:       https://_____________________________.onrender.com
Health Check:      https://_____________________________.onrender.com/api/health
```

---

## 🔄 Next Steps

### If Frontend Already Deployed (Vercel):

1. **Update Vercel Environment Variable**:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to: `https://your-service.onrender.com/api`
   - Redeploy frontend

2. **Update Render CORS**:
   - Render Dashboard → Environment → Add/Edit `FRONTEND_URL`
   - Set to your Vercel URL
   - Render will auto-redeploy

3. **Test Everything**!

### If Frontend Not Deployed:

1. Deploy frontend to Vercel
2. Use your Render backend URL in frontend env

---

## 🆘 Troubleshooting

### "Build Failed"
- Check build logs in Render dashboard
- Verify `package.json` scripts are correct
- Check all dependencies are listed
- Click "Manual Deploy" to retry

### "Cannot Connect to Database"
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Ensure database user has correct permissions
- Check database password doesn't have special characters

### "Service Unavailable / 503"
- Service might be sleeping (free tier)
- Wait 30-60 seconds and refresh
- Consider using UptimeRobot to keep awake

### "CORS Error"
- Update `FRONTEND_URL` in Render
- Ensure it matches your Vercel URL exactly
- Wait for auto-redeploy

---

## 💰 Render Free Tier

**What's Included:**
- ✅ 750 hours/month (enough for 24/7 if you keep it awake)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ✅ Custom domains
- ✅ Environment variables

**Limitations:**
- Sleeps after 15 min inactivity
- Slower cold starts (~30 sec)
- 512MB RAM

**Perfect for SPOTLY!** No payment needed! 🎉

---

## 🎉 You're Done!

Once health check works, your backend is **LIVE and FREE FOREVER**!

**No credit card. No time limits. No surprises.** 🚀
