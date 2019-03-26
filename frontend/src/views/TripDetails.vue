<template>
  <section v-if="trip" class="trip-details">
    <button 
      @click="initGroupChat(trip.chatId)" 
      v-if="isUserMember || loggedInUser._id === trip.userId" 
      class="group-chat" 
      :title="'Chat with group members'"
    >
        <i class="far fa-comments"></i>HI
    </button>
    <div class="top-fold">
      <div class="profile-img" :style="profilePic"/>
      <h1>{{trip.title}}</h1>
      <h2>{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</h2>
      <button
        v-if="!loggedInUser || trip.userId !== loggedInUser._id"
        @click="initChat(trip.userId)"
        :title="'Start a chat with ' + trip.user.firstname"
      >
        <i class="far fa-comments"></i>
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
        <userPreview v-for="user in trip.members" :key="user._id" :user="user"/>
      </ul>
      <pending-list
        @requestPendingUsers="requestPendingUsers"
        @requestApproved="requestApproved"
        @requestRejected="requestRejected"
        v-if="loggedInUser && loggedInUser._id === trip.userId"
      />
    </div>

    <p class="trip-desc">{{trip.desc}}</p>
    <our-super-awesome-map :enable="false" :value="trip.destinations"/>
    <div class="comments">
      <h3>Comments</h3>
    </div>
  </section>
</template>

<script>
// CMPS
import UserPreview from "@/components/UserPreview.vue";
import OurSuperAwesomeMap from "@/components/OurSuperAwesomeMap.vue";
import PendingList from "@/components/PendingList.vue";

export default {
  name: "trip-details",
  components: {
    UserPreview,
    OurSuperAwesomeMap,
    PendingList
  },
  methods: {
    joinLeaveTrip() {
      if (this.isUserMember)
        this.$store.dispatch({
          type: "leaveTrip",
          userToLeave: this.loggedInUser,
          tripIdToLeave: this.trip._id
        });
      else if (this.trip.pending.some(id => id === this.loggedInUser._id)) {
        this.$store.dispatch({ type: "cancelTripJoinRequest" });
      } else this.$store.dispatch({ type: "userRequestToJoinTrip" });
    },
    initChat(userId) {
      this.$store.dispatch({ type: "socketJoinPrivateChat", userId });
    },
    initGroupChat(chatId) {
      this.$store.dispatch({type: 'socketInitGroupChat', chatId});
    },
    initTrip() {
      const { tripId } = this.$route.params;
      if (!this.trip || tripId !== this.trip._id) {
        this.$store.dispatch({ type: "loadTrip", tripId });
      }
    },
    requestPendingUsers() {
      this.$store.dispatch({ type: "getUsers", userIds: this.trip.pending });
    },
    requestApproved(pendingUser) {
      this.$store.dispatch({
        type: "joinTrip",
        userToJoin: pendingUser,
        tripIdToJoin: this.trip._id
      });
    },
    requestRejected(pendingUser) {
      this.$store.dispatch({
        type: "leaveTrip",
        userToLeave: pendingUser,
        tripIdToLeave: this.trip._id
      });
    }
  },
  created() {
    this.initTrip();
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
      if (!this.loggedInUser) return "Ask to join";
      if (this.isUserMember) return "Leave";
      else if (
        this.trip.pending.some(userId => userId === this.loggedInUser._id)
      ) {
        return "Cancel request";
      } else return "Ask to join";
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        this.initTrip();
      },
      deep: true
    }
  }
};
</script>