<template>
  <section class="trip-edit" v-if="trip">
    <h1>{{(trip && trip._id)? 'Edit Trip' : 'Add Trip'}}</h1>
    {{trip.tripStart}}
    <h2>Give your trip a title:</h2>
    <input />
    <h2>Tell everyone more about your plans:</h2>
    <el-input type="textarea" :rows="5" v-model="trip.desc" class="trip-desc"/>
    <h2>When would you like to travel?</h2>
    <div class="date-picker">
      <label><span>From:</span>
      <el-date-picker
        v-model="startsAt"
        type="month"
        value-format="yyyy-MMMM"
      ></el-date-picker>
      </label>
      <label>
        <span>To:</span>
      <el-date-picker
        v-model="duration"
        type="month"
        value-format="yyyy-MMMM"
      ></el-date-picker>
      </label>
    </div>
    <h2>Where would you like to travel to?</h2>
    <div class="awesome-map-container">
      {{selectedCountries}};
      <our-super-awesome-map :value="selectedCountries" />
    </div>
  </section>
</template>

<script>
// SERVICE
import TripService from "@/services/TripService";

// CMPS
import OurSuperAwesomeMap from '@/components/OurSuperAwesomeMap.vue';

export default {
  name: "trip-edit",
  components: {
    OurSuperAwesomeMap
  },
  data() {
    return {
      selectedCountries: [],
      startsAt: '',
      duration: '',
      trip: this.$store.getters.emptyTrip
    };
  },
  created() {
    const { tripId } = this.$route.params;
    if (tripId) {
      this.$store
        .dispatch({ type: "loadTrip", tripId })
        .then(() => (this.trip = this.$store.getters.tripToEdit));
    }
  },
  destroy() {}
};
</script>
