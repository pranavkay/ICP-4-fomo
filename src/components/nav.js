/**
 * FOMO Bakery — Shared Navigation Component
 * Injects the shared navbar into any page.
 * Usage: import { injectNav } from './nav.js'; injectNav({ root: '../', activePage: 'craft' });
 *
 * activePage options: 'home' | 'craft' | 'indulge' | 'gifts' | 'shop'
 */

export function injectNav({ root = '', activePage = '' } = {}) {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="nav-container">
            <a href="${root}index.html" class="logo">
                <img src="${root}assets/fomo-logo.png" alt="FOMO Bakery" class="logo-img">
            </a>
            <ul class="nav-links">
                <li><a href="${root}craft/index.html" ${activePage === 'craft' ? 'class="active"' : ''}>The Craft</a></li>
                <li><a href="${root}indulge/index.html" ${activePage === 'indulge' ? 'class="active"' : ''}>Indulge</a></li>
                <li><a href="${root}gifts/index.html" ${activePage === 'gifts' ? 'class="active"' : ''}>Gifts</a></li>
                <li><a href="${root}index.html#cookies" ${activePage === 'shop' ? 'class="active"' : ''}>Shop</a></li>
            </ul>
            <a href="${root}index.html#order" class="nav-cta">Order Now</a>
            <button class="mobile-menu-btn" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    `;

    // Insert before first child of body
    document.body.insertBefore(nav, document.body.firstChild);

    // Mobile menu toggle
    const mobileMenuBtn = nav.querySelector('.mobile-menu-btn');
    const navLinks = nav.querySelector('.nav-links');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }

    // Scroll-aware background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}
