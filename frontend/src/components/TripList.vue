<template>
  <section class="trip-list" v-if="!isEmpty">
    <div class="trip-container">
      <h2>{{title}}</h2>
      <ul class="trip-items">
        <trip-preview v-for="trip in tripsToDisplay" :key="trip._id" :trip="trip" />
      </ul>
      <router-link title="See all available trips" class="show-all" tag="div" to="/search?q=">
        Show all
      </router-link>
    </div>
  </section>
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
    isEmpty() {
      return this.trips.length === 0
    },
    tripsToDisplay() {
      let numOfTrip = this.numOfTrip;
      return this.trips.slice(0, numOfTrip);
    },
    numOfTrip() {
      if (window.matchMedia("(min-width: 1100px)").matches) return 4;
      else if (window.matchMedia("(min-width: 1000px)").matches) return 3;
      else if (window.matchMedia("(min-width: 730px)").matches) return 2;
      else return 4;
    }
  },
  components: {
    TripPreview
  }
}
</script>
