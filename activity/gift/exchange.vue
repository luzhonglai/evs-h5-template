<template>
	<view class="page">
		<view class="search">
			<slot></slot>
			<template>
				<input maxlength="20" type="text" value="" confirm-type="search" @confirm="searchStart()" :placeholder="__('请输入兑换码')" v-model="code"/>
			</template>
			<!-- <image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/zy-search/search.svg" mode="aspectFit" @click="searchStart()" class="search-icon"></image> -->
			<button mode="aspectFit" @click="searchStart()" style="background-color: crimson;color: aliceblue;margin-top: 40upx;">立即兑换</button>
		</view>
		
		<block v-if="(isData)">
			<view class="m-cells m-cells-form">
				<view class="m-cell">
					<view class="m-cell-hd" style="width: 140upx;"><label class="u-label">{{activityInfo.activity_title}}</label></view>
				</view>
			</view>
			<view class="m-product-list">
				<view v-for="(item, ii) in activityInfo.items" :key="ii" class="m-product-item">
					<view class="m-product-img"><image :src="item.product_image" mode="aspectFill" /></view>
					<view class="m-product-info">
						<view class="m-product-name">
							<label>{{ item.product_name }}</label>
						</view>
			
						<view class="m-product-price">
							<block v-if="item.item_unit_price">
								<label>{{ __('￥') }}</label>
								{{ item.item_unit_price }}
							</block>
							<text style="float: right;margin-right: 60upx;">x{{ item.item_quantity }}</text>
						</view>
					</view>
				</view>
			</view>
			<button class="u-btn u-btn-default" @click="submitInfo" style="margin-top:40upx;">{{ __('领取礼包') }}</button>
		</block>
		<view class="u-loadmore u-loadmore-line" v-else>
		    <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
		</view>
		
	</view>
	
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	
	export default {
		data: function() {
			return {
				code: '',
				activityInfo:{},
				isData: !1,
			};
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('礼包兑换')
			});
		
			var that = this;
			this.forceUserInfo(function(user) {
				console.log(user);
				that.setData({
					serial_code: user.serial_code
				});
			});
		},
		
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			searchStart(e) {
				var that = this;
				if (!this.code) {
					that.$.alert("请输入兑换码！");
					return;
				}
				var params = {
					code: this.code
				};
				that.$.request({
					url: this.Config.URL.user.get_activity_code,
					method: 'post',
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								activityInfo: data,
								isData: !0,
							})
						} else {
							that.$.alert(msg);
							that.setData({
								activityInfo: {},
								isData: !1,
							})
						}
					}
				});
			},
			
			submitInfo: function() {
				var that = this;
				var pat = []
				var items = this.activityInfo.activity_rule.quantity
				for(var i in items){
					if(items[i].quantity > 0){
						var t = items[i].item_id + '|' + items[i].quantity
						pat.push(t)
					}
				}
				
							
			
				if (pat.length <= 0) {
					that.$.alert("亲~请选择商品！");
					return
				}
				
				var str = pat.join(',');
				that.$.navigateTo({
					url: "/pages/checkout/checkout?ifcart=0&cart_id="+str+"&activity_id="+that.activityInfo.activity_id+"&code="+that.code
				}) 
			},
		}
	}
</script>


<style lang="scss">
.search {
	width: 640upx;
	margin: 30upx auto 20upx;
	position: relative;
	input {
		background-color: #ffffff;
		padding: 10upx 74upx;
		font-size: 28upx;
		border-radius: 50upx;
	}
	.voice-icon {
		width: 36upx;
		height: 36upx;
		padding: 16upx 20upx 16upx 0;
		position: absolute;
		left: 16upx;
		top: 4upx;
		z-index: 10;
	}
	.search-icon {
		width: 36upx;
		height: 36upx;
		padding: 16upx 20upx 16upx 0;
		position: absolute;
		right: 0;
		top: -2upx;
		z-index: 10;
	}
}

.m-product-img  {
	width:120upx;
	height: 120upx;
	
	image {
		width:100%;
		height: 100%;
	}
}

.m-product-info {
	height: 120upx;
	margin-left: 20upx;
}

.m-product-item {
	height: 120upx;
}

.m-product-name {
	height: 120upx;
	
}

.m-product-name uni-label {
	-webkit-line-clamp: 1;
}

</style>

