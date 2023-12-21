<template>
	<view>

		<view class="m-activity-container" v-if="isPage">
			<view class="m-activity-info">
				<image :src="Info.activity_rule.activity_image" mode="aspectFill" class="m-activity-img" v-if="!isEventMainPic" />
				<view class="m-activity-name">{{Info.activity_name}}</view>
				<view class="m-activity-eventdesc">{{Info.activity_remark}}</view>
				<view class="m-cell m-cell-access">
					<view class="m-cell-hd highlight">
						<label class="iconfont icon-shijian "></label>
					</view>
					<view class="m-cell-bd m-cell-primary">
						<p> {{__('活动时间')}}：{{Info.activity_starttime}} ~ {{Info.activity_endtime}}</p>
					</view>
				</view>
				<view class="m-cell m-cell-access">
					<view class="m-cell-hd" style="color:#EB543D">
						<label class="iconfont icon-gerenziliao "></label>
					</view>
					<view class="m-cell-bd m-cell-primary">
						<p> {{__('报名截止时间')}}：{{Info.activity_rule.end_join_time}}</p>
					</view>
				</view>
				<view class="m-cell m-cell-access">
					<view class="m-cell-hd" style="color:#1BC2A6">
						<label class="iconfont icon-shouhuodizhi "></label>
					</view>
					<view class="m-cell-bd m-cell-primary">
						<p> {{__('活动地址')}}：{{Info.activity_rule.activity_address}}</p>
					</view>
				</view>

				<view class="m-activity-otherinfo" v-if="!isEventDetail">
					<view class="item-otherinfo">
						<view class="item-title">{{__('活动介绍')}}</view>
					</view>
					<u-parse :content="Info.activity_rule.activity_detail_intro + ' '" @navigate="navigate"  @preview="preview" :imageProp="{lazyLoad:true}"></u-parse>
				</view>
				<view class="m-activity-otherinfo" v-if="!isVip1">
					<view class="item-otherinfo">
						<view class="item-title">{{__('嘉宾介绍')}}</view>
					</view>
					<image src="Info.VipGuestPic1" mode="widthFix" class="item-otherimg" v-if="!isVip1" />
					<image src="Info.VipGuestPic2" mode="widthFix" class="item-otherimg" v-if="!isVip2" />
					<image src="Info.VipGuestPic3" mode="widthFix" class="item-otherimg" v-if="!isVip3" />
					<image src="Info.VipGuestPic4" mode="widthFix" class="item-otherimg" v-if="!isVip4" />
					<image src="Info.VipGuestPic5" mode="widthFix" class="item-otherimg" v-if="!isVip5" />
				</view>
				<view class="m-activity-otherinfo" v-if="!isAgendaPlan">
					<view class="item-otherinfo">
						<view class="item-title">{{__('活动规则')}}</view>
					</view>
					<view style="padding:0 20rpx;">
						<u-parse :content="Info.activity_rule.activity_intro + ' '" @navigate="navigate"  @preview="preview" :imageProp="{lazyLoad:true}"></u-parse>
					</view>
				</view>

				<view class="m-activity-otherinfo">
					<view class="item-otherinfo" style="margin-bottom:0rpx;">
						<view class="item-title">{{__('主办单位')}}</view>
					</view>
					<view class="m-cell m-cell-access borderNone">
						<view class="m-cell-hd" style="color:#1BC2A6">
							<label class="iconfont icon-icon1"></label>
						</view>
						<view class="m-cell-bd m-cell-primary">
							<p> {{__('主办方')}}：{{Info.activity_rule.activity_sponsor }}</p>
						</view>
					</view>
					<view class="m-cell m-cell-access">
						<view class="m-cell-hd" style="color:#1BC2A6">
							<label class="iconfont icon-icon "></label>
						</view>
						<view class="m-cell-bd m-cell-primary">
							<p> {{__('联系人')}}：{{Info.activity_rule.contact_organizer}}</p>
						</view>
					</view>
					<view class="m-cell m-cell-access">
						<view class="m-cell-hd" style="color:#1BC2A6">
							<label class="iconfont icon-mobilephone "></label>
						</view>
						<view class="m-cell-bd m-cell-primary">
							<p> {{__('联系电话')}}：{{Info.activity_rule.contact_phone}}</p>
						</view>
					</view>
				</view>
				<view class="u-cleanbox"></view>
			</view>
			<view class="bottombar g-flex">
				<view class="service"  v-if="false">
					<label class="iconfont icon-more" style="line-height:40rpx"></label>
					<view class="text-kefu" style="line-height:30rpx">{{__('客服')}}</view>
				</view>
				<view :class="['signin', isGray ?'m-footer-desable':'']" @tap="signinnow">{{content}}</view>
			</view>
		</view>

		<view class="u-tap-btn">
			<navigator url="/pages/index/index" open-type="switchTab" class="u-go-home">
				<view class="iconfont icon-shouyeshouye" style="font-size:50rpx;"></view>
			</navigator>
		</view>

	</view>
</template>

