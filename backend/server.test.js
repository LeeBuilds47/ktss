'use strict';

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { once } = require('node:events');
const { test } = require('node:test');

const serverPath = path.join(__dirname, 'server.js');

async function unusedPort() {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return port;
}

test('application requests are stored and only visible to signed-in admins', async (t) => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ktss-admin-test-'));
  const port = await unusedPort();
  const child = spawn(process.execPath, [serverPath], {
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(port),
      ADMIN_USERNAME: 'test-admin',
      ADMIN_PASSWORD: 'unique-test-password',
      KTSS_DATA_DIR: dataDir
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const baseUrl = `http://127.0.0.1:${port}`;
  t.after(async () => {
    child.kill('SIGKILL');
    await Promise.race([once(child, 'exit'), new Promise(resolve => setTimeout(resolve, 3000))]);
    await fs.rm(dataDir, { recursive: true, force: true });
  });

  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) assert.fail(`Server exited before ready: ${output}`);
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(ready, true, `Server did not start: ${output}`);

  const unauthenticated = await fetch(`${baseUrl}/api/admin/applications`);
  assert.equal(unauthenticated.status, 401);

  const application = {
    firstName: '=4+1',
    lastName: 'Test Student',
    gender: 'Female',
    dateOfBirth: '2008-05-04',
    program: 'software',
    nationality: 'Rwandan',
    residence: 'Kigali',
    phone: '+250788123456',
    email: 'student@example.test',
    guardianName: 'Parent Example',
    guardianPhone: '+250788654321',
    healthInsurance: 'RSSB',
    photoDataUrl: 'data:image/jpeg;base64,/9j/'
  };
  const submissionResponse = await fetch(`${baseUrl}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  });
  assert.equal(submissionResponse.status, 201);
  const submission = await submissionResponse.json();
  assert.match(submission.id, /^[0-9a-f-]{36}$/i);

  const invalidDate = await fetch(`${baseUrl}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...application, dateOfBirth: '2008-02-31', photoDataUrl: '' })
  });
  assert.equal(invalidDate.status, 422);

  const badLogin = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test-admin', password: 'wrong-password' })
  });
  assert.equal(badLogin.status, 401);
  const login = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test-admin', password: 'unique-test-password' })
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';', 1)[0];

  const requestsResponse = await fetch(`${baseUrl}/api/admin/applications?q=student&program=software`, {
    headers: { Cookie: cookie }
  });
  assert.equal(requestsResponse.status, 200);
  const requests = await requestsResponse.json();
  assert.equal(requests.total, 1);
  assert.equal(requests.items[0].id, submission.id);
  assert.equal(requests.items[0].hasPhoto, true);
  assert.equal(Object.hasOwn(requests.items[0], 'adminNotes'), false);

  const detail = await fetch(`${baseUrl}/api/admin/applications/${submission.id}`, { headers: { Cookie: cookie } });
  assert.equal(detail.status, 200);
  assert.equal((await detail.json()).firstName, '=4+1');
  const photo = await fetch(`${baseUrl}/api/admin/applications/${submission.id}/photo`, { headers: { Cookie: cookie } });
  assert.equal(photo.status, 200);
  assert.equal(photo.headers.get('content-type'), 'image/jpeg');

  const update = await fetch(`${baseUrl}/api/admin/applications/${submission.id}`, {
    method: 'PATCH',
    headers: { Cookie: cookie, 'Content-Type': 'application/json', Origin: baseUrl },
    body: JSON.stringify({ status: 'reviewing', adminNotes: 'Call the parent.' })
  });
  assert.equal(update.status, 200);
  const updated = await update.json();
  assert.equal(updated.status, 'reviewing');
  assert.equal(updated.adminNotes, 'Call the parent.');

  const exportResponse = await fetch(`${baseUrl}/api/admin/applications/export.csv`, { headers: { Cookie: cookie } });
  assert.equal(exportResponse.status, 200);
  const csv = await exportResponse.text();
  assert.match(csv, /'=\s*4\+1/);
  assert.match(csv, /Call the parent\./);

  const privateData = await fetch(`${baseUrl}/backend/data/applications.json`);
  assert.equal(privateData.status, 404);
  const logout = await fetch(`${baseUrl}/api/admin/logout`, {
    method: 'POST',
    headers: { Cookie: cookie, Origin: baseUrl }
  });
  assert.equal(logout.status, 200);
  const afterLogout = await fetch(`${baseUrl}/api/admin/applications`, { headers: { Cookie: cookie } });
  assert.equal(afterLogout.status, 401);
});
