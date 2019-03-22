<template>
  <section v-if="trip" class="trip-details">
    <div class="top-fold">
      <div class="profile-img" :style="profilePic"/>
      <h1>{{trip.title}}</h1>
      <h2>{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</h2>
      <button v-if="trip.userId !== loggedInUser._id" @click="initChat(trip.userId)">
        <i class="far fa-comment-alt"></i>
      </button>
    </div>

    <button
      class="btn-join-trip"
      @click="joinLeaveTrip"
      v-if="trip.userId !== loggedInUser._id"
    >{{(isUserMember)? 'Leave' : 'Ask to join'}}</button>

    <div class="trip-members">
      <h3>Group members:</h3>
      <ul>
        <UserPreview v-for="user in trip.members" :key="user._id" :user="user"/>
      </ul>
    </div>

    <p class="trip-desc">{{trip.desc}}</p>

    <div class="destinations">
      <ul>
        <li
          v-for="destination in trip.destinations"
          :key="destination.region"
        >{{destination.region}}, {{destination.country}}</li>
      </ul>
    </div>

    <div class="comments">
      <h3>comments</h3>
    </div>
  </section>
</template>

<script>
// CMPS
import UserPreview from "@/components/UserPreview.vue";

export default {
  name: "trip-details",
  components: {
    UserPreview
  },
  methods: {
    joinLeaveTrip() {
      if (this.isUserMember) this.$store.dispatch({ type: "leaveTrip" });
      else this.$store.dispatch({ type: "joinTrip" });
    }
  },
  created() {
    var { tripId } = this.$route.params;
    if (tripId) this.$store.dispatch({ type: "loadTrip", tripId });
    else this.$router.go(-1);
  },
  beforeDestroy() {
    this.$store.commit({ type: "clearTrip" });
  },
  initChat(userId) {
    
  },
  computed: {
    trip() {
      return this.$store.getters.tripToDisplay;
    },
    loggedInUser() {
      return this.$store.getters.loggedUser;
    },
    profilePic() {
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    },
    isUserMember() {
      return this.trip.members.some(user => user._id === this.loggedInUser._id);
    }
  }
};
</script>