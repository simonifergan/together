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
      <filter-list v-if="activities" :type="'activities'" :filters="activities"/>
    </article>
    <article class="article-trips">
      <!-- <trip-list :trips="trips" title="Trips you might like"/> -->
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
      activities: null
    };
  },
  computed: {
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
  methods: {
    search() {
      this.$router.push("/search?q=" + this.searchQuery);
    },
    async getActivityTrips(activity) {
      this.tripLists[activity] = await this.$store.dispatch({
        type: "getActivityTrips",
        activity
      });
    }
  },
  async created() {
    if (!window.google) {
      await this.$store.dispatch({ type: "connectToGoogle" });
    }
    this.tripLists.trending = await this.$store.dispatch({
      type: "getTrendingTrips"
    });
    if (this.$store.getters.loggedUser)
      this.tripLists.recommended = await this.$store.dispatch({
        type: "getRecommendedTrips"
      });
    this.activities = this.$store.getters.activities;
    this.activities.forEach(activity => this.getActivityTrips(activity));
  }
};
</script>
