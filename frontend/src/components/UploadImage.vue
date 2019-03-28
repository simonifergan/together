<template>
  <section class="upload-image">
    <form @submit.prevent="uploadImage">
      <img :src="currentProfile" id="imgPreview"/>
      <input type="file" @change="processImage">
      <!-- <button type="submit">Upload</button> -->
    </form>
  </section>
</template>

<script>

export default {
  props: {
    profilePic: {
      type: String,
      required: false,
    }
  },
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
       this.$emit("setProfilePic", this.img);
    },
    uploadImage() {
      ImageService.uploadImage(this.img).then(url => {
        this.$emit("setProfilePic", url);
      });
    }
  },
  computed: {
    currentProfile() {
      if (!this.img) return this.profilePic;
    }
  }
};
</script>

<style>
</style>
