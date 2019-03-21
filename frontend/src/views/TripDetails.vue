<template>
  <section v-if="trip" class="trip-details">
    <div class="top-fold">
      <div class="profile-img" :style="profilePic"/>
      <h1>{{trip.title}}</h1>
      <h2>{{trip.user.firstname}}&nbsp;{{trip.user.lastname}}</h2>
      <button>
        <i class="far fa-comment-alt"></i>
      </button>
    </div>

    <button class="btn-join-trip">Ask to join</button>

    <div class="trip-members">
      <h3>Group members:</h3>
      <ul>
        <UserPreview v-for="user in trip.members" :key="user._id" :user="user"/>
        <!-- <li v-for="user in trip.members" :key="user._id">
          {{user.firstname}}
        </li>-->
      </ul>
    </div>

    <p class="trip-desc">{{trip.desc}}</p>

    <div class="destinations">
      <ul>
        <li
          v-for="destination in trip.destinations"
          :key="destination.region"
        >{{destination.region}}, {{destination.country}}</li>
      </ul>
    </div>

    <div class="comments">
      <h3>comments</h3>
    </div>
  </section>
</template>

<script>
// CPMS
import UserPreview from "@/components/UserPreview.vue";

export default {
  name: "trip-details",
  components: {
    UserPreview
  },
  computed: {
    trip() {
      return this.$store.getters.tripToDisplay;
    },
    profilePic() {
      return { "background-image": `url('${this.trip.user.profilePic}')` };
    }
  },
  methods: {
    joinTrip() {
      this.$store.dispatch({ type: "joinTrip", tripId: this.trip._id });
    }
  },
  created() {
    var { tripId } = this.$route.params;
    if (tripId) this.$store.dispatch({ type: "loadTrip", tripId });
    else this.$router.go(-1);
  },
  beforeDestroy() {
    this.$store.commit({ type: "clearTrip" });
  }
};
// [
//     {
//         "_id": "5c9115f5e7179a0e4088ebd2",
//         "userId": "5c9110f3e7179a0e4088e8ad",
//         "title": "Asia & Latin America for a few months",
//         "desc": "Hi, my name is Adi. I am looking for two partners for a trip around Asia and Latin America.",
//         "destinations": [
//             {
//                 "continent": "latin america"
//             },
//             {
//                 "continent": "asia"
//             }
//         ],
//         "createdAt": 1553011410491,
//         "startsAt": {
//             "month": "january",
//             "year": 2020
//         },
//         "duration": [
//             "long"
//         ],
//         "openTo": {},
//         "members": [
//             {
//                 "_id": "5c9110a9e7179a0e4088e883",
//                 "firstname": "Yanai",
//                 "lastname": "Avnet",
//                 "gender": "male",
//                 "profilePic": "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553113637/user_imgs/TF1D96MK6-UF42W4SGG-6885f84ccb72-512.jpg"
//             },
//             {
//                 "_id": "5c911149e7179a0e4088e8c4",
//                 "firstname": "Simon",
//                 "lastname": "Ifergan",
//                 "gender": "male",
//                 "profilePic": "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553112209/user_imgs/simon.jpg"
//             },
//             {
//                 "_id": "5c92afe7ffcd3525281f845b",
//                 "firstname": "John",
//                 "lastname": "Doe",
//                 "gender": "male",
//                 "profilePic": "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553085562/user_imgs/qaibm9ad351l47s83gcn.jpg"
//             }
//         ],
//         "activities": [
//             "food",
//             "exploration",
//             "festivals"
//         ],
//         "groupSize": [
//             "trio"
//         ],
//         "comments": [
//             {
//                 "first": {
//                     "userId": "5c911149e7179a0e4088e8c4",
//                     "txt": "Hi, I am interested in joining your trip!",
//                     "at": 1553071205199
//                 },
//                 "replies": [
//                     {
//                         "userId": "5c9115f5e7179a0e4088ebd2",
//                         "txt": "Cool, PM me and let's see if it works out :)",
//                         "at": 1553071205199
//                     },
//                     {
//                         "userId": "5c911149e7179a0e4088e8c4",
//                         "txt": "Sounds good!",
//                         "at": 1553071205199
//                     }
//                 ]
//             }
//         ],
//         "user": {
//             "firstname": "Adi",
//             "lastname": "Binenbaum",
//             "gender": "female",
//             "profilePic": "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553085988/user_imgs/adi.png"
//         }
//     }
// ]
</script>