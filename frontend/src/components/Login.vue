<template>
    <section class="login-form" v-if="isAlive">
        <button title="Dismiss" class="cancel" @click="cancel">
            <i class="fas fa-times"></i>
        </button>
        <form @submit.prevent="login">
            <div class="error" v-if="isError">Wrong e-mail and/or password.</div>
            <label title="Enter your e-mail address" for="">Email<br>
                <el-input type="email" v-model="email" placeholder="Email" />
            </label>
            <label title="Enter your password">Password<br>
                <el-input type="password" v-model="password" placeholder="Password" />
            </label>
            <p>
                Not registered yet?
                <router-link tag="span" to="/signup" title="Sign up">
                    Sign up
                </router-link>
            </p>
            <div class="btns-container">
                <SNSLogin title="Login with Facebook" type="button" />
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
            isError: false,
        }
    },
    methods: {
        async login() {
            console.log('I am inside login')
            const res = await this.$store.dispatch({type: 'login', credentials: {email: this.email, password: this.password}})
            if (res) {
                this.isAlive = false;
                this.$router.push(this.$route.path);
            } else {
                this.isAlive = true;
                this.showError();
            }
        },
        cancel() {
            this.$router.push(this.$route.path)
        },
        showError() {
            this.isError = true;
            setTimeout( () => {
                this.isError = false;
            }, 3000)
        }
    },
}
</script>

<style>

</style>
