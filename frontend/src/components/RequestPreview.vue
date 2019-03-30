<template>
  <li class="req-preview" :title="request.user.firstName" v-if="request">
    <span class="user-img-container">
      <div class="user-img" :style="{'background-image': `url(${request.user.profilePic})`}"/>
    </span>
    <div class="req-content">
      <router-link :title="`See ${request.user.firstname}'s profile`" tag="h3" :to="'/user/' + request.user._id">{{request.user.firstname}}</router-link>
      <router-link class="title" :title="'Go to ' + request.trip.title" tag="h4" :to="'/trip/' + request.trip.id">In: <span>{{request.trip.title}}</span></router-link>
    </div>
    <div class="btns-container">
      <button :title="`Approve ${request.user.firstname}`" @click="requestApproved(request.user, request.trip.id)">
        Approve
      </button>
      <button :title="`Reject ${request.user.firstname}`" @click="requestRejected(request.user, request.trip.id)">
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
    requestApproved(pendingUser, tripId) {
      this.$emit("requestApproved", {pendingUser, tripId});
    },
    requestRejected(pendingUser, tripId) {
      this.$emit("requestRejected", {pendingUser, tripId});
    }
  },
};
</script>