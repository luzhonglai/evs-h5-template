<template>
	<view class="login">
		<view class="auth-pop" v-if="(isMpWeixin && !isAuthorizationed)">
		    <view class="auth-box">
		        <image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/shield.png"></image>
		        <label>{{__('新用户注册')}}</label>
		        <view class="">
		        	<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"><image class="avatar" :src="user_avatar ? user_avatar : '/static/images/user_no_avatar.png'"></image></button>
		        	<view class="m-cells m-cells-form">
		        		<view class="m-cell">
		        			<view class="m-cell-hd">
		        				<label class="u-label">{{ __('昵称') }}</label>
		        			</view>
		        			<view class="m-cell-bd"><input type="nickname" class="weui-input" :placeholder="__('请输入昵称')" @blur="bindblur" @input="bindinput" /></view>
		        		</view>
		        	</view>
		        </view>

				<view class="btn-row" style="margin-top: 40upx;padding:10upx 20upx">
					<checkbox-group @change="onChangeProtocol">
						<label>
							<checkbox :checked="protocol_checked" value="1" />
						</label>
						<label @tap="showProtocol('reg_protocols_description')">
		                    {{__('同意')}}{{__('《用户协议》')}}
						</label>
					</checkbox-group>
				</view>

		            <button  type="primary" @click="getUserProfile">{{__('一键注册')}}</button>
		    </view>
		</view>
		<view class="content"  v-else-if="isMpWeixin && showMpBindMobileFlag">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logo"></image>
			</view>
			<view class="btn_box"><button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="login-but">微信手机快捷登录</button></view>
		</view>
		<view class="content" v-else>
			<!-- 头部logo -->
			<view class="header">
				<image :src="logo"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput
					v-if="bind_type==1"
					v-model="account"
					type="text"
					isShowIntl
					@intl="intlChange"
					:placeholder="__('请输入手机号码')"
				></wInput>

				<wInput
					v-if="bind_type==2 || bind_type==3"
					v-model="account"
					type="text"
					:placeholder="__('请输入账号')"
				></wInput>
				<wInput
					v-model="password"
					type="password"
					 :placeholder="__('请输入密码')"
					 isShowPass
				></wInput>
			</view>
			<wButton
				:text="__('登 录')"
				:rotate="isRotate"
				@click.native="bindLogin()"
				class="wbutton"
			></wButton>


			<!-- 其他登录 -->
			<!-- #ifdef H5 -->
			<view class="other_login cuIcon">
				<view class="login_icon" v-for="provider in providerList" :key="provider.value"  v-if="(provider.value !== 'apple')">
					<!-- wap app -->
					<!-- <view class="cuIcon-item"><image :src="provider.image" @tap="plus_oauth(provider.value)"></image></view> -->
					<view class="cuIcon-item"><image :src="provider.image" @tap="h5_oauth(provider.value)"></image></view>
				</view>

				<view class="login_icon">
					<view class="cuIcon-item"><image src="/static/images/login/phone.png" @tap="onChangeBindType(1)"></image></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-item"><image src="/static/images/login/email.png" @tap="onChangeBindType(2)"></image></view>
				</view>
			</view>
			<!-- #endif -->

			<!-- #ifndef H5 -->
			<view class="other_login cuIcon">
				<view class="login_icon" v-for="provider in providerList" :key="provider.value">
					<view class="cuIcon-item"><image :src="provider.image" @tap="oauth(provider.value)"></image></view>
				</view>

				<view class="login_icon">
					<view class="cuIcon-item"><image src="/static/images/login/phone.png" @tap="onChangeBindType(1)"></image></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-item"><image src="/static/images/login/email.png" @tap="onChangeBindType(2)"></image></view>
				</view>
			</view>
			<!-- #endif -->


			<!-- 底部信息 -->
			<view class="footer">
				<view @click="onChangeBindType(3)">{{__('账号密码登录')}}</view>
				<text>|</text>
				<navigator url="/pagesub/login/forget" open-type="navigate">{{__('找回密码')}}</navigator>
				<text>|</text>
				<navigator url="/pagesub/login/register" open-type="navigate">{{__('注册账号')}}</navigator>
			</view>


			<view class="content" v-if="false">
				<button type="default" @click="jy_facebookLogin()">facebook登录</button>
				<button type="default" @click="jy_standardLog()">标准记录（无参数）</button>
				<button type="default" @click="jy_standardLogWithParams()">标准记录（有参数）</button>
				<button type="default" @click="jy_facebookShareUrl()">分享链接</button>
				<button type="default" @click="test()">Add to cart</button>

			</view>
		</view>
	</view>
</template>



<script>
import wInput from '../../components/watch-login/watch-input.vue' //input
import wButton from '../../components/watch-login/watch-button.vue' //button

// #ifdef H5
import $cookies from '../../helpers/vue-cookies';
// #endif

/*
//获取当前路由
let curPage = getCurPage();
//在微信小程序或是app中，通过curPage.options；如果是H5，则需要curPage.$route.query（H5中的curPage.options为undefined，所以刚好就不需要条件编译了）
let curParam = curPage.options || curPage.$route.query;

export function getCurPage(){
    let pages = getCurrentPages();
    let curPage = pages[pages.length-1];
    return curPage
}
*/

