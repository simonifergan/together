<template>
  <section v-if="trip" class="trip-details">
    <div class="user-section">
      <router-link :to="'/user/' + trip.userId" tag="div" class="profile-img" :style="profilePic"/>
      <router-link :to="'/user/' + trip.userId" tag="h2">{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</router-link>
      <h3>{{trip.user.birthdate | calcAge}}, {{trip.user.from | countryCodeToName}}</h3>

      <div class="btns-like-msg">
        <button
          v-if="!loggedInUser || (loggedInUser && trip.userId !== loggedInUser._id)"
          @click="initChat(trip.userId)"
          :title="'Start a chat with ' + trip.user.firstname"
        >
          <i class="far fa-comment-dots"></i>
        </button>

        <!-- TODO: on click - update likes (toggle likes) -->
        <p class="likes-count">
          <button :title="'Like ' + trip.user.firstname">
            <i :class="isLike"></i>
          </button>
          <span>&nbsp;({{this.trip.user.likes.length}})</span>
        </p>
      </div>
    </div>

    <div class="trip-section">
      <div class="trip-header">
        <h1>{{trip.title}}</h1>
        <button
          class="btn-join-trip"
          @click="joinLeaveTrip"
          v-if="!loggedInUser || trip.userId !== loggedInUser._id"
        >{{whoIsUser}}</button>
      </div>
      <p class="trip-desc">{{trip.desc}}</p>
      <div class="trip-time">
        <i class="far fa-calendar-alt"></i>
        <p>On {{trip.startsAt | monthAndYearName}}, for {{trip.duration}}</p>
      </div>
      <div class="trip-dest">
        <i class="fas fa-globe-europe"></i>
        <!-- TODO -->
        <p>Nis, Paris in France</p>
      </div>
      <div class="trip-activities">
        <div v-for="(activity, idx) in trip.activities" :key="idx">{{activity}}</div>
      </div>

      <div class="map">
        <our-super-awesome-map :enable="false" :value="trip.destinations.countries"/>
      </div>
    </div>

    <div class="trip-users">
      <h3 v-if="loggedInUser && trip.pending.length > 0 && trip.user._id === loggedInUser._id">Pending:</h3>
      <pending-list
        @requestPendingUsers="requestPendingUsers"
        @requestApproved="requestApproved"
        @requestRejected="requestRejected"
        v-if="loggedInUser && loggedInUser._id === trip.userId"
      />
      <h3>Group members:</h3>
      <div class="btn-group-chat">
        <button
          @click="initGroupChat(trip.chatId)"
          v-if="isUserMember || (loggedInUser && loggedInUser._id === trip.userId)"
          :title="'Chat with group members'">
            <i class="far fa-comments"></i>
        </button>
      </div>
      <ul class="trip-members">
        <userPreview v-for="user in trip.members" :key="user._id" :user="user"/>
      </ul>
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
      else if (this.loggedInUser && this.trip.pending.some(id => id === this.loggedInUser._id)) {
        this.$store.dispatch({ type: "cancelTripJoinRequest" });
      } else this.$store.dispatch({ type: "userRequestToJoinTrip" });
    },
    initChat(userId) {
      this.$store.dispatch({ type: "socketJoinPrivateChat", userId });
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
    },
    initGroupChat(chatId) {
      this.$store.dispatch({ type: "socketInitGroupChat", chatId });
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
      else if (this.isUserMember) return "Leave";
      else if (
        this.loggedInUser && this.trip.pending.some(userId => userId === this.loggedInUser._id)
      ) {
        return "Cancel request";
      } else return "Ask to join";
    },
    isLike() {
      let classKey = (this.loggedInUser && this.trip.user.likes.some(userId => userId === this.loggedInUser._id))
        ? "fas fa-heart"
        : "far fa-heart";
      return { [classKey]: true };
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