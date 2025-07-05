let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, quantity = 1) {
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    let numericPrice;
    if (typeof product.price === 'string') {
        numericPrice = parseFloat(product.price.replace(/[^\d.]/g, ''));
    } else {
        numericPrice = product.price;
    }
    
    if (isNaN(numericPrice)) {
        console.error(`Invalid price for product ${product.id}:`, product.price);
        numericPrice = 0;
    }

    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: numericPrice,
            displayPrice: product.price,
            image: product.images[0],
            quantity: quantity
        });
    }
    
    saveCart();
    showAddedToCartNotification(product.name);
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id == productId);
    if (!item) return false;

    if (newQuantity <= 0) {
        cart = cart.filter(item => item.id != productId);
    } else {
        item.quantity = newQuantity;
    }
    
    saveCart();
    updateCartDisplay();
    return true;
}

function refreshCartUI() {
    updateCartCount();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        countElement.textContent = totalItems;
        countElement.classList.toggle('hidden', totalItems === 0);
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !subtotalElement || !totalElement) return;
    
    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        cartItemsContainer.innerHTML = '';
        subtotalElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        return;
    }
    
    emptyCartMessage.classList.add('hidden');
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-start border-b border-gray-100 pb-4 cart-item';
        cartItem.dataset.id = item.id;
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded mr-4">
            <div class="flex-1">
                <h4 class="font-medium">${item.name}</h4>
                <p class="text-gray-500 text-sm">${item.displayPrice}</p>
                <div class="flex items-center mt-2">
                    <button class="quantity-minus text-gray-500 hover:text-[#7B5E57] p-1" data-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>
                    <span class="quantity-value mx-2 w-8 text-center">${item.quantity}</span>
                    <button class="quantity-plus text-gray-500 hover:text-[#7B5E57] p-1" data-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="text-right">
                <p class="font-medium">$${itemTotal.toFixed(2)}</p>
                <button class="remove-item text-gray-400 hover:text-red-500 text-sm mt-2" data-id="${item.id}">
                    Remove
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + 50).toFixed(2)}`;
}

function showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-[#7B5E57] text-white px-6 py-3 rounded-md shadow-lg flex items-center';
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        ${productName} added to cart
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center';
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function submitOrder(customerInfo) {
    if (cart.length === 0) return null;
    
    const order = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: [...cart],
        subtotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        shipping: 50,
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 50,
        status: 'pending',
        paymentMethod: customerInfo.paymentMethod
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    saveCart();
    updateCartCount();
    
    showOrderSuccessModal(order);
    
    return order.id;
}

function showOrderSuccessModal(order) {
    const modal = document.createElement('div');
    modal.id = 'order-success-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p class="text-gray-600 mb-4">Thank you for your order. Below are the details:</p>
            <div class="border rounded-lg p-4 mb-4">
                <h3 class="font-bold">Order #${order.id}</h3>
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Address:</strong> ${order.customerAddress}</p>
                <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                <h4 class="font-bold mt-4">Items:</h4>
                <ul class="list-disc pl-5">
                    ${order.items.map(item => `
                        <li>${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>
                    `).join('')}
                </ul>
                <p class="mt-2"><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
                <p><strong>Shipping:</strong> $${order.shipping.toFixed(2)}</p>
                <p class="font-bold"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            </div>
            <div class="flex justify-end">
                <button id="close-order-modal" class="bg-[#7B5E57] text-white px-4 py-2 rounded-md">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('close-order-modal').addEventListener('click', () => {
        modal.remove();
        window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const customerInfo = {
                name: document.getElementById('checkout-name').value,
                email: document.getElementById('checkout-email').value,
                phone: document.getElementById('checkout-phone').value,
                address: document.getElementById('checkout-address').value,
                paymentMethod: document.getElementById('checkout-payment').value
            };
            
            submitOrder(customerInfo);
        });
    }
});

function getAllProducts() {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const defaultProducts = window.products || [];
    return [...savedProducts, ...defaultProducts].filter(
        (product, index, self) => 
            index === self.findIndex(p => p.id === product.id)
    );
}

updateCartCount();