<template>
	<view class="page">
		<view :class="(show?'cover':'')">

		</view>
		<view class="m-product-all">
			<view class="m-tab">
				 <scroll-view class="m-navbar scroll-view_H" scroll-x style="width: 100%">
					<view :class="['m-navbar-item ellipsis', tapindex==1?'m-navbar-item-on':'']" @click="allOrders">
						{{__('全部订单')}}
					</view>
					<view :class="['m-navbar-item ellipsis', tapindex==2?'m-navbar-item-on':'']" @click="toBePaid">
						{{__('待支付')}}
					</view>
					<view v-if="!card_kind_id" :class="['m-navbar-item ellipsis', tapindex==5?'m-navbar-item-on':'']" @click="toBeShipping">
						<label v-if="(kind_id==1201)">{{__('待发货')}}</label>
						<label v-else>{{__('待服务')}}</label>
					</view>
					<view :class="['m-navbar-item ellipsis', tapindex==3?'m-navbar-item-on':'']" @click="receiptOfGoods">
						<label v-if="(kind_id==1201)">{{__('待收货')}}</label>
						<label v-else>{{__('待确认')}}</label>
					</view>
					<view :class="['m-navbar-item ellipsis', tapindex==4?'m-navbar-item-on':'']" @click="toBeEvaluated">
						<label v-if="(kind_id==1201)">{{__('已完成')}}</label>
						<label v-else>{{__('已服务')}}</label>
					</view>
				 </scroll-view>
			</view>
			<view v-if="loadComplete">
				<scroll-view v-if="(orderlist.length>0)" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
					<view v-for="(items, i) in orderlist"  :key="i" class="m-panel m-panel-access">
						<view class="m-panel-hd">
							<text>{{__('订单编号：')}}{{items.order_id}}</text>
							<text style="font-size: 20rpx;padding-left: 6rpx;" v-if="false">{{(items.payment_type_id==StateCode.PAYMENT_TYPE_DELIVER   || items.payment_type_id==StateCode.PAYMENT_TYPE_OFFLINE) ? __('货到付款') : __('在线支付')}}</text>
							<label>{{items.order_state_name}}</label>
						</view>

						<view class="m-product-list">
							<navigator :url="'/member/order/detail?on=' + (items.order_id)" v-for="(item, ii) in items.item"
							 :key="ii" class="m-product-item">
								<view class="m-product-img">
									<image :src="(item.order_item_image)" mode="aspectFill" />
								</view>
								<view class="m-product-info">
									<view class="m-product-name">
										<!-- items.OrderType == 1 拼团 -->
										<label><text v-if="(item.activity_type_id==StateCode.ACTIVITY_TYPE_GROUPBOOKING)" class="u-tuan-label">{{__('拼团')}}</text>{{item.item_name}}</label>
										<label class="m-min-name" style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">{{item.activity_type_name==null?"":item.activity_type_name}}</label>

										<label class="m-min-name" style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1" v-if="false">
											{{item.spec_info?item.spec_info:""}}
										</label>
									</view>

									<view class="m-product-price">
										<block v-if="item.order_item_unit_price">
											<label>{{__('￥')}}</label>{{item.order_item_unit_price}}
										</block>

										<block v-if="item.item_unit_points">
											<label style="margin: auto 10upx;">+</label>{{item.item_unit_points}}{{__('积分')}}
										</block>

										<block v-if="item.item_unit_sp">
											<label style="margin: auto 10upx;">+</label>{{item.item_unit_sp}}{{__('众宝')}}
										</block>

										<text style="float: right;margin-right: 60upx;">x{{item.order_item_quantity}}</text>
									</view>
								</view>
							</navigator>
						</view>
						<!-- items.Type==2 ???? -->
						<view class="m-product-item" v-if="(items.Type==2)" style="height:154upx">
							<view class="m-product-img">
								<image :src="(items.store_logo)" mode="aspectFill" style="width:172upx;height:172upx" />
							</view>
							<view class="m-product-info2" style="padding:20upx 0">
								<view class="m-product-name">
									<label>{{items.store_name}}</label>
								</view>
							</view>
						</view>
						<view class="m-total-info">
							<view>
								{{__('总金额')}}：
								<block v-if="items.order_payment_amount">
									<text style="">{{__('￥')}}</text><label class="m-total-price">{{items.order_payment_amount}}</label>
								</block>
							</view>
							<view v-if="items.order_payment_amount !== items.trade_payment_amount && items.trade_payment_amount > 0">
								{{__('待付款')}}：
								<block v-if="items.order_payment_amount">
									<text style="">{{__('￥')}}</text><label class="m-total-price">{{items.trade_payment_amount}}</label>
								</block>
							</view>

							<block v-if="items.order_resource_ext1"></block>
							<label class="m-total-price" v-if="items.order_resource_ext1" style="margin: auto 10upx;"> + {{items.order_resource_ext1}}{{__('积分')}}</label>
							<label class="m-total-price" v-if="items.order_resource_ext2" style="margin: auto 10upx;"> + {{items.order_resource_ext2}}{{__('众宝')}}</label>
						</view>
						<view class="m-total-btn">
							<form report-submit="true">
								<button :data-on="(items.order_id)" :data-order_payment_amount="(items.trade_payment_amount)"  v-if="(items.order_is_paid != StateCode.ORDER_PAID_STATE_YES && items.order_state_id!=StateCode.ORDER_STATE_CANCEL)"
								 class="u-link-btn" @click="gotopay" formType="submit">{{__('去支付')}}</button>
							</form>

							<view :data-on="(items.order_id)" v-if="(items.order_lock_status)" class="u-link-btn">{{__('退款/退货中...')}}</view>


							<navigator :url="'/member/product/comment?od=' + (items.order_id)" v-if="(items.order_buyer_evaluation_status == 0 &&items.order_state_id == StateCode.ORDER_STATE_FINISH)"
							 class="u-link-btn">{{__('去评价')}}</navigator>
							<navigator :url="'/member/product/comment?od=' + (items.order_id)" v-if="(items.order_buyer_evaluation_status == 1)"
							 class="u-link-btn">{{__('查看评价')}}</navigator>
							<view :data-on="(items.order_id)" v-if="((items.kind_id==1202 || items.kind_id==1203) && items.order_state_id == StateCode.ORDER_STATE_SHIPPED)" class="u-link-btn"
							 @click="writeOrder">{{__('确认服务')}}</view>
							<view :data-on="(items.order_id)" v-if="(items.if_buyer_cancel)" class="u-link-btn" @click="cancelOrder">{{__('取消订单')}}</view>
							<view :data-on="(items.order_id)" v-if="(items.kind_id==1201 && items.order_state_id == StateCode.ORDER_STATE_SHIPPED)" class="u-link-btn"
							 @click="confirmReceipt">{{__('确认收货')}}</view>
							 <view :data-on="(items.order_id)" v-if="(items.kind_id==1201 && items.order_state_id == StateCode.ORDER_STATE_FINISH)" class="u-link-btn"
							  @click="placeAnOrder">{{__('再下一单')}}</view>
							<navigator :url="'/member/order/detail?on=' + (items.order_id)" class="u-link-btn">{{__('查看详情')}}</navigator>
							<!-- ????? -->
							<navigator v-if="(items.Type==2)" :url="'../favorableorderdetail/favorableorderdetail?on=' + (items.order_id)"
							 class="u-link-btn">{{__('查看详情')}}</navigator>
						</view>
					</view>
					<view class="m-loading-box">
						<block v-if="(ispage)">
							<view class="u-loadmore">
								<label class="u-loading"></label>
								<text class="u-loadmore-tips">{{__('正在加载')}}</text>
							</view>
							<view>
								<text></text>
							</view>
						</block>
						<block v-else>
							<view class="u-loadmore u-loadmore-line">
								<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
							</view>
						</block>
					</view>
				</scroll-view>

				<navigator url="/pages/product/list" redirect="true" class="m-nullpage" v-else>
					<view class="m-nullpage-middle" v-if="(!flag)">
						<view class="m-null-tip">
							<label style="font-size:32upx;">{{__('亲~您还没有订单哦，')}}</label><label class="highlight-link">{{__('快去看看吧')}}</label>
						</view>
					</view>
				</navigator>
			</view>
			<view class="alert" v-if="(show)">
				<image style="width:50upx;height:50upx" src="/static/images/true.png"></image>
				<text style="margin-left:20upx">{{Info}}</text>
			</view>
		</view>


		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox"  @onCancel="onCancel"  @onPaid="onPaid"  @onFail="onFail"></payment-box>
	</view>
