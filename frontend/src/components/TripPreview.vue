<template>
  <section class="trip-preview">
    <!-- {{trip}} -->
    <img src="https://via.placeholder.com/150" alt="">
    <p>username: {{trip.userId}}</p>
    <p>{{dests}}</p>
    <p>{{trip.startsAt.month}} {{trip.startsAt.year}}, {{trip.duration[0]}}</p>
  </section>
</template>

<script>
export default {
  name: "trip-preview",
  props: {
    trip: {
      type: Object,
      required: true
    }
  },
  computed: {
    dests() {
      return this.trip.destinations[0].continent;
    }
  }
};
</script>
