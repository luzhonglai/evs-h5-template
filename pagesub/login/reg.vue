<template>
    <view class="page11 content">
        <view class="m-cells m-cells-form">

            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('账号')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="number" :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone" :value="user_mobile"/>
                </view>
                <view v-if="(!isUserMobile)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>
            <view class="m-cell m-cell-vcode">
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

            <view class="m-cell m-cell-vcode">
                <view class="m-cell-hd">
                    <label class="u-label">{{__('验证码')}}</label>
                </view>
                <view class="m-cell-bd">
                    <input class="u-input" type="number" :placeholder="__('请输入手机验证码')" maxlength="6" @input="inputcode"/>
                </view>
                <view v-if="(!isCode)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
                <view v-if="(isSend)" @click="sendmessage" class="m-vcode-btn">{{btntext}}</view>
                <view v-else class="m-vcode-btn">{{btntext}}</view>
            </view>

            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('昵称')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" :placeholder="__('请输入昵称')"  :value="user_nickname" @input="onInputNickname"/>
                </view>
                <view v-if="(!isNickname)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>

            <view class="m-cell" style="">
                <view class="m-cell-hd"><label class="u-label">{{__('头像')}}</label></view>
                <view class="m-cell-bd" >
                    <image lazy-load mode="aspectFit" :src="(user_avatar)" @click.stop="upImgs" style="width: 60upx;height: 60upx;line-height:  60upx;margin-top:20upx;"></image>
                </view>
            </view>

            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('密码')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text"  :placeholder="__('请输入登录密码')"  :value="user_password"  @input="onInputPassword"/>
                </view>
                <view v-if="(!isPassword)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>

			<view class="m-cell" @click="showbox" v-if="Config.PLANTFORM_FX_AGENT_ENABLE">
				<view class="m-cell-hd"><label class="u-label">{{__('地区')}}</label></view>
				<view class="m-cell-bd">
					<label>{{seladstr}}</label>
				</view>
                <view v-if="(!isDistrict)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
			</view>

			<view class="m-cell" v-if="Config.PLANTFORM_FX_ENABLE">
			    <view class="m-cell-hd"><label class="u-label">{{__('推荐人')}}</label></view>
			    <view class="m-cell-bd">
			        <input class="u-input" type="text" :placeholder="__('请输入推荐人编号')"  :value="source_user_id"/>
			    </view>
			</view>
        </view>

		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>

        <view class="btn-row" style="margin-top: 0;">
			<checkbox-group @change="onChangeProtocol">
				<label>
					<checkbox :checked="protocol_checked" value="1" />{{__('同意')}}
				</label>
				<label @tap="showBanner">
					{{__('注册协议')}}
				</label>
			</checkbox-group>
        </view>

        <view class="btn-row" style="margin-top: 0;">
            <button type="primary" class="primary" @click="submitInfo">{{__('注册')}}</button>
        </view>


		<!-- 弹出层 -->
		<view class="uni-banner" style="background:#FFFFFF;" v-if="bannerShow">
			<view style="justify-content:flex-end;" @tap="closeBanner">
				<view style="justify-content:flex-end; text-align:right; padding:20upx;">
					<text class="uni-icon uni-icon-close"></text>
				</view>
			</view>
			<view style="padding: 20upx;">

			<scroll-view scroll-y="true" style="height: 387px">
				<p v-html="protocol_text"></p>
			</scroll-view>
			</view>
			<view style="padding:50upx 0; padding-bottom:68upx;">
				<button
					type="warn"
					class="mini-btn"
					v-if="countdown == 6"
					@click="closeBanner"
					style="background:#F6644D; margin:0 80upx;"
				>
					{{__('确认同意网站服务协议')}}
				</button>
				<button
					type="warn"
					class="mini-btn"
					v-if="countdown < 6"
					style="background:#F6644D; margin:0 80upx;"
				>
					{{ countdown }}s
				</button>
			</view>
		</view>
		<view class="uni-mask" v-if="bannerShow"></view>
		<!-- 弹出层 -->
    </view>
</template>

