<template>
    <section class="signup-page">
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
            <label for="">Birth Date<br>
                <el-date-picker
                    v-model="newUser.birthDate"
                    type="date"
                    value-format="timestamp"
                    placeholder="Pick a day">
                </el-date-picker>
            </label><br>
            <label for="">Gender<br>
                <el-select v-model="newUser.gender">
                    <el-option value="Male">Male</el-option>
                    <el-option value="Female">Female</el-option>
                    <el-option value="null">Rather not say</el-option>
                </el-select>
            </label><br>
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
