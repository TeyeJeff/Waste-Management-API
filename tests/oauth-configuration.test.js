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

test('Google callback explains when the browser did not return the OAuth state cookie', async () => {
  process.env.GOOGLE_CLIENT_ID = 'test-client-id';
  process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

  try {
    const response = await fetch(`${baseUrl}/auth/google/callback?state=test-state`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      body.message,
      'OAuth state cookie was not returned by the browser; start sign-in again on this host',
    );
  } finally {
    if (previousClientId === undefined) delete process.env.GOOGLE_CLIENT_ID;
    else process.env.GOOGLE_CLIENT_ID = previousClientId;
    if (previousClientSecret === undefined) delete process.env.GOOGLE_CLIENT_SECRET;
    else process.env.GOOGLE_CLIENT_SECRET = previousClientSecret;
  }
});

test('Google callback explains when the cookie and callback OAuth states differ', async () => {
  process.env.GOOGLE_CLIENT_ID = 'test-client-id';
  process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

  try {
    const response = await fetch(`${baseUrl}/auth/google/callback?state=0123456789`, {
      headers: { cookie: 'oauth_state=abcdefghij' },
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      body.message,
      'OAuth state does not match the sign-in request; start sign-in again',
    );
  } finally {
    if (previousClientId === undefined) delete process.env.GOOGLE_CLIENT_ID;
    else process.env.GOOGLE_CLIENT_ID = previousClientId;
    if (previousClientSecret === undefined) delete process.env.GOOGLE_CLIENT_SECRET;
    else process.env.GOOGLE_CLIENT_SECRET = previousClientSecret;
  }
});
