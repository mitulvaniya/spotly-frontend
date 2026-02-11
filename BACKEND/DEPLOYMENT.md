# SPOTLY Backend - Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended)

1. **Sign up at [Railway.app](https://railway.app)**
   - Use GitHub to sign in

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `SPOTLY/BACKEND` folder

3. **Configure Environment Variables**
   Go to Variables tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your_mongodb_atlas_uri>
   JWT_SECRET=<generate_secure_random_string>
   JWT_REFRESH_SECRET=<generate_secure_random_string>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Railway will auto-deploy
   - Get your public URL (e.g., `https://spotly-backend-production.up.railway.app`)

---

### Option 2: Render

1. **Sign up at [Render.com](https://render.com)**
   - Use GitHub to sign in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `SPOTLY/BACKEND` folder

3. **Configure Build Settings**
   - **Name**: `spotly-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   Same as Railway (see above)

5. **Deploy**
   - Click "Create Web Service"
   - Get your public URL (e.g., `https://spotly-backend.onrender.com`)

---

## Environment Variables Guide

### Required Variables

#### MongoDB URI
Get from MongoDB Atlas:
1. Go to your cluster
2. Click "Connect" → "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/spotly?retryWrites=true&w=majority
```

#### JWT Secrets
Generate secure random strings:
```bash
# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Or use online generator: https://randomkeygen.com/

#### Cloudinary Credentials
From your Cloudinary dashboard:
- Cloud Name
- API Key  
- API Secret

#### Frontend URL
Will be your Vercel URL (add after frontend deployment):
```
https://spotly.vercel.app
```

---

## Post-Deployment

### 1. Test Backend
Visit: `https://your-backend-url.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "SPOTLY API is running"
}
```

### 2. Update Frontend
Update `NEXT_PUBLIC_API_URL` in frontend to your backend URL

### 3. Update CORS
Backend will automatically allow your frontend URL from `FRONTEND_URL` env variable

---

## Troubleshooting

### Build Fails
- Check Node version (should be >=18)
- Verify all dependencies are in `package.json`
- Check build logs for errors

### Database Connection Error
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
- Ensure database user has correct permissions

### API Returns 500 Error
- Check environment variables are set correctly
- View deployment logs
- Verify JWT secrets are set

---

## Monitoring

### Railway
- View logs in dashboard
- Monitor resource usage
- Set up alerts

### Render
- View logs in dashboard
- Monitor metrics
- Free tier sleeps after 15 min inactivity

---

## Cost

### Railway
- Free $5/month credit
- ~$5/month after credit

### Render
- Free tier (with limitations)
- Sleeps after 15 min inactivity
- Upgrade to $7/month for always-on

---

## Next Steps

After backend is deployed:
1. ✅ Note your backend URL
2. ✅ Deploy frontend to Vercel
3. ✅ Update frontend env with backend URL
4. ✅ Test end-to-end
