<template>
  <section class="home">
    <h2>Home</h2>

    <trip-list />
  </section>
</template>

<script>
// CMPS:
import TripList from '@/components/TripList'

export default {
  name: 'home',
  components: {
    TripList
  }
}
</script>
