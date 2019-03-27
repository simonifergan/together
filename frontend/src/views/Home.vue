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
    <article v-for="(list, idx) in listsForRender" :key="list.title + idx" :class="'article-' + list.type">
      <component :is="list.type" :title="list.title" :trips="list.trips" :filters="list.filters" />
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
        beachCities: [],
        activities: [],
      },
      countries: this.$store.getters.countries
    };
  },
  computed: {
    loggedUser() {
      return this.$store.getters.loggedUser
    },
    listsForRender() {
      const lists = []
      for (let tripList in this.tripLists) {
        lists.push({title: tripList, trips: this.tripLists[tripList], type: 'tripList'})
      }
      for (let filterList in this.filterLists) {
        lists.push({title: filterList, filters: this.filterLists[filterList], type: 'filterList'})
      }
      lists.sort((list1, list2) => {
        let list1length = list1.filters ? list1.filters.length : list1.trips.length
        let list2length = list2.filters ? list2.filters.length : list2.trips.length
        return list2length - list1length
      })
      return lists
    }
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
