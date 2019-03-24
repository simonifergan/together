<template>
  <li class="msg-preview">
    <div
      class="user-img"
      v-for="(pic, idx) in profilePics"
      :key="pic"
      :style="{'background-image': `url(${pic})`}"
      :title="chattingWith[idx].firstname"
    />
    <span
      v-for="(user, index) in chattingWith"
      :key="user._id+index"
    >{{`${user.firstname} ${user.lastname}`}}</span>
  </li>
</template>

<script>
export default {
  props: {
    chat: {
      type: Object,
      required: true
    },
    user: {
        type: Object,
        required: true,
    }
  },
  computed: {
    chattingWith() {
      return this.chat.users.filter(otherUser => otherUser._id !== this.user._id);
    },
    profilePics() {
      return this.chattingWith.map(user => user.profilePic);
    }
  }
};
</script>

<style>
</style>
