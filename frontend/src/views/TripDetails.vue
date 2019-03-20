<template>
  <section class="trip-details">
    <h1>trip details</h1>

    {{trip}}
  </section>
</template>

<script>

export default {
  name: 'trip-details',
  components: {
  },
  computed: {
    trip() {
      return this.$store.getters.tripToDisplay;
    }
  },
  created() {
    var {tripId} = this.$route.params;
    if (tripId) this.$store.dispatch({type: 'loadTrip', tripId});
    else this.$router.go(-1);
  }
}
</script>