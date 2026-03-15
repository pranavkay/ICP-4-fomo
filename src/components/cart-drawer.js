/**
 * FOMO Bakery — Shared Cart Drawer + Product View Overlay Component
 * Injects cart drawer and product view overlay HTML into any page.
 * Usage: import { injectCartDrawer } from './cart-drawer.js'; injectCartDrawer();
 * Then import cart logic from src/lib/cart.js and call initCart() + initProductView().
 */

export function injectCartDrawer() {
    // Cart Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'cart-backdrop';

    // Cart Drawer
    const drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
        <div class="cart-header">
            <h3>Your Box</h3>
            <button class="cart-close" aria-label="Close cart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="cart-items">
            <div class="cart-empty-state">
                <p>Your box is empty. Time to indulge?</p>
                <button class="btn btn-outline" onclick="window.closeCart()">Start Shopping</button>
            </div>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total</span>
                <span class="total-amount">₹0</span>
            </div>
            <a href="#" class="btn btn-primary btn-block checkout-btn">
                Checkout →
            </a>
        </div>
    `;

    // Product View Overlay
    const pvOverlay = document.createElement('div');
    pvOverlay.className = 'product-view-overlay';
    pvOverlay.innerHTML = `
        <button class="product-view-close" aria-label="Close product view">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="product-view-content">
            <div class="pv-hero-image-container">
                <img src="" alt="" class="pv-hero-image">
                <div class="pv-gallery"></div>
            </div>
            <div class="pv-details">
                <span class="pv-vendor">FOMO Bakery</span>
                <h2 class="pv-title"></h2>
                <div class="pv-price-wrapper">
                    <span class="pv-compare-price"></span>
                    <span class="pv-price"></span>
                    <span class="pv-sale-badge">Sale</span>
                </div>
                <p class="pv-tax-note">Taxes included. <a href="#">Shipping</a> calculated at checkout.</p>
                <div class="pv-variants"></div>
                <div class="pv-quantity-wrapper">
                    <span class="pv-quantity-label">Quantity</span>
                    <div class="pv-quantity-selector">
                        <button class="pv-quantity-btn" id="qty-minus">-</button>
                        <input type="text" class="pv-quantity-input" id="qty-input" value="1" readonly>
                        <button class="pv-quantity-btn" id="qty-plus">+</button>
                    </div>
                </div>
                <div class="pv-actions">
                    <button class="btn btn-large btn-block pv-add-btn">Add to cart</button>
                    <button class="btn btn-large btn-block pv-buy-now-btn">Buy it now</button>
                </div>
                <div class="pv-description"></div>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
    document.body.appendChild(pvOverlay);
}
