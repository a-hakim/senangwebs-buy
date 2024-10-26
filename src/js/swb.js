// SenangWebs Buy Library
class SenangWebsBuy {
    constructor() {
        this.cart = [];
        this.storeInfo = {};
        this.colors = {
            primary: '#007bff',
            secondary: '#dc3545'
        };
        this.products = [];
        this.filteredProducts = [];
        this.sortState = {
            field: 'name',
            direction: 'asc'
        };
        this.currency = {
            code: 'USD',
            symbol: '$'
        };
        this.init();
    }

    init() {
        this.loadCartFromStorage();
        this.initializeCatalog();
        this.setupEventListeners();
        this.updateCartCount(); // Add this line to update cart count after loading
        this.renderCart();
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('swb-cart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (e) {
                this.cart = [];
                localStorage.removeItem('swb-cart');
            }
        }
    }

    saveCartToStorage() {
        localStorage.setItem('swb-cart', JSON.stringify(this.cart));
    }

    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartCount();
        this.renderCart();
        this.closeCheckout();
    }

    initializeCatalog() {
        const catalogElement = document.querySelector('[data-swb-catalog]');
        if (!catalogElement) return;

        // Get store information
        this.storeInfo = {
            name: catalogElement.getAttribute('data-swb-store'),
            whatsapp: catalogElement.getAttribute('data-swb-whatsapp'),
            floatingCart: catalogElement.hasAttribute('data-swb-cart-floating'),
            cartEnabled: catalogElement.getAttribute('data-swb-cart') !== 'false'
        };

        // Get custom colors
        const primaryColor = catalogElement.getAttribute('data-swb-color-primary');
        const secondaryColor = catalogElement.getAttribute('data-swb-color-secondary');

        if (primaryColor) this.colors.primary = primaryColor;
        if (secondaryColor) this.colors.secondary = secondaryColor;

        // Get currency
        const currencyCode = catalogElement.getAttribute('data-swb-currency');
        if (currencyCode) {
            this.setCurrency(currencyCode);
        }

        // Create catalog header
        this.createCatalogHeader(catalogElement);

        // Apply custom colors
        this.applyCustomColors();

        // Initialize products - Updated to properly track names from content
        const productElements = catalogElement.querySelectorAll('[data-swb-product]');
        this.products = Array.from(productElements).map(elem => {
            const nameElement = elem.querySelector('[data-swb-product-name]');
            return {
                element: elem,
                sku: elem.getAttribute('data-swb-product-sku'),
                name: elem.getAttribute('data-swb-product-name'),
                price: parseFloat(elem.getAttribute('data-swb-product-price'))
            };
        });
        this.filteredProducts = [...this.products];

        // Initialize each product
        this.products.forEach(product => {
            this.initializeProduct(product.element);
        });
    }

    setCurrency(code) {
        const currencies = {
            USD: { code: 'USD', symbol: '$' },
            EUR: { code: 'EUR', symbol: '€' },
            GBP: { code: 'GBP', symbol: '£' },
            JPY: { code: 'JPY', symbol: '¥' },
            CNY: { code: 'CNY', symbol: '¥' },
            MYR: { code: 'MYR', symbol: 'RM' },
            SGD: { code: 'SGD', symbol: 'S$' },
            AUD: { code: 'AUD', symbol: 'A$' },
            CAD: { code: 'CAD', symbol: 'C$' },
            INR: { code: 'INR', symbol: '₹' },
            KRW: { code: 'KRW', symbol: '₩' },
            THB: { code: 'THB', symbol: '฿' },
            PHP: { code: 'PHP', symbol: '₱' },
            IDR: { code: 'IDR', symbol: 'Rp' },
            VND: { code: 'VND', symbol: '₫' },
            KZT: { code: 'KZT', symbol: '₸' },
            PLN: { code: 'PLN', symbol: 'zł' }
        };
    
        if (currencies[code]) {
            this.currency = currencies[code];
        }
    }

    formatPrice(amount) {
        return `${this.currency.symbol}${amount.toFixed(2)}`;
    }

    createCatalogHeader(catalogElement) {
        const header = document.createElement('div');
        header.classList.add('swb-catalog-header');
    
        // Create search box
        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = 'Search products...';
        searchBox.classList.add('swb-search-input');
        searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value));
    
        // Create sort dropdown
        const sortSelect = document.createElement('select');
        sortSelect.classList.add('swb-sort-select');
        sortSelect.innerHTML = `
            <option value="name-asc">Name (A to Z)</option>
            <option value="name-desc">Name (Z to A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
        `;
        sortSelect.addEventListener('change', (e) => {
            const [field, direction] = e.target.value.split('-');
            this.handleSort(field, direction);
        });
    
        const headerControl = document.createElement('div');
        headerControl.classList.add('swb-catalog-header-control');
    
        headerControl.appendChild(sortSelect);
    
        // Create cart button (if not floating and cart is enabled)
        if (!this.storeInfo.floatingCart && this.storeInfo.cartEnabled) {
            const cartBtn = document.createElement('button');
            cartBtn.classList.add('swb-cart-button');
            cartBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M528.1 301.3l47.3-208C578.8 78.3 567.4 64 552 64H159.2l-9.2-44.8C147.8 8 137.9 0 126.5 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24h69.9l70.2 343.4C147.3 417.1 136 435.2 136 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-15.7-6.4-29.8-16.8-40h209.6C430.4 426.2 424 440.3 424 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.2-12.9-41.3-31.6-50.4l5.5-24.3c3.4-15-8-29.3-23.4-29.3H218.1l-6.5-32h293.1c11.2 0 20.9-7.8 23.4-18.7z"/>
                </svg>
                <span class="swb-cart-count">0</span>
            `;
            cartBtn.addEventListener('click', () => this.showCheckout());
            headerControl.appendChild(cartBtn);
        }
    
        header.appendChild(searchBox);
        header.appendChild(headerControl);
    
        catalogElement.insertBefore(header, catalogElement.firstChild);
    }

    handleSearch(query) {
        query = query.toLowerCase();
        this.filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query)
        );
        this.updateProductDisplay();
    }

    handleSort(field, direction = 'asc') {
        this.sortState.field = field;
        this.sortState.direction = direction;

        // Copy the filtered products to avoid mutating the original array
        const sortedProducts = [...this.filteredProducts];

        // Sort the products
        sortedProducts.sort((a, b) => {
            let valueA, valueB;

            if (field === 'price') {
                valueA = a.price;
                valueB = b.price;
            } else {
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
            }

            if (field === 'price') {
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                return direction === 'asc' ?
                    valueA.localeCompare(valueB) :
                    valueB.localeCompare(valueA);
            }
        });

        // Update filtered products with sorted array
        this.filteredProducts = sortedProducts;

        // Update display
        this.updateProductDisplay();
    }

    updateSortIndicators() {
        const indicators = document.querySelectorAll('.swb-sort-indicator');
        indicators.forEach(indicator => {
            indicator.textContent = '';
        });

        // Find the active sort button by looking at all sort buttons
        const sortButtons = document.querySelectorAll('.swb-sort-button');
        sortButtons.forEach(button => {
            // Check if button text contains the current sort field
            const buttonText = button.textContent.toLowerCase();
            const isActiveButton =
                (this.sortState.field === 'name' && buttonText.includes('name')) ||
                (this.sortState.field === 'price' && buttonText.includes('price'));

            if (isActiveButton) {
                const indicator = button.querySelector('.swb-sort-indicator');
                if (indicator) {
                    indicator.textContent = this.sortState.direction === 'asc' ? ' ↑' : ' ↓';
                }
            }
        });
    }

    updateProductDisplay() {
        const container = document.querySelector('[data-swb-catalog]');
        if (!container) return;

        const productGrid = container.querySelector('.grid');
        if (!productGrid) return;

        // Remove all products from the grid
        Array.from(productGrid.children).forEach(child => {
            productGrid.removeChild(child);
        });

        // Add filtered products back in sorted order
        this.filteredProducts.forEach(product => {
            productGrid.appendChild(product.element);
        });
    }

    setupEventListeners() {
        // Only create floating cart if specified
        if (this.storeInfo.floatingCart && this.storeInfo.cartEnabled) {
            this.createCartIcon();
        }
    
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('swb-modal-close')) {
                this.closeCheckout();
            }
        });
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);

        // Update all cart count displays
        const cartCountElements = document.querySelectorAll('.swb-cart-count');
        cartCountElements.forEach(element => {
            // Check if this is in the modal subheader
            if (element.closest('.swb-cart-subheader')) {
                element.textContent = this.cart.length; // Show number of unique items
            } else {
                element.textContent = count; // Show total quantity for cart icon
            }
        });
    }

    applyCustomColors() {
        const customStyles = `
            /* Common styles for interactive elements */
            .swb-sort-button,
            .swb-cart-button,
            .swb-add-to-cart,
            .swb-checkout-form button {
                background: ${this.colors.primary};
                color: white;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                justify-content: center;
            }
    
            .swb-sort-button:hover,
            .swb-cart-button:hover,
            .swb-add-to-cart:hover,
            .swb-checkout-form button:hover {
                background: ${this.adjustColor(this.colors.primary, -20)};
            }
    
            /* Common styles for form inputs */
            .swb-search-input,
            .swb-sort-select,
            .swb-checkout-form input,
            .swb-checkout-form textarea {
                padding: 0.5rem 1rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 1rem;
            }
    
            .swb-search-input:focus,
            .swb-sort-select:focus,
            .swb-checkout-form input:focus,
            .swb-checkout-form textarea:focus {
                outline: none;
                border-color: ${this.colors.primary};
                box-shadow: 0 0 0 2px ${this.colors.primary}33;
            }
    
            /* Catalog Header */
            .swb-catalog-header {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                align-items: center;
            }
    
            .swb-catalog-header-control {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
    
            .swb-search-input {
                flex: 1;
            }
    
            /* Sort Select */
            .swb-sort-select {
                min-width: 200px;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 0.75rem center;
                background-size: 1em;
                padding-right: 2.5rem;
            }
    
            /* Cart Button and Icon */
            .swb-cart-button,
            .swb-cart-icon {
                position: relative;
            }
    
            .swb-cart-icon {
                background: ${this.colors.primary};
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px;
                border-radius: 50%;
                z-index: 1000;
            }
    
            .swb-cart-icon:hover {
                background: ${this.adjustColor(this.colors.primary, -20)};
            }
    
            .swb-cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background: ${this.colors.secondary};
                color: white;
                border-radius: 50%;
                padding: 4px 8px;
                font-size: 12px;
            }
    
            /* Cart Modal */
            .swb-cart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
    
            .swb-cart-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }
    
            .swb-cart-subheader {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #eee;
            }
    
            .swb-cart-subheader p {
                margin: 0;
                color: #666;
                font-size: 0.875rem;
            }
    
            .swb-clear-cart {
                color: ${this.colors.primary};
                border: none;
                cursor: pointer;
                font-size: 0.875rem;
                transition: color 0.2s ease;
            }
    
            .swb-clear-cart:hover {
                color: ${this.adjustColor(this.colors.primary, -20)};
            }
    
            /* Product Buttons */
            .swb-external-link {
                background: transparent;
                color: ${this.colors.primary};
                padding: 0.5rem 1rem;
                border: 2px solid ${this.colors.primary};
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                text-decoration: none;
                justify-content: center;
            }

            .swb-external-link:hover {
                background: ${this.colors.primary};
                color: white;
            }

            [data-swb-product-buttons] {
                margin-top: 1rem;
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            [data-swb-product-buttons] > * {
                flex: 1;
            }
        
            [data-swb-product-buttons] .swb-add-to-cart {
                width: 100%;
                margin-top: 0;
            }
    
            /* Cart Items */
            .swb-item-quantity button {
                width: 24px;
                height: 24px;
                padding: 0;
            }
    
            .swb-remove-item {
                color: ${this.colors.secondary};
                border: 2px solid ${this.colors.secondary};
                background: transparent;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
    
            .swb-remove-item:hover {
                background: ${this.colors.secondary};
                color: white;
            }
    
            /* Responsive Design */
            @media (max-width: 640px) {
                .swb-catalog-header {
                    flex-direction: column;
                }
    
                .swb-catalog-header-control,
                .swb-sort-select {
                    width: 100%;
                }
            }
        `;
    
        // Remove existing custom styles if they exist
        const existingStyles = document.querySelector('#swb-custom-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
    
        const styleSheet = document.createElement('style');
        styleSheet.id = 'swb-custom-styles';
        styleSheet.textContent = customStyles;
        document.head.appendChild(styleSheet);
    }

    // Helper function to darken/lighten colors
    adjustColor(color, amount) {
        const clamp = (num) => Math.min(255, Math.max(0, num));

        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Adjust each component
        const adjustR = clamp(r + amount);
        const adjustG = clamp(g + amount);
        const adjustB = clamp(b + amount);

        // Convert back to hex
        return '#' + [adjustR, adjustG, adjustB]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    }

    initializeProduct(productElement) {
        const buttonsContainer = productElement.querySelector('[data-swb-product-buttons]');
        if (!buttonsContainer) return;
    
        // Add external link button if link is provided
        const externalLink = productElement.getAttribute('data-swb-product-link');
        const externalLinkTitle = productElement.getAttribute('data-swb-product-link-title');
        if (externalLink && externalLinkTitle) {
            const linkBtn = document.createElement('a');
            linkBtn.href = externalLink;
            linkBtn.target = "_blank";
            linkBtn.rel = "noopener noreferrer";
            linkBtn.classList.add('swb-external-link');
            linkBtn.innerHTML = `
                <span>${externalLinkTitle}</span>
            `;
            buttonsContainer.appendChild(linkBtn);
        }
    
        // Add cart button if cart is enabled
        const cartBtnTitle = productElement.getAttribute('data-swb-product-add-cart-title');
        if (this.storeInfo.cartEnabled) {
            const addToCartBtn = document.createElement('button');
            addToCartBtn.textContent = cartBtnTitle || 'Add to Cart';
            addToCartBtn.classList.add('swb-add-to-cart');
            addToCartBtn.onclick = () => this.addToCart(productElement);
            buttonsContainer.appendChild(addToCartBtn);
        }
    }

    createCartIcon() {
        const cartIcon = document.createElement('div');
        cartIcon.classList.add('swb-cart-icon');
        const totalCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        cartIcon.innerHTML = `
            <div class="swb-cart-count">${totalCount}</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M528.1 301.3l47.3-208C578.8 78.3 567.4 64 552 64H159.2l-9.2-44.8C147.8 8 137.9 0 126.5 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24h69.9l70.2 343.4C147.3 417.1 136 435.2 136 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-15.7-6.4-29.8-16.8-40h209.6C430.4 426.2 424 440.3 424 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.2-12.9-41.3-31.6-50.4l5.5-24.3c3.4-15-8-29.3-23.4-29.3H218.1l-6.5-32h293.1c11.2 0 20.9-7.8 23.4-18.7z"/></svg>
        `;
        cartIcon.onclick = () => this.showCheckout();
        document.body.appendChild(cartIcon);
    }

    addToCart(productElement) {
        const product = {
            sku: productElement.getAttribute('data-swb-product-sku'),
            name: productElement.getAttribute('data-swb-product-name'),
            price: parseFloat(productElement.getAttribute('data-swb-product-price')),
            quantity: 1
        };

        const existingProduct = this.cart.find(item => item.sku === product.sku);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            this.cart.push(product);
        }

        this.saveCartToStorage();
        this.updateCartCount();
        this.renderCart();
    }

    renderCart() {
        const cartModal = document.querySelector('.swb-cart-modal');
        if (!cartModal) return;
    
        const cartItems = cartModal.querySelector('.swb-cart-items');
        cartItems.innerHTML = '';
    
        this.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('swb-cart-item');
            itemElement.innerHTML = `
                <div class="swb-item-name">${item.name}</div>
                <div class="swb-item-quantity">
                    <button onclick="swb.updateQuantity('${item.sku}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="swb.updateQuantity('${item.sku}', 1)">+</button>
                </div>
                <div class="swb-item-price">${this.formatPrice(item.price * item.quantity)}</div>
                <button onclick="swb.removeFromCart('${item.sku}')" class="swb-remove-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 352 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/></svg>
                </button>
            `;
            cartItems.appendChild(itemElement);
        });
    
        this.updateTotal();
    }

    updateQuantity(sku, change) {
        const product = this.cart.find(item => item.sku === sku);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                this.removeFromCart(sku);
            } else {
                this.saveCartToStorage();
                this.renderCart();
                this.updateCartCount();
            }
        }
    }

    removeFromCart(sku) {
        this.cart = this.cart.filter(item => item.sku !== sku);
        this.saveCartToStorage();
        this.renderCart();
        this.updateCartCount();
    }

    updateTotal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalElement = document.querySelector('.swb-cart-total');
        if (totalElement) {
            totalElement.textContent = `Total: ${this.formatPrice(total)}`;
        }
    }

    showCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        let modal = document.querySelector('.swb-cart-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.classList.add('swb-cart-modal');
            modal.innerHTML = `
                <div class="swb-modal-content">
                    <button class="swb-modal-close">×</button>
                    <div class="swb-cart-header">
                        <h2>Your Cart</h2>
                    </div>
                    <div class="swb-cart-subheader">
                        <p>Items</p>
                        <button class="swb-clear-cart">Clear All</button>
                    </div>
                    <div class="swb-cart-items"></div>
                    <div class="swb-cart-total">Total: $0.00</div>
                    <form class="swb-checkout-form">
                        <input type="text" name="name" placeholder="Full Name" required>
                        <input type="email" name="email" placeholder="Email" required>
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                        <textarea name="address" placeholder="Delivery Address" required></textarea>
                        <button type="submit">Proceed to WhatsApp</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            // Setup form submission
            const form = modal.querySelector('.swb-checkout-form');
            form.onsubmit = (e) => {
                e.preventDefault();
                this.processCheckout(new FormData(form));
            };

            // Setup clear all button
            const clearBtn = modal.querySelector('.swb-clear-cart');
            clearBtn.onclick = () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart();
                }
            };
        }

        this.renderCart();
        this.updateCartCount(); // Ensure count is updated when modal is shown
        modal.style.display = 'block';
    }

    closeCheckout() {
        const modal = document.querySelector('.swb-cart-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    processCheckout(formData) {
        const customerInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        };

        const message = this.formatWhatsAppMessage(customerInfo);
        const whatsappUrl = `https://wa.me/${this.storeInfo.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart after successful checkout
        localStorage.removeItem('swb-cart');
        this.cart = [];
        this.updateCartCount();
        this.closeCheckout();
    }

    formatWhatsAppMessage(customerInfo) {
        const orderDate = new Date().toLocaleString();
        let message = `New Order from ${this.storeInfo.name}\n`;
        message += `Date: ${orderDate}\n\n`;
        message += `Customer Information:\n`;
        message += `Name: ${customerInfo.name}\n`;
        message += `Email: ${customerInfo.email}\n`;
        message += `Phone: ${customerInfo.phone}\n`;
        message += `Address: ${customerInfo.address}\n\n`;
        message += `Order Details:\n`;
        
        this.cart.forEach(item => {
            message += `- ${item.name} (SKU: ${item.sku})\n`;
            message += `  Quantity: ${item.quantity}\n`;
            message += `  Price: ${this.formatPrice(item.price * item.quantity)}\n\n`;
        });
    
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `Total Amount: ${this.formatPrice(total)}`;
    
        return message;
    }
}

// Add default styles (non-color specific styles)
const styles = `
    .swb-cart-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
    }

    .swb-search-input {
        width: 100%;
        min-width: 200px;
    }

    .swb-cart-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1001;
    }

    .swb-modal-content {
        position: relative;
        background: white;
        margin: 50px auto;
        padding: 20px;
        width: 90%;
        max-width: 600px;
        border-radius: 8px;
    }

    .swb-modal-close {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 24px;
        cursor: pointer;
        border: none;
        background: none;
    }

    .swb-cart-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }

    .swb-checkout-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
    }

    .swb-checkout-form input,
    .swb-checkout-form textarea {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .swb-item-quantity {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;

// Initialize styles and create instance
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

window.swb = new SenangWebsBuy();