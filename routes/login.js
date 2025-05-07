const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/db');
const router = express.Router();

router.post('/', async (req, res) => {
        const {username, password} = req.body;

        const validUsername =
            username.length >= 4 && username.length <= 20 &&
            /[A-Z]/.test(username) && /\d/.test(username);

        const validPassword =
            password.length >= 8 && password.length <= 25 &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!validUsername || !validPassword) {
            return res.status(400).render('login',
                {
                    usernameError: !validUsername ? 'Incorrect Username' : undefined,
                    passwordError: !validPassword ? 'Incorrect Password' : undefined,
                    username
                });
        }

        try {
            const user = await db.getAsync('SELECT * FROM users WHERE username = ?', [username]);
            if (!user) {
                return res.status(400).render('login', {
                    usernameError: 'Username not found',
                    username
                });
            }
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordMatch) {
                return res.status(400).render('login', {
                    passwordError: 'Incorrect password',
                    username
                });
            }
            req.session.user = {
                id: user.id,
                username: user.username
            };
            res.redirect('/')
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).render('error', {
                title: 'Oops!',
                error: 'Server error!',
            });
        }
    }
)
;

module.exports = router;