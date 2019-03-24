<template>
  <router-link tag="li" :to="'/trip/' + trip._id" class="trip-preview">
    <div class="profile-img-container">
      <div class="profile-img" :style="profilePic"></div>
    </div>
    <p>{{trip.user.firstname}} {{trip.user.lastname}}</p>
    <p>{{trip.title}}</p>
    <p>{{trip.startsAt}}, {{trip.duration}}</p>
    <div class="members-container" v-if="trip.members.length > 0">
      <div 
        class="member-img"
        v-for="member in firstThree" 
        :key="member._id"
        :style="{ backgroundImage: `url('${member.profilePic}')` }"
        :title="member.firstname"
        />
        <div class="placeholder-div"></div>
        <div class="members-txt" v-if="spotsLeft > 0">joined, {{spotsLeft}} spots remaining!</div>
    </div>
    <p v-else>Be the first one to join!</p>
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
      // THIS COSTS MONEY!!! Yanai: build a feature to "crop" images!!
      // if (!this.trip || !this.trip.user || !this.trip.user.profilePic) return {};
      // let init = this.trip.user.profilePic;
      // let regEx = /upload\//;
      // console.log(init);
      // let { index } = init.match(regEx);
      // let first = init.substr(0, index + 7);
      // let second = init.substr(index + 7);
      // let middle = "w_800,h_600/";
      // let url = first + middle + second;
      // return { "background-image": `url('${url}')` };
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    },
    spotsLeft() {
      const {groupSize, members} = this.trip;
      return groupSize - members.length - 1;

    },
    firstThree() {
      return this.trip.members.slice(0, 3);
    }
  }
};
</script>