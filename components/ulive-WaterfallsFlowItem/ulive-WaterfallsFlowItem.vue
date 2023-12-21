<template>
	<view class="wf-item-page">
		<image :src="item.room_poster"  class="item-img"  />
		<view v-if="item.room_state" class="lv-status flexbox flex_alignc">
			<text class="dot"></text>
			{{__("直播中")}}
		</view>

		<view v-else class="lv-status flexbox flex_alignc">
			<text class="dot dot-gray"></text>
			{{__("离线")}}
		</view>
		<view class="item-desc">
			{{item.room_name || ''}}
		</view>
		<view class="item-info">
			<image :src="item.user_avatar" mode="aspectFill" class="info-avatar" />
			<!-- <view class="info-nickname">{{item.user_nickname}}</view> -->
		</view>

	</view>

</template>

<script>
	export default {
		props:{
			item:{
				type:Object,
				require:true
			}
		}
	}
</script>

<style lang="scss" scoped>

	.wf-item-page{
		background: #fff;
		overflow: hidden;
		border-radius: 5px;
		position: relative;
	}

	.item-img{
		width: 100%;
		height:560upx;
	}

	.item-info{
		display: flex;
		align-items: center;
		padding: 5px;
		position: absolute;
		top: 460upx;
	}

	.info-avatar{
		width: 25px;
		height: 25px;
		border-radius: 50%;
		margin-right: 5px;
	}

	.info-nickname{
		font-size: 12px;
		color: #333;
	}

	.item-desc{
		display: -webkit-box;
		align-items: center;
		padding: 5px 5px 0px 5px;
		font-size: 12px;
	}

	 .lv-status {background: rgba(0,0,0,.4); border-radius: 50upx; color: #fff; font-size: 24upx; padding: 2px 6px; position: absolute; top: 20upx; left: 20upx;}
	.lv-status .dot {background: #1dd36e; border-radius: 50%; display: inline-block; margin-right: 5upx; height: 6px; width: 6px;}
	.lv-status .dot-gray {background: #ababab; border-radius: 50%; display: inline-block; margin-right: 5upx; height: 6px; width: 6px;}
</style>
