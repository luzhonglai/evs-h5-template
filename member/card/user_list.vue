<template>
	<view class="page">
		<view class="m-coupon-list" >
			<scroll-view scroll-y="true" v-if="(cardLists.length>0)" class="m-orderlist" @scrolltolower="scrollbottom" style="width:100%;height:100%;position:absolute;box-sizing: border-box;">
				<navigator  :url="'/member/card/detail?fid=' + item.card_code "  class="m-coupon-item" v-for="(item, index) in cardLists" :key="index">
					<view class="m-activity-image">
						<image :src='(item.card_type_image)' style="width: 100%;height: 100%;"></image>
					</view>
					<view class="m-activity-info">
						<view class="m-activity-title">
							<label>{{(item.card_type_name)}}</label>
						</view>
						<view class="m-activity-tips">
							{{__('价格：')}}<label>{{__('￥')}}{{(item.card_type_prize)}}</label>
						</view>
					</view>
				</navigator>
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
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	
	export default {
		data() {
			return {
				type: 1002,
				cardLists: [],
				flag: !0,
				ispage: !0,
				isdata: !1,
				page: 1,
				rows: 10,
			}
		},
		
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('我的卡包')
			});
			
			var that = this;
			
			if(options.type)
			{
				that.setData({
					type: options.type
				})
			}
			
			this.cardList()
		},
		
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			
			cardList: function() {
				var that = this;
				var params = {
					  type: this.type,
					  pageNum: this.page,
					  pageSize: this.rows
				}
				that.$.request({
					url: that.Config.URL.card.card_list,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status && data.items.length > 0) {
						    var $now = (new Date).getTime();
						    if (data.page >= data.total) {
						        that.setData({
						            flag  : !1,
						            ispage: !1,
						            isdata: !0,
						            cardLists: that.cardLists.concat(data.items)
						        });
						    } else {
						        that.setData({
						            flag  : !0,
						            ispage: !0,
						            isdata: !0,
						            cardLists: that.cardLists.concat(data.items)
						        });
						    }
						} else {
						    that.setData({
						        flag  : !1,
						        ispage: !1,
						        isdata: !1
						    });
						}
						
					}
				})
				
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
								flag: !1,
								page: parseInt(that.page) + 1,
								rows: 10
							});
			
							that.cardList()
						}, 100)
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
		height: 450upx;
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

