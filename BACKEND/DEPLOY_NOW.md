# 🎯 SPOTLY Railway Deployment - Quick Reference

## Your Environment Variables (Copy-Paste Ready)

### 1. Basic Config
```
NODE_ENV=production
PORT=5000
```

### 2. MongoDB (✅ Ready)
```
MONGODB_URI=mongodb+srv://spotly:8Wk9pzIn10zXnVjx@cluster0.mfh0iks.mongodb.net/spotly?appName=Cluster0
```

### 3. JWT Secrets (Generate New for Production)

**Run this in PowerShell to generate secure secrets:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Then add:
```
JWT_SECRET=<paste_generated_string_1>
JWT_REFRESH_SECRET=<paste_generated_string_2>
```

**OR use these temporary ones (CHANGE LATER for security):**
```
JWT_SECRET=spotly-production-secret-2026-change-this-later
JWT_REFRESH_SECRET=spotly-production-refresh-2026-change-this-later
```

### 4. Cloudinary (Optional - Skip for now)
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
*Leave empty for now, image uploads will be disabled*

### 5. Frontend URL (Add after you know your Vercel URL)
```
FRONTEND_URL=https://your-frontend.vercel.app
```
*If you already have Vercel URL, add it. Otherwise add later*

---

## 📝 Deployment Steps

### Step 1: Go to Railway
1. Open: **https://railway.app**
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### Step 2: Create Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your SPOTLY repository
4. Select `BACKEND` folder (if asked)

### Step 3: Add Variables
Click "Variables" tab and add each variable above (one by one)

### Step 4: Wait for Deploy
- Go to "Deployments" tab
- Wait for "Success" ✅

### Step 5: Get URL
- Settings → Networking → Generate Domain
- Copy your URL: `https://________.railway.app`

### Step 6: Test
Visit: `https://your-url.railway.app/api/health`

Should see: `{"status":"ok","message":"SPOTLY API is running"}`

---

## ✅ Checklist

- [ ] Railway account created
- [ ] Project deployed
- [ ] All variables added
- [ ] Deployment successful
- [ ] URL generated
- [ ] Health check works
- [ ] Save backend URL for frontend

---

## 🆘 If Something Goes Wrong

**Build fails?**
- Check deployment logs
- Verify all variables are added
- Click "Redeploy"

**Database connection error?**
- MongoDB Atlas → Network Access → Allow 0.0.0.0/0
- Wait 2 minutes, then redeploy

**500 Error?**
- Check JWT secrets are set
- View deployment logs
- Verify MONGODB_URI is correct

---

## 🎉 Next Steps After Backend is Live

1. **Get your Railway URL**
2. **Update your Vercel frontend** (if already deployed):
   - Vercel → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to: `https://your-railway-url.railway.app/api`
   - Redeploy frontend

3. **Test everything works!**

---

**Ready? Let's deploy!** 🚀
