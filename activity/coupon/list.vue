<template>
	<view class="page">
		<view class="m-tab">
			<view class="m-navbar">
				<view :class="'m-navbar-item ' + (tapindex==0?'m-navbar-item-on':'')" @click="freeget">
					{{__('免费领取')}}
				</view>
				<view :class="'m-navbar-item ' + (tapindex==1?'m-navbar-item-on':'')" @click="buyget">
					{{__('购买获取')}}
				</view>
			</view>
		</view>
		<scroll-view class="m-scrollBox" scroll-y="true" @scrolltolower="scrollbottom">
			<block v-if="(VoucherList.length>0)">
				<view class="m-coupon-item" v-for="(item, index) in VoucherList" :key="index">
					<view class="m-coupon-info">
						<view class="m-coupon-text">
							<label v-if="item.activity_type != 3">
								{{item.activity_name}} 
							<span style="font-size: 12upx;margin-left:6upx;color:#FF9933" v-if="item.activity_on_is_off === 1">(线下)</span>
						    <span style="font-size: 18upx;margin-left:8upx;color:#FF9933">{{item.store_name}}</span>
							</label>
							<label v-else>
								{{item.product_name}} 
							<span style="font-size: 12upx;margin-left:6upx;color:#FF9933" v-if="item.activity_on_is_off === 1">(线下)</span>
							<span style="font-size: 18upx;margin-left:8upx;color:#FF9933">{{item.store_name}}</span>
							</label>
							<text v-if="item.activity_type != 3">{{sprintf(__('满￥%s可用，消耗 %s 积分领取。%s'), item.activity_rule.requirement.buy.subtotal, item.activity_rule.requirement.points.needed, item.activity_remark)}}</text>
							<text v-else>{{sprintf(__('满￥%s可抵扣￥%s'), item.activity_rule.requirement.buy.subtotal,item.activity_rule.voucher_price)}}</text>
							<text>{{sprintf(__('有效日期至：%s'), item.activity_endtime)}}</text>
						</view>
						<view class="m-coupon-price">
							<view class="price-content-box " v-if="item.activity_type != 3">
								<label>{{__('￥')}}</label>{{item.activity_rule.voucher_price}}</view>
							<view class="price-content-box " v-else>
								<label>{{__('￥')}}</label>{{item.product_unit_price}}</view>
						</view>
					</view>
					<view class="m-coupon-btn" @click="doReceive" :data-isreceive="(item.if_gain ? '1' : '-1')" :data-id="(item.activity_id)"
					 :data-point="(item.activity_rule.requirement.points.needed)" :data-store_id="(item.store_id)">
					 <block v-if="(item.if_gain && item.activity_type != 4 && item.activity_type != 3)">
						 <label :class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{ __('立即领取')}}</label>
					 </block>
					 <block v-else-if="(!item.if_gain)">
					 	<label :class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']" >{{__('已经领取')}}</label>
						<label :class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{__('去消费')}}</label>
					 </block>
						<!-- <label :class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{item.if_gain ? __('立即领取'):__('已经领取 去消费') }}</label> -->
					</view>
					<view class="m-coupon-btn" @click="doShare" :data-isreceive="(item.if_gain ? '1' : '-1')"
					 :data-voucher_price="(item.activity_rule.voucher_price)" :data-id="(item.activity_id)"
					 :data-point="(item.activity_rule.requirement.points.needed)" :data-activity-name="(item.activity_name)" :data-store_id="(item.store_id)">
						<block v-if="(item.if_gain && item.activity_type === 4)">
							 <label :class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{ __('立即分享')}}</label>
						</block>
					</view>
					<view class="m-coupon-btn" @click="doBuy(item.item_id)" :data-isreceive="(item.if_gain ? '1' : '-1')" :data-id="(item.activity_id)"
					  :data-activity-name="(item.activity_name)" :data-store_id="(item.store_id)">
						<block v-if="(item.if_gain && item.activity_type === 3)">
							 <label :class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{ __('去购买')}}</label>
						</block>
					</view>
				</view>

			</block>
			<view class="m-nullcontent" v-else>
				<view class="m-nullpage-middle">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
						<text>{{__('没有可领的优惠券~')}}</text>
					</view>
				</view>
			</view>
			<view class="m-loading-box">
				<block v-if="(ispage)">
					<view class="u-loadmore">
						<label class="u-loading"></label>
						<text class="u-loadmore-tips">{{__('正在加载')}}</text>
					</view>
				</block>
				<block v-else>
					<view class="u-loadmore u-loadmore-line">
						<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
					</view>
				</block>
			</view>
		</scroll-view>
		<view class="msk1" v-if="(!flags)" @click="outertouch">
			<view class="m-coupon-box" @click.stop="innertouch">
				<view class="m-coupon-box-top">

				</view>
				<view class="m-coupon-box-content">

					<view class="m-coupon-box-title">
						{{__('优惠券领取成功')}}
						<view class="m-coupon-box-tip">{{__('点击右上角分享给好友')}}</view>
					</view>
					<scroll-view scroll-y="true" class="m-coupon-box-list">
						<view class="m-coupon-box-item" v-for="(item, index) in Coupons" :key="index">
							<label>{{item.activity_rule.voucher_price}}</label>
							<text>{{item.activity_name}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="m-coupon-box-bottom">

				</view>
				<view class="closeRPK" @click.stop="outertouch">
					<image lazy-load style="width:50upx;height:50upx" src="/static/images/delete.png"></image>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #endif -->
		
		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->
		
		<!-- #ifndef APP-PLUS -->
		<share-box-mp :shareDataDefault="shareData" @showCodeImg="showCodeImg" @saveImg="saveImg"  ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->
		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox" @onCancel="onCancel" @onPaid="onPaid" @onFail="onFail"></payment-box>
	</view>
</template>

<script>
	import $ from "../../helpers/util";
	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'
	import shareBoxH5 from '../../components/share-box-h5.vue'
	import paymentBox from '../../components/payment-box.vue'
	
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				shareData: {
					shareText: 'JDMall 支持原生App、微信小程序，邀请你一起体验！',
					shareTitle: 'JDMall 支持原生App、微信小程序，邀请你一起体验！',
					href: "",
					image: '',
					price: '',
				},
				tapindex: 0,
				page: 1,
				rows: 10,
				options: {},
				ispage: !1,
				VoucherList: [],
				Coupons: [],
				flag: !0,
				flags: !0,
				Id: 0,
				Code: "",
				index: 0,
				needed_point: 0,
				store_id: 0,
				order_id: "",
				paymentData: {},
				date: "",
				stdate: "",
				eddate: "",
				time: "",
				st: "",
				et: "",
				activity_type: 0
			};
		},

		components: {
			shareBoxMp,shareBoxApp,shareBoxH5,paymentBox
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onBackPress: function() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
				return true;
			}
			// #endif
		
		
			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
				return true;
			}
			// #endif
		
			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
				return true;
			}
			// #endif
			if (this.$refs.paymentBox.showBoxView) {
				this.$refs.paymentBox.cancel();
			
				return true;
			}
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function () {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
			}
			// #endif
			
			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
			}
			// #endif
			
			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
		    // 离开页面，注销事件
		    var that = this
		    this.notice.removeNotification("RefreshProduct", that);
			this.notice.removeNotification("GotoPayCheckout", that);
			if (this.$refs.paymentBox.showBoxView) {
				this.$refs.paymentBox.cancel();
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('领取优惠券')
			});
			var that = this;
			
			var n = new Date,
				s = new Date((new Date).getTime() + 2 * 24 * 60 * 60 * 1000),
				r = new Date;
			var stdate = n.getFullYear() + "-" + (n.getMonth()+1) + "-" + n.getDate(),
				sdate = s.getFullYear() + "-" + (s.getMonth()+1) + "-" + (s.getDate()),
				eddate = (r.getFullYear() + 1) + "-" + (r.getMonth() + 1) + "-" + r.getDate();
			
			this.setData({
				options:options,
				VoucherList: [],
				stdate: stdate,
				date: sdate,
				eddate: eddate
			})
			
			var time = n.getHours() + ':' + n.getMinutes();
			
			this.setData({
				time: time,
				st: time,
				et: time
			})
			
			
			$.isNull(this.userInfo) ? this.getUserInfo(function() {
					that.getCouponlist()
				},
				options.uid) : that.getCouponlist()
		},
		onReachBottom: function () {
			this.scrollbottom()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),

			doReceive: function(e) {
			
				var that = this;
				if (e.currentTarget.dataset.isreceive == -1) {
					that.$.navigateTo({
					    url: "/pagesub/index/store?store_id=" + e.currentTarget.dataset.store_id
					})
					return;
				}
				that.setData({
					Id: e.currentTarget.dataset.id,
					needed_point: e.currentTarget.dataset.point,
					store_id: e.currentTarget.dataset.store_id,
				});

				that.getUserReceiveCoupon();
			},
			doShare: function(e) {
				const user_id = this.userInfo.user_id;
				let that = this;
				var $href = that.$.sprintf('%s/h5/pages/index/index?uid=%d&activity_id=%d', this.Config.WapSiteUrl, user_id, e.currentTarget.dataset.id);
				
				$href = that.$.sprintf('%s/h5/pages/index/index?uid=%d&activity_id=%d', that.Config.SiteUrl, user_id, e.currentTarget.dataset.id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				
				// #endif
				
				// #ifdef MP-WEIXIN
				$href = that.$.sprintf("%s/pages/index/index?uid=%d&activity_id=%d", that.Config.SiteUrl, user_id, e.currentTarget.dataset.id);
				// $href = that.$.sprintf("%s/community/community/detail?id=%d", this.Config.SiteUrl, this.story_id);
				// #endif
				
				this.setData({
					shareData: {
						shareTitle: e.currentTarget.dataset.activityName,
						shareText: e.currentTarget.dataset.activityName,
						href: $href,
						image: '',
						price: e.currentTarget.dataset.voucher_price,
					}
				});
				
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				that.$.request({
					url: this.Config.URL.fx.poster,
					data: {
						poster_type: 1,
						path: $href,
						Path: $href,
						MainTitle: e.currentTarget.dataset.activityName,
						MainImg: '',
						MainPrice: e.currentTarget.dataset.voucher_price
					},
					method:"POST",
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								shareData: {
									shareTitle: '优惠券',
									shareText: '优惠券',
									href: $href,
									image: data.poster_url,
									price: e.currentTarget.dataset.voucherPrice,
								}
							});
						}
					}
				});
				this.$refs.shareBoxApp.show();
				// #endif
			
				//海报
				if (e == 3)
				{
					// #ifndef APP-PLUS
					this.$refs.shareBoxMp.show();
					// #endif
				}
				else
				{
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
					
					// #ifdef MP-WEIXIN
						this.$refs.shareBoxMp.show();
					// #endif
				}
			
			},
			outertouch: function() {
				this.setData({
					flag: !0
				})
			},
			innertouch: function() {
				this.setData({
					flag: !1
				})
			},
			freeget: function() {
				this.setData({
					tapindex: 0,
					VoucherList: [],
					activity_type: 0,
					page: 1
				}), this.getCouponlist()
			},
			buyget: function() {
				this.setData({
					tapindex: 1,
					activity_type: 3,
					VoucherList: [],
					page: 1
				}), 
				this.getCouponlist()
			},
			doBuy: function(item_id) {
				// this.$.gotopage('/pages/product/detail?pid=' + item_id)
				let that = this;
				if (that.$.isNull(that.order_id)) {
					var params = {};
					params.ifcart = 0; // 传入cart_id时直接购买，未传时走购物车
					params.cart_id = item_id+"|1";
					params.payment_type_id = that.StateCode.PAYMENT_TYPE_ONLINE;
					params.delivery_type_id = 5;
					params.delivery_time_id = 1;
					params.invoice_type_id = 1;
					params.order_invoice_title = "";
					params.virtual_service_date = that.date;
					params.virtual_service_time = that.date + ' ' + that.time;
					params.distributor_id = uni.getStorageSync('store_id');
					let source_item_id = uni.getStorageSync('source_item_id');
					params.source_item_id = source_item_id;
					params.is_voucher = 1;
					params.is_delivery = 0; //是否自提
					that.$.request({
						url: that.Config.URL.user.order_add,
						data: params,
						method:"POST",
						success: function(data, status, msg, code) {
							if (200 == status) {
								//删除旧数据
								if (source_item_id)
								{
									let source_item_id_row = JSON.parse(source_item_id);
									for (let store_idx = 0; store_idx < data.items.length; store_idx++)
									{
										for (let item_idx = 0; item_idx < data.items[store_idx].items.length; item_idx++)
										{
											let order_item_id = data.items[store_idx].items[item_idx].item_id;
				
											//完成后删除数据吧
											if (source_item_id)
											{
												for(var tk in source_item_id_row)
												{
													if (source_item_id_row[tk].u)
													{
														if (tk == order_item_id)
														{
															delete source_item_id_row[tk];
														}
														else
														{
															let time = parseInt(Date.parse(new Date())/100)
															//判断是否超时
															if (time-source_item_id_row[tk].t > 86400 * 30)
															{
																delete source_item_id_row[tk];
															}
														}
													}
													else
													{
														delete source_item_id_row[tk];
													}
												}
				
				
											}
										}
									}
				
									uni.setStorageSync('source_item_id', JSON.stringify(source_item_id_row));
								}
				
								that.setData({
									order_id: data.order_id.join(','),
								});
								
								if (data.gb_id)
								{
									that.isFightGroup = data.gb_id;
								}
				
								that.setData({
									'paymentData': {
										order_id: that.order_id,
										orderSelMoneyAmount: data.orderSelMoneyAmount.toFixed(2),
										user_money: data.user_money,
										user_points: data.user_points,
										user_recharge_card:that.userInfo.user_recharge_card,
										user_sp:that.userInfo.user_sp
									}
								});
				
				
								that.reloadUserResource(function (user_info) {
				
								});
								that.gotopay();
								// 判断如果是虚拟商品
							} else {
				                if (data && data.hasOwnProperty('mobile_is_bind') || code==77011) {
				                    that.$.confirm(msg,
										function(data) {
											if (data.confirm) {
												//绑定手机操作
												that.$.gopage("/member/member/bindphone");
											}
										},
									true);
				                }
				                else
				                {
				                    that.$.confirm(msg);
				                }
				
							}
						},
						fail: function(data, status, msg, code) {
							that.$.showToast({
								title: msg
							})
						}
					});
				} else {
					that.gotopay()
				}
			},
			gotopay: function(e) {
                setTimeout(() => {
                    this.$refs.paymentBox.show();
                }, 400)

				return true;

				var param = {
					order_id: this.order_id,
					openid: this.userInfo.openId,
					typ: 'json',
					payment_channel_code: 'wx_native',
					prepay_flag: 1
				};

				var that = this;
				this.isSubmit = !0;

				that.$.request({
					url: this.Config.URL.pay.pay,
					data: param,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$.requestPayment({
								timeStamp: data.timeStamp,
								nonceStr: data.nonceStr,
								"package": data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(n) {
									that.isTmplMsg && that.sendMessage(param.order_id, 2);
									that.returnUrl(param.order_id)
								},
								fail: function(n) {
									that.$.gotopage("/member/order/detail?on=" + param.order_id);
									that.isTmplMsg && that.sendMessage(param.order_id, 1)
								},
								complete: function(n) {
									if (n.errMsg == "requestPayment:cancel")
									{
										that.$.gotopage("/member/order/detail?on=" + param.order_id);

										that.isTmplMsg && that.sendMessage(param.order_id, 1);
									}
								}
							})
						} else {
							that.$.alert(msg)
						}
					},

					fail: function(err) {}
				});
			},
			onCancel: function(e) {
			},
			onPaid: function(e) {
				//重新加载用户资源数据
				let that = this;
				that.reloadUserResource(function (user_info) {
					that.returnUrl(that.order_id);
				});
			},
			onFail: function(e) {
				let that = this;
				that.$.gotopage("/member/order/detail?on=" + this.order_id)
			},
			returnUrl: function(e) {
				var that = this;
			
				if (that.isFightGroup)
				{
					that.$.gotopage("/activity/fightgroup/detail?gb_id=" + that.isFightGroup + "&on=" + e);
				}
				else
				{
					that.$.gotopage("/member/order/detail?on=" + e);
				}
			
				return
			
				if (!that.$.isNull(that.spinfo)) {
					var n = JSON.parse(that.spinfo);
					if (n.isFightGroup == 2) {
						if (n.isOwner) {
							that.$.gotopage("/activity/fightgroup/detail?on=" + e);
							return
						}
						that.$.navigateBack(1, function() {
							this.notice.postNotificationName("RefreshFG")
						});
						return
					}
					that.$.gotopage("/member/order/detail?on=" + e);
					return
				}
				that.$.gotopage("/member/order/detail?on=" + e);
				return
			},
			getCouponlist: function() {
				var params = {
					page: this.page,
					rows: this.rows,
					activity_type: this.activity_type,
					store_id:this.options.store_id
				},
					that = this;
				$.request({
					url: this.Config.URL.point.voucher,
					data: params,
					// ajaxCache: {
					// 	timeout: this.Config.CACHE_EXPIRE
					// },
					success: function(data, status, msg, code) {
						if (200 == status) {
							if (data.items.length > 0) {
								for (let i = 0; data.items.length > i; i++) {
									data.items[i].activity_endtime = new Date(data.items[i].activity_endtime).toLocaleString().replace(/:\d{1,2}$/,' ');
									// this.$.dateFormatter(data.items[i].activity_endtime);
								}
								if (data.page >= data.total) {
									that.setData({
										VoucherList: that.VoucherList.concat(data.items),
										flag: !1,
										ispage: !1
									})
								} else {
									that.setData({
										VoucherList: that.VoucherList.concat(data.items),
										flag: !0,
										ispage: !0
									})
								}
							}else {
								that.setData({
									flag: !1,
									ispage: !1
								})
							}
						} 
					},
					fail: function(data) {
						that.setData({
							flag: !1,
							ispage: !1
						})
					}
				});
			},
			getUserReceiveCoupon: function() {
				var point = this.needed_point,
					that = this;
				if (point > 0) {
					$.confirm(that.sprintf(that.__('确定消耗 %d 兑换优惠券?'), point), function(e) {
						if (e.confirm) {
							that.addVoucher();
						}
					}, !0);
				} else {
					that.addVoucher();
				}
			},
			addVoucher: function() {
				var that = this;
				var params = {
					activity_id: this.Id,
					Code: this.Code,
					user_is_new: 0
				};
				$.request({
					url: this.Config.URL.user.voucher_add,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							that.$.confirm(that.__("领取成功!去消费"), function(a) {
								if (a.confirm)
								{
									that.$.navigateTo({
									    url: "/pagesub/index/store?store_id=" + that.store_id
									})
								}
								
							});
						
							
							
							// that.getCouponlist()
						} else {
							// $.alert(msg);
							that.$.confirm(that.__(msg));
							// that.$.confirm(that.__("已经领取!去消费"),function(a) {
							// 	if (a.confirm)
							// 	{
							// 		that.$.navigateTo({
							// 		    url: "/pagesub/index/store?store_id=" + that.store_id
							// 		})
							// 	}
								
							// });
						}
					},
				});
			},
			onShareAppMessage: function() {
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				});
				// #endif

				return {
					title: this.shopInfo.store_name,
					desc: this.shopInfo.VendorInfo,
					path: "/activity/coupon/list?uid=" + this.userInfo.user_id
				}
			},

			/**
			 * 用户点击右上角分享朋友圈
			 */
			onShareTimeline: function () {
				return {
					title: this.shopInfo.store_name,
					query: {
						uid: this.userInfo.user_id
					}
				}
			},
			receivenowWeixin: function(e) {
				// //console.log("领取卡券：", e.currentTarget.dataset.cardid);
				var that = this,
					params = {
						activity_id: e.currentTarget.dataset.cardid,
						openid: this.userInfo.openId
					};
				// 微信卡券
				/*$.xsr($.makeUrl(userapi.receiveWeixinCoupons, n), function (n) {
                    //console.log("领取成功1", n), $.addCard({
                        cardList: [{
                            cardId: n.Info.cardId,
                            cardExt: '{"openId": "' + this.userInfo.openId + '", "timestamp": "' + n.Info.timestamp + '", "signature":"' + n.Info.signature + '","nonce_str":"' + n.Info.nonce_str + '",}'
                        }], success: function (r) {
                            //console.log("领取成功", r);
                            var i = {code: r.cardList[0].code, access_token: n.Info.access_token};
                            $.xsr($.makeUrl(userapi.codeDecode, i), function (n) {
                                //console.log("解码成功：", $.parseJSON(n.Info));
                                var r = $.parseJSON(n.Info);
                                that.setData({Code: r.code, Id: e.currentTarget.dataset.id}), that.getUserReceiveCoupon()
                            })
                        },
                        fail: function (e) {
                            //console.log("领取失败", e)
                        },
                        complete: function (e) {
                            //console.log("领取成功或者失败", e)
                        }
                    })
                })*/
			},
			scrollbottom: function() {
				if (this.flag) {
					var e = this;
					e.setData({
						flag: !1
					}), clearTimeout(t);
					var t = setTimeout(function() {
							e.setData({
								page: parseInt(e.page) + 1
							}), e.getCouponlist()
						},
						500)
				}
			}
		}
	}
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.m-tab {
		position: fixed;
		width: 100%;
		top: var(--window-top);
		z-index: 2;
	}
	
	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
	}
	
	.m-navbar-item:after {
		border: none;
	}
	
	.m-navbar-item.m-navbar-item-on {
		background-color: #fff;
		color: $default-skin-bg;
	}
	
	.m-navbar-item.m-navbar-item-on::before {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 6upx;
		border-bottom: 6upx solid $default-skin-bg;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}
	
	.m-scrollBox {
		padding: 96rpx 10rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		width: 100%;
		margin-bottom: 58rpx;
	}

	.m-coupon-list {
		margin-top: 36upx
	}

	.m-coupon-item {
		width: 700upx;
		height: 192upx;
		margin: 10upx auto;
		background: url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/Coupon_V2.png) no-repeat;
		background-size: contain;
		box-sizing: border-box;
		padding: 12upx;
	}

	.m-coupon-info {
		float: left;
		width: 485upx;
		margin-left: 30upx;
		margin-top: 9.5upx;
	}

	.m-coupon-btn {
		float: left;
		width: 110upx;
		margin-left: 30upx;
		line-height: 35upx;
		text-align: center;
		font-size: 24upx;
		color: #fff;
	}

	.btn-coupon {
		display: inline-block;
		width: 28upx;
	}

	.btn-coupon-gray {
		color: #888;
	}

	.m-coupon-text {
		float: left;
		width: 300upx;
	}

	.m-coupon-text label {
		display: inline-block;
		color: #333;
		font-size: 28upx;
		width: 350upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 32rpx;
	}

	.m-coupon-text text {
		display: inline-block;
		width: 350upx;
		font-size: 24upx;
		color: #888;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 32rpx;
	}

	.m-coupon-price {
		float: left;
		height: 132upx;
		color: $default-skin-bg;
		font-weight: bold;
		line-height: 132upx;
		width: 180upx;
		position: relative;
		font-size: 64upx;
	}

	.price-content-box {
		position: absolute;
		left: -35upx;
		text-align: center;
		width: 220upx;
	}

	.price-content-box label {
		font-size: 32upx;
	}

	.closeRPK {
		width: 50upx;
		height: 50upx;
		position: absolute;
		left: 50%;
		margin-left: -30upx;
		bottom: -80upx;

	}
</style>
