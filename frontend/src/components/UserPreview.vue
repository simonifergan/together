<template>
  <div class="user-preview" >
    <router-link tag="div" :to="'/user/' + user._id" :title="`Go to ${user.firstname}'s profile`" class="user-profile-img" :style="profilePic"/>
    <router-link tag="p" :to="'/user/' + user._id" :title="`Go to ${user.firstname}'s profile`">{{user.firstname}} {{user.lastname}}</router-link>
    <slot name="btns-pending"></slot>
  </div>
</template>

<script>
export default {
  name: "user-preview",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    profilePic() {
      return { "background-image": `url('${this.user.profilePic}')` };
    }
  }
};
</script>

<style lang="scss">
.user-preview {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .user-profile-img {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    background-size: cover;
    box-shadow: 0 0 0.5px #e5e5e5;
    background-repeat: no-repeat;
    background-position: center;
    margin-bottom: 5px;
  }
}
</style>