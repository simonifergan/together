<template>
  <ul class="notifications">
    <notification
      v-for="notification in notifications"
      :key="notification._id"
      :notification="notification"
    ></notification>
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