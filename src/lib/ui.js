/**
 * FOMO Bakery — UI Module
 * Scroll animations, reveals, parallax, hero animations, section transitions.
 * Extracted from script.js for modular use across all pages.
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Initialize all UI animations. Call once after DOMContentLoaded.
 */
export function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: { targets: navbar, className: 'scrolled' }
        });
    }

    // 2. Reveal Animations (.reveal-item)
    const revealItems = document.querySelectorAll('.reveal-item');
    if (revealItems.length > 0) {
        revealItems.forEach((item) => {
            gsap.set(item, { opacity: 0, y: 30 });
            ScrollTrigger.create({
                trigger: item,
                start: 'top 90%',
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        delay: (item.dataset.delay || 0)
                    });
                    item.classList.add('is-visible');
                },
                once: true
            });
        });

        // Safety fallback: force visibility if GSAP fails after 3s
        setTimeout(() => {
            revealItems.forEach(item => {
                const style = window.getComputedStyle(item);
                if (style.opacity === '0') {
                    gsap.to(item, { opacity: 1, y: 0, duration: 0.5 });
                }
            });
        }, 3000);
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

    // 4. Hero Animations
    initHeroAnimations();

    // 5. Section Transitions
    initSectionTransitions();

    // 6. Scroll-Driven Craft Section
    initCraftScrollSection();

    // 7. Product Card Hover
    initCardHover();

    // 8. Smooth Anchor Scroll
    initSmoothScroll();

    // 9. Floating Badge
    const floatingBadge = document.querySelector('.floating-badge');
    if (floatingBadge) {
        gsap.to(floatingBadge, { y: -8, duration: 2, repeat: -1, yoyo: true, ease: 'power1.inOut' });
    }

    // 10. Testimonial Cards
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(card, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.15, ease: 'power2.out' });
            },
            once: true
        });
    });

    // Refresh after load + resize
    setTimeout(() => ScrollTrigger.refresh(), 500);
    window.addEventListener('load', () => ScrollTrigger.refresh());
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
}

function initHeroAnimations() {
    // Center Content Hero
    const heroCenterContent = document.querySelector('.hero-center-content');
    if (heroCenterContent) {
        gsap.from(heroCenterContent.children, {
            opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', delay: 0.5
        });
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        gsap.from(scrollIndicator, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 1.5 });
        ScrollTrigger.create({
            start: 'top -100',
            onEnter: () => gsap.to(scrollIndicator, { opacity: 0 }),
            onLeaveBack: () => gsap.to(scrollIndicator, { opacity: 1 })
        });
    }

    // Standard / Craft / Indulge hero variants
    ['.hero-content', '.craft-hero-content', '.indulge-hero-content']
        .map(s => document.querySelector(s)).filter(Boolean)
        .forEach(target => {
            gsap.from(target.children, {
                opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: 'power2.out', delay: 0.3
            });
        });

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        gsap.from(heroImage, { opacity: 0, scale: 0.95, duration: 1, ease: 'power2.out', delay: 0.5 });
    }
}

function initSectionTransitions() {
    const indulgeSection = document.querySelector('.indulge-dark-bg');
    if (indulgeSection) {
        gsap.from(indulgeSection, {
            backgroundPosition: '50% 100%',
            scrollTrigger: {
                trigger: indulgeSection,
                start: 'top 80%', end: 'top 20%', scrub: 1
            }
        });
    }
}

function initCraftScrollSection() {
    const craftSection = document.querySelector('.craft-scroll-section');
    const craftPanels = document.querySelectorAll('.craft-panel');
    const craftSpacer = document.querySelector('.craft-scroll-spacer');
    const craftBgImage = document.querySelector('.craft-bg-image img');

    if (!craftSection || craftPanels.length === 0 || !craftSpacer) return;

    const totalPanels = craftPanels.length;
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

    const panelDuration = 1 / totalPanels;
    craftPanels.forEach((panel, index) => {
        const startTime = index * panelDuration;
        gsap.set(panel, { y: '100vh' });
        craftTimeline.to(panel, { y: '0vh', duration: panelDuration * 0.35, ease: 'power2.out' }, startTime);
        if (index < totalPanels - 1) {
            craftTimeline.to(panel, { y: '-100vh', duration: panelDuration * 0.35, ease: 'power2.in' }, startTime + (panelDuration * 0.65));
        } else {
            craftTimeline.to(panel, { y: '-100vh', duration: panelDuration * 0.3, ease: 'power2.in' }, startTime + (panelDuration * 0.7));
        }
    });

    if (craftBgImage) {
        craftTimeline.to(craftBgImage, { y: 80, scale: 1.15, duration: 1, ease: 'none' }, 0);
    }
}

function initCardHover() {
    document.querySelectorAll('.product-card, .gift-card, .persona-card').forEach(card => {
        card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' }));
        card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' }));
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: target, offsetY: 80 },
                    ease: 'power2.inOut'
                });
            }
        });
    });
}
