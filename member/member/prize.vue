<template>
	<view class="page">
		<block v-if="(Prize.length > 0)">
			<view class="m-myprice-item" v-for="(item, index) in Prize" :key="index">
				<image lazy-load :src="(item.awards_image)" />
				<view class="price-title">{{item.awards_name}}</view>
				<view class="price-time">{{item.alh_datetime}}</view>
				<view :class="'price-btn ' + (item.alh_is_send?'gray':'red')" @click="buttonclicked" :data-id="(item.alh_id)" :data-activity_id="(item.activity_id)" :data-alh_is_send="(item.alh_is_send)" :data-alh_item_id="(item.alh_item_id)">{{item.alh_is_send?__('已经发奖'):__('去领奖品')}}</view>
			</view>
		</block>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{sprintf(__('没有%s中的奖品，快去%s吧~~'), tip1, tip2)}}</text>
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
		data: function() {
			return {
				Prize: [], Category: 0, tip1: "", tip2: "", isLuckDraw: !0, isGoldenEgg: !0
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('我的奖品')
			});

			//console.info(options);
			var that = this;
			var t = this.shopInfo.VendorFeatureSet;
			this.setData({Category: options.category});
			if (options.category == 1) {
				this.setData({isGoldenEgg: !1});
				this.setData({isLuckDraw: !0});
				that.$.setNavigationBarTitle({title: "幸运大抽奖-我的奖品"});
				this.setData({
					tip1: "抽",
					tip2: "抽奖"
				});
			} else {
				this.setData({isGoldenEgg: !0});
				this.setData({isLuckDraw: !1});

				that.$.setNavigationBarTitle({title: "幸运砸金蛋-我的奖品"});
				this.setData({
					tip1: "砸",
					tip2: "砸金蛋"
				})
			}
		},
		onShow: function () {
			if (this.isGoldenEgg || this.isLuckDraw)
			{
				this.getPrizelist();

			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			getPrizelist: function () {
				var params = {
					activity_type: this.Category,
					activity_type_id: this.StateCode.ACTIVITY_TYPE_LOTTERY,
					store_id: this.shopInfo.store_id
				};
				var that = this;
				that.$.request({
					url    : that.Config.URL.user.listsLotteryHistory,
					data   : params,
					success: function (data, status, msg, code)
					{
						if (status == 200) {
							that.setData({Prize: data.items})
						}
						else {
							that.$.alert(msg);
						}
					}
				});
			},
			buttonclicked: function (e) {
				let that = this;
				if (e.target.dataset.alh_is_send != '0'){
					return
				};

				that.$.navigateTo({url: "/member/member/receiveprize?id=" + e.target.dataset.id + "&activity_id=" + e.target.dataset.activity_id + "&uniqueid=" + e.target.dataset.uniqueid})
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.m-myprice-item{width: 100%;height: 200upx;background: white;padding: 30upx;box-sizing: border-box;position: relative;border-bottom: 1upx solid lightgray;}
	.m-myprice-item image{height: 140upx;width: 140upx;box-sizing: border-box;position: absolute;top: 30upx;left: 30upx;}
	.price-title{font-size: 30upx;position: absolute;left: 200upx;top: 30upx;}
	.price-time{position: absolute;left: 200upx;bottom: 30upx;line-height: 50upx;font-size: 24upx;color: gray;}
	.price-btn{width: 150upx;height: 50upx;color: white;position: absolute;bottom: 30upx;right: 30upx;font-size: 26upx;line-height: 50upx;text-align: center;border-radius: 8upx;}

	.red{background: $default-skin-bg;}
	.gray{background: #ccc;}
</style>
