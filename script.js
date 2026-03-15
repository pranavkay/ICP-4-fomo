/* ==========================================================================
   FOMO Bakery - Scroll Animations & Interactions
   Using GSAP ScrollTrigger for smooth parallax and reveals
   ========================================================================== */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { fetchProducts, fetchCollection } from './src/lib/shopify.js';
import {
    addToCart,
    getCart,
    removeFromCart,
    updateQuantity,
    getCartTotals,
    getCheckoutUrl,
    getSingleCheckoutUrl
} from './src/lib/cart.js';
import { injectFooter } from './src/components/footer.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', async () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Animations FIRST (Critical for UI visibility)
    initAnimations();

    // Inject shared footer
    injectFooter();

    // Initialize Data & Interactivity
    let allProducts = [];
    try {
        allProducts = await initShopifyProducts();
    } catch (e) {
        console.error("Critical: Product init failed", e);
    }

    await initShopPage();
    await initStaticProducts();

    if (allProducts) {
        initArtisanFavorites(allProducts);
    }

    initGiftPacks();
    initCart();
    initProductView();

    // --------------------------------------------------------------------------
    // Core Animation Initialization
    // --------------------------------------------------------------------------
    function initAnimations() {
        console.log("Initializing Animations...");

        // 1. Navbar Background
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                toggleClass: { targets: navbar, className: 'scrolled' }
            });
        }

        // 2. Reveal Animations (With Safety Fallback)
        const revealItems = document.querySelectorAll('.reveal-item');
        if (revealItems.length > 0) {
            revealItems.forEach((item, index) => {
                // Initial state
                gsap.set(item, { opacity: 0, y: 30 }); // Hide

                // Animate
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 90%', // Slightly earlier to ensure triggering
                    onEnter: () => {
                        gsap.to(item, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'power2.out',
                            delay: (item.dataset.delay || 0)
                        });
                        item.classList.add('is-visible'); // Marker class
                    },
                    once: true
                });
            });

            // Safety Fallback: If animations fail to trigger after load, show content
            setTimeout(() => {
                revealItems.forEach(item => {
                    const style = window.getComputedStyle(item);
                    if (style.opacity === '0') {
                        gsap.to(item, { opacity: 1, y: 0, duration: 0.5 });
                    }
                });
            }, 3000); // 3 seconds after init
        }

        // 3. Parallax Effects
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.1;
            gsap.to(el, {
                yPercent: -30 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('[data-parallax-container]') || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // 4. Hero Animations (Legacy & New)
        initHeroAnimations();

        // 5. Section Transitions
        initSectionTransitions();

        // 6. Refresh ScrollTrigger to ensure positions are correct
        setTimeout(() => ScrollTrigger.refresh(), 500);
        window.addEventListener('load', () => ScrollTrigger.refresh());
    }

    function initHeroAnimations() {
        // Center Content Hero
        const heroCenterContent = document.querySelector('.hero-center-content');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        if (heroCenterContent) {
            gsap.from(heroCenterContent.children, {
                opacity: 0,
                y: 50,
                stagger: 0.2,
                duration: 1,
                ease: 'power3.out',
                delay: 0.5
            });
        }

        if (scrollIndicator) {
            gsap.from(scrollIndicator, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power2.out',
                delay: 1.5
            });

            ScrollTrigger.create({
                start: 'top -100',
                onEnter: () => gsap.to(scrollIndicator, { opacity: 0 }),
                onLeaveBack: () => gsap.to(scrollIndicator, { opacity: 1 })
            });
        }

        // Standard Hero
        const heroContent = document.querySelector('.hero-content'); // Standard hero
        const craftHeroContent = document.querySelector('.craft-hero-content'); // Craft hero
        const indulgeHeroContent = document.querySelector('.indulge-hero-content'); // Indulge hero

        // Combine all hero content wrappers
        const targets = [heroContent, craftHeroContent, indulgeHeroContent].filter(el => el);

        targets.forEach(target => {
            gsap.from(target.children, {
                opacity: 0,
                y: 40,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.3
            });
        });

        // Hero Images
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            gsap.from(heroImage, {
                opacity: 0,
                scale: 0.95,
                duration: 1,
                ease: 'power2.out',
                delay: 0.5
            });
        }
    }

    function initSectionTransitions() {
        // Dark indulgence section reveal
        const indulgeSection = document.querySelector('.indulge-dark-bg');
        if (indulgeSection) {
            gsap.from(indulgeSection, {
                backgroundPosition: '50% 100%',
                scrollTrigger: {
                    trigger: indulgeSection,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: 1
                }
            });
        }
    }

    // ... initProductView ...

    // --------------------------------------------------------------------------
    // Product Rendering
    // --------------------------------------------------------------------------
    async function initShopifyProducts() {
        const cookieGrid = document.querySelector('.cookie-grid');
        // We still want to fetch even if cookieGrid is missing (e.g. on other pages) 
        // but for this specific "Meet the Cookies" task:

        try {
            const products = await fetchProducts();

            if (cookieGrid && products && products.length > 0) {
                cookieGrid.innerHTML = '';
                // Homepage Bestsellers: Only show first 8 items
                products.slice(0, 8).forEach(product => {
                    const card = createProductCard(product);
                    cookieGrid.appendChild(card);
                });
                ScrollTrigger.refresh();
                initCookieAnimations();
            }

            return products; // Return for other sections to use
        } catch (error) {
            console.error('Failed to render products:', error);
            return [];
        }
    }

    async function initArtisanFavorites(allProducts) {
        const container = document.querySelector('.section-artisan-favorites .product-row');
        if (!container) return;

        let favorites = [];

        try {
            // 1. Try fetching specific collection
            const { fetchCollection } = await import('./src/lib/shopify.js');
            favorites = await fetchCollection('artisan-favorites');

            // 2. If collection empty/fails, fallback to allProducts
            if (!favorites || favorites.length === 0) {
                // Fallback: Use 'Favorites' tag or just first 3
                favorites = allProducts.filter(p => !p.tags.includes('hidden')).slice(0, 3);
            }
        } catch (e) {
            console.warn('Fallback to main products for Artisan Favorites', e);
            favorites = allProducts.slice(0, 3);
        }

        if (favorites.length === 0) return;

        container.innerHTML = '';
        favorites.forEach((product, index) => {
            // Create card
            const card = createProductCard(product);

            // Add custom animation delays if needed
            card.style.transitionDelay = `${index * 100}ms`;

            container.appendChild(card);
        });

        // Re-trigger reveal animations for these new items
        ScrollTrigger.refresh();

        // Manually trigger reveal if they are already in view
        const revealItems = container.querySelectorAll('.reveal-item');
        revealItems.forEach(item => {
            gsap.set(item, { opacity: 0, y: 30 });
            ScrollTrigger.create({
                trigger: item,
                start: 'top 85%',
                onEnter: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
                once: true
            });
        });
    }

    async function initGiftPacks() {
        const container = document.querySelector('.section-gifts .product-row'); // You might need to add this class in HTML if not exists
        if (!container) return;

        try {
            const { fetchCollection } = await import('./src/lib/shopify.js');
            const gifts = await fetchCollection('gift-packs');

            if (gifts && gifts.length > 0) {
                container.innerHTML = '';
                gifts.forEach(product => {
                    const card = createProductCard(product);
                    container.appendChild(card);
                });
            }
        } catch (e) {
            console.log("No gift packs found");
        }
    }

    async function initShopPage() {
        const shopGrid = document.getElementById('shop-grid');
        if (!shopGrid) return;

        try {
            // Re-use fetch products or force a larger limit for shop
            // For now, standard fetchProducts is fine (20 items)
            const products = await fetchProducts();

            if (products && products.length > 0) {
                shopGrid.innerHTML = ''; // Clear loading
                products.forEach(product => {
                    const card = createProductCard(product);
                    // Add data attributes for filtering
                    card.dataset.title = product.title.toLowerCase();
                    card.dataset.tags = (product.tags || []).join(' ').toLowerCase();

                    shopGrid.appendChild(card);

                    // Animate in
                    gsap.fromTo(card,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
                    );
                });

                // Initialize Search & Filter
                initSearch();
            }
        } catch (error) {
            console.error("Shop init failed", error);
            shopGrid.innerHTML = '<p>Could not load products. Refresh to try again.</p>';
        }
    }

    function initSearch() {
        const searchInput = document.getElementById('shop-search');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.shop-grid .product-card');

        if (!searchInput) return;

        function filterProducts() {
            const term = searchInput.value.toLowerCase();
            const activeBtn = document.querySelector('.filter-btn.active');
            const category = activeBtn ? activeBtn.dataset.filter : 'all';

            cards.forEach(card => {
                const title = card.dataset.title || '';
                const tags = card.dataset.tags || '';

                const matchesSearch = title.includes(term) || tags.includes(term);
                const matchesCategory = category === 'all' || tags.includes(category) || title.includes(category);

                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                    // Re-trigger animation? Maybe too noisy.
                } else {
                    card.style.display = 'none';
                }
            });

            ScrollTrigger.refresh();
        }

        // Search Listener
        searchInput.addEventListener('input', filterProducts);

        // Filter Buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProducts();
            });
        });
    }


    // --------------------------------------------------------------------------
    // Product View (Full Screen Transition)
    // --------------------------------------------------------------------------
    function initProductView() {
        const overlay = document.querySelector('.product-view-overlay');
        const closeBtn = document.querySelector('.product-view-close');

        const titleEl = document.querySelector('.pv-title');
        const priceEl = document.querySelector('.pv-price');
        const comparePriceEl = document.querySelector('.pv-compare-price');
        const saleBadgeEl = document.querySelector('.pv-sale-badge'); // New

        const variantsContainer = document.querySelector('.pv-variants');

        // Quantity Elements
        const qtyInput = document.getElementById('qty-input');
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');

        const descEl = document.querySelector('.pv-description');
        const addBtn = document.querySelector('.pv-add-btn');
        const buyNowBtn = document.querySelector('.pv-buy-now-btn'); // New

        if (!overlay) return;

        let currentVariant = null; // Track selection
        let currentQuantity = 1;

        window.openProductDetails = (product, originImg) => {
            // 1. Reset State
            variantsContainer.innerHTML = '';
            currentVariant = product.variants[0]; // Default to first variant
            currentQuantity = 1;
            if (qtyInput) qtyInput.value = 1;

            // 2. Populate Basic Data
            populateProductData(product);

            // 3. Render Image Stack (Vertical)
            renderImageStack(product.gallery);

            // 4. Render Variants
            if (product.variants.length > 1) {
                renderVariants(product);
            }

            // 5. Wire up Helpers
            const getItem = () => ({
                ...product,
                id: product.id,
                variantId: currentVariant.id,
                title: product.title + (currentVariant.title !== 'Default Title' ? ` - ${currentVariant.title}` : ''),
                price: currentVariant.price,
                image: currentVariant.image || product.image,
                quantity: currentQuantity
            });

            // Add to Cart
            addBtn.onclick = () => {
                addToCart(getItem());
                window.closeProductDetails();
                setTimeout(() => window.openCart(), 300);
            };

            // Buy It Now (Direct to Checkout)
            if (buyNowBtn) {
                buyNowBtn.onclick = () => {
                    const item = getItem();
                    // Do NOT add to local cart logic for Buy It Now, just instantly redirect 
                    // (Or you can add it to cart and redirect, but usually 'buy now' is instant bypass)
                    const checkoutUrl = getSingleCheckoutUrl(item.variantId, item.quantity);
                    window.location.href = checkoutUrl;
                };
            }

            // Quantity Logic
            if (qtyMinus) qtyMinus.onclick = () => {
                if (currentQuantity > 1) {
                    currentQuantity--;
                    qtyInput.value = currentQuantity;
                }
            };
            if (qtyPlus) qtyPlus.onclick = () => {
                currentQuantity++;
                qtyInput.value = currentQuantity;
            };


            // 6. Animation (FLIP) - Simplified for Editorial
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Just a simple fade up for details, image stack handles itself
            gsap.fromTo('.pv-details',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
            );

            // Stagger animations for images in stack
            gsap.fromTo('.pv-stack-image',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
            );
        };

        // --- Helpers ---

        function populateProductData(product) {
            // First image already in stack, but we might want to make sure hero logic is consistent
            // Actually, renderImageStack will handle ALL images including the 'main' one.
            // So we don't strictly need to set heroImg.src unless we want a fallback.
            // heroImg.src = product.image; 
            titleEl.textContent = product.title;
            updatePriceDisplay(currentVariant); // Use variant price
            descEl.innerHTML = product.descriptionHtml || product.description || "Delightful handcrafted cookies.";
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
            container.innerHTML = ''; // Clear existing

            if (!images || images.length === 0) return;

            images.forEach((img, index) => {
                const imgEl = document.createElement('img');
                imgEl.src = img.url;
                imgEl.alt = img.alt;
                imgEl.className = 'pv-stack-image'; // New class for stack
                container.appendChild(imgEl);
            });
        }

        function renderVariants(product) {
            // Simple flat list for now. Complex option mapping (Size vs Color) can be added if needed.
            // For cookies, it's usually just "Pack of 4" or "Eggless".

            const group = document.createElement('div');
            group.className = 'pv-variant-group';
            const containerLabel = document.createElement('span');
            containerLabel.className = 'pv-variant-label';
            containerLabel.textContent = 'Select Option';
            group.appendChild(containerLabel);

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'pv-variant-options';

            product.variants.forEach(variant => {
                const pill = document.createElement('button');
                pill.className = `pv-variant-pill ${variant.id === currentVariant.id ? 'active' : ''}`;
                pill.textContent = variant.title;

                pill.addEventListener('click', () => {
                    // Update State
                    currentVariant = variant;

                    // Update UI
                    updatePriceDisplay(variant);
                    document.querySelectorAll('.pv-variant-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');

                    // Update Image if variant has one
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

        window.closeProductDetails = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', window.closeProductDetails);
    }

    // --------------------------------------------------------------------------
    // Cart Logic
    // --------------------------------------------------------------------------
    function initCart() {
        const cartDrawer = document.querySelector('.cart-drawer');
        const backdrop = document.querySelector('.cart-backdrop');
        const closeBtn = document.querySelector('.cart-close');

        // Open/Close Handlers
        window.openCart = () => {
            cartDrawer.classList.add('active');
            backdrop.classList.add('active');
            updateCartUI();
        };

        window.closeCart = () => {
            cartDrawer.classList.remove('active');
            backdrop.classList.remove('active');
        };

        if (closeBtn) closeBtn.addEventListener('click', window.closeCart);
        if (backdrop) backdrop.addEventListener('click', window.closeCart);

        // Listen for state changes
        window.addEventListener('cart-updated', updateCartUI);

        // Initial Render
        updateCartUI();
    }

    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const totalAmountEl = document.querySelector('.total-amount');
        const checkoutBtn = document.querySelector('.checkout-btn');
        const cart = getCart();
        const totals = getCartTotals();

        // Update Total
        totalAmountEl.textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(totals.subtotal);

        // Update Checkout Link
        checkoutBtn.href = getCheckoutUrl();

        // Empty State
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <p>Your box is empty. Time to indulge?</p>
                    <button class="btn btn-outline" onclick="window.closeCart()">Start Shopping</button>
                </div>
            `;
            return;
        }

        // Render Items
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

    // Expose global helpers for HTML inline onclick events
    window.updateCartItem = (variantId, delta) => updateQuantity(variantId, delta);


    // NOTE: initShopifyProducts() is defined above (line ~210) — duplicate removed.

    // --------------------------------------------------------------------------
    // Hydrate Static Product Cards (Indulge, Gifts, Craft pages)
    // --------------------------------------------------------------------------
    async function initStaticProducts() {
        const staticCards = document.querySelectorAll('[data-title]');
        if (staticCards.length === 0) return;

        try {
            const products = await fetchProducts(); // Fetch all (cached by browser usually)
            hydrateProductCards(products);
        } catch (error) {
            console.error("Static product hydration failed", error);
        }
    }

    function hydrateProductCards(products) {
        const staticCards = document.querySelectorAll('[data-title]');

        staticCards.forEach(card => {
            const title = card.dataset.title;
            const product = products.find(p => p.title.toLowerCase() === title.toLowerCase());

            if (!product) {
                console.warn(`Product not found for hydration: ${title}`);
                return;
            }

            // 1. Make Card Interactive (Quick View)
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevent if clicking specific interactive elements
                if (e.target.closest('button') || e.target.closest('a')) return;

                const img = card.querySelector('img');
                window.openProductDetails(product, img);
            });

            // 2. Wire up "Add to Cart" Button
            let addBtn = card.querySelector('.add-to-cart-trigger');

            // If no button found, look for generic 'btn-primary' inside .gift-collection-cards or similar?
            // Or create one if it's the Indulge page style (which has no button)
            if (!addBtn) {
                // Check if it's an Indulge/Info card logic
                const infoDiv = card.querySelector('.product-info');
                if (infoDiv) {
                    addBtn = document.createElement('button');
                    addBtn.className = 'btn btn-small btn-secondary btn-block';
                    addBtn.textContent = 'Add to Box';
                    addBtn.style.marginTop = '1rem';
                    addBtn.style.width = '100%';
                    infoDiv.appendChild(addBtn);
                }
            }

            if (addBtn) {
                // Replace link behavior if it's an <a> tag
                if (addBtn.tagName === 'A') {
                    addBtn.removeAttribute('href');
                    addBtn.role = 'button';
                }

                addBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({
                        ...product,
                        variantId: product.variants[0]?.id
                    });
                    window.openCart();
                });
            }
        });
    }

    function createProductCard(product) {
        // Wrapper: Use .product-card for consistent card styling
        const card = document.createElement('div');
        card.className = 'product-card reveal-item';
        card.style.cursor = 'pointer';

        // 1. Image Container
        const imgDiv = document.createElement('div');
        imgDiv.className = 'product-image';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.imageAlt || product.title;
        img.loading = 'lazy';
        imgDiv.appendChild(img);

        // Badge (Signature/Unique)
        if (product.isSignature || product.tags.includes('Signature')) {
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

        // Click on image opens details
        imgDiv.addEventListener('click', (e) => {
            e.stopPropagation(); // Let card click handle it, or explicit. 
            // Actually, best to let card click handle it unless we need specific logic.
            // But preserving existing logic:
            window.openProductDetails(product, img);
        });

        // 2. Info Container
        const infoDiv = document.createElement('div');
        infoDiv.className = 'product-info';

        // Title
        const title = document.createElement('h4');
        title.textContent = product.title;
        infoDiv.appendChild(title);

        // Short Description (Optional, if we have it easily or just omit)
        // const desc = document.createElement('p');
        // desc.textContent = product.description ? product.description.substring(0, 50) + '...' : 'Delightful treat';
        // infoDiv.appendChild(desc);

        // Price
        const priceDiv = document.createElement('div');
        // Use generic div or just span, but let's keep it simple

        if (product.compareAtPrice) {
            const compareSpan = document.createElement('span');
            compareSpan.style.textDecoration = 'line-through';
            compareSpan.style.color = 'var(--color-text-secondary)';
            compareSpan.style.marginRight = '8px';
            compareSpan.style.fontSize = '0.9em';
            compareSpan.textContent = product.compareAtPrice;
            priceDiv.appendChild(compareSpan);
        }

        const priceSpan = document.createElement('span');
        priceSpan.className = 'product-price';
        priceSpan.textContent = product.price;
        priceDiv.appendChild(priceSpan);

        infoDiv.appendChild(priceDiv);


        // Add to Cart Button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-small btn-secondary btn-block';
        addBtn.style.marginTop = 'var(--space-3)';
        addBtn.style.width = '100%';
        addBtn.textContent = 'Add to Box';

        addBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening details
            addToCart({
                ...product,
                variantId: product.variants[0]?.id
            });
            window.openCart();
        });

        infoDiv.appendChild(addBtn);

        // Assemble
        card.appendChild(imgDiv);
        card.appendChild(infoDiv);

        // Card Click Interaction
        card.addEventListener('click', () => {
            window.openProductDetails(product, img);
        });

        return card;
    }

    function initCookieAnimations() {
        const cookieGrid = document.querySelector('.cookie-grid');
        if (cookieGrid) {
            // Animation logic maintained (query both legacy and new dynamic cards)
            const cookieItems = cookieGrid.querySelectorAll('.cookie-item, .product-card');
            gsap.set(cookieItems, { opacity: 0, y: 30 });
            ScrollTrigger.create({
                trigger: cookieGrid,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(cookieItems, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                },
                once: true
            });
        }
    }


    // --------------------------------------------------------------------------
    // Mobile Menu
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const mobileNavPanel = document.getElementById('mobile-nav-panel');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            if (mobileNavPanel) mobileNavPanel.classList.toggle('open');
        });
    }

    // Close mobile nav on link click
    if (mobileNavPanel) {
        mobileNavPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn?.classList.remove('active');
                mobileNavPanel.classList.remove('open');
            });
        });
    }

    // --------------------------------------------------------------------------
    // Navbar Background on Scroll
    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    // Navbar Background (Moved to initAnimations)
    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    // Reveal Animations
    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    // Reveal Animations (Moved to initAnimations)
    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    // Parallax Effects
    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    // Parallax Effects (Moved to initAnimations)
    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    // Hero Section Animation (Full-Screen Centered)
    // --------------------------------------------------------------------------
    // Scroll-Driven Craft Section (Fly-Up Animation)
    // --------------------------------------------------------------------------
    const craftSection = document.querySelector('.craft-scroll-section');
    const craftPanels = document.querySelectorAll('.craft-panel');
    const craftSpacer = document.querySelector('.craft-scroll-spacer');
    const craftBgImage = document.querySelector('.craft-bg-image img');

    if (craftSection && craftPanels.length > 0 && craftSpacer) {
        const totalPanels = craftPanels.length;

        // Create a timeline for the entire craft section
        const craftTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: craftSection,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                pin: '.craft-sticky-container',
                pinSpacing: false
            }
        });

        // Each panel gets fly-in → hold → fly-out
        const panelDuration = 1 / totalPanels;

        craftPanels.forEach((panel, index) => {
            const startTime = index * panelDuration;

            // Set initial state - below viewport (NO opacity change to preserve backdrop-filter)
            gsap.set(panel, {
                y: '100vh'
            });

            // Fly in from below to center
            craftTimeline.to(panel, {
                y: '0vh',
                duration: panelDuration * 0.35,
                ease: 'power2.out'
            }, startTime);

            // Fly out to above
            if (index < totalPanels - 1) {
                craftTimeline.to(panel, {
                    y: '-100vh',
                    duration: panelDuration * 0.35,
                    ease: 'power2.in'
                }, startTime + (panelDuration * 0.65));
            } else {
                // Last panel flies out too
                craftTimeline.to(panel, {
                    y: '-100vh',
                    duration: panelDuration * 0.3,
                    ease: 'power2.in'
                }, startTime + (panelDuration * 0.7));
            }
        });

        // Subtle parallax on background image
        if (craftBgImage) {
            craftTimeline.to(craftBgImage, {
                y: 80,
                scale: 1.15,
                duration: 1,
                ease: 'none'
            }, 0);
        }
    }

    // --------------------------------------------------------------------------
    // Product Cards Hover Enhancement
    // --------------------------------------------------------------------------
    const productCards = document.querySelectorAll('.product-card, .gift-card, .persona-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -6,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // --------------------------------------------------------------------------
    // Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });

    // --------------------------------------------------------------------------
    // Floating Badge Animation
    // --------------------------------------------------------------------------
    const floatingBadge = document.querySelector('.floating-badge');
    if (floatingBadge) {
        gsap.to(floatingBadge, {
            y: -8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }

    // --------------------------------------------------------------------------
    // Cookie Grid Stagger Animation
    // --------------------------------------------------------------------------
    const cookieGrid = document.querySelector('.cookie-grid');
    if (cookieGrid) {
        const cookieItems = cookieGrid.querySelectorAll('.cookie-item');

        ScrollTrigger.create({
            trigger: cookieGrid,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(cookieItems, {
                    opacity: 1,
                    y: 0,
                    stagger: {
                        amount: 0.6,
                        from: 'start'
                    },
                    duration: 0.5,
                    ease: 'power2.out'
                });
            },
            once: true
        });
    }

    // --------------------------------------------------------------------------
    // Testimonial Cards
    // --------------------------------------------------------------------------
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });

    // --------------------------------------------------------------------------
    // Refresh ScrollTrigger on Resize
    // --------------------------------------------------------------------------
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    console.log('FOMO Bakery — From our kitchen to your table 🥐✨');
});
