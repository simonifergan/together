<template>
  <div id="app" class="app-container">
    <main-header />
    <router-view />
    <chat 
      v-for="chat in activeChats" :key="chat._id" :chatId="chat"
    />
    <chat 
    />
  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader';
import Chat from '@/components/Chat';

export default {
  name: 'home',
  components: {
    MainHeader, Chat
    // UploadImage
  },
  computed: {
    activeChats() {
      return this.$store.getters.activeChats;
    }
  },
  created() {
    this.$store.dispatch({type: 'socketConnect'});
  }

}
</script>

<style lang="scss">

</style>