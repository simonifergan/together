<template>
  <section class="trip-edit" v-if="trip">
    <form submit.prevent="save">
      {{trip}}
      <h1>{{(trip && trip._id)? 'Edit your trip details:' : 'Add a new trip:'}}</h1>
      {{trip.tripStart}}
      <h2>Give your trip a title:</h2>
      <input v-model="trip.title" />
      <h2>How many persons would you like to travel with?</h2>
      <input v-model="trip.groupSize" />
      <h2>Tell everyone more about your plans:</h2>
      <el-input type="textarea" :rows="5" v-model="trip.desc" class="trip-desc"/>
      <h2>When would you like to travel?</h2>
      <div class="date-picker">
        <label><span>From:</span>
        <el-date-picker
          v-model="trip.startsAt"
          type="month"
          value-format="yyyy-M"
        ></el-date-picker>
        </label>
        <label>
          <span>To:</span>
        <el-date-picker
          v-model="trip.duration"
          type="month"
          value-format="yyyy-MM"
        ></el-date-picker>
        </label>
      </div>
      <h2>Where would you like to travel to?</h2>
      <div class="awesome-map-container">
        <our-super-awesome-map :value="trip.destinations" />
      </div>
    </form>
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
