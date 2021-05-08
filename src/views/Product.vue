<template>
  <div class="page-product">
    <div class="columns is-multiline">
        <div class="column is-9">
            <figure class="imaje mb-4">
            <!--  -->
                <img :src="product.get_thumbnail" alt="" class="product-image">
            </figure> 

            <h1 class="title">{{ product.name }}</h1>

            <p>{{ product.description }}</p>
        </div>

        <div class="column is-3">
            <h2 class="subtitle">Information</h2>

            <p><strong>Price: </strong>${{ product.price }}</p>
            <div class="field has-addons mt-6">
                <div class="control">
                    <input 
                        type="number" 
                        class="input" 
                        min="1" 
                        v-model="quantity"
                    >
                </div>

                <div class="control">
                    <a 
                      href="#" 
                      class="button is-dark"
                      @click="addToCart"
                    >Add to cart</a>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex';
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'Product',
    components: {

    },
    setup() {
        const quantity = ref(1)
        const product = ref([])
        const route = useRoute()
        const store = useStore()


        async function getProduct() {
            store.commit('setIsLoading', true)
            const category_slug = route.params.category_slug
            const product_slug = route.params.product_slug

            await axios
                .get(`/api/v1/products/${category_slug}/${product_slug}/`)
                .then(response => {
                    product.value = response.data
                    //網頁title
                    document.title = product.value.name + ' | Clothes'
                })
                .catch(error => {
                    console.log(error)
                })
            store.commit('setIsLoading', false)
        }

        getProduct()

        const addToCart = () => {
            if (isNaN(quantity.value) || quantity.value < 1) {
                quantity.value = 1
            }

            const item = {
                product: product.value,
                quantity: quantity.value
            }

            store.commit('addToCart', item)

            //放入cart，觸發事件
            toast({
                message: 'The product was added to the cart',
                type: 'is-success',
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: 'bottom-right',
            })
        }

        return {
            quantity,
            product,
            addToCart
        }
    },
}
</script>
<style scoped lang="sass">
  .product-image
    width: 100%
</style>
