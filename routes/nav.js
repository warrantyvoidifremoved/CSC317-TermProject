const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Home page
router.get('/', (req, res) => {
    res.redirect('products');
});

// About page
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Rocks!' });
});

// FAQ page
router.get('/faq', (req, res) => {
    res.render('faq', { title: 'FAQ'});
});

// Login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Signup page
router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

module.exports = router;