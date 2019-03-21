<template>
    <section class="login-page">
        <form @submit.prevent="login">
            <label for="">Email<br>
                <el-input type="email" v-model="email" placeholder="Email" />
            </label>
                <label for="">Password<br>
            <el-input type="password" v-model="password" placeholder="Password" />
                </label>
            <button type="submit">Login</button>
        </form>
    </section>
</template>

<script>
export default {
    name: 'LoginPage',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            this.$store.dispatch({type: 'login', credentials: {email: this.email, password: this.password}});
        }
    },
    created() {
        
    }
}
</script>

<style>

</style>
