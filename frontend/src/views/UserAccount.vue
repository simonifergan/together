<template>
    <section class="signup-page">
        <form @submit.prevent="saveUser" v-if="user">
            <h2>Account</h2>
            <label>Email
                <el-input type="email" v-model="user.email" placeholder="Email" />
            </label>
            <label>Password
                <el-input type ="password" v-model="user.password" placeholder="Password" />
            </label>
            <label>First Name
                <el-input v-model="user.firstname" placeholder="First Name" />
            </label>
            <label>Last Name
                <el-input v-model="user.lastname" placeholder="Last Name" />
            </label>
            <label>Birth Date<br>
                <el-date-picker
                    v-model="user.birthDate"
                    type="date"
                    value-format="timestamp"
                    placeholder="Pick a day">
                </el-date-picker>
            </label><br>
            <label>Gender<br>
                <el-select v-model="user.gender">
                    <el-option value="Male">Male</el-option>
                    <el-option value="Female">Female</el-option>
                    <el-option value="null">Rather not say</el-option>
                </el-select>
            </label><br>
            <h2>Travel Partner Preferences</h2>
            <label>Gender<br>
                <el-select v-model="user.tripPrefs.gender">
                    <el-option value="null">No Preference</el-option>
                    <el-option value="Male">Male</el-option>
                    <el-option value="Female">Female</el-option>
                </el-select>
            </label><br>
            <label>Age<br>
                <el-select v-model="user.tripPrefs.age">
                    <el-option value="null">No Preference</el-option>
                    <el-option value="1">18-24</el-option>
                    <el-option value="2">24-30</el-option>
                    <el-option value="3">30-40</el-option>
                    <el-option value="4">40+</el-option>
                </el-select>
            </label><br>
            <h2>Activity Preferences</h2>
            <activity-prefs v-model="user.tripPrefs.activities" />
            <button type="submit">Save</button>
        </form>
    </section>
</template>

<script>
import ActivityPrefs from '@/components/ActivityPrefs';
import UploadImage from '@/components/UploadImage';

export default {
    components: {
        ActivityPrefs, UploadImage
    },
    name: 'EditProfile',
    data() {
        return {
            user: null
        }
    },
    methods: {
        saveUser() {
            this.$store.dispatch({type: 'saveUser', user: this.user})
        }
    },
    async created() {
        this.user = await this.$store.dispatch({type: 'getUserForEdit', userId: this.$route.params.userId})
    }
}
</script>

<style>

</style>
