<template>
  <router-link tag="section" :to="'/trip/' + trip._id" class="trip-preview">
    <!-- {{trip}} -->
    <div class="profile-img" :style="profilePic"></div>
    <p>{{trip.user.firstname}} {{trip.user.lastname}}</p>
    <p>{{destinations}}</p>
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
    destinations() {
      return this.trip.destinations[0].continent;
    },
    profilePic() {
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    }
  }
};
</script>