<script>

	import $ from "../../helpers/util";

	import dayCountdown from "../../components/day-countdown.vue";
	import uParse from '@/components/u-parse/u-parse.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				Info: [],
				Id: 0,
				isVip1: !0,
				isVip2: !0,
				isVip3: !0,
				isVip4: !0,
				isVip5: !0,
				isEventDetail: !0,
				isEventMainPic: !0,
				isAgendaPlan: !0,
				isPage: !1,
				isGray: !0,
				content: "",
				activitydetail: [],
				activityagenda: []
			}
		},
		components: {
			dayCountdown,
			uParse
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('活动详情')
			});
			this.setData({Id: options.id});

			this.forceUserInfo(function(user) {});
		},
		onShareAppMessage: function () {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif

			return {
				title: this.Info.Title,
				desc: this.Info.EventDesc,
				path: "/activity/market/detail?id=" + this.Id + "&uid=" + this.userInfo.user_id
			}
		},
		/**
		 * 用户点击右上角分享朋友圈
		 */
		onShareTimeline: function () {
			return {
				title: this.Info.Title,
				query: {
					uid: this.userInfo.user_id
				}
			}
		},

		onShow: function () {
			var e = this;
			$.isNull(this.userInfo) ? this.getUserInfo(function (user) {
				if (user)
				{
					e.initData()
				}
			}) : e.initData()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			initData: function () {
				var params = {
					activity_id    : this.Id
				}, that = this;
				that.$.request({
					url    : that.Config.URL.user.getMarketing,
					data   : params,
					success: function (data, status, msg, code)
					{
						if (200 == status) {
							that.setData({
								Info: data,
								isVip1: $.isNull(data.VipGuestPic1),
								isVip2: $.isNull(data.VipGuestPic2),
								isVip3: $.isNull(data.VipGuestPic3),
								isVip4: $.isNull(data.VipGuestPic4),
								isVip5: $.isNull(data.VipGuestPic5),
								isEventDetail: $.isNull(data.activity_rule.activity_detail_intro),
								isEventMainPic: $.isNull(data.activity_rule.activity_image),
								isAgendaPlan: $.isNull(data.activity_rule.activity_process),
								isPage: !0,
								isSignIn: data.is_join,
								ifJoin: data.if_join,
							});

							if (data.if_join && !data.is_join) {
								// 可以报名且未报名
								that.setData({
									isGray : !1,
									content: that.__("立即报名")
								});
							} else {
								// 不可报名
								if (data.is_join) {
									// 由于已报名不可报名
									that.setData({
										isGray: !0, content: that.__("已报名")
									});
								} else {
									// 活动已截止报名，导致的不可报名
									that.setData({
										isGray : !0,
										content: that.__("报名已截止")
									});
								}
							}
						} else {
							that.setData({isPage: !1})
						}
					}
				});
			},
			// 参加报名
			signinnow: function () {
				if (this.isGray)
				{
					return;
				}
				var e = {
					img: this.Info.activity_rule.activity_image,
					title: this.Info.activity_name,
					time: this.Info.activity_rule.start_join_time,
					id: this.Info.activity_id
				};
				wx.navigateTo({url: "/activity/market/signin?val=" + JSON.stringify(e) + "&source=" + this.StateCode.MARKRTING_ACTIVITY_JOIN})
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.m-activity-container{background: white;}
	.m-activity-info{margin-bottom: 100rpx;width:100%;box-sizing: border-box;}
	.m-activity-img{width: 100%;height: 440rpx;}
	.m-activity-name{padding: 10rpx 28rpx;width: 100%;box-sizing: border-box;line-height: 60rpx;overflow: hidden;}
	.m-activity-eventdesc {padding:0 30rpx 20rpx;font-size: 28rpx;text-justify:auto;}
	.m-cell-primary{font-size: 30rpx;margin-left: 10rpx;color: gray;}
	.iconfont{font-size: 40rpx;color: $default-skin-bg;}
	.separator{height: 20rpx;}
	.m-activity-otherinfo{border-top: 20rpx solid #eee;box-sizing: border-box;}
	.item-otherinfo{padding:20rpx;border-bottom: 1px solid #eee;margin-bottom: 10rpx;}
	.item-title{border-left: 5px solid $default-skin-bg;font-size: 14px;padding-left: 10rpx;}
	.item-otherimg{width: 100%;padding: 10rpx 20rpx;box-sizing: border-box;}
	.bottombar{height: 100rpx;width:100%;position: fixed;left:0;bottom:0;text-align: center;}
	.service{flex: 1;background: white;color: gray;font-size: 22rpx;display:flex;flex-direction: column;align-items: center;justify-content: center;border-top: 1rpx solid #eee;}
	.iconfont{color: gray;}
	.text-kefu{padding-top: 6rpx;}
	.signin{flex:4;background:$default-skin-bg;color: white;font-size: 32rpx;line-height: 100rpx;}
	.m-footer-desable{background: #ccc;}
	.kefu{position: fixed;bottom: 30rpx;left:50rpx;opacity: 0;}
	.borderNone::before{content: "";border: 0;}

	.u-tap-btn{position: fixed;right: 20rpx;bottom: 90rpx;}
	.u-go-home{border-radius: 100%;width: 80rpx;height: 80rpx;border: 1px solid #eee;font-size: 20rpx;text-align: center;background-color: #fff;box-shadow: 0px 4rpx 8rpx;z-index: 2;line-height:80rpx; margin-bottom: 20rpx;}
	.u-go-home .iconfont{font-size: 36rpx;}

</style>
