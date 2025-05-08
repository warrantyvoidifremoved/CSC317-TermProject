const path = require("path");
const express = require("express");
const session = require('express-session');
const app = express();
const PORT = 3000;
require('dotenv').config();

// Set view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const navRouter = require('./routes/nav');
const cartRouter = require('./routes/cart');
const productsRouter = require('./routes/products');
const userRouter = require('./routes/user');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const searchRouter = require('./routes/search');
const changePassRouter = require('./routes/change_pass');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Mount routers
app.use('/', navRouter);
app.use('/cart', cartRouter);
app.use('/products', productsRouter);
app.use('/user', userRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/search', searchRouter);
app.use('/change_pass', changePassRouter);

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