<template>
    <div class="column is-3">
        <div class="box">
            <figure class="image mb-4">
                <!-- GAE 不給從admin上傳照片，改用假照片 -->
                <!-- <img v-bind:src="product.get_thumbnail"> -->
                <img src="~@/assets/img/product-img.jpg">
            </figure>

            <h3 class="is-size-4">{{ product.name }}</h3>
            <p class="is-size-6 has-text-grey">${{ product.price }}</p>

            <router-link v-bind:to="product.get_absolute_url" class="button is-dark mt-4">View details</router-link>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ProductBox',
    props: {
        product: Object
    }
}
</script>

<style scoped lang="sass">
  .image
    margin: -1.25rem -1.25rem 0 -1.25rem 
</style>
