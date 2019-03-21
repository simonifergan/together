<template>
  <section class="trip-details" v-if="trip">
    {{trip}}
    <div class="trip-details-main">
      <h1>Title</h1>
      <button class="send-msg-btn"><i class="far fa-comment-alt"></i></button>
      <ul>Interested users
        <!-- <li v-for="user in interestedUsers" :key="user._id">
          {{user.userName}} NAME OF PROP?
        </li> -->
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
      <button @click="joinTrip">
        join trip
      </button>
    </div>
    <user-details :user="trip.user"/>
  </section>
</template>

<script>
import UserDetails from "../components/UserDetails.vue";
export default {
  name: "trip-details",
  components: { UserDetails },
  computed: {
    trip() {
      return this.$store.getters.tripToDisplay;
    }
  },
  methods: {
    joinTrip() {
      this.$store.dispatch({type: 'joinTrip', tripId: this.trip._id})
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