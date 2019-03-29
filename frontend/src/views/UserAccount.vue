<template>
  <section class="signup-page">
    <form @submit.prevent="saveUser" v-if="user">
      <h2>Account Settings</h2>
      <label>
        Email
        <el-input type="email" v-model="user.email" placeholder="Email" required/>
      </label>
      <label>
        First name
        <el-input v-model="user.firstname" placeholder="First Name"/>
      </label>
      <label>
        Last name
        <el-input v-model="user.lastname" placeholder="Last Name"/>
      </label>
      <h2>Profile picture</h2>
      <upload-image :profilePic="user.profilePic" @setProfilePic="setProfilePic"/>
        <h2>Change password</h2>
      <label class="change-password">
        Confirm password <span>(required)</span>
        <el-input type="password" v-model="user.confirmPassword" placeholder="Type your current password" req/>
      </label>
      <label>
        New password
        <el-input type="password" v-model="user.newPassword" placeholder="Type a new password"/>
      </label>
      <h2>Personal information <span>(optional)</span></h2>
      <label>
        Birthdate
        <br>
        <el-date-picker
          v-model="user.birthdate"
          type="date"
          value-format="timestamp"
          placeholder="Pick a day"
        ></el-date-picker>
      </label>
      <br>
      <label>
        Gender
        <br>
        <el-select v-model="user.gender">
          <el-option value="male" label="Male"></el-option>
          <el-option value="female" label="Female"></el-option>
          <el-option value="null" label="Rather not say"></el-option>
        </el-select>
      </label>
      <br>
      <label>
        Country of residence
        <br>
        <el-select placeholder="Select a country" v-model="user.from">
          <el-option v-for="(country, idx) in worldCountries" :key="idx + country+ idx" :value="country" >{{country}}</el-option>
        </el-select>
      </label>
      <br>
      <h2>
        Travel-partner preferences
        <span>(recommended)</span>
      </h2>
      <label>
        Gender
        <br>
        <el-select v-model="user.tripPrefs.gender">
          <el-option value="null" label="No Preference"></el-option>
          <el-option value="Male" label="Male"></el-option>
          <el-option value="Female" label="Female"></el-option>
        </el-select>
      </label>
      <br>
      <label>
        Age
        <br>
        <el-select v-model="user.tripPrefs.age">
          <el-option value="null" label="No Preference"></el-option>
          <el-option :value="1" label="18-24"></el-option>
          <el-option :value="2" label="24-30"></el-option>
          <el-option :value="3" label="30-40"></el-option>
          <el-option :value="4" label="40+"></el-option>
        </el-select>
      </label>
      <br>
      <h2>
        Activity preferences
        <span>(recommended)</span>
      </h2>
      <activity-prefs v-model="user.tripPrefs.activities"/>
      <button v-if="!isProcessing" type="submit">Save</button>
    </form>
  </section>
</template>

<script>
import ImageService from "@/services/ImageService.js";
import UtilService from '@/services/UtilService.js'

import ActivityPrefs from "@/components/ActivityPrefs";
import UploadImage from "@/components/UploadImage";

export default {
  components: {
    ActivityPrefs,
    UploadImage
  },
  name: "UserAccount",
  data() {
    return {
      user: null,
      newImage: null,
      isProcessing: false,
    };
  },
  methods: {
    async saveUser() {
      this.isProcessing = true;
      if (this.newImage) this.user.profilePic = await ImageService.uploadImage(this.newImage);
      await this.$store.dispatch({ type: "saveUser", user: this.user });
      this.isProcessing = false;
      this.$router.go(-1);
    },
    setProfilePic(img) {
      this.newImage = img
    }
  },
  async created() {
    this.user = await this.$store.dispatch({
      type: "getUserToEdit",
      userId: this.$route.params.userId
    });
  },
  computed: {
    worldCountries() {
      return Array.from(UtilService.worldCodeMap.values());
    }
  },
};
</script>

<style>
</style>
