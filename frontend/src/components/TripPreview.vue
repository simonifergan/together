<template>
  <router-link tag="section" :to="'/trip/' + trip._id" class="trip-preview">
    <!-- {{trip}} -->
    <img v-if="trip.user" :src="trip.user.profilePic" alt="">
    <p>{{trip.userId}}</p>
    <p>{{dests}}</p>
    <p>{{trip.startsAt.month}} {{trip.startsAt.year}}, {{trip.duration[0]}}</p>
  </router-link>
</template>

<script>
export default {
  name: "trip-preview",
  props: {
    trip: {
      type: Object,
      required: true
    },
  },
  computed: {
    dests() {
      return this.trip.destinations[0].continent;
    }
  }
};
</script>
