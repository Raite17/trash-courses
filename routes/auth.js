const { Router } = require('express');
const User = require('../models/user');
const router = Router();


router.get('/login', async(req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
});

router.get('/logout', async(req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

router.post('/login', async(req, res) => {
    const user = await User.findById('5d583aab7615a22710f78312');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
        if (err) throw err;
        res.redirect('/');
    });
});
module.exports = router;