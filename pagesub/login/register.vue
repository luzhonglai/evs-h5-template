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
					v-if="bind_type==1"
					v-model="user_account"
					type="text"
					isShowIntl
					@intl="intlChange"
					:placeholder="__('请输入手机号码')"
				></wInput>

				<wInput
					v-if="bind_type==2"
					v-model="user_account"
					type="text"
					:placeholder="__('请输入电子邮箱')"
				></wInput>


				<wInput
					v-if="bind_type==3"
					v-model="user_account"
					type="text"
					:placeholder="__('请输入账号')"
				></wInput>
				
				<wInput
					v-model="user_password"
					type="password"
					:placeholder="__('请输入登录密码')"
					isShowPass
				></wInput>

				<wInput
					v-if="bind_type!=3"
					v-model="mobile_code"
					:type="bind_type==3 ? 'string' : 'number'"
					maxlength="4"
					:placeholder="__('请输入验证码')"
					isShowCode
					:isShowCodeImg="bind_type==3"
					:codeText="__('获取验证码')"
					ref="runCode"
					@setCode="getSmsCode()"
				></wInput>

				<view class="m-cell m-cell-vcode" 
					v-if="bind_type==3">
					<view class="m-cell-hd">
						<label class="u-label">{{__('图形码')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input"  :placeholder="__('请输入验证码')" maxlength="6" @input="onInputImgCode"/>
					</view>
					<view v-if="(!isImgCode)" class="m-cell-ft">
						<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
					</view>
					<view class="m-vcode-btn" @click="refresh">
						<imgcode ref="imgcode"></imgcode>
					</view>
				</view>

				<wInput
						v-model="seladstr"
						type="text"
						:placeholder="seladstr"
						v-if="Config.PLANTFORM_FX_AGENT_ENABLE"
						@click.native="showbox"
				></wInput>

				<wInput
						v-model="source_user_id"
						type="text"
						:placeholder="__('请输入推荐人编号')"
						v-if="Config.PLANTFORM_FX_ENABLE"
				></wInput>
				
				<block  v-if="hall_enterprise_enable">
					<wInput
							v-model="user_company_id"
							type="text"
							:placeholder="__('请输入企业编号')"
							v-if="!user_type"
					></wInput>
					
					<view class="uni-padding-wrap"  style="display: flex;flex-wrap:nowrap">
						 <radio-group @change="radioChange">
						 	<label class="radio" style="margin-right: 30rpx;">
						 		<radio value="0" name="user_type" checked="true"/>{{__('个人身份')}}
						 	</label>
						 	<label class="radio">
						 		<radio value="1" name="user_type"/>{{__('企业身份')}}
						 	</label>
						 </radio-group>
					</view>
					<block  v-if="user_type">
						<view class="m-upImg">
							<view>{{__('企业证书')}}</view>
							<view class="m-upImg-item" >
								<block v-if="user_company_certificates">
								   <image lazy-load mode="aspectFit" :src="(user_company_certificates)"  @click="upImgs"></image>
								</block>
								<view  v-else class="m-upImg-item upSelect"  @click.stop="upImgs">
									<label class="iconfont icon-xiangji"></label>
								</view>
							</view>
					
						</view>
						
						  <picker @change="bindPickerChange" :value="index" :range="industry"  range-key="industry_name">
						                        <view class="uni-input">{{industry[index].industry_name}}</view>
						                    </picker>
					</block>
				</block>
				
		
				
	
			</view>

			<wButton
				:text="__('注 册')"
				:rotate="isRotate"
				@click.native="startReg()" style="margin-top: 30rpx;"
			></wButton>


			<view class="other_login cuIcon" style="margin-top:40rpx">
				<view class="login_icon">
					<view class="cuIcon-item" style="height: 32px;"><image src="/static/images/login/phone.png" @tap="onChangeBindType(1)"></image></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-item" style="height: 32px;"><image src="/static/images/login/email.png" @tap="onChangeBindType(2)"></image></view>
				</view>
			</view>

			<!-- 底部信息 -->
			<view class="footer">
				<text
					@tap="isShowAgree"
					class="cuIcon"
					:class="showAgree?'cuIcon-radiobox':'cuIcon-round'"
				>{{__('同意')}}</text>
				<!-- 协议地址 -->
				<navigator url="/member/member/protocol?id=reg_protocols_description" open-type="navigate">《{{__('注册协议和隐私协议')}}》</navigator>
			</view>
		</view>

		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
						   @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>



<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
    import imgcode from '@/components/verify-code/imgcode.vue';
    import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data: function() {
            return {
                user_account: "",
                user_nickname: "",
				logo: "",
                user_intl: "",
                user_mobile: "",
                user_email: "",
				user_company_id: "",
				user_company_certificates: "",
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
                source_user_id: '',
				source_ucc_code: '',
				activity_id: '',


                bind_type: 1,  //1:手机号注册   2:email 注册  3:字符串
                bind_mobile: 1,  //1:手机号注册   2:email 注册
                bind_email: 2,  //1:手机号注册   2:email 注册
                bind_string: 3,  //1:手机号注册   2:email 注册

                isDistrict: !0,
				
				user_type: 0,
				industry: [],
				industry_id: 0,
				
				index: 0,
				hall_enterprise_enable: 0,

                Pindex: 0,
                selectedProId: 0,
                selectedCityId: 0,
                selectedCountyId: 0,
                selectedPro: '',
                selectedCity: '',
                selectedCounty: '',
                seladstr: "请选择所属地区",

                cityPickerValueDefault: [0, 0, 0],
                themeColor: '#007AFF',


					protocol_text:'',
					bannerShow:false,
					countdown: 6,
					cTimer: null,


				showAgree:false, //协议是否选择
				isRotate: false //是否加载旋转
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			wInput,
			wButton,
            imgcode,
            mpvueCityPicker
		},
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('注册')
            });
			
			var that = this;

			this.setData({
				options: options
			})

            //this.bind_type = options.bind_type==2 ? this.onChangeBindType(this.bind_email) : this.onChangeBindType(this.bind_mobile);
			
			if (options.bind_type == 2)
			{
				 this.onChangeBindType(this.bind_email)
			}
			else if (options.bind_type == 1)
			{
				this.onChangeBindType(this.bind_mobile)
			}
			else if (options.bind_type == 3)
			{
				this.onChangeBindType(this.bind_string)
			}

            this.btntext = this.__('发送')
            this.seladstr = this.__('请选择所属地区')

            let source_user_id = this.$.getStorageSync('source_user_id');
			this.setData({source_user_id: source_user_id})
			let source_ucc_code = this.$.getStorageSync('source_ucc_code');
			this.setData({source_ucc_code: source_ucc_code})

			//行业领域
			/*
			that.$.request({
			    url: this.Config.URL.getIndustry,
			    data: {},
			    success: function (data, status, msg, code) {
					if(status == 200)
					{
						that.setData({
							industry: data
						})
					}
				}
			})
			*/
		   
			setTimeout(()=>{
				this.getPlantformInfo((plantformInfo)=> {
					this.logo = plantformInfo.logo;
					this.hall_enterprise_enable = false && (plantformInfo.config.hall_enterprise_enable || false);
			
				});
			
			}, 200);

            this.show();
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			onChangeBindType:function(bind_type){
				this.bind_type = bind_type;

				if (this.bind_email == this.bind_type)
				{
					uni.setNavigationBarTitle({
						title:this.__('电子邮箱注册')
					});
				}

				if (this.bind_mobile == this.bind_type)
				{
					uni.setNavigationBarTitle({
						title:this.__('手机号注册')
					});
				}

				return this.bind_type;
			},
			
			radioChange: function(e) {
				this.setData({
					user_type: parseInt(e.detail.value)
				})
				
			},
			
			bindPickerChange: function(e) {
			          this.index = e.target.value
			},
			
			upImgs: function (e) {
			    var that = this;
			
			    that.$.chooseImage({
			        count: 1, sizeType: ["compressed"], success: function (n) {
			            that.$.showLoading();
			            var r = n.tempFilePaths;
			            that.$.uploadFile({
			                url: that.Config.URL.upload,
			                method: "POST",
			                filePath: r[0],
			                name: "upfile",
			                //header: {"content-type": "multipart/form-data"},
			                success: function (n) {
			                    that.$.hideLoading();
			
			                    var up_res = that.$.parseJSON(n.data);
			                    var s = up_res.data.url;
			                    that.setData({user_company_certificates: s})
								console.log(that.user_company_certificates)
			                },
			                fail: function (e) {
			                    that.$.hideLoading()
			                },
			                complete: function (e) {
			                    that.$.hideLoading()
			                }
			            })
			        },
			        fail: function (e) {
			            that.$.hideLoading()
			        },
			        complete: function (e) {
			            that.$.hideLoading()
			        }
			    })
			},

			intlChange:function(data){
				this.user_intl = data;
			},

            /* start 图形验证码 */
            refresh:function(){
                this.$refs.imgcode.refresh();
            },
            show:function(){
                var _self=this;
                setTimeout(function(){
                    _self.refresh();
                },500);
            },
            onInputImgCode:function(e){
				this.mobile_code  = e.detail.value.toLocaleLowerCase();
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


            startReg: function (e) {
				let that = this;

				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}

				if (that.bind_type == that.bind_mobile)
				{
					if (!that.$.tel(this.user_account, this.user_intl))
					{
						this.setData({isUserMobile: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('手机号不正确')
						});

						return false;
					}
				}
				else if (that.bind_type == that.bind_email)
				{
					if (!that.$.email(this.user_account))
					{
						this.setData({isUserEmail: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('电子邮箱不正确')
						});

						return false;
					}
				}
				/*
                if (that.$.isNull(this.user_nickname))
                {
                    this.setData({isNickname: !1});
                }

                if (that.$.isNull(this.mobile_code))
                {
                    this.setData({isCode: !1});
                }
                */

                if (!that.$.minlength(this.user_password, 6))
                {
                    this.setData({isPassword: !1});

					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('密码至少大约6位')
					});

					return false;
                }

				if ((this.bind_type!=3) && this.mobile_code.length != 4) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('验证码不正确')
					});

					return false;
				}


                if (that.$.isNull(this.selectedProId) || that.$.isNull(this.selectedCityId) || that.$.isNull(this.selectedCountyId))
                {
					if (that.cf.PLANTFORM_FX_AGENT_ENABLE)
					{
						this.setData({isDistrict: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('请选择地区信息')
						});

						return ;
					}
                }

				this.update();
            },

            update: function () {
                var that = this;

				if (that.bind_type == 3)
				{
					if (this.mobile_code.toLocaleLowerCase() == uni.getStorageSync('imgcode').toLocaleLowerCase())
					{
					}
					else
					{
						uni.showToast({
							icon: 'none',
							title: that.__('验证码有误'),
						});
						
						return;
					}
				}
					
				if (!this.showAgree)
				{
					that.$.confirm(that.__('请先同意注册协议'));

					uni.showToast({
						icon: 'none',
						title: that.__('请先同意注册协议'),
					});

					return;
				}

                var params = {
					user_account: this.user_account,
					user_mobile: '',
                    user_email: '',

                    user_nickname: this.user_nickname,
                    user_password: this.user_password,
                    user_avatar: this.user_avatar,

                    rand_key: this.user_intl + this.user_account,
                    verify_code: this.mobile_code,
					source_user_id: this.source_user_id,
					source_ucc_code: this.source_ucc_code,
					activity_id: this.activity_id
                };

                params.bind_type = that.bind_type; //1:手机号注册   2:Email注册

				if (that.bind_type == that.bind_mobile)
				{
					params.user_account = this.user_intl + this.user_account;
					params.user_mobile  = this.user_intl + this.user_account;

					params.rand_key     = this.user_intl + this.user_account;
				}
				else if (that.bind_type == that.bind_email)
				{
					params.user_account = this.user_account;
					params.user_email   = this.user_account;
					params.rand_key     = this.user_account;
				}
				else
				{
					params.user_account = this.user_account;
					params.rand_key     = this.user_account;
					
					//服务端跳过验证。  
				}
				
                if (that.cf.PLANTFORM_FX_AGENT_ENABLE)
                {
                    params.user_province_id = that.selectedProId;
                    params.user_city_id = that.selectedCityId;
                    params.user_county_id = that.selectedCountyId;
                }
				
				
				if(that.user_type)
				{
					params.user_province_id = that.selectedProId;
					params.user_city_id = that.selectedCityId;
					params.user_county_id = that.selectedCountyId;
					params.user_company_certificates = that.user_company_certificates;
					params.industry_id = that.industry_id;
					
				}
				else
				{
					params.user_company_id = that.user_company_id;
				}

                that.$.request({
                    url: this.Config.URL.register,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
                            that.$.showToast({
                                title: that.__("注册成功!"), success: function () {
									var id = that.$.setStorageSync('uid', data.user_id);
									var key = that.$.setStorageSync('ukey', data.key);
									
									// #ifdef H5
									$cookies.set('uid', data.user_id);
									$cookies.set('ukey', data.key);
									// #endif

                                    that.login(data);

                                    if (data.im && that.plantformInfo.config.chat_global)
                                    {
                                        that.$Socket.connectserver(data.im);
                                    }

                                    //判断是否需要进入激活页面
									if (2 == data.user_state)
									{
										that.$.toActive();
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

            onInputNickname: function (e) {
                let that = this;
                this.setData({user_nickname:e.detail.value})
                that.$.isNull(e.detail.value) ? this.setData({isNickname: !1}) : this.setData({isNickname: !0})
            },

            onInputPassword: function (e) {
                let that = this;
                this.setData({user_password:e.detail.value})
                that.$.isNull(e.detail.value) ? this.setData({isPassword: !1}) : this.setData({isPassword: !0})
            },

            inputcode: function (e) {
                let that = this;
                this.setData({mobile_code: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isCode: !1}) : this.setData({isCode: !0})
            },
    
            getSmsCode: function () {
                let that = this;
				let url = this.Config.URL.account.get_mobile_checkcode;
				var params = {
				};

				if (that.bind_type == that.bind_mobile)
				{
					if (!that.$.tel(this.user_account, this.user_intl))
					{
						this.setData({isUserMobile: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('手机号不正确')
						});
						return false;
					}

					url = this.Config.URL.account.get_mobile_checkcode;
					params = {
					    mobile: this.user_intl + this.user_account
					};
				}
				else if (that.bind_type == that.bind_email)
				{
					if (!that.$.email(this.user_account))
					{
						this.setData({isUserEmail: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('电子邮箱不正确')
						});

						return false;
					}

					url = this.Config.URL.account.get_email_checkcode
					params = {
					    email: this.user_account
					};
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

                    that.$.request({
                        url: url,
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

            // 三级联动选择
            showbox() {
            	/*
            	this.setData({
            	    isShow: !0
            	})
            	*/
            	this.$refs.mpvueCityPicker.show()
            },

            onCancel(e) {
            	//console.log(e)
            },

            onConfirm(e) {
            	let that = this;
                //console.info(e);
                //console.info(JSON.stringify(e));
            	this.pickerText = JSON.stringify(e)

                this.setData({
                    isDistrict:true,
                    Pindex: this.cityCode,
                    selectedProId: e.value[0],
                    selectedCityId: e.value[1],
                    selectedCountyId: e.value[2],
                    selectedPro: e.label[0],
                    selectedCity: e.label[1],
                    selectedCounty: e.label[2],
                    seladstr: that.$.isNull(e.label.toString()) ? that.__("请选择地址") : e.label.toString()
                });
            },

			onChangeProtocol:function(e){
				var values = e.detail.value;

				if (values.length > 0)
				{
					this.showAgree = true;
				}
				else
				{
					this.showAgree = false;
				}
			},
			closeBanner: function() {
				this.bannerShow = false;
			},
			showBanner: function() {
				let that = this;

				that.$.request({
				    url: that.Config.URL.protocol,
				    data: {},
				    success: function (data, status, msg, code) {
				        if (status == 200)
				        {
							that.bannerShow = true;
							that.protocol_text = data.document;
				        }
				        else
				        {
				            that.$.confirm(msg);
				        }
				    }
				});

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
			},

			isShowAgree(){
            	let that = this;

				//是否选择协议
				that.showAgree = !that.showAgree;
			},

			showProtocol:function(id){
				uni.navigateTo({
					url:'/member/member/protocol?id=' + id
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
	
	.m-upImg {
		box-sizing: border-box;
		padding: 20upx;
		display: flex;
		line-height: 136upx;
		// background-color: #fff;
	}
	.m-upImg-item {
		width: 120upx;
		height: 120upx;
		// border: 1px solid #eee;
		display: inline-block;
		margin: 9upx;
		border-radius: 4upx;
		vertical-align: middle;
		position: relative;
	}
	.m-upImg-item image {
		width: 100%;
		height: 100%;
	}
	.u-del-item {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 40upx;
		background-color: rgba(0, 0, 0, 0.5);
		text-align: center;
		line-height: 40upx;
		color: #fff;
		z-index: 5;
	}
	.u-del-item label {
		font-size: 28upx;
	}
	
	.upSelect {
		background-color: #eee;
		text-align: center;
		line-height: 120upx;
	}
	.upSelect label {
		font-size: 40upx;
	}
	
	.m-submitComment {
		position: fixed;
		height: 100upx;
		width: 100%;
		background-color: #fff;
		border-top: 1px solid #eee;
		z-index: 5;
		left: 0;
		bottom: 0;
	}
	
	.uni-input {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 36upx;   /* Input 高度 */
		color: #333333;
		padding: 32upx;
		margin-top:24upx;
		margin-bottom: 24upx;
		
		border: none;
		border-radius: 2.5rem ;
		-webkit-box-shadow: 0 0 60upx 0 rgba(43,86,112,.1) ;
		box-shadow: 0 0 60upx 0 rgba(43,86,112,.1) ;
		background: none;
	}
</style>
