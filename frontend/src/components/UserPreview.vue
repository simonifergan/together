<template>
  <div class="user-preview">
    <div class="user-profile-img" :style="profilePic"/>
    <p>{{user.firstname}} {{user.lastname}}</p>
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
  display: flex;
  flex-direction: column;
  align-items: center;
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