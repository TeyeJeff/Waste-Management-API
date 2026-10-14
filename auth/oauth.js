const crypto = require('node:crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const router = express.Router();
let configured = false;
let warnedUnavailable = false;

const configureGoogleOAuth = () => {
  const { GOOGLE_CLIENT_ID: clientID, GOOGLE_CLIENT_SECRET: clientSecret } = process.env;
  if (!clientID || !clientSecret) {
    if (!warnedUnavailable) {
      console.warn('Google OAuth is unavailable: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured.');
      warnedUnavailable = true;
    }
    return false;
  }

  if (!configured) {
    passport.use(new GoogleStrategy({
      clientID,
      clientSecret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://waste-management-api-jpaq.onrender.com/auth/google/callback',
    }, (accessToken, refreshToken, profile, done) => done(null, profile)));
    configured = true;
  }
  warnedUnavailable = false;

  return true;
};

const oauthUnavailable = (req, res, next) => {
  if (configureGoogleOAuth()) return next();
  return res.status(503).json({
    success: false,
    message: 'Google OAuth is not configured on this server',
  });
};

const readCookie = (req, name) => {
  const cookie = (req.headers.cookie || '')
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : '';
};

router.get('/google', oauthUnavailable, (req, res, next) => {
  const state = crypto.randomBytes(32).toString('hex');
  res.cookie('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000,
    path: '/auth/google/callback',
  });
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
    session: false,
  })(req, res, next);
});

router.get('/google/callback', oauthUnavailable, (req, res, next) => {
  const cookieState = readCookie(req, 'oauth_state');
  const queryState = typeof req.query.state === 'string' ? req.query.state : '';
  res.clearCookie('oauth_state', { path: '/auth/google/callback' });

  const cookieBuffer = Buffer.from(cookieState);
  const queryBuffer = Buffer.from(queryState);
  if (
    cookieBuffer.length === 0
    || cookieBuffer.length !== queryBuffer.length
    || !crypto.timingSafeEqual(cookieBuffer, queryBuffer)
  ) {
    const message = !queryState
      ? 'OAuth state is missing from the callback'
      : !cookieState
        ? 'OAuth state cookie was not returned by the browser; start sign-in again on this host'
        : 'OAuth state does not match the sign-in request; start sign-in again';
    console.warn(`Google OAuth state validation failed: ${message}`);
    return res.status(400).json({ success: false, message });
  }

  passport.authenticate('google', { session: false }, (error, profile) => {
    if (error) return next(error);
    if (!profile) {
      return res.status(401).json({ success: false, message: 'Google authentication failed' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(503).json({
        success: false,
        message: 'Authentication is not configured on this server',
      });
    }

    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : undefined;
    const token = jwt.sign(
      { email, provider: 'google' },
      secret,
      { subject: `google:${profile.id}`, expiresIn: '1h' },
    );
    return res.status(200).json({
      success: true,
      message: 'Google sign-in successful. Use this token as a Bearer token.',
      token,
      tokenType: 'Bearer',
      expiresIn: '1h',
    });
  })(req, res, next);
});

module.exports = { configureGoogleOAuth, router };
