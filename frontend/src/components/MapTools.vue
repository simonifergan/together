<template>
    <section class="map-tools">
        <button @click.stop="zoomIn"><i class="fas fa-plus"></i></button>
        <button @click.stop="zoomOut"><i class="fas fa-minus"></i></button>
        <button @click.stop="panUp"><i class="fas fa-chevron-up"></i></button>
        <button @click.stop="panLeft"><i class="fas fa-chevron-left"></i></button>
        <button @click.stop="panDown"><i class="fas fa-chevron-down"></i></button>
        <button @click.stop="panRight"><i class="fas fa-chevron-right"></i></button>
    </section>
</template>

<script>
// CMPS
import Notification from "@/components/Notification";

export default {
  props: {

  },
  components: {

  },
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {
      zoomIn() {
        this.$emit('zoomIn')
      },
      zoomOut() {
        this.$emit('zoomOut')
      },
      panUp() {
        this.$emit('panUp')
      },
      panLeft() {
        this.$emit('panLeft')
      },
      panDown() {
          this.$emit('panDown')
      },
      panRight() {
          this.$emit('panRight')
      }
  }
};
</script>