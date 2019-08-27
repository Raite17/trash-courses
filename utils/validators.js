const { body } = require('express-validator');
const User = require('../models/user');
exports.registerValidators = [
    body('email', 'Введите корректный email!').isEmail()
    .custom(async(value, { req }) => {
        try {
            const user = await User.findOne({ email: value });
            if (user) {
                return Promise.reject('Пользователь с таким email уже существует,попробуйте другой!');
            }
        } catch (e) {
            console.log(e);
        }
    })
    .normalizeEmail(),
    body('password', 'Пароль должен быть минимум из 6 символов')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
    body('confirm')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают!');
        }
        return true
    })
    .trim(),
    body('name', 'Имя должно состоять минимум из 6 символов')
    .isLength({ min: 5 })
    .trim(),
];

exports.courseValidators = [
    body('title', 'Название должно состоять минимум из 3 символов').isLength({ min: 3 }).trim(),
    body('price', 'Введите корректную цену!').isNumeric(),
    body('img', 'Введите конктрентный URL картинки').isURL()
]