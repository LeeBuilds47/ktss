const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv');

const backendDir = __dirname;
const projectRoot = path.join(backendDir, '..');
const envPath = path.join(backendDir, '.env');

dotenv.config({ path: envPath });

const app = express();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123';
const DATA_DIR = path.resolve(process.env.KTSS_DATA_DIR || path.join(backendDir, 'data'));
const APPLICATIONS_PATH = path.join(DATA_DIR, 'applications.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

const activeSessions = new Set();

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

if (!fs.existsSync(APPLICATIONS_PATH)) {
  fs.writeFileSync(APPLICATIONS_PATH, '[]', 'utf8');
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  req.admin = { username: ADMIN_USERNAME };
  next();
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'ktss-site', adminConfigured: true });
});

app.post('/api/admin/login', (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '').trim();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(24).toString('hex');
    activeSessions.add(token);
    return res.json({ ok: true, username: ADMIN_USERNAME, token });
  }

  return res.status(401).json({ ok: false, message: 'Invalid username or password' });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ ok: true, username: req.admin.username });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    activeSessions.delete(token);
  }

  res.json({ ok: true });
});

app.get('/api/applications', requireAdmin, (req, res) => {
  try {
    const payload = JSON.parse(fs.readFileSync(APPLICATIONS_PATH, 'utf8') || '[]');
    res.json({ ok: true, applications: Array.isArray(payload) ? payload : [] });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Could not read applications data.' });
  }
});

app.post('/api/applications', (req, res) => {
  try {
    const payload = JSON.parse(fs.readFileSync(APPLICATIONS_PATH, 'utf8') || '[]');
    const next = Array.isArray(payload) ? payload : [];
    const application = {
      id: `KTSS-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ...req.body
    };
    next.push(application);
    fs.writeFileSync(APPLICATIONS_PATH, JSON.stringify(next, null, 2), 'utf8');
    res.status(201).json({ ok: true, application });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to save application.' });
  }
});

app.use(express.static(projectRoot, { index: 'index.html', extensions: ['html'] }));

app.get(/\.(js|css|png|jpg|jpeg|gif|svg|pdf|webp|ico|json)$/i, (req, res, next) => {
  const safePath = path.join(projectRoot, req.path);
  if (!safePath.startsWith(projectRoot)) {
    return res.status(403).send('Forbidden');
  }
  res.sendFile(safePath, (error) => {
    if (error) next();
  });
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const requestPath = path.join(projectRoot, req.path);
  const isFolder = fs.existsSync(requestPath) && fs.statSync(requestPath).isDirectory();

  if (isFolder) {
    return res.sendFile(path.join(projectRoot, 'index.html'));
  }

  const filePath = path.join(projectRoot, req.path);
  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    return res.sendFile(filePath);
  }

  return res.sendFile(path.join(projectRoot, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`KTSS site running at http://${HOST}:${PORT}`);
  console.log(`Admin login: username=${ADMIN_USERNAME}, password=${ADMIN_PASSWORD}`);
});
