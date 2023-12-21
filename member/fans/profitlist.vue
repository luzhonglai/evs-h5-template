<template>
	<view>
		<view class="m-tab">
			<view class="m-navbar">
				<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @tap="earningsToday">
					{{__('今日收益')}}
				</view>
				<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']" @tap="nearlyAMonth">
					{{__('近一个月')}}
				</view>
				<view :class="['m-navbar-item', tapindex==3?'m-navbar-item-on':'']" @tap="nearlyThreeMonths">
					{{__('近三个月')}}
				</view>
				<view :class="['m-navbar-item', tapindex==4?'m-navbar-item-on':'']" @tap="allDay">
					{{__('全部')}}
				</view>
			</view>
		</view>

		<view v-if="loadComplete">
			<scroll-view class="m-scrollBox" v-if="UserFans.length>0" scroll-y="true" @scrolltolower="scrollbottom">
				<view class="m-panel m-panel-access m-comment ">
					<view class="m-panel-hd">{{__('收益总金额')}}
						<label>{{__('￥')}}{{uo_buy_commission_total}}</label>
					</view>
					<view class="m-panel-bd">
						<view v-for="(item, index) in UserFans" :key="index" class="m-media-box m-media-box-appmsg"
							:data-order_id="item.order_id" @click="onShowOrder">
							<view class="m-media-box-hd">
								<image class="m-media-box-thumb" :src="item.buyer_user_avatar" />
							</view>
							<view class="m-media-box-bd">
								<label class="m-media-box-title">{{item.buyer_user_name}}</label><label
									class="m-media-box-level"
									v-if="item.buyer_user_level_name">{{item.buyer_user_level_name}}</label>
								<label class="m-media-box-num">{{__('收益：')}}
									<text
										:style="item.uo_active ? 'color:green' : 'color:gray'">{{__('￥')}}{{item.uo_buy_commission}}
										{{item.uo_active ? '' : __('未达成')}}</text>
								</label>
								<view class="m-media-box-info">
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 1">{{__('推广消费奖')}}
									</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 10">
										{{__('市代消费奖')}}</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 11">
										{{__('区代消费奖')}}</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 15">
										{{__('合伙人消费奖')}}</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 6">{{__('推广销售奖')}}
									</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 20">
										{{__('市代销售奖')}}</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 21">
										{{__('区代销售奖')}}</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 15">
										{{__('合伙人销售奖')}}</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 51">
										{{__('推荐商家奖励')}}</view>
									<view class="m-media-box-info-meta m-tiem" v-if="item.uo_level == 52">
										{{__('推荐服务商奖励')}}</view>

									<label style="font-size: 12px;line-height: 1.8;">{{item.order_id}}</label>

									<view class="m-media-box-info-meta" style="float:right;padding-right:0">
										{{item.order_time}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="m-loading-box">
					<block v-if="ispage">
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
			<view class="m-nullcontent" v-else>
				<view class="m-nullpage-middle">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
						<text>{{__('赶快去分享商品，赚取收益吧!')}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				tapindex: 1,
				page: 1,
				time_flag: 1,
				ispage: !0,
				flag: !0,
				UserFans: [],
				uo_buy_commission_total: 0,
				level: 0,
				loadComplete: false // 没有加载数据前不显示的对应内容
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('我的收益')
			});

			let that = this;
			that.$.isNull(options.tp) || this.setData({
				tapindex: 2,
				page: 1,
				time_flag: 2,
				ispage: !0,
				flag: !0
			});

			let $title = this.__('所有佣金');

			if (options.level) {
				this.setData({
					level: options.level
				});

				switch (parseInt(options.level)) {
					case 1:
						$title = this.__('消费奖');
						break;
					case 6:
						$title = this.__('销售奖');
						break;
					case 15:
						$title = this.__('合伙消费奖');
						break;
					case 25:
						$title = this.__('合伙销售奖');
						break;
					case 10:
						$title = this.__('市代消费奖');
						break;
					case 20:
						$title = this.__('市代销售奖');
						break;
					case 11:
						$title = this.__('区代消费奖');
						break;
					case 21:
						$title = this.__('区代销售奖');
						break;
				}
			} else {}


			that.$.setNavigationBarTitle({
				title: $title
			});

		},
		onShow: function() {
			this.setData({
				UserFans: []
			}), this.InitData()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			InitData: function() {
				var params = {
						time_flag: this.time_flag,
						page: this.page,
						uo_level: this.level
					},
					that = this;

				that.$.request({
					url: this.Config.URL.fx.lists_order,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							if (data.page >= data.total) {
								that.setData({
									UserFans: that.UserFans.concat(data.items),
									uo_buy_commission_total: data.uo_buy_commission_total,
									flag: !1,
									ispage: !1
								})
							} else {
								that.setData({
									UserFans: that.UserFans.concat(data.items),
									uo_buy_commission_total: data.uo_buy_commission_total,
									flag: !0,
									ispage: !0
								})
							}
						} else {
							that.setData({
								flag: !1,
								ispage: !1
							})
						}
						that.setData({
							loadComplete: !0
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
			onShowOrder: function(e) {
				let that = this;
				that.$.gopage("/member/order/detail?dist_flag=1&on=" + e.currentTarget.dataset.order_id);
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
							}), e.InitData()
						},
						100)
				}
			},
			earningsToday: function() {
				this.setData({
					tapindex: 1,
					page: 1,
					time_flag: 1,
					ispage: !0,
					flag: !0,
					UserFans: [],
					uo_buy_commission_total: 0,
					loadComplete: !1
				}), this.InitData()
			},
			nearlyAMonth: function() {
				this.setData({
					tapindex: 2,
					page: 1,
					time_flag: 2,
					ispage: !0,
					flag: !0,
					UserFans: [],
					uo_buy_commission_total: 0,
					loadComplete: !1
				}), this.InitData()
			},
			nearlyThreeMonths: function() {
				this.setData({
					tapindex: 3,
					page: 1,
					time_flag: 3,
					ispage: !0,
					flag: !0,
					UserFans: [],
					uo_buy_commission_total: 0,
					loadComplete: !1
				}), this.InitData()
			},
			allDay: function() {
				this.setData({
					tapindex: 4,
					page: 1,
					time_flag: 0,
					ispage: !0,
					flag: !0,
					UserFans: [],
					uo_buy_commission_total: 0,
					loadComplete: !1
				}), this.InitData()
			}
		}
	}
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
		height: 6upx;
		border-bottom: 6upx solid $default-skin-bg;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}

	.m-media-box-thumb {
		border-radius: 100%;
		overflow: hidden;
	}

	.m-media-box-num {
		float: right;
		font-size: 24upx;
	}

	.m-media-box-num text {
		color: $default-skin-bg;
	}

	.m-media-box-info {
		-webkit-box-flex: 2;
		-webkit-flex: 2;
		flex: 2;
	}

	.m-tab {
		position: fixed;
		width: 100%;
		top: var(--window-top);
		z-index: 2;
	}

	.m-scrollBox {
		padding-top: 84upx;
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}

	.m-panel {
		margin-top: -4upx;
	}

	.m-num {
		float: right;
		color: $default-skin-bg
	}

	.m-panel-hd label {
		color: $default-skin-bg;
		font-size: 28upx;
		margin-left: 20upx;
	}

	.m-media-box-info-meta {
		padding-right: 14upx;
	}

	.m-media-box-level {

		font-size: .45rem;
		line-height: .6rem;
		background-color: #ff6700;
		height: .6rem;
		padding: 0 .1rem;
		margin-left: .2rem;
		border-radius: .1rem;
		box-shadow: 1px 1px 1px rgba(0, 0, 0, .15);
		color: #fff;
	}
</style>
