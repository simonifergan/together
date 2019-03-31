<template>
  <section class="search-page">
    <h2>
      <span v-if="searchQuery || tripDate">Showing results for:&nbsp;</span>
      <span v-if="searchQuery && tripDate">"{{searchQuery}} from {{tripDate}}"</span>
      <span v-else-if="searchQuery">"{{searchQuery}}"</span>
      <span v-else-if="tripDate">"{{tripDate}}"</span>
      <span v-if="!searchQuery && !tripDate">Browse all possibilities</span>
    </h2>
    <article v-if="results" class="trips-container">
      <trip-preview v-for="(trip, idx) in results" :key="trip._id + idx" :trip="trip" />
    </article>
  </section>
</template>

<script>
// CMPS
import TripPreview from "@/components/TripPreview";

export default {
  name: "searchResults",
  components: {
    TripPreview,
  },
  computed: {
    results() {
      return this.$store.getters.searchResults;
    },
    searchQuery() {
      return this.$route.query.q;
    },
    tripDate() {
      return this.$route.query.tripDate;
    },
    getNotifications() {
      return this.$store.getters.notifications;
    }
  },
  created() {
    this.$store.dispatch({
      type: 'searchTrips',
      searchQuery: this.searchQuery,
      tripDate: this.tripDate
    });
  },
};
</script>

<style>
</style>
