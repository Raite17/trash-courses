const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

class Cart {

    static async add(course) {
        const cart = await Cart.fetch();
        const index = cart.courses.findIndex(c => c.id === course.id);
        const candidate = cart.courses[index];

        if (candidate) {
            candidate.count++;
            cart.courses[index] = candidate;
        } else {
            course.count = 1;
            cart.courses.push(course);
        }

        cart.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) reject(err);
                resolve();
            })
        });
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) reject(err);
                resolve(JSON.parse(content));
            });
        });
    }
}

module.exports = Cart;