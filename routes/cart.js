const { Router } = require('express');
const Cart = require('../models/cart');
const Course = require('../models/course');
const router = Router();

router.post('/add', async(req, res) => {
    const course = await Course.getById(req.body.id);
    await Cart.add(course);
    res.redirect('/cart');
});

router.delete('/remove/:id', async(req, res) => {
    const cart = await Cart.remove(req.params.id);
    res.status(200).json(cart);
});


router.get('/', async(req, res) => {
    const cart = await Cart.fetch();
    res.render('cart', {
        title: 'Корзина',
        isCart: true,
        courses: cart.courses,
        price: cart.price
    });
})

module.exports = router;