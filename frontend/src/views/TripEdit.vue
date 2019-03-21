<template>
  <section class="trip-edit" v-if="trip">
    <h1>{{(trip && trip._id)? 'Edit Trip' : 'Add Trip'}}</h1>
      {{trip.tripStart}}
    <el-input type="textarea" :rows="5" v-model="trip.desc" class="trip-desc"/>
    <!-- <el-date-picker type="month" v-model="trip.tripStart" value-format="MMMM/yyyy" placeholder="Pick a month"/> -->
    <el-date-picker
      type="monthrange"
      range-separator="To"
      start-placeholder="Start month"
      end-placeholder="End month">
    </el-date-picker>


  </section>
</template>

<script>
// SERVICE
import TripService from "@/services/TripService";

export default {
  name: "trip-edit",
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