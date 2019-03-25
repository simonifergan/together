<template>
  <ul class="filter-list">
    <h2>{{(type === 'destinations')? 'Hot locations' : 'Recommended activities'}}</h2>
    <ul class="filter-previews">
      <filter-preview v-for="filter in filtersWithImages" :key="filter.title" :filter="filter"/>
    </ul>
  </ul>
</template>

<script>
// CMPS:

import FilterPreview from "./FilterPreview.vue";
export default {
  name: "filter-list",
  components: { FilterPreview },
  props: {
    filters: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    filtersWithImages() {
      return this.type === "activities"
        ? this.$store.getters.activityFilters
        : this.$store.getters.destinationFilters;
    }
  },
  async created() {
    if (this.filtersWithImages) return
    this.$store.dispatch({
      type: "getFilterImgs",
      filters: this.filters,
      filterType: this.type
    });
  },
};
</script>
