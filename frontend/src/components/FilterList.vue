<template>
  <section class="filter-list">
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
  </section>
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
      startPage: null,
      transitionPrm: null,
      stopScrolling: false,
      timeout: null
    };
  },
  computed: {
    slidePos() {
      return `${this.page * this.itemWidth * -1}px`;
    },
    pagination() {
      return { transform: `translateX(${this.slidePos})` };
    },
    itemsPerPage() {
      if (window.matchMedia("(min-width: 1100px)").matches) return 5;
      else if (window.matchMedia("(min-width: 1000px)").matches) return 4;
      else if (window.matchMedia("(min-width: 730px)").matches) return 3;
      else return 2;
    },
    itemWidth() {
      return (window.matchMedia("(min-width: 500px)").matches) ? 220 : 130
    },
    isHiddenRight() {
      if (this.page > this.maxPage - 1) return {opacity: '0'}
      return {opacity: '1'}
    },
    isHiddenLeft() {
      if (this.page < 1) return {opacity: '0'}
      else return {opacity: '1'}
    },
    maxPage() {
      let diff = this.filters.length - this.itemsPerPage
      return (diff >= 0) ? diff : 0
    }
  },
  methods: {
    async moveSlide(diff) {
      await this.transitionPrm
      if (diff === "+" && this.page <= this.maxPage - 1) {
        this.animateScroll(this.page, this.page + 1)
      } else if (diff === "-" && this.page > 0) {
        this.animateScroll(this.page, this.page - 1)
      }
      return;
    },
    startDrag(ev) {
      clearTimeout(this.timeout)
      this.stopScrolling = true
      this.touchPos = ev.touches[0].clientX
      this.startPage = this.page
    },
    async drag(ev) {
      ev.preventDefault()
      const diff = (ev.touches[0].clientX - this.touchPos)
      if (diff > 10) this.didDrag = true
      this.page = this.startPage - diff/this.itemWidth
    },
    stopDrag() {
      let setPage
      if (this.page > this.maxPage) setPage = this.maxPage
      else if (this.page < 0) setPage = 0
      else setPage = Math.round(this.page)
      this.animateScroll(this.page, setPage)
      this.didDrag = false
      this.touchPos = null
      this.startPage = null
    },
    async animateScroll(startPos, endPos) {
      this.stopScrolling = false
      this.transitionPrm = new Promise(async (res, rej) => {
        let i = 0
        for (let i = 0; i < 1; i+= 0.015) {
          this.page = endPos - (endPos - startPos)*(1 - (Math.sqrt(1 - (i-1)**2)))
          await new Promise((timeout, rej) => {
            this.timeout = setTimeout(timeout, 6)
          })
          if (this.stopScrolling) {
            res()
            break;
          }
        }
        this.page = endPos
        res()
      })
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
