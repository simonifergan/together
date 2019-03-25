<template>
  <div>
    <label>
      Art
      <el-checkbox v-model="activities.art"></el-checkbox>
    </label>
    <label>
      Beach
      <el-checkbox v-model="activities.beach"></el-checkbox>
    </label>
    <label>
      Food
      <el-checkbox v-model="activities.food"></el-checkbox>
    </label>
    <label>
      Hiking
      <el-checkbox v-model="activities.hiking"></el-checkbox>
    </label>
    <label>
      History
      <el-checkbox v-model="activities.history"></el-checkbox>
    </label>
    <label>
      Music
      <el-checkbox v-model="activities.music"></el-checkbox>
    </label>
    <label>
      Shopping
      <el-checkbox v-model="activities.shopping"></el-checkbox>
    </label>
    <label>
      Sports
      <el-checkbox v-model="activities.sports"></el-checkbox>
    </label>
    <label>
      Theater
      <el-checkbox v-model="activities.theater"></el-checkbox>
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
        console.log('output', output);
        
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
