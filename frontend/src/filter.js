import Vue from 'vue'
import moment from 'moment'

Vue.filter('notificationAction', (action)=>{
    switch (action) {
        case 'trip_request':
            return 'asked to join a trip';
        case 'trip_created':
            return 'has created a trip';
        case 'trip_joined':
            return 'has joined a trip.';
        case 'trip_modified':
            return 'has updated his trip.';
        case 'user_signup':
            return 'has just signed up! check out his profile.';
        case 'user_online':
            return 'is now online!';
        case 'user_offline':
            return '';
        case 'user_comment':
            return 'has left a comment on a trip.';
        default:
            return '';
    }
});

Vue.filter('fromNow', (timestamp)=>{
    return moment(timestamp).fromNow();
});