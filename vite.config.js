const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                craft: resolve(__dirname, 'craft/index.html'),
                indulge: resolve(__dirname, 'indulge/index.html'),
                gifts: resolve(__dirname, 'gifts/index.html'),
                products: resolve(__dirname, 'products/template.html'),
            },
        },
    },
})
