<template>
  <ul class="filter-list">
    <div class="top-container">
      <h2>{{title}}</h2>
      <div class="filters-container">
        <button @click="moveSlide('-')" :style="isHiddenLeft">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="inner-container">
          <ul class="filter-previews" :style="pagination" @touchstart="startDrag" @touchmove="drag" @touchend="stopDrag">
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
      page: 0,
      touchPos: null,
      didDrag: false,
      startPage: null
    };
  },
  computed: {
    slidePos() {
      return `${this.page * this.itemWidth * -1}px`;
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
      if (this.page === this.maxPage) return {opacity: '0'}
      return {opacity: '1'}
    },
    isHiddenLeft() {
      if (!this.page) return {opacity: '0'}
      else return {opacity: '1'}
    },
    maxPage() {      
      return this.filters.length - this.itemsPerPage
    }
  },
  methods: {
    moveSlide(diff) {
      if (diff === "+" && this.page < this.maxPage) {
        this.page = this.page + 1;
      } else if (diff === "-" && this.page > 0) {
        this.page = this.page - 1;
      }
      return;
    },
    startDrag(ev) {
      this.touchPos = ev.touches[0].clientX
      this.startPage = this.page
    },
    drag(ev) {
      ev.preventDefault()
      
      const diff = (ev.touches[0].clientX - this.touchPos)
      if (diff > 10) this.didDrag = true
      this.page = this.startPage - diff/this.itemWidth
      console.log(this.page);
    },
    stopDrag() {
      if (this.page > this.maxPage) this.page = this.maxPage
      else if (this.page < 0) this.page = 0
      else this.page = Math.round(this.page)
      this.didDrag = false
    },
    beforeRouteLeave (to, from, next) {
      if (!didDrag) {
        next()
      } else {
        next(false)
      }
    }
  }
};
</script>
