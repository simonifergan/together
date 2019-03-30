<template>
  <section class="trip-edit" v-if="trip">
    <!-- <pre>
    {{trip}}
    </pre> -->
    <h1>{{(trip && trip._id)? 'Tailor the experience!' : 'Customize a new experience'}}</h1>
    <form @submit.prevent="save">
       <h2>When would you like to travel?</h2>
      <div class="date-picker">
        <label>
          <span>From:</span>
          <el-date-picker placeholder="Year-Month" v-model="trip.startsAt" type="month" value-format="yyyy-M"></el-date-picker>
        </label>
        <label>
          <span>For how long?</span>
          <!-- <el-date-picker v-model="trip.duration" type="month" value-format="yyyy-MM"></el-date-picker> -->
          <el-select v-model="trip.duration" clearable placeholder="Select estimated duration">
            <el-option
              label="A few days"
              value="few days">
            </el-option>
            <el-option
              label="A few weeks"
              value="few weeks">
            </el-option>
            <el-option
              label="A few months"
              value="few months">
            </el-option>
          </el-select>
        </label>
      </div>
      <h2>Where would you like to travel to?</h2>
      <div class="autocomplete-container">
        <el-input type="text" v-model="searchQuery" @input="onInput" placeholder="Type a city or a country. How about a new place?"/>
        <transition name="fade" mode="out-in">
          <ul v-if="autocomplete" class="autocomplete">
            <p>Click on a city below to choose it</p>
            <li :title="city.description" v-for="(city, idx) in autocomplete" :key="idx" @click="chooseCity(city)">
              <div>{{city.description}}</div>
            </li>
          </ul>
        </transition>
      </div>
      <div class="selected-places">
        <ul>
          <h4>Selected cities:</h4>
          <transition-group name="list" tag="div" class="selection-container">
            <li v-for="city in trip.destinations.cities" :key="city">
              {{city | cityWithCountryToCity}}
              <button :title="'Deselect ' + city | cityWithCountryToCity" type="button" @click="deleteCity(city)"><i class="fas fa-times"></i></button>
            </li>
          </transition-group>
        </ul>
        <ul>
          <h4>Selected countries:</h4>
          <transition-group name="list" tag="div" class="selection-container">
            <li v-for="country in trip.destinations.countries" :key="country">
              {{country | countryCodeToName}}
              <button :title="'Deselect ' + country | countryCodeToName" type="button" @click="deleteCountry(country)"><i class="fas fa-times"></i></button>
            </li>
          </transition-group>
        </ul>
      </div>
      <our-super-awesome-map v-if="trip.destinations.countries && isDesktop" :enable="true" v-model="trip.destinations.countries"/>
        <h2>Give your trip a title:</h2>
        <el-input
          placeholder="Type your trip's title. e.g.: 'My trip to Lapland in 3 months!'"
          class="trip-title"
          type="text"
          v-model="trip.title"
        />
        <h2>How many persons would you like to travel with?</h2>
        <el-input placeholder="Remember, the more the merrier." min="1" class="trip-size" type="number" v-model.number="trip.groupSize" />
        <h2>Tell everyone more about your plans:</h2>
        <el-input type="textarea" :rows="5" v-model="trip.desc" class="trip-desc" 
          placeholder="The more you share about yourself and your vision for the trip, the more likely that others would want to join."
        />
        <h2>What activities are planned for your trip? <span>(highly recommended)</span></h2>
        <activity-prefs v-model="trip.activities"/>

     
      <button class="btn-share-trip" type="submit">Share</button>
    </form>
  </section>
</template>

<script>
// CMPS
import OurSuperAwesomeMap from "@/components/OurSuperAwesomeMap.vue";
import ActivityPrefs from "@/components/ActivityPrefs";
import _ from 'lodash';

export default {
  name: "trip-edit",
  components: {
    OurSuperAwesomeMap, 
    ActivityPrefs
  },
  data() {
    return {
      trip: this.$store.getters.emptyTrip,
      searchQuery: '',
      autocomplete: null,
      throttled: _.throttle(this.searchPlaces, 1000, {leading: false})
    };
  },
  methods: {
    async save() {
      try {
        const tripId = await this.$store.dispatch({ type: "saveTrip", trip: this.trip })
        if (tripId) this.$router.push(`/trip/${tripId}`);
        else this.$router.push(this.$route.path + '#login');
      } catch(err) {
        console.log('Trip edit err', err);
      }
    },
    onInput() {
      console.log('throttled');
      if (!this.searchQuery) {
        this.autocomplete = null
        this.throttled.cancel()
        return
      }
      this.throttled()
    },
    searchPlaces() {
      console.log('searching places');
      
      this.$store
        .dispatch({ type: "getPlacesAutocomplete", query: this.searchQuery, types: ['(cities)'] })
        .then(res => (this.autocomplete = res));
    },
    async chooseCity(city) {
      this.autocomplete = null
      const countryCode = await this.$store.dispatch({type: 'getCountryCode', placeId: city.place_id})
      if (this.trip.destinations.countries.indexOf(countryCode) === -1) this.trip.destinations.countries.push(countryCode)
      if (this.trip.destinations.cities.indexOf(city.description) !== -1) return
      this.trip.destinations.cities.push(city.description)
    },
    deleteCity(city) {
      const cityIdx = this.trip.destinations.cities.findIndex(currCity => currCity === city)
      this.trip.destinations.cities.splice(cityIdx, 1)
    },
    deleteCountry(country) {
      const countryIdx = this.trip.destinations.countries.findIndex(currCountry => currCountry === country)
      this.trip.destinations.countries.splice(countryIdx, 1)
    }
  },
  computed: {
    user() {
      return this.$store.getters.loggedUser;
    },
    isDesktop() {
      return window.matchMedia("(min-width: 750px)").matches;
    },
  
  },
  async created() {
    const { tripId } = this.$route.params;
    if (tripId) {
      await this.$store.dispatch({ type: "loadTrip", tripId })
      if (this.$store.getters.tripToEdit.userId !== this.user._id) this.$router.push('/');
      else this.trip = this.$store.getters.tripToEdit;
    }
    if (!window.google) {
      this.$store.dispatch({ type: "connectToGoogle" });
    }
  },
  destroy() {}
};
</script>
