/**
 * FOMO Bakery — Category Page Driver
 * Reads window.CATEGORY_CONFIG set inline on each category page
 * and populates the template's DOM slots.
 *
 * CONFIG shape:
 * {
 *   title: string,        // Page <title>
 *   metaDescription: string,
 *   heroImage: string,    // path relative to categories/
 *   heroAlt: string,
 *   label: string,        // e.g. "Artisan Doughnuts"
 *   heading: string,      // big hero h1
 *   subtitle: string,
 *   accentColor: string,  // CSS var or hex
 *   story: [              // 3 story points
 *     { icon, title, text }
 *   ],
 *   collectionHandle: string,  // Shopify collection handle
 *   productsHeading: string,
 *   productsSubheading: string,
 *   crossSell: [          // 3 cross-sell suggestions
 *     { label, href, image, alt }
 *   ],
 *   ctaTitle: string,
 *   ctaSubtitle: string,
 *   ctaImage: string,
 * }
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { fetchCollection, fetchProducts } from '../lib/shopify.js';
import { addToCart, getCart, getCartTotals, getCheckoutUrl, updateQuantity } from '../lib/cart.js';
import { initAnimations } from '../lib/ui.js';
import { initProductView } from '../lib/product-view.js';

document.addEventListener('DOMContentLoaded', async () => {
    const CONFIG = window.CATEGORY_CONFIG;
    if (!CONFIG) {
        console.error('CATEGORY_CONFIG not set on this page.');
        return;
    }

    // ── 1. Meta ─────────────────────────────────────────────────
    document.title = CONFIG.title + ' | FOMO Bakery';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = CONFIG.metaDescription;

    // ── 2. Hero ──────────────────────────────────────────────────
    const heroImg = document.getElementById('hero-img');
    if (heroImg) { heroImg.src = CONFIG.heroImage; heroImg.alt = CONFIG.heroAlt || CONFIG.heading; }
    setText('category-label', CONFIG.label);
    setText('category-title', CONFIG.heading);
    setText('category-subtitle', CONFIG.subtitle);

    // Apply accent color as CSS var override on root
    if (CONFIG.accentColor) {
        document.documentElement.style.setProperty('--color-category-accent', CONFIG.accentColor);
    }

    // ── 3. Story Strip ───────────────────────────────────────────
    const storyEl = document.getElementById('story-points');
    if (storyEl && CONFIG.story) {
        storyEl.innerHTML = CONFIG.story.map(pt => `
            <div class="story-point reveal-item">
                <div class="story-icon">${pt.icon}</div>
                <h3>${pt.title}</h3>
                <p>${pt.text}</p>
            </div>
        `).join('');
    }

    // ── 4. Products ──────────────────────────────────────────────
    setText('products-heading', CONFIG.productsHeading || 'Our Range');
    setText('products-subheading', CONFIG.productsSubheading || 'Every item crafted by hand.');

    const productContainer = document.getElementById('category-products');
    if (productContainer && CONFIG.collectionHandle) {
        try {
            let products = await fetchCollection(CONFIG.collectionHandle);
            if (!products || products.length === 0) {
                products = await fetchProducts();
            }
            if (products && products.length > 0) {
                productContainer.innerHTML = '';
                products.slice(0, 8).forEach(product => {
                    const card = createProductCard(product);
                    productContainer.appendChild(card);
                });
            } else {
                productContainer.innerHTML = '<p class="no-products">No products found. Check back soon!</p>';
            }
        } catch (e) {
            console.error('Product load failed', e);
            productContainer.innerHTML = '<p class="no-products">Could not load products. Refresh to try again.</p>';
        }
    }

    // ── 5. Cross-sell ─────────────────────────────────────────────
    const crossSellEl = document.getElementById('cross-sell-grid');
    if (crossSellEl && CONFIG.crossSell) {
        crossSellEl.innerHTML = CONFIG.crossSell.map(item => `
            <a href="${item.href}" class="cross-sell-card reveal-item">
                <div class="cross-sell-image">
                    <img src="${item.image}" alt="${item.alt}">
                </div>
                <span class="cross-sell-label">${item.label}</span>
                <span class="cross-sell-arrow">→</span>
            </a>
        `).join('');
    }

    // ── 6. CTA ────────────────────────────────────────────────────
    setText('cta-title', CONFIG.ctaTitle || 'Order Yours Today');
    setText('cta-subtitle', CONFIG.ctaSubtitle || 'Fresh, handcrafted. Delivered to your door in Bangalore.');
    const ctaImg = document.getElementById('cta-img');
    if (ctaImg && CONFIG.ctaImage) { ctaImg.src = CONFIG.ctaImage; ctaImg.alt = CONFIG.heading; }

    // ── 7. Animations + Cart + ProductView ──────────────────────
    gsap.registerPlugin(ScrollTrigger);
    initAnimations();
    initCartPage();
    initProductView();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavPanel = document.getElementById('mobile-nav-panel');
    if (mobileMenuBtn && mobileNavPanel) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNavPanel.classList.toggle('open');
        });
        mobileNavPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNavPanel.classList.remove('open');
            });
        });
    }

    console.log(`FOMO Bakery — ${CONFIG.heading} page loaded 🎉`);
});

// ── Helpers ────────────────────────────────────────────────────

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function createProductCard(product) {

    const card = document.createElement('div');
    card.className = 'product-card reveal-item';
    card.style.cursor = 'pointer';

    const imgDiv = document.createElement('div');
    imgDiv.className = 'product-image';
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.imageAlt || product.title;
    img.loading = 'lazy';
    imgDiv.appendChild(img);

    if (product.tags?.includes('Signature')) {
        const badge = document.createElement('span');
        badge.className = 'product-badge';
        badge.textContent = 'Signature';
        imgDiv.appendChild(badge);
    } else if (product.compareAtPrice) {
        const badge = document.createElement('span');
        badge.className = 'product-badge';
        badge.textContent = 'Sale';
        imgDiv.appendChild(badge);
    }

    imgDiv.addEventListener('click', () => window.openProductDetails(product, img));

    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';

    const title = document.createElement('h4');
    title.textContent = product.title;
    infoDiv.appendChild(title);

    const priceDiv = document.createElement('div');
    if (product.compareAtPrice) {
        const comp = document.createElement('span');
        comp.style.cssText = 'text-decoration:line-through;color:var(--color-text-secondary);margin-right:8px;font-size:0.9em;';
        comp.textContent = product.compareAtPrice;
        priceDiv.appendChild(comp);
    }
    const priceSpan = document.createElement('span');
    priceSpan.className = 'product-price';
    priceSpan.textContent = product.price;
    priceDiv.appendChild(priceSpan);
    infoDiv.appendChild(priceDiv);

    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-small btn-secondary btn-block';
    addBtn.style.marginTop = 'var(--space-3)';
    addBtn.textContent = 'Add to Box';
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart({ ...product, variantId: product.variants[0]?.id });
        window.openCart();
    });
    infoDiv.appendChild(addBtn);

    card.appendChild(imgDiv);
    card.appendChild(infoDiv);
    card.addEventListener('click', () => window.openProductDetails(product, img));

    return card;
}

function initCartPage() {

    const cartDrawer = document.querySelector('.cart-drawer');
    const backdrop = document.querySelector('.cart-backdrop');
    const closeBtn = document.querySelector('.cart-close');

    if (!cartDrawer) return;

    window.openCart = () => {
        cartDrawer.classList.add('active');
        backdrop?.classList.add('active');
        updateCartUI();
    };
    window.closeCart = () => {
        cartDrawer.classList.remove('active');
        backdrop?.classList.remove('active');
    };

    window.updateCartItem = (variantId, delta) => {
        updateQuantity(variantId, delta);
        updateCartUI();
    };

    if (closeBtn) closeBtn.addEventListener('click', window.closeCart);
    if (backdrop) backdrop.addEventListener('click', window.closeCart);
    window.addEventListener('cart-updated', updateCartUI);
    updateCartUI();
}

function updateCartUI() {

    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmountEl = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (!cartItemsContainer) return;

    const cart = getCart() || [];
    const totals = getCartTotals() || { subtotal: 0 };

    if (totalAmountEl) {
        totalAmountEl.textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', minimumFractionDigits: 0
        }).format(totals.subtotal);
    }
    if (checkoutBtn) checkoutBtn.href = getCheckoutUrl() || '#';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-state">
                <p>Your box is empty. Time to indulge?</p>
                <button class="btn btn-outline" onclick="window.closeCart()">Start Shopping</button>
            </div>`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <span class="cart-item-price">${item.price}</span>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="window.updateCartItem('${item.variantId}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="window.updateCartItem('${item.variantId}', 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}
