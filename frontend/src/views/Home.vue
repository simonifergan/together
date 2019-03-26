<template>
  <section class="home">
    <header>
      <div class="centered-content">
        <h1>Reaching your destination with the right people for you.</h1>
        <div class="intro-form">
          <form @submit.prevent="search">
            <input type="text" placeholder="Anywhere" v-model="searchQuery">
            <button type="submit" title="Search">
              <img src="@/assets/svg/search.svg">
            </button>
          </form>
        </div>
      </div>
    </header>
    <article class="article-filters">
      <!-- <filter-list v-if="destinations" :type="'destinations'" :filters="destinations"/> -->
      <filter-list v-for="(value, key) in filterLists" :key="key" :filters="value" :title="key"/>
    </article>
    <article class="article-trips">
      <trip-list v-for="(value, key) in tripLists" :key="key" :trips="value" :title="key"/>
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
    FilterList
  },
  data() {
    return {
      searchQuery: "",
      tripLists: {
        trending: [],
        recommended: []
      },
      filterLists: {
        beach: [],
        activities: [],
      },
      countries: this.$store.getters.countries
    };
  },
  computed: {
    loggedUser() {
      return this.$store.getters.loggedUser
    }
    // trips() {
    //   return this.$store.getters.trips;
    // },
    // destinations() {
    //   return this.trips.reduce((acc, trip) => {
    //     trip.destinations.cities.forEach(city => {
    //       if (acc.indexOf(city) === -1) acc.push(city)
    //     })
    //     return acc
    //   }, [])
    // },
    // activities() {
    //   return this.trips.reduce((acc, trip) => {
    //     trip.activities.forEach(activity => {
    //       if (acc.indexOf(activity) === -1) acc.push(activity)
    //     })
    //     return acc
    //   }, [])
    // },
  },
  watch: {
    async loggedUser() {
      this.tripLists.recommended = await this.$store.dispatch({ type: "getRecommendedTrips" });
    }
  },
  methods: {
    search() {
      this.$router.push("/search?q=" + this.searchQuery);
    },
    async getActivityTrips(activity) {
      const activityTrips = await this.$store.dispatch({ type: "getActivityTrips", activity })
      this.tripLists = Object.assign({}, this.tripLists, {
        [activity]: activityTrips,
      })
    },
    async getFiltersForCountry(country) {
      const cities = await this.$store.dispatch({type: 'getCitiesByCountry', country})
      const citiesWithImgs = await this.$store.dispatch( {type: 'getFilterImgs', filterType: 'destinations', filters: cities })
      this.filterLists = Object.assign({}, this.filterLists, {
        [country]: citiesWithImgs,
      })
    }
  },
  async created() {
    if (!window.google) {
      await this.$store.dispatch({ type: "connectToGoogle" });
    }
    this.tripLists.trending = await this.$store.dispatch({ type: "getTrendingTrips" });
    if (this.$store.getters.loggedUser) {      
      this.tripLists.recommended = await this.$store.dispatch({ type: "getRecommendedTrips" })
    }
    const activities = this.$store.getters.activities;
    this.filterLists.activities = await this.$store.dispatch( {type: 'getFilterImgs', filterType: 'activities', filters: activities })
    this.filterLists.activities.forEach(activity => this.getActivityTrips(activity.title));
    this.countries.forEach(country => this.getFiltersForCountry(country))
  }
};
</script>
