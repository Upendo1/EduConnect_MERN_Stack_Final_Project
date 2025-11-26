# EduConnect - MERN Project Documentation

A complete guide, code snippets, and setup instructions for the **EduConnect** project, an online learning platform developed with the MERN stack (MongoDB, Express, React, Node.js). This project supports SDG 4: Quality Education, enabling teachers to upload learning resources (PDFs, images, videos) and students to browse and download them.

---

## Project Overview

EduConnect is a full-stack web application designed to connect students and educators. Key features include:

- User authentication with student/teacher roles
- File upload and management (PDFs, images, videos) via Cloudinary
- Resource browsing, preview, and download functionality
- Teacher dashboard for uploading and managing resources
- Student dashboard for accessing and downloading resources
- Administrator dashborard for overseeing all activities within the system
- Role-based access control and protected routes

---

## Folder Structure

```

educonnect/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ └── resourceController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── upload.js
│ ├── models/
│ │ ├── User.js
│ │ └── Resource.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ └── resourceRoutes.js
│ ├── server.js
│ └── .env
├── frontend/
│ ├── public/
│ └── src/
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
└── README.md

```


## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account or local MongoDB
- Cloudinary account for file hosting (optional but recommended)
- Git and GitHub account
- (Optional) Vercel or Netlify account for deployment

---

## Backend - Setup & Key Files

### Install dependencies

```
cd backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors multer cloudinary

```
## Deployment

## Frontend (Vercel)

Build command: npm run build

Publish directory: dist


https://edu-connect-snowy.vercel.app


## Backend (Render)

Set environment variables from .env

Ensure CORS allows frontend origin


https://educonnect-mern-stack-final-project.onrender.com
