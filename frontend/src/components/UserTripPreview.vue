<template>
  <li class="user-trip-preview" @click="isExpanded = !isExpanded" >
    <h2>{{trip.title}}</h2>
    <transition name="fade">
      <div class="expand-container" @click.stop="" v-show="isExpanded">
        <ul class="pending-list">
          <h3>Pending</h3>
          <div @click.stop class="accordion-container">
            <li class="user-item" v-for="(pender) in trip.pending" :key="pender._id+trip._id">
              <div class="user-img" :style="{backgroundImage: `url('${pender.profilePic}')`}"/>
              <span>{{pender.firstname}}&nbsp;{{pender.lastname}}</span>
            </li>
          </div>
        </ul>
        <ul class="member-list">
          <h3>Members</h3>
          <div @click.stop class="accordion-container">
            <li class="user-item" v-for="(member) in trip.members" :key="member._id+trip._id">
              <div class="user-img" :style="{backgroundImage: `url('${member.profilePic}')`}"/>
              <span>{{member.firstname}}&nbsp;{{member.lastname}}</span>
            </li>
          </div>
        </ul>
      </div>
    </transition>
  </li>
</template>

<script>
export default {
  props: {
    trip: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isExpanded: false,
      isPendingShowing: false,
      isMembersShowing: false
    };
  }
};
</script>

<style>
</style>
