/**
 * DUDH DAIRY - Main JavaScript
 * Navigation, Animations, and UI Interactions
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initScrollEffects();
    initAnimations();
    initProductCards();
    initQuantitySelectors();
    initSmoothScroll();
    initToastNotifications();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transition = 'all 0.3s ease';
            });
            
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                navLinks.style.display = '';
                navLinks.style.flexDirection = '';
                navLinks.style.position = '';
                navLinks.style.top = '';
                navLinks.style.left = '';
                navLinks.style.right = '';
                navLinks.style.padding = '';
                navLinks.style.boxShadow = '';
            }
        });
    }
}

/**
 * Scroll Effects (Header, Back to Top)
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Header shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Intersection Observer for Animations
 */
function initAnimations() {
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.feature-card, .product-card, .category-card, .testimonial-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
    
    // Stagger animation for grid items
    const grids = document.querySelectorAll('.features-grid, .products-grid, .categories-grid, .testimonials-grid');
    
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

/**
 * Product Card Interactions
 */
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Quantity Selector Buttons
 */
function initQuantitySelectors() {
    const quantitySections = document.querySelectorAll('.quantity-selector, .cart-item-quantity');
    
    quantitySections.forEach(section => {
        const decreaseBtn = section.querySelector('.quantity-btn:first-child, .decrease-btn');
        const increaseBtn = section.querySelector('.quantity-btn:last-child, .increase-btn');
        const valueDisplay = section.querySelector('.quantity-value, .qty-value');
        
        if (decreaseBtn && increaseBtn && valueDisplay) {
            decreaseBtn.addEventListener('click', function() {
                let currentValue = parseInt(valueDisplay.textContent);
                if (currentValue > 1) {
                    valueDisplay.textContent = currentValue - 1;
                    updateTotal();
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                let currentValue = parseInt(valueDisplay.textContent);
                valueDisplay.textContent = currentValue + 1;
                updateTotal();
            });
        }
    });
}

/**
 * Update Cart Total
 */
function updateTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = item.querySelector('.cart-item-price');
        const quantity = item.querySelector('.qty-value');
        
        if (price && quantity) {
            const priceValue = parseFloat(price.textContent.replace(/[^0-9.]/g, ''));
            const qtyValue = parseInt(quantity.textContent);
            subtotal += priceValue * qtyValue;
        }
    });
    
    const subtotalElement = document.querySelector('.summary-row span:last-child');
    const totalElement = document.querySelector('.summary-row.total span:last-child');
    
    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    }
    if (totalElement) {
        totalElement.textContent = `₹${subtotal.toFixed(2)}`;
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Toast Notifications
 */
function initToastNotifications() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }
}

/**
 * Show Toast Notification
 */
function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = 'background: #2E7D32; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); animation: fadeIn 0.3s ease; min-width: 250px;';
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Add to Cart Animation
 */
function animateAddToCart(btn) {
    const originalText = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#4CAF50';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
}

/**
 * Filter Products by Category
 */
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Sort Products by Price
 */
function sortProducts(order) {
    const productsGrid = document.querySelector('.products-grid');
    const products = Array.from(productsGrid.children);
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
        
        return order === 'low' ? priceA - priceB : priceB - priceA;
    });
    
    products.forEach(product => productsGrid.appendChild(product));
}

/**
 * Form Validation Helper
 */
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#D32F2F';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

/**
 * Debounce Function for Search/Filter
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Update Cart Count in Navigation
 */
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    let totalItems = 0;
    
    // Get from localStorage or calculate from DOM
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

/**
 * Initialize Cart from LocalStorage
 */
function initCartFromStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length > 0) {
        cartItems.forEach(item => {
            // Add to UI if cart page is loaded
            if (document.querySelector('.cart-items')) {
                addCartItemToUI(item);
            }
        });
        updateCartCount();
        updateTotal();
    }
}

/**
 * Add Cart Item to UI (for cart page)
 */
function addCartItemToUI(item) {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    const cartItemHTML = `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <span class="icon">${item.icon || '🥛'}</span>
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.variant || 'Regular'}</p>
            </div>
            <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button class="decrease-btn">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="increase-btn">+</button>
            </div>
            <span class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</span>
        </div>
    `;
    
    cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', initCartFromStorage);

// Add fadeOut animation to styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);

