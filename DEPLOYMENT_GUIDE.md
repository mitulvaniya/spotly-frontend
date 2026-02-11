# 🚀 SPOTLY Complete Deployment Guide

## Overview

This guide will help you deploy SPOTLY to production in ~30 minutes.

**What you'll deploy:**
- ✅ Backend API → Railway or Render
- ✅ Frontend App → Vercel
- ✅ Database → MongoDB Atlas (already done!)

**What you'll need:**
- GitHub account
- Railway/Render account (free)
- Vercel account (free)
- Your MongoDB Atlas connection string

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas database is running
- [ ] You have your MongoDB connection string
- [ ] You have Cloudinary credentials
- [ ] Code is pushed to GitHub
- [ ] Both servers work locally

---

## 🎯 Deployment Steps

### **Step 1: Deploy Backend** (15 minutes)

#### Option A: Railway (Recommended - Easier)

1. **Sign Up**
   - Go to [railway.app](https://railway.app)
   - Click "Login" → "Login with GitHub"
   - Authorize Railway

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your SPOTLY repository
   - Select the `BACKEND` folder

3. **Add Environment Variables**
   Click "Variables" tab and add these (one by one):

   ```env
   NODE_ENV=production
   PORT=5000
   ```

   **MongoDB URI** (from MongoDB Atlas):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spotly
   ```

   **JWT Secrets** (generate random strings):
   ```env
   JWT_SECRET=your_64_character_random_string_here
   JWT_REFRESH_SECRET=your_another_64_character_random_string_here
   ```

   **Cloudinary** (from your Cloudinary dashboard):
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   **Frontend URL** (add after frontend deployment):
   ```env
   FRONTEND_URL=https://spotly.vercel.app
   ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Wait for "Success" status (~2-3 minutes)

5. **Get Your Backend URL**
   - Click "Settings" → "Networking"
   - Copy your public URL (e.g., `spotly-backend-production.up.railway.app`)
   - **Save this URL!** You'll need it for frontend

6. **Test Backend**
   - Visit: `https://your-backend-url.railway.app/api/health`
   - Should see: `{"status":"ok","message":"SPOTLY API is running"}`

#### Option B: Render (Alternative)

1. **Sign Up**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select `BACKEND` folder

3. **Configure**
   - **Name**: `spotly-backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   (Same as Railway above)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (~3-5 minutes)
   - Get your URL (e.g., `spotly-backend.onrender.com`)

---

### **Step 2: Deploy Frontend** (10 minutes)

1. **Sign Up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" → "Continue with GitHub"
   - Authorize Vercel

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your SPOTLY repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (if in subfolder)
   - **Build Command**: `npm run build` (auto-detected)
   - Leave other settings as default

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Add variable:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://your-backend-url.railway.app/api`
     - (Use your Railway/Render URL from Step 1)
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for build (~2-3 minutes)
   - You'll see "Congratulations!" when done

6. **Get Your Frontend URL**
   - Copy your Vercel URL (e.g., `https://spotly.vercel.app`)
   - **This is your live app!**

---

### **Step 3: Connect Frontend & Backend** (5 minutes)

1. **Update Backend CORS**
   - Go back to Railway/Render
   - Find the `FRONTEND_URL` environment variable
   - Update it to your Vercel URL:
     ```
     FRONTEND_URL=https://spotly.vercel.app
     ```
   - Save changes
   - Backend will automatically redeploy

2. **Wait for Redeploy**
   - Wait ~1 minute for backend to restart
   - Check deployment status

---

### **Step 4: Test Your Live App!** 🎉

1. **Visit Your App**
   - Go to your Vercel URL
   - You should see the SPOTLY homepage

2. **Test Sign In**
   - Go to Sign In page
   - Use test credentials:
     - Email: `user@spotly.com`
     - Password: `user123`
   - Should successfully sign in!

3. **Test Features**
   - ✅ Browse spots on Discover page
   - ✅ Click a spot to view details
   - ✅ Save a spot (heart button)
   - ✅ Write a review
   - ✅ Check Profile page
   - ✅ View Saved Spots

---

## 🎊 You're Live!

**Your SPOTLY platform is now deployed and accessible worldwide!**

- 🌐 **Frontend**: `https://your-app.vercel.app`
- 🔧 **Backend**: `https://your-backend.railway.app`
- 💾 **Database**: MongoDB Atlas (cloud)

---

## 📝 Important URLs to Save

```
Frontend (Vercel): https://_____________________.vercel.app
Backend (Railway):  https://_____________________.railway.app
MongoDB Atlas:      https://cloud.mongodb.com
```

---

## 🔧 Post-Deployment

### Automatic Updates
Both platforms auto-deploy when you push to GitHub:
- **Vercel**: Deploys on every push to `main`
- **Railway/Render**: Deploys on every push to `main`

### Monitoring
- **Vercel Dashboard**: View frontend logs and analytics
- **Railway/Render Dashboard**: View backend logs and metrics
- **MongoDB Atlas**: Monitor database usage

### Custom Domain (Optional)
1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **Add to Vercel**:
   - Settings → Domains → Add Domain
   - Follow DNS instructions
3. **Update Backend**:
   - Update `FRONTEND_URL` to your custom domain

---

## 🆘 Troubleshooting

### Backend Issues

**"Cannot connect to database"**
- Check MongoDB Atlas network access
- Go to Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)

**"Build failed"**
- Check build logs in Railway/Render
- Verify all environment variables are set
- Test `npm run build` locally first

### Frontend Issues

**"API calls failing"**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running (visit health endpoint)
- Verify backend `FRONTEND_URL` matches your Vercel domain

**"Build failed"**
- Check build logs in Vercel
- Test `npm run build` locally
- Verify no TypeScript errors

### CORS Errors

**"CORS policy blocked"**
- Update `FRONTEND_URL` in backend to match your Vercel URL exactly
- Wait for backend to redeploy
- Clear browser cache

---

## 💰 Cost Breakdown

### Free Tier Limits

**Railway**
- $5/month free credit
- ~500 hours/month
- Perfect for SPOTLY!

**Render**
- Free tier available
- Sleeps after 15 min inactivity
- Wakes up on first request

**Vercel**
- Unlimited deployments
- 100GB bandwidth/month
- More than enough for SPOTLY!

**MongoDB Atlas**
- 512MB free storage
- Shared cluster
- Perfect for development/testing

### Upgrade When Needed
- Railway: $5/month for always-on
- Render: $7/month for always-on
- Vercel: Free tier is usually sufficient
- MongoDB: $9/month for dedicated cluster

---

## 🎯 Next Steps

After deployment:
- [ ] Share your live URL with friends!
- [ ] Test all features thoroughly
- [ ] Monitor usage and performance
- [ ] Consider custom domain
- [ ] Set up analytics (optional)
- [ ] Add more spots to database
- [ ] Invite users to test

---

## 📞 Need Help?

**Common Resources:**
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

## 🎉 Congratulations!

You've successfully deployed a full-stack application to production!

**What you've accomplished:**
- ✅ Deployed a Node.js/Express backend
- ✅ Deployed a Next.js frontend
- ✅ Connected to cloud database
- ✅ Configured environment variables
- ✅ Set up CORS and security
- ✅ Made it accessible worldwide!

**Your SPOTLY platform is now live and ready for users!** 🚀
