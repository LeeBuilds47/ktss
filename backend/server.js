'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { URL } = require('node:url');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const SITE_ROOT = path.resolve(__dirname, '..');
const BACKEND_ROOT = path.resolve(__dirname);
const DATA_DIR = path.resolve(process.env.KTSS_DATA_DIR || path.join(__dirname, 'data'));
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const MAX_PAGE_SIZE = 100;
const VALID_STATUSES = new Set(['new', 'reviewing', 'accepted', 'rejected']);
const sessions = new Map();
const loginAttempts = new Map();
const applicationAttempts = new Map();
let writeQueue = Promise.resolve();

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp'
};

function sendJson(res, status, value, headers = {}) {
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  res.end(JSON.stringify(value));
}

function fail(res, status, message) {
  sendJson(res, status, { error: message });
}

function safeEqual(left, right) {
  const leftHash = crypto.createHash('sha256').update(String(left)).digest();
  const rightHash = crypto.createHash('sha256').update(String(right)).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function readCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map((part) => {
    const index = part.indexOf('=');
    if (index < 0) return ['', ''];
    const value = part.slice(index + 1).trim();
    try { return [part.slice(0, index).trim(), decodeURIComponent(value)]; }
    catch { return [part.slice(0, index).trim(), '']; }
  }).filter(([key]) => key));
}

function sessionFor(req) {
  const token = readCookies(req).ktss_admin;
  const session = token && sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return { token, session };
}

function requireSameOrigin(req, res) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const host = req.headers.host;
  let originHost;
  try { originHost = new URL(origin).host; } catch { originHost = ''; }
  if (!host || originHost !== host) {
    fail(res, 403, 'Request origin is not allowed.');
    return false;
  }
  return true;
}

async function readJson(req) {
  let bytes = 0;
  const chunks = [];
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      const error = new Error('Request is too large.');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request must contain valid JSON.');
    error.status = 400;
    throw error;
  }
}

