<template>
	<view>
		<view class="m-activity-item">
			<image src="EventMainPic" mode="aspectFill" class="m-activity-img" />
			<view class="m-activity-info">
				<view class="m-activity-name">{{Title}}</view>
				<label class="iconfont icon-shijian gray"></label>
				<label class="m-activity-time">{{EventTime}}</label>
			</view>
		</view>
		<view class="m-cells m-cells-form">
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('姓名')}}：</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :placeholder="__('请输入姓名')" @input="inputname" />
				</view>
				<view v-if="!isName" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('电话')}}：</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="number" :placeholder="__('请输入电话')"  @input="inputphone" />
				</view>
				<view v-if="!isPhone" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('公司')}}：</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :placeholder="__('请输入公司名称')" @input="inputfirm" />
				</view>
				<view v-if="!isFirm " class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('职位')}}：</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :placeholder="__('请输入职位')" @input="inputjob" />
				</view>
				<view v-if="!isJob" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
		</view>
		<view class="btn_box">
			<!--<button class="u-btn u-btn-default" @tap="signinnow">立即报名</button>-->
			<form report-submit="true" @submit="signinnow">
				<button  class="u-btn u-btn-default" formType="submit">{{source=="activity"?__('立即报名'):__('立即签到')}}</button>
			</form>
		</view>
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
				EventMainPic: "",
				Title: "",
				EventTime: "",
				EventId: "",
				UserName: "",
				UserPhone: "",
				UserCompany: "",
				UserPosition: "",
				formId: "",
				isPhone: !0,
				isName: !0,
				isFirm: !0,
				isJob: !0,
				source: "",
				isTmplMsg: !0
			}
		},
		components: {
			dayCountdown
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {

			console.info(options)
			if (options.source == this.StateCode.MARKRTING_ACTIVITY_JOIN) {
				var t = $.parseJSON(options.val);
				this.setData({
					EventMainPic: t.img,
					Title: t.title,
					EventTime: t.time,
					EventId: t.id,
					source: options.source
				}), wx.setNavigationBarTitle({title: t.title + $.__("报名页")})
			} else if (options.source == this.StateCode.MARKRTING_ACTIVITY_JOIN_BY_QRCODE) {
				var n = this;

				$.isNull(this.userInfo) ? this.getUserInfo(function (user) {
							if (user)
							{
								n.setData({EventId: options.eventId, source: options.source}), n.initData()
							}
						},
						options.uid) : (n.setData({EventId: options.eventId, source: options.source}), n.initData())
			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			initData: function ()
			{
				var params = {activity_id: this.EventId},
						that = this;
				that.$.request({
					url    : that.Config.URL.user.getMarketing,
					data   : params,
					success: function (data, status, msg, code)
					{
						if (200 == status) {
							that.setData({
								EventMainPic: data.activity_rule.activity_image,
								Title       : data.activity_name,
								// EventTime   : e.Info.EventTime
							});
							wx.setNavigationBarTitle({title: that.Title + $.__("报名页")});
							// e.Info.IsJoin != 0 && (e.Info.IsJoin == 1 ? wx.navigateTo({url: "../activitycheckin/activitycheckin?eventId=" + that.EventId}) : e.Info.IsJoin == 2 && wx.navigateTo({url: "/activity/market/detail?id=" + that.EventId})))

						} else {
							$.alert("出错啦")
						}
					}
				});
			},
			inputname: function (e) {
				this.setData({UserName: e.detail.value}), $.isNull(e.detail.value) ? this.setData({isName: !1}) : this.setData({isName: !0})
			},
			inputphone: function (e) {
				this.setData({UserPhone: e.detail.value});
				$.isNull(e.detail.value) ? this.setData({isPhone: !1}) : this.setData({isPhone: !0});
			},
			inputfirm: function (e) {
				this.setData({UserCompany: e.detail.value}), $.isNull(e.detail.value) ? this.setData({isFirm: !1}) : this.setData({isFirm: !0})
			},
			inputjob: function (e) {
				this.setData({UserPosition: e.detail.value}), $.isNull(e.detail.value) ? this.setData({isJob: !1}) : this.setData({isJob: !0})
			},
			signinnow: function (e) {
				$.isNull(this.UserName) && this.setData({isName: !1}), $.isNull(this.UserPhone) && this.setData({isPhone: !1}), $.isNull(this.UserCompany) && this.setData({isFirm: !1}), $.isNull(this.UserPosition) && this.setData({isJob: !1}), this.setData({formId: e.detail.formId});
				if (this.isName && this.isPhone && this.isJob && this.isFirm) {
					var params = {
								activity_id: this.EventId,
								user_name: this.UserName,
								user_phone: this.UserPhone,
								user_company: this.UserCompany,
								user_position: this.UserPosition
							},
							that = this;
					that.$.request({
						url    : that.Config.URL.user.doMarketing,
						data   : params,
						success: function (data, status, msg, code)
						{
							if (200 == status) {
								if (data.type == that.StateCode.MARKRTING_ACTIVITY_JOIN) {
									that.isTmplMsg && that.sendMessage(), $.alert($.__("报名成功！"));
									setTimeout(function () {
										$.navigateBack(1, function () {
										})}, 1e3)
								} else if (data.type == that.StateCode.MARKRTING_ACTIVITY_JOIN_BY_QRCODE) {
									$.alert($.__("签到成功！")), setTimeout(function () {
												wx.navigateTo({url: "../activitycheckin/activitycheckin?eventId=" + n.EventId})
											},
											1e3)
								}

							} else {
								$.alert(msg)
							}
						}
					});
				}
			},
			sendMessage: function () {
				/* todo 微信模板消息
                var e = {
                    api: activityapi.EventJoinWXMessage,
                    pages: "pages/activity/activity?id=" + this.EventId,
                    formId: this.formId,
                    WeiXinOpenId: this.userInfo.openId,
                    value: {
                        EventId: this.EventId,
                        user_id: this.userInfo.user_id
                    }
                };
                $.sendTpl(e)*/
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";


	.m-activity-item{width: 100%;height: 240rpx;margin-bottom: 20rpx;background: white;}
	.m-activity-img{padding: 20rpx;width: 260rpx;height: 200rpx;float: left;}
	.m-activity-info{width: 450rpx;height:100%;float: left;padding: 20rpx;box-sizing: border-box;}
	.m-activity-name{font-size: 16px;margin-bottom: 40rpx; margin-top:10rpx;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;}
	.gray{font-size: 35rpx;color: gray;display: inline-block;}
	.m-activity-time{margin-left: 10rpx;margin-right: 20rpx;font-size: 26rpx;color: #888;}
	.btn_box{padding-top: 20rpx;}
	.u-label{width:100rpx;}

</style>
