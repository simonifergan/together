<template>
    <section class="pending-list" v-if="pendingUsers">
      <h1>Pending</h1>
        <div 
            v-for="pendingUser in pendingUsers"
            :key="pendingUser._id"
            class="pending-user">
              {{pendingUser}}
        </div>
    </section>
</template>

<script>
export default {
  props: {
    pendingUsers: {
      type: Array,
      required: true
    }
  },
  computed: {
  }
}
</script>
