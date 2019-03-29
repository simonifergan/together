<template>
  <li class="req-preview" :title="request.user.firstName">
    <div class="user-img-container">
      <div
        class="user-img"
        :style="{'background-image': `url(${request.user.profilePic})`}"
      />
    </div>
    <h3>{{request.trip.title}}</h3>
    <p>{{request.user.firstname}}</p>
    <router-link :to="'/trip/' + request.trip.id">View Trip</router-link>
    <div class="msg-content">
    </div>
  </li>
</template>

<script>
export default {
  props: {
    request: {
      type: Object,
      required: true
    }
  },
  computed: {

  }
};
</script>

<style lang="scss" scoped>
    .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-size: cover;
    }
</style>
