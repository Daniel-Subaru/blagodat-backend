import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';  // ← ТИМЧАСОВО ВИМКНЕНО
// import { Strategy as FacebookStrategy } from 'passport-facebook';      // ← ТИМЧАСОВО ВИМКНЕНО
import { pool } from '../server.js';

// Серіалізація/десеріалізація користувача
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query(
            'SELECT id, email, first_name, last_name, avatar_url, auth_provider FROM users WHERE id = $1',
            [id]
        );
        if (result.rows.length) {
            done(null, result.rows[0]);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (err) {
        done(err, null);
    }
});

// ========== GOOGLE STRATEGY (ТИМЧАСОВО ВИМКНЕНО) ==========
// Якщо потрібно увімкнути - розкоментуйте і додайте GOOGLE_CLIENT_ID в .env
/*
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);
        
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length) {
            return done(null, existing.rows[0]);
        }
        
        const result = await pool.query(
            `INSERT INTO users (email, first_name, last_name, avatar_url, auth_provider, google_id, email_verified)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [email, profile.name?.givenName || '', profile.name?.familyName || '', 
             profile.photos?.[0]?.value || '', 'google', profile.id, true]
        );
        return done(null, result.rows[0]);
    } catch (err) {
        return done(err, null);
    }
}));
*/

// ========== FACEBOOK STRATEGY (ТИМЧАСОВО ВИМКНЕНО) ==========
// Якщо потрібно увімкнути - розкоментуйте і додайте FACEBOOK_APP_ID в .env
/*
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Facebook'), null);
        
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length) {
            return done(null, existing.rows[0]);
        }
        
        const nameParts = profile.displayName?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const result = await pool.query(
            `INSERT INTO users (email, first_name, last_name, avatar_url, auth_provider, facebook_id, email_verified)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [email, firstName, lastName, profile.photos?.[0]?.value || '', 'facebook', profile.id, true]
        );
        return done(null, result.rows[0]);
    } catch (err) {
        return done(err, null);
    }
}));
*/

export default passport;