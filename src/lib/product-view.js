/**
 * FOMO Bakery — Product View Module
 * Fullscreen product detail overlay: image stack, variant picking, quantity, ATC.
 * Extracted from script.js for modular use.
 *
 * Requires: addToCart from cart.js
 * Requires: .product-view-overlay HTML to exist in the DOM (injected by cart-drawer.js)
 */

import gsap from 'gsap';
import { addToCart, getSingleCheckoutUrl } from './cart.js';

/**
 * Initialize the product view overlay.
 * Call once after DOMContentLoaded and after injectCartDrawer().
 */
export function initProductView() {
    const overlay = document.querySelector('.product-view-overlay');
    const closeBtn = document.querySelector('.product-view-close');

    const titleEl = document.querySelector('.pv-title');
    const priceEl = document.querySelector('.pv-price');
    const comparePriceEl = document.querySelector('.pv-compare-price');
    const saleBadgeEl = document.querySelector('.pv-sale-badge');
    const variantsContainer = document.querySelector('.pv-variants');
    const descEl = document.querySelector('.pv-description');
    const addBtn = document.querySelector('.pv-add-btn');
    const buyNowBtn = document.querySelector('.pv-buy-now-btn');

    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    if (!overlay) return;

    let currentVariant = null;
    let currentQuantity = 1;

    window.openProductDetails = (product, originImg) => {
        variantsContainer.innerHTML = '';
        currentVariant = product.variants[0];
        currentQuantity = 1;
        if (qtyInput) qtyInput.value = 1;

        populateProductData(product);
        renderImageStack(product.gallery);

        if (product.variants.length > 1) {
            renderVariants(product);
        }

        const getItem = () => ({
            ...product,
            id: product.id,
            variantId: currentVariant.id,
            title: product.title + (currentVariant.title !== 'Default Title' ? ` - ${currentVariant.title}` : ''),
            price: currentVariant.price,
            image: currentVariant.image || product.image,
            quantity: currentQuantity
        });

        addBtn.onclick = () => {
            addToCart(getItem());
            window.closeProductDetails();
            setTimeout(() => window.openCart(), 300);
        };

        if (buyNowBtn) {
            buyNowBtn.onclick = () => {
                const item = getItem();
                const checkoutUrl = getSingleCheckoutUrl(item.variantId, item.quantity);
                window.location.href = checkoutUrl;
            };
        }

        if (qtyMinus) qtyMinus.onclick = () => {
            if (currentQuantity > 1) { currentQuantity--; qtyInput.value = currentQuantity; }
        };
        if (qtyPlus) qtyPlus.onclick = () => {
            currentQuantity++; qtyInput.value = currentQuantity;
        };

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        gsap.fromTo('.pv-details',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
        );
        gsap.fromTo('.pv-stack-image',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
        );
    };

    window.closeProductDetails = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', window.closeProductDetails);

    // --- Internal helpers ---

    function populateProductData(product) {
        titleEl.textContent = product.title;
        updatePriceDisplay(currentVariant);
        descEl.innerHTML = product.descriptionHtml || product.description || 'Delightful handcrafted baked goods.';
    }

    function updatePriceDisplay(variant) {
        priceEl.textContent = variant.price;
        if (variant.compareAtPrice) {
            comparePriceEl.textContent = variant.compareAtPrice;
            comparePriceEl.style.display = 'inline';
            if (saleBadgeEl) saleBadgeEl.style.display = 'inline-block';
        } else {
            comparePriceEl.style.display = 'none';
            if (saleBadgeEl) saleBadgeEl.style.display = 'none';
        }
    }

    function renderImageStack(images) {
        const container = document.querySelector('.pv-hero-image-container');
        container.innerHTML = '';
        if (!images || images.length === 0) return;
        images.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = img.url;
            imgEl.alt = img.alt;
            imgEl.className = 'pv-stack-image';
            container.appendChild(imgEl);
        });
    }

    function renderVariants(product) {
        const group = document.createElement('div');
        group.className = 'pv-variant-group';

        const label = document.createElement('span');
        label.className = 'pv-variant-label';
        label.textContent = 'Select Option';
        group.appendChild(label);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'pv-variant-options';

        product.variants.forEach(variant => {
            const pill = document.createElement('button');
            pill.className = `pv-variant-pill ${variant.id === currentVariant.id ? 'active' : ''}`;
            pill.textContent = variant.title;

            pill.addEventListener('click', () => {
                currentVariant = variant;
                updatePriceDisplay(variant);
                document.querySelectorAll('.pv-variant-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Update hero image if variant has one
                if (variant.image) {
                    const heroImgEl = document.querySelector('.pv-hero-image-container img');
                    if (heroImgEl) heroImgEl.src = variant.image;
                }
            });

            optionsContainer.appendChild(pill);
        });

        group.appendChild(optionsContainer);
        variantsContainer.appendChild(group);
    }
}
