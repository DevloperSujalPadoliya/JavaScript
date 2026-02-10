/**
 * DUDH DAIRY - Shopping Cart JavaScript
 * Cart Management, Storage, and Checkout
 */

// Cart State
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

/**
 * Add Product to Cart
 */
function addToCart(productId, name, price, quantity = 1, variant = '', icon = '🥛') {
    // Check if item already exists in cart
    const existingItem = cart.find(item => 
        item.id === productId && item.variant === variant
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: quantity,
            variant: variant,
            icon: icon
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartUI();
    
    // Show notification
    showToast(`${name} added to cart!`, 'success');
    
    // Animate button if triggered from product page
    const btn = event.target;
    if (btn && btn.classList.contains('btn-primary')) {
        animateAddToCart(btn);
    }
}

/**
 * Remove Product from Cart
 */
function removeFromCart(productId, variant = '') {
    cart = cart.filter(item => !(item.id === productId && item.variant === variant));
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartUI();
    updateCartCount();
    updateTotal();
    
    // Remove from DOM if on cart page
    const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
    if (cartItem) {
        cartItem.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => cartItem.remove(), 300);
    }
    
    // Show notification
    showToast('Item removed from cart', 'success');
}

/**
 * Update Product Quantity in Cart
 */
function updateQuantity(productId, newQuantity, variant = '') {
    const item = cart.find(item => 
        item.id === productId && item.variant === variant
    );
    
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
        updateCartUI();
        updateCartCount();
        updateTotal();
    }
}

/**
 * Increment Quantity
 */
function incrementQuantity(productId, variant = '') {
    const item = cart.find(item => 
        item.id === productId && item.variant === variant
    );
    
    if (item) {
        updateQuantity(productId, item.quantity + 1, variant);
    }
}

/**
 * Decrement Quantity
 */
function decrementQuantity(productId, variant = '') {
    const item = cart.find(item => 
        item.id === productId && item.variant === variant
    );
    
    if (item && item.quantity > 1) {
        updateQuantity(productId, item.quantity - 1, variant);
    }
}

/**
 * Save Cart to LocalStorage
 */
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

/**
 * Get Cart Items
 */
function getCartItems() {
    return cart;
}

/**
 * Get Cart Total
 */
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get Cart Item Count
 */
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Update Cart UI (Count Badge)
 */
function updateCartUI() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = getCartItemCount();
    
    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.transform = 'scale(1.2)';
        setTimeout(() => el.style.transform = 'scale(1)', 200);
    });
}

/**
 * Clear Entire Cart
 */
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    
    // Clear cart page UI
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <span class="icon">🛒</span>
                <h2>Your cart is empty</h2>
                <p>Add some delicious dairy products to get started!</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
    }
    
    updateTotal();
    showToast('Cart cleared!', 'success');
}

/**
 * Render Cart Items (for cart page)
 */
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <span class="icon">🛒</span>
                <h2>Your cart is empty</h2>
                <p>Add some delicious dairy products to get started!</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <span class="icon">${item.icon}</span>
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.variant || 'Regular Size'}</p>
            </div>
            <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button class="decrease-btn" onclick="decrementQuantity(${item.id}, '${item.variant}')">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="increase-btn" onclick="incrementQuantity(${item.id}, '${item.variant}')">+</button>
            </div>
            <span class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.variant}')">🗑️</span>
        </div>
    `).join('');
}

/**
 * Proceed to Checkout
 */
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Store cart data for checkout page
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    
    // Redirect to checkout or show success
    const total = getCartTotal();
    const itemCount = getCartItemCount();
    
    showToast(`Processing order for ${itemCount} items totaling ₹${total.toFixed(2)}...`, 'success');
    
    // In a real app, this would redirect to checkout
    setTimeout(() => {
        alert(`Thank you for your order!\n\nTotal: ₹${total.toFixed(2)}\nItems: ${itemCount}\n\nThis is a demo website. In a real application, you would be redirected to a payment gateway.`);
        clearCart();
    }, 1500);
}

/**
 * Add to Cart from Product Card (Event Handler)
 */
function handleAddToCart(event) {
    const card = event.target.closest('.product-card');
    if (!card) return;
    
    const productId = card.dataset.productId || Date.now();
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    const icon = card.querySelector('.icon').textContent;
    
    addToCart(productId, name, price, 1, '', icon);
}

/**
 * Initialize Cart Event Listeners
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, [onclick*="addToCart"]');
    
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
    
    // Clear cart button
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn, .proceed-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Initial UI update
    updateCartUI();
    
    // Render cart if on cart page
    if (document.querySelector('.cart-page')) {
        renderCartItems();
        updateTotal();
    }
});

/**
 * Format Currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Cart Summary Calculator
 */
function calculateCartSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;
    
    return {
        subtotal,
        shipping,
        tax,
        total
    };
}

/**
 * Update Cart Summary Display
 */
function updateCartSummaryDisplay() {
    const summary = calculateCartSummary();
    
    const subtotalEl = document.querySelector('.summary-subtotal');
    const shippingEl = document.querySelector('.summary-shipping');
    const taxEl = document.querySelector('.summary-tax');
    const totalEl = document.querySelector('.summary-total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${summary.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = summary.shipping === 0 ? 'FREE' : `₹${summary.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₹${summary.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${summary.total.toFixed(2)}`;
}

/**
 * Wishlist Functions (Bonus Feature)
 */
let wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];

function addToWishlist(productId, name, price, icon = '🥛') {
    const exists = wishlist.find(item => item.id === productId);
    
    if (!exists) {
        wishlist.push({ id: productId, name, price, icon });
        localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
        showToast(`${name} added to wishlist!`, 'success');
        return true;
    } else {
        showToast('Already in wishlist!', 'error');
        return false;
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
    showToast('Removed from wishlist', 'success');
}

function getWishlistItems() {
    return wishlist;
}

// Export functions for use in other scripts
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.incrementQuantity = incrementQuantity;
window.decrementQuantity = decrementQuantity;
window.getCartItems = getCartItems;
window.getCartTotal = getCartTotal;
window.getCartItemCount = getCartItemCount;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;

