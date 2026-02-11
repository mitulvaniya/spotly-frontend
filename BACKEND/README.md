# SPOTLY Backend API

Backend API for SPOTLY - Premium City Discovery Platform

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management with Roles (User, Business Owner, Admin, Moderator)
- 📍 Spot/Business CRUD with Geospatial Queries
- ⭐ Review System with Rating Calculation
- 💼 Business Owner Dashboard & Analytics
- 🛡️ Admin Panel for Content Moderation
- 📸 Image Upload with Cloudinary
- 🔍 Advanced Search & Filtering
- 🚀 Rate Limiting & Security

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB URI
- JWT secrets
- Cloudinary credentials

### Running the Server

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Spots
- `GET /api/spots` - Get all spots (with filters)
- `GET /api/spots/:id` - Get single spot
- `POST /api/spots` - Create spot (Business Owner/Admin)
- `PUT /api/spots/:id` - Update spot (Owner/Admin)
- `DELETE /api/spots/:id` - Delete spot (Admin)
- `GET /api/spots/nearby` - Get nearby spots

### Reviews
- `GET /api/reviews/spot/:spotId` - Get spot reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/avatar` - Upload avatar
- `GET /api/users/saved` - Get saved spots
- `POST /api/users/saved/:spotId` - Save/unsave spot

### Business
- `POST /api/business/claim/:spotId` - Claim a business
- `GET /api/business/dashboard` - Get dashboard analytics
- `GET /api/business/spots` - Get owned spots

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/spots/pending` - Get pending approvals
- `PUT /api/admin/spots/:id/status` - Approve/reject spot
- `GET /api/admin/analytics` - Get platform analytics
- `PUT /api/admin/users/:id/toggle-active` - Toggle user status

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
