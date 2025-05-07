const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('called')
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/');
    });
});

module.exports = router;