</template>


<script>

    import paymentBox from '../../components/payment-box.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				isdata: false,
				tapindex: 1,
				page: 1,
				rows: 10,
				ispage: !0,
				flag: !0,
				type: 0,
				kind_id: 1201,
				card_kind_id: 1002,
				formId: "",
				orderlist: [],
				imgLogo: "",
				show: !1,
				Info: "",
                order_id: "",
                paymentData:{},
				loadComplete: false // 没有加载数据前不显示的对应内容
			}
		},
        components: {
            paymentBox
        },
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {


			this.setData({
				tapindex: options.sl ? options.sl : 1,
				page: 1,
				rows: 10,
				orderlist: [],
				type: options.type ? options.type : 0,
				kind_id: options.kind_id ? options.kind_id : 1201,
				card_kind_id: options.card_kind_id ? options.card_kind_id : 0
			});

			if (this.kind_id == 1201)
			{
				uni.setNavigationBarTitle({
					title:this.__('我的订单')
				});
			}
			else if (this.kind_id == 1202)
			{
				uni.setNavigationBarTitle({
					title:this.__('我的预约')
				});
			}else {
				uni.setNavigationBarTitle({
					title:this.__('优惠券订单')
				});
			}

			var t = this;
			this.notice.addNotification("RefreshMessage", t.RefreshMessage, t);
			this.getOrderlist()
		},
		onShow: function() {
			let that = this;
			// 刷新评论
			 uni.$on('refreshComment',function(data){
				 let orderlist = that.orderlist;
				 for (var i = 0; i < orderlist.length; i++) {
					if (orderlist[i].order_id == data) {
						orderlist[i].order_buyer_evaluation_status = 1
					}
				 }
			});
		},

        onUnload: function() {
            //移除通知
            // 离开页面，注销事件
            var that = this
            this.notice.removeNotification("RefreshMessage", that);


            if (this.$refs.paymentBox.showBoxView) {
                this.$refs.paymentBox.cancel();
            }
        },
        onBackPress() {
            if (this.$refs.paymentBox.showBoxView) {
                this.$refs.paymentBox.cancel();

                return true;
            }
        },
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.getOrderlist();
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			RefreshMessage: function(e) {
				this.setData({
					tapindex: 1,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			allOrders: function() {
				this.setData({
					tapindex: 1,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			toBePaid: function() {
				this.setData({
					tapindex: 2,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: this.StateCode.ORDER_STATE_WAIT_PAY,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			toBeShipping: function() {
				this.setData({
					tapindex: 5,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: this.StateCode.ORDER_STATE_WAIT_SHIPPING,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			receiptOfGoods: function() {
				this.setData({
					tapindex: 3,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					type: this.StateCode.ORDER_STATE_SHIPPED,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			toBeEvaluated: function() {
				this.setData({
					tapindex: 4,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					type: this.StateCode.ORDER_STATE_FINISH,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			scrollbottom: function() {
				if (this.flag) {
					var that = this;
					that.setData({
						flag: !1
					});

					clearTimeout(t);
					var t = setTimeout(function() {
							that.setData({
								state_type: that.type,
								flag: !1,
								page: parseInt(that.page) + 1,
								rows: 10
							});

							that.getOrderlist()
						}, 100)
				}
			},
			getOrderlist: function() {
				var that = this;
				var params = {
					page: that.page,
					rows: that.rows,
					state_type: that.type,
					kind_id: this.kind_id,
					card_kind_id: this.card_kind_id
				};
				that.$.request({
					url: this.Config.URL.user.order_lists,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status && data.items.length > 0) {
							if (data.page >= data.total) {
								that.setData({
									flag: !1,
									ispage: !1,
									orderlist: that.orderlist.concat(data.items)
								})
							} else {
								that.setData({
									flag: !0,
									ispage: !0,
									orderlist: that.orderlist.concat(data.items)
								})
							}

							that.setData({
								isdata: !0,
								loadComplete: !0
							})

						} else {
							that.setData({
								flag: !1,
								ispage: !1,
								isdata: !1,
								loadComplete: !0
							})
						}
					},
					fail: function(data) {
						that.setData({
							loadComplete: !0
						});
						that.$.alert("网络异常请重试！");
					}
				});
			},
			cancelOrder: function(e) {
				var that = this,
					params = {
						order_id: e.currentTarget.dataset.on
					};
				that.$.confirm(that.__("是否取消订单"), function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_cancel,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert("取消成功！", function() {
										that.setData({
											orderlist: [],
											page: 1
										});
										that.getOrderlist();
									});
								}
							}
						});
					}
				}, !0)
			},
			writeOrder: function(e) {
				var that = this,
					params = {
						order_id: e.currentTarget.dataset.on
					};
				that.$.confirm("是否核销订单？", function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_receive,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert(that.__("核销成功！"), function() {
										that.setData({
											orderlist: [],
											page: 1,
											Info: msg
										});
										setTimeout(function () {
											that.getOrderlist()
										}, 1000)
									});
								} else {
									(that.setData({
										orderlist: [],
										Info: msg,
										show: !0
									}), setTimeout(function() {
										that.setData({
											show: !1
										})
									}, 2e3)), that.getOrderlist()
								}
							}
						});
					}

				}, !0)
			},
			confirmReceipt: function(obj) {
				var params = {
						order_id: obj.currentTarget.dataset.on
					};

				var that = this;
				that.$.confirm(that.__("是否确认收货？"), function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_receive,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert(that.__("收货成功！"), function() {
										that.setData({
											orderlist: [],
											page: 1
										});
										setTimeout(function () {
											that.getOrderlist()
										}, 1000)
									});
								}
							}
						});
					}

				}, !0)
			},
			placeAnOrder: function(obj) {
				var params = {
						order_id: obj.currentTarget.dataset.on
					};
			
				var that = this;
				that.$.confirm(that.__("是否再次下单？"), function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.next_order,
							data: params,
							method: 'POST',
							success: function(data, status, msg, code) {
								if (200 == status) {
									that.$.switchTab({
										url: '/pages/cart/cart'
									});
								} else {
									that.$.alert(msg);
								}
							}
						});
					}
			
				}, !0)
			},
			gotopay: function(e) {
                var that = this;

                that.setData({
                     order_id: e.currentTarget.dataset.on,
                    'paymentData': {
                        order_id: e.currentTarget.dataset.on,
                        orderSelMoneyAmount: e.currentTarget.dataset.order_payment_amount,

                        user_money: this.userInfo.user_money,
                        user_points:this.userInfo.user_points,
                        user_recharge_card:this.userInfo.user_recharge_card,
                        user_sp:this.userInfo.user_sp
                    }
                });

                this.$refs.paymentBox.show();
                return true;
			},

            onCancel: function(e) {
                return
            },
            onPaid: function(e) {
                let that = this
                that.$.alert(that.__('支付成功'), function(){that.$.gotopage("/member/order/detail?on=" + e.order_id)}, 2000)

                if (this.$refs.paymentBox.showBoxView) {
                    this.$refs.paymentBox.cancel();
                }
            },
            onFail: function(e) {
            },

			sendMessage: function(order_id) {
				let that = this;
				var params = {
					api: orderapi.OrderPaySuccessWXMessage,
					pages: "/member/order/detail?on=" + order_id,
					formId: this.formId,
					WeiXinOpenId: this.userInfo.openId,
					value: {
						order_id: order_id
					}
				};
				that.$.sendTpl(params)
			}
		}
	};
