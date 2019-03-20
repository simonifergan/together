<template>
  <section v-if="trip" class="trip-details">
    <div class="top-fold">
      <div class="profile-img" :style="profilePic"/>
      <h1>Title</h1>
      <h2>{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</h2>
      <button>
        <i class="far fa-comment-alt"></i>
      </button>
    </div>

    <div class="trip-members">
      <button class="btn-join-trip">Ask to join</button>
      <!-- <p>Interested users:</p>
      <ul>
        <li v-for="user in interestedUsers" :key="user._id"></li>
      </ul>-->
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
export default {
  name: "trip-details",
  components: {},
  computed: {
    trip() {
      return this.$store.getters.tripToDisplay;
    },
    profilePic() {
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    }
  },
  created() {
    var { tripId } = this.$route.params;
    if (tripId) this.$store.dispatch({ type: "loadTrip", tripId });
    else this.$router.go(-1);
  },
  destroy() {
    this.$store.commit({ type: "clearTrip" });
  }
};
</script>