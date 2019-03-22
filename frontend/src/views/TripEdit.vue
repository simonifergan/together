<template>
  <section class="trip-edit" v-if="trip">
    <h1>{{(trip && trip._id)? 'Edit Trip' : 'Add Trip'}}</h1>
    {{trip.tripStart}}
    <el-input type="textarea" :rows="5" v-model="trip.desc" class="trip-desc"/>
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
  </section>
</template>

<script>
// SERVICE
import TripService from "@/services/TripService";

export default {
  name: "trip-edit",
  data() {
    return {
      
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