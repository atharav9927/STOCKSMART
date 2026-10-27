const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const DIST_DIR = path.join(__dirname, 'dist', 'stocksmart', 'browser');

// Enable gzip / brotli compression for static assets
app.use(compression());

// Cache control headers for static bundles
app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // Don't cache index.html so users always get the latest SPA version
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// SPA fallback: any request that doesn't match a static file serves index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[STOCKSMART] Production server running on http://0.0.0.0:${PORT}`);
  console.log(`[STOCKSMART] Serving static build from: ${DIST_DIR}`);
});
