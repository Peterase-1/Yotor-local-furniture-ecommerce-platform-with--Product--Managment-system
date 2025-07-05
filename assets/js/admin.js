// admin.js
$(document).ready(function() {
    // Modal controls
    $('#add-product-btn').click(function() { openProductModal(); });
    $('#close-modal, #cancel-modal').click(closeProductModal);
    
    // Form submission
    $('#product-form').submit(handleProductSubmit);
    
    // Navigation tabs
    $('.admin-nav').click(function(e) {
        e.preventDefault();
        $('.admin-nav').removeClass('active');
        $(this).addClass('active');
        $('.admin-section').addClass('hidden');
        $(`#${$(this).data('section')}-section`).removeClass('hidden');
    });
    
    // Mobile menu
    $('#mobile-admin-button').click(function() {
        $('#mobile-admin-nav').removeClass('hidden');
    });
    
    $('#close-mobile-admin').click(function() {
        $('#mobile-admin-nav').addClass('hidden');
    });
    
    // Logout
    $('#admin-logout').click(function() {
        // In a real app, you would clear session/token here
        window.location.href = 'index.html';
    });
    
    // Initial load
    loadProductsTable();
    loadOrdersTable();
    loadDesignRequests();
    loadMessages();
    loadReviews();
});

// Open product modal with all required fields
function openProductModal(product = null) {
    if (product) {
        $('#modal-title').text('Edit Product');
        $('#product-id').val(product.id);
        $('#product-name').val(product.name);
        $('#product-category').val(product.category);
        $('#product-price').val(parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0);
        $('#product-location').val(product.location);
        $('#production-time').val(product.productionTime);
        $('#product-material').val(product.materials.join(', '));
        $('#product-description').val(product.description);
        $('#product-images').val(product.images.join('\n'));
        $('#product-specs').val(product.specs ? product.specs.join('\n') : '');
        $('#product-dimensions').val(product.dimensions || '');
        $('#product-weight').val(product.weight || '');
        $('#product-origin').val(product.origin || 'Ethio-Modern Collection');
        $('#product-rating').val(product.rating || 5);
        $('#product-reviews').val(product.reviews || 0);
    } else {
        $('#modal-title').text('Add New Product');
        $('#product-form')[0].reset();
        $('#product-id').val('');
        $('#product-rating').val(5);
        $('#product-reviews').val(0);
        $('#product-origin').val('Ethio-Modern Collection');
    }
    $('#product-modal').removeClass('hidden');
}

// Close product modal
function closeProductModal() {
    $('#product-modal').addClass('hidden');
}

// Handle product form submission with all fields
function handleProductSubmit(e) {
    e.preventDefault();
    
    const product = {
        id: $('#product-id').val() || Date.now(),
        name: $('#product-name').val(),
        category: $('#product-category').val(),
        price: parseFloat($('#product-price').val()) || 0,
        location: $('#product-location').val(),
        productionTime: $('#production-time').val(),
        materials: $('#product-material').val().split(',').map(item => item.trim()),
        description: $('#product-description').val(),
        images: $('#product-images').val().split('\n').filter(url => url.trim()),
        specs: $('#product-specs').val().split('\n').filter(spec => spec.trim()),
        dimensions: $('#product-dimensions').val(),
        weight: $('#product-weight').val(),
        origin: $('#product-origin').val(),
        rating: parseInt($('#product-rating').val()) || 5,
        reviews: parseInt($('#product-reviews').val()) || 0
    };
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if ($('#product-id').val()) {
        // Update existing product
        products = products.map(p => p.id == product.id ? product : p);
    } else {
        // Add new product
        products.push(product);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    loadProductsTable();
    closeProductModal();
}

// Load products table
function loadProductsTable() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        // If no products in localStorage, use the default products
        products = window.products || [];
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    renderProductsTable(products);
}

