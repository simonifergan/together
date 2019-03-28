<template>
  <li title="See more" class="user-trip-preview" @click="isExpanded = !isExpanded" >
    <div class="preview-container">
      <h4>{{trip.title}} <span><i :class="arrowDir"></i></span></h4>
      <div class="btns-container" @click.stop="">
        <router-link tag="button" :to="'/edit/' + trip._id" title="Edit trip" v-if="loggedInUser._id === user._id"><i class="far fa-edit"></i></router-link>
        <router-link tag="button" :to="'/trip/' + trip._id" title="View trip"><i class="far fa-eye"></i></router-link>
      </div>
    </div>
    <transition name="fade">
      <div class="expand-container" @click.stop="" v-show="isExpanded">
        <ul class="pending-list" v-if="loggedInUser._id === user._id">
          <h5>Pending</h5>
          <div @click.stop class="accordion-container">
            <li class="user-item" v-for="(pender) in trip.pending" :key="pender._id+trip._id">
              <div class="user-img" :style="{backgroundImage: `url('${pender.profilePic}')`}"/>
              <span>{{pender.firstname}}&nbsp;{{pender.lastname}}</span>
            </li>
          </div>
        </ul>
        <ul class="member-list">
          <h5>Members</h5>
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
    },
    loggedInUser: {
      type: Object,
      required: false,
    },
    user: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      isExpanded: false,
      isPendingShowing: false,
      isMembersShowing: false
    };
  },
  computed: {
    arrowDir() {
      return (this.isExpanded)? 'fas fa-angle-up': 'fas fa-angle-down';
    }
  }
};
</script>

<style>
</style>
