<template>
  <section class="home">
    <header>
      <div class="intro-form">
      <h1>Where do you want to go?</h1>
      <form @submit.prevent="">
        <input type="text">
        <button type="submit">Search</button>
      </form>
      </div>
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
