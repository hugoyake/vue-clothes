<template>
    <div id="wrapper">
        <nav class="navbar is-dark">

            <div class="navbar-brand">
                <router-link to="/" class="navbar-item">
                    <strong>Clothes</strong>
                </router-link>
                <a href="#" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu"
                    @click="showMobileMenu = !showMobileMenu">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <!-- bulma用is-active控制class -->
            <div class="navbar-menu" id="navbar-menu" :class="{'is-active': showMobileMenu}">
                <div class="navbar-start">
                    <div class="navbar-item">
                        <form method="get" action="/search">
                            <div class="field has-addons">
                                <div class="control">
                                    <input type="text" class="input" placeholder="What are you looking for?"
                                        name="query">
                                </div>

                                <div class="control">
                                    <button class="button is-success">
                                        <span class="icon">
                                            <i class="fas fa-search"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="navbar-end">
                    <router-link to="/summer" class="navbar-item">Summer</router-link>
                    <router-link to="/winter" class="navbar-item">Winter</router-link>


                    <div class="navbar-item">
                        <div class="buttons">
                            <template v-if="$store.state.isAuthenticated">
                                <router-link to="/my-account" class="button is-light">My account</router-link>
                            </template>

                            <template v-else>
                                <router-link to="/log-in" class="button is-light">Log in</router-link>
                            </template>

                            
                            <router-link to="/cart" class="button is-success">
                                <span class="icon">
                                    <i class="fas fa-shopping-cart"></i>
                                </span>
                                <span>Cart ({{ cartTotalLength  }})</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- loading bar -->
        <teleport to="body">
            <div class="pageloader" :class="{'loader-active': loadingBarStatus}"><span class="title">Clothes</span></div>
        </teleport>

        <suspense>
            <section class="section">
                <!-- search.vue引用async setup() -->
                <router-view></router-view>
            </section>
        </suspense>


        <footer class="footer">
            <p class="has-text-centered">Copyright (c) 2021</p>
        </footer>
    </div>

</template>
<script>
import { computed, reactive, ref, watchEffect } from 'vue'
import { useStore } from 'vuex';
import { onBeforeRouteUpdate } from 'vue-router'
import axios from 'axios'

export default ({
    setup() {
        const showMobileMenu = ref(true)
        const store = useStore()

        
        //vue3 before create 直接設 setup，所以直接呼叫vuex初始狀態
        store.commit('initializeStore') 

        const token = store.state.token

        if (token) {
            axios.defaults.headers.common['Authorization'] = "Token " + token
        } else {
            axios.defaults.headers.common['Authorization'] = ""
        }

        let cart = reactive({
            items: []
        })

        cart = store.state.cart    

        const cartTotalLength = computed(() => {
            let totalLength = 0

            for (let i = 0; i < cart.items.length; i++) {
                totalLength += parseInt(cart.items[i].quantity)
                console.log(cart.items[i].quantity)
            }

            return totalLength
        })
        
        //只有有loading => mobile menu就收回(app.vue似乎不會啟動router，無法透過Navigation Guards操作，要用watchEffect全局監聽)
        watchEffect(() => {
            if (store.state.isLoading == true) {
                showMobileMenu.value = false
            }
        })

        return {
            showMobileMenu,
            cartTotalLength,
            //loading bar 狀態(居然可以直接設在這邊!上面都沒有喔)
            loadingBarStatus: computed(() => store.state.isLoading),
        }
    },
})
</script>

<style lang="scss">
@import 'bulma';
@import 'bulma-extensions';

.pageloader:not(.is-left-to-right), .pageloader:not(.is-right-to-left) {
    transform: translateY(-0%);
    z-index: -1000;
    opacity: 0;
    background-color: #25313e;
    transition: opacity 1s ease-in, z-index 1s ease-in;
    &.loader-active {
        z-index: 99999;
        opacity: 1;
        transition: opacity 0s ease-in, z-index 0s ease-in;
        
    }

    &::after {
        border: 0 solid #cccccc;
        
    }

    .title {
        color: #cccccc;
        
    }
}
</style>
