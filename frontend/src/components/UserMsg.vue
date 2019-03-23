<template>
    <aside class="user-msg">
        <h1>MY TITLE!</h1>
        {{isActive}}
        {{payload}}
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

        })
    },
    beforeDestroy() {
        EventBusService.$off(SHOW_NOTIFICATION);
    }
}

</script>
<style lang="scss" scoped>
.user-msg {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #333;
    width: 50vh;
    height: 50vh;
    z-index: 1020320310429214109;
}
</style>


