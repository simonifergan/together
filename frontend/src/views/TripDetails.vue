<template>
  <section class="trip-details">
      <div class="top-fold">
        <img src="https://api.adorable.io/avatars/285/abott@adorable.png" class="user-avatar">
        <h1>Title</h1>
        <h2>{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</h2>
        <button><i class="far fa-comment-alt"></i></button>
      </div>
      <ul>Interested users
        <li v-for="user in interestedUsers" :key="user._id">
          <!-- {{user.userName}} NAME OF PROP? -->
        </li>
      </ul>
      <p>{{trip.desc}}</p>
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