const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                // Core
                main: resolve(__dirname, 'index.html'),
                craft: resolve(__dirname, 'craft/index.html'),
                indulge: resolve(__dirname, 'indulge/index.html'),
                gifts: resolve(__dirname, 'gifts/index.html'),
                products: resolve(__dirname, 'products/template.html'),
                shop: resolve(__dirname, 'shop/index.html'),

                // Categories
                categoryTemplate: resolve(__dirname, 'categories/category-template.html'),
                doughnuts: resolve(__dirname, 'categories/doughnuts.html'),
                bomboloni: resolve(__dirname, 'categories/bomboloni.html'),
                cookies: resolve(__dirname, 'categories/cookies.html'),
                saltBreads: resolve(__dirname, 'categories/salt-breads.html'),
                cupcakes: resolve(__dirname, 'categories/cupcakes.html'),
                celebrationCakes: resolve(__dirname, 'categories/celebration-cakes.html'),

                // Personas
                healthConscious: resolve(__dirname, 'personas/health-conscious.html'),
                youngAdults: resolve(__dirname, 'personas/young-adults.html'),
                kidsFamily: resolve(__dirname, 'personas/kids-family.html'),
                celebrations: resolve(__dirname, 'personas/celebrations.html'),

                // Pages
                corporate: resolve(__dirname, 'pages/corporate.html'),
                occasions: resolve(__dirname, 'pages/occasions.html'),
                trackOrder: resolve(__dirname, 'pages/track-order.html'),

                // Policies
                privacy: resolve(__dirname, 'policies/privacy.html'),
                refund: resolve(__dirname, 'policies/refund.html'),
                shipping: resolve(__dirname, 'policies/shipping.html'),
                terms: resolve(__dirname, 'policies/terms.html'),
            },
        },
    },
})
