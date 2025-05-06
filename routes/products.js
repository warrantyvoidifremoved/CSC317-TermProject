const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const products = await db.allAsync('SELECT * FROM products');
        res.render('products', { title: 'Rocks!', products });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { title: 'Error', message: 'Database query failed' });
    }
});

router.get('/:category', async (req, res) => {
    const category = req.params.category;

    try {
        const products = await db.allAsync(
            'SELECT * FROM products WHERE category = ?',
            [category]
        );

        if (products.length > 0) {
            res.render('products', {
                title: `${category.charAt(0).toUpperCase() + category.slice(1)} Rocks!`,
                products
            });
        }
        else {
            res.render('error', {
                title: 'Oops!',
                error: 'Sorry, we could not find any products in that category.'
            });
        }

    } catch (err) {
        console.error('Error fetching category products:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;