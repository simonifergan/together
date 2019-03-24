<template>
  <section class="trip-list">
    <h2>{{filter.value}}</h2>
    <div class="trip-items">
      <trip-preview v-for="filter in category" :key="filter.value" :filter="filter" />
    </div>
  </section>
</template>

<script>
// CMPS:
import TripPreview from '@/components/TripPreview'

export default {
  name: 'filter-list',
  props: {
    category: {
      type: Array,
      required: true
    }
  }
}
</script>
