const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const { globalRateLimit } = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/video.routes');
const audioRoutes = require('./routes/audio.routes');
const thumbnailRoutes = require('./routes/thumbnail.routes');
const subtitleRoutes = require('./routes/subtitle.routes');
const playlistRoutes = require('./routes/playlist.routes');
const shortsRoutes = require('./routes/shorts.routes');
const metadataRoutes = require('./routes/metadata.routes');
const historyRoutes = require('./routes/history.routes');

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://i.ytimg.com", "https://img.youtube.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Sanitization ───────────────────────────────────────────────────────────
app.use(mongoSanitize());

// ─── Compression ────────────────────────────────────────────────────────────
app.use(compression());

// ─── Logging ────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));
}

// ─── Rate Limiting ──────────────────────────────────────────────────────────
app.use('/api/', globalRateLimit);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'XRSave-YT API is running', timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/thumbnail', thumbnailRoutes);
app.use('/api/subtitle', subtitleRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/shorts', shortsRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/history', historyRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
