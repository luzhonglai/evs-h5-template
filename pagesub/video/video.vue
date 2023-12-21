<template>
    <view class="page">
        <video :src="url" autoplay="true"/>
    </view>
</template>

<script>

import statusBar from '../../components/status-bar.vue';
import { mapState, mapMutations } from 'vuex';

export default {
    data: function() {
        return {
            url: ''
        };
    },
    computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
    onLoad(options) {
        uni.setNavigationBarTitle({
            title:this.__('')
        });

        var that = this;
        var params = { pid: options.pid };

        if (options.url) {
            that.setData({
                url: decodeURIComponent(options.url)
            });
        }

        if (options.title) {

            that.$.setNavigationBarTitle({
            	title: decodeURIComponent(options.title)
            });
        }
    },

    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo'])
    }
};
</script>



<style lang="scss">
@import '../../styles/_variables';

/* video.wxss */
video {
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>
