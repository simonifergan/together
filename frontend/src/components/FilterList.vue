<template>
  <ul class="filter-list">
    <div class="top-container">
      <h2>{{title}}</h2>
      <div class="filters-container">
        <button @click="moveSlide('-')" :style="isHiddenLeft">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="inner-container">
          <ul class="filter-previews" :style="pagination">
            <filter-preview v-for="filter in filters" :key="filter.title" :filter="filter"/>
          </ul>
        </div>
        <button @click="moveSlide('+')" :style="isHiddenRight">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
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
      page: 0
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
      if (window.matchMedia("(min-width: 1100px)").matches) return 5;
      else if (window.matchMedia("(min-width: 1000px)").matches) return 4;
      else if (window.matchMedia("(min-width: 730px)").matches) return 3;
      else return 2;
    },
    itemWidth() {
      return 220;
    },
    isHiddenRight() {
      if (this.page === this.filters.length - this.itemsPerPage) return {opacity: '0'}
      return {opacity: '1'}
    },
    isHiddenLeft() {
      if (!this.page) return {opacity: '0'}
      else return {opacity: '1'}
    }
  },
  methods: {
    moveSlide(diff) {
      if (diff === "+" && this.page < this.filters.length - this.itemsPerPage) {
        this.page = this.page + 1;
      } else if (diff === "-" && this.page > 0) {
        this.page = this.page - 1;
      }
      return;
    }
  }
};
</script>
