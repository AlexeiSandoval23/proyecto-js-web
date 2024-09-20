document.addEventListener('DOMContentLoaded', () => {
    let cart = [];


    async function loadProducts() {
        try {
            const response = await fetch('productos.json');
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            const productos = await response.json();
            renderProducts(productos);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al cargar los productos. Inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'custom-confirm-button'
                }
            });
            console.error('Error al cargar los productos:', error);
        }
    }


    function renderProducts(productos) {
        const productsContainer = document.getElementById('products');
        productsContainer.innerHTML = '';

        productos.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}">
                <h2>${product.nombre}</h2>
                <p>Precio: $${product.precio}</p>
                <button class="add-to-cart">Agregar al carrito</button>
            `;


            productElement.querySelector('.add-to-cart').addEventListener('click', () => {
                addToCart(product.nombre, product.precio);
            });

            productsContainer.appendChild(productElement);
        });
    }


    function addToCart(productName, productPrice) {
        if (typeof productPrice !== 'number' || isNaN(productPrice)) {
            Swal.fire({
                title: 'Error',
                text: `Precio no válido para el producto: ${productName}`,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'custom-confirm-button'
                }
            });
            return;
        }

        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity++;
            existingProduct.totalPrice += productPrice;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1, totalPrice: productPrice });
        }
        updateCart();
        saveCartToLocalStorage();

    }

    function updateCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.quantity} x $${item.price.toFixed(2)} = $${item.totalPrice.toFixed(2)}`;
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
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
    }

    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        updateCart();
        saveCartToLocalStorage();

        Swal.fire({
            title: 'Producto eliminado',
            text: `${productName} ha sido eliminado del carrito`,
            icon: 'info',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        });
    }

    function saveCartToLocalStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al guardar el carrito. Inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'custom-confirm-button'
                }
            });
            console.error('Error al guardar el carrito en localStorage:', error);
        }
    }

    function loadCartFromLocalStorage() {
        try {
            const savedCart = JSON.parse(localStorage.getItem('cart'));
            if (savedCart) {
                cart = savedCart;
                updateCart();
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al cargar tu carrito. Inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'custom-confirm-button'
                }
            });
            console.error('Error al cargar el carrito desde localStorage:', error);
        }
    }

    function finalizarCompra() {
        if (cart.length === 0) {
            Swal.fire({
                title: 'Carrito vacío',
                text: 'No tienes productos en el carrito para finalizar la compra.',
                icon: 'warning',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'custom-confirm-button'  
                }
            });
            return;
        }

        // Borrar carrito y finalizar compra.
        cart = [];
        updateCart();
        saveCartToLocalStorage();

        Swal.fire({
            title: 'Compra realizada',
            text: 'Gracias por tu compra. Tu pedido está en proceso.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        });
    }


    const checkoutButton = document.getElementById('checkout');
    checkoutButton.addEventListener('click', finalizarCompra);


    loadProducts();
    loadCartFromLocalStorage();
});
