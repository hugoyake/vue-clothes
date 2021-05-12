import {
    createStore
} from 'vuex'

export default createStore({
    state: {
        cart: {
            items: []
        },
        isAuthenticated: false,
        token: '',
        isLoading: false,
        mobileMenuStatus: false
    },
    mutations: {
        //初始狀態
        initializeStore(state) {
            //要先把state轉字串再轉物件
            var parseState = JSON.parse(JSON.stringify(state))
            //初始購物車狀態
            if (localStorage.getItem('cart')) {
                parseState.cart = localStorage.getItem('cart')
            } else {
                localStorage.setItem('cart', JSON.stringify(state.cart))
                console.log('cart init error')
            }
             //初始user狀態
             if (localStorage.getItem('token')) {
                state.token = localStorage.getItem('token')
                state.isAuthenticated = true
            } else {
                state.token = ''
                state.isAuthenticated = false
            }
        },

        //加入購物車
        addToCart(state, item) {
            const exists = state.cart.items.filter((i) => i.product.id === item.product.id)
            console.log(exists, state.cart.items.quantity)

            if (exists.length) {
                exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
            } else {
                state.cart.items.push(item)
            }

            localStorage.setItem('cart', JSON.stringify(state.cart))
        },

        //loading bar status
        setIsLoading(state, status) {
            state.isLoading = status
        },

        //token
        setToken (state, token) {
            state.token = token
            state.isAuthenticated = true
        },

        //remove token
        removeToken (state) {
            state.token = ''
            state.isAuthenticated = false
        },

        //清空購物車
        clearCart (state) {
            state.cart = { items: [] }

            localStorage.setItem('cart', JSON.stringify(state.cart))
        }
    },
    actions: {},
    modules: {}
})
