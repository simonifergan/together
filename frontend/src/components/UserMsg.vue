<template>
    <router-link :to="link" tag="aside" :title="titleType"  class="user-msg" v-if="payload">
        <button title="Dismiss" @click.stop="closeMsg"><i class="fas fa-times"></i></button>
        <div class="notification-container" >
            <div class="user-img" :style="{backgroundImage: `url('${payload.user.profilePic}')`}"/>
            <span>{{payload.user.firstname}} {{payload.action | notificationAction}}</span>&nbsp;
        </div>
    </router-link>
</template>

<script>
import EventBusService from '@/services/EventBusService';
import {SHOW_NOTIFICATION} from '@/services/EventBusService';
import NotificationService from '@/services/NotificationService';

export default {
    data() {
        return {
            isActive: false,
            payload: null,
            interval: null,
        };
    },
    methods: {
        closeMsg() {
            this.isActive = false;
            this.payload = null;
            this.interval = null;
        }
    },
    computed: {
        titleType() {
            if (!this.payload) return '';
            const {action, user} = this.payload;
            if (action === NotificationService.USER_TRIP_REQUEST) return 'Go to your trip';
            else if (action === NotificationService.USER_TRIP_APPROVED) return `Go to ${user.firstname}'s trip`;
            else return '';
        },
        link() {
            if (!this.payload) return '';
            const {action} = this.payload;
            if (action === NotificationService.USER_TRIP_REQUEST || action === NotificationService.USER_TRIP_APPROVED) return '/trip/' + this.payload.tripId;
            else if (action === NotificationService.USER_LIKE_USER) return '/user/' + this.payload.user._id;

        }
    },
    created() {
        EventBusService.$on(SHOW_NOTIFICATION, payload => {
            this.payload = payload;
            this.isActive = true;
            clearTimeout(this.interval);
            this.interval = setTimeout( () => {
                this.closeMsg();
            }, 1000 * 3)

        })
    },
    beforeDestroy() {
        EventBusService.$off(SHOW_NOTIFICATION);
    },
    toDo() {
        if (!this.isActive) return;

    }
}

</script>
<style>

</style>