import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
			options:{},
            connect: {},
            providerList: [],
            hasProvider: false,
            logo: '',
            account: '',
            password: '',
            positionTop: 0,
            protocol_checked: false,

            isAuthorizationed: false,
            isMpWeixin: false,
            showMpBindMobileFlag: false,
            wxwork: 0, //是否企业微信

			isMpToutiao: false,
			plusOauthWeixin: {},

			bind_type: 3,  //1:手机号注册   2:email 注册

			user_intl: '',


			system: '', // 系统版本
			platform: '',   // 平台

			client_info: '{}',

			data:{},
			
			user_avatar: '',
			user_nickname:'',


			isRotate: false, //是否加载旋转
        };
    },
	components:{
		wInput,
		wButton,
	},
    computed: mapState([
        'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin',
        'forcedLoginState'
    ]),
    onLoad(options) {
        uni.setNavigationBarTitle({
            title:this.__('登录')
        });

        setTimeout(()=>{
			this.getPlantformInfo((plantformInfo)=> {
				this.logo = plantformInfo.logo;
			});
		}, 200);

        let that = this;

		that.setData({
			options: options
		})
		    // 先判断 系统版本
		uni.getSystemInfo({
		        success: (res) => {
		                this.system = res.system
		                this.platform = res.platform
		            },fail: (err) => {
		            },complete: () => {
		        }
		})

		// #ifdef MP-TOUTIAO
		this.isMpToutiao = true;
		let login_func = that.$.login;

		login_func({
			success: function(datainfo) {
				console.info(datainfo);

				//请求服务器
				that.$.request({
					url: that.Config.URL.wx.checkAppLogin,
					data: {
						code: datainfo.code,
						wxwork: that.wxwork,
						source_store_id: that.$.getStorageSync('source_store_id'),
						source_user_id: that.$.getStorageSync('source_user_id'),
						source_ucc_code: that.$.getStorageSync('source_ucc_code'),
						client_info : that.client_info
					},
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({ isAuthorizationed: true });

							var id = that.$.setStorageSync('uid', data.user_id);
							var key = that.$.setStorageSync('ukey', data.key);

							that.toMain(data);
						} else {
							that.setData({ isAuthorizationed: false });
						}
					},
					fail: function() {
						// fail
						// that.$.hideToast();
					},
					complete: function() {
						// complete
					}
				});
			}
		});
		// #endif

        // #ifdef MP-WEIXIN
        this.isMpWeixin = true;

		//判断是否企业微信
		let e = that.$.getSystemInfoSync();


		wx.getUserInfo({
			success: (res) => {
				that.setData({
					data: res
				})

			},
			fail:function(err){
			  console.log("获取失败: ",err)
			}
		})

		if (e.environment)
		{
			this.wxwork = e.environment=='wxwork' ? 1 : 0;
		}

		this.wxwork = e.environment=='wxwork' ? 1 : 0;

        let login_func = that.$.login;

        if (this.wxwork)
        {
            login_func = wx.qy.login;

			wx.getSetting({
				success: function(res) {
					if (res.authSetting['scope.userInfo']) {
						that.setData({ isAuthorizationed: !1 });

						login_func({
							success: function(qy_datainfo) {

								that.$.login({
									success: function(datainfo) {
										//请求服务器
										that.$.request({
											url: that.Config.URL.wx.checkAppLogin,
											data: {
												qy_code: qy_datainfo.code,
												code: datainfo.code,
												wxwork: that.wxwork,
												source_store_id: that.$.getStorageSync('source_store_id'),
												source_user_id: that.$.getStorageSync('source_user_id'),
												source_ucc_code: that.$.getStorageSync('source_ucc_code'),
												client_info : that.client_info
											},
											success: function(data, status, msg, code) {
												if (status == 200) {
													that.setData({ isAuthorizationed: true });

													var id = that.$.setStorageSync('uid', data.user_id);
													var key = that.$.setStorageSync('ukey', data.key);

													that.toMain(data);
												} else {
													that.setData({ isAuthorizationed: false });
												}
											},
											fail: function() {
												// fail
												// that.$.hideToast();
											},
											complete: function() {
												// complete
											}
										});
									}
								});
							}
						});
					} else {
						login_func({
							success: function(qy_datainfo) {

								that.$.login({
									success: function(datainfo) {
										//请求服务器
										that.$.request({
											url: that.Config.URL.wx.checkAppLogin,
											data: {
												qy_code: qy_datainfo.code,
												code: datainfo.code,
												wxwork: that.wxwork,
												source_store_id: that.$.getStorageSync('source_store_id'),
												source_user_id: that.$.getStorageSync('source_user_id'),
												source_ucc_code: that.$.getStorageSync('source_ucc_code'),
												client_info : that.client_info
											},
											success: function(data, status, msg, code) {
												if (status == 200) {
													that.setData({ isAuthorizationed: true });

													var id = that.$.setStorageSync('uid', data.user_id);
													var key = that.$.setStorageSync('ukey', data.key);

													that.toMain(data);
												} else {
													that.setData({ isAuthorizationed: false });
												}
											},
											fail: function() {
												// fail
												// that.$.hideToast();
											},
											complete: function() {
												// complete
											}
										});
									}
								});
							}
						});
					}
				}
			});
        }
		else
		{
			wx.getSetting({
				success: function(res) {
					if (res.authSetting['scope.userInfo']) {
						that.setData({ isAuthorizationed: !1 });

						//console.log('是否授权！是');
						//console.info(res);

						login_func({
							success: function(datainfo) {
								//console.log('是否注册！否');
								//console.info(datainfo);
								//请求服务器
								that.$.request({
									url: that.Config.URL.wx.checkAppLogin,
									data: {
										code: datainfo.code,
										wxwork: that.wxwork,
										source_store_id: that.$.getStorageSync('source_store_id'),
										source_user_id: that.$.getStorageSync('source_user_id'),
										source_ucc_code: that.$.getStorageSync('source_ucc_code'),
										client_info : that.client_info
									},
									success: function(data, status, msg, code) {
										if (status == 200) {
											that.setData({ isAuthorizationed: true });

											var id = that.$.setStorageSync('uid', data.user_id);
											var key = that.$.setStorageSync('ukey', data.key);

											that.toMain(data);
										} else {
											that.setData({ isAuthorizationed: false });
										}
									},
									fail: function() {
										// fail
										// that.$.hideToast();
									},
									complete: function() {
										// complete
									}
								});
							}
						});
					} else {
						login_func({
							success: function(t) {
								//console.log('是否注册！否');
								//console.info(t);
								//请求服务器
								that.$.request({
									url: that.Config.URL.wx.checkAppLogin,
									data: {
										code: t.code,
										wxwork: that.wxwork,
										source_store_id: that.$.getStorageSync('source_store_id'),
										source_user_id: that.$.getStorageSync('source_user_id'),
										source_ucc_code: that.$.getStorageSync('source_ucc_code'),
										client_info : that.client_info
									},
									success: function(data, status, msg, code) {
										if (status == 200) {
											that.setData({ isAuthorizationed: true });

											var id = that.$.setStorageSync('uid', data.user_id);
											var key = that.$.setStorageSync('ukey', data.key);

											that.toMain(data);
										} else {
											that.setData({ isAuthorizationed: false });
										}
									},
									fail: function() {
										// fail
										// that.$.hideToast();
									},
									complete: function() {
										// complete
									}
								});
							}
						});
					}
				}
			});
		}
        // #endif

        // #ifdef H5
        if (that.$.isWeixin()) {
			that.weixin_h5_oauth('weixin');
		} else {
			//H5
			let uid = $cookies.get('uid');
			let ukey = $cookies.get('ukey');

            if (uid && ukey) {

            }
            else
            {
                uid = that.$.getStorageSync('uid');
                ukey = that.$.getStorageSync('ukey');
            }


			//判断Cookie是否登录
			if (uid && ukey) {
				that.$.request({
					url: this.Config.URL.check_islogin,
					data: { perm_id: uid, perm_key: ukey },
					success: function(data, status, msg, code) {
						if (200 == status) {
							var id = that.$.setStorageSync('uid', uid);
							var key = that.$.setStorageSync('ukey', ukey);

							that.toMain(data);

							//返回来源页面
						} else {
							that.logout();
						}
					},
					fail: function(err, status) {
							that.logout();
					}
				});
			}
        }
        // #endif

        this.initPosition();
        this.initProvider();

		// #ifdef APP-PLUS
		plus.push.getClientInfoAsync(function(info) {
			console.log(info);
			if (info.clientid) {
				that.client_info = JSON.stringify(info);
			}
		}, function(e) {
			console.log(JSON.stringify(e));
		})
		// #endif
    },
    //仅 5+App 平台上支持此函数。
    onBackPress() {},
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
		bindblur(e) {
			this.user_nickname = e.detail.value; // 获取微信昵称
		},
		bindinput(e) {
			this.user_nickname = e.detail.value; //这里要注意如果只用blur方法的话用户在输入玩昵称后直接点击保存按钮，会出现修改不成功的情况。
		},
		
		onChooseAvatar: function(e) {
			let that = this;
			let { avatarUrl } = e.detail;
		console.log(avatarUrl)
		 
			that.$.uploadFile({
				url: that.Config.URL.upload,
				method: "POST",
				filePath: avatarUrl,
				name: "upfile",
				
				// 							header: {
				// 								"content-type": "multipart/form-data"
				// 							},
				success: function(n) {
					that.$.hideLoading();
		
					var up_res = that.$.parseJSON(n.data);
					if(up_res.status == 200)
					{
						var s = up_res.data.url;
						that.setData({
							user_avatar: s
						});
					}
					else
					{
						that.$.alert(up_res.msg)
					}
				
				
				},
				fail: function(e) {
					that.$.hideLoading();
				},
				complete: function(e) {
					that.$.hideLoading();
				}
			});
		},

		onChangeBindType:function(bind_type){
			var  that = this;
			this.bind_type = bind_type;

			if (this.bind_type == 2)
			{
				uni.setNavigationBarTitle({
					title:this.__('电子邮箱登录')
				});

				that.$.showToast({
				    icon: 'none',
				    title: that.__('请输入电子邮箱')
				});
			}

			if (this.bind_type == 1)
			{
				uni.setNavigationBarTitle({
					title:this.__('手机号登录')
				});

				that.$.showToast({
				    icon: 'none',
				    title: that.__('请输入手机号')
				});
			}

			if (this.bind_type == 3)
			{
				uni.setNavigationBarTitle({
					title:this.__('账号登录')
				});

				that.$.showToast({
				    icon: 'none',
				    title: that.__('请输入账号密码')
				});
			}

			return this.bind_type;
		},

		intlChange:function(data){
			this.user_intl = data;
		},
        initProvider() {
            let that = this;
            //const filters = ['weixin', 'qq', 'sinaweibo'];
            //const filters = [];


			//connect
			that.$.request({
				url: that.Config.URL.connect,
				data: {},
				success: (data, status, msg, code) => {
					if (status == 200) {
						that.connect = data
						const filters = data.filters;
						console.info(filters)

						// #ifndef H5
						that.$.getProvider({
							service: 'oauth',
							success: res => {
								if (res.provider && res.provider.length) {
									for (let i = 0; i < res.provider.length; i++) {
										if (~filters.indexOf(res.provider[i])) {
											that.providerList.push({
												value: res.provider[i],
												image: '/static/images/login/' + res.provider[i] + '.png'
											});
										}
									}
									that.hasProvider = true;
								}

								//增加第三方的
								let tid = 'fb';
								if (~filters.indexOf(tid)) {
									that.providerList.push({
										value: tid,
										image: '/static/images/login/' + tid + '.png'
									});
								}

								tid = 'google';
								if (~filters.indexOf(tid)) {
									that.providerList.push({
										value: tid,
										image: '/static/images/login/' + tid + '.png'
									});
								}

								console.log(that.providerList)
							},
							fail: err => {
								console.error('获取服务供应商失败：' + JSON.stringify(err));
							}
						});
						// #endif


						// #ifdef H5
						//判断是否为APP调用
						if (that.$.ifUniApp())
						{
							//1. 初始化加载分享模块
							plus.oauth.getServices(
									function(res){
										//console.log(JSON.stringify(res));

										if (res && res.length) {
											for (let i = 0; i < res.length; i++) {
												if (~filters.indexOf(res[i]['id'])) {
													if ('weixin' == res[i]['id'])
													{
														if (that.$.isWeixin())
														{
															that.providerList.push({
																value: res[i]['id'],
																image: '/static/images/login/' + res[i]['id'] + '.png'
															});
														}
													}
													else
													{
														that.providerList.push({
															value: res[i]['id'],
															image: '/static/images/login/' + res[i]['id'] + '.png'
														});
													}
												}

												if ('weixin' == res[i]['id'])
												{
													that.plusOauthWeixin = res[i]
												}
											}

											that.hasProvider = true;

										}
									},

									function(e){
										alert( "获取分享服务列表失败："+e.message );
									}
							);

							//setTimeout(share, 5000)

						}
						else
						{
							let res = data.items;
							for (let i = 0; i < res.length; i++) {
								if (~filters.indexOf(res[i]['id'])) {

									if ('weixin' == res[i]['id'])
									{
										if (that.$.isWeixin())
										{
											that.providerList.push({
												value: res[i]['id'],
												image: '/static/images/login/' + res[i]['id'] + '.png'
											});
										}
									}
									else
									{
										that.providerList.push({
											value: res[i]['id'],
											image: '/static/images/login/' + res[i]['id'] + '.png'
										});
									}
								}

								if ('weixin' == res[i]['id'])
								{
									that.plusOauthWeixin = res[i]
								}
							}

							that.hasProvider = true;
						}
						// #endif
					}
					else
					{
					}
				},
				fail: function() {
				},
				complete: function() {
				}
			});
        },
        initPosition() {
            let that = this;
            /**
             * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
             * 反向使用 top 进行定位，可以避免此问题。
             */
            this.positionTop = that.$.getSystemInfoSync().windowHeight - 100;
        },
        bindLogin() {
            var that = this;

			//登录
			if(this.isRotate){
				//判断是否加载中，避免重复点击请求
				return false;
			}

            /**
             * 客户端对账号信息进行一些必要的校验。
             * 实际开发中，根据业务需要进行处理，这里仅做示例。
             */
			/*
            if (this.account.length < 4) {
                that.$.showToast({
                    icon: 'none',
                    title: that.__('账号最短为 4 个字符')
                });
                return;
            }

            if (this.password.length < 6) {
                that.$.showToast({
                    icon: 'none',
                    title: that.__('密码最短为 6 个字符')
                });
                return;
            }
			*/

			that.isRotate=true
			setTimeout(function(){
				that.isRotate=false
			},2000)

            /**
             * 下面简单模拟下服务端的处理
             * 检测用户账号密码是否在已注册的用户列表中
             * 实际开发中，使用 that.$.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
             */
            //SYS.URL.login,
			if (that.bind_type == 1)
				{
					if (!that.$.tel(this.account, this.user_intl))
					{
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('手机号不正确')
						});

						return false;
					}

				}
            const params = {
                user_account: this.account,
                user_password: this.password,
				client_info:that.client_info
            };

			if (that.bind_type == 1)
			{
				params.user_account = this.user_intl + this.account;
			}

            that.$.request({
                url: this.Config.URL.login,
                data: params,
                success: function(data, status, msg, code) {
                    //console.info(JSON.stringify(data));

                    if (200 == status) {
                        var id = that.$.setStorageSync('uid', data.user_id);
                        var key = that.$.setStorageSync('ukey', data.key);

                        // #ifdef H5
                        $cookies.set('uid', data.user_id);
                        $cookies.set('ukey', data.key);
                        // #endif

                        data['user_password'] = params.user_password;

                        that.toMain(data);
                    } else {
                        that.$.showToast({
                            icon: 'none',
                            // title: that.__('用户账号或密码不正确')
                            title: that.__(msg)
                        });
                    }
                },
                fail: function(err, status) {
                    that.$.showToast({
                        icon: 'none',
                        title: that.__('登录有误，请重试')
                    });
                }
            });
        },
        oauth(value) {
            let that = this;

			if ('fb' == value)
			{
				/*
				//自研的接口
				let jyappEvents = uni.requireNativePlugin("JY-FaceBookAppEvents");
				jyappEvents.jy_facebookLogin(res=> {
					console.info(res);
					if (res.errorCode == "0")
					{
						that.$.request({
							url: that.Config.URL.do_app_login,
							type: 'POST',
							dataType: 'json',
							data: {
								bind_name: 'fb',
								code: res.data.token,
								openId: res.data.userId,
								nickName: res.data.userId,
								authResponse: JSON.stringify(res['data']),
								client_info:that.client_info
							},
							success: (data, status, msg, code) => {
								console.info(data);

								if (200 == status) {
									var id = that.$.setStorageSync('uid', data.user_id);
									var key = that.$.setStorageSync('ukey', data.key);

									// #ifdef H5
									$cookies.set('uid', data.user_id);
									$cookies.set('ukey', data.key);
									// #endif

									that.toMain(data);
								} else {
									that.$.showToast({
										icon: 'none',
										title: that.__('登录失败！')
									});
								}
							}
						});
					}
					else
					{
						that.$.showToast({
							icon: 'none',
							title: that.__('登录失败！')
						});
					}
				})
				*/

			   //云插件https://ext.dcloud.net.cn/plugin?id=3639

			   var facebook = uni.requireNativePlugin("sn-facebook");

			   // 获取登录状态
			   const rs = facebook.isLoggedIn();

				// 登出
				facebook.logout((e) => {
					console.info('---------------------');
					// 登录
					facebook.login((res) => {
					  // e 对象如下
					  // {
					  //     result: true,
					  //     data: {
					  //         token: '',
					  //         userId: '',
					  //         name: '',
					  //         email: '',
					  //         gender: '',
					  //         birthday: ''
					  //         photo: ''
					  //     }
					  // }

										console.info(res);
										if (res.result == true)
										{
											that.$.request({
												url: that.Config.URL.do_app_login,
												type: 'POST',
												dataType: 'json',
												data: {
													bind_name: 'fb',
													code: res.data.token,
													openId: res.data.userId,
													nickName: res.data.name,
													authResponse: JSON.stringify(res['data']),
													client_info:that.client_info
												},
												success: (data, status, msg, code) => {
													console.info(data);

													if (200 == status) {
														var id = that.$.setStorageSync('uid', data.user_id);
														var key = that.$.setStorageSync('ukey', data.key);

														// #ifdef H5
														$cookies.set('uid', data.user_id);
														$cookies.set('ukey', data.key);
														// #endif

														that.toMain(data);
													} else {
														that.$.showToast({
															icon: 'none',
															title: that.__('登录失败！')
														});
													}
												}
											});
										}
										else
										{
											that.$.showToast({
												icon: 'none',
												title: that.__('登录失败！')
											});
										}
					});

				});


			}
			else if ('google' == value)
			{
				//android 配置  https://developers.google.com/identity/sign-in/android/start
				//https://developers.google.com/identity/sign-in/android/start
				//JY-GoogleSignin
				console.info('google init')
				//JY-GoogleSignin
				let JYGoogleSignin = uni.requireNativePlugin("JY-GoogleSignin");
				JYGoogleSignin.jy_init({
					client_id: that.connect.google_app_id
				}, res=> {
					//	这里不会有返回数据

					console.info('google init ok')

				})


				JYGoogleSignin.jy_startLogin(res=>  {
					console.info(res);
					if (res.errorCode == "0")
					{
						that.$.request({
							url: that.Config.URL.do_app_login,
							type: 'POST',
							dataType: 'json',
							data: {
								bind_name: 'google',
								code: res.data.idToken,
								openId: res.data.userId,
								user_email: res.data.email,
								nickName: res.data.fullName,
								avatarUrl: res.data.photoUrl,
								authResponse: JSON.stringify(res['data']),
								client_info:that.client_info
							},

							success: (data, status, msg, code) => {
								console.info(data);

								if (200 == status) {
									var id = that.$.setStorageSync('uid', data.user_id);
									var key = that.$.setStorageSync('ukey', data.key);

									// #ifdef H5
									$cookies.set('uid', data.user_id);
									$cookies.set('ukey', data.key);
									// #endif

									that.toMain(data);
								} else {
									that.$.showToast({
										icon: 'none',
										title: that.__('登录失败！')
									});
								}
							}
						});
					}
					else
					{
						that.$.showToast({
							icon: 'none',
							title: that.__('登录失败！')
						});
					}
				})
			}
			else if ('sms' == value)
			{
				this.sms_oauth(value);
			}
			else
			{
				that.$.login({
					provider: value,
					success: res => {
						that.$.getUserInfo({
							provider: value,
							success: infoRes => {
								if (infoRes.errMsg == 'getUserInfo:ok')
								{
									//console.info(JSON.stringify(infoRes));
									//console.info(value);

									/**
									 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
									 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
									 */
									//this.toMain(infoRes.userInfo.nickName);
									var t = infoRes.userInfo;
									t.bind_name = value;

									//{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

									/*
									if (value == 'weixin')
									{
										let rawData = JSON.parse(infoRes.rawData);

										var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
										var iv = encodeURIComponent(rawData.iv);
										var code = t.openId;

										t.code = code;
										t.encryptedData = encryptedData;
										t.iv = iv;
									}
									*/
									t.code = t.openId;

									t.source_store_id = that.$.getStorageSync('source_store_id');
									t.source_user_id = that.$.getStorageSync('source_user_id');
									t.source_ucc_code = that.$.getStorageSync('source_ucc_code');
									t.client_info = that.client_info;

									//请求服务器
									that.$.request({
										url: that.Config.URL.do_app_login,
										data: t,
										success: function(data, status, msg, code) {
											if (status != 200) {
												// 登录错误
												that.$.showModal({
													title: '提示',
													content: '无法登录，请重试！',
													showCancel: false
												});

												that.$.navigateBack();
												return;
											}

											var id = that.$.setStorageSync('uid', data.user_id);
											var key = that.$.setStorageSync('ukey', data.key);

											that.toMain(data);
										},
										fail: function() {
											// fail
											// that.$.hideToast();
										},
										complete: function() {
											// complete
										}
									});
								}
								else
								{

								}
							}
						});
					},
					fail: err => {
						console.error('授权登录失败：' + JSON.stringify(err));
					}
				});
			}
        },

		/* wap app 登录*/
		plus_oauth(value) {
		    let that = this;

			// 登录操作
			function authLogin() {
				//console.info('plusOauthWeixin')
				//console.info(that.plusOauthWeixin)
				var s = that.plusOauthWeixin;

				if ( !s.authResult ) {
					s.login( function(e){
						authUserInfo();
					}, function(e){
						alert( "登录认证失败！" );
					} );
				}else{
					//alert( "已经登录认证！" );

					authUserInfo();
				}
			}

			// 获取登录用户信息操作
			function authUserInfo(){
				var s = that.plusOauthWeixin;

				if ( !s.authResult ) {
					alert("未登录授权！");
				} else {
					s.getUserInfo( function(res){
						////console.info( "获取用户信息成功："+JSON.stringify(res) );
						//alert( "获取用户信息成功："+JSON.stringify(s.userInfo) );

						var value = 'weixin'
						var infoRes = res.target

						if (true)
						{
						    /**
						     * 实际开发中，获取用户信息后，需要将信息上报至服务端。
						     * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
						     */
						    //this.toMain(infoRes.userInfo.nickName);
						    var t = infoRes.userInfo;
						    t.bind_name = value;

						    //{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

						    if (value == 'weixin')
						    {
								/*
						        let rawData = JSON.parse(infoRes.rawData);

						        var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
						        var iv = encodeURIComponent(rawData.iv);
						        var code = t.openId;

						        t.encryptedData = encryptedData;
						        t.iv = iv;
								*/
						        t.code = t.openid;
						    }

						    t.source_store_id = that.$.getStorageSync('source_store_id');
						    t.source_user_id = that.$.getStorageSync('source_user_id');
						    t.source_ucc_code = that.$.getStorageSync('source_ucc_code');
							t.client_info = that.client_info;

						    //请求服务器
						    that.$.request({
						        url: that.Config.URL.do_app_login,
						        data: t,
						        success: function(data, status, msg, code) {
						            if (status != 200) {
						                // 登录错误
						                that.$.showModal({
						                    title: '提示',
						                    content: '无法登录，请重试！',
						                    showCancel: false
						                });

						                that.$.navigateBack();
						                return;
						            }

						            var id = that.$.setStorageSync('uid', data.user_id);
						            var key = that.$.setStorageSync('ukey', data.key);

						            that.toMain(data);
						        },
						        fail: function() {
						            // fail
						            // that.$.hideToast();
						        },
						        complete: function() {
						            // complete
						        }
						    });
						}
						else
						{

						}

					}, function(e){
						alert( "获取用户信息失败："+e.message+" - "+e.code );
					} );
				}
			}
			authLogin();
			/*
		    that.$.login({
		        provider: value,
		        success: res => {
		            that.$.getUserInfo({
		                provider: value,
		                success: infoRes => {
		                    if (infoRes.errMsg == 'getUserInfo:ok')
		                    {
		                        //console.info(JSON.stringify(infoRes));
		                        //console.info(value);

		                        //this.toMain(infoRes.userInfo.nickName);
		                        var t = infoRes.userInfo;
		                        t.bind_name = value;

		                        //{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

		                        if (value == 'weixin')
		                        {
		                            let rawData = JSON.parse(infoRes.rawData);

		                            var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
		                            var iv = encodeURIComponent(rawData.iv);
		                            var code = t.openId;

		                            t.code = code;
		                            t.encryptedData = encryptedData;
		                            t.iv = iv;
		                        }

		                        t.source_store_id = that.$.getStorageSync('source_store_id');
		                        t.source_user_id = that.$.getStorageSync('source_user_id');

		                        //请求服务器
		                        that.$.request({
		                            url: that.Config.URL.do_app_login,
		                            data: t,
		                            success: function(data, status, msg, code) {
		                                if (status != 200) {
		                                    // 登录错误
		                                    that.$.showModal({
		                                        title: '提示',
		                                        content: '无法登录，请重试！',
		                                        showCancel: false
		                                    });

		                                    that.$.navigateBack();
		                                    return;
		                                }

		                                var id = that.$.setStorageSync('uid', data.user_id);
		                                var key = that.$.setStorageSync('ukey', data.key);

		                                that.toMain(data);
		                            },
		                            fail: function() {
		                                // fail
		                                // that.$.hideToast();
		                            },
		                            complete: function() {
		                                // complete
		                            }
		                        });
		                    }
		                    else
		                    {

		                    }
		                }
		            });
		        },
		        fail: err => {
		            console.error('授权登录失败：' + JSON.stringify(err));
		        }
		    });
			*/

		},

		h5_oauth(id){
			let that = this;

			if ('fb' == id)
			{
				this.fb_oauth(id);
			}
			else if ('google' == id)
			{
				this.google_oauth(id);
			}
			else if ('weixin' == id)
			{
				this.weixin_h5_oauth(id);
			}
			else if ('sms' == id)
			{
				this.sms_oauth(id);
			}
			else if ('qq' == id)
			{
				this.qq_oauth(id);
			}
		},

		weixin_h5_oauth(id){
			let that = this;

			let uid = $cookies.get('uid');
			let ukey = $cookies.get('ukey');

			if (uid && ukey) {

			}
			else
			{
				uid = that.$.getStorageSync('uid');
				ukey = that.$.getStorageSync('ukey');
			}

			//判断Cookie是否登录
			if (uid && ukey) {
				that.$.request({
					url: this.Config.URL.check_islogin,
					data: { perm_id: uid, perm_key: ukey },
					success: function(data, status, msg, code) {
						if (200 == status) {
							var id = that.$.setStorageSync('uid', uid);
							var key = that.$.setStorageSync('ukey', ukey);

							data['as'] = $cookies.get('as');
							that.toMain(data);

							//返回来源页面
						} else {
							that.logout();
						}
					},
					fail: function(err, status) {
						that.logout();
					}
				});
			} else {
				// 微信h5登录传参
				let activity_id = that.$.getStorageSync('activity_id');
				if (
						getCurrentPages()[getCurrentPages().length - 1].route == 'pages/login/login' ||
						getCurrentPages()[getCurrentPages().length - 1].route == '/pages/login/login'
				) {
					//记录来源页面
					if (getCurrentPages().length > 1) {
						var prePage = getCurrentPages()[getCurrentPages().length - 2];
						if (prePage) {
							that.$.setStorageSync('pre_route', prePage.route);

							if (prePage.options) {
								that.$.setStorageSync('pre_options', prePage.options);
							}
						}
					} else {
					}

					//是否企业微信
					if (that.$.isQyWeixin())
					{
						window.location.href =
								that.Config.URL.wx.mplogin + '?wxwork=1&activity_id=' + activity_id +
								'&callback=' +
								encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
					}
					else
					{
						window.location.href =
								that.Config.URL.wx.mplogin +
								'?activity_id=' + activity_id +
								'&callback=' +
								encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
					}
				} else {
					var prePage = getCurrentPages()[getCurrentPages().length - 1];
					if (prePage) {
						that.$.setStorageSync('pre_route', prePage.route);

						if (prePage.options) {
							that.$.setStorageSync('pre_options', prePage.options);
						}
					}
					//记录来源页面


					//是否企业微信
					if (that.$.isQyWeixin())
					{
						window.location.href =
								that.Config.URL.wx.mplogin + '?wxwork=1&activity_id=' + activity_id +
								'&callback=' +
								encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释

					}
					else
					{
						window.location.href =
								that.Config.URL.wx.mplogin +
								'?activity_id=' + activity_id +
								'&callback=' +
								encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
					}
				}
			}
		},

		weibo_oauth(id){
			let that = this;
		},

		qq_oauth(id){
			let that = this;


			// #ifdef H5
			//H5调用  forcedLoginState: true,  window.location 跳转
			let pre_route = that.$.getStorageSync('pre_route');
			let pre_options = that.$.getStorageSync('pre_options');

			let base_url = that.cf.CONFIG.base_url + '/h5';
			let return_url = base_url + '/pages/index/member';
			let pre_url = '';

			if (pre_route)
			{
			    pre_url = '/' + that.$.createUrl(pre_route, pre_options);

				pre_url = "?jump=" + encodeURIComponent(pre_url)
			}
			else
			{
			}

			return_url = return_url + pre_url;


			let url = that.connect.qq_url;

			/*
			if ((url.indexOf("?") != -1))
			{
				url = url + '&enbed=hybird&callback=' + encodeURIComponent(return_url);
			}
			else
			{
				url = url + '?enbed=hybird&callback=' + encodeURIComponent(return_url);
			}

			url = url + '&rand=' + Math.random()
			*/

			// #endif


			// #ifdef H5
			setTimeout(() => {
				window.location.href = url;
			}, 100);
			// #endif
		},

		fb_oauth(id){
			let that = this;

			FB.login(function(response) {
				console.info(response.authResponse)
				if (response.authResponse) {
					console.log('Welcome!  Fetching your information.... ');
					FB.api('/me', function(me) {
						console.log('Good to see you, ' + me.name + '.');


						that.$.request({
							url: that.Config.URL.do_app_login,
							type: 'POST',
							dataType: 'json',
							data: {
								bind_name: 'fb',
								code: response['authResponse']['accessToken'],
								openId: response['authResponse']['userID'],
								nickName: me.name,
								authResponse: JSON.stringify(response['authResponse'])
							},
							success: function (data, status, msg, code)
							{
								console.info(data);

								if (200 == status) {
								    var id = that.$.setStorageSync('uid', data.user_id);
								    var key = that.$.setStorageSync('ukey', data.key);

								    // #ifdef H5
								    $cookies.set('uid', data.user_id);
								    $cookies.set('ukey', data.key);
								    // #endif

								    that.toMain(data);
								} else {
								    that.$.showToast({
								        icon: 'none',
								        title: that.__('登录失败！')
								    });
								}
							}
						});
					});
				} else {
					that.$.showToast({
						icon: 'none',
						title: that.__('User cancelled login or did not fully authorize.')
					});
				}
			});
		},

		google_oauth(id){
			let that = this;

			// #ifdef H5
			//H5调用  forcedLoginState: true,  window.location 跳转
			let pre_route = that.$.getStorageSync('pre_route');
			let pre_options = that.$.getStorageSync('pre_options');

			let base_url = that.cf.CONFIG.base_url + '/h5';
			let return_url = base_url + '/pages/index/member';
			let pre_url = '';

			if (pre_route)
			{
			    pre_url = '/' + that.$.createUrl(pre_route, pre_options);

				pre_url = "?jump=" + encodeURIComponent(pre_url)
			}
			else
			{
			}

			return_url = return_url + pre_url;


			let url = that.connect.google_url;

			/*
			if ((url.indexOf("?") != -1))
			{
				url = url + '&enbed=hybird&callback=' + encodeURIComponent(return_url);
			}
			else
			{
				url = url + '?enbed=hybird&callback=' + encodeURIComponent(return_url);
			}

			url = url + '&rand=' + Math.random()
			*/

			// #endif


			// #ifdef H5
			setTimeout(() => {
				window.location.href = url;
			}, 100);
			// #endif
		},


		sms_oauth(id){
			let that = this;

			that.$.gopage('/pagesub/login/sms')
		},

		showMpBindMobile(){
            var that = this;
			that.showMpBindMobileFlag = true;
		},
		
		goLoginBack(){
		    var that = this;
			
			/**
			 * 强制登录时使用reLaunch方式跳转过来
			 * 返回首页也使用reLaunch方式
			 */
			if (that.forcedLoginState) {
			    that.$.reLaunch({
			        url: '/pages/index/member'
			    });
			} else {
			    // #ifdef H5
			    if (that.$.isWeixin()) {
			        let pre_route = that.$.getStorageSync('pre_route');
			        let pre_options = that.$.getStorageSync('pre_options');
			
			        //console.info(pre_route);
			        //console.info(pre_options);
			
			        if (pre_route)
			        {
			            let pre_url = '/' + that.$.createUrl(pre_route, pre_options);
			            that.$.gotopage(pre_url);
			        }
			        else
			        {
			            that.$.gotopage('/pages/index/member');
			        }
			
			        return;
			    }
			    // #endif
			
			    if (
			        getCurrentPages()[getCurrentPages().length - 1].route ==
			            'pages/login/login' ||
			        getCurrentPages()[getCurrentPages().length - 1].route ==
			            '/pages/login/login'
			    ) {
			        if (getCurrentPages().length > 1) {
			            var prePage = getCurrentPages()[getCurrentPages().length - 2];
			
			            // #ifndef H5
			            if ('pages/login/login' == prePage.route || '/pages/login/login' == prePage.route)
			            {
			                that.$.switchTab({
			                    url: '/pages/index/member'
			                });
			            }
			            else
			            {
			                if (prePage.refreshData)
			                {
			                    prePage.refreshData(prePage.options);
			                    that.$.navigateBack();
			                }
			                else if (prePage.onLoad)
			                {
			                    prePage.onLoad(prePage.options);
			                    that.$.navigateBack();
			                }
			                else
			                {
			                    let pre_url = '/' + that.$.createUrl(prePage.route, prePage.options);
			                    that.$.gotopage(pre_url);
			                }
			            }
			            // #endif
			
			            // #ifdef H5
			            //修正 onLoad 不存在问题。
			            //console.info('++++++++++++++++++++++');
			            //console.info(prePage);
			            //console.info(prePage.onLoad);
			            //console.info(prePage.route);
			            //console.info(prePage.options);
			
			            if ('pages/login/login' == prePage.route || '/pages/login/login' == prePage.route)
			            {
			                that.$.switchTab({
			                    url: '/pages/index/member'
			                });
			            }
			            else
			            {
			                if (prePage.refreshData)
			                {
			                    prePage.refreshData(prePage.options);
			                    that.$.navigateBack();
			                }
			                else if (prePage.onLoad)
			                {
			                    prePage.onLoad(prePage.options);
			                    that.$.navigateBack();
			                }
			                else
			                {
			                    let pre_url = '/' + that.$.createUrl(prePage.route, prePage.options);
			                    that.$.gotopage(pre_url);
			                }
			            }
			            // #endif
			        } else {
			            //回到上个页面
			            that.$.switchTab({
			                url: '/pages/index/member'
			            });
			        }
			    } else {
			        var prePage = getCurrentPages()[getCurrentPages().length - 1];
			
			        if ('pages/login/login' == prePage.route || '/pages/login/login' == prePage.route)
			        {
			            that.$.switchTab({
			                url: '/pages/index/member'
			            });
			        }
			        else
			        {
			            prePage.onLoad && prePage.onLoad(prePage.options);
			        }
			
			        //that.$.navigateBack();
			    }
			}
		},
		
		cleanCache: function(e) {
			var that = this;
			const language = uni.getStorageSync('language')
		
			that.$.storage.clear();
		
			//如果不在允许的语言内，可重置
			uni.setStorageSync('language', language);
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
							
									if (userInfo.im && that.plantformInfo.config.chat_global)
									{
										that.$Socket.connectserver(userInfo.im);
									}
							
									that.notice.postNotificationName('RefreshCart', 0);
							
									//判断是否需要进入激活页面
									if (2 == userInfo.user_state)
									{
										that.$.toActive();
									}
									
									that.goLoginBack();
									//
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
		
        toMain(userInfo) {
            var that = this;

            that.$.request({
                url: this.Config.URL.user.overview,
                success: function(data, status, msg, code) {
                    userInfo = Object.assign(userInfo, data.member_info);
					
                    that.login(userInfo);

                    if (userInfo.im && that.plantformInfo.config.chat_global)
                    {
                        that.$Socket.connectserver(userInfo.im);
                    }


                    that.notice.postNotificationName('RefreshCart', 0);

					//判断是否需要进入激活页面
					if (2 == userInfo.user_state)
					{
						that.$.toActive();
					}

					that.goLoginBack();
                }
            });
        },

		getUserProfile: function(e) {

			var that = this;

			 wx.getUserProfile({
			   desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			   success: (res2) => {
			     	console.log(res2)
					that.data.userInfo = res2.userInfo
					that.data.userInfo.avatarUrl = that.user_avatar;
					that.data.userInfo.nickName = that.user_nickname;
					that.bindGetUserInfo({detail: that.data});

			   },
			   fail:function(err){
				 //微信授权取消后不让自动去绑定
				 that.$.switchTab({
						url: '/pages/index/index'
					});	
					
				 return false;
			     console.log("获取失败: ",err)
				 that.bindGetUserInfo({detail: that.data});

			   }
			 })





		},

        bindGetUserInfo: function(res2) {
            var that = this;

		    if (!this.protocol_checked)
            {
                this.$.showModal({
                    title: this.__('提示'),
                    content: this.__('请先阅读并同意用户协议'),
                    showCancel: false
                });

                return;
            }

			let login_func = that.$.login;
			if (this.wxwork)
			{
			    login_func = wx.qy.login;

				//console.info(res2);
				if (res2.detail.errMsg == 'getUserInfo:ok') {
					that.setData({ isAuthorizationed: !1 });
					var wx_user = that.$.parseJSON(res2.detail.rawData);
					login_func({
						success: function(qy_datainfo) {

							that.$.login({
								success: function(res) {
									var t = {
										code: res.code,
										wxwork: that.wxwork,
										NickName: wx_user.nickName,
										sex: wx_user.gender,
										photo: wx_user.avatarUrl,
										WXCountry: wx_user.country,
										WXCity: wx_user.city,
										WXProvince: wx_user.province,
										Uid: 0,
										storeId: 0
									};

									var encryptedData = encodeURIComponent(res2.detail.encryptedData); //一定要把加密串转成URI编码
									var iv = encodeURIComponent(res2.detail.iv);
									var code = res.code;

									//请求服务器
									that.$.request({
										url: that.Config.URL.wx.applogin,
										data: {
											qy_code: qy_datainfo.code,
											code: code,
											wxwork: that.wxwork,
											encryptedData: encryptedData,
											iv: iv,
											source_store_id: that.$.getStorageSync('source_store_id'),
											source_user_id: that.$.getStorageSync('source_user_id'),
											source_ucc_code: that.$.getStorageSync('source_ucc_code'),
											activity_id: that.$.getStorageSync('activity_id'),
											client_info : that.client_info,
											user_info: res2.detail.userInfo
										},
										success: function(data, status, msg, code) {
											if (status != 200) {
												// 登录错误
												that.$.showModal({
													title: '提示',
													content: '无法登录，请重试！',
													showCancel: false
												});

												that.$.navigateBack();
												return;
											}

											var id = that.$.setStorageSync('uid', data.user_id);
											var key = that.$.setStorageSync('ukey', data.key);

											that.toMain(data);
										},
										fail: function() {
											// fail
											// that.$.hideToast();
										},
										complete: function() {
											// complete
										}
									});
								}
							});
						}
					});
				}
			}
			else
			{
				//console.info(res2);
				if (res2.detail.errMsg == 'getUserInfo:ok') {
					that.setData({ isAuthorizationed: !1 });
					var wx_user = that.$.parseJSON(res2.detail.rawData);
					login_func({
						success: function(res) {
							var t = {
								code: res.code,
								wxwork: that.wxwork,
								NickName: wx_user.nickName,
								sex: wx_user.gender,
								photo: wx_user.avatarUrl,
								WXCountry: wx_user.country,
								WXCity: wx_user.city,
								WXProvince: wx_user.province,
								Uid: 0,
								storeId: 0
							};

							var encryptedData = encodeURIComponent(res2.detail.encryptedData); //一定要把加密串转成URI编码
							var iv = encodeURIComponent(res2.detail.iv);
							var code = res.code;

							//请求服务器
							that.$.request({
								url: that.Config.URL.wx.applogin,
								data: {
									code: code,
									encryptedData: encryptedData,
									iv: iv,
									source_store_id: that.$.getStorageSync('source_store_id'),
									source_user_id: that.$.getStorageSync('source_user_id'),
									source_ucc_code: that.$.getStorageSync('source_ucc_code'),
									activity_id: that.$.getStorageSync('activity_id'),
									client_info : that.client_info,
									user_info: res2.detail.userInfo

								},
								success: function(data, status, msg, code) {
									if (status != 200) {
										// 登录错误
										that.$.showModal({
											title: '提示',
											content: '无法登录，请重试！',
											showCancel: false
										});

										that.$.navigateBack();
										return;
									}

									var id = that.$.setStorageSync('uid', data.user_id);
									var key = that.$.setStorageSync('ukey', data.key);

									//小程序下，强制提示手机授权绑定逻辑
									if (that.isMpWeixin)
									{
										that.setData({ isAuthorizationed: !0 });
										that.showMpBindMobile();
									}
									else
									{
										that.toMain(data);
									}
								},
								fail: function() {
									// fail
									// that.$.hideToast();
								},
								complete: function() {
									// complete
								}
							});
						}
					});
				}
			}
        },

        onChangeProtocol:function(e){
            var values = e.detail.value;

            if (values.length > 0)
            {
                this.protocol_checked = true;
            }
            else
            {
                this.protocol_checked = false;
            }
        },

        showProtocol:function(id){
            uni.navigateTo({
                url:'/member/member/protocol?id=' + id
            })
        },
		startLogin:function(){
			//登录
			if(this.isRotate){
				//判断是否加载中，避免重复点击请求
				return false;
			}

			if (this.account.length == "") {
				 uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '用户名不能为空'
				});
				return;
			}
			if (this.password.length < 5) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '密码不正确'
				});
				return;
			}

			console.log("登录成功")

			_this.isRotate=true
			setTimeout(function(){
				_this.isRotate=false
			},3000)
			// uni.showLoading({
			// 	title: '登录中'
			// });
			// getLogin()
			// .then(res => {
			// 	//console.log(res)
			// 	//简单验证下登录（不安全）
			// 	if(_this.account==res.data.username && _this.password==res.data.password){
			// 		let userdata={
			// 			"username":res.data.username,
			// 			"nickname":res.data.nickname,
			// 			"accesstoken":res.data.accesstoken,
			// 		} //保存用户信息和accesstoken
			// 		_this.$store.dispatch("setUserData",userdata); //存入状态
			// 		try {
			// 			uni.setStorageSync('setUserData', userdata); //存入缓存
			// 		} catch (e) {
			// 			// error
			// 		}
			// 		uni.showToast({
			// 			icon: 'success',
			// 			position: 'bottom',
			// 			title: '登录成功'
			// 		});
			// 		uni.reLaunch({
			// 			url: '../../../pages/index',
			// 		});
			// 	}else{
			// 		_this.password=""
			// 		uni.showToast({
			// 			icon: 'error',
			// 			position: 'bottom',
			// 			title: '账号或密码错误，账号admin密码admin'
			// 		});
			// 	}
			// 	uni.hideLoading();
			// }).catch(err => {
			// 	uni.hideLoading();
			// })

		},

		jy_facebookShareUrl() {
			let jyappEvents = uni.requireNativePlugin("JY-FaceBookAppEvents");
			jyappEvents.jy_facebookShareUrl({
				shareUrl: "http://www.baidu.com",
				sharePic: "随便写"
			}, res=> {
				uni.showToast({
					icon:'none',
					title: JSON.stringify(res)
				})
			})
		}
    }
};
</script>


