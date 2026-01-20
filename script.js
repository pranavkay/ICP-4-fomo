/* ==========================================================================
   FOMO Cookies - Scroll Animations & Interactions
   Using GSAP ScrollTrigger for smooth parallax and reveals
   ========================================================================== */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // --------------------------------------------------------------------------
    // Mobile Menu
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            // Toggle mobile menu visibility (would need additional styles)
        });
    }

    // --------------------------------------------------------------------------
    // Navbar Background on Scroll
    // --------------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');

    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { targets: navbar, className: 'scrolled' }
    });

    // --------------------------------------------------------------------------
    // Reveal Animations
    // --------------------------------------------------------------------------
    const revealItems = document.querySelectorAll('.reveal-item');

    revealItems.forEach((item, index) => {
        // Initial state
        gsap.set(item, {
            opacity: 0,
            y: 30
        });

        // Animate on scroll
        ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(item, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: item.dataset.delay || 0
                });
            },
            once: true
        });
    });

    // --------------------------------------------------------------------------
    // Parallax Effects
    // --------------------------------------------------------------------------
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

    // --------------------------------------------------------------------------
    // Hero Section Animation (Full-Screen Centered)
    // --------------------------------------------------------------------------
    const heroCenterContent = document.querySelector('.hero-center-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (heroCenterContent) {
        // Initial animation on page load
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

        // Hide scroll indicator on scroll
        ScrollTrigger.create({
            start: 'top -100',
            onEnter: () => {
                gsap.to(scrollIndicator, {
                    opacity: 0,
                    duration: 0.3
                });
            },
            onLeaveBack: () => {
                gsap.to(scrollIndicator, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }

    // Legacy hero support
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroContent) {
        // Initial animation on page load
        gsap.from(heroContent.children, {
            opacity: 0,
            y: 40,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.3
        });
    }

    if (heroImage) {
        gsap.from(heroImage, {
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: 'power2.out',
            delay: 0.5
        });
    }

    // --------------------------------------------------------------------------
    // Section Transitions
    // --------------------------------------------------------------------------

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

    console.log('FOMO Cookies - Slow Indulgence loaded ✨');
});
