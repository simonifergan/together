<template>
  <section class="user-details">
    <div class="top-fold">
      <img src="https://api.adorable.io/avatars/285/abott@adorable.png" class="user-avatar">
      <h2>{{user.firstname}}&nbsp;{{user.lastname}}</h2>
    </div>
  </section>
</template>

<script>
export default {
    props: ['user']
};
</script>

<style>
</style>
