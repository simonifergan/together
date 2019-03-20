<template>
  <section class="upload-image">
    <form @submit.prevent="uploadImage">
      <input type="file" @change="processImage" />
      <button type="submit">Upload</button>
    </form>
  </section>
</template>

<script>
import ImageService from "@/services/ImageService.js";

export default {
  data() {
    return {
        img: null,
    };
  },
  methods: {
      processImage(event) {
        this.img = event.target.files[0];
      },
    uploadImage() {
      ImageService.uploadImage(this.img)
        .then(url => {
            console.log(url);
        });
    }
  }
};
</script>

<style>
</style>
