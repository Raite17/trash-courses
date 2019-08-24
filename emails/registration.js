const keys = require('../config');

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Регистрация прошла успешно',
        html: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали личны кабинет c email - ${email}</p>
            <hr />
            <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}