<style lang="scss">
	@import '../../styles/reg.scss';

	.cuIcon-item{
		font-size: 64upx;

		image{
			width: 64upx;
			height: 64upx;
		}
	}




	/* common/authorization-info.wxss */
	.auth-pop {
	    position: fixed;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, 0.5);
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    text-align: center;
	    flex-wrap: wrap;
	    z-index: 999;
	}
	.auth-box {
	    width: 600upx;
	    background-color: #fff;
	    border-radius: 24upx;
	    box-sizing: border-box;
	    padding: 110upx 60upx;
	    box-shadow: 0 10upx 30upx rgba(0, 0, 0, 0.5);
	}
	.auth-box image {
	    width: 112upx;
	    height: 112upx;
	}
	.auth-box label {
	    font-size: 32upx;
	    color: #333;
	    margin: 20upx 0;
	    display: inline-block;
	    width: 100%;
	}
	.auth-box text {
	    font-size: 24upx;
	    color: #666;
	}
	.auth-box button {
	    margin-top: 80upx;
	}

	.btn-row {
	    margin-top: 50px;
	    padding: 0px;

	    label {
	        font-size: 32upx;
	        color: #333;
	        margin: 20upx 0;
	        display: inline;
	        width: 100%;
	    }
	}
	
	.btn_box {
		padding: 20upx;
	}
	
	.login-but {
		background-color: red;
		color: white;
	}
	
	.avatar-wrapper {
		padding: 0;
		width: 112upx !important;
		height: 112upx !important;
		border-radius: 16upx;
		margin-top: 80upx;
		margin-bottom: 80upx;
	}
	
	.avatar {
		display: block;
		width: 112upx;
		height: 112upx;
		
	}
</style>
