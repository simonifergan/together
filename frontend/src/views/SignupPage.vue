<template>
    <section class="signup-page">
        <form @submit.prevent="signup">
            <input type="email" v-model="newUser.email" placeholder="Email">
            <input type="text" v-model="newUser.password" placeholder="Password">
            <input type="firstname" v-model="newUser.firstname" placeholder="First Name">
            <input type="lastname" v-model="newUser.lastname" placeholder="Last Name">
            <el-date-picker
                v-model="newUser.birthDate"
                type="date"
                value-format="timestamp"
                placeholder="Pick a day">
            </el-date-picker>
            <select v-model="newUser.gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="null">Rather not say</option>
            </select>
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
        login() {
            this.$store.dispatch({type: 'signup', newUser})
        }
    },
    created() {
        this.newUser = this.$store.getters.getEmptyUser
    }
}
</script>

<style>

</style>
