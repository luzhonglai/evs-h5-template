<template>
	<!-- #ifdef MP-WEIXIN -->
	<view class="content" v-if="!userInfo.user_mobile">
		<!-- 头部logo -->
		<view class="header">
			<image :src="logo"></image>
		</view>
		<view class="btn_box"><button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="login-but">微信手机快捷登录</button></view>
	</view>
	
	<view class="page" v-else>
		<view class="m-cells m-cells-form">
					<view class="m-cell">
						<view class="m-cell-hd"><label class="u-label">{{__('手机号码')}}</label></view>
						<view class="m-cell-bd" style="display: inherit;">
							<block v-if="userInfo.user_mobile && Phone == userInfo.user_mobile">
								<view style="width: 400rpx;height: 48rpx;">{{user_intl}}{{Phone}}</view>
							</block>
							<block v-else-if="langSetComplete">
								<!-- 国家区号 -->
								<picker mode="selector" @change="onIntlChange" :value="mode_index" :range="langLists" range-key="name" style="width: 80rpx;text-align: center;">
									<view class="country-int-code" style="color:#000000">{{user_intl}}</view>
								</picker>
		
								<input class="u-input" type="number"   style="width: 400rpx;height: 48rpx;"  v-model="Phone" :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone" />
							</block>
						</view>
						<view v-if="!isPhone" class="m-cell-ft">
							<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
						</view>
					</view>
		
					<view class="m-cell">
						<view class="m-cell-hd"><label class="u-label">{{__('登录密码')}}</label></view>
						<view class="m-cell-bd"><input class="u-input" type="text" v-model="password" :placeholder="__('可在其它终端通过手机及密码登录')"
							 @input="onInputPassword" /></view>
						<view v-if="!isPassword" class="m-cell-ft">
							<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
						</view>
					</view>
		
					<view class="m-cell m-cell-vcode">
						<view class="m-cell-hd"><label class="u-label">{{__('验证码')}}</label></view>
						<view class="m-cell-bd"><input class="u-input" type="number" :placeholder="__('请输入验证码')" maxlength="6" @input="inputcode" /></view>
						<view v-if="!isCode" class="m-cell-ft">
							<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
						</view>
						<view v-if="isSend" @tap="sendmessage" class="m-vcode-btn">{{btntext}}</view>
						<view v-else class="m-vcode-btn">{{btntext}}</view>
					</view>
				</view>
				<view class="btn_box"><button class="u-btn u-btn-default" @tap="submitdata">{{__('保存')}}</button></view>
		
				<view class="content" v-if="false">
					<view>
						<button @click="openCodeDialog">{{__('发送验证码 - 保存按钮 - 根据手机号发送验证码 - 填写验证码后直接提交')}}</button>
						<view>{{sprintf(__('验证码为：%s'), code)}}</view>
					</view>
					<verifycode-dialog :show="showCodeDialog" :len="6" :autoCountdown="true" :phone="'139****7978'" v-on:change="change"></verifycode-dialog>
		</view>
	</view>
	
	<!-- #endif -->
	<!-- #ifndef MP-WEIXIN -->
	<view class="page">
		<view class="m-cells m-cells-form">
					<view class="m-cell">
						<view class="m-cell-hd"><label class="u-label">{{__('手机号码')}}</label></view>
						<view class="m-cell-bd" style="display: inherit;">
							<block v-if="userInfo.user_mobile && Phone == userInfo.user_mobile">
								<view style="width: 400rpx;height: 48rpx;">{{user_intl}}{{Phone}}</view>
							</block>
							<block v-else-if="langSetComplete">
								<!-- 国家区号 -->
								<picker mode="selector" @change="onIntlChange" :value="mode_index" :range="langLists" range-key="name" style="width: 80rpx;text-align: center;">
									<view class="country-int-code" style="color:#000000">{{user_intl}}</view>
								</picker>
		
								<input class="u-input" type="number"   style="width: 400rpx;height: 48rpx;"  v-model="Phone" :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone" />
							</block>
						</view>
						<view v-if="!isPhone" class="m-cell-ft">
							<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
						</view>
					</view>
		
					<view class="m-cell">
						<view class="m-cell-hd"><label class="u-label">{{__('登录密码')}}</label></view>
						<view class="m-cell-bd"><input class="u-input" type="text" v-model="password" :placeholder="__('可在其它终端通过手机及密码登录')"
							 @input="onInputPassword" /></view>
						<view v-if="!isPassword" class="m-cell-ft">
							<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
						</view>
					</view>
		
					<view class="m-cell m-cell-vcode">
						<view class="m-cell-hd"><label class="u-label">{{__('验证码')}}</label></view>
						<view class="m-cell-bd"><input class="u-input" type="number" :placeholder="__('请输入验证码')" maxlength="6" @input="inputcode" /></view>
						<view v-if="!isCode" class="m-cell-ft">
							<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
						</view>
						<view v-if="isSend" @tap="sendmessage" class="m-vcode-btn">{{btntext}}</view>
						<view v-else class="m-vcode-btn">{{btntext}}</view>
					</view>
				</view>
				<view class="btn_box"><button class="u-btn u-btn-default" @tap="submitdata">{{__('保存')}}</button></view>
		
				<view class="content" v-if="false">
					<view>
						<button @click="openCodeDialog">{{__('发送验证码 - 保存按钮 - 根据手机号发送验证码 - 填写验证码后直接提交')}}</button>
						<view>{{sprintf(__('验证码为：%s'), code)}}</view>
					</view>
					<verifycode-dialog :show="showCodeDialog" :len="6" :autoCountdown="true" :phone="'139****7978'" v-on:change="change"></verifycode-dialog>
		</view>
	</view>
	<!-- #endif -->
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import verifycodeDialog from '../../components/verifycode-dialog/verifycode-dialog.vue';
	export default {
		name: 'asset',
		data: function() {
			return {
				logo:"",
				mode_index: 0,
				user_intl: '',
				Phone: '',
				password: '',
				Code: '',
				btntext: this.__('发送'),
				isSend: !0,
				isPhone: !0,
				sendTime: 120,
				isCode: !0,
				isPassword: !0,
				setDefaultLang: false,
				langSetComplete: false,
				showCodeDialog: false,
				code: "1231",
				langLists: []
			};
		},
		components: {
			verifycodeDialog,
		},

		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
			
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('绑定手机')
			});

			var that = this;
			
			// 未设置手机号时，显示
			if (!this.userInfo.user_mobile) {
				that.setData({
					setDefaultLang: !0
				})
			}
			that.initLang();
			
						
			that.setData({
				user_intl: that.getUserIntl(that.userInfo.user_intl),
				Phone: that.userInfo.user_mobile,
			})
			
			if (this.userInfo.user_mobile) {
				that.$.setNavigationBarTitle({
					title: this.__("修改密码")
				});
			}
			// #ifdef MP-WEIXIN
			uni.setNavigationBarTitle({
				title: this.__('绑定手机')
			});
			// #endif
			
			
			setTimeout(()=>{
				this.getPlantformInfo((plantformInfo)=> {
					this.logo = plantformInfo.logo;
				});
			}, 200);
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			initLang() {
				var that = this;
				let lists = [];
				for (let idx in this.Lang.data.items) {
					lists.push({
						id: this.Lang.data.items[idx].currency_id,
						name: this.Lang.data.items[idx].label + '(+' + this.Lang.data.items[idx].currency_id + ')'
					})
					console.info(this.Lang.data.items[idx].currency_id, this.Lang.data.items[idx].label)

					if (that.setDefaultLang && idx == this.mode_index) {
						this.user_intl = '+' + this.Lang.data.items[idx].currency_id;
					}
				}

				that.setData({
					langLists : lists,
					langSetComplete: !0
				});
			},
			getPhoneNumber: function(e){
			    var that = this
			    that.$.request({
			        url: this.Config.URL.wx.get_user_phone_number,
			        data: {
			            'code': e.detail.code
			        },
			        dataType: 'json',
			        success: function(data, status, msg, code) {
			            if (status == 200) {
							that.$.confirm(that.__('手机号绑定成功！'));
							that.cleanCache();
							that.login(data);
							setTimeout(() => that.$.backpage(1), 2000);
			            }
			        }
			    });
			},
			
			getPhoneNumber: function(e) {
			    var that = this
				
				// 允许授权
				if(typeof e.detail.code !== "undefined"){
					//调用接口利用 e.detail.encryptedData, e.detail.iv 信息来解密手机号
					that.$.request({
						url: this.Config.URL.wx.get_user_phone_number,
						data: {
							'code': e.detail.code
						},
						dataType: 'json',
						success: function(userInfo, status, msg, code) {
							if (status == 200) {
								that.$.request({
									url: that.Config.URL.user.overview,
									success: function(data, status, msg, code) {
										userInfo = Object.assign(userInfo, data.member_info);
										
										//that.cleanCache();
										that.login(userInfo);
							
										setTimeout(() => that.$.backpage(1), 2000);
									}
								});
							}
							else
							{
								that.$.confirm(msg);
							}
						}
					});
				} else {
					that.$.confirm(that.__("请允许手机授权！"));
				}
			},
			
			cleanCache: function(e) {
				var that = this;
				const language = uni.getStorageSync('language')

				that.$.storage.clear();

				//如果不在允许的语言内，可重置
				uni.setStorageSync('language', language);

				// #ifdef MP-WEIXIN
				var info = that.$.storage.info();
				// #endif

				//退出登录
				that.logout(true);
			},
			
			getUserIntl: function(userInfoIntl) {
				let that = this;
				if (that.setDefaultLang) {
					return that.user_intl;
				}
				if (that.user_intl.length > 1) {
					return that.user_intl;
				}
				return that.user_intl + userInfoIntl;
			},
			onIntlChange: function(e) {
				var that = this;
				var index = e.detail.value
				this.setData({
					mode_index: e.detail.value,
					user_intl : '+' + this.langLists[index].id
				})
			},
			change: function(res) {
				if (res.type == 1) {
					this.code = res.code;
					this.showCodeDialog = false;
				} else if (res.type == -1) {
					this.code = this.__("请输入验证码");
					this.showCodeDialog = false;
				} else {
					setTimeout(function() {
						res.resendCall()
					}, 3000)
				}


			},
			openCodeDialog: function() {
				this.showCodeDialog = true;
			},

			inputphone: function(e) {
				let that = this;
				this.setData({
					Phone: e.detail.value
				});

				if (that.$.isNull(e.detail.value)) {
					this.setData({
						isPhone: !1
					});
				} else {
					if (that.$.tel(e.detail.value, this.user_intl)) {
						this.setData({
							isPhone: !0
						})
					}
					else
					{
						this.setData({
							isPhone: !1
						});
					}
				}
			},
			onInputPassword: function(e) {

			},

			inputcode: function(e) {
				let that = this;
				this.setData({
						Code: e.detail.value
					}),
					that.$.isNull(e.detail.value) ?
					this.setData({
						isCode: !1
					}) :
					this.setData({
						isCode: !0
					});
			},
			sendmessage: function() {
				let that = this;
				//console.info(this.Phone)
				if (that.$.isNull(this.Phone)) {
					this.setData({
						isPhone: !1
					});
				} else if (that.$.tel(this.Phone, this.user_intl)) {
					if (false && this.Phone && this.Phone == this.userInfo.user_mobile) that.$.confirm(that.__('你已经绑定过该手机！'));
					else if (this.isSend) {
						this.setData({
							isSend: !1
						});

						var t = this.sendTime;
						var params = {
							user_intl: that.user_intl,
							mobile: that.user_intl + this.Phone
						};
						that.$.request({
							url: this.Config.URL.account.get_mobile_checkcode,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									var r = setInterval(function() {
										t > 0 ?
											that.setData({
												btntext: t-- + 's'
											}) :
											(that.setData({
													isSend: !0,
													sendTime: 120,
													btntext: that.__('重新发送')
												}),
												clearInterval(r));
									}, 1e3);
								} else {
									that.setData({
											isSend: !0
										}),
										that.$.alert(msg);
								}
							}
						});
					}
				} else {
					this.setData({
						isPhone: !1
					});
				}
			},
			submitdata: function() {
				let that = this;
				if (that.$.isNull(this.Phone))
					this.setData({
						isPhone: !1
					});
				else if (that.$.tel(this.Phone, this.user_intl))
					if (false && this.Phone == this.userInfo.user_mobile) {
						that.$.confirm(that.__('你目前已经绑定该手机！'));
					}
				else if (that.$.isNull(this.Code))
					this.setData({
						isCode: !1
					});
				else if (that.$.isNull(this.password)) {
					this.setData({
						isPassword: !1
					});
				} else {
					var params = {
						mobile: that.user_intl + this.Phone,
						password: this.password,
						auth_code: this.Code,
						user_intl: that.user_intl
					};
					that.$.request({
						url: this.Config.URL.account.bind_mobile,
						data: params,
						success: function(data, status, msg, code) {
							
							if (status == 200) {
								let userInfo = {};
								
								if(data.commonResult) {
									userInfo = data.commonResult;
									
									var id = that.$.setStorageSync('uid', userInfo.user_id);
									var key = that.$.setStorageSync('ukey', userInfo.key);
									
									
									// 如果切换新账号重新登陆
									that.$.request({
										url: that.Config.URL.user.overview,
										success: function(data, status, msg, code) {
											userInfo = Object.assign(userInfo, data.member_info);
											
											//that.cleanCache();
											that.login(userInfo);
											
											that.$.showModal(that.__('操作成功'), function() {
												that.$.backpage(1);
											});
										}
									});
								} else {
									userInfo['as'] = 1;
									that.login(userInfo);
									
									that.$.showModal(that.__('操作成功'), function() {
										that.$.backpage(1);
									});
								}
							} else {
								that.$.confirm(msg);
							}
						}
					});
				} else
					this.setData({
						isPhone: !1
					});
			}
		}
	};
</script>


<style lang="scss">
	@import '../../styles/_variables.scss';

	.content {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;

	  /* margin-top: 128upx; */
	}

	/* 头部 logo */

	.header {
	  width: 161upx;
	  height: 161upx;
	  box-shadow: 0upx 0upx 60upx 0upx rgba(0, 0, 0, 0.1);
	  border-radius: 50%;
	  background-color: $main-skin-color;
	  /*
	  margin-top: 80upx;
	  margin-bottom: 60upx;
	   */
	  margin-top: 40upx;
	  margin-bottom: 20upx;
	  margin-left: auto;
	  margin-right: auto;

	  image {
		width: 161upx;
		height: 161upx;
		border-radius: 50%;
	  }
	}

	.m-cell-vcode {
		padding-top: 0;
		padding-right: 0;
		padding-bottom: 0;
	}

	.m-vcode-img {
		width: 216upx;
		height: 88upx;
	}

	.btn_box {
		padding: 20upx;
	}

	.m-code {
		right: 210upx;
	}

	.m-vcode-btn {
		width: 150upx;
		text-align: center;
	}
	.login-but {
		background-color: red;
		color: white;
	}
</style>
