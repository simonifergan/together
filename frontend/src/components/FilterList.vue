<template>
  <ul class="filter-list">
    <h2>{{(type === 'destinations')? 'Hot locations' : 'Recommended activities'}}</h2>
    <div class="filters-container">
      <button @click="moveSlide('-')"><i class="fas fa-chevron-left"></i></button>
      <div class="inner-container">
        <ul class="filter-previews" :style="pagination">
          <filter-preview v-for="filter in filtersWithImages" :key="filter.title" :filter="filter"/>
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
    type: {
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
    filtersWithImages() {
      return this.type === "activities"
        ? this.$store.getters.activityFilters
        : this.$store.getters.destinationFilters.filter(item => item.imgSrc);
    },
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
        !(this.page === this.filtersWithImages.length - this.itemsPerPage)
      ) {
        this.page = this.page + 1;
      } else if (diff === "-" && this.page > 0) {
        this.page = this.page - 1;
      }
      return;
    }
  },
  async created() {
    if (this.filtersWithImages.length) return
    this.$store.dispatch({
      type: "getFilterImgs",
      filters: this.filters,
      filterType: this.type
    });
  },
};
</script>
