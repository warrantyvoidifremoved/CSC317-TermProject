const express = require('express');
const router = express.Router();

// Products page
router.get('/', (req, res) => {
    res.render('index', { title: 'Products', products: [] });
});

module.exports = router;