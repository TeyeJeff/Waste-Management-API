const assert = require('node:assert/strict');
const test = require('node:test');
const jwt = require('jsonwebtoken');
const authenticate = require('../auth/authenticate');

const makeResponse = () => ({
  statusCode: undefined,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(value) {
    this.body = value;
    return this;
  },
});

test('protected route rejects requests without a Bearer token', () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret';
  try {
    const res = makeResponse();
    let continued = false;
    authenticate({ get: () => undefined }, res, () => {
      continued = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(continued, false);
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test('protected route accepts a valid Bearer token', () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret';
  try {
    const token = jwt.sign({ role: 'google-user' }, process.env.JWT_SECRET);
    const req = { get: () => `Bearer ${token}` };
    const res = makeResponse();
    let continued = false;
    authenticate(req, res, () => {
      continued = true;
    });

    assert.equal(continued, true);
    assert.equal(req.auth.role, 'google-user');
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test('protected route rejects an invalid Bearer token', () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret';
  try {
    const res = makeResponse();
    let continued = false;
    authenticate({ get: () => 'Bearer invalid-token' }, res, () => {
      continued = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(continued, false);
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test('protected route reports missing server authentication configuration', () => {
  const previousSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  try {
    const res = makeResponse();
    authenticate({ get: () => 'Bearer some-token' }, res, () => {});
    assert.equal(res.statusCode, 503);
  } finally {
    if (previousSecret !== undefined) process.env.JWT_SECRET = previousSecret;
  }
});
