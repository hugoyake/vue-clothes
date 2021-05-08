<template>
  <div class="home">
    <section :class="$style.bannerWrap" class="hero is-medium is-dark mb-6" >
      <div :class="$style.bannerWrapTitleWrap" class="hero-body">
        <h3 class="title mb-6 mt-6">
          Welcome to Clothes
        </h3>
      </div>
    </section>

    <div  class="columns is-multiline">
      <div class="column is-12">
        <h2 class="is-size-2 has-text-centered">Latest products</h2>
      </div>

      <ProductBox 
        v-for="product in latestProducts"
        :key="product.id"
        :product="product" />
    </div>
  </div>
</template>

<script>
//功能: 展示頁面
//組件: ProductBox
import { ref } from 'vue'
import { useStore } from 'vuex';
import axios from 'axios'

import ProductBox from '@/components/ProductBox'

export default {
  name: 'Home',
  components: {
    ProductBox
  },
  setup() {
    //第一步: 建立頁簽
    document.title =  'Home | Clothes'


    //第二步: 引用composition API
    const store = useStore()


    //第三步: 商品列表變數    
    const latestProducts = ref([])


    async function getLatestProduct () {
        //loading start
        store.commit('setIsLoading', true)    
     
        await axios
          .get('/api/v1/latest-products/')
          .then(response => {
              latestProducts.value = response.data
        })
          .catch(error => {
              console.log(error)
        })

        //loading close
        store.commit('setIsLoading', false)
    }
    

    //展示商品列表
    getLatestProduct()

    return {
      latestProducts
    }
  },
}
</script>

<style lang="sass" module>
.bannerWrap
    min-height: 350px
    background-color: red
    background: url("~@/assets/img/banner.jpg") center center / cover
    
.bannerWrapTitleWrap
    display: flex
    flex-direction: column
    justify-content: flex-end

.bannerWrapTitleWrap > h3
    color: #25313e
</style>
