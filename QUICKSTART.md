# SPOTLY - Quick Start Guide

## 🚀 Get Everything Running in 5 Minutes

### Step 1: Set Up MongoDB Atlas (2 minutes)

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (free tier)
3. Create a cluster (M0 Free tier)
4. **Database Access**: Add user `spotly` with password
5. **Network Access**: Allow access from anywhere (0.0.0.0/0)
6. **Connect**: Get connection string

### Step 2: Configure Backend (.env)

Edit `BACKEND/.env`:
```env
MONGODB_URI=mongodb+srv://spotly:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/spotly?retryWrites=true&w=majority
```

### Step 3: Seed Database & Start Backend

```bash
cd BACKEND
npm run seed
npm run dev
```

Expected output:
```
✅ MongoDB Connected
✅ Database seeded successfully!
🚀 Server running on port 5000
```

### Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

### Step 5: Test It!

Open [http://localhost:3000](http://localhost:3000)

**Test Login:**
- Email: `admin@spotly.com`
- Password: `admin123`

---

## 📝 What You Get

### Backend (Port 5000)
- ✅ 30+ REST API endpoints
- ✅ JWT authentication
- ✅ MongoDB database with 5 sample spots
- ✅ 3 test users (admin, business owner, user)
- ✅ Image upload ready (needs Cloudinary)

### Frontend (Port 3000)
- ✅ Premium Next.js UI
- ✅ API client with auto token refresh
- ✅ All pages ready
- ✅ Authentication flow
- ✅ Dark/Light mode

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@spotly.com | admin123 |
| **Business Owner** | owner@spotly.com | owner123 |
| **User** | user@spotly.com | user123 |

---

## 🎯 Next Steps (Optional)

### Add Cloudinary for Image Uploads

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Update `BACKEND/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Connect Frontend to Backend

The API client is ready! Just update your components to use:

```typescript
import { authApi, spotsApi, reviewsApi } from '@/lib/api';

// Login
const response = await authApi.login(email, password);

// Get spots
const spots = await spotsApi.getAll({ category: 'Food & Cafes' });

// Create review
await reviewsApi.create({ spot: spotId, rating: 5, text: 'Great!' });
```

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB connection string in `.env`
- Make sure MongoDB Atlas cluster is running

**Frontend can't connect?**
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Make sure backend is running on port 5000

**Database seed fails?**
- Check MongoDB connection
- Delete existing data and try again

---

## 📚 Documentation

- **Backend API**: See `BACKEND/README.md`
- **Setup Guide**: See `BACKEND/SETUP.md`
- **Walkthrough**: See artifact walkthrough.md

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend .env configured
- [ ] Database seeded successfully
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login with test credentials
- [ ] Can view spots on homepage

**You're all set! 🎉**
