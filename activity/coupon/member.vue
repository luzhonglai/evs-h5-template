<template>
	<view class="page">
		<scroll-view class="m-scrollBox" scroll-y="true">
		<block v-if="(UserCoupon.length>0)">
			<view  class="m-coupon-item" @click="changecoupon" :data-id="(item.user_voucher_id)" :data-item_id="(item.item_id)"  v-for="(item, index) in UserCoupon"  :key="index">
				<image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/coupon_red.png" class="item-bg"></image>
				<view class="coupon-item-left">
					<view class="item-left-top">{{__('￥')}}<label style="font-size:64upx">{{item.voucher_price}}</label></view>
					<view class="item-left-bottom">{{sprintf(__('满(%s)可用'), item.voucher_subtotal)}}</view>
				</view>
				<view class="coupon-item-right">
					<view class="item-title item-title-black">{{item.activity_name}}</view>
					<view class="item-middle">{{sprintf(__('满 %s 减 %s'), item.voucher_subtotal, item.voucher_price)}}</view>
					<view class="item-middle">
						<label class="item-time">{{item.voucher_start_date}}~{{item.voucher_end_date}}</label>
					</view>

					<view class="item-desc"></view>
				</view>
				<image lazy-load src="/static/images/checked.png" class="image-checked" v-if="(item.user_voucher_id == id_checked)"/>
			</view>

			<button class="u-btn u-btn-default" style="margin-top:30upx;" @click="uesnothing">{{__('不使用优惠券')}}</button>
		</block>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{__('赶快去领券中心吧')}}</text>
				</view>
			</view>
		</view>
		</scroll-view >
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
				options:{},
				CartSelect:[],
				UserCoupon: [], id_checked: 0, IsUseCoupon: 1
			};
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('使用优惠券')
			});

			var voucher_items = $.parseJSON(options.val);
			this.setData({
				UserCoupon: voucher_items,
				id_checked: options.user_voucher_id,
				options: options,
			})

			if(options.ifcart)
			{
				this.getselect()
			}

		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			getselect:function(){
				var that = this;
				var params = {};
				that.$.request({
					url: this.Config.URL.cart.getselect,
					data: params,
					success: function(data, status, msg, code) {
						var isSelect = false;
						if(status == 200)
						{
							if (data['items'].length > 0)
							{
								that.setData({
									CartSelect:data['items']
								})
							}
						}
						else
						{
							//that.$.confirm(msg);
						}
					}
				})
			},
			changecoupon: function (e) {
				var that = this;
				var item_id = parseInt(e.currentTarget.dataset.item_id);

				this.setData({
					IsUseCoupon: 0,
					id_checked: parseInt(e.currentTarget.dataset.id)
				});

				that.goback();
			},
			uesnothing: function () {
				var that = this;

				this.setData({
					IsUseCoupon: 0,
					id_checked: 0
				});

				this.goback();
			},
			goback: function () {
				var that = this;
				$.navigateBack(1, function () {
					var params = that.options;

					params.user_voucher_id = that.id_checked;
					that.notice.postNotificationName("RefreshCoupon", params)
				})
			}
		}
	}
</script>



<style lang="scss">
@import "../../styles/_variables";

.m-scrollBox{padding:10upx 10upx 0upx;position: absolute;top:0;left:0;box-sizing: border-box;width: 100%;height: 100%; }
.m-coupon-item{margin: 10upx 10upx 20upx;position: relative;width: 100%;height: 190upx;}
.m-coupon-item .item-bg{width: 710upx;height: 190upx;position: absolute;left: 0;top:0;}
.coupon-item-left{position: absolute;color: white;text-align: center;width: 250upx;padding: 25upx 0upx;}
.item-left-top{line-height: 100upx;font-weight: bold;}
.item-left-top label{font-size: 90upx;}
.item-left-bottom{font-size: 24upx;}
.coupon-item-right{position: absolute;left: 250upx;top:0;width:420upx;height: 170upx; padding: 10upx 20upx;font-size: 22upx;color: gray;}
.item-title{line-height: 40upx;font-size: 28upx;height: 80upx;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;}
.item-title-black{color: #333;}
.item-middle{height: 50upx;line-height: 50upx;font-size: 24upx;}
.item-usenow{font-size: 24upx;border:1px solid $default-skin-bg;float: right;color: $default-skin-bg;border-radius: 40upx;padding: 0 15upx;position: relative;top: -8upx;line-height: 40upx;}.item-desc{height: 50upx;line-height: 50upx;margin-top: 5upx;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;}
.image-checked{position: absolute;right: 20upx;bottom: 0;width: 50upx;height: 50upx;}
</style>
