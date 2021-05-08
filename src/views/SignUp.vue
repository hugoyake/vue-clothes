<template>
    <div class="page-sign-up">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Sign Up</h1>

                <form action="" @submit.prevent="submitForm">

                    <div class="field">
                        <label>Username</label>
                        <div class="control">
                            <input type="text" class="input" v-model="username">
                        </div>
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password">
                        </div>
                    </div>

                    <div class="field">
                        <label>Repeat password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password2">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Sign up</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/log-in">click here</router-link> to log in!
                </form>
            </div>
        </div>
    </div>
</template>
 
<script>
//功能: 註冊
//組件: 0

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'bulma-toast'
import axios from 'axios'

export default {
    name: 'SignUp',
    setup() {
        //第一步: 頁簽
        document.title = " Sign Up | Clothes"


        //第二步: 引用composition API  
        const router = useRouter()


        //第三步: 建立表單變數
        const username = ref('') 
        const password = ref('')
        const password2 = ref('')
        //錯誤欄
        const errors = ref([])


        //submit
        const submitForm = () => {
            errors.value = []

            if (username.value === '') {
                errors.value.push('The username is missing')
            }

            if (password.value === '') {
                errors.value.push('The password is too short')
            }

            if (password.value !== password2.value) {
                errors.value.push('The passwords doesn\'t match')
            }

            if (!errors.length) {
                //登入時驗證用
                const formData = {
                    username: username.value,
                    password: password.value
                }

                axios
                    .post("/api/v1/users/", formData)
                    .then(response => {
                        toast
                            ({
                                message: 'Account created, please log in!',
                                type: 'is-success',
                                dismissible: true,
                                pauseOnHover: true,
                                duration: 2000,
                                position: 'bottom-right',
                            })
                    
                        router.push('/log-in/')
                    })
                    .catch(error => {
                        if (error.response) {
                            for (const property in error.response.data) {
                                errors.value.push(`${property}: ${error.response.data[property]}`)
                            }
                            console.log(JSON.stringify(error.response.data))
                        } else if (error.message) {
                            errors.value.push('Something went wrong. Please try again')
                            
                            console.log(error, JSON.stringify(error))
                        }
                    })
            }            
        }
        
        
        return {
            username,
            password,
            password2,
            errors,
            submitForm
        }
    },
}
</script>
<style scoped lang="sass">
  .product-image
    width: 100%
</style>
