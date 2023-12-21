<template>
	<view class="page">
		<view class="m-product-all">
			<view class="m-tab">
				<view class="m-navbar">
					<view :class="'m-navbar-item ' + (tapindex==1?'m-navbar-item-on':'')" @click="allOrders">
						{{__('全部拼团')}}
					</view>
					<view :class="'m-navbar-item ' + (tapindex==2?'m-navbar-item-on':'')" @click="toBePaid">
						{{__('进行中')}}
					</view>
					<view :class="'m-navbar-item ' + (tapindex==3?'m-navbar-item-on':'')" @click="receiptOfGoods">
						{{__('拼团成功')}}
					</view>
					<view :class="'m-navbar-item ' + (tapindex==4?'m-navbar-item-on':'')" @click="toBeEvaluated">
						{{__('拼团失败')}}
					</view>
				</view>
			</view>
			<view v-if="loadComplete">
				<block v-if="(orderlist.length>0)">
					<scroll-view v-if="(orderlist.length>0)" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
						<view v-for="(items, index) in orderlist"  :key="index" class="m-panel m-panel-access">
							<view class="m-panel-hd">{{__('订单编号：')}}{{items.order_id}}
								<label v-if="(items.gb_enable == 0)">{{__('拼团失败')}}</label>
								<label v-if="(items.gb_enable == 1)">{{__('拼团成功')}}</label>
								<label v-if="(items.gb_enable == 2)">{{__('拼团中')}}</label>
							</view>
							<view class="m-product-list">
								<navigator :url="'/pages/product/detail?pid=' + (items.activity_rule.item_id)" class="m-product-item">
									<view class="m-product-img">
										<image lazy-load :src="(items.activity_rule.product_image)" mode="aspectFill" />
									</view>
									<view class="m-product-info">
										<view class="m-product-name">
											<label><text class='u-tuan-label' v-if="(items.Type=='FIGHTGROUP')">拼</text><text class='u-tuan-label' v-if="(items.Type=='LUCKYFIGHTGROUP')">{{__('抽')}}</text>{{items.activity_rule.item_name}}</label>
										</view>
										<view class="m-product-price">
											<label>{{__('￥')}}</label>{{items.activity_rule.group_sale_price}}
											<text style="text-decoration: line-through;">{{__('￥')}}{{items.activity_rule.item_unit_price}}</text>
										</view>
									</view>
								</navigator>
							</view>
							<view class="m-total-info">
								{{__('实付款：')}}
								<label class="m-total-price">{{__('￥')}}{{items.activity_rule.group_sale_price}}</label>
							</view>
							<view class="m-total-btn">
								<view :data-on="(items.order_id)"   :data-gb_id="(items.gb_id)"   :data-order_payment_amount="(items.activity_rule.group_sale_price)"  v-if="(2==items.gb_enable&&!items.gbh_flag)" class="u-link-btn" @click="gotopay">{{__('去支付')}}</view>
								<navigator v-if="(items.gb_amount_quantity>0 && 0==items.gb_enable)" :url="'/activity/fightgroup/detail?gb_id=' + (items.gb_id) + '&pid=' + (items.activity_rule.item_id) + '&on=' + (items.order_id) + '&isfg=true&type=' + (items.Type)" class="u-link-btn">{{__('拼团详情')}}</navigator>
								<navigator v-if="(items.gb_amount_quantity>0 && 1==items.gb_enable)" :url="'/activity/fightgroup/detail?gb_id=' + (items.gb_id) + '&pid=' + (items.activity_rule.item_id) + '&on=' + (items.order_id) + '&isfg=true&type=' + (items.Type)" class="u-link-btn">{{__('拼团详情')}}</navigator>
								<navigator v-if="(items.gb_amount_quantity>0 && 2==items.gb_enable)" :url="'/activity/fightgroup/detail?gb_id=' + (items.gb_id) + '&pid=' + (items.activity_rule.item_id) + '&on=' + (items.order_id) + '&isfg=true&type=' + (items.Type)" class="u-link-btn">{{__('邀请好友参团')}}</navigator>
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
				</block>
				<navigator url="/activity/fightgroup/list" redirect="true" class="m-nullpage" v-else>
					<view class="m-nullpage-middle">
						<view class="m-null-tip">
							<label style="font-size:32upx;">{{__('亲~您还没有参与拼团哦，')}}</label><label style="border-bottom:1px solid #db384c;color: #db384c;font-size:32upx;">{{__('快去看看吧')}}</label>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox"  @onCancel="onCancel"  @onPaid="onPaid"  @onFail="onFail"></payment-box>
	</view>
</template>

