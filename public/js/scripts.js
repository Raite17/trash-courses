const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
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
                                    <button class="btn btn-small btn-danger cart-delete-item" data-id="${c.id}">Удалить</button>
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