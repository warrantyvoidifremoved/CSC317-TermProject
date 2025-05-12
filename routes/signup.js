const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/db');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('signup', { title: 'Rocks! | Signup' });
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    const validUsername =
        username.length >= 4 && username.length <= 20 &&
        /[A-Z]/.test(username) && /\d/.test(username);

    const validPassword =
        password.length >= 8 && password.length <= 25 &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!validUsername || !validPassword) {
        return res.status(400).render('signup',
            {
                usernameError: !validUsername ? 'Username must be 4–20 characters, include an uppercase letter and a number.' : undefined,
                passwordError: !validPassword ? 'Password must be 8–25 characters, include an uppercase letter, a number, and a special character.' : undefined,
                username
            });
    }

    try {
        const user = await db.getAsync('SELECT * FROM users WHERE username = ?', [username]);
        if (user) return res.status(400).render('signup', {usernameError: 'Username already taken', username});

        const passwordHash = await bcrypt.hash(password, 10);

        const userId = await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
                [username, passwordHash],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });

        req.session.user = {
            id: userId,
            username
        };
        res.redirect('/');

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).render('error', {
            title: 'Oops!',
            error: 'Server error!',
        });
    }
});

module.exports = router;