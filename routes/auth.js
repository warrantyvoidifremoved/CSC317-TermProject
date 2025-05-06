const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Home page
router.get('/', async (req, res) => {
    try {
        const products = await db.allAsync('SELECT * FROM products');
        res.render('index', { title: 'Home', products });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { title: 'Error', message: 'Database query failed' });
    }
});

// Login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Signup page
router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

// About page
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

// FAQ page
router.get('/faq', (req, res) => {
    res.render('faq', { title: 'FAQ'});
});

module.exports = router;
