<template>
  <section class="trip-preview">
    <h2>trip-preview-</h2>
    <p>{{trip}}</p>
  </section>
</template>

<script>
export default {
  name: 'trip-preview',
  props: {
    trip: Object,
    required: true
  },
  components: {
    
  }
}
</script>
