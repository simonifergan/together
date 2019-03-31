<template>
  <div class="activity-prefs">
    <label>
      <el-checkbox v-model="activities.art"></el-checkbox>
      Art
    </label>
    <label>
      <el-checkbox v-model="activities.beach"></el-checkbox>
      Beach
    </label>
    <label>
      <el-checkbox v-model="activities.food"></el-checkbox>
      Food
    </label>
    <label>
      <el-checkbox v-model="activities.hiking"></el-checkbox>
      Hiking
    </label>
    <label>
      <el-checkbox v-model="activities.history"></el-checkbox>
      History
    </label>
    <label>
      <el-checkbox v-model="activities.music"></el-checkbox>
      Music
    </label>
    <label>
      <el-checkbox v-model="activities.shopping"></el-checkbox>
      Shopping
    </label>
    <label>
      <el-checkbox v-model="activities.sports"></el-checkbox>
      Sports
    </label>
    <label>
      <el-checkbox v-model="activities.theater"></el-checkbox>
      Theater
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {
      activities: {
        art: false,
        beach: false,
        food: false,
        hiking: false,
        history: false,
        music: false,
        shopping: false,
        sports: false,
        theater: false
      }
    };
  },
  watch: {
    activities: {
      handler(newVal) {
        const output = [];
        for (let activity in this.activities) {
          if (this.activities[activity]) output.push(activity);
        }
        this.$emit("input", output);
      },
      deep: true
    },
    value(newVal) {        
        newVal.forEach(activity => this.activities[activity] = true)
    }
  },
  created() {
    this.value.forEach(activity => this.activities[activity] = true)
  }
};
</script>

<style>
</style>
