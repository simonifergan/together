<template>
  <section v-if="trip" class="trip-details">
    <div class="top-fold">
      <div class="profile-img" :style="profilePic"/>
      <h1>{{trip.title}}</h1>
      <h2>{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</h2>
      <button
        v-if="!loggedInUser || trip.userId !== loggedInUser._id"
        @click="initChat(trip.userId)"
      >
        <i class="far fa-comment-alt"></i>
      </button>
    </div>

    <button
      class="btn-join-trip"
      @click="joinLeaveTrip"
      v-if="!loggedInUser || trip.userId !== loggedInUser._id"
    >{{whoIsUser}}</button>

    <div class="trip-members">
      <h3>Group members:</h3>
      <ul>
        <UserPreview v-for="user in trip.members" :key="user._id" :user="user"/>
      </ul>
      <pending-list v-if="loggedInUser && loggedInUser._id === trip.userId" :pendingUsers="trip.pending"/>
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
    <our-super-awesome-map :enable="false" :value="trip.destinations"/>
    <div class="comments">
      <h3>Comments</h3>
    </div>
  </section>
</template>

<script>
// CMPS
import UserPreview from "@/components/UserPreview.vue";
import OurSuperAwesomeMap from '@/components/OurSuperAwesomeMap.vue'
import PendingList from '@/components/PendingList.vue';

export default {
  name: "trip-details",
  components: {
    UserPreview,
    OurSuperAwesomeMap,
    PendingList
  },
  methods: {
    joinLeaveTrip() {
      if (this.isUserMember) this.$store.dispatch({ type: "leaveTrip" });
      else if (this.trip.pending.some(id => id === this.loggedInUser._id)) this.$store.dispatch({type: 'cancelTripJoinRequest'})
      else this.$store.dispatch({ type: "userRequestToJoinTrip" });

      // THIS FUNCTION GOES TO THE TRIP OWNER - TO APPROVE A REQUEST
      // else this.$store.dispatch({ type: "joinTrip" });
    },
    initChat(userId) {
      this.$store.dispatch({ type: "socketJoinPrivateChat", userId });
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
      if (!this.loggedInUser) return false;
      return this.trip.members.some(user => user._id === this.loggedInUser._id);
    },
    whoIsUser() {
      if (!this.loggedInUser) return 'Ask to join';
      if (this.isUserMember) return "Leave";
      else if (this.trip.pending.some(userId => userId === this.loggedInUser._id)) {
        return "Cancel request";
      }
      else return "Ask to join";
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        const { tripId } = newRoute.params;
        if (tripId !== this.trip._id) {
          this.$store.dispatch({ type: "loadTrip", tripId });
        }
      }
    },
  }
};
</script>