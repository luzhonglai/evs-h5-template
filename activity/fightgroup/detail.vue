<template>
	<view class="page">
	<scroll-view scroll-y="true" @scrolltolower="fightPage" style="position: absolute;height:100%;width:100%;">
			<view class="m-product-list">
				<navigator :url="'/pages/product/detail?pid=' + (GbInfo.activity_rule.item_id) + '&gb_id=' + (GbInfo.gb_id)" class="m-product-item m-product-GP">
					<view class="m-product-img">
						<image lazy-load :src="(GbInfo.activity_rule.product_image)" />
					</view>
					<view class="m-product-info">
						<view class="m-product-name">
							<label>{{GbInfo.activity_rule.item_name}}</label>
							<view class='groupNumber' style='margin-top:18upx'>{{__('拼团省')}} {{__('￥')}}{{number_format(parseFloat((GbInfo.activity_rule.item_unit_price - GbInfo.activity_rule.group_sale_price).toFixed(12)), 2)}}</view>
						</view>
						<view style='position:absolute;bottom:20upx;'>
							<view class="groupNumber" style='margin-bottom:12upx'>
								<!-- <label class="iconfont icon-icon"></label> -->
								<text style="margin-right: 6rpx;">{{GbInfo.gb_quantity}}</text> {{__('人团')}}
							</view>
							<view class="m-product-price">
								<label>{{__('￥')}}</label>{{number_format(GbInfo.activity_rule.group_sale_price, 2)}}
								<label class="u-del-price" style="margin-left: 6rpx;">{{__('￥')}}{{number_format(GbInfo.activity_rule.item_unit_price, 2)}}</label>
							</view>
						</view>

						<view class="isSucces">
							<image lazy-load class='simg' v-if="(1==GbInfo.gb_enable)" src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/groupbooking/success.png'></image>
							<image lazy-load class='simg' v-if="(0==GbInfo.gb_enable)" src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/groupbooking/failure.png'></image>
						</view>
					</view>
				</navigator>
				<view class="headPhoto">
					<view class="personPhoto" v-for="(item, i) in GroupUsers" :key="i">
						<image lazy-load class="photo" :src="(item.user_avatar)"></image>
						<image lazy-load class="photo-icon" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/groupbooking/group_leader.png"
						 v-if="(GbInfo.user_id == item.user_id)"></image>
					</view>
					<view class="personPhoto" v-if="(GbInfo.gb_quantity>8?(8-GbInfo.gb_amount_quantity):(GbInfo.gb_quantity-GbInfo.gb_amount_quantity))">
						<image lazy-load class="photo-bg" src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/groupbooking/waiting.png'></image>
					</view>
				</view>
				<view class="surplus" v-if="(GbInfo.gb_enable==2 && show)">
					<view>{{sprintf(__('仅剩 %s 名额，'), GbInfo.gb_quantity-GbInfo.gb_amount_quantity)}}</view>
					<label style='min-width:160upx;'>
						<day-countdown :timer="(GbInfo.gb_endtime)" :Type="2"></day-countdown>
					</label>
					<label>{{__('后结束')}}</label>
				</view>
				<block v-if="(show)">
					<view class="m-btn-box" v-if="(GbInfo.gb_enable==2 && !groupIsEnd)">
						<view class="u-btn u-btn-default" @click="shareBox">{{__('邀请好友参团')}}</view>
					</view>
					<navigator url="/activity/fightgroup/list" class="m-btn-box" v-if="(GbInfo.gb_enable==0)">
						<view class="u-btn u-btn-default">{{__('点击再开一团')}}</view>
					</navigator>
					<navigator url="/activity/fightgroup/list" class="m-btn-box" v-if="(GbInfo.gb_enable==1)">
						<view class="u-btn u-btn-default">{{__('点击再开一团')}}</view>
					</navigator>
					<view class="m-btn-box" v-if="(GbInfo.gb_enable==2 && !ispaysuccess)">
						<view class="u-btn u-btn-default" @click="immediatelyOffered">{{__('参与活动')}}</view>
					</view>
				</block>
			</view>
			<view class='rule'>
				<view class='rule-header'>
					{{__('拼团规则')}}
				</view>
				<view class='rule-content'>
					{{GbInfo.activity_rule.activity_intro}}
				</view>
			</view>
			<view class="link">
				<navigator url="/pages/index/index" open-type="switchTab" class="nav">
					<image lazy-load class="nav-img" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/index.png"></image>
					<text>{{__('首页逛逛')}}</text>
				</navigator>
				<navigator url="/pages/category/category" open-type="switchTab" class="nav">
					<image lazy-load class="nav-img" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/allproduct.png"></image>
					<text>{{__('全部商品')}}</text>
				</navigator>
				<navigator url="/activity/coupon/list" class="nav">
					<image lazy-load class="nav-img" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/coupon.png"></image>
					<text>{{__('领券中心')}}</text>
				</navigator>
				<navigator url="/pages/index/member" open-type="switchTab" class="nav">
					<image lazy-load class="nav-img" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/center.png"></image>
					<text>{{__('个人中心')}}</text>
				</navigator>
			</view>
		</scroll-view>

		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->
		<share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
					  @saveImg="saveImg"  ref="shareBoxMp"></share-box-mp>
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
	</view>
