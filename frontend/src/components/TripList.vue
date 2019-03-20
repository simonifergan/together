<template>
  <section class="trip-list">
    <h2>{{title}}</h2>

    <trip-preview v-for="trip in trips" :key="trip._id" :trip="trip" />
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
  components: {
    TripPreview
  }
}
</script>
