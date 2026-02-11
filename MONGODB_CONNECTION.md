# 🔐 MongoDB Connection String Setup

## Your Connection String:
```
mongodb+srv://spotly:<db_password>@cluster0.mfh0iks.mongodb.net/?appName=Cluster0
```

## What You Need to Do:

1. **Replace `<db_password>`** with your actual MongoDB password (the one you copied when creating the user)

2. **Add `/spotly`** before the `?` to specify the database name

## Final Format:
```
mongodb+srv://spotly:YOUR_ACTUAL_PASSWORD@cluster0.mfh0iks.mongodb.net/spotly?appName=Cluster0
```

## Example:
If your password is `MySecurePass123`, it would be:
```
mongodb+srv://spotly:MySecurePass123@cluster0.mfh0iks.mongodb.net/spotly?appName=Cluster0
```

---

## Next Steps:

Once you have your complete connection string:

1. Open `BACKEND/.env`
2. Find line 6: `MONGODB_URI=mongodb://localhost:27017/spotly`
3. Replace it with your connection string
4. Save the file
5. Let me know and I'll start the servers!

---

**Or share your password with me and I'll update the file for you!**
