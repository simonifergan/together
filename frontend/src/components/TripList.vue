<template>
  <section class="trip-list">
    <h2>Trips:</h2>

    <trip-preview />
  </section>
</template>

<script>
// CMPS:
import TripPreview from '@/components/TripPreview'

export default {
  name: 'trip-list',
  components: {
    TripPreview
  }
}
</script>
