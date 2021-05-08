<template>
    <div class="page-search">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Search</h1>

                <h2 class="is-size-5 has-text-grey">Search term: "{{ query }}"</h2>
            </div>

            <ProductBox 
                v-for="product in products"
                v-bind:key="product.id"
                v-bind:product="product" />
        </div>
    </div>
</template>
 
<script>
//功能: 搜尋
//組件: ProductBox

import { ref } from 'vue'
import { useStore } from 'vuex';
import axios from 'axios'
import ProductBox from '@/components/ProductBox'

export default {
    name: 'Search',
    components: {
        ProductBox
    },
    async setup() {
        //第一步: 頁簽
        document.title = 'Search | Clothes'


        //第二步: 引用composition API
        const store = useStore()


        //第三步: 建立列表變數
        const products = ref()


        //第四步: 建立搜尋變數
        const query = ref()


        //第五步: 操作URL
        //window.location物件主要跟url有關，search則是?後面url
        let uri = window.location.search.substring(1)
        //URLSearchParams物件有很多功能，把uri丟進去以利操作
        let params = new URLSearchParams(uri)


        //第六步: 丟進後端product.views.search方法search
        if (params.get('query')) {            
            await store.commit('setIsLoading', true)

            query.value = params.get('query')//get: 返回第一個碰到的字串            

            await axios
                .post('/api/v1/products/search/', {'query': query.value})
                .then(response => {
                    products.value = response.data
                })
                .catch(error => {
                    console.log(error)
                })                

            await  store.commit('setIsLoading', false)
        }        

        return {
            query,
            products
        }
    },
}
</script>
<style scoped lang="sass">
  .product-image
    width: 100%
</style>
