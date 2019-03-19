<template>
  <section class="home">
    <h2>Home</h2>

    <trip-list v-if="trips" :trips="trips" />
  </section>
</template>

<script>
// CMPS:
import TripList from '@/components/TripList'

export default {
  name: 'home',
  components: {
    TripList
  },
  computed: {
    trips() {
      return this.$store.getters.trips;
    }
  },
  created() {
    this.$store.dispatch({type: 'loadTrips'})
  }
}
</script>
