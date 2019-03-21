<template>
    <section class="search-page">
        <trip-list :trips="trips" title="Search Results"></trip-list>
    </section>
</template>

<script>
    import TripList from "@/components/TripList";
export default {
    name: 'searchResults',
    components: {
        TripList
    },
    computed: {
        trips() {
            return this.$store.getters.trips
        },
        searchQuery() {
            return this.$route.query.q
        }
    },
    created() {
        console.log(this.searchQuery);
                
        this.$store.dispatch({type: 'searchTrips', searchQuery: this.searchQuery})
    }
}
</script>

<style>

</style>
