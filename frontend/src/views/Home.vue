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
    <filter-list v-if="trips.length" :type="'destinations'" :filters="destinations"/>
    <filter-list v-if="trips.length" :type="'activities'" :filters="activities"/>
    <trip-list :trips="trips" title="Trips you might like"/>
  </section>
</template>

<script>
// CMPS:
import TripList from "@/components/TripList";
import FilterList from "@/components/FilterList";

export default {
  name: "home",
  components: {
    TripList,
    FilterList
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    trips() {
      return this.$store.getters.trips;
    },
    destinations() {
      return this.trips.reduce((acc, trip) => {
        trip.destinations.forEach(destination => {
          if (acc.indexOf(destination) === -1) acc.push(destination)
        })
        return acc
      }, [])
    },
    activities() {
      return this.trips.reduce((acc, trip) => {
        trip.activities.forEach(activity => {
          if (acc.indexOf(activity) === -1) acc.push(activity)
        })
        return acc
      }, [])
    }
  },
  methods: {
    search() {
      this.$router.push('/search?q=' + this.searchQuery)
    }
  },
  async created() {
    await this.$store.dispatch({type: 'connectToGoogle'})
    this.$store.dispatch({ type: "loadTrips" });
  }
};
</script>
