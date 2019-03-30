<template>
  <li class="req-preview" :title="request.user.firstName">
    <span class="user-img-container">
      <div
        class="user-img"
        :style="{'background-image': `url(${request.user.profilePic})`}"
      />
    </span>
    <div class="req-content">
      <h3>{{request.trip.title}}</h3>
      <span>{{request.user.firstname}}</span>
    </div>
      <router-link class="see-all" tag="span" :to="'/trip/' + request.trip.id">View Trip</router-link>
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
