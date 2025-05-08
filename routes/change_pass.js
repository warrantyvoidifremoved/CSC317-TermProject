const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/db');
const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('change_pass', {
        title: 'Change Password'
    });
});

router.post('/', async (req, res) => {
    console.log('Attempting to change password for user ID:', userId);

    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user?.id;

    if (!userId) return res.redirect('/login');

    if (newPassword !== confirmPassword) {
        return res.render('change_pass', { error: 'New passwords do not match.' });
    }

    try {
        const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId]);

        const match = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!match) {
            return res.render('change_pass', { error: 'Current password is incorrect.' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await db.runAsync('UPDATE users SET passwordHash = ? WHERE id = ?', [newHash, userId]);

        res.render('change_pass', { success: 'Password updated successfully.' });
    } catch (err) {
        console.error(err);
        res.render('change_pass', { error: 'Server error.' });
    }
});

module.exports = router;
