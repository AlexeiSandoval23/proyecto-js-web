document.addEventListener('DOMContentLoaded', () => {
    let cart = [];


    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productElement = e.target.parentElement;
            const productName = productElement.querySelector('h2').textContent;
            const productPriceText = productElement.querySelector('p').textContent.replace('Precio: $', '');
            const productPrice = parseFloat(productPriceText);

            if (!isNaN(productPrice)) {
                addToCart(productName, productPrice);
            } else {
                console.error(`Precio no válido para el producto: ${productName}`);
            }
        });
    });

    function addToCart(productName, productPrice) {
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity++;
            existingProduct.totalPrice += productPrice;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1, totalPrice: productPrice });
        }
        console.log(`Producto agregado al carrito: ${productName} - Precio: ${productPrice}`);
        updateCart();
        saveCartToLocalStorage();
    }

    function updateCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const itemPrice = item.price || 0;
            const itemTotalPrice = item.totalPrice || 0;
            
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.quantity} x $${itemPrice.toFixed(2)} = $${itemTotalPrice.toFixed(2)}`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => removeFromCart(item.name));
            li.appendChild(removeButton);
            cartItemsContainer.appendChild(li);
        });

        updateTotal();
    }

    function updateTotal() {
        const total = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
    }

    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        console.log(`Producto eliminado del carrito: ${productName}`);
        updateCart();
        saveCartToLocalStorage();
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Carrito guardado en localStorage:', cart);
    }

    function loadCartFromLocalStorage() {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            cart = savedCart.map(item => ({
                ...item,
                price: item.price || 0,
                totalPrice: item.totalPrice || 0
            }));
            updateCart();
            console.log('Carrito cargado desde localStorage:', savedCart);
        }
    }

    loadCartFromLocalStorage();
});
