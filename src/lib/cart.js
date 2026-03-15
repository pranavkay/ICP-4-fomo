/**
 * FOMO Bakery - Cart Logic
 * Handles state, local storage persistence, and checkout generation.
 */

const CART_STORAGE_KEY = 'fomo_cart_v1';
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'fomobakery.myshopify.com';

// Reactive state (persisted)
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

// Event system to notify UI
const cartEvent = new Event('cart-updated');

/**
 * Get current cart state
 */
export function getCart() {
    return cart;
}

/**
 * Add item to cart
 * @param {Object} product - { id, variantId, title, price, image }
 */
export function addToCart(product) {
    const existingItem = cart.find(item => item.variantId === product.variantId);
    const quantityToAdd = product.quantity || 1;

    if (existingItem) {
        existingItem.quantity += quantityToAdd;
    } else {
        cart.push({
            ...product, // Ensure we spread the product properties
            quantity: quantityToAdd
        });
    }

    saveCart();
    return cart;
}

/**
 * Update item quantity
 */
export function updateQuantity(variantId, delta) {
    const item = cart.find(item => item.variantId === variantId);

    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(variantId);
        } else {
            saveCart();
        }
    }
}

/**
 * Remove item from cart
 */
export function removeFromCart(variantId) {
    cart = cart.filter(item => item.variantId !== variantId);
    saveCart();
}

/**
 * Persist to local storage and notify listeners
 */
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(cartEvent);
}

/**
 * Calculate totals
 */
export function getCartTotals() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Price format: "₹89" -> parse to number
    const subtotal = cart.reduce((sum, item) => {
        const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + (priceVal * item.quantity);
    }, 0);

    return { count, subtotal };
}

/**
 * Generate Shopify Checkout URL
 * Format: https://store.com/cart/{variant_id}:{qty},{variant_id}:{qty}
 */
export function getCheckoutUrl() {
    if (cart.length === 0) return '#';

    const items = cart.map(item => {
        // Shopify GraphQL IDs are like "gid://shopify/ProductVariant/123456"
        // Permalinks need just the ID number "123456"
        const cleanId = item.variantId.split('/').pop();
        return `${cleanId}:${item.quantity}`;
    });

    return `https://${SHOPIFY_DOMAIN}/cart/${items.join(',')}`;
}

/**
 * Generate Shopify Checkout URL for a single item (Buy it now)
 */
export function getSingleCheckoutUrl(variantId, quantity) {
    const cleanId = variantId.split('/').pop();
    return `https://${SHOPIFY_DOMAIN}/cart/${cleanId}:${quantity}`;
}
