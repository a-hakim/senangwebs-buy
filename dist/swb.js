!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.SWB=e():t.SWB=e()}(this,(()=>{return t={r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={},(()=>{function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t){return function(t){if(Array.isArray(t))return r(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||a(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){if(t){if("string"==typeof t)return r(t,e);var a={}.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(t):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,r=Array(e);a<e;a++)r[a]=t[a];return r}function n(t,e){for(var a=0;a<e.length;a++){var r=e[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,o(r.key),r)}}function o(e){var a=function(e){if("object"!=t(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,"string");if("object"!=t(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==t(a)?a:a+""}var c=function(){return t=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.stores=new Map,this.colors={primary:"#007bff",secondary:"#dc3545"},this.products=[],this.filteredProducts=[],this.sortState={field:"name",direction:"asc"},this.currency={code:"USD",symbol:"$"},this.init(),this.checkoutConfig=new Map},r=[{key:"init",value:function(){this.initializeCatalogs(),this.initializeIndependentButtons(),this.setupEventListeners(),this.updateCustomProperties()}},{key:"initializeStore",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.stores.has(t)||this.stores.set(t,{cart:this.loadCartFromStorage(t),info:{name:e.name||t,whatsapp:e.whatsapp||"",cartEnabled:!1!==e.cartEnabled,floatingCart:e.floatingCart||!1,checkoutTitle:e.checkoutTitle||"Your Cart",billingTitle:e.billingTitle||"Billing Details",submitButtonText:e.submitButtonText||"Proceed to WhatsApp",enableBilling:!1!==e.enableBilling,customFields:e.customFields||[]},products:[],filteredProducts:[],sortState:{field:"name",direction:"asc"}}),this.stores.get(t)}},{key:"loadCartFromStorage",value:function(t){var e="swb-cart-".concat(t),a=localStorage.getItem(e);if(a)try{return JSON.parse(a)}catch(t){localStorage.removeItem(e)}return[]}},{key:"saveCartToStorage",value:function(t,e){var a="swb-cart-".concat(t);localStorage.setItem(a,JSON.stringify(e))}},{key:"clearCart",value:function(t){var e=this.stores.get(t);e&&(e.cart=[],this.saveCartToStorage(t,e.cart),this.updateCartCount(t),this.renderCart(t),this.closeCheckout(t))}},{key:"updateCustomProperties",value:function(){document.documentElement.style.setProperty("--swb-color-primary",this.colors.primary),document.documentElement.style.setProperty("--swb-color-secondary",this.colors.secondary);var t=this.hexToRGB(this.colors.primary),e=this.hexToRGB(this.colors.secondary);document.documentElement.style.setProperty("--swb-color-primary-rgb",t),document.documentElement.style.setProperty("--swb-color-secondary-rgb",e)}},{key:"hexToRGB",value:function(t){var e=parseInt(t.slice(1,3),16),a=parseInt(t.slice(3,5),16),r=parseInt(t.slice(5,7),16);return"".concat(e,", ").concat(a,", ").concat(r)}},{key:"initializeCatalogs",value:function(){var t=this;document.querySelectorAll("[data-swb-catalog]").forEach((function(e){var a=e.getAttribute("data-swb-store-id");if(a){var r=[];try{var n=e.getAttribute("data-swb-custom-fields");n&&(r=JSON.parse(n))}catch(t){console.warn("Invalid custom fields format",t)}t.initializeStore(a,{name:e.getAttribute("data-swb-store"),whatsapp:e.getAttribute("data-swb-whatsapp"),floatingCart:!!e.hasAttribute("data-swb-cart-floating")&&e.getAttribute("data-swb-cart-floating"),cartEnabled:"false"!==e.getAttribute("data-swb-cart"),checkoutTitle:e.getAttribute("data-swb-checkout-title")||"Your Cart",billingTitle:e.getAttribute("data-swb-billing-title")||"Billing Details",submitButtonText:e.getAttribute("data-swb-submit-text")||"Proceed to WhatsApp",enableBilling:"false"!==e.getAttribute("data-swb-enable-billing"),customFields:r});var o=e.getAttribute("data-swb-color-primary"),c=e.getAttribute("data-swb-color-secondary");o&&(t.colors.primary=o),c&&(t.colors.secondary=c);var i=e.getAttribute("data-swb-currency");i&&t.setCurrency(i),t.createCatalogHeader(e,a),t.initializeCatalogProducts(e,a)}}))}},{key:"initializeIndependentButtons",value:function(){var t=this;document.querySelectorAll("[data-swb-cart][data-swb-store-id]").forEach((function(e){if(!e.hasAttribute("data-swb-catalog")){var a=e.getAttribute("data-swb-store-id");t.initializeStore(a,{name:e.getAttribute("data-swb-store"),whatsapp:e.getAttribute("data-swb-whatsapp"),cartEnabled:!0,floatingCart:!1});var r=e.getAttribute("data-swb-color-primary"),n=e.getAttribute("data-swb-color-secondary");r&&(t.colors.primary=r),n&&(t.colors.secondary=n);var o=e.getAttribute("data-swb-currency");o&&t.setCurrency(o),e.addEventListener("click",(function(){t.showCheckout(a)})),e.querySelector("[data-swb-cart-count]")&&t.updateCartCount(a)}})),document.querySelectorAll("[data-swb-product-sku][data-swb-store-id]").forEach((function(e){if(!e.hasAttribute("data-swb-catalog")){var a=e.getAttribute("data-swb-store-id"),r=e.getAttribute("data-swb-product-sku");if(!t.stores.get(a))return void console.warn("Store ".concat(a," not initialized. Make sure you have a cart button with store information."));e.addEventListener("click",(function(){var n={sku:r,name:e.getAttribute("data-swb-product-name")||r,price:parseFloat(e.getAttribute("data-swb-product-price"))||0,quantity:1};t.addToCart(a,n)}))}}))}},{key:"setCurrency",value:function(t){var e={USD:{code:"USD",symbol:"$"},EUR:{code:"EUR",symbol:"€"},GBP:{code:"GBP",symbol:"£"},JPY:{code:"JPY",symbol:"¥"},CNY:{code:"CNY",symbol:"¥"},MYR:{code:"MYR",symbol:"RM"},SGD:{code:"SGD",symbol:"S$"},AUD:{code:"AUD",symbol:"A$"},CAD:{code:"CAD",symbol:"C$"},INR:{code:"INR",symbol:"₹"},KRW:{code:"KRW",symbol:"₩"},THB:{code:"THB",symbol:"฿"},PHP:{code:"PHP",symbol:"₱"},IDR:{code:"IDR",symbol:"Rp"},VND:{code:"VND",symbol:"₫"}};e[t]&&(this.currency=e[t])}},{key:"formatPrice",value:function(t){return"".concat(this.currency.symbol).concat(t.toFixed(2))}},{key:"createCatalogHeader",value:function(t,e){var r=this,n=document.createElement("div");n.classList.add("swb-catalog-header");var o=document.createElement("input");o.type="text",o.placeholder="Search products...",o.classList.add("swb-search-input"),o.addEventListener("input",(function(t){return r.handleSearch(t.target.value,e)}));var c=document.createElement("select");c.classList.add("swb-sort-select"),c.innerHTML='\n            <option value="name-asc">Name (A to Z)</option>\n            <option value="name-desc">Name (Z to A)</option>\n            <option value="price-asc">Price (Low to High)</option>\n            <option value="price-desc">Price (High to Low)</option>\n        ',c.addEventListener("change",(function(t){var n=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var a=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=a){var r,n,o,c,i=[],s=!0,l=!1;try{if(o=(a=a.call(t)).next,0===e){if(Object(a)!==a)return;s=!1}else for(;!(s=(r=o.call(a)).done)&&(i.push(r.value),i.length!==e);s=!0);}catch(t){l=!0,n=t}finally{try{if(!s&&null!=a.return&&(c=a.return(),Object(c)!==c))return}finally{if(l)throw n}}return i}}(t,e)||a(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}(t.target.value.split("-"),2),o=n[0],c=n[1];r.handleSort(o,c,e)}));var i=document.createElement("div");i.classList.add("swb-catalog-header-control"),i.appendChild(c);var s=this.stores.get(e),l=s.cart.reduce((function(t,e){return t+e.quantity}),0);if(s.info.cartEnabled){var u=document.createElement("button");u.classList.add("swb-cart-button"),"true"===s.info.floatingCart&&u.classList.add("swb-cart-button-floating"),u.innerHTML='\n                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 576 512">\n                    <path d="M528.1 301.3l47.3-208C578.8 78.3 567.4 64 552 64H159.2l-9.2-44.8C147.8 8 137.9 0 126.5 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24h69.9l70.2 343.4C147.3 417.1 136 435.2 136 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-15.7-6.4-29.8-16.8-40h209.6C430.4 426.2 424 440.3 424 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.2-12.9-41.3-31.6-50.4l5.5-24.3c3.4-15-8-29.3-23.4-29.3H218.1l-6.5-32h293.1c11.2 0 20.9-7.8 23.4-18.7z"/>\n                </svg>\n                <span class="swb-cart-count" data-swb-cart-count>'.concat(l,"</span>\n            "),u.addEventListener("click",(function(){return r.showCheckout(e)})),i.appendChild(u)}n.appendChild(o),n.appendChild(i),t.insertBefore(n,t.firstChild)}},{key:"initializeCatalogProducts",value:function(t,a){var r=this,n=this.stores.get(a);if(n){var o=t.querySelectorAll("[data-swb-product]");n.products=Array.from(o).map((function(t){return{element:t,sku:t.getAttribute("data-swb-product-sku"),name:t.getAttribute("data-swb-product-name"),price:parseFloat(t.getAttribute("data-swb-product-price"))}})),n.filteredProducts=e(n.products),n.products.forEach((function(t){r.initializeProduct(t.element,a)}))}}},{key:"initializeProduct",value:function(t,e){var a=this,r=t.querySelector("[data-swb-product-buttons]");if(r){var n=t.getAttribute("data-swb-product-link"),o=t.getAttribute("data-swb-product-link-title");if(n&&o){var c=document.createElement("a");c.href=n,c.target="_blank",c.rel="noopener noreferrer",c.classList.add("swb-external-link"),c.innerHTML="<span>".concat(o,"</span>"),r.appendChild(c)}var i=this.stores.get(e);if(i&&i.info.cartEnabled){var s=t.getAttribute("data-swb-product-add-cart-title"),l=document.createElement("button");l.textContent=s||"Add to Cart",l.classList.add("swb-add-to-cart"),l.onclick=function(){var r={sku:t.getAttribute("data-swb-product-sku"),name:t.getAttribute("data-swb-product-name"),price:parseFloat(t.getAttribute("data-swb-product-price")),quantity:1};a.addToCart(e,r)},r.appendChild(l)}}}},{key:"handleSearch",value:function(t,e){var a=this.stores.get(e);a&&(t=t.toLowerCase(),a.filteredProducts=a.products.filter((function(e){return e.name.toLowerCase().includes(t)||e.sku.toLowerCase().includes(t)})),this.updateProductDisplay(e))}},{key:"handleSort",value:function(t,a,r){var n=this.stores.get(r);if(n){n.sortState.field=t,n.sortState.direction=a;var o=e(n.filteredProducts);o.sort((function(e,r){var n,o;return"price"===t?(n=e.price,o=r.price):(n=e.name.toLowerCase(),o=r.name.toLowerCase()),"price"===t?"asc"===a?n-o:o-n:"asc"===a?n.localeCompare(o):o.localeCompare(n)})),n.filteredProducts=o,this.updateProductDisplay(r)}}},{key:"updateProductDisplay",value:function(t){var e=this.stores.get(t);if(e){var a=document.querySelector('[data-swb-catalog][data-swb-store-id="'.concat(t,'"]'));if(a){var r=a.querySelector(".swb-grid");r&&(Array.from(r.children).forEach((function(t){r.removeChild(t)})),e.filteredProducts.forEach((function(t){r.appendChild(t.element)})))}}}},{key:"setupEventListeners",value:function(){var t=this;document.addEventListener("click",(function(e){if(e.target.matches(".swb-modal-close")||e.target.closest(".swb-modal-close")){var a=e.target.closest(".swb-cart-modal");if(a){var r=a.getAttribute("data-swb-store-id");t.closeCheckout(r)}}}))}},{key:"updateCartCount",value:function(t){var e=this.stores.get(t);if(e){var a=e.cart.reduce((function(t,e){return t+e.quantity}),0);document.querySelectorAll('[data-swb-store-id="'.concat(t,'"] [data-swb-cart-count]')).forEach((function(t){t.textContent=a})),document.querySelectorAll('.swb-cart-modal[data-swb-store-id="'.concat(t,'"] .swb-cart-count')).forEach((function(t){t.closest(".swb-cart-subheader")?t.textContent=e.cart.length:t.textContent=a}))}}},{key:"addToCart",value:function(t,e){var a=this.stores.get(t);if(a){var r=a.cart.find((function(t){return t.sku===e.sku}));r?r.quantity++:a.cart.push(e),this.saveCartToStorage(t,a.cart),this.updateCartCount(t),this.renderCart(t)}}},{key:"renderCart",value:function(t){var e=this,a=document.querySelector('.swb-cart-modal[data-swb-store-id="'.concat(t,'"]'));if(a){var r=this.stores.get(t);if(r){var n=a.querySelector(".swb-cart-items");n.innerHTML="",r.cart.forEach((function(a){var r=document.createElement("div");r.classList.add("swb-cart-item"),r.innerHTML='\n                <div class="swb-item-name">'.concat(a.name,'</div>\n                <div class="swb-item-quantity">\n                    <button onclick="swb.updateQuantity(\'').concat(t,"', '").concat(a.sku,'\', -1)">\n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12" fill="currentColor">\n                            <path d="M416 208H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"/>\n                        </svg>\n                    </button>\n                    <span>').concat(a.quantity,"</span>\n                    <button onclick=\"swb.updateQuantity('").concat(t,"', '").concat(a.sku,'\', 1)">\n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12" fill="currentColor">\n                            <path d="M416 208H272V64c0-17.7-14.3-32-32-32h-32c-17.7 0-32 14.3-32 32v144H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h144v144c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V304h144c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"/>\n                        </svg>\n                    </button>\n                </div>\n                <div class="swb-item-price">').concat(e.formatPrice(a.price*a.quantity),"</div>\n                <button onclick=\"swb.removeFromCart('").concat(t,"', '").concat(a.sku,'\')" class="swb-remove-item">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 352 512">\n                        <path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/>\n                    </svg>\n                </button>\n            '),n.appendChild(r)})),this.updateTotal(t)}}}},{key:"updateQuantity",value:function(t,e,a){var r=this.stores.get(t);if(r){var n=r.cart.find((function(t){return t.sku===e}));n&&(n.quantity+=a,n.quantity<=0?this.removeFromCart(t,e):(this.saveCartToStorage(t,r.cart),this.renderCart(t),this.updateCartCount(t)))}}},{key:"removeFromCart",value:function(t,e){var a=this.stores.get(t);a&&(a.cart=a.cart.filter((function(t){return t.sku!==e})),this.saveCartToStorage(t,a.cart),this.renderCart(t),this.updateCartCount(t))}},{key:"updateTotal",value:function(t){var e=this.stores.get(t);if(e){var a=e.cart.reduce((function(t,e){return t+e.price*e.quantity}),0),r=document.querySelector('.swb-cart-modal[data-swb-store-id="'.concat(t,'"] .swb-cart-total'));r&&(r.textContent="Total: ".concat(this.formatPrice(a)))}}},{key:"showCheckout",value:function(t){var e=this,a=this.stores.get(t);if(a&&0!==a.cart.length){var r=document.querySelector('.swb-cart-modal[data-swb-store-id="'.concat(t,'"]'));if(!r){(r=document.createElement("div")).classList.add("swb-cart-modal"),r.setAttribute("data-swb-store-id",t);var n=a.info.customFields.map((function(t){return'\n                <div class="swb-custom-field">\n                    <input type="'.concat(t.type||"text",'" \n                           name="').concat(t.name,'"\n                           placeholder="').concat(t.placeholder||"",'"\n                           ').concat(t.required?"required":"","\n                           ").concat(t.pattern?'pattern="'.concat(t.pattern,'"'):"","\n                           ").concat(t.min?'min="'.concat(t.min,'"'):"","\n                           ").concat(t.max?'max="'.concat(t.max,'"'):"",">\n                </div>\n            ")})).join("");r.innerHTML='\n                <div class="swb-modal-content">\n                    <div class="swb-cart-header">\n                        <h2>'.concat(a.info.checkoutTitle,'</h2>\n                    </div>\n                    <div class="swb-modal-close">\n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="16" height="16" fill="currentColor">\n                            <path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/>\n                        </svg>\n                    </div>\n                    <div class="swb-cart-subheader">\n                        <p>Items</p>\n                        <button class="swb-clear-cart">Clear All</button>\n                    </div>\n                    <div class="swb-cart-items"></div>\n                    <div class="swb-cart-total">Total: ').concat(this.formatPrice(0),'</div>\n                    <form class="swb-checkout-form">\n                        ').concat(a.info.enableBilling?"\n                        <h2>".concat(a.info.billingTitle,'</h2>\n                        <input type="text" name="name" placeholder="Full Name" required>\n                        <input type="email" name="email" placeholder="Email" required>\n                        <input type="tel" name="phone" placeholder="Phone Number" required>\n                        <textarea name="address" placeholder="Delivery Address" required></textarea>\n                        '):"","\n                        ").concat(n,'\n                        <button type="submit">').concat(a.info.submitButtonText,"</button>\n                    </form>\n                </div>\n            "),document.body.appendChild(r);var o=r.querySelector(".swb-checkout-form");o&&(o.onsubmit=function(a){a.preventDefault(),e.processCheckout(t,new FormData(o))}),r.querySelector(".swb-clear-cart").onclick=function(){confirm("Are you sure you want to clear your cart?")&&e.clearCart(t)}}this.renderCart(t),this.updateCartCount(t),r.style.display="block"}else alert("Your cart is empty")}},{key:"closeCheckout",value:function(t){var e=document.querySelector('.swb-cart-modal[data-swb-store-id="'.concat(t,'"]'));e&&(e.style.display="none")}},{key:"processCheckout",value:function(t,e){var a=this.stores.get(t);if(a){var r={};e.forEach((function(t,e){r[e]=t}));var n=this.formatWhatsAppMessage(t,r),o="https://wa.me/".concat(a.info.whatsapp,"?text=").concat(encodeURIComponent(n));window.open(o,"_blank"),this.clearCart(t)}}},{key:"formatWhatsAppMessage",value:function(t,e){var a=this,r=this.stores.get(t);if(!r)return"";var n=(new Date).toLocaleString(),o="New Order from ".concat(r.info.name,"\n");o+="Date: ".concat(n,"\n\n"),r.info.enableBilling&&(o+="Customer Information:\n",o+="Name: ".concat(e.name,"\n"),o+="Email: ".concat(e.email,"\n"),o+="Phone: ".concat(e.phone,"\n"),o+="Address: ".concat(e.address,"\n\n")),r.info.customFields.forEach((function(t){e[t.name]&&(o+="".concat(t.label||t.name,": ").concat(e[t.name],"\n"))})),o+="Order Details:\n",r.cart.forEach((function(t){o+="- ".concat(t.name," (SKU: ").concat(t.sku,")\n"),o+="  Quantity: ".concat(t.quantity,"\n"),o+="  Price: ".concat(a.formatPrice(t.price*t.quantity),"\n\n")}));var c=r.cart.reduce((function(t,e){return t+e.price*e.quantity}),0);return o+="Total Amount: ".concat(this.formatPrice(c))}}],r&&n(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,r}();window.swb=new c})(),(()=>{"use strict";t.r(e)})(),e;var t,e}));