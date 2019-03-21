<template>
  <section v-if="trip" class="trip-details">
    <div class="top-fold">
      <div class="profile-img" :style="profilePic"/>
      <h1>{{trip.title}}</h1>
      <h2>{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</h2>
      <button>
        <i class="far fa-comment-alt"></i>
      </button>
    </div>

    <button class="btn-join-trip">{{actionBtn}}</button>

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
// CPMS
import UserPreview from "@/components/UserPreview.vue";

export default {
  name: "trip-details",
  components: {
    UserPreview
  },
  computed: {
    trip() {
      return this.$store.getters.tripToDisplay;
    },
    loggedInUser() {
      // return this.$store.getters.currLoggedUser;
      return {
        _id: "5c911149e7179a0e4088e8c4",
        email: "simonifergan239@gmail.com",
        firstname: "Simon",
        lastname: "Ifergan",
        proposals: [],
        interestedIn: ["5c9115f5e7179a0e4088ebd2"],
        birthdate: 690825379,
        gender: "male",
        tripPrefs: {},
        profilePic:
          "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553112209/user_imgs/simon.jpg"
      };
    },
    profilePic() {
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    },
    actionBtn() {
      const loggedInUserId = this.loggedInUser._id;
      const isMemberUser = this.trip.members.some(user => user._id === loggedInUserId);
      return (isMemberUser)? 'Ask to join' : 'Leave';
    }
  },
  methods: {
    joinTrip() {
      this.$store.dispatch({ type: "joinTrip", tripId: this.trip._id });
    }
  },
  created() {
    var { tripId } = this.$route.params;
    if (tripId) this.$store.dispatch({ type: "loadTrip", tripId });
    else this.$router.go(-1);
  },
  beforeDestroy() {
    this.$store.commit({ type: "clearTrip" });
  }
};
</script>