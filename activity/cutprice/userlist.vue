<template>
	<view>
		<view class="m-product-all">
			<view class="m-tab">
				<view class="m-navbar">
					<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="allOrders">
						{{__('我发起的')}}
					</view>
					<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']" @click="toBePaid">
						{{__('我参与的')}}
					</view>
				</view>
			</view>
			<view v-if="loadComplete">
				<scroll-view v-if="(orderlist.length>0)" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
					<view v-for="(items, index) in orderlist"  :key="index"  v-if="items.activity_rule !== undefined" class="m-panel m-panel-access">
						<!-- <view class="m-panel-hd">订单编号：(items.order_id)
						<label v-if="(items.IsCancel)">拼团失败</label>
						<label v-if="(items.IsSuccess)">拼团成功</label>
						<label v-if="(!items.IsSuccess && !items.IsCancel)">拼团中</label>
						</view> -->
						<view class="m-product-list">
							<navigator :url="'/activity/cutprice/detail?mid=' + (items.activity_id) + '&pid=' + (items.activity_rule.item_id) + '&sid=' + (items.buyer_user_id) + '&ac_id=' + (items.ac_id)" class="m-product-item">
								<view class="m-product-img">
									<image lazy-load :src="(items.activity_rule.product_image)" mode="aspectFill" />
								</view>
								<view class="m-product-info">
									<view class="m-product-name" style="height:90upx">
										<label>{{items.activity_rule.item_name}}</label>
									</view>
									
									<view class="progressBarBox">
										<view class="u-progressBar">
											<view class="u-progressBar-cont" :style="'width:' + (100*(items.activity_rule.item_unit_price - items.ac_sale_price) / (items.activity_rule.item_unit_price - items.activity_rule.cut_down_min_limit_price)) + '%'"></view>
										</view>
										<view class="m-product-name" v-if="items.end==1"><label style="color:#ff0000;font-weight: bold;" >该活动已过期</label></view>
									</view>
									<!-- <view class="progress-bar">
									  <view class="left" style="width:(100*items.CutPricePercent)%"></view>
									</view> -->
									
									<view class="m-product-price" style="display:flex;margin-top:16upx;font-size:24upx;justify-content: space-between;padding-right:36upx">
										<view><label style="color:#717171">{{__('原价')}}</label> {{__('￥')}}{{items.activity_rule.item_unit_price}}</view>
										<view style="color:#717171">{{Number(items.activity_rule.item_unit_price - items.ac_sale_price).toFixed(2) == 0.00 ? '':Number(items.activity_rule.item_unit_price - items.ac_sale_price).toFixed(2) }}</view>
									</view>
								</view>
							</navigator>
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
				<navigator url="/activity/cutprice/list" redirect="true" class="m-nullpage" v-else>
					<view class="m-nullpage-middle">
						<view class="m-null-tip">
							<label style="font-size:32upx;">{{__('亲~您还没有砍价哦，')}}</label><label class="highlight-link">{{__('快去看看吧')}}</label>
						</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>

	import $ from "../../helpers/util";
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				tapindex     : 1,
				page         : 1,
				rows         : 10,
				flag         : !0,
				ispage       : !1,
				userType     : 1,
				orderlist    : [],
				width        : 100,
				sponsorId    : 0,
				participantId: 0,
				loadComplete: false // 没有加载数据前不显示的对应内容
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('我的砍价')
			});

			this.setData({
				sponsorId    : this.userInfo.user_id,
				participantId: 0
			}), this.GetUserCutPriceActivityList()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			allOrders: function () {
				this.setData({
					tapindex     : 1,
					page         : 1,
					rows         : 10,
					orderlist    : [],
					sponsorId    : this.userInfo.user_id,
					participantId: 0,
					loadComplete : !1
				}), this.GetUserCutPriceActivityList()
			},

			toBePaid: function () {
				this.setData({
					tapindex     : 2,
					page         : 1,
					rows         : 10,
					orderlist    : [],
					sponsorId    : 0,
					participantId: this.userInfo.user_id,
					loadComplete : !1
				}), this.GetUserCutPriceActivityList()
			},

			GetUserCutPriceActivityList: function () {
				var that = this;

				var params = {
					store_id  : this.shopInfo.store_id,
					is_sponsor: this.sponsorId ? 1 : 0,
					page      : this.page,
					rows      : this.rows
				};
				$.request({
					url    : this.Config.URL.user.listsUserCutPriceHistory,
					data   : params,
					success: function (data, status, msg, code) {
						if (200 == status && data.items.length > 0) {
							if (data.page >= data.total) {
								that.setData({
									flag     : !1,
									ispage   : !1,
									orderlist: that.orderlist.concat(data.items)
								})
							} else {
								that.setData({
									ispage: !0,
									flag: !0,
									orderlist: that.orderlist.concat(data.items)
								})
							}
						} else {
							that.setData({
								flag  : !1,
								ispage: !1
							})
						}
						that.setData({
							loadComplete  : !0
						})
					},
					fail: function(data) {
						that.setData({
							loadComplete: !0
						});
						that.$.alert("网络异常请重试！");
					}
				});

			},

			scrollbottom: function () {
				if (this.flag) {
					var e = this;
					e.setData({flag: !1, ispage: !0}), clearTimeout(t);
					var t = setTimeout(function () {
								e.setData({page: e.page + 1}), e.GetUserCutPriceActivityList()
							},
							500)
				}
			}
		}
	}
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
	.progressBarBox{position: absolute;right: 0;bottom: 38%;color: #888;font-size: 24upx;margin-right: 20upx;}
	.u-progressBar{display:inline-block;width: 140upx;height: 20upx;background-color: #d5d5d5;border-radius: 20upx;overflow: hidden;}
	.u-progressBar-cont{height: 20upx;background-color: #ffc001;}
	.progress-bar {
		width: 500upx;
		height: 26upx;
		border: 5upx solid rgb(89, 10, 35);
		background: rgb(89, 10, 35);
		border-radius: 40upx;
		position: relative;
	}

	.left {
		border-radius: 40upx;
		background: rgb(255, 231, 0);
		height: 100%;
		float: left;
	}
	
</style>
