const { Router } = require('express');
const router = Router();
const Course = require('../models/course');

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    });
});

router.post('/', async(req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const img = req.body.img;
    const course = new Course({
        title,
        price,
        img
    });
    try {
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;