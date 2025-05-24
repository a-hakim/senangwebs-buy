// SenangWebs Buy Library
class SWB {
    constructor() {
        this.stores = new Map();
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
        this.checkoutConfig = new Map();
    }

    init() {
        this.initializeCatalogs();
        this.initializeIndependentButtons();
        this.setupEventListeners();
        this.updateCustomProperties();
    }

    initializeStore(storeId, storeData = {}) {
        if (!this.stores.has(storeId)) {
            this.stores.set(storeId, {
                cart: this.loadCartFromStorage(storeId),
                info: {
                    name: storeData.name || storeId,
                    whatsapp: storeData.whatsapp || '',
                    cartEnabled: storeData.cartEnabled !== false,
                    floatingCart: storeData.floatingCart || false,
                    // Add new checkout configuration
                    checkoutTitle: storeData.checkoutTitle || 'Your Cart',
                    billingTitle: storeData.billingTitle || 'Billing Details',
                    submitButtonText: storeData.submitButtonText || 'Proceed to WhatsApp',
                    enableBilling: storeData.enableBilling !== false,
                    customFields: storeData.customFields || []
                },
                products: [],
                filteredProducts: [],
                sortState: {
                    field: 'name',
                    direction: 'asc'
                }
            });
        }
        return this.stores.get(storeId);
    }

