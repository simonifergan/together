<template>
  <section class="upload-image">
    <form @submit.prevent="uploadImage">
      <img id="imgPreview"/>
      <input type="file" @change="processImage">
      <button type="submit">Upload</button>
    </form>
  </section>
</template>

<script>
import ImageService from "@/services/ImageService.js";

export default {
  data() {
    return {
      previewImg: null,
      img: null
    };
  },
  methods: {
    processImage(event) {
      this.img = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function() {
        var output = document.querySelector('#imgPreview');
        output.src = reader.result;
      };
      reader.readAsDataURL(this.img);
    },
    uploadImage() {
      ImageService.uploadImage(this.img).then(url => {
        this.$emit("setProfilePic", url);
      });
    }
  }
};
</script>

<style>
</style>
