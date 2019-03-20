<template>
  <section class="trip-list">
    <h2>Trips:</h2>

    <trip-preview v-for="trip in trips" :key="trip._id" :trip="trip" />
  </section>
</template>

<script>
// CMPS:
import TripPreview from '@/components/TripPreview'

export default {
  name: 'trip-list',
  props: {
    trips: Array,
    required: true
  },
  components: {
    TripPreview
  }
}
</script>
