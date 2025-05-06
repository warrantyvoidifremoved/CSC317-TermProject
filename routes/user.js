const express = require('express');
const router = express.Router();

// User profile page
router.get('/', (req, res) => {
    res.render('user', {
        title: 'Profile',
        username: 'Foo Bar',
        currentOrders: [],
        previousOrders: []
    });
});

module.exports = router;