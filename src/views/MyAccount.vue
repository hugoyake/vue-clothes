<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">My account</h1>
            </div>

            <div class="column is-12">
                <button @click="logout()" class="button is-danger">Log out</button>
            </div>

            <hr>

            <div class="column is-12">
                <h2 class="subtitle">My orders</h2>
                
                <OrderSummary
                    v-for="order in orders"
                    v-bind:key="order.id"
                    v-bind:order="order"/>
                <h3>ewewe</h3>
            </div>
        </div>
    </div>
</template>


<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import OrderSummary from '@/components/OrderSummary'

export default {
    name: 'MyAccount',
    components: {
        OrderSummary
    },
    setup() {
        document.title = 'My account | Clothes'

        const store = useStore()
        const router = useRouter()
        const orders = ref([])

        const logout = () => {
            axios.defaults.headers.common["Authorization"] = ""

            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("userid")

            store.commit("removeToken")

            router.push('/')
        }

        const getMyders = async function () {
            store.commit('setIsLoading', true)

            await axios
                .get('/api/v1/orders/')
                .then(response => {
                    orders.value = response.data
                })
                .catch(error => {
                    console.log(error)
                })

            store.commit('setIsLoading', false)
        }

        getMyders()

        return {
            logout,
            orders
        }
    },
}
</script>
<style scoped lang="sass">
  .product-image
    width: 100%
</style>
