# 🗺️ TripVault — Week 1: Project Setup & Authentication

[![Stack](https://img.shields.io/badge/Stack-MERN-6366f1?style=for-the-badge)](https://nodejs.org)
[![Backend](https://img.shields.io/badge/Node.js-v24-green?style=for-the-badge)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-v4.19-blue?style=for-the-badge)](https://expressjs.com)
[![Database](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=for-the-badge)](https://mongodb.com)
[![Frontend](https://img.shields.io/badge/React-Vite-61dafb?style=for-the-badge)](https://vitejs.dev)

Welcome to **TripVault**! This is a full-stack MERN application built as part of the CodGen Virtual Internship Program (Week 1 of 4). Week 1 establishes the core backend foundation, MongoDB database connection, secure JWT authentication system, and a modern React (Vite) frontend.

---

## 📁 Repository Structure

```
tripvault/
├── client/              ← React (Vite) frontend
│   ├── src/
│   │   ├── components/  ← Navbar.jsx, ProtectedRoute.jsx
│   │   ├── pages/       ← Login.jsx, Register.jsx, Dashboard.jsx
│   │   ├── App.jsx      ← Main Routing & Auth state
│   │   ├── index.css    ← Glassmorphic Dark Design System
│   │   └── main.jsx     ← React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js   ← Proxy configuration to backend
├── server/              ← Node + Express backend
│   ├── middleware/      ← authMiddleware.js (JWT validation)
│   ├── models/          ← User.js (Mongoose Schema & Password Hashing)
│   ├── routes/          ← auth.js (Register, Login, Me endpoints)
│   ├── .env             ← Environment variables
│   ├── .env.example     ← Environment variables template
│   └── index.js         ← Server entry point & MongoDB connection
└── README.md            ← Project documentation
```

---

## 🛠️ Requirements & Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
- **Frontend**: React (Vite), React Router v6, Axios, Lucide React Icons
- **Authentication**: Password hashing with `bcryptjs`, JSON Web Tokens (JWT) stored in `localStorage` & verified via Bearer middleware.

---

## 🚀 Quick Setup & Installation Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/tripvault.git
cd tripvault
```

### Step 2: Set Up Backend (`server/`)
```bash
cd server
npm install
```

Create or configure `.env` inside `server/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tripvault
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: If using MongoDB Atlas cloud database, set `MONGO_URI` to your Atlas connection string).*

Start the backend server:
```bash
# Production start
npm start

# Development mode (with nodemon auto-restart)
npm run dev
```
The server will run on `http://localhost:5000`.

### Step 3: Set Up Frontend (`client/`)
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React Vite frontend will run on `http://localhost:3000`.

---

## 🔑 API Endpoints Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check & API documentation | Public |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch profile of logged-in user | **Protected** (Requires `Authorization: Bearer <token>`) |

### Request Examples

#### Register (`POST /api/auth/register`)
```json
{
  "name": "Jane Traveler",
  "email": "jane@example.com",
  "password": "secretpassword123"
}
```

#### Login (`POST /api/auth/login`)
```json
{
  "email": "jane@example.com",
  "password": "secretpassword123"
}
```

#### Protected Profile (`GET /api/auth/me`)
Headers:
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## ✅ Deliverables Checklist (Week 1)

- [x] Clean separation into `/server` and `/client` folders
- [x] Express server running on port 5000 with Mongoose MongoDB connection
- [x] Password hashing using `bcryptjs` (never storing plain-text passwords)
- [x] `POST /api/auth/register` route
- [x] `POST /api/auth/login` route returning JWT token
- [x] Protected `GET /api/auth/me` route using JWT verification middleware
- [x] React (Vite) app with Register, Login, and Dashboard pages
- [x] `react-router-dom` routing with `/dashboard` route protection
- [x] Token persistence in `localStorage`
- [x] Comprehensive `README.md` and `.env.example` file

---

## 🔒 Security Best Practices Implemented

- Passwords are strictly hashed with `bcryptjs` before saving to MongoDB.
- Sensitive user passwords are excluded from JSON responses using Mongoose `toJSON` transforms and `select('-password')`.
- Environment variables (`.env`) are excluded from Git version control via `.gitignore`.
