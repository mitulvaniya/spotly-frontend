# 🎯 SPOTLY Render Deployment - Quick Reference

## Your Environment Variables (Copy-Paste Ready)

### Add these in Render Dashboard:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://spotly:8Wk9pzIn10zXnVjx@cluster0.mfh0iks.mongodb.net/spotly?appName=Cluster0
JWT_SECRET=spotly-production-secret-2026-change-later
JWT_REFRESH_SECRET=spotly-production-refresh-2026-change-later
FRONTEND_URL=https://your-frontend.vercel.app
```

*(Update FRONTEND_URL with your actual Vercel URL)*

---

## 📝 Quick Steps

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **New +** → **Web Service**
4. **Connect** your SPOTLY repo
5. **Configure**:
   - Name: `spotly-backend`
   - Root: `BACKEND`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Plan: **FREE**
6. **Add** environment variables above
7. **Create Web Service**
8. **Wait** for deployment (~3-5 min)
9. **Test**: `https://your-service.onrender.com/api/health`

---

## ✅ Done!

Your backend will be at: `https://spotly-backend.onrender.com`

**100% FREE FOREVER!** 🎉
