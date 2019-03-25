<template>
  <section class="search-page">
    <trip-list :trips="trips" title="Search Results"></trip-list>
    <notification-list :notifications="getNotifications"/>
  </section>
</template>

<script>
// CMPS
import TripList from "@/components/TripList";
import NotificationList from "@/components/NotificationList";

export default {
  name: "searchResults",
  components: {
    TripList,
    NotificationList
  },
  computed: {
    trips() {
      return this.$store.getters.trips;
    },
    searchQuery() {
      return this.$route.query.q;
    },
    getNotifications() {
      return this.$store.getters.notifications;
    }
  },
  created() {
    this.$store.dispatch({
      type: 'searchTrips',
      searchQuery: this.searchQuery
    });
  }
};
</script>

<style>
</style>
