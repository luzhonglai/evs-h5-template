<template>
	<view>
		<view class='tails_box' :style='"height:" + CenterCoupon.AllowOfflineWriteOff?"640rpx":"400rpx"'>
		    <view class='tails_couname'>
		        <text>
					{{CenterCoupon.activity_name}}
					<span style="font-size: 12upx;margin-left:6upx;color:#FF9933" v-if="CenterCoupon.activity_on_is_off === 1">(线下使用)</span>
				</text>
		    </view>
		    <view class='tails_mon'><label style='font-size:30rpx;margin-right:8rpx;margin-left:25%'>{{__('￥')}}</label><label
		            style='font-size:60rpx;margin-right: 24rpx;ont-weight:bold;'>{{CenterCoupon.voucher_price || CenterCoupon.activity_rule.voucher_price}}</label><label
		            style='font-size:24rpx;color:#9B9B9B'>{{sprintf(__('满￥%s可用'), CenterCoupon.voucher_subtotal || CenterCoupon.activity_rule.requirement.buy.subtotal )}}</label></view>
		    <view class='tails_time' style='width:100%'>{{sprintf(__('有效日期至：%s'), CenterCoupon.voucher_end_date || CenterCoupon.activity_endtime)}}
		    </view>
		    <view class='tails_time' v-if="CenterCoupon.AllowOfflineWriteOff">
		        <image :src='CenterCoupon.WriteOffCodeUrl' style="width: 64%;height: 289rpx;"></image>
		    </view>
		    <view class='tails_time' style='font-size:24rpx;color:#9B9B9B ' v-if="CenterCoupon.AllowOfflineWriteOff">
		        {{CenterCoupon.WriteOffCode}}
		    </view>
		    <view class='btn_box' v-if="!CenterCoupon.AllowOfflineWriteOff" style="height: 100upx;">
				<view class='but-stl' style="margin-right: 86rpx;" @tap="receivenowWeixin"
					  v-if="CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_NORMAL  && CenterCoupon.CouponType==2" :data-id="CenterCoupon.activity_id">{{__('立即领取')}}
				</view>
				<view class='but-stl' style="margin-right: 86rpx;" @tap="receivenow"
					  v-if="CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_NORMAL" :data-id="CenterCoupon.activity_id">{{__('立即领取')}}
				</view>
				<view class='but-stl' style="margin-right: 86rpx;" v-if="(CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_FINISHED || CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_CLOSED) && CenterCoupon.voucher_state_id != StateCode.VOUCHER_STATE_USED"
					  :data-id="CenterCoupon.activity_id">{{__('已领完')}}
				</view>
		        <view class='but-stl' style="margin-right: 86rpx;" :data-id="CenterCoupon.activity_id"
		              v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_USED">{{__('已使用')}}
		        </view>
		        <view class='but-stl' style="margin-right: 86rpx;" :data-id="CenterCoupon.activity_id"
		              v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_TIMEOUT">{{__('已过期')}}
		        </view>
				<block   v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_UNUSED && CenterCoupon.AllowOfflineWriteOff == false">
					<view class='but-stl' style="margin-right: 86rpx;"
					v-if="(isOnLine)"
					      :data-id="CenterCoupon.activity_id" :data-store_id="(CenterCoupon.store_id)" @tap="usenow">{{__('立即使用')}}
					</view>
					<view class='but-stl' style="margin-right: 86rpx;"
					v-else
					      :data-id="CenterCoupon.activity_id" :data-store_id="(CenterCoupon.store_id)" :data-writeoff_code="CenterCoupon.writeoff_code"  @tap="Make">{{__('立即使用')}}
					</view>
				</block>
	
				
		        <view class='but-stl' style="margin-right: 86rpx;"
		              v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_UNUSED && CenterCoupon.AllowOfflineWriteOff" :data-id="CenterCoupon.activity_id" :data-store_id="(CenterCoupon.store_id)"
		              @tap="usenow">{{__('在线使用')}}
		        </view>


		        <view :data-id="CenterCoupon.activity_id" :data-name="CenterCoupon.Name" @tap="shareBox" class='but-stl02' v-if="false">{{__('分享给好友')}}
		        </view>
		    </view>
		</view>
		<view class='img_box'>
		    <image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/coupon/partingLine.png"
		           style="width:100%;height:100%;vertical-align:top;"></image>
		</view>
		<view class='tailfoli' style="overflow: hidden;">
		    <view class='btn_box' style='margin:9px auto 0 auto;overflow: hidden' v-if="CenterCoupon.AllowOfflineWriteOff">
		        <view class='but-stl' style="margin-right: 86rpx;" @tap="receivenowWeixin"
		              v-if="CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_NORMAL  && CenterCoupon.CouponType==2" :data-id="CenterCoupon.activity_id">{{__('立即领取')}}
		        </view>
		        <view class='but-stl' style="margin-right: 86rpx;" @tap="receivenow"
		              v-if="CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_NORMAL" :data-id="CenterCoupon.activity_id">{{__('立即领取')}}
		        </view>
		        <view class='but-stl' style="margin-right: 86rpx;" v-if="(CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_FINISHED || CenterCoupon.activity_state == StateCode.ACTIVITY_STATE_CLOSED) && CenterCoupon.voucher_state_id != StateCode.VOUCHER_STATE_USED"
		              :data-id="CenterCoupon.activity_id">{{__('已领完')}}
		        </view>
		        <view class='but-stl' style="margin-right: 86rpx;" :data-id="CenterCoupon.activity_id"
		              v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_USED">{{__('已使用')}}
		        </view>
		        <view class='but-stl' style="margin-right: 86rpx;" :data-id="CenterCoupon.activity_id"
		              v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_TIMEOUT">{{__('已过期')}}
		        </view>
		        <view class='but-stl' style="margin-right: 86rpx;"
		              v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_UNUSED && CenterCoupon.AllowOfflineWriteOff == false"
		              :data-id="CenterCoupon.activity_id" :data-store_id="(CenterCoupon.store_id)" @tap="usenow">{{__('立即使用')}}
		        </view>
		        <view class='but-stl' style="margin-right: 86rpx;"
		              v-if="CenterCoupon.voucher_state_id == StateCode.VOUCHER_STATE_UNUSED && CenterCoupon.AllowOfflineWriteOff "
		              :data-id="CenterCoupon.activity_id" :data-store_id="(CenterCoupon.store_id)" @tap="usenow">{{__('在线使用')}}
		        </view>
		        <view class='but-stl02' :data-id="CenterCoupon.activity_id" @tap="shareBox" :data-name="CenterCoupon.Name" v-if="false">{{__('分享给好友')}}
		        </view>
		        <view class='btn_mx' v-if="CenterCoupon.AllowOfflineWriteOff">{{__('支持线下使用（在门店购物时，向店员出示此码抵扣）')}}</view>
		    </view>
		    <view class='tails_tox' v-if="!CenterCoupon.AllowOfflineWriteOff">
		        <view class='tail_fo1'>{{__('使用条件')}}</view>
		        <view class='tail_fo2'>
		            <view style="margin-bottom: 10rpx; ">1、{{sprintf(__('满￥%s可用'), CenterCoupon.voucher_subtotal || CenterCoupon.activity_rule.requirement.buy.subtotal)}}</view>
		            <view>
						<label style="margin-right: 57rpx;">2、{{CenterCoupon.store_name}}{{__('可用')}}</label>
						<label v-if="CenterCoupon.activity_on_is_off === 0" style="color: #FFCA81;" :data-id="CenterCoupon.activity_id" @tap="usenow" :data-store_id="(CenterCoupon.store_id)">{{__('查看')}}</label>
					</view>
		        </view>
		    </view>
		</view>
		<view class='tails_tox' v-if="CenterCoupon.AllowOfflineWriteOff">
		    <view class='tail_fo5'>{{__('使用条件')}}</view>
		    <view class='tail_fo6'>
		        <view style="margin-bottom: 10rpx; ">1、{{sprintf(__('满￥%s可用'), CenterCoupon.voucher_subtotal || CenterCoupon.activity_rule.requirement.buy.subtotal)}}</view>
		        <view><label style="margin-right: 57rpx;">2、{{CenterCoupon.store_name}}{{__('可用')}}</label><label style="color: #FFCA81;"
		                                                                                                :data-id="CenterCoupon.activity_id"
																										:data-store_id="(CenterCoupon.store_id)"
		                                                                                                @tap="usenow">{{__('查看')}}</label>
		        </view>
		    </view>
		</view>
		<view style='width:100%'
		      v-if="CenterCoupon.Description != ''&& CenterCoupon.Description != null  || CenterCoupon.AllowOfflineWriteOff">
		    <view class='tails_tox' style="width: 85%;padding-bottom: 60rpx;">
		        <view class='tail_fo1' style='color:#fff '>{{__('使用说明')}}</view>
		        <view class='tail_fo3' style='color:#fff;height:43rpx' v-if="CenterCoupon.AllowOfflineWriteOff">
		            {{__('支持线下使用，领取后向店员展示优惠券详情')}}
		        </view>
		        <rich-text style='color:#fff;white-space: pre-line;font-size:22rpx;word-break:break-all'
		                   v-if='CenterCoupon.Description' nodes='CenterCoupon.Description'></rich-text>
		    </view>
		</view>
		<template is="shareMskTpl" data="PageQRCodeInfo"/>
		
		<view :class="bannerShow ? 'canvas' : 'hide'" @click="setHide">
			<canvas class="m-canvas" canvas-id="qrcode" style="width: 200px;height: 200px;" />
			</view>

	</view>
