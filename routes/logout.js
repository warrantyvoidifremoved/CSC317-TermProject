const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).render('error', {
                title: 'Oops!',
                error: 'Logout failed!',
            });
        }
        res.redirect('/');
    });
});

module.exports = router;