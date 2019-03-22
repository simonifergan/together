<template>
  <ul class="notifications">
    <notification
      v-for="notification in notifications"
      :notification="notification"
      :key="notification._id"/>
  </ul>
</template>

<script>
// CMPS
import Notification from "@/components/Notification";

export default {
  props: {
    notifications: {
      type: Array,
      required: true
    }
  },
  components: {
    Notification
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>