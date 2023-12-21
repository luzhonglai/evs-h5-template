<template>
	<view class="register">

		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logo"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="user_mobile"
					type="text"
					isShowIntl
					@intl="intlChange"
					:placeholder="__('请输入手机号码')"
				></wInput>

				<wInput
					v-model="mobile_code"
					type="number"
					maxlength="4"
					:placeholder="__('请输入验证码')"
					isShowCode
					:codeText="__('获取验证码')"
					ref="runCode"
					@setCode="getSmsCode()"
				></wInput>

			</view>

			<wButton
				:text="__('登 录')"
				:rotate="isRotate"
				@click.native="startReg()" style="margin-top: 30rpx;"
			></wButton>

		</view>
	</view>
</template>



<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
    import imgcode from '@/components/verify-code/imgcode.vue';

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data: function() {
            return {
				logo: "",
                user_intl: "",
                user_mobile: "",
                user_avatar: "",
                user_password: "",
                mobile_code: "",
                btntext: "发送",
                isUserMobile: !0,
                isUserEmail: !0,
                isNickname: !0,
                isPassword: !0,
                isSend: !0,
                sendTime: 120,
                isCode: !0,
                isImgCode: !1,


				client_info: '{}',
			
					countdown: 6,
					cTimer: null,

				isRotate: false //是否加载旋转
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			wInput,
			wButton,
            imgcode
		},
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('手机验证码登录')
            });

			this.setData({
				options: options
			})

            this.btntext = this.__('发送')
			
			setTimeout(()=>{
				this.getPlantformInfo((plantformInfo)=> {
					this.logo = plantformInfo.logo;
				});
			}, 200);

            this.show();
			
			
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
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			intlChange:function(data){
				this.user_intl = data;
			},

            /* start 图形验证码 */
            refresh:function(){
                //this.$refs.imgcode.refresh();
            },
            show:function(){
                var _self=this;
                setTimeout(function(){
                    _self.refresh();
                },500);
            },
            onInputImgCode:function(e){
                if (e.detail.value.toLocaleLowerCase() == uni.getStorageSync('imgcode').toLocaleLowerCase())
                {
                    this.setData({isImgCode: true})
                }
                else
                {
                    this.setData({isImgCode: false})
                }
            },
            /* end 图形验证码 */

            inputuser_email: function (e) {
                let that = this;
                this.setData({user_email: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isUserEmail: !1}) : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.detail.value) ? this.setData({isUserEmail: !0}) : this.setData({isUserEmail: !1})
            },
            startReg: function (e) {
				let that = this;

				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}

				if (!that.$.tel(this.user_mobile, this.user_intl))
				{
					this.setData({isUserMobile: !1});

					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('手机号不正确')
					});

					return false;
				}


				if (this.mobile_code.length != 4) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('验证码不正确')
					});

					return false;
				}

				this.update();
            },

            update: function () {
                var that = this;

                var params = {
                    user_mobile: this.user_intl + this.user_mobile,
                    rand_key: this.user_intl + this.user_mobile,
                    verify_code: this.mobile_code,
					client_info:that.client_info
                };

                that.$.request({
                    url: this.Config.URL.doSmsLogin,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
							var id = that.$.setStorageSync('uid', data.user_id);
							var key = that.$.setStorageSync('ukey', data.key);
						
							// #ifdef H5
							$cookies.set('uid', data.user_id);
							$cookies.set('ukey', data.key);
							// #endif
								
                            that.$.showToast({
                                title: that.__("登录成功!"), success: function () {

                                    that.login(data);

                                    if (data.im && that.plantformInfo.config.chat_global)
                                    {
                                        that.$Socket.connectserver(data.im);
                                    }

									setTimeout(() => {
										var prePage = getCurrentPages()[getCurrentPages().length - 2];

										try
										{
										    if (prePage.refreshData)
										    {
										        prePage.refreshData(prePage.options);
										    }
										    else if (prePage.onLoad)
										    {
										        prePage.onLoad(prePage.options);
										    }
										}
										catch (e)
										{

										}

										that.$.navigateBack(2)

									}, 200)
                                }
                            })
                        }
                        else
                        {
                            that.$.confirm(msg);
                        }
                    }

                });
            },
            inputphone: function (e) {
                let that = this;
                this.setData({user_mobile: e.detail.value});
                that.$.isNull(e.detail.value) ? this.setData({isUserMobile: !1}) : /^1[0123456789]\d{9}$/.test(e.detail.value) ? this.setData({isUserMobile: !0}) : this.setData({isUserMobile: !1})
            },


            inputcode: function (e) {
                let that = this;
                this.setData({mobile_code: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isCode: !1}) : this.setData({isCode: !0})
            },
            getSmsCode: function () {
                let that = this;

				if (!that.$.tel(this.user_mobile, this.user_intl))
				{
					this.setData({isUserMobile: !1});

					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('手机号不正确')
					});
					return false;
				}

				//获取验证码
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）


				/*
                if (!this.isImgCode)
                {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入正确的图形验证码',
                    });
                    return;
                }
                */

				setTimeout(function(){
					that.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
				},60000)

                if (this.isSend)
                {
                    this.setData({isSend: !1});
                    var t = this.sendTime;
                    var params = {
                        mobile: this.user_intl + this.user_mobile
                    };

                    that.$.request({
                        url: this.Config.URL.account.get_mobile_checkcode,
                        data: params,
                        success: function (data, status, msg, code) {
                            if (status == 200)
                            {
                                var r = setInterval(function () {
                                    t > 0 ? that.setData({btntext: t-- + "s"}) : (that.setData({
                                        isSend: !0,
                                        sendTime: 120,
                                        btntext: that.__("重新发送")
                                    }), clearInterval(r))
                                }, 1e3);
                            }
                            else
                            {
                                that.setData({isSend: !0});
                                that.$.alert(msg)

								that.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
                            }
                        }
                    });
                }
            },

			startTimer: function() {
				var that = this;
				if (that.cTimer == null) {
					that.countdown--;
					that.cTimer = setInterval(function() {
						that.countdown--;
						if (that.countdown == 0) {
							that.clearTimer();
						}
					}, 1000);
				}
			},
			clearTimer: function() {
				var that = this;
				clearInterval(that.cTimer);
				that.cTimer = null;
				that.countdown = 6;
			}
        }
    };
</script>


<style lang="scss">
	@import '../../styles/reg.scss';
</style>
