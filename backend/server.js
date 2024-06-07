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
import API_Documentation from './src/API_Documentation.js';

dotenv.config({ path: './src/config/config.env' });
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Security middleware
app.use(helmet());
app.use(cors());

// Parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the React app
app.use(express.static(join(__dirname, '../frontend/build')));

// Flash messages middleware
app.use(flash());
app.use(methodOverride('_method'));

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Middleware to handle different domains
app.use((req, res, next) => {
    if (req.hostname === 'example.loading.no') { // Gameboard domain
        app.use('/gameboard', gameBoardRouter);
    } else {
        app.use('/auth', authRouter);
        app.use('/user', userRouter);
        app.use('/qna', qnARouter);
    }
    next();
});

// API Documentation setup
const apiDocs = new API_Documentation(app);
apiDocs.setup();

// Create HTTP server and setup WebSocket server
const server = createServer(app);
const io = setupSocket(server);  // Setup WebSocket communication

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Additional real-time events here
    socket.on('sendAction', (data) => {
        console.log('Action received:', data);
        socket.broadcast.emit('actionReceived', data);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export { app, server, io };
