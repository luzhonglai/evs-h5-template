<template>
	<view class="page">
		<view class="m-panel-bd">
			<view class="m-media-box m-media-box-small-appmsg">
				<view :class="{'m-cells':1, iconBoxLattice:false}">

						<navigator url="/member/member/data"
						 class="m-cell m-cell-access">
							<view class="m-cell-hd " style="color:#DB384C">
								<label class="iconfont zc zc-yaoqinghaoyou"></label>
							</view>
							<view class="m-cell-bd m-cell-primary">
								<p>{{__('基本信息')}}</p>
							</view>
							<text class="m-cell-ft"></text>
						</navigator>

						<navigator url="/member/member/bindphone"
						 class="m-cell m-cell-access">
							<view class="m-cell-hd " style="color:#DB384C">
								<label class="iconfont zc zc-mobile"></label>
							</view>
							<view class="m-cell-bd m-cell-primary">
								<p>{{__('登录密码')}}</p>
							</view>
							<text class="m-cell-ft"></text>
						</navigator>

                        <navigator url="/member/member/paypwd" v-if="isShowMoney"
                         class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#DB384C">
                        		<label class="iconfont zc zc-mima"></label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('支付密码')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator url="/member/member/certification"
                         class="m-cell m-cell-access" v-if="true">
                        	<view class="m-cell-hd " style="color:#DB384C">
                        		<label class="iconfont zc zc-shimingrenzheng"></label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('实名认证')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

						<navigator url="/member/member/certifiedsns"
						 class="m-cell m-cell-access" v-if="Config.SNS_ENABLE && false">
							<view class="m-cell-hd " style="color:#DB384C">
								<label class="iconfont zc zc-shimingrenzheng"></label>
							</view>
							<view class="m-cell-bd m-cell-primary">
								<p>{{__('认证会员')}}</p>
							</view>
							<text class="m-cell-ft"></text>
						</navigator>

						<navigator url="/member/member/protocol?id=withdraw_protocols_description"
						 class="m-cell m-cell-access" v-if="false">
							<view class="m-cell-hd " style="color:#DB384C">
								<label class="iconfont zc zc-daipingjia"></label>
							</view>
							<view class="m-cell-bd m-cell-primary">
								<p>{{__('提现协议')}}</p>
							</view>
							<text class="m-cell-ft"></text>
						</navigator>

						<navigator url="/member/cash/bankcard-list"
								   class="m-cell m-cell-access" v-if="true">
							<view class="m-cell-hd " style="color:#DB384C">
								<label class="iconfont zc zc-yinhangqia"></label>
							</view>
							<view class="m-cell-bd m-cell-primary">
								<p>{{__('提现账户')}}</p>
							</view>
							<text class="m-cell-ft"></text>
						</navigator>

						<navigator url="/member/member/protocol?id=reg_description&no_btn=1"
								   class="m-cell m-cell-access" v-if="true">
							<view class="m-cell-hd " style="color:#DB384C">
								<label class="iconfont zc zc-daipingjia"></label>
							</view>
							<view class="m-cell-bd m-cell-primary">
								<p>{{__('隐私政策')}}</p>
							</view>
							<text class="m-cell-ft"></text>
						</navigator>
				</view>
			</view>
		</view>
        <view class="m-panel-bd">
			<view class="m-media-box m-media-box-small-appmsg">
				<view :class="{'m-cells':1, iconBoxLattice:false}">

                    <navigator url="/member/member/feedback" class="m-cell m-cell-access">
                    	<view class="m-cell-hd " style="color:#DB384C">
                    		<label class="iconfont icon-yonghufankui1"></label>
                    	</view>
                    	<view class="m-cell-bd m-cell-primary">
                    		<p>{{__('用户反馈')}}</p>
                    	</view>
                    	<text class="m-cell-ft"></text>
                    </navigator>
				</view>
			</view>
		</view>

        <view class="m-panel-bd" v-if="logoutFlag">
        	<view class="m-media-box m-media-box-small-appmsg">
        		<view :class="{'m-cells':1, iconBoxLattice:false}">
                    <view class="m-cell m-cell-access" @click="cleanCache">
                        <view class="m-cell-hd " style="color:#DB384C">
                            <label class="iconfont zc zc-logout"></label>
                        </view>
                        <view class="m-cell-bd m-cell-primary">
                            <label>{{__('退出登录')}}</label>
                            <!-- #ifdef MP-WEIXIN -->
                            <label style="color:#717171;margin-right:8upx;float:right;"  v-if="(PersonalCenterList.type!=2)">{{currentSize}}KB</label>
                            <!-- #endif -->
                        </view>
                        <text class="m-cell-ft"></text>
                    </view>
        		</view>
        	</view>
        </view>
		
		<view class="m-tips" style="margin:30upx 0" v-if="(!IsChannel)">
			<view class="m-tips-logo">
				<image lazy-load mode="aspectFit" src="/static/images/logo_tech.png"></image>
			</view>
			<view class="m-tips-str">{{__('商城套件系统提供技术支持')}} {{versionNumber}}</view>
		</view>
		<view class="m-tips" style="margin:30upx 0" v-else>
			<view class="m-tips-str">{{versionName}}{{versionNumber}}</view>
		</view>
		<view class='msk' v-if='(isGetnum&&isStorage&&isFlagPhoto&&isWexinMobile)'>
			<view class='model'>
				<view class='hint'>
					<view class='title'>{{__('绑定手机号')}}</view>
					<view class='content'>{{__('您当前尚未绑定手机号，建议您绑定以获得更多优惠资讯')}}</view>
				</view>
				<view class='operation'>
					<view class='cancel' @click='cancel'>{{__('取消')}}</view>
					<button class='success' bindgetphonenumber='getPhoneNumber' open-type='getPhoneNumber'>{{__('确定')}}</button>
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
		data: function() {
			return {
				Info: '',
				UserInfo: {
					user_nickname: "新用户",
					user_avatar: "",
				},
				resource: {
					user_points: 100
				},
				versionNumber: '',
				versionName: '',
				IsChannel: !0,
				PersonalCenterList: {},
				isMembership: !0,
				isCoupon: !0,
				isCutPrice: !0,
				isECashCard: !0,
				isMemDist: !0,
				isFightGrp: !0,
				isAbtVendor: !0,
				currentSize: 0,
				limitSize: 0,

				isStorage:false,
				isGetnum:false,
				logoutFlag: 1,
				isShowMoney:true
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(opt) {
			uni.setNavigationBarTitle({
				title:this.__('用户设置')
			});

			var that = this;
			
			// #ifdef MP-WEIXIN
			that.logoutFlag = 0;
			// #endif
			
			// #ifdef H5
			if (that.$.isWeixin()) {
				that.logoutFlag = 0;
			}
			// #endif

			this.forceUserInfo(function (user) {
			});

            this.getPlantformInfo(function(plantformInfo) {
				//如果启用了支付方式
				if (that.$.inArray(plantformInfo.payment_channel_code_row, 'money'))
				{
					that.isShowMoney = true;
				}
				else
				{
					that.isShowMoney = false;
				}
            });

			that.load();
		},

		onShow: function(opt) {
			let that = this;
			/*
			const info = that.$.storage.info();

			this.setData({
				currentSize: Math.round(info.currentSize * 100) / 100,
				limitSize: Math.round(info.limitSize / 1024 * 100) / 100
			})
			*/

			this.setData({
				UserInfo: this.userInfo
			});


			this.showCartNum();
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
			load: function() {
				var that = this;


				this.getPlantformInfo(function (plantformInfo) {
                    that.setData({
                        //IsChannel: this.shopInfo.IsChannel,
                        versionNumber: plantformInfo.version,
                        versionName: plantformInfo.name

                    })
                });

				var that = this,
					params = { /*store_id: this.shopInfo.store_id*/ }

				//判断系统，调取对应网址
				var url = this.Config.URL.store.menu
				url = this.Config.URL.center_menu

				that.$.request({
					url: url,
					data: params,
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success: function(data, status, msg, code) {
						that.setData({
							PersonalCenterList: data.menu
						})
					}
				})

				that.$.getStorage({
					key: 'cancel',
					success: function(e) {
						e.data == 'yes' ? that.setData({
							isStorage: !1
						}) : that.setData({
							isStorage: !0
						})
					},
					fail: function(e) {
						that.setData({
							isStorage: !0
						})
					}
				})
			},

			cancel: function() {
				let that = this;
				this.setData({
					isGetnum: !1
				}), that.$.setStorage({
					key: 'cancel',
					data: 'yes'
				})
			},

			getPhoneNumber: function(e) {
				var that = this
				that.$.login({
					success: function(n) {
						var r = {
							//vendorId: that.cf.storeId,
							userId: that.userInfo.Id,
							encryptData: e.detail.encryptedData,
							encryptDataIV: e.detail.iv,
							code: n.code
						}
						that.$.xsr(that.$.makeUrl(user.UpdateUserWexinMobile, r), function(e) {
							e.Code == 0 && (that.userInfo.Phone = e.Info, that.setData({
								isGetnum: !1
							}))
						})
					}
				})
			},

			selectAddress: function(e) {
				var that = this;
				that.$.gopage('/member/address/list')
				/*that.$.chooseAddress({
						success: function (that)
						{
								that.$.navigateTo("/member/address/list");
						}, fail: function (that)
						{
								that.$.navigateTo("/member/address/list");
						}
				})*/
			},

			goTabBar: function(e) {
				var that = this
				that.$.goToTabBar(that, e.currentTarget.dataset.url)
			},

			cleanCache: function(e) {
				var that = this
				const index = e.currentTarget.dataset.index
				const path = e.currentTarget.dataset.path

				that.$.confirm(that.__('确定要退出登录吗？'), function(data) {
					if (data.confirm)
					{
						that.$.request({
							url: that.Config.URL.logout,
							success: function(data, status, msg, code) {
								// #ifdef APP-PLUS
								plus.navigator.removeAllCookie();
								// #endif

								// #ifdef H5
									var date=new Date();
									date.setTime(date.getTime()-10000);
									var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
									if (keys) {
										for (var i =  keys.length; i--;)
											document.cookie=keys[i]+"=0; expire="+date.toGMTString()+"; path=/";
									}
								// #endif

								that.$Socket.nclose();
								that.$.storage.removeItem('uid');
								that.$.storage.removeItem('ukey');
								
								
								const language = uni.getStorageSync('language')
								
								that.$.storage.clear();
								
								//如果不在允许的语言内，可重置
								uni.setStorageSync('language', language);
								
								// #ifdef MP-WEIXIN
								var info = that.$.storage.info();
								
								that.setData({
									currentSize: Math.round(info.currentSize * 100) / 100,
								    limitSize: Math.round((info.limitSize / 1024) * 100) / 100
								});
								// #endif

								//退出登录
								that.logout(true);
							}
						})
					}
				}, true)
			},
			distributionWeStore: function(e) {
				var that = this;
				that.$.gopage("/pagesub/westore/index");

				//let url = that.$.sprintf('%s/tmpl/member/plantform_invite.html?u_id=%d&opener=uni&sss=ssss', that.Config.WapSiteUrl, that.userInfo.user_id);
				//that.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(url) + "&tn=" + '推广中心' + "&tc=" + '#ff6700' + "&tb=" + 'white')
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables.scss";

	.member-top {
		-webkit-animation: changeBg 20s infinite;
		animation: changeBg 20s infinite;
		background-color: #ff6700;
		background-image: url("data:image/png;base64,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");
		background-size: cover;
		text-align: center;
		width: 100%;
		/*height: 11rem;*/

		overflow: hidden;
		height: 480upx; /* 320 */

		color: #fff;
		position: relative;
		z-index: 1;
	}

	@-webkit-keyframes changeBg {
		0% {
			background-color: #ff6700
		}

		90% {
			background-color: #ff6700
		}

		10% {
			background-color: #FB6E52
		}

		20% {
			background-color: #FFCE55
		}

		30% {
			background-color: #A0D468
		}

		40% {
			background-color: #48CFAE
		}

		50% {
			background-color: #4FC0E8
		}

		60% {
			background-color: #5D9CEC
		}

		70% {
			background-color: #AC92ED
		}

		80% {
			background-color: #EC87BF
		}
	}

	@keyframes changeBg {
		0% {
			background-color: #ff6700
		}

		90% {
			background-color: #ff6700
		}

		10% {
			background-color: #FB6E52
		}

		20% {
			background-color: #FFCE55
		}

		30% {
			background-color: #A0D468
		}

		40% {
			background-color: #48CFAE
		}

		50% {
			background-color: #4FC0E8
		}

		60% {
			background-color: #5D9CEC
		}

		70% {
			background-color: #AC92ED
		}

		80% {
			background-color: #EC87BF
		}
	}

	.m-banner-img {
		width: 100%;
		/*height: 200upx;*/
		vertical-align: top;
		position: relative;
	}

	.m-user-info {
		position: absolute;
		top: 115upx;
		width: 140upx;
		height: 140upx;
		text-align: center;
		left: 50%;
		margin-left: -70upx;
		z-index: 3;
		color: #666;
	}

	.m-user-info image {
		width: 140upx;
		height: 140upx;
		border-radius: 120upx;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);
	}

	.m-user-info text {
		line-height: 70upx;
		display: block;
		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #fff;
		font-weight: bold;
	}

	.m-user-info .Phone {
		width: 140upx;
		height: 140upx;
		border-radius: 120upx;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);
		overflow: hidden;
	}

	.m-user-info .NickName {
		line-height: 70upx;
		display: block;
		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.member-order-tab {
		font-size: 12px;
		text-align: center;
		background: rgba(0, 0, 0, .1);
		line-height: 20px;
		/*box-shadow: 0px 0upx 10upx rgba(0, 0, 0, 0.35);*/

		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.i-type {
		font-size: 40upx;
	}

	.m-cell-hd {
		text-align: center;
		line-height: 56upx;
	}

	.member-order-tab .g-flex-item {
		padding: 28upx 0 20upx 0;
	}

	.member-order-tab .g-flex-item:active {
		background-color: #ececec;
	}

	.my_od {
		border-left: 1px solid #dfdfdf;
	}

	.all_order {
		position: relative;
		display: block;
	}

	.m-panel-bd {
		margin-top: 20upx;
	}

	.m-panel-bd label {
		vertical-align: middle;
		font-size: 50upx;
		margin: 0upx 10upx;
	}

	.m-cell-primary {
		font-size: 14px;
		margin-top: 10upx;

		label {
			font-size: 14px;
		}
	}

	.m-animate-img {
		width: 100%;
		height: 250upx;
		overflow: hidden;
		-webkit-animation: imageAnimation 15s linear infinite alternate;
		animation: imageAnimation 15s linear infinite alternate;
		webkit-backface-visibility: hidden;
		-webkit-filter: blur(5px);
		filter: blur(5px);
		margin-top: -20px;
	}

	.m-animate-warp {
		overflow: hidden;
		height: 200upx;
		-webkit-animation: imageAnimation 15s linear infinite alternate;
		animation: imageAnimation 15s linear infinite alternate;
	}

	@-webkit-keyframes imageAnimation {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: 0 100%;
		}
	}

	@keyframes imageAnimation {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: 0 100%;
		}
	}

	.iconBoxLattice .m-cell {
		display: inline-block;
		width: 25%;
		box-sizing: border-box;
		text-align: center;
		border-right: 1upx solid #f8f8f8;
		border-bottom: 1upx solid #f8f8f8;
	}

	.iconBoxLattice .m-cell .iconfont {
		font-size: 60upx;
	}

	.iconBoxLattice .m-cell::before {
		border: none;
	}

	.iconBoxLattice .m-cell p {
		font-size: 24upx;
	}

	.iconBoxLattice .m-cell label {
	    font-size: 24upx;
	}

	.iconBoxLattice .m-cell label.iconfont {
	    font-size: 60upx;
	}


	.iconBoxLattice .m-cell image {
		display: inline-block !important;
		margin: 0 !important;
		padding: 0 !important;
		width: 60upx !important;
		height: 60upx !important;
	}

	.iconBoxLattice .m-cell-ft {
		display: none;
	}


	.msk {
		position: fixed;
		top: 0;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
	}

	.model {
		width: 80%;
		height: 290upx;
		background: #fff;
		border-radius: 6upx;
		margin: auto;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0
	}

	.hint {
		height: 200upx;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.hint::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-bottom: 1px solid #e5e5e5;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 200%;
		height: 200%;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		-webkit-transform-origin: left top;
		transform-origin: left top;
	}

	.hint .title {
		font-size: 36upx;
	}

	.hint .content {
		width: 80%;
		color: #999999;
		font-size: 30upx;
		margin-top: 20upx
	}

	.operation {
		height: 90upx;
		display: flex;
		align-items: center
	}

	.cancel,
	.success {
		flex: 1;
		background: #fff;
		height: 90upx;
		font-size: 36upx
	}

	button::after {
		line-height: none
	}

	.cancel {
		position: relative;
		text-align: center;
		line-height: 90upx
	}

	.success {
		color: #3cc51f;
		padding: 0
	}

	.cancel::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-right: 2px solid #e5e5e5;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 200%;
		height: 200%;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		-webkit-transform-origin: left top;
		transform-origin: left top;
	}

	.m-cell-bd label{
		margin: 0upx 5upx;
	}
</style>
