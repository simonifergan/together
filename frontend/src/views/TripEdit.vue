<template>
  <section class="trip-edit">
    <h1>{{(this.trip._id)? 'Edit Trip' : 'Add Trip'}}</h1>
  </section>
</template>

<script>
// SERVICE
import TripService from '@/services/TripService'

export default {
  name: "trip-edit",
  data() {
    return {
      trip: {}
    }
  },
  created() {
    const {tripId} = this.$route.params;
    if (tripId) {
      this.$store.dispatch({type: 'loadTrip', tripId})
        .then(() => {this.trip = this.$store.getters.tripToEdit; console.log('here', this.trip)})
    }
    else this.trip = TripService.getEmpty();
  }
};

</script>