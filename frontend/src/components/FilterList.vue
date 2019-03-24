<template>
  <section class="filter-list">
    {{filters}}
    {{type}}
    <div v-for="filter in filtersWithImages" :key="filter.name">
      <h2>{{filter.title}}</h2>
      <img :src="filter.imgSrc">
    </div>
  </section>
</template>

<script>
// CMPS:

export default {
  name: "filter-list",
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
  }
};
</script>
