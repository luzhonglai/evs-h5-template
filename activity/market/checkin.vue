<template>
	<view>
		<block v-if="isPage">
			<navigator :url="'/activity/market/detail?id=' + Info.Id" class="m-activity-item">
				<image src="Info.EventMainPic" mode="aspectFill" class="m-activity-img" />
				<view class="m-activity-info">
					<view class="m-activity-name">{{Info.Title}}</view>
					<label class="iconfont icon-shijian gray"></label>
					<label class="m-activity-time">{{Info.EventTime}}</label>
				</view>
			</navigator>

			<view class="icon-box">
				<icon type="success" size="70" />
				<view class="icon-box__ctn">
					<view class="icon-box-title">{{__('签到成功!')}}</view>
					<view class="icon-box-desc">{{__('签到时间')}}：{{Info.CheckInTime}}</view>
				</view>
			</view>

			<view class="m-activity-otherinfo" v-if="Info.AgendaPlan!=null">
				<view class="item-otherinfo">
					<view class="item-title">{{__('活动规则')}}</view>
				</view>
				<!--<view style="padding:10rpx 30rpx;font-size:30rpx;">{{Info.AgendaPlan}}</view>-->
				<view style="padding:10rpx 30rpx;font-size:30rpx;">
					<template is="wxParse" data="wxParseData:activityagenda.nodes" />
				</view>
			</view>
		</block>
	</view>
</template>

<script>

	import $ from "../../helpers/util";

	import dayCountdown from "../../components/day-countdown.vue";

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				isPage: !1, Info: [], EventId: "", activityagenda: []
			}
		},
		components: {
			dayCountdown
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('活动签到')
			});

			this.initData()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			initData: function () {
				var e = {EventId: this.EventId},
						that = this;
				that.$.request($.makeUrl(activityapi.EventCheckIn, e), function (e) {
					e.Info != null && e.Code == 0 ? (that.setData({
						isPage: !0,
						Info: e.Info
					}), $.isNull(e.Info.AgendaPlan) || WxParse.wxParse("activityagenda", "html", e.Info.AgendaPlan, that)) : ($.alert(that.__("签到失败！")), that.setData({isPage: !1}))
				})
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.m-activity-item{width: 100%;height: 240rpx;margin-bottom: 30rpx;background: white;}
	.m-activity-img{padding: 20rpx;width: 260rpx;height: 200rpx;float: left;}
	.m-activity-info{width: 450rpx;height:100%;float: left;padding: 20rpx;box-sizing: border-box;}
	.m-activity-name{font-size: 16px;margin-bottom: 40rpx; margin-top:10rpx;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;}
	.gray{font-size: 35rpx;color: gray;display: inline-block;}
	.m-activity-time{margin-left: 10rpx;margin-right: 20rpx;font-size: 26rpx;color: #888;}



	.m-activity-otherinfo{background: white;margin-top: 30rpx;}
	.item-otherinfo{padding:20rpx;border-bottom: 1px solid #eee;margin-bottom: 10rpx;}
	.item-title{border-left: 5px solid $default-skin-bg;font-size: 14px;padding-left: 10rpx;}

	.icon-box {display: -webkit-box;display: -webkit-flex;display: flex;-webkit-box-align: center;-webkit-align-items: center;align-items: center;background-color: #fff;padding: 20rpx;margin-top: 20rpx;position: relative;}
	.icon-box image{width: 120rpx;height: 120rpx;}
	.icon-box image {margin-right: 32rpx;}
	.icon-box-title {font-weight: 400;color: #DB384B;}
	.icon-box-desc {margin-top: 12rpx;font-size: 24rpx;color: #888;}
	.icon-box icon{margin-right: 10rpx;}

</style>
