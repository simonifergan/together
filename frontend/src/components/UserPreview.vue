<template>
  <li class="user-preview">
    <!-- {{user}} -->
    <div class="user-profile-img" :style="profilePic"></div>
    <p>{{user.firstname}} {{user.lastname}}</p>
  </li>
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