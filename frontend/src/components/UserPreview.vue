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
    width: 60px;
    height: 60px;
    background-size: contain;
    border-radius: 50%;
  }
}
</style>