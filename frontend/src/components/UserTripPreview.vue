<template>
  <li class="user-trip-preview">
    {{trip}}
    <ul class="member-list" @click="isMembersShowing = !isMembersShowing">
      <h3>Members</h3>
      <transition name="fade">
      <div @click.stop class="accordion-container" v-show="isMembersShowing">
        <li
          class="member-item"
          v-for="(member) in trip.members"
          :key="member._id+trip._id"
        >{{member}}</li>
      </div>
      </transition>
    </ul>
    <ul class="pending-list" @click="isPendingShowing = !isPendingShowing">
      <h3>Pending</h3>
      <transition name="fade">
        <div @click.stop class="accordion-container" v-show="isPendingShowing">
          <li
            class="pending-item"
            v-for="(pender) in trip.pending"
            :key="pender._id+trip._id"
          >{{pender}}</li>
        </div>
      </transition>
    </ul>
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
      isPendingShowing: false,
      isMembersShowing: false
    };
  }
};
</script>

<style>
</style>
