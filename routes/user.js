const express = require('express');
const router = express.Router();

// User profile page
router.get('/', (req, res) => {
    res.render('user', {
        title: 'Rocks! | Profile',
        username: req.session.user.username,
        currentOrders: [],
        previousOrders: []
    });
});

module.exports = router;