<template>
    <section class="login-page">
        <form @submit.prevent="login">
            <input type="email" v-model="email" placeholder="email">
            <input type="text" v-model="password" placeholder="password">
            <button type="submit"></button>
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
            this.$store.dispatch({type: 'login', credentials: {email: this.email, password: this.password}})
        }
    }
}
</script>

<style>

</style>
