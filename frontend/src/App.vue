<template>
  <div id="app" class="app-container">
    <main-header />
    <router-view />
  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader';

export default {
  name: 'home',
  components: {
    MainHeader, 
    // UploadImage
  },
  methods: {
    gotMsg(msg) {
      console.log('I am in frontend in app compoent and got this from socket', msg);
    } 
  },
  created() {
    this.$store.dispatch({type: 'socketSendMsg', msg: 'Hi there, I am connected?'});
    this.$store.dispatch({type: 'socketSubscribe', eventName: 'joinChat', cb: this.gotMsg})
  }
}
</script>

<style lang="scss">

</style>