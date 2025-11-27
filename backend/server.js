require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const connectDB = require('./config/db');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const adminRoutes = require("./routes/adminRoutes");

// MIDDLEWARES
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ---------------------------------------
// CORS
// ---------------------------------------
app.use(cors({
  origin: "*",
  credentials: true,
}));

// ---------------------------------------
// BODY PARSER
// ---------------------------------------
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------------------------------
// STATIC UPLOADS FOLDER
// IMPORTANT: Use correct __dirname
// ---------------------------------------
const __dirnameResolved = __dirname; // Safe in CommonJS

app.use("/uploads", express.static(path.join(__dirnameResolved, "uploads")));

// ---------------------------------------
// ROUTES
// ---------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/resources", resourceRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('EduConnect API running'));

// ERROR HANDLER
app.use(errorHandler);

// ---------------------------------------
// SOCKET.IO
// ---------------------------------------
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ---------------------------------------
// START SERVER + MONGO
// ---------------------------------------
connectDB(process.env.MONGODB_URI)
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error("DB connection failed", err));
