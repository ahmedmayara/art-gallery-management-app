import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
    }),
    actions: {
        removeArtboardFromCart(artboardId) {
            this.cart.forEach((artboard, index) => {
                if (artboard.id === artboardId) {
                    this.cart.splice(index, 1)
                }
            })
        },
        addArtboardToCart(artboard) {
            this.cart.push(artboard)
        },
    },
    persist: true,
})