    loadCartFromStorage(storeId) {
        const storageKey = `swb-cart-${storeId}`;
        const savedCart = localStorage.getItem(storageKey);
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (e) {
                localStorage.removeItem(storageKey);
            }
        }
        return [];
    }

    saveCartToStorage(storeId, cart) {
        const storageKey = `swb-cart-${storeId}`;
        localStorage.setItem(storageKey, JSON.stringify(cart));
    }

    clearCart(storeId) {
        const store = this.stores.get(storeId);
        if (!store) return;

        store.cart = [];
        this.saveCartToStorage(storeId, store.cart);
        this.updateCartCount(storeId);
        this.renderCart(storeId);
        this.closeCheckout(storeId);
    }

    updateCustomProperties() {
        document.documentElement.style.setProperty('--swb-color-primary', this.colors.primary);
        document.documentElement.style.setProperty('--swb-color-secondary', this.colors.secondary);
        
        const primaryRGB = this.hexToRGB(this.colors.primary);
        const secondaryRGB = this.hexToRGB(this.colors.secondary);
        
        document.documentElement.style.setProperty('--swb-color-primary-rgb', primaryRGB);
        document.documentElement.style.setProperty('--swb-color-secondary-rgb', secondaryRGB);
    }

    hexToRGB(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    initializeCatalogs() {
        const catalogElements = document.querySelectorAll('[data-swb-catalog]');
        catalogElements.forEach(catalog => {
            const storeId = catalog.getAttribute('data-swb-store-id');
            if (!storeId) return;

            let customFields = [];
            try {
                const customFieldsAttr = catalog.getAttribute('data-swb-custom-fields');
                if (customFieldsAttr) {
                    customFields = JSON.parse(customFieldsAttr);
                }
            } catch (e) {
                console.warn('Invalid custom fields format', e);
            }

            this.initializeStore(storeId, {
                name: catalog.getAttribute('data-swb-store'),
                whatsapp: catalog.getAttribute('data-swb-whatsapp'),
                floatingCart: catalog.hasAttribute('data-swb-cart-floating') ? catalog.getAttribute('data-swb-cart-floating') : false,
                cartEnabled: catalog.getAttribute('data-swb-cart') !== 'false',
                checkoutTitle: catalog.getAttribute('data-swb-checkout-title') || 'Your Cart',
                billingTitle: catalog.getAttribute('data-swb-billing-title') || 'Billing Details',
                submitButtonText: catalog.getAttribute('data-swb-submit-text') || 'Proceed to WhatsApp',
                enableBilling: catalog.getAttribute('data-swb-enable-billing') !== 'false',
                customFields: customFields
            });

            const primaryColor = catalog.getAttribute('data-swb-color-primary');
            const secondaryColor = catalog.getAttribute('data-swb-color-secondary');
            if (primaryColor) this.colors.primary = primaryColor;
            if (secondaryColor) this.colors.secondary = secondaryColor;

            const currencyCode = catalog.getAttribute('data-swb-currency');
            if (currencyCode) this.setCurrency(currencyCode);

            this.createCatalogHeader(catalog, storeId);
            this.initializeCatalogProducts(catalog, storeId);
        });
    }

    initializeIndependentButtons() {
        document.querySelectorAll('[data-swb-cart][data-swb-store-id]').forEach(button => {
            if (!button.hasAttribute('data-swb-catalog')) {
                const storeId = button.getAttribute('data-swb-store-id');

                this.initializeStore(storeId, {
                    name: button.getAttribute('data-swb-store'),
                    whatsapp: button.getAttribute('data-swb-whatsapp'),
                    cartEnabled: true,
                    floatingCart: false
                });
    
                const primaryColor = button.getAttribute('data-swb-color-primary');
                const secondaryColor = button.getAttribute('data-swb-color-secondary');
                if (primaryColor) this.colors.primary = primaryColor;
                if (secondaryColor) this.colors.secondary = secondaryColor;
    
                const currencyCode = button.getAttribute('data-swb-currency');
                if (currencyCode) this.setCurrency(currencyCode);

                button.addEventListener('click', () => {
                    this.showCheckout(storeId);
                });

                const counter = button.querySelector('[data-swb-cart-count]');
                if (counter) {
                    this.updateCartCount(storeId);
                }
            }
        });

        document.querySelectorAll('[data-swb-product-sku][data-swb-store-id]').forEach(button => {
            if (!button.hasAttribute('data-swb-catalog')) {
                const storeId = button.getAttribute('data-swb-store-id');
                const sku = button.getAttribute('data-swb-product-sku');
                
                const store = this.stores.get(storeId);
                if (!store) {
                    console.warn(`Store ${storeId} not initialized. Make sure you have a cart button with store information.`);
                    return;
                }
                
                button.addEventListener('click', () => {
                    const product = {
                        sku: sku,
                        name: button.getAttribute('data-swb-product-name') || sku,
                        price: parseFloat(button.getAttribute('data-swb-product-price')) || 0,
                        quantity: 1
                    };
                    this.addToCart(storeId, product);
                });
            }
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
            VND: { code: 'VND', symbol: '₫' }
        };
    
        if (currencies[code]) {
            this.currency = currencies[code];
        }
    }

    formatPrice(amount) {
        return `${this.currency.symbol}${amount.toFixed(2)}`;
    }

    createCatalogHeader(catalog, storeId) {
        const header = document.createElement('div');
        header.classList.add('swb-catalog-header');
    
        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = 'Search products...';
        searchBox.classList.add('swb-search-input');
        searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value, storeId));
    
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
            this.handleSort(field, direction, storeId);
        });
    
        const headerControl = document.createElement('div');
        headerControl.classList.add('swb-catalog-header-control');
        headerControl.appendChild(sortSelect);
    
        const store = this.stores.get(storeId);
        const count = store.cart.reduce((total, item) => total + item.quantity, 0);
        if (store.info.cartEnabled) {
            const cartBtn = document.createElement('button');
            cartBtn.classList.add('swb-cart-button');
            if (store.info.floatingCart === 'true') {
                cartBtn.classList.add('swb-cart-button-floating');
            }
            cartBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M528.1 301.3l47.3-208C578.8 78.3 567.4 64 552 64H159.2l-9.2-44.8C147.8 8 137.9 0 126.5 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24h69.9l70.2 343.4C147.3 417.1 136 435.2 136 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-15.7-6.4-29.8-16.8-40h209.6C430.4 426.2 424 440.3 424 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.2-12.9-41.3-31.6-50.4l5.5-24.3c3.4-15-8-29.3-23.4-29.3H218.1l-6.5-32h293.1c11.2 0 20.9-7.8 23.4-18.7z"/>
                </svg>
                <span class="swb-cart-count" data-swb-cart-count>${count}</span>
            `;
            cartBtn.addEventListener('click', () => this.showCheckout(storeId));
            headerControl.appendChild(cartBtn);
        }
    
        header.appendChild(searchBox);
        header.appendChild(headerControl);
        catalog.insertBefore(header, catalog.firstChild);
    }

    initializeCatalogProducts(catalog, storeId) {
        const store = this.stores.get(storeId);
        if (!store) return;

        const productElements = catalog.querySelectorAll('[data-swb-product]');
        store.products = Array.from(productElements).map(elem => {
            return {
                element: elem,
                sku: elem.getAttribute('data-swb-product-sku'),
                name: elem.getAttribute('data-swb-product-name'),
                price: parseFloat(elem.getAttribute('data-swb-product-price'))
            };
        });
        store.filteredProducts = [...store.products];

        store.products.forEach(product => {
            this.initializeProduct(product.element, storeId);
        });
    }

    initializeProduct(productElement, storeId) {
        const buttonsContainer = productElement.querySelector('[data-swb-product-buttons]');
        if (!buttonsContainer) return;
    
        const externalLink = productElement.getAttribute('data-swb-product-link');
        const externalLinkTitle = productElement.getAttribute('data-swb-product-link-title');
        if (externalLink && externalLinkTitle) {
            const linkBtn = document.createElement('a');
            linkBtn.href = externalLink;
            linkBtn.target = "_blank";
            linkBtn.rel = "noopener noreferrer";
            linkBtn.classList.add('swb-external-link');
            linkBtn.innerHTML = `<span>${externalLinkTitle}</span>`;
            buttonsContainer.appendChild(linkBtn);
        }
    
        const store = this.stores.get(storeId);
        if (store && store.info.cartEnabled) {
            const cartBtnTitle = productElement.getAttribute('data-swb-product-add-cart-title');
            const addToCartBtn = document.createElement('button');
            addToCartBtn.textContent = cartBtnTitle || 'Add to Cart';
            addToCartBtn.classList.add('swb-add-to-cart');
            addToCartBtn.onclick = () => {
                const product = {
                    sku: productElement.getAttribute('data-swb-product-sku'),
                    name: productElement.getAttribute('data-swb-product-name'),
                    price: parseFloat(productElement.getAttribute('data-swb-product-price')),
                    quantity: 1
                };
                this.addToCart(storeId, product);
            };
            buttonsContainer.appendChild(addToCartBtn);
        }
    }

    handleSearch(query, storeId) {
        const store = this.stores.get(storeId);
        if (!store) return;

        query = query.toLowerCase();
        store.filteredProducts = store.products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query)
        );
        this.updateProductDisplay(storeId);
    }

    handleSort(field, direction, storeId) {
        const store = this.stores.get(storeId);
        if (!store) return;

        store.sortState.field = field;
        store.sortState.direction = direction;

        const sortedProducts = [...store.filteredProducts];

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

        store.filteredProducts = sortedProducts;
        this.updateProductDisplay(storeId);
    }

    updateProductDisplay(storeId) {
        const store = this.stores.get(storeId);
        if (!store) return;

        const catalog = document.querySelector(`[data-swb-catalog][data-swb-store-id="${storeId}"]`);
        if (!catalog) return;

        const productGrid = catalog.querySelector('.swb-grid');
        if (!productGrid) return;

        Array.from(productGrid.children).forEach(child => {
            productGrid.removeChild(child);
        });

        store.filteredProducts.forEach(product => {
            productGrid.appendChild(product.element);
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.swb-modal-close') || e.target.closest('.swb-modal-close')) {
                const modal = e.target.closest('.swb-cart-modal');
                if (modal) {
                    const storeId = modal.getAttribute('data-swb-store-id');
                    this.closeCheckout(storeId);
                }
            }
        });
    }

    updateCartCount(storeId) {
        const store = this.stores.get(storeId);
        if (!store) return;

        const count = store.cart.reduce((total, item) => total + item.quantity, 0);

        document.querySelectorAll(`[data-swb-store-id="${storeId}"] [data-swb-cart-count]`).forEach(counter => {
            counter.textContent = count;
        });

        const modalCounters = document.querySelectorAll(`.swb-cart-modal[data-swb-store-id="${storeId}"] .swb-cart-count`);
        modalCounters.forEach(counter => {
            if (counter.closest('.swb-cart-subheader')) {
                counter.textContent = store.cart.length;
            } else {
                counter.textContent = count;
            }
        });
    }

    addToCart(storeId, product) {
        const store = this.stores.get(storeId);
        if (!store) return;

        const existingProduct = store.cart.find(item => item.sku === product.sku);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            store.cart.push(product);
        }

        this.saveCartToStorage(storeId, store.cart);
        this.updateCartCount(storeId);
        this.renderCart(storeId);
    }

    renderCart(storeId) {
        const cartModal = document.querySelector(`.swb-cart-modal[data-swb-store-id="${storeId}"]`);
        if (!cartModal) return;

        const store = this.stores.get(storeId);
        if (!store) return;
    
        const cartItems = cartModal.querySelector('.swb-cart-items');
        cartItems.innerHTML = '';
    
        store.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('swb-cart-item');
            itemElement.innerHTML = `
                <div class="swb-item-name">${item.name}</div>
                <div class="swb-item-quantity">
                    <button onclick="swb.updateQuantity('${storeId}', '${item.sku}', -1)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12" fill="currentColor">
                            <path d="M416 208H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"/>
                        </svg>
                    </button>
                    <span>${item.quantity}</span>
                    <button onclick="swb.updateQuantity('${storeId}', '${item.sku}', 1)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12" fill="currentColor">
                            <path d="M416 208H272V64c0-17.7-14.3-32-32-32h-32c-17.7 0-32 14.3-32 32v144H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h144v144c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V304h144c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"/>
                        </svg>
                    </button>
                </div>
                <div class="swb-item-price">${item.price ? this.formatPrice(item.price * item.quantity) : ''}</div>
                <button onclick="swb.removeFromCart('${storeId}', '${item.sku}')" class="swb-remove-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 352 512">
                        <path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/>
                    </svg>
                </button>
            `;
            cartItems.appendChild(itemElement);
        });
    
        this.updateTotal(storeId);
    }

    updateQuantity(storeId, sku, change) {
        const store = this.stores.get(storeId);
        if (!store) return;

        const product = store.cart.find(item => item.sku === sku);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                this.removeFromCart(storeId, sku);
            } else {
                this.saveCartToStorage(storeId, store.cart);
                this.renderCart(storeId);
                this.updateCartCount(storeId);
            }
        }
    }

    removeFromCart(storeId, sku) {
        const store = this.stores.get(storeId);
        if (!store) return;

        store.cart = store.cart.filter(item => item.sku !== sku);
        this.updateTotal(storeId);
        this.saveCartToStorage(storeId, store.cart);
        this.renderCart(storeId);
        this.updateCartCount(storeId);
    }

    updateTotal(storeId) {
        const store = this.stores.get(storeId);
        if (!store) return;

        const total = store.cart.reduce((sum, item) => sum + item.price ? (item.price * item.quantity) : 0, 0);
        const totalElement = document.querySelector(`.swb-cart-modal[data-swb-store-id="${storeId}"] .swb-cart-total`);
        if (totalElement) {
            totalElement.textContent = `Total: ${this.formatPrice(total)}`;
        }
    }

    showCheckout(storeId) {
        const store = this.stores.get(storeId);
        if (!store || store.cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        let modal = document.querySelector(`.swb-cart-modal[data-swb-store-id="${storeId}"]`);
        if (!modal) {
            modal = document.createElement('div');
            modal.classList.add('swb-cart-modal');
            modal.setAttribute('data-swb-store-id', storeId);
            
            const customFieldsHtml = store.info.customFields.map(field => `
                <div class="swb-custom-field">
                    <input type="${field.type || 'text'}" 
                           name="${field.name}"
                           placeholder="${field.placeholder || ''}"
                           ${field.required ? 'required' : ''}
                           ${field.pattern ? `pattern="${field.pattern}"` : ''}
                           ${field.min ? `min="${field.min}"` : ''}
                           ${field.max ? `max="${field.max}"` : ''}>
                </div>
            `).join('');

            modal.innerHTML = `
                <div class="swb-modal-content">
                    <div class="swb-cart-header">
                        <h2>${store.info.checkoutTitle}</h2>
                    </div>
                    <div class="swb-modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="16" height="16" fill="currentColor">
                            <path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/>
                        </svg>
                    </div>
                    <div class="swb-cart-subheader">
                        <p>Items</p>
                        <button class="swb-clear-cart">Clear All</button>
                    </div>
                    <div class="swb-cart-items"></div>
                    <div class="swb-cart-total">Total: ${this.formatPrice(0)}</div>
                    <form class="swb-checkout-form">
                        ${store.info.enableBilling ? `
                        <h2>${store.info.billingTitle}</h2>
                        <input type="text" name="name" placeholder="Full Name" required>
                        <input type="email" name="email" placeholder="Email" required>
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                        <textarea name="address" placeholder="Delivery Address" required></textarea>
                        ` : ''}
                        ${customFieldsHtml}
                        <button type="submit">${store.info.submitButtonText}</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            const form = modal.querySelector('.swb-checkout-form');
            if (form) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    this.processCheckout(storeId, new FormData(form));
                };
            }

            const clearBtn = modal.querySelector('.swb-clear-cart');
            clearBtn.onclick = () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart(storeId);
                }
            };
        }

        this.renderCart(storeId);
        this.updateCartCount(storeId);
        modal.style.display = 'block';
    }

    closeCheckout(storeId) {
        const modal = document.querySelector(`.swb-cart-modal[data-swb-store-id="${storeId}"]`);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    processCheckout(storeId, formData) {
        const store = this.stores.get(storeId);
        if (!store) return;

        const customerInfo = {};
        formData.forEach((value, key) => {
            customerInfo[key] = value;
        });

        const message = this.formatWhatsAppMessage(storeId, customerInfo);
        const whatsappUrl = `https://wa.me/${store.info.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        this.clearCart(storeId);
    }

    formatWhatsAppMessage(storeId, customerInfo) {
        const store = this.stores.get(storeId);
        if (!store) return '';

        const orderDate = new Date().toLocaleString();
        let message = `New Order from ${store.info.name}\n`;
        message += `Date: ${orderDate}\n\n`;

        if (store.info.enableBilling) {
            message += `Customer Information:\n`;
            message += `Name: ${customerInfo.name}\n`;
            message += `Email: ${customerInfo.email}\n`;
            message += `Phone: ${customerInfo.phone}\n`;
            message += `Address: ${customerInfo.address}\n\n`;
        }

        store.info.customFields.forEach(field => {
            if (customerInfo[field.name]) {
                message += `${field.label || field.name}: ${customerInfo[field.name]}\n`;
            }
        });
        
        message += `Order Details:\n`;
        
        store.cart.forEach(item => {
            message += `- ${item.name} (SKU: ${item.sku})\n`;
            message += `  Quantity: ${item.quantity}\n`;
            if (item.price) {
                message += `  Price: ${this.formatPrice(item.price * item.quantity)}\n\n`;
            }
        });
    
        const total = store.cart.reduce((sum, item) => sum + item.price ? (item.price * item.quantity) : 0, 0);
        if (total > 0) {
            message += `Total Amount: ${this.formatPrice(total)}`;
        }
    
        return message;
    }
}

window.swb = new SWB();