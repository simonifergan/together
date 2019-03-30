<template>
  <li class="req-preview" :title="request.user.firstName">
    <span class="user-img-container">
      <div class="user-img" :style="{'background-image': `url(${request.user.profilePic})`}"/>
    </span>
    <div class="req-content">
      <router-link :title="`See ${request.user.firstname}'s profile`" tag="h3" :to="'/user/' + request.user._id">{{request.user.firstname}}</router-link>
      <router-link class="title" :title="'Go to ' + request.trip.title" tag="h4" :to="'/trip/' + request.trip.id">In: <span>{{request.trip.title}}</span></router-link>
    </div>
    <div class="btns-container">
      <button :title="`Approve ${request.user.firstname}`" @click="requestApproved(request.user)">
        Approve
      </button>
      <button :title="`Reject ${request.user.firstname}`" @click="requestRejected(request.user)">
        Reject
      </button>
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
  methods: {
    requestApproved(pendingUser) {
      this.$emit("requestApproved", pendingUser);
    },
    requestRejected(pendingUser) {
      this.$emit("requestRejected", pendingUser);
    }
  },
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
