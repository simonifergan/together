<template>
  <router-link tag="section" :to="'/trip/' + trip._id" class="trip-preview">
    <!-- {{trip}} -->
    <div class="profile-img" :style="profilPic"></div>
    <p>{{trip.user.firstname}} {{trip.user.lastname}}</p>
    <p>{{dests}}</p>
    <p>{{trip.startsAt.month}} {{trip.startsAt.year}}, {{trip.duration[0]}}</p>
  </router-link>
</template>

<script>
export default {
  name: "trip-preview",
  props: {
    trip: {
      type: Object,
      required: true
    }
  },
  computed: {
    dests() {
      return this.trip.destinations[0].continent;
    },
    profilPic() {
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    }
  }
};
</script>

