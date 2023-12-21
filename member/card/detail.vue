<template>
	<view class="page">
		<block v-if="isdata">
			<view class="u-pa1 fix-titlenview-trans">
				<view class="m-banner-ad"><image :src="cardInfo.card_type_image" style="width: 100%;height: 100%;"></image></view>
				<view class="m-activity-info">
					<view class="m-activity-title">
						<label>{{ cardInfo.card_type_name }}</label>
					</view>
					<view class="m-activity-price">
						<view>
							<label>{{ __('￥') }}{{ number_format(cardInfo.card_type_prize, 2) }}</label>
							<label  style="padding:0upx 30upx;color:#888;">{{ __('剩余使用次数') }}   {{ cardInfo.not_num }}</label>
						</view>
					</view>
				</view>
				<uni-collapse :accordion="true" style="margin:20upx 0upx;background-color: #ffffff;" v-if="(info_id > 0  && cardInfo.card_write_code)">
					<uni-collapse-item title="使用记录" :show-animation="true">
						<view class="m-RichText">
							<view class="m-code" v-for="(code, index) in cardInfo.items" :key="index">
								<view>{{ code.card_write_code }}</view>
								<view v-if="code.card_is_use == 1" style="color:#717171">{{ __('已使用') }}</view>
								<view v-if="code.card_is_use == 0" style="color:#ff4142" :data-code="code.card_write_code" @click="Make">{{ __('使用') }}</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>

				<view class="m-panel m-panel-access m-detail">
					<view class="m-tab">
						<view class="m-navbar">
							<view class="m-navbar-item m-navbar-item-on">{{ __('使用规则') }}</view>
						</view>
					</view>

					<view class="m-RichText" v-if="cardInfo.card_rule"><wxParse :content="cardInfo.card_rule" /></view>
				</view>
				<view style="width:100%;height:100upx;"></view>

				<view class="u-cleanbox"></view>

				<view class="m-footer-btn" v-if="card_code > 0">
					<view class="m-footer-btn-list">
						<view class="m-footer-btn-item m-cart-total">
							<view>
								{{ __('合计：') }}
								<block v-if="cardInfo.card_type_prize.m">
									<label>{{ __('￥') }}</label>
									<text class="m-total-price">{{ number_format(cardInfo.card_type_prize, 2) }}</text>
								</block>
							</view>
						</view>
					</view>
					<form report-submit="true" @submit="submitinfo">
						<button class="m-footer-btn-main" formType="submit">{{ __('去支付') }}</button>
					</form>
				</view>
			</view>
		</block>

		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{ __('亲~什么都没有') }}</text>
				</view>
			</view>
		</view>

		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox" @onCancel="onCancel" @onPaid="onPaid" @onFail="onFail"></payment-box>

		<!-- 弹出层 -->

		<view :class="bannerShow ? 'tailfoli' : 'hide'" @click="setHide"><canvas class="m-canvas" canvas-id="qrcode" style="width: 200px;height: 200px;" /></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import uniQrcode from '@/components/uni-qrcode/uni-qrcode.vue';

import uQRCode from '@/components/uni-qrcode/uqrcode.js';

import wxParse from '@/components/u-parse/u-parse.vue';
import paymentBox from '../../components/payment-box.vue';

import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';

