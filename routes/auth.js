const { Router } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require('../config');
const regEmail = require('../emails/registration');
const resetPwdEmail = require('../emails/reset-pwd');
const router = Router();

const transport = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENGRID_API_KEY }
}));

router.get("/login", async(req, res) => {
    res.render("auth/login", {
        title: "Авторизация",
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
        success: req.flash('success')
    });
});

router.get("/new-password/:token", async(req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login#login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() }
        })

        if (!user) {
            return res.redirect('/auth/login#login');
        } else {
            res.render("auth/new-pwd", {
                title: "Смена пароля",
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            });
        }

    } catch (e) {
        console.log(e)
    }
});

router.get("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login");
    });
});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            const passwordConfirm = await bcrypt.compare(password, candidate.password);
            if (passwordConfirm) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) throw err;
                    res.redirect("/");
                });
            } else {
                req.flash('loginError', 'Неверный пароль!');
                res.redirect("/auth/login#login");
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует!');
            res.redirect("/auth/login#login");
        }
    } catch (e) {
        console.log(e);
    }
});

router.post("/register", async(req, res) => {
    try {
        const { email, password, repeat, name } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует,попробуйте другой!');
            res.redirect("/auth/login#register");
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, name, password: hashPassword, cart: { items: [] } });
            await user.save();
            res.redirect("/auth/login#login");
            await transport.sendMail(regEmail(email));
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/reset-password', (req, res) => {
    res.render('auth/reset-pwd', {
        title: 'Сброс пароля',
        error: req.flash('error'),
        success: req.flash('success')
    })
});


router.post('/reset-password', (req, res) => {
    try {
        crypto.randomBytes(32, async(err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так,повторите попытку позже');
                return res.redirect('/auth/reset-password');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({ email: req.body.email })
            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transport.sendMail(resetPwdEmail(candidate.email, token));
                req.flash('success', 'На вашу почту было выслано письмо с дальнейшими инструкциями по смене пароля');
                res.redirect("/auth/login");
            } else {
                req.flash('error', 'Такого email нет');
                res.redirect('/auth/reset');
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/new-password', async(req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() }
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            req.flash('success', 'Пароль успешно изменен!');
            res.redirect('/auth/login#login');
        } else {
            req.flash('loginError', 'Время жизни токена истекло!');
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
});
module.exports = router;