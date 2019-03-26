<template>
  <section class="trip-edit" v-if="trip">
    <pre>
    {{trip}}
    </pre>
    <h1>{{(trip && trip._id)? 'Edit your trip details' : 'Post a new trip'}}</h1>
    <form @submit.prevent="save">
      <label>
        <h2>Give your trip a title:</h2>
        <input
          placeholder="Type your trip's title. e.g.: 'My trip to Lapland in 3 months!'"
          class="edit-input trip-title"
          type="text"
          v-model="trip.title"
        >
      </label>
      <label>
        <h2>How many persons would you like to travel with?</h2>
        <input class="edit-input trip-size" type="number" v-model.number="trip.groupSize">
      </label>
      <label>
        <h2>Tell everyone more about your plans:</h2>
        <el-input type="textarea" :rows="5" v-model="trip.desc" class="trip-desc"/>
      </label>
      <h2>When would you like to travel?</h2>
      <div class="date-picker">
        <label>
          <span>From:</span>
          <el-date-picker v-model="trip.startsAt" type="month" value-format="yyyy-M"></el-date-picker>
        </label>
        <label>
          <span>To:</span>
          <el-date-picker v-model="trip.duration" type="month" value-format="yyyy-MM"></el-date-picker>
        </label>
      </div>
      <h2>Where would you like to travel to?</h2>
      <el-input v-model="searchQuery"/>
      <ul v-if="autocomplete">
        <li v-for="(city, idx) in autocomplete" :key="idx" @click="chooseCity(city)">
          <h3>{{city.description}}</h3>
        </li>
      </ul>
      <our-super-awesome-map :enable="true" v-model="trip.destinations.countryCodes"/>
      <button type="submit">Post</button>
    </form>
    <button @click="searchPlaces">search</button>
  </section>
</template>

<script>
// CMPS
import OurSuperAwesomeMap from "@/components/OurSuperAwesomeMap.vue";

export default {
  name: "trip-edit",
  components: {
    OurSuperAwesomeMap
  },
  data() {
    return {
      trip: this.$store.getters.emptyTrip,
      searchQuery: "",
      autocomplete: null
    };
  },
  methods: {
    save() {
      this.$store
        .dispatch({ type: "saveTrip", trip: this.trip })
        .then(tripId => {
          this.$router.push(`/trip/${tripId}`);
        });
    },
    searchPlaces() {
      this.$store
        .dispatch({ type: "getPlacesAutocomplete", query: this.searchQuery })
        .then(res => (this.autocomplete = res));
    },
    async chooseCity(city) {
      const countryCode = await this.$store.dispatch({type: 'getCountryCode', placeId: city.place_id})
      this.trip.destinations.cities.push(city.name)
      this.trip.destinations.countryCodes.push(countryCode)
    }
  },
  created() {
    const { tripId } = this.$route.params;
    if (tripId) {
      this.$store
        .dispatch({ type: "loadTrip", tripId })
        .then(() => this.trip = this.$store.getters.tripToEdit)
    }
    if (!window.google) {
      this.$store.dispatch({ type: "connectToGoogle" });
    }
  },
  destroy() {}
};
</script>
