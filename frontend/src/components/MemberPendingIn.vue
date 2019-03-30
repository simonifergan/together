<template>
  <router-link tag="li" :to="'/trip/' + trip._id" class="trip-preview">
    <img class="profile-img" :src="trip.user.profilePic">
    <p>{{trip.user.firstname}} {{trip.user.lastname}}</p>
    <p>{{trip.title}}</p>
    <p>On {{trip.startsAt | monthAndYearName}}, for a {{trip.duration}}</p>
    <div class="members-container">
      <div
        class="members-txt"
        v-if="spotsLeft">
            Only {{spotsLeft}} spots remaining!
      </div>
      <div class="members-txt" v-else>No spots remaining.</div>
    </div>
  </router-link>
</template>

<script>
// CMPS

export default {
  props: {
    trip: {
      type: Object,
      required: true
    }
  },
  computed: {
    spotsLeft() {
      const { groupSize, members } = this.trip;
      return groupSize - members.length;
    }
  }
};
</script>
