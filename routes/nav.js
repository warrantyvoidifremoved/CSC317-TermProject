const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Home page
router.get('/', (req, res) => {
	res.redirect('products');
});

// About page
router.get('/about', (req, res) => {
	res.render('about', { title: 'Rocks! | About' });
});

// FAQ page
router.get('/faq', (req, res) => {
	res.render('faq', { title: 'Rocks! | FAQ' });
});

module.exports = router;