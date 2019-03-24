<template>
  <router-link tag="section" :to="'/search?q=' + filter.title" class="filter-preview">
    <div class="filter-preview-img" :src="filter.imgSrc" :style="imgPrev" />
    <h3>{{filter.title}}</h3>
  </router-link>
</template>

<script>
export default {
  name: "filter-preview",
  props: {
    filter: {
      type: Object,
      required: true
    }
  },
  computed: {
      imgPrev() {
          return {backgroundImage: `url(${this.filter.imgSrc})`}
      }
  }
};
</script>