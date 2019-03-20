<template>
  <section class="trip-details">
    {{trip}}
    <!-- <img src="https://via.placeholder.com/250x170" alt=""> -->
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
  },
  destroy() {
    this.$store.commit({type: 'clearTrip'});
  }
}
</script>