</template>

<script>
	import $ from "../../helpers/util";
	import uniQrcode from '@/components/uni-qrcode/uni-qrcode.vue';
	
	import uQRCode from '@/components/uni-qrcode/uqrcode.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				options: {},
				CenterCoupon:{activity_rule:{requirement:{buy:{}}}},
				cid: "",
				couponItemId: "",
				bannerShow: !1,
				isOnLine: !1, //是否线上优惠券
			};
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin'
		]),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('优惠券详情')
			});

			this.setData({cid: options.cid, couponItemId: options.couponItemId});

			var that = this;
			that.GetCouponInfo()

			/*
        	this.forceUserInfo(function(user) {
				if (user) {
					that.GetCouponInfo()
				}
			});
			*/
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			GetCouponInfo: function (e) {
				var params = {
						activity_id: this.cid,
						user_voucher_id: this.couponItemId
					},
					that = this;


				that.$.request({
					url: this.Config.URL.user.voucher_get,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							data.AllowOfflineWriteOff = false;
							that.setData({
								CenterCoupon: data
							});
						}
					}
				});
			},
			onGotUserInfo: function (e) {
				if (null != e.detail.userInfo)
				{
					var a = {
						Photo: e.detail.userInfo.avatarUrl,
						NickName: e.detail.userInfo.nickName,
						UserName: app.globalData.UserInfo.UserName
					};
					$.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, a), function (e) {
						//console.log("个人信息：", e)
					}), app.imageUrl = e.detail.userInfo.avatarUrl, app.nickName = e.detail.userInfo.nickName, app.authorize = !0, this.shareQRCode()
				}
			},
			shareQRCode: function (e) {
				//console.log("2：", this.cid);
				var a = this,
					o = {vendorId: app.globalData.VendorInfo.Id, userId: app.globalData.UserInfo.Id, couponId: this.cid};
				$.xsr($.makeUrl(userapi.QRCouponCodePoster, o), function (e) {
					//console.log("图片", e), a.setData({PageQRCodeInfo: {Path: e.Info, IsShare: !0, IsShareBox: !1, IsJT: !0}})
				})
			},
			showCodeImg: function () {
				wx.previewImage({current: this.PageQRCodeInfo.Path, urls: [this.PageQRCodeInfo.Path]})
			},
			saveImg: function () {
				var a = this;
				$.loading(), wx.downloadFile({
					url: this.PageQRCodeInfo.Path, success: function (e) {
						$.hideloading(), wx.saveImageToPhotosAlbum({
							filePath: e.tempFilePath, success: function () {
								a.setData({
									PageQRCodeInfo: {
										Path: "",
										IsShare: !1,
										IsShareBox: !1,
										IsJT: !1
									}
								}), $.alert("保存图片成功！")
							},
							fail: function (e) {
								$.hideloading()
							}
						})
					},
					fail: function (e) {
						$.hideloading()
					}
				})
			},
			cancelShare: function () {
				this.setData({PageQRCodeInfo: {Path: "", IsShare: !1, IsShareBox: !1, IsJT: !1}})
			},
			usenow: function (e) {
				let that = this;
				var t = e.currentTarget.dataset.store_id;
				that.$.redirectTo({
					url: "/member/product/coupon?store_id=" + t
				})
			},

			receivenow: function (e) {
				let that = this;
				that.getCoupon(e.currentTarget.dataset.id)
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
				let writeoff_code = e.currentTarget.dataset.writeoff_code;
				if(writeoff_code!=null && writeoff_code!=''){
					that.couponItemId = writeoff_code;
				}
			
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text:that.couponItemId,
					size: 200,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					// correctLevel: uQRCode.errorCorrectLevel.H,
					success: res => {
						// console.log(res);
					},
					fail: error => {
						console.log(error);
					}
				});
			},
			getCoupon: function (t) {
				let  that = this;
				var params = {
					activity_id: t,
					user_is_new: 0
				};

				this.forceUserInfo((user) => {
					if (user) {
						$.request({
							url: this.Config.URL.user.voucher_add,
							data: params,
							success: function(data, status, msg, code) {
								if (200 == status) {
									that.getCouponlist();

									that.$.confirm(that.__("领取成功!,去消费"),function(a) {
										if (a.confirm)
										{
											that.$.navigateTo({
											    url: "/pagesub/index/store?store_id=" + that.CenterCoupon.store_id
											})
										}

									});
								} else {
									$.alert(msg);
								}
							},
						});
					}
				});


				/*
				t && $.clearxsr($.makeUrl(userapi.UserReceiveCoupon, params), function (t) {
					0 == t.Code ? (that.setData({isCancelSuccess: !1, mskType: 2, Coupons: t.Info}), wx.showToast({
						title: "领取成功！",
						icon: "none"
					})) : wx.showToast({title: t.Msg, icon: "none"})
				})

				*/
			},
			shareBox: function () {
				this.setData({PageQRCodeInfo: {Path: "", IsShare: !0, IsShareBox: !0, IsJT: !1}})
			}
		}
	}
