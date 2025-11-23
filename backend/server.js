require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middleware/errorHandler');
const categoryRoutes = require("./routes/categoryRoutes");
const resourceRoutes=require("./routes/resourceRoutes");
const adminRoutes=require("./routes/adminRoutes");

const app = express();
// const allowedOrigins = [
//     "https://edu-connect-snowy.vercel.app",
//     "https://educonnect-mern-stack-final-project.onrender.com"
// ];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true
// }));

app.use(cors({
  origin: "*"
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(process.env.UPLOADS_DIR || './uploads'));
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

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

app.use((req, res, next) => { req.io = io; next(); });

connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/educonnect')
  .then(() => server.listen(PORT, () => console.log(`Server listening on ${PORT}`)))
  .catch(err => console.error('DB connect failed', err));
