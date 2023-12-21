<template>
	<view class="page">
		<movable-area class="move-area">
			<movable-view v-if="info.IsRedPacketIcon" inertia class="move-img" direction="all" @tap='IsShowRPK'>
				<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/rpk_min.png"></image>
			</movable-view>
			<view style="background:#f8f8f8">
				<view class="paysuccess"><label>
						<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/true.png" style="width:40rpx;height:40rpx;margin-top:8rpx"></image>
					</label><text style="margin-left:10rpx">{{info.trade_is_paid==StateCode.ORDER_PAID_STATE_YES ? __('已支付') :  __('待付款')}}</text></view>
				<view class="content">
					<view class="store">{{info.store_name}}
					</view>
					<view class="details">
						<view class="details-left">
							<view class="charge"><text>{{__('消费金额')}}：<text style="color:red">{{Currency}}{{info.order_payment_amount}}</text></text></view>
							<view class="pay"><text>{{__('实际支付')}}：<text style="color:red">{{Currency}}{{info.trade_amount}}</text></text></view>
							<view class="monetary"><text>{{__('优惠金额')}}：<text style="color:red">{{Currency}}{{info.trade_discount}}</text></text></view>
						</view>
						<view class="details-right">
							<view class="num"><text>{{__('订单编号')}}：{{info.order_id}}</text></view>
							<view class="time"><text>{{__('消费时间')}}：{{info.trade_create_time}}</text></view>
							<view class="monetary"><text>{{__('余额抵扣')}}：<text style="color:red">{{Currency}}{{info.trade_payment_money}}</text></text></view>
						</view>
					</view>
				</view>
			</view>
		</movable-area>
		<view class="shareRPK " v-if="showRPK && info.IsRedPacketIcon && type==1" @tap='IsShowRPK'>
			<view :class="'shareRPKBox ' + showRPK ? 'animated bounceIn':'animated bounceOut'" catchtap style='background:url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/rpk_box.png) no-repeat;background-size: cover;'>
				<view class="sendRPK" catchtap='shareBox'></view>
				<view class="closeRPK" catchtap='IsShowRPK'></view>
			</view>
		</view>
		<view class="u-top-default">
			<navigator url='/pages/index/index' open-type="switchTab" class="u-back2">
				<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/gohome.png'></image>
			</navigator>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				info: {},
				deduction: 0,
				showRPK: !1,
				ActivityGroupId: 0,
				maxRPK: 0,
				order_id:"",
				isshow1: !1,
				Currency: "￥"
			}
		},
		components: {},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: this.__('优惠买单')
			});

			var that = this;
			
			that.setData({
			    order_id: options.order_id || ''
			});
			
			that.load();
		},

		onUnload() {
			// 离开页面，注销事件
			var that = this
		},
		/*
		onShareAppMessage: function() {
			return {
				title: "拼手气红包，第" + this.data.maxRPK + "个领取的红包最大!",
				imageUrl: "https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/shareImg.png",
				path: "pages/redpacket/redpacket?g=" + this.data.ActivityGroupId + "&n=" + this.data.maxRPK + "&uid=" + app.globalData
					.UserInfo.Id,
				success: function() {
				}
			}
		},*/
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			load: function() {
				let that = this;

                // 初始化页面
                that.$.request({
                    type: 'post',
                    url: this.Config.URL.pay.consume_trade_detail,
                    data: {order_id: that.order_id},
                    dataType: 'json',
                    success: function(data, status, msg, code) {
                        //console.log("优惠买单：", data);
                        that.setData({
                            info: data,
							Currency: data.currency_symbol_left
                        });

                        false ? that.setData({
                            isshow1: !1
                        }) : that.setData({
                            isshow1: !0
                        });

                        that.inputVal()
                    }
                });
			},
			shareQRCode: function(a) {
				var e = this,
					t = {
						store_id: app.globalData.VendorInfo.Id,
						sponsorId: app.globalData.UserInfo.Id,
						imageUrl: "https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/shareImg.png",
						path: "pages/redpacket/redpacket?g=" + this.data.ActivityGroupId + "&n=" + this.data.maxRPK + "&uid=" + app.globalData
							.UserInfo.Id,
						luckyOrder: this.data.maxRPK
					};
				$.xsr($.makeUrl(orderapi.ShareLuckyRedPacket, t), function(a) {
					e.setData({
						PageQRCodeInfo: {
							Path: a.Info,
							IsShare: !0,
							IsShareBox: !1,
							IsJT: !0
						}
					})
				})
			},
			shareBox: function() {
				this.setData({
					PageQRCodeInfo: {
						Path: "",
						IsShare: !0,
						IsShareBox: !0,
						IsJT: !1
					}
				})
			},
			cancelShare: function() {
				this.setData({
					PageQRCodeInfo: {
						Path: "",
						IsShare: !1,
						IsShareBox: !1,
						IsJT: !1
					}
				})
			},
			saveImg: function() {
				var e = this;
				$.loading(), wx.downloadFile({
					url: this.data.PageQRCodeInfo.Path,
					success: function(a) {
						$.hideloading(), wx.saveImageToPhotosAlbum({
							filePath: a.tempFilePath,
							success: function() {
								e.setData({
									PageQRCodeInfo: {
										Path: "",
										IsShare: !1,
										IsShareBox: !1,
										IsJT: !1
									}
								}), $.alert("保存图片成功！"), $.xsr1($.makeUrl(orderapi.ShareCount, {
									sponsorId: app.globalData.UserInfo.Id,
									audienceType: 3,
									audienceId: 0,
									ContentType: 22,
									contentId: e.data.ActivityGroupId
								}))
							},
							fail: function(a) {
								$.hideloading(), console.log("保存图片失败：", a)
							}
						})
					},
					fail: function(a) {
						$.hideloading()
					}
				})
			},
			showCodeImg: function() {
				wx.previewImage({
					current: this.data.PageQRCodeInfo.Path,
					urls: [this.data.PageQRCodeInfo.Path]
				})
			},
			IsShowRPK: function() {
				var a = this;
				a.data.showRPK ? setTimeout(function() {
					a.setData({
						showRPK: !1,
						type: 1
					})
				}, 250) : a.setData({
					showRPK: !0,
					type: 1
				})
			}
		}

	}
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.paysuccess {
		height: 160rpx;
		margin-left: 30rpx;
		display: flex;
		align-items: center;
		font-size: 36rpx;
		color: #000;
	}

	.content {
		height: 400rpx;
		background: #fff;
		padding: 0 30rpx
	}

	.store {
		font-size: 28rpx;
		color: #000;
		height: 80rpx;
		border-bottom: 1px solid #d9d9d9;
		line-height: 90rpx;
	}

	.details {
		display: flex;
		font-size: 24rpx;
		color: #000;
	}

	.details-left {
		width: 35%;
	}

	.details-left view {
		margin-top: 40rpx;
	}

	.details-right {
		width: 65%;
	}

	.details-right view {
		margin-top: 40rpx;
	}

	.m-footer-btn {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: right;
		border-top: 1rpx solid #d5d5d5;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.u-link-btn {
		margin: 0 10rpx;
		vertical-align: middle;
		display: inline-block;
		line-height: 40rpx;
	}

	.move-area {
		position: absolute;
		min-height: 100%;
		width: 100%;
	}

	.move-img {
		height: 126rpx;
		width: 100rpx;
		z-index: 5;
		margin-top: 70%;
		margin-left: 650rpx;
	}

	.move-img image {
		height: 126rpx;
		width: 100rpx;
	}

	.shareRPK {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		top: 0;
		left: 0;
		z-index: 5;
	}

	.shareRPKBox {
		width: 640rpx;
		height: 698rpx;
		background-color: red;
		position: absolute;
		top: 40%;
		left: 50%;
		margin-left: -320rpx;
		margin-top: -349rpx;
	}

	.sendRPK {
		width: 222rpx;
		height: 70rpx;
		position: absolute;
		left: 50%;
		margin-left: -100rpx;
		top: 50%;
		margin-top: 140rpx;
	}

	.closeRPK {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		left: 50%;
		margin-left: -22rpx;
		bottom: 25rpx;
	}

	.shareCodeImg {
		height: 800rpx;
	}

	.u-back2 image {
		border-radius: 100%;
		width: 77rpx;
		height: 77rpx;
		border: 1px solid #eee;
		font-size: 20rpx;
		text-align: center;
		background-color: #fff;
		box-shadow: 0px 4rpx 8rpx rgba(0, 0, 0, 0.35);
		z-index: 999;
		opacity: 0.8;
		line-height: 77rpx;
		margin-bottom: 20rpx;
	}
</style>
