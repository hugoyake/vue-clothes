<template>
    <div class="page-log-in">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Log in</h1>

                <form @submit.prevent="submitForm">
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

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Log in</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/sign-up">click here</router-link> to sign up!
                </form>
            </div>
        </div>
    </div>
</template>

<script>
//功能: 登入
//組件: 0

import { ref } from 'vue'
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

export default {
    name: 'LogIn',
    setup() {
        //第一步: 頁簽
        document.title = " Log In | Clothes"


        //第二步: 引用composition API
        const store = useStore()
        const route = useRoute()
        const router = useRouter()


        //第二步: 建立表單變數
        const username = ref('') 
        const password = ref('')
        //報錯
        const errors = ref([])   

        

        async function submitForm () {
            axios.defaults.headers.common["Authorization"] = ""

            localStorage.removeItem("token")

            //準備驗證用
            const formData = {
                username: username.value,
                password: password.value
            }

            await axios
                .post("/api/v1/token/login/", formData)
                .then(response => {
                    //這個token哪裡來的
                    const token = response.data.auth_token
                    store.commit('setToken', token)
                    
                    axios.defaults.headers.common["Authorization"] = "Token " + token
                    localStorage.setItem("token", token)
                    const toPath = route.query.to || '/cart'
                    router.push(toPath)
                })
                .catch(error => {
                    if (error.response) {
                        for (const property in error.response.data) {
                            errors.value.push(`${property}: ${error.response.data[property]}`)
                        }
                    } else {
                        errors.value.push('Something went wrong. Please try again')
                        
                        console.log(error, JSON.stringify(error))
                    }
                })
        }

        return {
            username,
            password,
            errors,
            submitForm
        }
    },
}
</script>