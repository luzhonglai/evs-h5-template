<template>
	<view class="page"  v-if="loadPageFlag" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">
		<status-bar></status-bar>
		<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav" :loadPageFlag="loadPageFlag"></diy>
		<scroll-view scroll-y="true" v-if="(Info.length>0)" @scrolltolower="scrollbottom" :style="'width:100%;height:' + (windowHeight) + 'px'">
		<view class="m-title">{{__('热门内容')}}</view>
			<view class="uni-list1" style="background-color:#FFFFFF">
				<navigator  :url="'/pagesub/article/detail?id=' + (items.article_id)" v-for="(items, index) in Info"
				  :key="index">
					<view class="uni-list-cell " hover-class="uni-list-cell-hover">
						<view class="uni-media-list">
							<image class="uni-media-list-logo" :src="items.article_image"></image>
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">{{items.article_title}}</view>
								<view class="uni-media-list-text-bottom">
									<text class="m-badge">{{items.category_name}}</text>
									<text>{{items.article_add_time}}</text>
								</view>
							</view>
						</view>
					</view>
				</navigator>
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
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>


<script>

		import diy from '../../components/themes/diy.vue'
		import dateUtil from "../../helpers/util_date";
		import statusBar from '../../components/status-bar.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {

				options:{},
				pageId: '',
				loadPageFlag: false,
				PageContent: [],
				BgConfig: {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}},
				PageNav:{window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}},
				ShareImg: "",
				ShareTitle: "",
				refresh: !0,
				loading: true,


				isdata: false,
				page: 1,
				rows: 10,
				ispage: !1,
				flag: !0,
				Info: [],
				windowHeight: 0,
				categoryId: 0,
				Title: ""
			}
		},
		components: {
			diy,
			statusBar
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('资讯首页')
			});

			let that = this;
			this.setData({
				categoryId: options.category_id ? options.category_id : 0
			});
			try {
				var t = that.$.getSystemInfoSync();
				this.setData({
					windowHeight: t.windowHeight
				})
			} catch (n) {
				//console.log(" Do something when catch error")
			}


			if (!that.is_loaded)
			{
				that.initData(false);
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			//this.getDivModel(true)
			this.initData(true)
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			//初始化数据，获取店铺分类
			initData: function(force_refresh) {
				var that = this;

				that.getDivModel(force_refresh)

				this.getArticleList();
			},

			//读取diy内容
			getDivModel: function(force_refresh) {
				var that = this,
					params = {page_type:'page_article'};

				that.$.request({
					url: that.Config.URL.index_app,
					data: params,
			        loading: false,
					ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE,
			            forceRefresh: force_refresh
					},
					success: function(data, status, msg, code) {
						uni.stopPullDownRefresh()
						that.setData({
							loadPageFlag: true
						});

						that.setData({
							pageId: data.page_id,
							PageContent: that.$.parseJSON(data.page_code),
							BgConfig: that.$.parseJSON(data.page_config),
			                PageNav: that.$.parseJSON(data.page_nav),
							ShareImg: data.page_share_image,
							ShareTitle: data.page_share_title
						});

						if (that.PageNav.window.navigationBarTextStyle == 'black')
						{
							that.PageNav.window.navigationBarTextStyle = '#000000'
						}

						if (that.PageNav.window.navigationBarTextStyle == 'white')
						{
							that.PageNav.window.navigationBarTextStyle = '#ffffff'
						}

						uni.setNavigationBarColor({
							frontColor: that.PageNav.window.navigationBarTextStyle,
							backgroundColor: that.PageNav.window.navigationBarBackgroundColor,
							animation: {
								duration: 400,
								timingFunc: 'easeIn'
							}
						})
					}
				});
			},

			getArticleList: function() {
				var params = {
					// 暂时放平台咨询
					//store_id: this.shopInfo.store_id,
					page: this.page,
					rows: 10,
					sidx: 'article_id',
					sord: 'DESC',
					category_id: 0
				};

				var that = this;
				that.$.request({
					url: this.Config.URL.cms.lists,
					data: params,
					dataType: 'json',
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								isdata: !0
							});
							if (data.page >= data.total) {
								that.setData({
									flag: !1,
									ispage: !1,
									Info: that.Info.concat(data.items)
								})
							} else {
								that.setData({
									flag: !0,
									ispage: !0,
									Info: that.Info.concat(data.items)
								})
							}

						} else {
							that.setData({
								flag: !1,
								ispage: !1
							});
						}
					}
				});
			},
			scrollbottom: function() {
				if (this.flag) {
					var e = this;
					e.setData({
						flag: !1
					});
					clearTimeout(t);
					var t = setTimeout(function() {
						e.setData({
							page: e.page + 1,
							flag: !1
						}), e.getArticleList();
					}, 500)
				}
			}
		}

	}
</script>



<style lang="scss">
    /*
	@import "../../styles/_variables";

	.m-activity-item {
		width: 100%;
		height: 240upx;
		margin-bottom: 10upx;
		background: white;
	}

	.m-activity-img {
		padding: 20upx;
		width: 260upx;
		height: 200upx;
		float: left;
	}

	.m-activity-info {
		width: 450upx;
		height: 100%;
		float: left;
		padding: 20upx;
		box-sizing: border-box;
		display: flex;
		flex-flow: column;
		justify-content: space-between
	}

	.m-activity-name {
		font-size: 16px;
		margin-bottom: 40upx;
		margin-top: 10upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.gray {
		font-size: 35upx;
		display: inline-block;
		color: #888;
	}

	.m-activity-time {
		margin-left: 10upx;
		margin-right: 30upx;
		font-size: 26upx;
		color: #888;
	}

    */


	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}

	.uni-media-list-logo {
		width: 180upx;
		height: 140upx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.m-badge {
		border: 2upx solid #FFFFFF;
		background-color: #ffc0cb;
		color: #bb0000;
		padding:6upx 12upx;
		border-radius:12upx;
		font-size:20upx;
		opacity:0.5;

	}

	.m-title {
		background-color:#FFFFFF;
		padding:22upx 30upx;
		margin-top:20upx;
	}

</style>
