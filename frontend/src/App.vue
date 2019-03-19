<template>
  <div id="app">
    <main-header />
    <router-view />
  </div>
</template>

<script>
import mainHeader from '@/components/MainHeader'
export default {
  name: 'home',
  components: {
    mainHeader
  }
}
</script>

<style lang="scss">

</style>

