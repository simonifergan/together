<template>
  <li class="notification">
    <div class="profile-pic" :style="profilePic"/>
    <p>{{notification.createdAt | fromNow}}</p>
    <p>{{notification.user.firstname}} {{notification.action | notificationAction}}</p>
  </li>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  computed: {
    profilePic() {
      return {
        "background-image": `url('${this.notification.user.profilePic}')`
      };
    }
  }
};

  // {
  //   _id: "5c9487739af3f6163f351c6c",
  //   userId: "5c911149e7179a0e4088e8c4",
  //   tripId: "5c9115f5e7179a0e4088ebd2",
  //   action: "trip_request",
  //   createdAt: 1553011410491,
  //   user: {
  //     firstname: "Simon",
  //     lastname: "Ifergan",
  //     profilePic:
  //       "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553112209/user_imgs/simon.jpg"
  //   },
  //   trip: {
  //     _id: "5c9115f5e7179a0e4088ebd2",
  //     title: "Asia & Latin America for a few months"
  //   }
  // }


</script>

<style lang="scss">
.notification {
  p {
    font-size: .8em;
    &:first-of-type {
        color: #666;
    }
  }
  .profile-pic {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background-size: contain;
    box-shadow: 0 0 0.5px #4d4d4d;
  }
}
</style>