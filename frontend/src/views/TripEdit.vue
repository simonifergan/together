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
      <el-input type="text" v-model="searchQuery" @input="onInput" placeholder="Type a city or a country. How about a new place?"/>
      <ul v-if="autocomplete">
        <li v-for="(city, idx) in autocomplete" :key="idx" @click="chooseCity(city)">
          <h3>{{city.description}}</h3>
        </li>
      </ul>
      <our-super-awesome-map v-if="trip.destinations.countries" :enable="true" v-model="trip.destinations.countries"/>
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
    OurSuperAwesomeMap, ActivityPrefs
  },
  data() {
    return {
      trip: this.$store.getters.emptyTrip,
      searchQuery: "",
      autocomplete: null,
      throttled: _.throttle(this.searchPlaces, 1000, {leading: false})
    };
  },
  methods: {
    async save() {
      const tripId = await this.$store.dispatch({ type: "saveTrip", trip: this.trip })
      if (tripId) this.$router.push(`/trip/${tripId}`);
      else this.$router.push(this.$route.path + '#login');
    },
    onInput() {
      console.log('throttled');
      
      this.throttled()
    },
    searchPlaces() {
      console.log('searching places');
      
      this.$store
        .dispatch({ type: "getPlacesAutocomplete", query: this.searchQuery, types: ['(cities)'] })
        .then(res => (this.autocomplete = res));
    },
    async chooseCity(city) {
      console.log('chooseCity: ', city);
      
      if (this.trip.destinations.cities.indexOf(city.description) !== -1) return
      const countryCode = await this.$store.dispatch({type: 'getCountryCode', placeId: city.place_id})
      console.log('countryCode: ', countryCode);
      this.trip.destinations.cities.push(city.description)
      if (this.trip.destinations.countries.indexOf(countryCode) === -1) this.trip.destinations.countries.push(countryCode)
    }
  },
  computed: {
    user() {
      return this.$store.getters.loggedUser;
    }
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
