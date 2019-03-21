<template>
  <section class="home">
    <header>
        <h1>Pick your travels,<br>
          We will bridge the gaps.
        </h1>
      <div class="intro-form">
        <h2>Where do you want to go?</h2>
        <form @submit.prevent>
          <input type="text">
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
    <trip-list :trips="trips" title="Trips you might like"/>
  </section>
</template>

<script>
// CMPS:
import TripList from "@/components/TripList";

export default {
  name: "home",
  components: {
    TripList
  },
  computed: {
    trips() {
      return this.$store.getters.trips;
    }
  },
  created() {
    this.$store.dispatch({ type: "loadTrips" });
  }
};
</script>
