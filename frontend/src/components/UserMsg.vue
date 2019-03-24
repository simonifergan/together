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
    },
    toDo() {
        if (!this.isActive) return;

    }
}

</script>
<style lang="scss" scoped>

</style>


