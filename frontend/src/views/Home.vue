<template>
  <section class="home">
    <header>
      <div class="centered-content">
        <h1>Reaching your destination with the right people for you.</h1>
        <div class="intro-form">
          <form @submit.prevent="search">
            <el-input list="autocompleteList" class="input-text" type="text" placeholder="Anywhere" @input="onInput" v-model="searchQuery" />
            <datalist id="autocompleteList" v-if="autocomplete">
              <option v-for="(city, idx) in autocomplete" :value="city.description" :key="idx" @click.prevent="cityClicked(city)" />
            </datalist>
            <!-- <div id="autocompleteList" v-if="autocomplete">
              <p v-for="(city, idx) in autocomplete" :key="idx" @click.prevent="cityClicked(city)">{{city.description}}</p>
            </div> -->
            <el-date-picker placeholder="Anytime" v-model="tripDate" type="month" value-format="yyyy-M"></el-date-picker>
            <button type="submit" title="Search">
              <img src="@/assets/svg/search.svg">
            </button>
          </form>
        </div>
      </div>
    </header>
    <article v-for="(list, idx) in listsForDisplay" :key="list.title + idx" :class="'article-' + list.type">
      <component :is="list.type" :title="list.title | countryCodeToName" :trips="list.trips" :filters="list.filters" />
    </article>
    <infinite-loading spinner="waveDots" @infinite="infiniteHandler">
        <div slot="no-more"></div>
        <!-- <div slot="no-results">No results message</div> -->
    </infinite-loading>
  </section>
</template>

<script>
// CMPS:
import infiniteLoading from 'vue-infinite-loading';
import TripList from "@/components/TripList";
import FilterList from "@/components/FilterList";
import _ from 'lodash'

export default {
  name: "home",
  components: {
    TripList,
    FilterList,
    infiniteLoading
  },
  data() {
    return {
      page: 0,
      listsForDisplay: [],
      searchQuery: '',
      tripDate: '',
      throttled: _.throttle(this.searchPlaces, 1000, {leading: false}),
      autocomplete: null,
      tripLists: [
        'trending',
        'recommended',
        ...this.$store.getters.activities
      ],
      filterLists: [
        'activities',
        ...this.$store.getters.countries
      ],
    };
  },
  computed: {
    loggedUser() {
      return this.$store.getters.loggedUser
    },
    searchQueryWithDate() {
      return "/search?q=" + this.searchQuery + "&tripDate=" + this.tripDate
    }
  },
  watch: {
    async loggedUser() {
      if (this.listsForDisplay.recommended)
      this.listsForDisplay.recommended = await this.$store.dispatch({ type: "getRecommendedTrips" });
    }
  },
  methods: {
    search() {
      this.$router.push(this.searchQueryWithDate);
    },
    async getActivityTrips(activity) {
      const activityTrips = await this.$store.dispatch({ type: "getActivityTrips", activity })
      return activityTrips
    },
    async getFiltersForCountry(country) {
      const cities = await this.$store.dispatch({type: 'getCitiesByCountry', country})
      const citiesWithImgs = await this.$store.dispatch( {type: 'getFilterImgs', filterType: 'destinations', filters: cities })
      return citiesWithImgs
    },
    onInput() {      
      this.throttled()
    },
    searchPlaces() {
      this.$store
        .dispatch({ type: "getPlacesAutocomplete", query: this.searchQuery, types: ['geocode'] })
        .then(res => (this.autocomplete = res));
    },
    cityClicked(city) {
      this.searchQuery = city.description
      this.autocomplete = null
    },
    async infiniteHandler($state) {
      console.log('handling')
      let page = this.page
      let filterList
      let tripList
      if (this.page % 2 === 0) { // get filterList
        filterList = this.filterLists[page/2]
        if (filterList === 'activities') {
          filterList = {
            title: filterList,
            filters: await this.$store.dispatch({type: 'getFilterImgs', filterType: 'activities', filters: this.$store.getters.activities}),
            type: 'filterList'
          }
        } else if (filterList) {
          filterList = {
            title: filterList,
            filters: await this.getFiltersForCountry(filterList),
            type: 'filterList'
            }
        } else {
          this.page++
          $state.loaded()
          return
        }
      } else { //get tripList
        tripList = this.tripLists[(page - 1)/2]
        if (tripList === 'recommended') {
          tripList = {
            title: tripList,
            trips: await this.$store.dispatch({ type: "getRecommendedTrips" }),
            type: 'tripList'
            }
        } else if (tripList === 'trending') {
          tripList = {
            title: tripList,
            trips: await this.$store.dispatch({ type: "getTrendingTrips" }),
            type: 'tripList'
          }
        } else if (tripList) { //activities
          tripList = {
            title: tripList,
            trips: await this.getActivityTrips(tripList),
            type: 'tripList'
          }
        }
      }
      const currList = filterList || tripList
      if (currList) {
        this.page++;
        this.listsForDisplay.push(currList);
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
  async created() {
    if (!window.google) {
      await this.$store.dispatch({ type: "connectToGoogle" });
    }
  }
};
</script>