export default {
	data() {
		return {
			card_code: 0,
			isdata: !1,
			cardInfo: {},
			bannerShow: !1,
			paymentData: {},
			order_id: '',
			order_price: 0,
			info_id: 0
		};
	},

	components: {
		wxParse,
		paymentBox,
		uniQrcode,
		uniCollapse,
		uniCollapseItem
	},

	computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
	onLoad: function(options) {
		uni.setNavigationBarTitle({
			title: this.__('卡片详情')
		});
		if (options.cid) {
			this.setData({
				card_code: options.cid
			});

			this.getCard();
		} else {
			this.setData({
				info_id: options.fid
			});

			this.getCardInfo();
		}

		// that.$.setNavigationBarTitle({
		// 	title: data.item_row.product_item_name
		// });
	},

	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

		getCardInfo: function() {
			var that = this,
				params = {
					card_code: that.info_id
				};
			
			that.$.request({
				url: that.Config.URL.card.card_info_get,
				data: params,
				success: function(data, status, msg, code) {
					if (status == 200 && data) {
						that.setData({
							isdata: !0,
							cardInfo: data
						});
					} else {
						that.setData({
							isdata: !1
						});
						that.$.alert(msg);
					}
				}
			});
		},

		getCard: function() {
			var that = this,
				params = {
					card_code: that.card_code
				};

			that.$.request({
				url: that.Config.URL.card.card_get,
				data: params,
				success: function(data, status, msg, code) {
					if (status == 200 && data) {
						that.setData({
							isdata: !0,
							cardInfo: data
						});
						console.log(that.cardInfo);
					} else {
						that.setData({
							isdata: !1
						});
						that.$.alert(msg);
					}
				}
			});
		},

		setHide: function() {
			this.setData({
				bannerShow: !1
			});
		},

		Make: function(e) {
			var that = this;

			that.setData({
				bannerShow: !0
			});



			uQRCode.make({
				canvasId: 'qrcode',
				componentInstance: this,
				text:e.target.dataset.code,
				size: 200,
				margin: 10,
				backgroundColor: '#ffffff',
				foregroundColor: '#000000',
				fileType: 'jpg',
				// correctLevel: uQRCode.errorCorrectLevel.H,
				success: res => {
					//console.log(res);
				},
				fail: error => {
					//console.log(error);
				}
			});
		},

		submitinfo: function(e) {
			var that = this;

			var params = {
				card_id: that.cardInfo.card_type_id
			};
			that.$.request({
				type: 'post',
				url: that.Config.URL.pay.card_fee,
				data: params,
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.setData({
							order_id: data.pay_sn,
							order_price: data.p_amount
						});

						that.gotopay();
					}
				}
			});
		},

		gotopay: function(type_id) {
			var that = this;
			var order_price = that.order_price;
			that.setData({
				order_id: that.order_id,
				paymentData: {
					order_id: that.order_id,
					orderSelMoneyAmount: order_price,
					user_money: that.userInfo.user_money
				}
			});

			this.$refs.paymentBox.show();
			return true;

			var param = {
				order_id: this.order_id,
				openid: this.userInfo.openId,
				/* store_id: this.shopInfo.store_id, */
				typ: 'json',
				payment_channel_code: 'wx_native',
				prepay_flag: 1
			};

			var that = this;

			that.$.request({
				url: this.Config.URL.pay.pay,
				data: param,
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.$.requestPayment({
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign,
							success: function(n) {
								that.returnUrl(param.order_id);
							},
							fail: function(e) {},
							complete: function(n) {
								n.errMsg == 'requestPayment:cancel' &&
									(that.$.redirectTo('../rechargeorderdetail/rechargeorderdetail?on=' + param.order_id), that.sendMessage(param.order_id, 1));
							}
						});
					} else {
						that.$.alert(msg);
					}
				},

				fail: function(err) {}
			});
		},
		onCancel: function(e) {
			return;
		},
		onPaid: function(e) {
			let that = this;

			that.$.alert('支付成功！', function() {
				that.$refs.paymentBox.cancel();
				//that.InitPage(that.options);

				//that.notice.postNotificationName("RefreshMessage", e)
				setTimeout(function() {
					that.$.gotopage('/member/card/user_list');
				}, 1500);
			});
		},
		onFail: function(e) {
			let that = this;
			that.$.alert('支付失败！');
			//console.log("支付失败：", e)
		}
	}
};
</script>

<style lang="scss">
@import '../../styles/_variables';

.m-coupon-list {
	// margin-top: 36upx
}

.fix-titlenview-trans {
	background: #f5f6f7;
}

.m-banner-ad {
	width: 100%;
	height: 300upx;
	background: rgba(0, 0, 0, 0);
	opacity: 1;

	position: relative;
}

.m-activity-info {
	// width: 100%;
	height: 140upx;
	background: #ffffff;
	opacity: 1;
	padding: 16upx 24upx;
}

.m-panel {
	margin-top: 0;
}

.m-activity-title {
	font-size: 30upx;
	font-family: PingFang SC;
	font-weight: 400;
	line-height: 42upx;
	color: #002951;
	opacity: 1;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.m-activity-tips {
	font-size: 20upx;
	font-family: PingFang SC;
	font-weight: 400;
	line-height: 28px;
	color: #002951;
	opacity: 0.6;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.m-activity-price {
	font-size: 28upx;
	font-family: Arial;
	font-weight: 400;
	line-height: 28upx;
	color: #ff4142;
	opacity: 1;
	margin-top: 12upx;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
}

.m-footer-btn {
	height: 100upx;
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #fff;
	border-top: 1upx solid #d5d5d5;
	border-radius: 0;
	z-index: 100;
}

.m-footer-btn-main {
	width: 30%;
	height: 100%;
	float: left;
	background-color: $default-skin-bg;
	color: #fff;
	line-height: 100upx;
	font-size: 32upx;
	text-align: center;
	border-radius: 0;
}

.m-footer-btn-list {
	width: 70%;
	height: 100%;
	position: relative;
	float: left;
}

.m-footer-btn-item {
	position: relative;
	float: left;
	width: 100%;
	font-size: 24upx;
	color: #888;
	line-height: 40upx;
	padding: 15upx 0;
	box-sizing: border-box;
	height: 100%;
}

.m-cart-total {
	text-align: right;
	padding-right: 20upx;
}

.m-cart-total text {
	font-size: 36upx;
	color: $default-skin-bg;
}

.m-cart-total label {
	color: $default-skin-bg;
}

.m-code {
	padding: 20upx;
	display: flex;
	justify-content: space-between;
}

/* 弹出层形式的广告 */
.uni-banner {
	width: 70%;
	height: 20%;
	position: fixed;
	left: 50%;
	top: 50%;
	border-radius: 10upx;
	z-index: 99;
	transform: translate(-50%, -50%);
	background: #ffffff;
}

.m-conter {
	width: 100%;
	height: 200upx;
	margin-top: 20upx;
}

.m-canvas {
	position: absolute !important; /*重要的一步是设置绝对定位*/
	margin: auto; /*将四周边距都设为auto自动*/
	left: 0; /*离包含元素的距离均设为零*/
	right: 0;
	top: 0;
	bottom: 0;
}

.tailfoli {
	background: rgba(0, 0, 0, 0.6);
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	z-index: 99;
}

.m-RichText{
	background-color: #ffffff;
}
</style>
