<template>
	<view class="page">
		<view style="height:150upx;width:100%;"></view>
		<view class="row-space-around" >
			<view class="bg-gray-help margin-sm padding-lr-lg padding-tb-sm radius-xs" v-for="(item,index) in MemberPostsList" :key="index" @tap="goLive(item.story_id)">
				<image lazy-load :src="item.story_file[0]"  style="width:366upx;" />
				<view class="item-info">
					<image :src="item.user_avatar" mode="aspectFill" class="info-avatar" />
					<text class="item-name">{{item.user_nickname}}</text>
				</view>
			</view>
		</view>
		<view class="m-loading-box" style="margin-top:120upx;">
			<block v-if="ispage">
				<view class="u-loadmore">
					<label class="u-loading"></label>
					<text class="u-loadmore-tips">{{__('正在加载')}}</text>
				</view>
				<view>
					<text></text>
				</view>
			</block>
			<block v-else>
				<view class="u-loadmore u-loadmore-line">
					<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	
	import dateUtil from "../../helpers/util_date";
	import statusBar from '../../components/status-bar.vue'
	import { mapState, mapMutations } from 'vuex';
	export default {
		props:{
			// 瀑布流列表
			videoList:{
				type:Array,
				require:true
			},
		
		},
		data() {
			return {
				flag: !1,
				ispage: !1,
				page:1,
				MemberPostsList: [],
				is_loaded:!1,
			};
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin','__', '$',]),
		components: {
			statusBar,
		},
		
		created() {
			this.getPostsList()
		},
		
		watch:{
			
		},
		methods:{
			 ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
	
			
			getPostsList: function (force_refresh) {
				let that = this;
				var params = {page: this.page, 'rand':1, 'story_type': 4};
			
				that.$.request({
					url: this.Config.URL.sns.story_lists,
					data: params,
					success: function (data, status, msg, code) {
						if (data.items.length > 0) {
							for (var r = 0; r < data.items.length; r++) {
								data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
							}
			
							let tmp = []
			
							if (force_refresh)
							{
								tmp = data.items.concat(that.MemberPostsList);
							}
							else
							{
								tmp = that.MemberPostsList.concat(data.items);
							}
			
							if (data.page >= data.total) {
								that.MemberPostsList = tmp
								that.flag = !1
								that.ispage = !1
							} else {
								that.MemberPostsList = tmp
								that.flag = !0
								that.ispage = !0
							}
			
						} else {
							that.flag = !1
							that.ispage = !1
							
						}
						
						that.is_loaded = !0
						
			
						that.$.stopPullDownRefresh()
						that.$.hideLoading();
					}
				});
			},
			
			goLive: function(e) {
				this.$emit('confirm', e);
			},
			
			scrollbottom: function(e) {
			    if (this.flag) {
			        var that = this;
					that.flag = !1;
			         clearTimeout(n);
			      
			       that.page = parseInt(that.page) + 1;
			
			        var n = setTimeout(function() {
			                that.getPostsList();
			        }, 500);
			    }
			},
			
		
	
		}
	}
</script>

<style scoped>
	
	.page {
		background-color: #000000;
	}
	/* 横向两端对齐,位于各行之前、之间、之后都留有空白的容器内 */
	.row-space-around {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		position: relative;
		/* #endif */
		flex-direction: row !important;
		/* justify-content: space-around !important; */
		flex-wrap:wrap !important;
		background-color: #000000;
	}
	
	.radius-xs {
		/* padding:10upx; */
		border-radius: 10upx;
		background-color: #fff;
		margin: 4upx;
	}
	
	.lv-status {
		
/* 		height:50upx;
		width:120upx; */
		background-color: rgba(0, 0, 0, 0.4);
		border-radius: 50upx;
		color: #fff;
		font-size: 18upx;
		padding: 4upx 12upx;
		position: absolute;
		top: 20upx;
		left: 20upx;
		display: flex;
		flex-direction:row !important;
		/* #ifdef APP-PLUS-NVUE */
		padding-top:14upx;
		/* #endif */
		
	}
	
	.dot-gray {
		background-color: #ababab;
		border-radius: 50%;
		margin-right: 4upx;
		margin-top: 14upx;
		height: 12upx;
		width: 12upx;
		width: 12upx;
		/* #ifdef APP-PLUS-NVUE */
		margin-top: 4upx;
		/* #endif */
	}
	
	.dot {
		background-color: #ababab;
		border-radius: 50%;
		margin-right: 4upx;
		margin-top: 14upx;
		height: 12upx;
		width: 12upx;
		/* #ifdef APP-PLUS-NVUE */
		margin-top: 4upx;
		/* #endif */
	}
	
	.info-avatar {
		height: 50upx;
		width: 50upx;
		border-radius: 50upx;
	
	}
	
	.item-name {
		color: #fff;
		margin-left: 10upx;
		font-size: 24upx;
		line-height: 50upx;
	}
	
	.item-info {
		position: absolute;
		width:300upx;
		bottom:30upx;
		left:20upx;
		display: flex;
		flex-direction:row !important;
		flex-wrap: wrap !important;
		overflow:hidden;
	}
	
	.live-room-name {
		width:344upx;
	
		padding:10upx 6upx;
	}
	
	.room-name {
		overflow:hidden;
		text-overflow:ellipsis;  
		lines: 2;
		font-size: 24upx;
	}
	.u-loading {
		width:40upx;
		height:40upx;
		margin-left:220upx;
	}
	.u-loadmore-tips {
		background-color: #000000;
		color:#fff;
		/* #ifdef APP-PLUS-NVUE */
		width:400upx;
		margin-left:280upx;
		/* #endif */
	}
</style>
