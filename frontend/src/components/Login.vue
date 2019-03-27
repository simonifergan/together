<template>
    <section class="login-form" v-if="isAlive">
        <button title="Dismiss" class="cancel" @click="cancel">
            <i class="fas fa-times"></i>
        </button>
        <form @submit.prevent="login">
            <label title="Enter your e-mail address" for="">Email<br>
                <el-input type="email" v-model="email" placeholder="Email" />
            </label>
            <label title="Enter your password">Password<br>
            <el-input type="password" v-model="password" placeholder="Password" />
                </label>
            <div class="btns-container">
                <SNSLogin />
                <button title="Press to login" type="submit">Login</button>
            </div>
        </form>
    </section>
</template>

<script>
import SNSLogin from '@/components/SNSLogin';

export default {
    name: 'LoginPage',
    components: {
        SNSLogin
    },
    data() {
        return {
            email: '',
            password: '',
            isAlive: true,
        }
    },
    methods: {
        login() {
            this.isAlive = false;
            this.$store.dispatch({type: 'login', credentials: {email: this.email, password: this.password}})
            .then(res => {
                this.$router.push(this.$route.path);
            })
            .catch(() => {
                this.isAlive = true;
            });
        },
        cancel() {
            this.$router.push(this.$route.path)
        }
    },
    created() {
        
    }
}
</script>

<style>

</style>
