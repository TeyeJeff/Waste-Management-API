const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const express = require('express');
const { router } = require('../auth/oauth');

const previousClientId = process.env.GOOGLE_CLIENT_ID;
const previousClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const app = express();
let server;
let baseUrl;

delete process.env.GOOGLE_CLIENT_ID;
delete process.env.GOOGLE_CLIENT_SECRET;
app.use('/auth', router);

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  if (previousClientId === undefined) delete process.env.GOOGLE_CLIENT_ID;
  else process.env.GOOGLE_CLIENT_ID = previousClientId;
  if (previousClientSecret === undefined) delete process.env.GOOGLE_CLIENT_SECRET;
  else process.env.GOOGLE_CLIENT_SECRET = previousClientSecret;
});

test('Google sign-in reports missing OAuth configuration with HTTP 503', async () => {
  const response = await fetch(`${baseUrl}/auth/google`);
  assert.equal(response.status, 503);
});
