/**
 * FOMO Bakery — Shared Footer Component
 * Injects a unified modern footer into any page.
 * Usage: import { injectFooter } from './footer.js'; injectFooter({ root: '../' });
 */

export function injectFooter({ root } = {}) {
    // Auto-detect root path if not provided
    if (root === undefined) {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length - 1;
        // Pages in subdirectories (categories/, personas/, etc.) need '../'
        // Root pages need '' or './'
        root = depth > 1 ? '../' : '';
    }
    // Remove any existing hardcoded footer
    const existing = document.querySelector('footer.footer');
    if (existing) existing.remove();

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.id = 'site-footer';
    footer.innerHTML = `
        <div class="container">
            <!-- Back to top -->
            <a href="#" class="footer-back-to-top" aria-label="Back to top">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>Back to top</span>
            </a>

            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="${root}index.html" class="footer-logo-link">
                        <img src="${root}assets/fomo-logo.webp" alt="FOMO Bakery" class="logo-img footer-logo">
                    </a>
                    <p>Handcrafted doughnuts, bomboloni, cookies, cupcakes &amp; celebration cakes — made fresh in Bangalore.</p>
                    <p class="footer-tagline">Real butter. No preservatives. No FOMO.</p>
                    <div class="footer-social">
                        <a href="https://instagram.com/fomobakery" target="_blank" rel="noopener" aria-label="Instagram">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener" aria-label="WhatsApp">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                        <a href="mailto:support@fomobakery.com" aria-label="Email">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </a>
                    </div>
                </div>

                <div class="footer-links">
                    <h4>Categories</h4>
                    <ul>
                        <li><a href="${root}categories/doughnuts.html">Doughnuts</a></li>
                        <li><a href="${root}categories/bomboloni.html">Bomboloni</a></li>
                        <li><a href="${root}categories/cookies.html">Cookies</a></li>
                        <li><a href="${root}categories/salt-breads.html">Salt Breads</a></li>
                        <li><a href="${root}categories/cupcakes.html">Cupcakes</a></li>
                        <li><a href="${root}categories/celebration-cakes.html">Celebration Cakes</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="${root}craft/index.html">The Craft</a></li>
                        <li><a href="${root}indulge/index.html">Indulge</a></li>
                        <li><a href="${root}gifts/index.html">Gifts</a></li>
                        <li><a href="${root}shop/index.html">Shop All</a></li>
                        <li><a href="${root}pages/occasions.html">Occasions</a></li>
                        <li><a href="${root}pages/corporate.html">Corporate Orders</a></li>
                        <li><a href="${root}pages/track-order.html">Track Order</a></li>
                    </ul>
                </div>

                <div class="footer-links-double">
                    <div class="footer-links">
                        <h4>For You</h4>
                        <ul>
                            <li><a href="${root}personas/health-conscious.html">Health-Conscious</a></li>
                            <li><a href="${root}personas/young-adults.html">Young Adults</a></li>
                            <li><a href="${root}personas/kids-family.html">Kids &amp; Family</a></li>
                            <li><a href="${root}personas/celebrations.html">Celebrations</a></li>
                        </ul>
                    </div>
                    <div class="footer-links">
                        <h4>Policies</h4>
                        <ul>
                            <li><a href="${root}policies/privacy.html">Privacy</a></li>
                            <li><a href="${root}policies/refund.html">Refunds</a></li>
                            <li><a href="${root}policies/shipping.html">Shipping</a></li>
                            <li><a href="${root}policies/terms.html">Terms</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 FOMO Bakery &middot; Bangalore, India</p>
                <p class="footer-made-with">Made with fresh butter &amp; love</p>
            </div>
        </div>
    `;

    document.body.appendChild(footer);

    // Back to top smooth scroll
    footer.querySelector('.footer-back-to-top').addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
