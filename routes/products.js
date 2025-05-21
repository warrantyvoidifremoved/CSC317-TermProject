const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Route all products
router.get('/', async (req, res) => {
    try {
        const products = await db.allAsync('SELECT * FROM products');
        res.render('products', { title: 'Rocks!', products });
    }
    catch (err) {
        console.error(err);
        res.status(500).render('error', { title: 'Error', error: 'Database query failed' });
    }
});

// Route by product ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const product = await db.getAsync(
            'SELECT * FROM products WHERE id = ?', [id]
        );

        if (!product) {
            console
            res.status(404).render('error', {
                title: 'Oops!',
                error: 'Sorry, we could not find what you are looking for.',
            });
        }
        else {
            const suggested = await db.allAsync(
                'SELECT * FROM products WHERE category = ?', [product.category]
            );

            const reviews = await db.allAsync(`
                SELECT 
                    users.username,
                    reviews.review,
                    reviews.timestamp
                FROM reviews
                JOIN users ON reviews.user_id = users.id
                WHERE reviews.product_id = ?
                ORDER BY reviews.timestamp DESC
            `, [id]);
            
            res.render('product_details', {
                title: 'Rocks! | ' + `${product.name}`,
                product,
                suggested,
                reviews
            });
        }
    }
    catch (err) {
        console.error('Error fetching category products:', err);
        res.status(500).render('error', { title: 'Error', error: 'Database query failed' });
    }
});

// Route by category
router.get('/categories/:category', async (req, res) => {
    const category = req.params.category;

    try {
        const products = await db.allAsync(
            'SELECT * FROM products WHERE category = ?', [category]
        );

        if (products.length > 0) {
            res.render('products', {
                title: 'Rocks! | ' + `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                products
            });
        }
        else {
            res.render('error', {
                title: 'Oops!',
                error: 'Sorry, we could not find any products in that category.'
            });
        }
    }
    catch (err) {
        console.error('Error fetching category products:', err);
        res.status(500).render('error', { title: 'Error', error: 'Database query failed' });
    }
});

module.exports = router;