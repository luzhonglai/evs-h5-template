<template>
    <view v-if="ispage">
        <scroll-view scroll-y="true" v-if="Info.length>0" @scrolltolower="scrollbottom" :style="'width:100%;height:' + windowHeight + 'px'">
            <navigator :url="'/activity/market/activity?id=' + items.activity_id" class="m-activity-item" v-for="(items, index) in Info">
                <image :src="items.activity_rule.activity_image" mode="aspectFill" class="m-activity-img" />
                <view class="m-activity-info">
                    <view class="m-activity-name">{{items.activity_name}} </view>
                    <label class="iconfont icon-shijian gray"></label>
                    <label class="m-activity-time">{{items.activity_endtime}}</label>
                </view>
            </navigator>
            <view class="m-loading-box">
                <block v-if="flag">
                    <view class="u-loadmore">
                        <label class="u-loading"></label>
                        <text class="u-loadmore-tips">{{__('正在加载')}}</text>
                    </view>
                </block>
                <block v-else>
                    <view class="u-loadmore u-loadmore-line">
                        <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
                    </view>
                </block>
            </view>
        </scroll-view>

        <view class="m-nullcontent" v-else>
            <view class="m-nullpage-middle">
                <label class="iconfont icon-meiyougengduo"></label>
                <view class="m-null-tip">
                    <text>{{__('没有任何活动~~')}}</text>
                    <view class="highlight" style="padding:10rpx;" @tap="gotoActivityList">{{__('前往活动中心')}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data() {
            return {
                page: 1, ispage: !1, flag: !0, Info: [], windowHeight: 0
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad(options) {
            try {
                var t = wx.getSystemInfoSync();
                this.setData({windowHeight: t.windowHeight})
            } catch (n) {
                console.log(" Do something when catch error")
            }
            this.getActivitylist()
        },

		onShow: function(opt) {
			let that = this;

		},
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            getActivitylist: function () {
                var params = {
                        page: this.page
                    },
                    that = this;
                that.$.request({
                    url    : that.Config.URL.user.listsUserMarketing,
                    data   : params,
                    success: function (data, status, msg, code)
                    {
                        if (200 == status && data.items.length > 0) {
                            that.setData({flag: !1});
                            that.setData({
                                ispage: !0,
                                Info  : that.Info.concat(data.items)
                            });
                        } else {
                            that.setData({flag: !1, ispage: !0})
                        }
                    }
                });
                /*$.request($.makeUrl(activityapi.GetUserAdvertismentEvent, e), function (e) {
                    console.log(" Do something when catch error-------------", e), !$.isNull(e.Info) && e.Code == 0 ? (e.Info.length < 10 && that.setData({flag: !1}), that.setData({
                        ispage: !0,
                        Info: that.Info.concat(e.Info)
                    })) : that.setData({flag: !1, ispage: !0})
                })*/
            },
            gotoActivityList: function () {
                this.$.navigateBack(1, function () {
                })
            },
            scrollbottom: function () {
                if (this.flag) {
                    var that = this;
                    that.setData({flag: !1}), clearTimeout(t);
                    var t = setTimeout(function () {
                        that.setData({page: that.page + 1}), that.getActivitylist()
                    }, 500)
                }
            }
        }
    }
</script>

<style lang="scss">

@import "../../styles/_variables";


.m-activity-item{width: 100%;height: 240rpx;margin-bottom: 10rpx;background: white;}
.m-activity-img{padding: 20rpx;width: 260rpx;height: 200rpx;float: left;}
.m-activity-info{width: 450rpx;height:100%;float: left;padding: 20rpx;box-sizing: border-box;}
.m-activity-name{font-size: 16px;margin-bottom: 40rpx;margin-top:10rpx;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;}
.gray{font-size: 35rpx;color: gray;display: inline-block;}
.m-activity-time{margin-left: 10rpx;margin-right: 30rpx;font-size: 26rpx;color: #888;}

</style>
