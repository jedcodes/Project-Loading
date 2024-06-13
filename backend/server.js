import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import morgan from 'morgan';
import { createServer } from 'http';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';

import connectDB from './src/config/db.js';
import './src/config/passport.js';
import { setupSocket } from './src/config/socketConfig.js';
import authRouter from './src/routes/authRoutes.js';
import gameBoardRouter from './src/routes/gameBoardRoutes.js';
import userRouter from './src/routes/userRoutes.js';
import qnARouter from './src/routes/qnARoutes.js';
import loadingScreenRouter from './src/routes/loadingScreenRoutes.js';
import adminRouter from './src/routes/adminRoutes.js';
import feedbackRouter from './src/routes/feedbackRoutes.js';
import API_Documentation from './src/API_Documentation.js';
import scheduleCronJobs from './src/config/cronJobs.js';

dotenv.config({ path: './src/config/config.env' });
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "http://localhost:5173"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:5173"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/qna', qnARouter);
app.use('/admin', adminRouter);
app.use('/feedback', feedbackRouter);
app.use('/loadingScreen', loadingScreenRouter);
app.use('/gameboard', gameBoardRouter);

const apiDocs = new API_Documentation(app);
apiDocs.setup();

app.get('/', (req, res) => {
  res.send('Hello World, the frontend server is on port 5173');
});

app.get('/test', (req, res) => {
  res.send('Hello, World!');
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Create HTTP server and setup WebSocket server
const server = createServer(app);
const io = setupSocket(server);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log('A user joined room:', room);
  });

  socket.on('leave', (room) => {
    socket.leave(room);
    console.log('A user left room:', room);
  });

  socket.on('message', (data) => {
    console.log('Received message from client:', data);
    socket.to(data.room).emit('message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });

  // Additional real-time events here
  socket.on('sendAction', (data) => {
    console.log('Action received:', data);
    socket.broadcast.emit('actionReceived', data);
  });
});

// Schedule the cron jobs
scheduleCronJobs();

// Start the server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export { app, server, io };
