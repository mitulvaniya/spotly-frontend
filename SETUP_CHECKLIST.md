# SPOTLY - Complete Setup Checklist

## ✅ Backend Setup

### 1. MongoDB Atlas (Required)
- [ ] Create MongoDB Atlas account at https://mongodb.com/cloud/atlas/register
- [ ] Create free M0 cluster
- [ ] Create database user: `spotly` with password
- [ ] Add network access: 0.0.0.0/0
- [ ] Copy connection string
- [ ] Update `BACKEND/.env` with `MONGODB_URI`

**Guide**: See `BACKEND/MONGODB_SETUP.md`

### 2. Seed Database
```bash
cd BACKEND
npm run seed
```

Expected output:
```
✅ Database seeded successfully!
📊 Summary:
   - Users: 3
   - Spots: 5
```

### 3. Start Backend
```bash
npm run dev
```

Expected output:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### 4. Test Backend
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/spots
```

---

## ✅ Frontend Setup

### 1. Environment Variables
File `frontend/.env.local` should have:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Frontend
- Open http://localhost:3000
- You should see the SPOTLY homepage
- Click "Start Exploring" to view spots

---

## ✅ Test the Integration

### 1. Login
- Go to http://localhost:3000/signin
- Email: `admin@spotly.com`
- Password: `admin123`
- Should redirect to homepage with user menu

### 2. View Spots
- Homepage should show 3 featured spots
- Click "Discover" to see all 5 spots
- Click on a spot to view details

### 3. Create Review (if logged in)
- Go to any spot detail page
- Click "Write a Review"
- Add rating and text
- Submit

---

## 🎯 Optional: Cloudinary Setup

For image uploads (can skip for now):

1. Create account at https://cloudinary.com
2. Get credentials from dashboard
3. Update `BACKEND/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📝 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@spotly.com | admin123 |
| Business Owner | owner@spotly.com | owner123 |
| User | user@spotly.com | user123 |

---

## 🐛 Common Issues

### Backend won't start
- ✅ Check MongoDB connection string in `.env`
- ✅ Make sure cluster is active in Atlas
- ✅ Verify network access allows your IP

### Frontend can't connect to backend
- ✅ Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- ✅ Make sure backend is running on port 5000
- ✅ Check browser console for CORS errors

### Database seed fails
- ✅ Check MongoDB connection
- ✅ Try deleting data in Atlas and re-seeding

---

## 🎉 Success Criteria

You're all set when:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000
- ✅ Can login with test credentials
- ✅ Can see 5 spots on discover page
- ✅ Can view spot details
- ✅ API health check returns success

---

## 📚 Next Steps

Once everything is working:

1. **Connect Frontend Components**
   - Update auth pages to use `authApi`
   - Replace mock data with API calls
   - Add loading states

2. **Add Features**
   - Implement review submission
   - Add spot creation for business owners
   - Build admin dashboard

3. **Deploy**
   - Backend to Railway/Render
   - Frontend to Vercel
   - Update environment variables

---

**Need help?** Check the documentation:
- `BACKEND/SETUP.md` - Detailed backend setup
- `BACKEND/MONGODB_SETUP.md` - MongoDB Atlas guide
- `QUICKSTART.md` - Quick start guide
- `walkthrough.md` - Complete implementation details
