/**
 * FOMO Bakery — Shared Footer Component
 * Injects the shared site footer into any page.
 * Usage: import { injectFooter } from './footer.js'; injectFooter({ root: '../' });
 */

export function injectFooter({ root = '' } = {}) {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="${root}assets/fomo-logo.png" alt="FOMO Bakery" class="logo-img footer-logo">
                    </div>
                    <p>Handcrafted doughnuts, cookies, cupcakes &amp; more — made fresh in Bangalore.<br>Real butter. No preservatives.</p>
                </div>
                <div class="footer-links">
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="${root}craft/index.html">The Craft</a></li>
                        <li><a href="${root}indulge/index.html">Indulge</a></li>
                        <li><a href="${root}gifts/index.html">Gifts</a></li>
                        <li><a href="${root}index.html#order">Order</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Policies</h4>
                    <ul>
                        <li><a href="${root}policies/privacy.html">Privacy Policy</a></li>
                        <li><a href="${root}policies/refund.html">Refund Policy</a></li>
                        <li><a href="${root}policies/shipping.html">Shipping Policy</a></li>
                        <li><a href="${root}policies/terms.html">Terms of Service</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Connect</h4>
                    <ul>
                        <!-- TODO: Replace with real links -->
                        <li><a href="https://wa.me/91XXXXXXXXXX" target="_blank">WhatsApp</a></li>
                        <li><a href="https://instagram.com/fomobakery" target="_blank">@fomobakery</a></li>
                        <li><a href="mailto:support@fomobakery.com">support@fomobakery.com</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 FOMO Bakery. All rights reserved.</p>
            </div>
        </div>
    `;

    document.body.appendChild(footer);
}
