<template>
  <section class="home">
    <header>
      <img src="@/assets/img/home/header.jpg" alt="">
    </header>

    <trip-list :trips="trips" title="Trips you might like" />
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
