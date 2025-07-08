const express = require('express');
const mongoose = require('mongoose');
const serveStatic = require('serve-static');
const path = require('path');
const cron = require('node-cron');
const {exportAndBackupAllCollectionsmonthly} = require("./controller/Backup")
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const NodeCache = require('node-cache');

const app = express();
//hellow
app.use(compression({
  level: 6,
  threshold: '5kb'
}));

app.use(express.json({
  limit: '1mb',
  strict: true
}));

app.use(express.urlencoded({
  limit: '1mb',
  extended: true,
  parameterLimit: 500
}));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1000
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

cron.schedule('59 23 31 * *', () => {
    exportAndBackupAllCollectionsmonthly();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" 
}); 

app.use('/uploads', serveStatic(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://admin:admin@devcoder980.64axway.mongodb.net/ostech');

const cache = new NodeCache({ 
  stdTTL: 300,
  checkperiod: 600,
  useClones: false
});

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.send(cachedResponse);
      return;
    }

    const originalSend = res.send;
    res.send = function(body) {
      originalSend.call(this, body);
      cache.set(key, body, duration);
    };

    next();
  };
};

// Routes
app.use('/api/product', cacheMiddleware(300), require('./routes/product'));
app.use('/api/services', cacheMiddleware(300), require('./routes/services'));
app.use('/api/news', cacheMiddleware(300), require('./routes/news'));
app.use('/api/pageHeading', cacheMiddleware(300), require('./routes/pageHeading'));
app.use('/api/image', cacheMiddleware(300), require('./routes/image'));
app.use('/api/testimonial', cacheMiddleware(300), require('./routes/testinomial'));
app.use('/api/faq', cacheMiddleware(300), require('./routes/FAQ'));
app.use('/api/staff', cacheMiddleware(300), require('./routes/ourStaff'));
app.use('/api/banner', require('./routes/Banner'));
app.use('/api/pageContent', cacheMiddleware(300), require('./routes/pageContent'));
app.use('/api/gallery', cacheMiddleware(300), require('./routes/galleryImage'));
app.use('/api/admin',  require('./routes/admin'));
app.use('/api/password', cacheMiddleware(300), require('./routes/forgotpassword'));
app.use('/api/email', cacheMiddleware(300), require('./routes/email'));
app.use('/api/partner', cacheMiddleware(300), require('./routes/partners'));
app.use('/api/logo', cacheMiddleware(300), require('./routes/logo'));
app.use('/api/backup', cacheMiddleware(300), require('./routes/backup'));
app.use('/api/aboutusPoints', cacheMiddleware(300), require('./routes/aboutuspoints'));
app.use("/api/achievements", cacheMiddleware(300), require('./routes/achievements'));
app.use("/api/counter", cacheMiddleware(300), require('./routes/counter'));
app.use("/api/inquiries", cacheMiddleware(300), require('./routes/inquiry'));
app.use("/api/mission", cacheMiddleware(300), require('./routes/mission'));
app.use("/api/vision", cacheMiddleware(300), require('./routes/vision'));
app.use("/api/corevalue", cacheMiddleware(300), require('./routes/corevalue'));
app.use("/api/aboutcompany", cacheMiddleware(300), require('./routes/aboutcompany'));
app.use("/api/careeroption", cacheMiddleware(300), require('./routes/careeroption'));
app.use("/api/careerInquiries", cacheMiddleware(300), require('./routes/careerinquiry'));
app.use("/api/footer", cacheMiddleware(300), require('./routes/footer'));
app.use("/api/header", cacheMiddleware(300), require('./routes/header'));
app.use("/api/globalpresence", cacheMiddleware(300), require('./routes/globalpresence'));
app.use("/api/whatsappsettings", cacheMiddleware(300), require('./routes/whatsappsettings'));
app.use("/api/googlesettings", cacheMiddleware(300), require('./routes/googlesettings'));
app.use("/api/menulisting", cacheMiddleware(300), require('./routes/menulisting'));
app.use("/api/infrastructure", cacheMiddleware(300), require('./routes/infrastructure'));
app.use("/api/qualitycontrol", cacheMiddleware(300), require('./routes/qualitycontrol'));
app.use("/api/sitemap", cacheMiddleware(300), require('./routes/sitemap'));
app.use("/api/benefits", cacheMiddleware(300), require('./routes/benefits'));
app.use("/api/mainMission", cacheMiddleware(300), require('./routes/mainMission'));
app.use("/api/whyChooseUs", cacheMiddleware(300), require('./routes/whyChooseUs'));
app.use("/api/video", cacheMiddleware(300), require('./routes/video'));
app.use("/api/banner1", cacheMiddleware(300), require('./routes/homeYoutubeBanner'));
app.use("/api/upload", cacheMiddleware(300), require('./routes/upload'));
app.use("/api/productInquiry", cacheMiddleware(300), require('./routes/productInquiry'));
app.use("/api/infographic", cacheMiddleware(300), require('./routes/infographic'));
app.use("/api/ourCapabilityService", cacheMiddleware(300), require('./routes/ourCapabilityService'));
app.use("/api/ourProcess", require('./routes/ourProcess'));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3001;

const RESOURCE_LIMITS = {
  MAX_MEMORY_MB: 1024,
  MAX_HEAP_MB: 512,
  IO_LIMIT_MB: 5,
  PROCESS_LIMIT: 50
};

const monitorResources = () => {
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  const rssUsedMB = Math.round(used.rss / 1024 / 1024);
  const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);
  
  if (heapUsedMB > RESOURCE_LIMITS.MAX_HEAP_MB * 0.7) {
    console.log('\n⚠️ High Memory Usage Detected');
    if (global.gc) global.gc();
  }
  
  if (rssUsedMB > RESOURCE_LIMITS.MAX_MEMORY_MB * 0.95) {
    console.error('\n🚨 CRITICAL: Memory Usage Exceeded');
    process.emit('SIGTERM');
  }
};

function startServer() {
  const server = http.createServer(app);
  
  server.keepAliveTimeout = 30000;
  server.headersTimeout = 35000;
  server.maxHeadersCount = 100;

  const monitoringInterval = setInterval(monitorResources, 5000);
  
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

app.post('/api/cache/clear', (req, res) => {
  cache.flushAll();
  res.json({ message: 'Cache cleared successfully' });
});

startServer();

module.exports = app; 