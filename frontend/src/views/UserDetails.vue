<template>
  <section class="user-details" v-if="user">
    <div class="top-fold">
      <div :style="profilePic" class="user-img"/>
      <div class="user-details-content">
        <div class="user-info">
          <h2>{{user.firstname}}&nbsp;{{user.lastname}}</h2>
          <h3>
            {{user.birthdate | calcAge}}
            <span v-if="user.birthdate && user.from">,</span>
            {{user.from | countryCodeToName}}
          </h3>
        </div>
        <div class="btns-like-msg">
          <button
            v-if="!loggedInUser || (loggedInUser && user._id !== loggedInUser._id)"
            @click="initChat(user._id)"
            :title="'Start a chat with ' + user.firstname"
          >
            <i class="far fa-comment-dots"></i>
          </button>
          <p class="likes-count">
            <button :title="'Like ' + user.firstname" @click="toggleUserLike(user._id)">
              <i :class="isLike"></i>
            </button>
            <span>&nbsp;({{user.likes.length}})</span>
          </p>
        </div>
      </div>
    </div>

    <ul class="user-trips">
      <h3>{{user.firstname}}'s shared trips</h3>
      <user-trip-preview
        v-for="trip in trips"
        :key="trip._id"
        :trip="trip"
        :user="user"
        :loggedInUser="loggedInUser"
      >
        <!-- <pending-list
            slot="pending-list"
            @requestPendingUsers="requestPendingUsers"
            @requestApproved="requestApproved"
            @requestRejected="requestRejected"
            v-if="loggedInUser && loggedInUser._id === user._id"
        />-->
      </user-trip-preview>
    </ul>
    <div class="member-in">
      <ul>
        <member-pending-in v-for="trip in user.memberIn" :key="trip._id" :trip="trip" />
      </ul>
    </div>
    
  </section>
</template>

<script>
// CMPS
import UserTripPreview from "@/components/UserTripPreview";
import MemberPendingIn from "@/components/MemberPendingIn";

export default {
  components: {
    UserTripPreview,
    MemberPendingIn
  },
  methods: {
    async initUser() {
      const { userId } = this.$route.params;
      if (userId) {
        const res = await this.$store.dispatch({ type: "getUserById", userId });
        if (res)
          await this.$store.dispatch({ type: "loadTripsByUserId", userId });
      }
    },
    requestPendingUsers(pending) {
      this.$store.dispatch({ type: "getUsers", userIds: pending });
    },
    toggleUserLike(userId) {
      if (!this.loggedInUser) {
        this.$router.push(this.$route.path + "#login");
        return;
      }
      this.$store.dispatch({ type: "toggleUserLike", userId });
    },
    initChat(userId) {
      if (!this.loggedInUser) {
        this.$router.push(this.$route.path + "#login");
        return;
      }
      this.$store.dispatch({ type: "socketJoinPrivateChat", userId });
    }
  },
  async created() {
    this.initUser();
  },
  beforeDestroy() {
    this.$store.commit({ type: "loadTrips", trips: [] });
  },
  computed: {
    user() {
      return this.$store.getters.userToDisplay;
    },
    loggedInUser() {
      return this.$store.getters.loggedUser;
    },
    profilePic() {
      if (!this.user) return "";
      return { backgroundImage: `url('${this.user.profilePic}')` };
    },
    trips() {
      return this.$store.getters.trips;
    },
    isLike() {
      let classKey =
        this.loggedInUser &&
        this.user.likes.some(userId => userId === this.loggedInUser._id)
          ? "fas fa-heart"
          : "far fa-heart";
      return { [classKey]: true };
    }
  },
  beforeDestroy() {
    this.$store.commit({ type: "setUserToDisplay", user: null });
  },

  watch: {
    $route: {
      handler(newRoute) {
        this.$store.commit({ type: "loadTrips", trips: [] });
        this.initUser();
      },
      deep: true
    }
  }
};
</script>

<style>
</style>
