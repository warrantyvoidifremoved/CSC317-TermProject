const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index', { title: 'Home', products: [] });
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
