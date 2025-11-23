Express + MongoDB backend scaffold for EduConnect

Run:
  cd backend
  npm install
  cp .env.example .env
  set MONGODB_URI and JWT_SECRET
  npm run dev

API endpoints:
  POST /api/auth/register
  POST /api/auth/login
  GET  /api/auth/me (auth)
  GET  /api/posts
  POST /api/posts (auth, multipart files optional)
  GET  /api/posts/:id
  etc.
