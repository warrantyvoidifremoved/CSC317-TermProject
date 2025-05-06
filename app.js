const path = require("path");
const express = require("express");
const app = express();
const PORT = 3000;

// Set view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const navRouter = require('./routes/nav');
const cartRouter = require('./routes/cart');
const productsRouter = require('./routes/products');
const userRouter = require('./routes/user');

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Mount routers
app.use('/', navRouter);
app.use('/cart', cartRouter);
app.use('/products', productsRouter);
app.use('/user', userRouter);

// Map for routes
const redirectRoutes = new Map([
    ["/x", "https://x.com/"],
    ["/instagram", "https://www.instagram.com/"],
    ["/discord", "https://discord.com/"]
]);

redirectRoutes.forEach((url, route) => {
    app.get(route, (req, res) => {
        res.redirect(url);
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Oops!',
        error: 'Sorry, the page you are looking for does not exist.'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});