<style lang="scss">
    @import "../../styles/_variables";
    @import '../../styles/login.scss';
    .m-cell, m-cell-vcode{

        height:60upx;
        min-height:60upx;
        padding:20upx 0;
        padding-left:60upx;
        line-height:60upx;
    }

    .m-cell-bd{width: 80%}
    .m-cell-hd{
        width: 20%;
    }

    .m-cell-bd label{color: #888;}
    .m-cell-vcode {/*padding-top: 0;padding-right: 0;padding-bottom: 0;*/}
    .m-vcode-img{width: 216upx;height: 88upx;}
    .btn_box{padding: 20upx;}
    .m-code{right: 210upx;}
    .m-vcode-btn{width: 150upx;text-align: center;}

        .m-cell-vcode .m-icon-warn{
        position: relative;
        margin-top: 0px;
    }


	/* 遮罩层 */
	.uni-mask {
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 1;
	}

	/* 弹出层形式的广告 */
	.uni-banner {
		width: 96%;
		height: 80%;
		position: fixed;
		left: 50%;
		top: 50%;
		background: #fff;
		border-radius: 10upx;
		z-index: 99;
		transform: translate(-50%, -50%);
	}
</style>

<script>
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
                source_user_id: '',



                isDistrict: !0,

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


					protocol_checked:true,
					protocol_text:'',
					bannerShow:false,
					countdown: 6,
					cTimer: null
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
            imgcode,
            mpvueCityPicker
		},
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('注册')
            });

            this.btntext = this.__('发送')
            this.seladstr = this.__('请选择所属地区')

            let source_user_id = this.$.getStorageSync('source_user_id');
			this.setData({source_user_id: source_user_id})

            this.show();
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

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
            submitInfo: function (e) {
				let that = this;
                /*
                if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.user_email))
                {
                    this.setData({isUserEmail: !1});
                    return
                }
                */

                if (that.$.isNull(this.user_mobile))
                {
                    this.setData({isUserMobile: !1});
                }

                if (!/^1[0123456789]\d{9}$/.test(this.user_mobile))
                {
                    this.setData({isUserMobile: !1});
                }

                if (that.$.isNull(this.user_nickname))
                {
                    this.setData({isNickname: !1});
                }

                if (that.$.isNull(this.mobile_code))
                {
                    this.setData({isCode: !1});
                }

                if (that.$.isNull(this.user_password))
                {
                    this.setData({isPassword: !1});
                }


                if (that.$.isNull(this.selectedProId) || that.$.isNull(this.selectedCityId) || that.$.isNull(this.selectedCountyId))
                {
                    this.setData({isDistrict: !1});
                }


                if (this.isUserMobile &&this.isUserEmail &&this.isNickname &&this.isPassword && this.isCode)
                {
					if (that.cf.PLANTFORM_FX_AGENT_ENABLE)
					{
						if (this.isDistrict)
						{
							this.update();
						}
					}
					else
					{
						this.update();
					}

                }
            },

            update: function () {
                var that = this;

				if (!this.protocol_checked)
				{
					that.$.confirm('请先同意注册协议');

					uni.showToast({
						icon: 'none',
						title: __('请先同意注册协议'),
					});

					return;
				}

                var params = {
                    user_account: this.user_mobile,
                    user_nickname: this.user_nickname,
                    user_password: this.user_password,
                    user_avatar: this.user_avatar,
                    user_mobile: this.user_mobile,
                    rand_key: this.user_mobile,
                    verify_code: this.mobile_code,
					source_user_id: this.source_user_id,
                };

                if (that.cf.PLANTFORM_FX_AGENT_ENABLE)
                {
                    params.user_province_id = that.selectedProId;
                    params.user_city_id = that.selectedCityId;
                    params.user_county_id = that.selectedCountyId;
                }

                that.$.request({
                    url: this.Config.URL.register,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
                            that.$.showToast({
                                title: "注册成功!", success: function () {

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
                                that.setData({user_avatar: s})
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
            sendmessage: function () {
                let that = this;
                if (that.$.isNull(this.user_mobile))
                {
                    this.setData({isUserMobile: !1});
                }
                else if (!/^1[0123456789]\d{9}$/.test(this.user_mobile))
                {
                    this.setData({isUserMobile: !1});
                }
                else if (!this.isImgCode)
                {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入正确的图形验证码',
                    });
                    return;
                }
                else if (this.isSend)
                {
                    this.setData({isSend: !1});
                    var t = this.sendTime;
                    var params = {
                        mobile: this.user_mobile
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
                                        btntext: "重新发送"
                                    }), clearInterval(r))
                                }, 1e3);
                            }
                            else
                            {
                                that.setData({isSend: !0});
                                that.$.alert(msg)
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
                    seladstr: that.$.isNull(e.label.toString()) ? "请选择地址" : e.label.toString()
                });
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
				var _this = this;
				if (_this.cTimer == null) {
					_this.countdown--;
					_this.cTimer = setInterval(function() {
						_this.countdown--;
						if (_this.countdown == 0) {
							_this.clearTimer();
						}
					}, 1000);
				}
			},
			clearTimer: function() {
				var _this = this;
				clearInterval(_this.cTimer);
				_this.cTimer = null;
				_this.countdown = 6;
			}
        }
    };
</script>
