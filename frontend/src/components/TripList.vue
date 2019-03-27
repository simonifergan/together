<template>
  <ul class="trip-list">
    <div class="trip-container">
      <h2>{{title}}</h2>
      <div class="trip-items">
        <trip-preview v-for="trip in tripsToDisplay" :key="trip._id" :trip="trip" />
      </div>
      <router-link title="See all available trips" class="show-all" tag="div" to="/search?q=">Show all</router-link>
    </div>
  </ul>
</template>

<script>
// CMPS:
import TripPreview from '@/components/TripPreview'

export default {
  name: 'trip-list',
  props: {
    trips: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  computed: {
    tripsToDisplay() {
      return this.trips.slice(0,4);
    }
  },
  components: {
    TripPreview
  }
}
</script>