</script>

<style lang="scss">
	@import "../../styles/_variables";

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
		height:
				6upx;
		border-bottom: 6upx solid $default-skin-bg;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}

	.m-panel-hd label {
		float: right;
		color: $default-skin-bg;
		font-size: 26upx;
	}

	.m-total-info {
		text-align: right;
		padding: 10upx;
		font-size: 24upx;
	}

	.m-total-info label {
		font-size: 32upx;
		color: $default-skin-bg;
	}
	.m-total-info text {
		font-size: 24upx;
		color: $default-skin-bg;
	}
	.m-total-btn {
		text-align: right;
		padding: 20upx 20upx 20upx 20upx;
		position: relative;
	}

	.m-total-btn::before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #ebebe7;
		color: #ebebe7;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform:
				scaleY(0.5);
		transform: scaleY(0.5);
	}

	.m-total-btn .u-link-btn {
		margin: 0 10upx;
		vertical-align: middle;
		display: inline-block;
		line-height: 40upx;
		background-color: #fff;

		font-size: 24rpx;
	}

	.m-sort {
		position: relative
	}

	.m-sort image {
		width: 24upx;
		height: 24upx;
		position: absolute;
		/*top: 50%;*/
		margin-top: 10upx;
		margin-left: 2upx;
	}

	.m-product-price text {
		font-size: 24upx;
		color: #999999;
		margin-left: 6upx
	}

	.m-tab {
		position: fixed;
		width: 100%;
		top: var(--window-top);
		z-index: 2;
	}
	.m-orderlist {
		padding-top: 70upx;
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}


	.u-tuan-label {
		padding: 5upx;
		background-color: $default-skin-bg;
		border-radius: 4upx;
		font-size: 24upx;
		color:#fff;
		margin-right: 5upx;
	}

	.alert {
		font-size: 32upx;
		width: 70%;
		height: 200upx;
		padding: 0 40upx;
		position: absolute;
		left: 10%;
		top: 40%;
		background: #fff;
		border-radius: 10upx;
		justify-content: center;
		display: flex;
		align-items: center;
		z-index: 999;
	}

	.cover {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0px;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		z-index: 998
	}

	.m-product-name{
		font-size: 24rpx;
	}

	.m-product-img {
		image {
			padding: 20upx;
		}
	}

	.m-product-item {
		margin-top: 0rpx;
	}

	.scroll-view_H{
		width: 100%;
		white-space: nowrap;

		height: 84rpx;

		.m-navbar-item{
			display: inline-block;
			padding-left: 20rpx;
			padding-right: 20rpx;

			min-width:110rpx;
		}
	}

</style>
