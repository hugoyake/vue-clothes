<template>
    <div class="page-success">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Thank you</h1>

                <p>Your order will be processed within 48 hours</p>

                
            </div>
        </div>
    </div>
</template>


<script>
//功能: 表示購買成功
//組件: 0

export default {
    name: 'Success',
    setup() {
        //第一步: 頁簽
        document.title = 'Success | Clothes'        
    },
}
</script>
<style scoped lang="sass">
  .product-image
    width: 100%
</style>
