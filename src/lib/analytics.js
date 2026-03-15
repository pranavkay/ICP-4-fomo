/**
 * FOMO Bakery — Analytics Module
 * GA4 event tracking helpers.
 * GA4 gtag snippet is loaded in each HTML <head>.
 */

const GA4_ID = 'G-39E6NXKX8R';

/**
 * Send a custom GA4 event.
 */
function trackEvent(eventName, params = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
}

/**
 * Track add-to-cart events.
 */
export function trackAddToCart(product) {
    trackEvent('add_to_cart', {
        currency: 'INR',
        value: parseFloat(product.price?.replace(/[^0-9.]/g, '') || 0),
        items: [{
            item_id: product.variantId || product.id,
            item_name: product.title,
        }]
    });
}

/**
 * Track begin-checkout events.
 */
export function trackBeginCheckout(cartTotal) {
    trackEvent('begin_checkout', {
        currency: 'INR',
        value: cartTotal
    });
}

/**
 * Track form submissions (corporate enquiry, etc.)
 */
export function trackFormSubmit(formName) {
    trackEvent('form_submit', {
        form_name: formName
    });
}

/**
 * Track CTA clicks with context.
 */
export function trackCTAClick(ctaLabel, location) {
    trackEvent('cta_click', {
        cta_label: ctaLabel,
        cta_location: location
    });
}
