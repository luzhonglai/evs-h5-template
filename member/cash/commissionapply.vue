<template>
	<view class="page">
		<view class="m-tab">
			<view class="m-navbar1">
				<view :class="['m-navbar-item', (tapindex==1?'m-navbar-item-on':'')]" @click="allOrders" v-if="(1 && isMemDist)">
					{{__('佣金提现')}}
				</view>
				<view :class="['m-navbar-item', (tapindex==2?'m-navbar-item-on':'')]" @click="toBePaid" v-if="(isECashCard)">
					{{__('余额提现')}}
				</view>
			</view>
		</view>
		<view :class="(tapindex==1?'':'hide')">
			<view class="topbg">
				<view class="topinfo">
					<view>
						<label v-if="commission.user_commission_now">{{commission.user_commission_now}}</label>
						<label v-else>0</label>
					</view>
					<view>{{__('可转佣金(￥)')}}</view>
				</view>
			</view>
			<view class="m-cells m-cells-form">
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('转入金额')}}</label>
					</view>
					<view class="m-cell-bd">
						<text v-if="commission.user_commission_now">{{__('￥')}}{{commission.user_commission_now}}</text>
						<text v-else>{{__('￥')}}0</text>
						<input class="u-input hide" type="digit" :value="(commission.user_commission_now)" :placeholder="sprintf('最小金额(%.2f)', commission.min_withdraw)"
						 maxlength="6" @input="onInputPrice" />
					</view>
					<view v-if="(!isPrice)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
			</view>
			<view class="m-text-box">
				<view>
					<label class="iconfont icon-14052218"></label>{{__('提现规则')}}
				</view>
				<view>
					<view>{{__('粉丝在店铺内订单支付后你将会获得佣金收益，收益在买家确认收货后成交达成并结算到佣金账户。确认收货后')}}
						<label style="color:red;padding-left:10rpx;">{{commission.withdraw_received_day}}</label>{{__('天佣金可转入余额。订单若发生退款你将不会收到佣金收益。')}}
					</view>
				</view>
			</view>
			<!-- <view class="m-btn-box m-btn-box-two">
              <button class="u-btn u-btn-default" @click="submitdata">{{__('申请提现')}}</button>
              <navigator url="/member/cash/recharge" class="u-btn u-btn-default">{{__('转入余额')}}</navigator>
            </view> -->
			<view class="btn_box hide">
				<button class="u-btn u-btn-default" @click="submitdata">{{__('申请提现')}}</button>
			</view>
			<view class="btn_box">
				<button class="u-btn btn-line-primary" v-if="commission.user_commission_now" @click="move">{{__('转入余额')}}</button>
			</view>
		</view>


		<view :class="(tapindex==2?'':'hide')">
			<view class="topbg">
				<view class="topinfo">
					<view>
						<label>{{canUseCardCashAmount}}</label>
					</view>
					<view>{{__('可提现余额(￥)')}}</view>
				</view>
			</view>
			<view class="m-cells m-cells-form">
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('提现金额')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" :value="(Price)" :placeholder="__('输入提现金额(100的整数倍)')" maxlength="6" @input="onInputPrice" />
					</view>
					<view v-if="(!isPrice)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell" hidden="true">
					<view class="m-cell-hd">
						<label class="u-label">{{__('微信号')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(WXCode)" :placeholder="__('输入微信号')" maxlength="20" @input="onInputWXcode" />
					</view>
					<view v-if="(!isWXcode)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('真实姓名')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(UserRealName)" :placeholder="__('输入真实姓名')" maxlength="20" @input="inputName" />
					</view>
					<view v-if="(!isName)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('手机号码')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" :value="(UserPhone)" :placeholder="__('输入手机号码')" maxlength="11" @input="onInputPhone" />
					</view>
					<view v-if="(!isPhone)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell" hidden="true">
					<view class="m-cell-hd">
						<label class="u-label">{{__('支付宝账号')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" :value="(AlipayAccount)" :placeholder="__('输入支付宝账号(选填)')" @input="inputalipayAccount" />
					</view>
					<view v-if="(!isalipayAccount)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('银行名称')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(BankName)" :placeholder="__('如：上海农业银行七宝支行')" @input="inputbankName" />
					</view>
					<view v-if="(!isbankName)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('银行卡号')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" :value="(BankAccount)" :placeholder="__('输入__银行卡号')" @input="inputbankAccount" />
					</view>
					<view v-if="(!isbankAccount)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('备注')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(withdraw_desc)" :placeholder="__('输入备注(选填)')" @input="inputWithdrawDescAccount" />
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('支付密码')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" password="true" :value="(password)" :placeholder="__('输入支付密码')" @input="inputPasswordAccount" />
					</view>
				</view>
			</view>

			<view class="m-text-box">
				<view>
					<label class="iconfont icon-14052218"></label>{{__('提现规则')}}
				</view>
				<view>
					<view>
						{{__('提示:余额提现只支持全部金额提取，不支持部分金额提取。赠送的金额不支持提现，提现之后赠送的金额会被清零')}}
					</view>
				</view>
			</view>
			<view class="btn_box">
				<button class="u-btn u-btn-default" @click="ApplyToCash">{{__('申请提现')}}</button>
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
		name: "predeposit",
		data: function() {
			return {
				commission: {},
				isPrice: !0,
				Price: 0,
				tapindex: 1,
				isECashCard: !0,
				isMemDist: !0,

				BankAccount: '',
				isbankAccount: !0,
				canUseCardCashAmount: !0,
				WXCode: '',
				isWXcode: '',
				UserRealName: '',
				isName: '',
				UserPhone: '',
				isPhone: '',
				AlipayAccount: '',
				isalipayAccount: !0,
				BankName: '',
				isbankName: '',
				withdraw_desc: '',
				password: ''
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('佣金转入余额')
			});


			var params = {},
				that = this;
			that.$.request({
				url: this.Config.URL.fx.withdraw,
				data: params,
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.setData({
							commission: data
						});
					}
				}
			});

			this.setData({
				isECashCard: !1,
				isMemDist: !1
			})
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			onInputPrice: function(e) {
				let that = this;
				this.setData({
					Price: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isPrice: !1
				}) : this.setData({
					isPrice: !0
				})
			},
			move: function() {
				let that = this;

				if (this.commission.user_commission_now < this.commission.min_withdraw) {
					that.$.showModal(that.sprintf(that.__("亲~可用佣金必须大于 %f 才可以申请！"), this.commission.min_withdraw))
				} else {

					var params = {};
					that.$.request({
						url: this.Config.URL.fx.doWithdraw,
						data: params,
						success: function(data, status, msg, code) {
							if (200 == status) {
								that.$.showModal("已申请转入余额！");

								//设置用户数据
								setTimeout(function() {
									//that.$.navigateBack(1, function() {});
									that.$.gotopage('/member/cash/predeposit');
								}, 2e3)
							} else {
								that.$.showModal(msg)
							}
						}
					});
				}

			},
			inputWithdrawDescAccount: function(e) {

			},
			inputPasswordAccount: function(e) {

			}
		}
	}
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-navbar1 {
		background: $default-skin-bg;
		color: #fff;
		display: flex
	}

	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
	}

	.m-navbar-item:after {
		border: none;
	}

	.m-navbar-item.m-navbar-item-on {
		color: #fff;
		background: $default-skin-bg;
		border-bottom: 2upx solid #fff;
	}

	/* .m-navbar-item.m-navbar-item-on::before {background: $default-skin-bg;content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6upx;border-bottom: 6upx solid #fff;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;} */
	/* .m-tab{position: fixed;width: 100%;top: 0;z-index: 2;} */
	.topbg {
		background-color: $default-skin-bg;
		padding-bottom: 40upx
	}

	.topinfo {
		display: inline-block;
		width: 100%;
		text-align: center;
		color: white;
		font-size: 14px;
		margin-top: 56upx;
		position: relative;
	}

	.topinfo label {
		font-size: 56px;
	}

	.m-text-box {
		font-size: 24upx;
		box-sizing: border-box;
		padding: 20upx;
		color: #888;
		line-height: 40upx;
	}

	.m-text-box label {
		padding-right: 10upx;
	}

	.m-btn-box {
		padding-bottom: 40upx;
	}

	.m-btn-box-two {
		display: flex;
		justify-content: space-around;
	}

	.m-btn-box-two .u-btn {
		width: 45%;
	}

	.m-cell {
		padding: 15upx 30upx;
	}
</style>
