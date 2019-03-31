<template>
  <router-link tag="li" :to="'/trip/' + trip._id" class="trip-preview">
    <div class="profile-img-container">
      <div class="profile-img" :style="profilePic"></div>
    </div>
    <div class="trip-details-container">
      <p>{{trip.user.firstname}} {{trip.user.lastname}}<span>({{totalLikes}})&nbsp;<i class="far fa-heart"></i></span></p>
      <p>{{trip.title}}</p>
      <p>On {{trip.startsAt | monthAndYearName}}, for a {{trip.duration}}</p>
      <div class="members-container" v-if="trip.members.length" >
        <div 
          class="member-img"
          v-for="member in firstThree" 
          :key="member._id"
          :style="{ backgroundImage: `url('${member.profilePic}')` }"
          :title="member.firstname"
          />
          <div class="placeholder-div"></div>
          <div class="members-txt" v-if="spotsLeft > 0">joined, {{spotsLeft}} spots remaining!</div>
          <div class="members-txt" v-else>No spots remaining.</div>
      </div>
      <p v-else>Be the first to join!</p>
    </div>
    
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
    totalLikes() {
      return this.trip.user.likes.length;
    },
    profilePic() {
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    },
    spotsLeft() {
      const {groupSize, members} = this.trip;
      return groupSize - members.length;

    },
    firstThree() {
      return this.trip.members.slice(0, 3);
    }
  }
};
</script>