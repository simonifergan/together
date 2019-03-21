<template>
  <section class="home">
    <header>
        <h1>Pick your travels,<br>
          We will bridge the gaps.
        </h1>
      <div class="intro-form">
        <h2>Where do you want to go?</h2>
        <form @submit.prevent="search">
          <input type="text" placeholder="The Sky Is The Limit" v-model="searchQuery">
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
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    trips() {
      return this.$store.getters.trips;
    }
  },
  methods: {
    search() {
      this.$router.push('/search?q=' + this.searchQuery)
    }
  },
  created() {
    this.$store.dispatch({ type: "loadTrips" });
  }
};
</script>
