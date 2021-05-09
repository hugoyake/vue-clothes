<template>
    <div class="page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.product.id"
                        >
                            <td>{{ item.product.name }}</td>
                            <td>${{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>${{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>${{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">1. Shipping details</h2>

                <p class="has-text-grey mb-4">* All fields are required</p>

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>

                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Zip code*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="zipcode">
                            </div>
                        </div>

                        <div class="field">
                            <label>Place*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                
                <button class="button is-dark" @click="informationConfirm">Confirm</button>
                <hr>
            </div>

            
            <div class="column is-12 box" v-show="paypalStatus">
                <h2 class="subtitle ">2. Using PayPal !</h2>                    
                    <div id="paypal-button-container" class="mb-5"></div>
                <hr>
            </div>
            
        </div>
    </div>
</template>

<script>
//子組件: 0
//內容: 完成購買
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
    name: 'Checkout',
    setup() {
        //第一步: 建立頁簽
        document.title = 'Checkout | Clothes'

        
        //第二步: 引用composition API
        const store = useStore()
        const router = useRouter()
        store.commit('setIsLoading', true)


        //第三步: 建立計算變數
        //商品變數
        const cart = ref({
            items: []
        })
        //表單變數
        const first_name = ref('')
        const last_name = ref('')
        const email = ref('')
        const phone = ref('')
        const address = ref('')
        const zipcode = ref('')
        const place = ref('')
        //報錯變數
        const errors = ref([])


        //第四步: 建立頁面layout變數
        //變數
        const paypalStatus = ref(false)


        //第五部: 商品變數，注入vuex存放的購買資訊
        cart.value = store.state.cart


        //第六步: 計算總價
        //單位商品總價
        const getItemTotal = (item) => {
            return item.quantity * item.product.price
        }
        //商品總價
        const cartTotalPrice = computed(() => {
            return cart.value.items.reduce((acc, curVal) => {
                return acc += curVal.product.price * curVal.quantity
            }, 0)
        })
        //商品總量
        const cartTotalLength = computed(() => {
            return cart.value.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        })


        //第五步: 電子支付api
        //要等到mount在執行，因為create階段#paypal-button-container元件還沒出現，會報錯
        onMounted(() => {
            if (cartTotalLength.value > 0) {
                paypal.Buttons({
                    createOrder: function (data, actions) {
                        // This function sets up the details of the transaction, including the amount and line item details.
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: cartTotalPrice.value
                                }
                            }]
                        });
                    },
                    onApprove: function (data, actions) {
                        // This function captures the funds from the transaction.
                        return actions.order.capture().then(function (details) {
                            // This function shows a transaction success message to your buyer.
                            //purchaseData()
                        });
                    }
                }).render('#paypal-button-container');
                //This function displays Smart Payment Buttons on your web page.
            }
        }) 
        store.commit('setIsLoading', false)  

        
        //送出購買人資訊
        const informationConfirm = () => {
            errors.value = []
            if (first_name.value === '') {
                errors.value.push('The first name field is missing!')
            }
            if (last_name.value === '') {
                errors.value.push('The last name field is missing!')
            }
            if (email.value === '') {
                errors.value.push('The email field is missing!')
            }
            if (phone.value === '') {
                errors.value.push('The phone field is missing!')
            }
            if (address.value === '') {
                errors.value.push('The address field is missing!')
            }
            if (zipcode.value === '') {
                errors.value.push('The zip code field is missing!')
            }
            if (place.value === '') {
                errors.value.push('The place field is missing!')
            }
            if (!errors.value.length) {
                //paypalStatus.value = true    
                purchaseData()         
            }
        }

        async function purchaseData() {
            const items = []
            for (let i = 0; i < cart.value.items.length; i++) {
                const item = cart.value.items[i]
                const obj = {
                    product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price * item.quantity
                }
                items.push(obj)
            }
            const data = {
                'first_name': first_name.value,
                'last_name': last_name.value,
                'email': email.value,
                'address': address.value,
                'zipcode': zipcode.value,
                'place': place.value,
                'phone': phone.value,
                'items': items,
            }
            await axios
                .post('/api/v1/checkout/', data)
                .then(response => {
                    store.commit('clearCart')
                    router.push('/cart/success')
                })
                .catch(error => {
                    errors.value.push('Something went wrong. Please try again')
                    console.log(error)
                })
        }




        return {
            cart,
            first_name,
            last_name,
            email,
            phone,
            address,
            zipcode,
            place,
            errors,
            paypalStatus,
            getItemTotal,
            informationConfirm,
            cartTotalPrice,
            cartTotalLength
        }
    }
}
</script>