</script>



<style lang="scss">
@import "../../styles/_variables";

/* pages/Receivetails/Receivetails.wxss */
page {
    background: #DB384C
}

.tails_box {
    width: 94%;
    /*height: 345rpx;*/
    background: #fff;
    margin: 70rpx auto 0 auto;
    position: relative;
    padding-top: 18rpx;
    border-top-left-radius: 11px;
    border-top-right-radius: 11px;
}

.tails_logo {
    width: 112rpx;
    position: absolute;
    top: -14%;
    left: 42%;
    border-radius: 50%;
    overflow: hidden
}

.tails_shopname {
    width: 100%;
    color: #fff;
    font-size: 24rpx;
    text-align: center
}

.tails_couname {
    width: 100%;
    color: #DB384C;
    font-size: 36rpx;
    text-align: center;
    margin-top: 10rpx;
    font-weight: bold;
}

.tails_mon {
    width: 100%;
    color: #DB384C;
    text-align: center;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
}

.tails_but {
    width: 54%;
    margin: 43rpx auto 0 auto;
    height: 50rpx;
    background: #fff;
    border-radius: 54rpx;
    text-align: center;
    font-size: 24rpx;
    line-height: 50rpx;
    color: #DB384C
}

.tails_time {
    width: 64%;
    /*margin: 25rpx auto 0 auto;*/
    text-align: center;
    font-size: 22rpx;
    color: #DB384C
}