<script>

	import $ from "../../helpers/util";


    import paymentBox from '../../components/payment-box.vue'

    import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
                tapindex: 1, page: 1, rows: 10, ispage: !0, flag: !0, gb_enable: -1, orderlist: [],

                order_id: "",
				gb_id: "",
                paymentData:{},
				loadComplete : false
			}
		},
        components: {
            paymentBox
        },
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),

		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('拼团订单')
			});

			this.setData({page: 1, rows: 10, orderlist: []});
            this.getOrderlist()
		},
        onUnload: function() {

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
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),


            allOrders: function () {
                this.setData({tapindex: 1, page: 1, rows: 10, orderlist: [], gb_enable: -1, loadComplete: false}), this.getOrderlist()
            },
            toBePaid: function () {
                this.setData({tapindex: 2, page: 1, rows: 10, orderlist: [], gb_enable: 2, loadComplete: false}), this.getOrderlist()
            },
            receiptOfGoods: function () {
                this.setData({tapindex: 3, page: 1, rows: 10, orderlist: [], gb_enable: 1, loadComplete: false}), this.getOrderlist()
            },
            toBeEvaluated: function () {
                this.setData({tapindex: 4, page: 1, rows: 10, orderlist: [], gb_enable: 0, loadComplete: false}), this.getOrderlist()
            },
            scrollbottom: function () {
                if (this.flag) {
                    var e = this
                    e.setData({flag: !1}), clearTimeout(t)
                    var t = setTimeout(function () {
                            e.setData({
                                type: e.type,
                                page: parseInt(e.page) + 1,
                                rows: 10
                            }), e.getOrderlist()
                        },
                        500)
                }
            },
            getOrderlist: function () {
                var params = {
                        UserInfoId: this.userInfo.user_id,
                        rows: this.rows,
                        page: this.page,
                        gb_enable: this.gb_enable
                    },
                    that = this

                $.request({
                    url: this.Config.URL.user.listsUserGroupbooking,
                    data: params,
                    success: function (data, status, msg, code) {

                        if (status == 200)
                        {
							data.page >= data.total ? (that.setData({
                                flag: !1,
                                ispage: !1
                            }), that.setData({orderlist: that.orderlist.concat(data.items)})) : that.setData({orderlist: that.orderlist.concat(data.items),
								flag: !0,
								ispage: !0})
                        }
                        else
                        {
                            that.setData({
                                flag: !1,
                                ispage: !1
                            })
                        }
						that.setData({
						    loadComplete : true
						})
                    },
					fail: function(data) {
						that.setData({
							loadComplete: !0
						});
						that.$.alert("网络异常请重试！");
					}
                })
            },
            gotopay: function (e) {
                var that = this;

                that.setData({
                    order_id: e.currentTarget.dataset.on,
					gb_id: e.currentTarget.dataset.gb_id,
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

                var param = {
                        order_id: e.currentTarget.dataset.on,
                        openid: this.userInfo.openId,
                        store_id: this.shopInfo.store_id,
                        typ: 'json',
                        payment_channel_code: 'wx_native',
                        prepay_flag: 1
                    },
                    that = this

                $.request({
                    url: this.Config.URL.pay.pay,
                    data: param,
                    success: function (data, status, msg, code) {
                        if (status == 200) {
                            $.requestPayment({
                                timeStamp: data.timeStamp,
                                nonceStr: data.nonceStr,
                                'package': data.package,
                                signType: data.signType,
                                paySign: data.paySign,
                                success: function (e) {
                                    $.alert('支付成功！', function () {
                                        that.setData({orderlist: [], currentPage: 1}), that.getOrderlist()
                                    })
                                },
                                fail: function (e) {
                                    //console.log('支付失败：', e)
                                }
                            })
                        }
                        else {
                            $.alert(msg)
                        }

                    },

                    fail: function (err) {
                    }
                })

            },
			onCancel: function(e) {
				return
			},
			onPaid: function(e) {
				let that = this;

				that.$.alert(that.__("支付成功！"), function() {
					that.$refs.paymentBox.cancel();
					//that.InitPage(that.options);

					//that.notice.postNotificationName("RefreshMessage", e)
					setTimeout(function () {
						that.$.gotopage("/activity/fightgroup/detail?gb_id=" + that.gb_id + "&on=" + that.order_id)
					}, 1500)
				})
			},
			onFail: function(e) {
				let that = this;
				that.$.alert(that.__('支付失败！'))
				//console.log("支付失败：", e)
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.m-navbar-item {padding: 20upx 0;font-size: 24upx;}
	.m-navbar-item:after {border: none;}
	.m-navbar-item.m-navbar-item-on {background-color: #fff;color: $default-skin-bg;}
	.m-navbar-item.m-navbar-item-on::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6upx;border-bottom: 6upx solid $default-skin-bg;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}
	.m-panel-hd label{float: right;color: $default-skin-bg;}
	.m-total-info{text-align: right;padding: 20upx;font-size: 24upx;}
	.m-total-info label{font-size: 32upx;color: $default-skin-bg;}
	.m-total-btn{text-align: right;padding: 20upx 20upx 30upx 20upx;position: relative;}
	.m-total-btn::before {content:" ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #ebebe7;color: #ebebe7;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);}
	.m-total-btn .u-link-btn{margin: 0 10upx;}
	.m-sort{position: relative}
	.m-sort image{width: 24upx; height: 24upx;position: absolute;top: 50%;margin-top: -12upx;margin-left:2upx;}
	.m-product-price text{font-size: 28upx;color: #888;}
	.m-tab{position: fixed;width: 100%;top: var(--window-top);z-index: 2;}
	.m-orderlist{padding-top:70upx;position: absolute;box-sizing: border-box;width: 100%;height: 100%; }
</style>
