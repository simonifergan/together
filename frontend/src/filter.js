import Vue from 'vue'
import moment from 'moment'
import UtilService from '@/services/UtilService'

Vue.filter('countryCodeToName', code => {
    if (!code) return '';
    let name = UtilService.worldCodeMap.get(code);
    return (name) ? name : code;
})

Vue.filter('calcAge', timestamp => {
    if (!timestamp) return ''
    return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24 * 365));
})

Vue.filter('cityList', cities => {
    if (!cities && !cities.length) return ''
    return cities.reduce((acc, city, idx) => {
        if (idx < cities.length - 2) return acc + city + ', ';
        else if (idx === cities.length - 2) return acc + city + ' & ';
        else return acc + city;
    }, '');
})

Vue.filter('cityWithCountryToCity', city => {
    return city.match(/^.*?(?=[,\-]|$)/)[0];
})

Vue.filter('monthAndYearName', (monthYearStr) => {
    let monthNumStart = +monthYearStr.substring(5);
    let monthNameStart = UtilService.getMonthName(monthNumStart);
    let yearNumStart = +monthYearStr.substring(0, 4);

    return `${monthNameStart} ${yearNumStart}`;
})

Vue.filter('msgSender', (senderId, chatters) => {
    const sender = chatters.find(user => user._id === senderId);
    return (sender)? sender.firstname : '';
})

Vue.filter('notificationAction', (action) => {
    switch (action) {
        case 'trip_request':
            return 'has asked to join a trip.';
        case 'trip_created':
            return 'has created a trip.';
        case 'trip_joined':
            return 'has joined a trip.';
        case 'trip_modified':
            return 'has updated his trip.';
        case 'user_signup':
            return 'has just signed up! Check out his profile.';
        case 'user_online':
            return 'is now online!';
        case 'user_offline':
            return '';
        case 'user_comment':
            return 'has left a comment on a trip.';
        case 'user_trip_request':
            return 'has requested to join your trip!';
        case 'user_trip_approved':
            return 'has approved your request to the trip!';
        case 'user_like_user':
            return 'liked your profile!';
        default:
            return '';
    }
});

Vue.filter('fromNow', (timestamp) => {
    return moment(timestamp).fromNow();
});

