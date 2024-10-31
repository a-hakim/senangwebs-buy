!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.SWB=e():t.SWB=e()}(this,(()=>{return t={r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={},(()=>{function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t){return function(t){if(Array.isArray(t))return n(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||r(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(t,e){if(t){if("string"==typeof t)return n(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,a(n.key),n)}}function a(e){var r=function(e){if("object"!=t(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!=t(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==t(r)?r:r+""}var c=function(){return t=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.cart=[],this.storeInfo={},this.colors={primary:"#007bff",secondary:"#dc3545"},this.products=[],this.filteredProducts=[],this.sortState={field:"name",direction:"asc"},this.currency={code:"USD",symbol:"$"},this.init()},n=[{key:"init",value:function(){this.loadCartFromStorage(),this.initializeCatalog(),this.setupEventListeners(),this.updateCartCount(),this.renderCart()}},{key:"loadCartFromStorage",value:function(){var t=localStorage.getItem("swb-cart");if(t)try{this.cart=JSON.parse(t)}catch(t){this.cart=[],localStorage.removeItem("swb-cart")}}},{key:"saveCartToStorage",value:function(){localStorage.setItem("swb-cart",JSON.stringify(this.cart))}},{key:"clearCart",value:function(){this.cart=[],this.saveCartToStorage(),this.updateCartCount(),this.renderCart(),this.closeCheckout()}},{key:"updateCustomProperties",value:function(){document.documentElement.style.setProperty("--swb-color-primary",this.colors.primary),document.documentElement.style.setProperty("--swb-color-secondary",this.colors.secondary);var t=this.hexToRGB(this.colors.primary),e=this.hexToRGB(this.colors.secondary);document.documentElement.style.setProperty("--swb-color-primary-rgb",t),document.documentElement.style.setProperty("--swb-color-secondary-rgb",e)}},{key:"hexToRGB",value:function(t){var e=parseInt(t.slice(1,3),16),r=parseInt(t.slice(3,5),16),n=parseInt(t.slice(5,7),16);return"".concat(e,", ").concat(r,", ").concat(n)}},{key:"initializeCatalog",value:function(){var t=this,r=document.querySelector("[data-swb-catalog]");if(r){this.storeInfo={name:r.getAttribute("data-swb-store"),whatsapp:r.getAttribute("data-swb-whatsapp"),floatingCart:r.hasAttribute("data-swb-cart-floating"),cartEnabled:"false"!==r.getAttribute("data-swb-cart")};var n=r.getAttribute("data-swb-color-primary"),o=r.getAttribute("data-swb-color-secondary");n&&(this.colors.primary=n),o&&(this.colors.secondary=o),this.updateCustomProperties();var a=r.getAttribute("data-swb-currency");a&&this.setCurrency(a),this.createCatalogHeader(r);var c=r.querySelectorAll("[data-swb-product]");this.products=Array.from(c).map((function(t){return t.querySelector("[data-swb-product-name]"),{element:t,sku:t.getAttribute("data-swb-product-sku"),name:t.getAttribute("data-swb-product-name"),price:parseFloat(t.getAttribute("data-swb-product-price"))}})),this.filteredProducts=e(this.products),this.products.forEach((function(e){t.initializeProduct(e.element)}))}}},{key:"setCurrency",value:function(t){var e={USD:{code:"USD",symbol:"$"},EUR:{code:"EUR",symbol:"€"},GBP:{code:"GBP",symbol:"£"},JPY:{code:"JPY",symbol:"¥"},CNY:{code:"CNY",symbol:"¥"},MYR:{code:"MYR",symbol:"RM"},SGD:{code:"SGD",symbol:"S$"},AUD:{code:"AUD",symbol:"A$"},CAD:{code:"CAD",symbol:"C$"},INR:{code:"INR",symbol:"₹"},KRW:{code:"KRW",symbol:"₩"},THB:{code:"THB",symbol:"฿"},PHP:{code:"PHP",symbol:"₱"},IDR:{code:"IDR",symbol:"Rp"},VND:{code:"VND",symbol:"₫"},KZT:{code:"KZT",symbol:"₸"},PLN:{code:"PLN",symbol:"zł"}};e[t]&&(this.currency=e[t])}},{key:"formatPrice",value:function(t){return"".concat(this.currency.symbol).concat(t.toFixed(2))}},{key:"createCatalogHeader",value:function(t){var e=this,n=document.createElement("div");n.classList.add("swb-catalog-header");var o=document.createElement("input");o.type="text",o.placeholder="Search products...",o.classList.add("swb-search-input"),o.addEventListener("input",(function(t){return e.handleSearch(t.target.value)}));var a=document.createElement("select");a.classList.add("swb-sort-select"),a.innerHTML='\n            <option value="name-asc">Name (A to Z)</option>\n            <option value="name-desc">Name (Z to A)</option>\n            <option value="price-asc">Price (Low to High)</option>\n            <option value="price-desc">Price (High to Low)</option>\n        ',a.addEventListener("change",(function(t){var n=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,a,c,i=[],s=!0,u=!1;try{if(a=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;s=!1}else for(;!(s=(n=a.call(r)).done)&&(i.push(n.value),i.length!==e);s=!0);}catch(t){u=!0,o=t}finally{try{if(!s&&null!=r.return&&(c=r.return(),Object(c)!==c))return}finally{if(u)throw o}}return i}}(t,e)||r(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}(t.target.value.split("-"),2),o=n[0],a=n[1];e.handleSort(o,a)}));var c=document.createElement("div");if(c.classList.add("swb-catalog-header-control"),c.appendChild(a),!this.storeInfo.floatingCart&&this.storeInfo.cartEnabled){var i=document.createElement("button");i.classList.add("swb-cart-button"),i.innerHTML='\n                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 576 512">\n                    <path d="M528.1 301.3l47.3-208C578.8 78.3 567.4 64 552 64H159.2l-9.2-44.8C147.8 8 137.9 0 126.5 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24h69.9l70.2 343.4C147.3 417.1 136 435.2 136 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-15.7-6.4-29.8-16.8-40h209.6C430.4 426.2 424 440.3 424 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.2-12.9-41.3-31.6-50.4l5.5-24.3c3.4-15-8-29.3-23.4-29.3H218.1l-6.5-32h293.1c11.2 0 20.9-7.8 23.4-18.7z"/>\n                </svg>\n                <span class="swb-cart-count">0</span>\n            ',i.addEventListener("click",(function(){return e.showCheckout()})),c.appendChild(i)}n.appendChild(o),n.appendChild(c),t.insertBefore(n,t.firstChild)}},{key:"handleSearch",value:function(t){t=t.toLowerCase(),this.filteredProducts=this.products.filter((function(e){return e.name.toLowerCase().includes(t)||e.sku.toLowerCase().includes(t)})),this.updateProductDisplay()}},{key:"handleSort",value:function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"asc";this.sortState.field=t,this.sortState.direction=r;var n=e(this.filteredProducts);n.sort((function(e,n){var o,a;return"price"===t?(o=e.price,a=n.price):(o=e.name.toLowerCase(),a=n.name.toLowerCase()),"price"===t?"asc"===r?o-a:a-o:"asc"===r?o.localeCompare(a):a.localeCompare(o)})),this.filteredProducts=n,this.updateProductDisplay()}},{key:"updateSortIndicators",value:function(){var t=this;document.querySelectorAll(".swb-sort-indicator").forEach((function(t){t.textContent=""})),document.querySelectorAll(".swb-sort-button").forEach((function(e){var r=e.textContent.toLowerCase();if("name"===t.sortState.field&&r.includes("name")||"price"===t.sortState.field&&r.includes("price")){var n=e.querySelector(".swb-sort-indicator");n&&(n.textContent="asc"===t.sortState.direction?" ↑":" ↓")}}))}},{key:"updateProductDisplay",value:function(){var t=document.querySelector("[data-swb-catalog]");if(t){var e=t.querySelector(".grid");e&&(Array.from(e.children).forEach((function(t){e.removeChild(t)})),this.filteredProducts.forEach((function(t){e.appendChild(t.element)})))}}},{key:"setupEventListeners",value:function(){var t=this;this.storeInfo.floatingCart&&this.storeInfo.cartEnabled&&this.createCartIcon(),document.addEventListener("click",(function(e){e.target.classList.contains("swb-modal-close")&&t.closeCheckout()}))}},{key:"updateCartCount",value:function(){var t=this,e=this.cart.reduce((function(t,e){return t+e.quantity}),0);document.querySelectorAll(".swb-cart-count").forEach((function(r){r.closest(".swb-cart-subheader")?r.textContent=t.cart.length:r.textContent=e}))}},{key:"adjustColor",value:function(t,e){var r=function(t){return Math.min(255,Math.max(0,t))},n=t.replace("#",""),o=parseInt(n.substr(0,2),16),a=parseInt(n.substr(2,2),16),c=parseInt(n.substr(4,2),16);return"#"+[r(o+e),r(a+e),r(c+e)].map((function(t){return t.toString(16).padStart(2,"0")})).join("")}},{key:"initializeProduct",value:function(t){var e=this,r=t.querySelector("[data-swb-product-buttons]");if(r){var n=t.getAttribute("data-swb-product-link"),o=t.getAttribute("data-swb-product-link-title");if(n&&o){var a=document.createElement("a");a.href=n,a.target="_blank",a.rel="noopener noreferrer",a.classList.add("swb-external-link"),a.innerHTML="\n                <span>".concat(o,"</span>\n            "),r.appendChild(a)}var c=t.getAttribute("data-swb-product-add-cart-title");if(this.storeInfo.cartEnabled){var i=document.createElement("button");i.textContent=c||"Add to Cart",i.classList.add("swb-add-to-cart"),i.onclick=function(){return e.addToCart(t)},r.appendChild(i)}}}},{key:"createCartIcon",value:function(){var t=this,e=document.createElement("div");e.classList.add("swb-cart-icon");var r=this.cart.reduce((function(t,e){return t+e.quantity}),0);e.innerHTML='\n            <div class="swb-cart-count">'.concat(r,'</div>\n            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512">\x3c!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--\x3e<path d="M528.1 301.3l47.3-208C578.8 78.3 567.4 64 552 64H159.2l-9.2-44.8C147.8 8 137.9 0 126.5 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24h69.9l70.2 343.4C147.3 417.1 136 435.2 136 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-15.7-6.4-29.8-16.8-40h209.6C430.4 426.2 424 440.3 424 456c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.2-12.9-41.3-31.6-50.4l5.5-24.3c3.4-15-8-29.3-23.4-29.3H218.1l-6.5-32h293.1c11.2 0 20.9-7.8 23.4-18.7z"/></svg>\n        '),e.onclick=function(){return t.showCheckout()},document.body.appendChild(e)}},{key:"addToCart",value:function(t){var e={sku:t.getAttribute("data-swb-product-sku"),name:t.getAttribute("data-swb-product-name"),price:parseFloat(t.getAttribute("data-swb-product-price")),quantity:1},r=this.cart.find((function(t){return t.sku===e.sku}));r?r.quantity++:this.cart.push(e),this.saveCartToStorage(),this.updateCartCount(),this.renderCart()}},{key:"renderCart",value:function(){var t=this,e=document.querySelector(".swb-cart-modal");if(e){var r=e.querySelector(".swb-cart-items");r.innerHTML="",this.cart.forEach((function(e){var n=document.createElement("div");n.classList.add("swb-cart-item"),n.innerHTML='\n                <div class="swb-item-name">'.concat(e.name,'</div>\n                <div class="swb-item-quantity">\n                    <button onclick="swb.updateQuantity(\'').concat(e.sku,'\', -1)">\n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12" fill="currentColor">\x3c!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--\x3e<path d="M416 208H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"/></svg>\n                    </button>\n                    <span>').concat(e.quantity,"</span>\n                    <button onclick=\"swb.updateQuantity('").concat(e.sku,'\', 1)">\n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12" fill="currentColor">\x3c!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--\x3e<path d="M416 208H272V64c0-17.7-14.3-32-32-32h-32c-17.7 0-32 14.3-32 32v144H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h144v144c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V304h144c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"/></svg>\n                    </button>\n                </div>\n                <div class="swb-item-price">').concat(t.formatPrice(e.price*e.quantity),"</div>\n                <button onclick=\"swb.removeFromCart('").concat(e.sku,'\')" class="swb-remove-item">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 352 512">\x3c!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--\x3e<path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/></svg>\n                </button>\n            '),r.appendChild(n)})),this.updateTotal()}}},{key:"updateQuantity",value:function(t,e){var r=this.cart.find((function(e){return e.sku===t}));r&&(r.quantity+=e,r.quantity<=0?this.removeFromCart(t):(this.saveCartToStorage(),this.renderCart(),this.updateCartCount()))}},{key:"removeFromCart",value:function(t){this.cart=this.cart.filter((function(e){return e.sku!==t})),this.saveCartToStorage(),this.renderCart(),this.updateCartCount()}},{key:"updateTotal",value:function(){var t=this.cart.reduce((function(t,e){return t+e.price*e.quantity}),0),e=document.querySelector(".swb-cart-total");e&&(e.textContent="Total: ".concat(this.formatPrice(t)))}},{key:"showCheckout",value:function(){var t=this;if(0!==this.cart.length){var e=document.querySelector(".swb-cart-modal");if(!e){(e=document.createElement("div")).classList.add("swb-cart-modal"),e.innerHTML='\n                <div class="swb-modal-content">\n                    <button class="swb-modal-close">\n                        ╳\n\n                    </button>\n                    <div class="swb-cart-header">\n                        <h2>Your Cart</h2>\n                    </div>\n                    <div class="swb-cart-subheader">\n                        <p>Items</p>\n                        <button class="swb-clear-cart">Clear All</button>\n                    </div>\n                    <div class="swb-cart-items"></div>\n                    <div class="swb-cart-total">Total: $0.00</div>\n                    <form class="swb-checkout-form">\n                        <h2>Billing Details</h2>\n                        <input type="text" name="name" placeholder="Full Name" required>\n                        <input type="email" name="email" placeholder="Email" required>\n                        <input type="tel" name="phone" placeholder="Phone Number" required>\n                        <textarea name="address" placeholder="Delivery Address" required></textarea>\n                        <button type="submit">Proceed to WhatsApp</button>\n                    </form>\n                </div>\n            ',document.body.appendChild(e);var r=e.querySelector(".swb-checkout-form");r.onsubmit=function(e){e.preventDefault(),t.processCheckout(new FormData(r))},e.querySelector(".swb-clear-cart").onclick=function(){confirm("Are you sure you want to clear your cart?")&&t.clearCart()}}this.renderCart(),this.updateCartCount(),e.style.display="block"}else alert("Your cart is empty")}},{key:"closeCheckout",value:function(){var t=document.querySelector(".swb-cart-modal");t&&(t.style.display="none")}},{key:"processCheckout",value:function(t){var e={name:t.get("name"),email:t.get("email"),phone:t.get("phone"),address:t.get("address")},r=this.formatWhatsAppMessage(e),n="https://wa.me/".concat(this.storeInfo.whatsapp,"?text=").concat(encodeURIComponent(r));window.open(n,"_blank"),localStorage.removeItem("swb-cart"),this.cart=[],this.updateCartCount(),this.closeCheckout()}},{key:"formatWhatsAppMessage",value:function(t){var e=this,r=(new Date).toLocaleString(),n="New Order from ".concat(this.storeInfo.name,"\n");n+="Date: ".concat(r,"\n\n"),n+="Customer Information:\n",n+="Name: ".concat(t.name,"\n"),n+="Email: ".concat(t.email,"\n"),n+="Phone: ".concat(t.phone,"\n"),n+="Address: ".concat(t.address,"\n\n"),n+="Order Details:\n",this.cart.forEach((function(t){n+="- ".concat(t.name," (SKU: ").concat(t.sku,")\n"),n+="  Quantity: ".concat(t.quantity,"\n"),n+="  Price: ".concat(e.formatPrice(t.price*t.quantity),"\n\n")}));var o=this.cart.reduce((function(t,e){return t+e.price*e.quantity}),0);return n+="Total Amount: ".concat(this.formatPrice(o))}}],n&&o(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,n}(),i=document.createElement("style");i.textContent="",document.head.appendChild(i),window.swb=new c})(),(()=>{"use strict";t.r(e)})(),e;var t,e}));