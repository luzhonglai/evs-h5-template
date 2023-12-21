<template>
    <view class="page">
        <view class="m-cells m-cells-form">

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('真实姓名')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="user_data.user_realname" :placeholder="__('请输入真实姓名')" @input="inputReName" maxlength="10" />
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('身份证')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="idcard" v-model="user_data.user_idcard" :placeholder="__('请输入身份证号码')" @input="inputICard" maxlength="18" />
				</view>
				<div v-if="(!isCardNo)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</div>
			</view>


            <view class="m-cell">
                <view style="font-size: 20upx;">{{__('温馨提示：请上传原始比例的身份证正反面，请勿裁剪涂改，保证身份信息清晰显示，否则无法通过审核')}}
                </view>
            </view>

			<view class="m-cell" style="padding: 3upx 30upx">
				<view class="m-cell-hd"><label class="u-label">{{__('身份证正面')}}</label></view>
				<view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-if="user_data.user_idcard_images[0]">
								<view class="uni-uploader__file">
									<image class="uni-uploader__img" v-if="1!==user_data.user_certification" data-imgindex="0" :src="user_data.user_idcard_images[0]" :data-src="user_data.user_idcard_images[0]" @click.stop="upImgs"></image>
									<image class="uni-uploader__img" v-else data-imgindex="0" :src="user_data.user_idcard_images[0]" :data-src="user_data.user_idcard_images[0]"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-else>
								<view class="uni-uploader__input" data-imgindex="0" @click.stop="upImgs"></view>
							</view>
						</view>
					</view>
				</view>
			</view>


			<view class="m-cell" style="padding: 3upx 30upx">
				<view class="m-cell-hd"><label class="u-label">{{__('身份证反面')}}</label></view>
				<view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-if="user_data.user_idcard_images[1]">
								<view class="uni-uploader__file">
									<image class="uni-uploader__img" v-if="1!==user_data.user_certification" data-imgindex="1" :src="user_data.user_idcard_images[1]" :data-src="user_data.user_idcard_images[1]" @click.stop="upImgs"></image>
									<image class="uni-uploader__img" v-else data-imgindex="1" :src="user_data.user_idcard_images[1]" :data-src="user_data.user_idcard_images[1]"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-else>
								<view class="uni-uploader__input" data-imgindex="1" @click.stop="upImgs"></view>
							</view>
						</view>
					</view>

				</view>
			</view>

			<view class="btn_box" v-if="1!==user_data.user_certification"><button class="u-btn u-btn-default" @tap="submitdata">{{__('保存')}}</button></view>
			<view class="btn_box" v-else><button class="u-btn u-btn-default">{{__('实名认证已经审核通过')}}</button></view>
        </view>

    </view>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import verifycodeDialog from '../../components/verifycode-dialog/verifycode-dialog.vue';
export default {
    name: 'asset',
    data: function() {
        return {
				user_data: {
                    user_realname: '',
                    user_idcard: '',
					user_certification:0,
                    user_idcard_images: []
                },
				isCardNo: !0,
        };
    },
		components: {
			verifycodeDialog,
		},
    computed: mapState([
        'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin'
    ]),
    onLoad: function(options) {
		uni.setNavigationBarTitle({
			title:this.__('实名认证')
		});

		var that = this;
        this.Phone = this.userInfo.user_mobile;

		this.user_data = Object.assign({}, this.userInfo);

		this.initData();
    },
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
		initData:function(){
			let that = this;

			that.$.request({
				url: that.Config.URL.account.certificate.replace(/typ=e/, "typ=json"),
				data: {},
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.setData({
							user_data: data
						})
					} else {
					}
				},
			})
		},
        inputReName: function(e) {
            this.setData({
                //user_realname: e.detail.value
            })
        },
		inputICard: function(e) {
			let that = this;
			if (that.$.isNull(e.detail.value)) {
				this.setData({
					isCardNo: !0,
					user_idcard: e.detail.value
				});
				return
			}
			this.IdentityCodeValid(e.detail.value) ? this.setData({
				isCardNo: !0
			}) : this.setData({
				isCardNo: !1
			}), this.setData({
				user_idcard: e.detail.value
			})
		},

        upImgs: function(e) {
            var that = this;
			var i = e.currentTarget.dataset.imgindex;
			let ukey = uni.getStorageSync('ukey');
            that.$.chooseImage({
                count: 1,
                sizeType: ["compressed"],
                success: function(n) {
                    that.$.showLoading();
                    var r = n.tempFilePaths;
                    that.$.uploadFile({
                        url: that.Config.URL.upload,
                        method: "POST",
                        filePath: r[0],
                        name: "upfile",
						formData: {'perm_key':ukey},
                        success: function(n) {
                            that.$.hideLoading();
                            var up_res = that.$.parseJSON(n.data);
							if (up_res.status == 200)
							{
								var s = up_res.data.url;

								let info = Object.assign({}, that.user_data);
								info['user_idcard_images'][i] = s;
								//that.login(that.user_data);

								that.setData({
									user_data: info
								})
							}
							else
							{
								that.$.confirm(up_res.msg || that.__('发生错误'));
							}

                        },
                        fail: function(e) {
                            that.$.hideLoading()
                        },
                        complete: function(e) {
                            that.$.hideLoading()
                        }
                    })
                },
                fail: function(e) {
                    that.$.hideLoading()
                },
                complete: function(e) {
                    that.$.hideLoading()
                }
            })
        },
        submitdata: function() {
            let that = this;
			if (!that.$.trim(that.user_data.user_realname)) {
				that.$.confirm('请输入用户名');
				return;
			}
			
			if (!that.user_data.user_idcard) {
				that.$.confirm('请输入身份证号码');
				return;
			}
			
			if(!that.$.idcard(that.user_data.user_idcard)){
				that.$.confirm('请输入正确的身份证号码');
				return;
			}
			
			if (!that.user_data.user_idcard_images[0]) {
				that.$.confirm('请上传身份证照片正面');
				return;
			}
			
			if (!that.user_data.user_idcard_images[1]) {
				that.$.confirm('请上传身份证照片反面');
				return;
			}
			
                    var params = {
						user_realname: that.user_data.user_realname,
						user_idcard: that.user_data.user_idcard,
						user_idcard_images: that.user_data.user_idcard_images.toString().replace("\""),
                    };

                    that.$.request({
                        url: that.Config.URL.account.commit_certificate.replace(/typ=e/, "typ=json"),
                        data: params,
                        success: function(data, status, msg, code) {
                            if (status == 200) {
									that.$.showToast({
										title: that.__("成功,待平台审核"),
										success: function() {
											that.login(that.user_data);

											setTimeout(function() {that.$.navigateBack(1)}, 1500);

										}
									})
                            } else {
								that.$.confirm(msg);
                            }
                        }
                    });
        }
    }
};
</script>


<style lang="scss">
@import '../../styles/_variables.scss';
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

.uni-uploader__img
{
	width: 320upx;
	height: 200upx;
}
</style>