function renderProductsTable(products) {
    let html = '';
    products.forEach(product => {
        // Convert price to number if it's a string
        let price = product.price;
        if (typeof price === 'string') {
            price = parseFloat(price.replace(/[^0-9.]/g, ''));
        }
        
        html += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${product.images[0] || 'https://via.placeholder.com/40'}" alt="${product.name}" class="h-10 w-10 object-cover rounded">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium">${product.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'N/A'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    $${price ? price.toLocaleString() : '0'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${product.location || 'N/A'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="editProduct(${product.id})" class="text-[#7B5E57] hover:text-[#6a514b] mr-4">Edit</button>
                    <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `;
    });
    $('#products-table-body').html(html || '<tr><td colspan="6" class="px-6 py-4 text-center">No products found</td></tr>');
}

// Edit product
function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id == id);
    if (product) openProductModal(product);
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id != id);
        localStorage.setItem('products', JSON.stringify(products));
        loadProductsTable();
    }
}

// Load orders table
function loadOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    let html = '';
    orders.forEach(order => {
        html += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${order.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">${order.customerName}</td>
                <td class="px-6 py-4">${new Date(order.timestamp).toLocaleDateString()}</td>
                <td class="px-6 py-4">${order.items.length} items</td>
                <td class="px-6 py-4 whitespace-nowrap">$${order.total.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="viewOrderDetails(${order.id})" class="text-[#7B5E57] hover:text-[#6a514b]">View</button>
                </td>
            </tr>
        `;
    });
    $('#orders-table-body').html(html || '<tr><td colspan="7" class="px-6 py-4 text-center">No orders found</td></tr>');
}

function getStatusClass(status) {
    switch(status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'processing': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// View order details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id == orderId);
    
    if (!order) return;
    
    let html = `
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Order #${order.id}</h3>
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 class="font-bold mb-2">Customer Information</h4>
                    <p>${order.customerName}</p>
                    <p>${order.customerEmail}</p>
                    <p>${order.customerPhone}</p>
                    <p>${order.customerAddress}</p>
                </div>
                <div>
                    <h4 class="font-bold mb-2">Order Details</h4>
                    <p>Date: ${new Date(order.timestamp).toLocaleDateString()}</p>
                    <p>Status: ${order.status}</p>
                    <p>Payment Method: ${order.paymentMethod}</p>
                </div>
            </div>
            
            <h4 class="font-bold mb-2">Order Items</h4>
            <div class="border rounded-lg overflow-hidden mb-4">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    order.items.forEach(item => {
        html += `
            <tr class="border-b border-gray-200">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="h-10 w-10 object-cover rounded mr-4">
                        <div>${item.name}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">$${item.price.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${item.quantity}</td>
                <td class="px-6 py-4 whitespace-nowrap">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
            
            <div class="flex justify-end">
                <div class="w-64">
                    <div class="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>$${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Shipping:</span>
                        <span>$${order.shipping.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-4">
                <button onclick="updateOrderStatus(${order.id}, 'processing')" class="bg-yellow-600 text-white px-4 py-2 rounded-md ${order.status === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}" ${order.status === 'processing' ? 'disabled' : ''}>
                    Mark as Processing
                </button>
                <button onclick="updateOrderStatus(${order.id}, 'completed')" class="bg-green-600 text-white px-4 py-2 rounded-md ${order.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}" ${order.status === 'completed' ? 'disabled' : ''}>
                    Mark as Completed
                </button>
                <button onclick="$('#order-details-modal').addClass('hidden')" class="bg-gray-600 text-white px-4 py-2 rounded-md">
                    Close
                </button>
            </div>
        </div>
    `;
    
    $('#order-details-content').html(html);
    $('#order-details-modal').removeClass('hidden');
}

// Update order status
function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.map(order => {
        if (order.id == orderId) {
            return {...order, status};
        }
        return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrdersTable();
    $('#order-details-modal').addClass('hidden');
}

function loadDesignRequests() {
    // Placeholder for design requests
    $('#design-requests-container').html('<p class="text-center py-8">Design requests will appear here</p>');
}

function loadMessages() {
    // Load contact form messages from localStorage
    const messages = JSON.parse(localStorage.getItem('contact-messages')) || [];
    
    let html = '';
    if (messages.length > 0) {
        messages.forEach(msg => {
            html += `
                <div class="border-b border-gray-200 py-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold">${msg.name}</h4>
                            <p class="text-gray-600">${msg.subject}</p>
                        </div>
                        <span class="text-gray-500 text-sm">${new Date(msg.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p class="mt-2 text-gray-600">${msg.message.substring(0, 100)}...</p>
                </div>
            `;
        });
    } else {
        html = '<p class="text-center py-8">No messages found</p>';
    }
    
    $('#messages-container').html(html);
}

function loadReviews() {
    // Placeholder for reviews
    $('#reviews-container').html('<p class="text-center py-8">Product reviews will appear here</p>');
}