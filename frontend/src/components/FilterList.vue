<template>
  <ul class="filter-list">
    <h2>{{title}}</h2>
    <div class="filters-container">
      <button @click="moveSlide('-')"><i class="fas fa-chevron-left"></i></button>
      <div class="inner-container">
        <ul class="filter-previews" :style="pagination">
          <filter-preview v-for="filter in filters" :key="filter.title" :filter="filter"/>
        </ul>
      </div>
      <button @click="moveSlide('+')"><i class="fas fa-chevron-right"></i></button>
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
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      page: 0,
      itemWidth: 220
    };
  },
  computed: {
    slidePos() {
      return `-${this.page * this.itemWidth}px`;
    },
    pagination() {
      return { left: this.slidePos };
    },
    itemsPerPage() {
      return 5; // TODO : fit to client width
    }
  },
  methods: {
    moveSlide(diff) {
      if (
        diff === "+" &&
        !(this.page === this.filters.length - this.itemsPerPage)
      ) {
        this.page = this.page + 1;
      } else if (diff === "-" && this.page > 0) {
        this.page = this.page - 1;
      }
      return;
    }
  },
};
</script>
