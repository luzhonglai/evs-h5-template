<template>
	<view class="page">
		<view class="m-coupon-list" >
			<block v-if="(getlist.length>0)">
				<navigator  :url="'/activity/giftbag/detail?aid=' + item.activity_id "  class="m-coupon-item" v-for="(item, index) in getlist" :key="index">
					<view class="m-activity-image">
						<image :src='(item.activity_rule.giftbag_image)' style="width: 100%;height: 100%;"></image>
					</view>
					<view class="m-activity-info">
						<view class="m-activity-title">
							<label>{{(item.activity_rule.activity_bag_category)}}</label>
						</view>
						<view class="m-activity-tips">
							<label>{{(item.activity_name)}}</label>
						</view>
					</view>
				
				</navigator>
				<view class="m-loading-box">
					<block v-if="(ispage1)">
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
			</block>
			<view class="m-nullcontent" v-else>
				<view class="m-nullpage-middle">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
					</view>
				</view>
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
				options: {},
				ispage: !1,
				getlist: [],
				Coupons: [],
				flag: !0,
				Id: 0,
				Code: "",
				index: 0,
				needed_point: 0,
				store_id: 0,
				activity_state: 1,
				page: 1,
				
				isdata: !1,
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin'
		]),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('礼包专区')
			});
			
			this.setData({
				options:options,
			})
			var that = this;
			 this.getGiftbaglist()
		},
		
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.scrollbottom();
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

		
		
			getGiftbaglist: function() {
			
				var params = {
			
				    activity_type_id: this.StateCode.ACTIVITY_TYPE_GIFTBAG,
					activity_state  : this.activity_state,
				    page            : this.page
				};
				
				var that = this;
				that.$.request({
					url: this.Config.URL.store.activity,
					data: params,
					// ajaxCache: {
					// 	timeout: this.Config.CACHE_EXPIRE
					// },
					success: function(data, status, msg, code) {
						
						if (200 == status && data.items.length > 0) {
							if (data.page >= data.total) {
								that.setData({
									flag: !1,
									ispage: !1,
									getlist: that.getlist.concat(data.items),
								})
							} else {
								that.setData({
									flag: !0,
									ispage: !0,
									getlist: that.getlist.concat(data.items),
								})
							}
						
							that.setData({
								isdata: !0
							})
						
						} else {
							that.setData({
								flag: !1,
								ispage: !1,
								isdata: !1
							})
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
			
			scrollbottom: function(e) {
			    if (this.flag) {
			        var that = this;
			        that.setData({ flag: !1 }), clearTimeout(n);
			
			        var post = this.post;
					/*
			        post.sidx = 'product_unit_price';
			        post.sord = this.sort == 1 ? 'DESC' : 'ASC';
					*/
			        post.curpage = parseInt(that.post.curpage) + 1;
			
			        var n = setTimeout(function() {
			            that.setData({
			                post: post
			            }),
			                that.GetPlist();
			        }, 500);
			    }
			},
	
	
	
			
	
		}
	}
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.m-coupon-list {
		// margin-top: 36upx
	}

	.m-coupon-item {
		width: 710upx;
		height: 448upx;
		background: #FFFFFF;
		box-shadow: 0px 0px 4upx rgba(0, 0, 0, 0.16);
		opacity: 1;
		border-radius: 16upx;
		margin:24upx 20upx;
		overflow:hidden;
	}
	
	.m-activity-image {
		width: 100%;
		height: 328upx;
		background: rgba(0, 0, 0, 0);
		opacity: 1;
		border-radius: 16px 16upx 0px 0px;

	}
	
	.m-activity-info {
		padding:16upx 20upx;
	}
	
	.m-activity-title {
		font-size: 30upx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 42upx;
		color: #002951;
		opacity: 1;
		overflow: hidden;
		text-overflow:ellipsis; 
		white-space: nowrap;

	}
	
	.m-activity-tips {
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 34upx;
		color: #002951;
		opacity: 1;
		margin-top: 8upx;
		overflow: hidden;
		text-overflow:ellipsis; 
		white-space: nowrap;

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