.tails_tox {
    width: 89%;
    margin: 0 auto;
}

.tail_fo1 {
    font-size: 24rpx;
    color: #000000;
    line-height: 62rpx
}

.tail_fo5 {
    font-size: 24rpx;
    color: #fff;
    padding-left: 20rpx;
    line-height: 62rpx
}

.tail_fo2 {
    width: 100%;
    font-size: 24rpx;
    color: #9B9B9B;
    border-radius: 10rpx
}

.tail_fo6 {
    width: 100%;
    font-size: 24rpx;
    color: #fff;
    padding-left: 20rpx;
    border-radius: 10rpx
}

.tail_fo3 {
    width: 100%;
    height: 137rpx;
    font-size: 22rpx;
    border-radius: 10rpx
}

.but-stl {
    width: 42%;
    float: left;
    text-align: center;
    height: 61rpx;
    border-radius: 50rpx;
    border: 1px solid #fff;
    background: #DB384C;
    font-size: 26rpx;
    color: #fff;
    line-height: 61rpx;
}

.but-stl02 {
    width: 42%;
    float: left;
    text-align: center;
    height: 61rpx;
    border-radius: 50rpx;
    border: 1px solid #DB384C;
    background: #fff;
    font-size: 26rpx;
    color: #DB384C;
    line-height: 61rpx;
}

.tailfoli {
    width: 94%;
    height: 88px;
    background: #fff;
    border-bottom-left-radius: 11px;
    border-bottom-right-radius: 11px;
    margin: 0 auto;
}

.btn_box {
    width: 88%;
    margin: 22px auto 0 auto;
    wxcs_style_margin: 22px auto 0 auto;
	/*height: 100upx;*/
	display: flex;
}

.img_box {
    width: 94%;
    height: 72rpx;
    margin: 0 auto
}

.btn_mx {
    text-align: center;
    font-size: 22rpx;
    color: #9B9B9B;
    margin: 88rpx 0 0
}

.m-canvas {
	position: absolute !important; /*重要的一步是设置绝对定位*/
	margin: auto; /*将四周边距都设为auto自动*/
	left: 0; /*离包含元素的距离均设为零*/
	right: 0;
	top: 0;
	bottom: 0;
}

.canvas {
	background: rgba(0, 0, 0, 0.6);
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	z-index: 99;
}

</style>
