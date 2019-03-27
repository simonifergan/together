<template>
    <aside class="user-msg" v-if="payload">
        <div class="notification-container">
            <div class="user-img" :style="{backgroundImage: `url('${payload.user.profilePic}')`}"/>
            <span>{{payload.user.firstname}} {{payload.action | notificationAction}}</span>
        </div>
    </aside>
</template>

<script>
import EventBusService from '@/services/EventBusService';
import {SHOW_NOTIFICATION} from '@/services/EventBusService';

export default {
    data() {
        return {
            isActive: false,
            payload: null,
        };
    },
    methods: {
        closeMsg() {
            this.isActive = false;
            this.payload = null;
        }
    },
    created() {
        EventBusService.$on(SHOW_NOTIFICATION, payload => {
            this.payload = payload;
            this.isActive = true;
            setTimeout( () => {
                this.closeMsg();
            }, 10000)

        })
    },
    beforeDestroy() {
        EventBusService.$off(SHOW_NOTIFICATION);
    }
}

</script>
<style>

</style>