</template>

<script>

	import $ from "../../helpers/util";


    import dayCountdown from "../../components/day-countdown.vue";
    import shareBoxMp from '../../components/share-box-mp.vue'
    import shareBoxApp from '../../components/share-box-app.vue'

    import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				options:{},
				Photo: "",
				UserName: "",
				splistStr: [],
				ispaysuccess: !1,
				IsOwner: !1,
				order_id: "",
				isfg: !1,
				GbInfo: {activity_rule:{}},
                GroupUsers: [],
				isPage: !0,
				page: 1,
				Coupons: [],
				isCancelSuccess: !0,
				isCancel: !0,
				CouponAmount: 0,
				user_is_new: 0,
				userInfoId: 0,
				show: !0,
				groupIsEnd: !1,


				PageQRCodeInfo: {
					Path: "",
					IsShare: !1,
					IsShareBox: !1,
					IsJT: !1
				},
                shareData: {
                    shareText: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
                    shareTitle: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
                    href: "",
                    image: ''
                },

                shareText: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
                shareTitle: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
                href: "",
                image: ''

            }
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        components: {
            dayCountdown,
            shareBoxMp,
            shareBoxApp
        },
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('拼团详情')
			});

			var that = this;

            that.setData({
                options: options
            })

			this.forceUserInfo(function(user) {
				that.setData({
					user_is_new: that.userInfo.user_is_new,
					CouponAmount: that.userInfo.CouponAmount
				});

				that.InitData(options);
			});

			this.notice.addNotification("RefreshFG", that.RefreshFG, that)
		},
        onBackPress() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
				return true;
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
				return true;
			}
			// #endif
        },
        onUnload() {
            // 离开页面，注销事件
            var that = this
            this.notice.removeNotification("RefreshFG", that);

			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
        },
		onShareAppMessage: function() {
			var e = this.GbInfo.gb_quantity - this.GbInfo.gb_amount_quantity,
				t = e > 0 ?  this.$.sprintf(this.__("【还差 %d 人】 %s 邀请您参加拼团！立省 %.2f 元！"), (this.GbInfo.gb_quantity - this.GbInfo.gb_amount_quantity), this.userInfo.user_nickname, (this.GbInfo.activity_rule.group_sale_price - this.GbInfo.activity_rule.item_unit_price).toFixed(2)) : this.$.sprintf(this.__("%s 拼团成功！他已节省 %.2f 元！赶快来拼团吧!"), this.userInfo.user_nickname, (this.GbInfo.activity_rule.group_sale_price - this.GbInfo.activity_rule.item_unit_price).toFixed(2));
			return {
				title: t,
				desc: this.GbInfo.item_name,
				path: "/activity/fightgroup/detail?gb_id=" + this.GbInfo.gb_id + "&pid=" + this.GbInfo.activity_rule.item_id +
					"&uid=" + this.userInfo.user_id
			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			InitData: function(options) {
				var that = this;
				that.setData({
					Photo: that.userInfo.user_avatar,
					UserName: that.userInfo.user_nickname,
					isfg: options.isfg || !1
				});

				var params = {
					gb_id: options.gb_id || "",
					order_id: options.on || ""
				};

				//todo 详情
				$.request({
					url: this.Config.URL.user.getUserGroupbooking,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							data.gbh_rows.forEach(function(e) {
								e.user_id == that.userInfo.user_id && (that.setData({
									userInfoId: e.user_id
								}));

								//判断是否团长
								if (e.user_id == that.userInfo.user_id) {
									e.user_id == that.userInfo.user_id && that.setData({
										ispaysuccess: e.gbh_flag,
										IsOwner: e.user_id == data.user_id,
										order_id: e.order_id
									})
								}
							});

							var $now = (new Date).getTime();
							var $end = (new Date(data.gb_endtime.replace(/-/g, "/"))).getTime();
							var $activityEnd = (new Date(data.activity_rule.activity_endtime.replace(/-/g, "/"))).getTime();
							data.endTime = $end - $now;
							if (data.endTime <= 0) {
								that.setData({
									groupIsEnd: !0,
									show: !1
								});
							}
							if ($activityEnd - $now <= 0) {
								that.setData({
									show: !1,
								});
							}
							that.setData({
								GbInfo: data,
								GroupUsers: data.gbh_rows,
							});

						}
					}
				});
			},

			RefreshFG: function() {
				var that = this,
					t = {
						gb_id: that.GbInfo.gb_id
					};
				that.InitData(t)
			},

			immediatelyOffered: function() {
				var that = this;
				/*
				        var param = {
				            Amount: 1,
				            ProductId: this.proId,
				            orderType: 1,
				            activity_id: this.MEID,
				            isOwner: "true",
				            isFightGroup: "2",
				            item_id: this.skuid,
				            AddTime: getNowFormatDate(),
				            ownGroupId: 0,
				            ProductSaleName: this.pname,

				            speStr: JSON.stringify(this.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
				        };*/
				$.navigateTo({
					url: "/pages/checkout/checkout?ifcart=0&cart_id=" + this.GbInfo.activity_rule.item_id + "|" + 1 + "&activity_id=" +
						this.GbInfo.activity_id + "&gb_id=" + this.GbInfo.gb_id
				})
			},

			doReceive: function() {
				this.cancel(), this.userReceiveCoupon()
			},
			cancel: function() {
				this.setData({
					isCancel: !1
				})
			},
			cancelsuccess: function() {
				this.setData({
					isCancelSuccess: !0
				})
			},
			innertouch: function() {},
			userReceiveCoupon: function() {
				var e = {

					CouponIds: "",

					user_is_new: this.user_is_new
				};
				//console.log(e);
				var t = this;
				$.xsr($.makeUrl(userapi.UserReceiveCoupon, e), function(e) {
					e.Code == 0 ? t.setData({
						isCancelSuccess: !1,
						Coupons: e.Info
					}) : $.alert(e.Msg)
				})
			},
			fightPage: function(e) {
				if (this.isPage) {
					this.setData({
						isPage: !1
					});
					var t = this;
					clearTimeout(n);
					var n = setTimeout(function() {
							var e = {
								gb_id: t.GbInfo.gb_id,
								EventId: t.GbInfo.MarketingEventId,
								page: parseInt(t.page) + 1
							};
							/*$.xsr($.makeUrl(fgapi.GetGroupMarketingEventUsersByPage, e), function (n) {
							    if (n.Info.length > 0)
							    {
							        var r = t.GbInfo;
							        r.gbh_rows = r.gbh_rows.concat(n.Info), t.setData({
							            isPage: !0,
							            page: e.page,
							            GbInfo: r
							        })
							    }
							    else
							    {
							        t.setData({isPage: !1})
							    }
							})*/
						},
						500)
				}
			},
			shareQRCode: function(e) {
				return ;
				var that = this,
					params = {

						Path: "/activity/fightgroup/detail?gb_id=" + this.GbInfo.gb_id + "&pid=" + this.GbInfo.activity_rule.item_id +
							"&uid=" + this.userInfo.user_id,
						MainImg: this.GbInfo.ProductPic,
						MainTitle: this.GbInfo.item_name,
						item_id: this.GbInfo.activity_rule.item_id,
						MarketingEventId: this.GbInfo.MarketingEventId,
						ItemSalePrice: this.GbInfo.activity_rule.group_sale_price,
						OriginalPrice: this.GbInfo.activity_rule.item_unit_price,
						GroupPersonAmout: this.GbInfo.gb_quantity,
						CutPrice: "",
						user_id: this.userInfoId,
						MarketingEventTime: this.GbInfo.EndTimeStr
					};


				//生成二维码并返回地址。 - 需要修改调整为小程序地址
				$.request({
					url: this.Config.URL.wx.getMiniAppQRCodeUnlimit,
					data: params,
					success: function(data, status, msg, code) {
						that.setData({
							PageQRCodeInfo: {
								Path: data.url,
								IsShare: !0,
								IsShareBox: !1,
								IsJT: !0
							}
						})
					}
				});
			},
			shareBox: function() {
				let that = this;

				let $href = $.sprintf('%s/h5/activity/fightgroup/detail?gb_id=%d&pid=%d&uid=%d', that.Config.SiteUrl, this.GbInfo.gb_id, this.GbInfo.activity_rule.item_id, this.userInfo.user_id);
                // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
                // #ifdef APP-PLUS
                $href = $.sprintf('%s/tmpl/activity/group_detail.html?gb_id=%d&pid=%d&FX=%d', this.Config.WapSiteUrl, this.GbInfo.gb_id, this.GbInfo.activity_rule.item_id, this.userInfo.user_id);
				$href = $.sprintf('%s/tmpl/activity/group_detail.html?gb_id=%d&pid=%d&FX=%d', this.Config.WapSiteUrl, this.GbInfo.gb_id, this.GbInfo.activity_rule.item_id, this.userInfo.user_id);

				$href = $.sprintf('%s/h5/activity/fightgroup/detail?gb_id=%d&pid=%d&uid=%d', that.Config.SiteUrl, this.GbInfo.gb_id, this.GbInfo.activity_rule.item_id, this.userInfo.user_id);
                // #endif

                // #ifdef MP-WEIXIN
                $href = "/activity/fightgroup/detail?gb_id=" + this.GbInfo.gb_id + "&pid=" + this.GbInfo.activity_rule.item_id + "&uid=" + this.userInfo.user_id;
                // #endif

                var e = this.GbInfo.gb_quantity - this.GbInfo.gb_amount_quantity,
                    t = e > 0 ? "【还差" + (this.GbInfo.gb_quantity - this.GbInfo.gb_amount_quantity) + "人】" + this.userInfo.user_nickname +
                        "邀请您参加拼团！立省" + (this.GbInfo.activity_rule.group_sale_price - this.GbInfo.activity_rule.item_unit_price).toFixed(2) +
                        "元！" : this.userInfo.user_nickname + "拼团成功！他已节省" + (this.GbInfo.activity_rule.group_sale_price - this.GbInfo.activity_rule
                        .item_unit_price).toFixed(2) + "元！赶快来拼团吧!";

                this.setData({
                    shareData: {
                        shareTitle: this.GbInfo.activity_rule.item_name,
                        shareText: t,
                        href: $href,
                        image: this.GbInfo.activity_rule.product_image,
						price: this.GbInfo.activity_rule.group_sale_price
					}
                });


				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif

				// #ifdef MP-WEIXIN
				this.$refs.shareBoxMp.show();
				// #endif


				// #ifdef H5
				if (that.$.ifUniApp())
				{
					this.$refs.shareBoxH5.show();
				}
				else
				{
					this.$refs.shareBoxMp.show();
				}
				// #endif

                return ;

				this.setData({
					PageQRCodeInfo: {
						Path: "",
						IsShare: !0,
						IsShareBox: !0,
						IsJT: !1
					}
				})
			},
			cancelShare: function() {
				this.setData({
					PageQRCodeInfo: {
						Path: "",
						IsShare: !1,
						IsShareBox: !1,
						IsJT: !1
					}
				})
			},
			saveImg: function() {
				var e = this;
				$.showLoading();
				$.downloadFile({
					url: this.PageQRCodeInfo.Path,
					success: function(t) {
						$.hideLoading(), $.saveImageToPhotosAlbum({
							filePath: t.tempFilePath,
							success: function() {
								e.setData({
									PageQRCodeInfo: {
										Path: "",
										IsShare: !1,
										IsShareBox: !1,
										IsJT: !1
									}
								}), $.alert("保存图片成功！")
							},
							fail: function(e) {
								$.hideLoading()
							}
						})
					},
					fail: function(e) {
						$.hideLoading()
					}
				})
			},
			showCodeImg: function() {
				$.previewImage({
					current: this.PageQRCodeInfo.Path,
					urls: [this.PageQRCodeInfo.Path]
				})
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.groupNumber {
		font-size: 24upx;
		color: #888;
	}

	.groupNumber .icon-icon {
		font-size: 24upx;
		display: inline
	}

	/* .groupNumber text{margin: 0 2upx} */
	.progressBarBox {
		position: absolute;
		right: 0;
		bottom: 0upx;
		margin-bottom: -20upx;
		color: #888;
		font-size: 24upx;
		margin-right: 20upx;
	}

	.u-progressBar {
		display: inline-block;
		width: 140upx;
		height: 20upx;
		background-color: #d5d5d5;
		border-radius: 20upx;
		overflow: hidden
	}

	.u-progressBar-cont {
		height: 20upx;
		background-color: #ffc001;
	}

	.u-progressBar-text {
		line-height: 25upx;
	}

	.m-product-price .u-btn {
		padding: 0 10upx;
		margin: 0 20upx;
		float: right;
		font-size: 24upx;
		line-height: 50upx;
		margin-top: 10upx;
	}

	.m-product-GP {
		height: 270upx;
	}

	.m-product-GP .m-product-img {
		height: 270upx;
		width: 270upx;
	}

	.m-product-GP .m-product-price {
		line-height: 28upx;
		font-size: 40upx
	}

	.m-product-GP .m-product-info {
		height: 270upx;
		width: 480upx;
		position: relative
	}

	.u-del-price {
		color: #888888;
		font-size: 20upx;
		text-decoration: line-through;
	}

	.icon-box {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		background-color: #fff;
		padding: 20upx;
		margin-top: 20upx;
		position: relative;
	}

	.icon-box image {
		width: 80upx;
		height: 80upx;
	}

	.icon-box image {
		margin-right: 32upx;
	}

	.icon-box-title {
		font-weight: 400;
		color: #DB384B;
	}

	.icon-box-desc {
		margin-top: 12upx;
		font-size: 24upx;
		color: #888;
	}

	.icon-box icon {
		margin-right: 10upx;
	}

	.m-media-box-bd text {
		margin-left: 10upx;
	}

	.m-media-box-info {
		color: #888;
	}

	.u-time-show {
		position: absolute;
		width: 280upx;
		height: 80upx;
		border: 1upx solid $default-skin-bg;
		left: 50%;
		bottom: 0;
		margin-left: -140upx;
		border-radius: 80upx;
		margin-bottom: -60upx;
		z-index: 2;
		background-color: #fff;
		box-shadow: 0px 0upx 10upx rgba(0, 0, 0, 0.35);
		line-height: 80upx;
		text-align: center;
	}

	.u-time-show label {
		font-size: 24upx;
	}

	.u-time-show text {
		color: $default-skin-bg !important;
	}

	/*底部按钮 start*/
	.m-footer-btn {
		height: 100upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: center;
		z-index: 3
	}

	.m-footer-btn-main {
		width: 50%;
		height: 100%;
		float: left;
		background-color: $default-skin-bg;
		color: #fff;
		line-height: 100upx;
		font-size: 32upx;
	}

	.m-footer-desable {
		-webkit-filter: grayscale(1);
		filter: grayscale(1);
	}

	.m-now {
		background-color: #ffc001;
	}

	/*底部按钮 end*/
	/*团长标签*/
	.u-fg-label {
		display: inline-block;
		font-size: 24upx;
		color: #888;
		padding-right: 20upx;
		color: $default-skin-bg
	}

	.u-fg-label label {
		color: yellow;
		font-size: 28upx;
	}

	.m-media-box-thumb {
		border-radius: 100%;
	}

	.icon-box image {
		border-radius: 100%;
	}

	/*团长标签*/
	/* .u-btn {
  padding:0 10upx;
  width:200upx;
  font-size:24upx;
  line-height:50upx;
  background-color:$default-skin-bg;
  color:#fff;
  position: absolute;
  right: 20upx;
  top:54upx;
  } */
	.m-product-list {
		background: #fff;
		overflow: hidden
	}

	.m-product-name {
		height: 116upx
	}

	.headPhoto {
		overflow: hidden;
		display: flex;
		width: 90%;
		margin: 20upx auto;
		justify-content: center
	}

	.personPhoto {
		position: relative;
		margin: 0.2%
	}

	.photo-icon {
		position: absolute;
		width: 52upx;
		height: 36upx;
		top: -6upx;
		left: -10upx
	}

	.photo {
		width: 68upx;
		height: 68upx;
		border-radius: 50%;
		border: 4upx solid sandybrown;
		margin-top: 8upx;
		margin-left: 2upx;
		margin-right: 2upx
	}

	.photo-bg {
		width: 76upx;
		height: 76upx;
		border-radius: 50%;
		margin-top: 8upx;

	}

	.m-product-info::before {
		border: none
	}

	.time text {
		color: #DB384c
	}

	.surplus {
		display: flex;
		justify-content: center;
		font-size: 30upx;
		margin: 20upx 0;
		align-items: center
	}

	.link {
		display: flex;
		justify-content: space-around;
		background: #fff;
		margin-top: 20upx
	}

	.nav {
		flex: 1;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		height: 200upx
	}

	.nav-img {
		width: 80upx;
		height: 80upx
	}

	.nav text {
		margin-top: 20upx;
		font-size: 24upx;
		color: #333
	}

	.isSucces {
		position: absolute;
		right: 30upx;
		bottom: 10upx;
	}

	.isSucces image {
		width: 150upx;
		height: 150upx
	}

	.rule {
		padding: 20upx;
		background: #fff;
		margin-top: 20upx
	}

	.rule-header {
		font-size: 32upx;
		color: #333;
		margin-bottom: 20upx
	}

	.rule-content {
		font-size: 24upx;
		color: #777777
	}
</style>
