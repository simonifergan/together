<template>
  <section class="home">
    <header>
      <h1>Reaching your destination with the right people fot you</h1>
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
    <upload-image />
  </section>
</template>

<script>
// CMPS:
import TripList from "@/components/TripList";
import FilterList from "@/components/FilterList";
import UploadImage from '@/components/UploadImage';

export default {
  name: "home",
  components: {
    TripList,
    FilterList,
    UploadImage
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
