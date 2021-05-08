<template>
    <tr>
        <td><router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link></td>
        <td>${{ item.product.price }}</td>
        <td>
            {{ item.quantity }}
            <a @click="decrementQuantity(item)">-</a>
            <a @click="incrementQuantity(item)">+</a>
        </td>
        <td>${{ getItemTotal(item) }}</td>
        <td><button class="delete" @click="removeFromCart(item)"></button></td>
    </tr>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex';

export default {
    name: 'CartTtem',
    props: {
        initialItem: Object
    },
    setup(props, { emit }) {
        const store = useStore()
        const item = ref(props.initialItem)
        const getItemTotal = (item) => {
            return item.quantity * item.product.price
        }
        const incrementQuantity = (item) => {
            item.quantity += 1 
        }
        const decrementQuantity = (item) => {
            item.quantity -= 1 

            if ( item.quantity === 0 ) {
                emit('removeFromCart', item)
            }

            updateCart()
        }
        const updateCart = () => {
            localStorage.setItem('cart', JSON.stringify(store.state.cart))
        }
        const removeFromCart = (item) => {
            emit('removeFromCart', item)

            updateCart()
        }

        return {
            item,
            getItemTotal,
            decrementQuantity,
            incrementQuantity,
            removeFromCart
        }
    },
}
</script>