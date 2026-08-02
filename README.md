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