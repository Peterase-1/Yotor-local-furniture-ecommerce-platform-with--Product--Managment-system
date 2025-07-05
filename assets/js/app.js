document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

document.addEventListener('click', function(event) {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    
    if (!menu.contains(event.target) && event.target !== button) {
        menu.classList.add('hidden');
    }
});

document.getElementById('cart-btn').addEventListener('click', function() {
    const cart = document.getElementById('cart-sidebar');
    cart.classList.remove('translate-x-full');
    updateCartDisplay();
});

document.getElementById('close-cart').addEventListener('click', function() {
    const cart = document.getElementById('cart-sidebar');
    cart.classList.add('translate-x-full');
});

function getAllProducts() {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const defaultProducts = window.products || [];
    return [...savedProducts, ...defaultProducts].filter(
        (product, index, self) => 
            index === self.findIndex(p => p.id === product.id)
    );
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    const allProducts = getAllProducts();
    const featuredProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    featuredContainer.innerHTML = '';
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300';
        productCard.innerHTML = renderProductCard(product);
        featuredContainer.appendChild(productCard);
    });

    addProductEventListeners();
}

function loadAllProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    const allProducts = getAllProducts();
    
    productsContainer.innerHTML = '';
    allProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300';
        productCard.innerHTML = renderProductCard(product);
        productsContainer.appendChild(productCard);
    });

    addProductEventListeners(); // Added to ensure Quick View works on shop.html
}

function renderProductCard(product) {
    return `
        <div class="product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="relative h-60 overflow-hidden group">
                <img src="${product.images[0]}" alt="${product.name}" 
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button class="view-details w-full bg-white text-[#7B5E57] py-2 rounded-md font-medium transition hover:bg-[#f8f5f2]"
                            data-id="${product.id}">
                        Quick View
                    </button>
                </div>
                
                <div class="absolute top-3 right-3 bg-[#7B5E57] text-white px-2 py-1 rounded-md text-xs font-medium">
                    ${product.origin}
                </div>
            </div>
            
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-lg mb-1 line-clamp-1">${product.name}</h3>
                        <p class="text-[#A3B18A] text-sm capitalize">${product.category}</p>
                    </div>
                    <button class="add-to-cart p-2 rounded-full hover:bg-gray-100 transition" data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#7B5E57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                
                <div class="mt-3 flex justify-between items-center">
                    <span class="font-bold text-lg text-[#7B5E57]">${product.price}</span>
                    <div class="flex items-center">
                        ${renderStars(product.rating)}
                        <span class="text-gray-500 text-sm ml-1">(${product.reviews})</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${i <= rating ? 'text-[#F59E0B]' : 'text-gray-300'}" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>`;
    }
    return stars;
}

function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials');
    if (!testimonialsContainer) return;

    const testimonials = [
        {
            name: "Alemayehu Kebede",
            role: "Interior Designer, Addis Ababa",
            content: "The craftsmanship of ZENEBE furniture is unparalleled. Each piece tells a story of Ethiopian heritage while fitting perfectly in contemporary spaces.",
            rating: 5
        },
        {
            name: "Sara Mohammed",
            role: "Homeowner, Dire Dawa",
            content: "Our custom dining table from ZENEBE is the centerpiece of our home. The quality and attention to detail exceeded our expectations.",
            rating: 5
        },
        {
            name: "Yohannes Assefa",
            role: "Hotel Owner, Bahir Dar",
            content: "We furnished our entire boutique hotel with ZENEBE furniture. Guests constantly compliment the unique designs and comfort.",
            rating: 4
        }
    ];

    testimonialsContainer.innerHTML = '';
    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'bg-white p-6 rounded-lg shadow-md';
        testimonialCard.innerHTML = `
            <div class="flex items-center mb-4">
                ${'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#F59E0B]" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>'.repeat(testimonial.rating)}
                ${'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>'.repeat(5 - testimonial.rating)}
            </div>
            <p class="text-gray-600 mb-4">"${testimonial.content}"</p>
            <div class="flex items-center">
                <div class="bg-[#A3B18A] text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">${testimonial.name.charAt(0)}</div>
                <div class="ml-3">
                    <h4 class="font-bold">${testimonial.name}</h4>
                    <p class="text-gray-500 text-sm">${testimonial.role}</p>
                </div>
            </div>
        `;
        testimonialsContainer.appendChild(testimonialCard);
    });
}

function addProductEventListeners() {
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            try {
                const productId = this.dataset.id;
                if (!productId) {
                    console.error('No product ID found on view details button');
                    return;
                }
                window.location.href = `product.html?id=${productId}`;
            } catch (error) {
                console.error('Error handling view details:', error);
            }
        });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            try {
                const productId = this.dataset.id;
                if (!productId) {
                    console.error('No product ID found on add to cart button');
                    return;
                }
                
                const productCard = this.closest('.product-card');
                if (!productCard) {
                    console.error('Could not find product card element');
                    return;
                }
                
                const productName = productCard.querySelector('h3')?.textContent || 'Unknown Product';
                
                addToCart(productId, 1);
                updateCartCount();
                showAddedToCartNotification(productName);
            } catch (error) {
                console.error('Error adding product to cart:', error);
                showErrorNotification('Failed to add product to cart');
            }
        });
    });
}

function setupCartQuantityButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-plus')) {
            e.preventDefault();
            const cartItem = e.target.closest('.cart-item');
            const productId = cartItem.dataset.id;
            const quantityElement = cartItem.querySelector('.quantity-value');
            const currentQuantity = parseInt(quantityElement.textContent);
            
            updateCartQuantity(productId, currentQuantity + 1);
            quantityElement.textContent = currentQuantity + 1;
            updateCartDisplay();
        }
        
        if (e.target.classList.contains('quantity-minus')) {
            e.preventDefault();
            const cartItem = e.target.closest('.cart-item');
            const productId = cartItem.dataset.id;
            const quantityElement = cartItem.querySelector('.quantity-value');
            const currentQuantity = parseInt(quantityElement.textContent);
            
            if (currentQuantity > 1) {
                updateCartQuantity(productId, currentQuantity - 1);
                quantityElement.textContent = currentQuantity - 1;
            } else {
                removeFromCart(productId);
            }
            updateCartDisplay();
        }
        
        if (e.target.classList.contains('remove-item')) {
            e.preventDefault();
            const cartItem = e.target.closest('.cart-item');
            const productId = cartItem.dataset.id;
            removeFromCart(productId);
            updateCartDisplay();
        }
    });
}

function updateCartQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
}

window.addEventListener('storage', function(e) {
    if (e.key === 'products') {
        if (document.getElementById('featured-products')) {
            loadFeaturedProducts();
        }
        if (document.getElementById('products-container')) {
            loadAllProducts();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    loadTestimonials();
    updateCartCount();
    setupCartQuantityButtons();
    loadAllProducts();
});