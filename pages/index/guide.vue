<template>
	<view class="content">
		<swiper class="swiper"
		:indicator-dots="true"
		:autoplay="autoplay"
		:duration="duration">
			<swiper-item v-for="(item, si) in items" :key="si">
				<view class="swiper-item">
					<image :src="item" mode="aspectFit"></image>
				</view>
				<view v-if="item_lastindex!==si" class="jump-over" @tap="launchFlag()">{{jumpover}}</view>
				<view v-else class="experience" @tap="launchFlag()">{{experience}}</view>
			</swiper-item>
		</swiper>
		<!-- <view class="uniapp-img"><image :src="logo" mode="aspectFit"></image></view> -->
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
				background: ['color1', 'color2', 'color3'],
				items:[],
				item_lastindex:0,
				logo:'',
				autoplay: false,
				duration: 500,
				jumpover: '跳过',
				experience: '立即体验'
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('')
			});

			let that = this;
			that.$.request({
			    url: that.Config.URL.index_guide,
			    data: {},
			    success: function (data, status, msg, code) {
			        if (status == 200)
			        {
						if(data.advertisement_open)
						{
							that.setData({item_lastindex:data.items.length-1});
							that.setData({items:data.items});
							that.setData({logo:data.logo});
							
							that.$forceUpdate() //二维数组，开启强制渲染
						}
						else
						{
							that.launchFlag();
						}
			        }
			        else
			        {
						that.launchFlag();
			        }
			    }
			});
		},
		methods: {
			launchFlag: function(){
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				uni.setStorage({
						key: 'launchFlag',
						data: true,
				});
				uni.switchTab({
					url: '/pages/index/index'
				});

			}
		}
	}
</script>
<style>
	page{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
	}
	
	.content {  
	  width: 100%;  
	  /* #ifdef H5 */  
	  height: calc(100vh - 88rpx - 100rpx);  
	  /* #endif */  
	  /* #ifdef APP-PLUS */  
	  height: 100vh;  
	  /* #endif */  
	  
	  height: 100vh;  
	}
	
	.swiper{
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}
	.swiper-item {
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		display: flex;
		/* justify-content: center; */
		align-items:flex-end;
		flex-direction:column-reverse
	}


	.swiper-item image{
		margin: 0 auto;
		width: 100%;
		height: 100%;
	}

	.swiper-item-img{
		width: 100%;
		height: auto;
		margin: 0 auto;
	}
	.swiper-item-img image{
		width: 80%;
	}
	.uniapp-img{
		height: 20%;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items:center;
		overflow: hidden;
	}
	.uniapp-img image{
		width: 40%;
	}

	.jump-over,.experience{
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		border: 1px solid #454343;
		z-index: 999;
	}
	.jump-over{
		right: 45upx;
		top: 125upx;
	}
	.experience{
		right: 50%;
		margin-right: -105upx;
		bottom: 100upx;
	}
</style>
