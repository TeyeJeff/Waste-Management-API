const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../routes/users');
const wasteRequests = require('../routes/wasteRequests');
const collections = require('../routes/collections');
const feedback = require('../routes/feedback');

const previousSecret = process.env.JWT_SECRET;
const secret = 'validation-test-secret';
const app = express();
let server;
let baseUrl;

app.use(express.json());
app.use('/api/users', users);
app.use('/api/wasteRequests', wasteRequests);
app.use('/api/collections', collections);
app.use('/api/feedback', feedback);

before(async () => {
  process.env.JWT_SECRET = secret;
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  if (previousSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = previousSecret;
});

test('collection and feedback POST reject missing required fields with HTTP 400', async () => {
  const token = jwt.sign({ sub: 'test-user' }, secret);
  for (const path of ['/api/collections', '/api/feedback']) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: '{}',
    });
    assert.equal(response.status, 400, `POST ${path}`);
  }
});

test('collection and feedback PUT reject empty updates with HTTP 400', async () => {
  const token = jwt.sign({ sub: 'test-user' }, secret);
  const id = '650c1f1f1f1f1f1f1f1f1f1f';
  for (const path of ['/api/collections', '/api/feedback']) {
    const response = await fetch(`${baseUrl}${path}/${id}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: '{}',
    });
    assert.equal(response.status, 400, `PUT ${path}`);
  }
});

test('every POST, PUT, and DELETE route requires a Bearer token', async () => {
  for (const path of [
    '/api/users',
    '/api/wasteRequests',
    '/api/collections',
    '/api/feedback',
  ]) {
    for (const method of ['POST', 'PUT', 'DELETE']) {
      const url = method === 'POST' ? path : `${path}/650c1f1f1f1f1f1f1f1f1f1f`;
      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: { 'content-type': 'application/json' },
        body: method === 'DELETE' ? undefined : '{}',
      });
      assert.equal(response.status, 401, `${method} ${url}`);
    }
  }
});
