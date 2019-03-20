<template>
  <div id="app" class="app-container">
    <main-header />
    <router-view />
    <!-- <upload-image /> -->
  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader'
import UploadImage from '@/components/UploadImage'
export default {
  name: 'home',
  components: {
    MainHeader,
  }
}
</script>

<style lang="scss">

</style>

