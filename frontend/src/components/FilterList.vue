<template>
  <ul class="filter-list">
    <h2>Hot Locations</h2>
    <div class="filter-previews">
      <filter-preview v-for="filter in filtersWithImages" :key="filter.title" :filter="filter"/>
    </div>
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
    this.$store.dispatch({
      type: "getFilterImgs",
      filters: this.filters,
      filterType: this.type
    });
  },
  watch: {
    filters(newVal) {
      this.$store.dispatch({
        type: "getFilterImgs",
        filters: newVal,
        filterType: this.type
      });
    }
  }
};
</script>
