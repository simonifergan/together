<template>
    <section class="signup-page">
        <h1>Sign up</h1>
        <form @submit.prevent="signup">
            <label for="">Email
                <el-input type="email" v-model="newUser.email" placeholder="Email" />
            </label>
            <label for="">Password
                <el-input type ="password" v-model="newUser.password" placeholder="Password" />
            </label>
            <label for="">First Name
                <el-input v-model="newUser.firstname" placeholder="First Name" />
            </label>
            <label for="">Last Name
                <el-input v-model="newUser.lastname" placeholder="Last Name" />
            </label>
            <button type="submit">Sign Up</button>
        </form>
    </section>
</template>

<script>
export default {
    name: 'SignupPage',
    data() {
        return {
            newUser: null
        }
    },
    methods: {
        async signup() {
            const res = await this.$store.dispatch({type: 'signup', newUser: this.newUser});
            if (res) this.$router.push('/');
        }
    },
    created() {
        this.newUser = JSON.parse(JSON.stringify(this.$store.getters.getEmptyUser));
    },
}
</script>

<style>

</style>
