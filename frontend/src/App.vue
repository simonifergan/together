<template>
  <div id="app" class="app-container">
    <main-header />
    <router-view />
    <upload-image />
  </div>
</template>

<script>
import mainHeader from '@/components/MainHeader'
import UploadImage from '@/components/UploadImage'
export default {
  name: 'home',
  components: {
    mainHeader, UploadImage,
  }
}
</script>

<style lang="scss">

</style>

