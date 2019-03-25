<template>
  <section class="home">
    <header>
      <div class="centered-content">
        <h1>Reaching your destination with the right people for you.</h1>
        <div class="intro-form">
          <form @submit.prevent="search">
            <input type="text" placeholder="Anywhere" v-model="searchQuery">
            <button type="submit">
              <img src="@/assets/svg/search.svg">
            </button>
          </form>
        </div>
      </div>
    </header>
    <article class="article-filters">
      <filter-list v-if="trips.length" :type="'destinations'" :filters="destinations"/>
      <filter-list v-if="trips.length" :type="'activities'" :filters="activities"/>
    </article>
    <article class="article-trips">
      <trip-list :trips="trips" title="Trips you might like"/>
    </article>
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
    FilterList,
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
    if (!window.google) {
      await this.$store.dispatch({type: 'connectToGoogle'})
    }    
    this.$store.dispatch({ type: "loadTrips" });
  }
};
</script>
