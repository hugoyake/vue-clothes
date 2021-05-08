<template>
    <div class="page-category">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h2 class="is-size-2 has-text-centered">{{ category.name }}</h2>
            </div>

            <ProductBox 
                v-for="product in category.products"
                :key="product.id"
                :product="product" />
        </div>
    </div>
</template>
 
<script>
//功能: 顯示同category下的商品
//組件: ProductBox

import { ref, watch } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex';
import axios from 'axios'
import ProductBox from '@/components/ProductBox'

export default {
    name: 'Category',
    components: {
        ProductBox
    },
    setup() {
        //第一步: 引入composition API        
        const route = useRoute()
        const store = useStore()


        //第二步: 建立商品列表與URL變數
        //要先設定name:''，不然template會因為抓不到(return裡的值，應該吧)報錯
        const category = ref({
            name: ''
        })
        let categorySlug = ref()


        //第三步: 獲取資料
        getCategory()


        async function getCategory () {            
            //loader start
            store.commit('setIsLoading', true)
            categorySlug.value = route.params.category_slug
            await axios
                .get(`/api/v1/products/${categorySlug.value}/`)
                .then(response => {
                    category.value = response.data
                    //網頁title
                    document.title = category.value.name + ' | Clothes'
                })
                .catch(error => {
                    console.log(error)
                })
             //loader leave
            store.commit('setIsLoading', false)
        }
        
        

        //監聽路由變化
        const stop = watch(
            () => route.params.category_slug, 
            () => {
            getCategory()
        })
        //監聽停止        
        onBeforeRouteLeave(() => {
            stop()
        })

        
        return {
            category,
        }
    },
}
</script>
<style scoped lang="sass">
  .product-image
    width: 100%
</style>
