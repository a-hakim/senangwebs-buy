[![SenangWebs](https://raw.githubusercontent.com/a-hakim/senangwebs-buy/refs/heads/main/src/sw_banner.webp)](https://use.senangwebs.com)
Learn more at [SenangWebs.com](https://use.senangwebs.com)

# SenangWebs Buy (SWB)

SenangWebs Buy (SWB) is a lightweight JavaScript library that enables easy implementation of e-commerce functionality through HTML attributes. Create a full shopping experience with WhatsApp checkout integration, product sorting, searching, and more - all with minimal setup.

## Features

- Easy HTML attribute-based configuration
- Shopping cart with localStorage persistence
- WhatsApp checkout integration
- Product sorting and searching
- Multiple currency support
- Custom color theming
- External product links
- Customizable button text
- Fully responsive design
- No external dependencies

## Installation

### Using npm

```bash
npm install senangweb-buy
```

### Using a CDN

Include SenangWebs Buy directly in your HTML file:

```html
<script src="https://unpkg.com/senangweb-buy@latest/dist/swb.js"></script>
```

## Usage

### Basic Setup

```html
<div data-swb-catalog 
     data-swb-store="Your Store Name" 
     data-swb-whatsapp="+1234567890"
     data-swb-currency="USD"
     data-swb-color-primary="#4F46E5"
     data-swb-color-secondary="#EF4444">
    
    <!-- Product Item -->
    <div data-swb-product
         data-swb-product-sku="PROD001"
         data-swb-product-name="Product Name"
         data-swb-product-price="99.99"
         data-swb-product-add-cart-title="Add to Cart"
         data-swb-product-link="https://example.com"
         data-swb-product-link-title="View Details">
        
        <div data-swb-product-image>
            <img src="product-image.jpg" alt="Product">
        </div>
        
        <div data-swb-product-name>
            <h3>Product Name</h3>
        </div>
        
        <div data-swb-product-price>
            $99.99
        </div>
        
        <div data-swb-product-buttons></div>
    </div>
</div>
```

## Configuration Options

### Catalog Attributes

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-swb-catalog` | flag | Main container identifier | required |
| `data-swb-store` | string | Store name for messages | required |
| `data-swb-whatsapp` | string | WhatsApp number for checkout | required |
| `data-swb-currency` | string | Currency code (USD, EUR, MYR, etc.) | USD |
| `data-swb-color-primary` | string | Primary theme color (hex) | #007bff |
| `data-swb-color-secondary` | string | Secondary theme color (hex) | #dc3545 |
| `data-swb-cart` | boolean | Enable/disable cart functionality | true |
| `data-swb-cart-floating` | flag | Show floating cart button | false |

### Product Attributes

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-swb-product` | flag | Product container identifier | required |
| `data-swb-product-sku` | string | Product SKU/ID | required |
| `data-swb-product-name` | string | Product name | required |
| `data-swb-product-price` | number | Product price | required |
| `data-swb-product-link` | string | External product link URL | optional |
| `data-swb-product-link-title` | string | External link button text | "View Details" |
| `data-swb-product-add-cart-title` | string | Add to cart button text | "Add to Cart" |
| `data-swb-product-buttons` | flag | Container for product buttons | required |

## Supported Currencies

The library supports multiple currencies including:
- USD ($)
- EUR (€)
- GBP (£)
- MYR (RM)
- SGD (S$)
- AUD (A$)
- CAD (C$)
- JPY (¥)
- CNY (¥)
- INR (₹)
- And many more...

## Features

### Shopping Cart

- Persists across page refreshes
- Add/remove products
- Update quantities
- Clear all items
- Shows total items and amount

### Product Management

- Search by name or SKU
- Sort options:
  - Name (A to Z)
  - Name (Z to A)
  - Price (Low to High)
  - Price (High to Low)

### Checkout Process

1. Collects customer information:
   - Full Name
   - Email
   - Phone Number
   - Delivery Address
2. Formats order details with currency
3. Sends to WhatsApp for processing

## Customization

- Custom button text for each product
- External link option per product
- Cart toggle functionality
- Color theme customization
- Currency selection
- Responsive design

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to all contributors who have helped improve this library
- Inspired by the need for simple, WhatsApp-based e-commerce solutions