async function readApplications() {
  try {
    const content = await fs.readFile(APPLICATIONS_FILE, 'utf8');
    const applications = JSON.parse(content);
    if (!Array.isArray(applications)) throw new Error('Application storage must be a JSON array.');
    return applications;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeApplications(applications) {
  await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
  const temporaryFile = `${APPLICATIONS_FILE}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporaryFile, JSON.stringify(applications, null, 2), { mode: 0o600 });
    await fs.rename(temporaryFile, APPLICATIONS_FILE);
  } catch (error) {
    await fs.unlink(temporaryFile).catch((cleanupError) => {
      if (cleanupError.code !== 'ENOENT') console.error('Unable to remove temporary application data:', cleanupError);
    });
    throw error;
  }
}

function mutateApplications(mutation) {
  const task = writeQueue.then(async () => {
    const applications = await readApplications();
    const result = await mutation(applications);
    await writeApplications(applications);
    return result;
  });
  writeQueue = task.then(() => undefined, () => undefined);
  return task;
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function validateApplication(body) {
  const application = {
    firstName: cleanText(body.firstName, 100),
    lastName: cleanText(body.lastName, 100),
    gender: cleanText(body.gender, 20),
    dateOfBirth: cleanText(body.dateOfBirth, 10),
    program: cleanText(body.program, 30),
    nationality: cleanText(body.nationality, 100),
    residence: cleanText(body.residence, 200),
    phone: cleanText(body.phone, 40),
    email: cleanText(body.email, 254).toLowerCase(),
    guardianName: cleanText(body.guardianName, 200),
    guardianPhone: cleanText(body.guardianPhone, 40),
    healthInsurance: cleanText(body.healthInsurance, 100)
  };
  const errors = [];
  if (application.firstName.length < 1) errors.push('First name is required.');
  if (application.lastName.length < 1) errors.push('Last name is required.');
  if (!['Female', 'Male'].includes(application.gender)) errors.push('Choose a valid gender.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(application.dateOfBirth)
    || Number.isNaN(Date.parse(`${application.dateOfBirth}T00:00:00Z`))
    || new Date(`${application.dateOfBirth}T00:00:00Z`).toISOString().slice(0, 10) !== application.dateOfBirth
    || application.dateOfBirth > new Date().toISOString().slice(0, 10)) {
    errors.push('Choose a valid date of birth.');
  }
  if (!['olevel', 'software', 'accounting'].includes(application.program)) errors.push('Choose a valid program.');
  if (application.phone.replace(/\D/g, '').length < 9) errors.push('Enter a valid phone number.');
  if (application.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) errors.push('Enter a valid email address.');
  if (application.guardianName.length < 1) errors.push('Parent or guardian name is required.');
  if (application.guardianPhone.replace(/\D/g, '').length < 9) errors.push('Enter a valid parent or guardian phone number.');
  return { application, errors };
}

async function storePhoto(dataUrl) {
  if (dataUrl === undefined || dataUrl === null || dataUrl === '') return null;
  if (typeof dataUrl !== 'string' || dataUrl.length > 3_000_000) {
    const error = new Error('Passport photo must be smaller than 2 MB.');
    error.status = 400;
    throw error;
  }
  const match = dataUrl.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) {
    const error = new Error('Passport photo must be a JPG, PNG, or WEBP image.');
    error.status = 400;
    throw error;
  }
  const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 2 * 1024 * 1024) {
    const error = new Error('Passport photo must be smaller than 2 MB.');
    error.status = 400;
    throw error;
  }
  const signatures = {
    jpeg: buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
    png: buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    webp: buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
  };
  if (!signatures[match[1]]) {
    const error = new Error('The passport photo file does not match its image type.');
    error.status = 400;
    throw error;
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const fileName = `${crypto.randomUUID()}.${extension}`;
  await fs.writeFile(path.join(UPLOADS_DIR, fileName), buffer, { flag: 'wx', mode: 0o600 });
  return { fileName, mimeType: `image/${match[1]}` };
}

function applicationMatches(application, params) {
  const query = (params.get('q') || '').trim().toLowerCase();
  if (query) {
    const searchable = [
      application.firstName, application.lastName, application.email, application.phone,
      application.guardianName, application.guardianPhone, application.id
    ].join(' ').toLowerCase();
    if (!searchable.includes(query)) return false;
  }
  if (params.has('status') && params.get('status') !== 'all' && application.status !== params.get('status')) return false;
  if (params.has('program') && params.get('program') !== 'all' && application.program !== params.get('program')) return false;
  if (params.has('from') && application.createdAt.slice(0, 10) < params.get('from')) return false;
  if (params.has('to') && application.createdAt.slice(0, 10) > params.get('to')) return false;
  return true;
}

function publicApplication(application) {
  const { photoFile, photoMimeType, adminNotes, ...visible } = application;
  return { ...visible, hasPhoto: Boolean(photoFile) };
}

function makeCsv(applications) {
  const columns = [
    ['id', 'Request ID'], ['createdAt', 'Submitted at'], ['status', 'Status'],
    ['firstName', 'First name'], ['lastName', 'Last name'], ['gender', 'Gender'],
    ['dateOfBirth', 'Date of birth'], ['program', 'Program'], ['nationality', 'Nationality'],
    ['residence', 'Residence'], ['phone', 'Phone'], ['email', 'Email'],
    ['guardianName', 'Parent/guardian'], ['guardianPhone', 'Parent/guardian phone'],
    ['healthInsurance', 'Health insurance'], ['adminNotes', 'Admin notes']
  ];
  const cell = (value) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [columns.map(([, label]) => cell(label)).join(','), ...applications.map((application) =>
    columns.map(([key]) => cell(application[key])).join(',')
  )].join('\r\n');
}

function rateLimitKey(req) {
  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(req) {
  const key = rateLimitKey(req);
  const now = Date.now();
  const attempts = (loginAttempts.get(key) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (attempts.length >= 5) {
    loginAttempts.set(key, attempts);
    return true;
  }
  attempts.push(now);
  loginAttempts.set(key, attempts);
  return false;
}

function isApplicationRateLimited(req) {
  const key = rateLimitKey(req);
  const now = Date.now();
  const attempts = (applicationAttempts.get(key) || []).filter((time) => now - time < 60 * 60 * 1000);
  if (attempts.length >= 20) {
    applicationAttempts.set(key, attempts);
    return true;
  }
  attempts.push(now);
  applicationAttempts.set(key, attempts);
  return false;
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true });
  }
  if (pathname === '/api/applications' && req.method === 'POST') {
    if (isApplicationRateLimited(req)) return fail(res, 429, 'Too many applications were submitted from this connection. Please try again later.');
    if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      return fail(res, 415, 'Application must be submitted as JSON.');
    }
    let body;
    try { body = await readJson(req); } catch (error) { return fail(res, error.status || 400, error.message); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(res, 400, 'Application data is invalid.');
    const { application, errors } = validateApplication(body);
    if (errors.length) return sendJson(res, 422, { errors });
    let photo;
    try { photo = await storePhoto(body.photoDataUrl); } catch (error) { return fail(res, error.status || 400, error.message); }
    application.id = crypto.randomUUID();
    application.createdAt = new Date().toISOString();
    application.updatedAt = application.createdAt;
    application.status = 'new';
    application.adminNotes = '';
    if (photo) {
      application.photoFile = photo.fileName;
      application.photoMimeType = photo.mimeType;
    }
    try {
      await mutateApplications((applications) => applications.push(application));
      return sendJson(res, 201, { id: application.id, status: application.status });
    } catch (error) {
      console.error('Unable to save application:', error);
      return fail(res, 500, 'Could not save your application. Please try again later.');
    }
  }
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    if (!requireSameOrigin(req, res)) return;
    if (isRateLimited(req)) return fail(res, 429, 'Too many login attempts. Please wait 15 minutes and try again.');
    if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      return fail(res, 415, 'Login details must be submitted as JSON.');
    }
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      return fail(res, 503, 'Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in backend/.env.');
    }
    let body;
    try { body = await readJson(req); } catch (error) { return fail(res, error.status || 400, error.message); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(res, 400, 'Login details are invalid.');
    if (!safeEqual(body.username || '', process.env.ADMIN_USERNAME) || !safeEqual(body.password || '', process.env.ADMIN_PASSWORD)) {
      return fail(res, 401, 'Username or password is incorrect.');
    }
    const token = crypto.randomBytes(32).toString('base64url');
    sessions.set(token, { expiresAt: Date.now() + SESSION_TTL_MS });
    loginAttempts.delete(rateLimitKey(req));
    const secure = req.socket.encrypted ? '; Secure' : '';
    return sendJson(res, 200, { ok: true }, {
      'Set-Cookie': `ktss_admin=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${secure}`
    });
  }
  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    if (!requireSameOrigin(req, res)) return;
    const token = readCookies(req).ktss_admin;
    if (token) sessions.delete(token);
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': 'ktss_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
  }
  const auth = sessionFor(req);
  if (!auth) return fail(res, 401, 'Sign in to view applications.');
  if (pathname === '/api/admin/applications/export.csv' && req.method === 'GET') {
    try {
      const applications = (await readApplications()).filter((application) => applicationMatches(application, searchParams))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Disposition': 'attachment; filename="ktss-applications.csv"',
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      });
      return res.end(`\ufeff${makeCsv(applications)}`);
    } catch (error) {
      console.error('Unable to export applications:', error);
      return fail(res, 500, 'Could not export applications.');
    }
  }
  if (pathname === '/api/admin/applications' && req.method === 'GET') {
    try {
      const all = await readApplications();
      const filtered = all.filter((application) => applicationMatches(application, searchParams))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
      const perPage = Math.min(MAX_PAGE_SIZE, Math.max(1, Number.parseInt(searchParams.get('perPage') || '25', 10) || 25));
      const counts = { all: all.length, new: 0, reviewing: 0, accepted: 0, rejected: 0 };
      all.forEach((application) => { if (counts[application.status] !== undefined) counts[application.status] += 1; });
      return sendJson(res, 200, {
        items: filtered.slice((page - 1) * perPage, page * perPage).map(publicApplication),
        total: filtered.length,
        page,
        perPage,
        pages: Math.max(1, Math.ceil(filtered.length / perPage)),
        counts
      });
    } catch (error) {
      console.error('Unable to read applications:', error);
      return fail(res, 500, 'Could not load applications.');
    }
  }
  const detailMatch = pathname.match(/^\/api\/admin\/applications\/([0-9a-f-]{36})(?:\/(photo))?$/i);
  if (detailMatch && detailMatch[2] === 'photo' && req.method === 'GET') {
    try {
      const application = (await readApplications()).find((item) => item.id === detailMatch[1]);
      if (!application || !application.photoFile) return fail(res, 404, 'Photo not found.');
      const photoPath = path.join(UPLOADS_DIR, path.basename(application.photoFile));
      const photo = await fs.readFile(photoPath);
      res.writeHead(200, {
        'Cache-Control': 'private, no-store',
        'Content-Length': photo.length,
        'Content-Security-Policy': "default-src 'none'; sandbox",
        'Content-Type': application.photoMimeType,
        'X-Content-Type-Options': 'nosniff'
      });
      return res.end(photo);
    } catch (error) {
      if (error.code === 'ENOENT') return fail(res, 404, 'Photo not found.');
      console.error('Unable to read application photo:', error);
      return fail(res, 500, 'Could not load the application photo.');
    }
  }
  if (detailMatch && !detailMatch[2] && req.method === 'GET') {
    try {
      const application = (await readApplications()).find((item) => item.id === detailMatch[1]);
      if (!application) return fail(res, 404, 'Application not found.');
      return sendJson(res, 200, application);
    } catch (error) {
      console.error('Unable to read application:', error);
      return fail(res, 500, 'Could not load this application.');
    }
  }
  if (detailMatch && !detailMatch[2] && req.method === 'PATCH') {
    if (!requireSameOrigin(req, res)) return;
    if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      return fail(res, 415, 'Application update must be submitted as JSON.');
    }
    let body;
    try { body = await readJson(req); } catch (error) { return fail(res, error.status || 400, error.message); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(res, 400, 'Application update is invalid.');
    if (!VALID_STATUSES.has(body.status)) return fail(res, 400, 'Choose a valid application status.');
    if (typeof body.adminNotes !== 'string' || body.adminNotes.length > 4000) return fail(res, 400, 'Admin notes must be 4,000 characters or fewer.');
    try {
      const updated = await mutateApplications((applications) => {
        const application = applications.find((item) => item.id === detailMatch[1]);
        if (!application) return null;
        application.status = body.status;
        application.adminNotes = body.adminNotes.trim();
        application.updatedAt = new Date().toISOString();
        return application;
      });
      if (!updated) return fail(res, 404, 'Application not found.');
      return sendJson(res, 200, updated);
    } catch (error) {
      console.error('Unable to update application:', error);
      return fail(res, 500, 'Could not update this application.');
    }
  }
  return fail(res, 404, 'API endpoint not found.');
}

async function handleStatic(req, res, url) {
  let decodedPath;
  try { decodedPath = decodeURIComponent(url.pathname); } catch { return fail(res, 400, 'Invalid URL path.'); }
  if (decodedPath.includes('\0') || decodedPath.split('/').some((part) => part.startsWith('.'))) {
    return fail(res, 404, 'Not found.');
  }
  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const filePath = path.resolve(SITE_ROOT, relativePath);
  if (filePath !== SITE_ROOT && !filePath.startsWith(SITE_ROOT + path.sep)) return fail(res, 403, 'Not allowed.');
  if (filePath === BACKEND_ROOT || filePath.startsWith(BACKEND_ROOT + path.sep)) return fail(res, 404, 'Not found.');
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return fail(res, 404, 'Not found.');
    const content = await fs.readFile(filePath);
    res.writeHead(200, {
      'Cache-Control': path.extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=3600',
      'Content-Length': content.length,
      'Content-Security-Policy': "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com data:; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    });
    if (req.method === 'HEAD') return res.end();
    return res.end(content);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return fail(res, 404, 'Not found.');
    throw error;
  }
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'OPTIONS') {
    if (!requireSameOrigin(req, res)) return;
    res.writeHead(204, { Allow: 'GET, HEAD, POST, PATCH, OPTIONS' });
    return res.end();
  }
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return fail(res, 405, 'Method not allowed.');
  }
  return handleStatic(req, res, url);
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error('Unhandled server request error:', error);
    if (!res.headersSent) fail(res, 500, 'An unexpected server error occurred.');
    else res.destroy(error);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`KTSS site and application dashboard running at http://${HOST}:${PORT}`);
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.warn('Admin sign-in is disabled until ADMIN_USERNAME and ADMIN_PASSWORD are set in backend/.env.');
  }
});

function stopServer() {
  server.close((error) => {
    if (error) {
      console.error('Could not shut down cleanly:', error);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);
