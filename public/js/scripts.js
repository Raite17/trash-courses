const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

const toDate = date => {
    return new Intl.DateTimeFormat('ru-Ru', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

//delete Cart item
const $cart = document.querySelector('#cart');
if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('cart-delete-item')) {
            const id = event.target.dataset.id;
            fetch('/cart/remove/' + id, {
                    method: 'DELETE',
                }).then(res => res.json())
                .then(cart => {
                    if (cart.courses.length) {
                        const html = cart.courses.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small btn-danger cart-delete-item red" data-id="${c.id}">Удалить</button>
                                </td>
                            </tr>
                            `
                        }).join('')
                        $cart.querySelector('tbody').innerHTML = html;
                        $cart.querySelector('price').textContent = toCurrency(cart.price);
                    } else {
                        $cart.innerHTML = '<p>Корзина пуста!</p>'
                    }
                })
        }
    });
}