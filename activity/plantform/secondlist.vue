<template>
	<view v-if="loadPageFlag" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">
		<view>
			<view :style="'background-color: ' + PageNav.window.navigationBarBackgroundColor + ';padding-bottom: 20rpx;'">
				<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft" :scroll-into-view="viewIndex" :style="'border-bottom:0px;height: 140rpx;'">
					<view v-for="(tab, index) in tabBars" :key="tab.id"  class="swiper-tab-list time-block" :class="tabIndex==index ? 'active' : ''"
					 :id="'tab_' + tab.pa_id" :data-current="index" :data-pa_id="tab.pa_id" :data-pa_state="tab.pa_state"
					 :data-pa_starttime="tab.pa_starttime" :data-pa_endtime="tab.pa_endtime" @tap="tapTab" style="width: 20%;text-align: center;">
						<view class="box-item" v-if="tab.pa_state == 1">
							<text class="time time-hl">{{tab.pa_name}}</text>
							<view class="text text-hl-box">
								<text class="text text-hl">{{__('抢购中')}}</text>
							</view>
						</view>
						<view class="box-item" v-else-if="tab.pa_state == 3">
							<text class="time">{{tab.pa_name}}</text>
							<view class="text">
								<text class="text">{{__('已结束')}}</text>
							</view>
						</view>
						<view class="box-item" v-else-if="tab.pa_state == 2">
							<text class="time">{{tab.pa_name}}</text>
							<view class="text">
								<text class="text">{{__('即将开始')}}</text>
							</view>
						</view>
						<view class="box-item" v-else :data-pa_id="tab.pa_id">
							<text class="time">{{tab.pa_name}}</text>
							<view class="text">
								<text class="text">{{__('已开抢')}}</text>
							</view>
						</view>
					</view>
				</scroll-view>

				<view class="time-current-box">
					<actibity-countdown :timer="(pa_endtime)" :Type="1" v-if="pa_state == 1 || pa_state == 4"></actibity-countdown>
					<actibity-countdown :timer="(pa_starttime)" :Type="0" v-else-if="pa_state == 2"></actibity-countdown>
					<text v-else>{{__('已结束')}}</text>
				</view>
			</view>

			<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav" :loadPageFlag="loadPageFlag"></diy>

			<!--
			<view style="background-color: #F7F7F7;">
				<view class="for-you-remmcond">
					<label class="point">·</label><label class="pointd">·</label><label class="point">·</label>
					<text class="you-remmcond">为你推荐</text>
					<label class="point">·</label><label class="pointd">·</label><label class="point">·</label>
				</view>
				<view v-for="(item, i) in pdlist" :key="i" >
					<view class="product-item" v-if="i==0" :data-item_id="item.item_id" @click="gotopage">

						<image class="product-item-img" lazy-load :src="(item.ProductPic)" v-if="item.ProductPic" />

						<text class="product-item-name" style="text-align: left;" v-if="item.SalesName">
							{{item.SalesName}}
						</text>

						<view class="product-item-market" style="text-align: left;padding-top: 90rpx;padding-left:300rpx;" v-if="item.MarketPrice">
							市场价：{{item.MarketPrice}}
						</view>

						<view class="product-item-unit" style="text-align: left;padding-left:300rpx">
							{{__('￥')}}{{item.ItemSalePrice}}

							<text class="buy" style="float: right;" v-if="item.item_quantity != 0 && pa_state == 1" :data-item_id="item.item_id"
							 :data-item_name="item.SalesName" @click.stop="buynow">立即购买</text>
							<text class="buy" style="float: right;" v-else-if="item.item_quantity != 0 && pa_state == 2">{{__('即将开始')}}</text>
							<text class="buy" style="float: right;" v-else>已售完</text>

						</view>


					</view>
					<view class="product-item" style="margin-top: 20rpx;" v-else :data-item_id="item.item_id" @click="gotopage">

						<image class="product-item-img" lazy-load :src="(item.ProductPic)" v-if="item.ProductPic" />

						<text class="product-item-name" style="text-align: left;" v-if="item.SalesName">
							{{item.SalesName}}
						</text>

						<view class="product-item-market" style="text-align: left;padding-top: 90rpx;padding-left:300rpx;" v-if="item.MarketPrice">
							市场价：{{item.MarketPrice}}
						</view>

						<view class="product-item-unit" style="text-align: left;padding-left:300rpx">
							{{__('￥')}}{{item.ItemSalePrice}}

							<text class="buy" style="float: right;" v-if="item.item_quantity != 0 && pa_state == 1" :data-item_id="item.item_id"
							 :data-item_name="item.SalesName" @click.stop="buynow">立即购买</text>
							<text class="buy" style="float: right;" v-else-if="pa_state == 2">{{__('即将开始')}}</text>
							<text class="buy" style="float: right;" v-else-if="item.item_quantity == 0">已售完</text>
							<text class="buy" style="float: right;" v-else :data-item_id="item.item_id" :data-item_name="item.SalesName"
							 @click.stop="buynow">立即购买</text>
						</view>
					</view>
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
			</view>
			-->

			<guess-you-like ref="guessYouLike" :options="{pa_id:pa_id}" :isShowFilter='true' :isFilterTop0="true" v-if="pa_id>0"></guess-you-like>
		</view>
	</view>
</template>

<script>
	import diy from '../../components/themes/diy.vue';
	import uniTag from '../../components/uni-tag/uni-tag.vue';
	import actibityCountdown from '../../components/actibity-countdown.vue';
	import guessYouLike from '@/components/guess-you-like.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				options: {},

				pageId: '',
				PageNav:{window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}},
				loadPageFlag: false,
				PageContent: [],
				BgConfig: {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}},
				ShareImg: "",
				ShareTitle: "",

				tabBars: [],
				scrollLeft: 0,
				tabIndex: 0,
				viewIndex: '',
				pa_id: 0,
				pa_starttime: 0,
				pa_endtime: 0,
				pa_state: 0,
			};
		},

		components: {
			uniTag,
			diy,
			actibityCountdown,
			guessYouLike
		},

		computed: mapState([
			'Config',
			'StateCode',
			'notice',
			'plantformInfo',
			'shopInfo',
			'userInfo',
			'hasLogin'
		]),
		onLoad(options) {
			var that = this;
			this.setData({
				options: options
			});

			that.$.setNavigationBarTitle({
				title: options.pname || options.cname || that.__('限时秒杀')
			});

			that.getDivModel(false);

			that.$.request({
				url: this.Config.URL.product.list_times,
				success: function(data, status, msg, code) {
					if (status == 200) {

						that.setData({
							tabBars: data,
						})
						for (var j = 0, lenJ = data.length; j < lenJ; ++j) {

							if (data[j].pa_state == 1) {
								that.setData({
									pa_id:data[j].pa_id,
									pa_starttime: data[j].pa_starttime,
									pa_endtime: data[j].pa_endtime,
									pa_state: data[j].pa_state,
									tabIndex: j
								});

								that.viewIndex = "";
								//设置viewIndex值，使聊天滚动到底部
								that.$nextTick(() => {
									that.viewIndex = "tab_" + data[j].pa_id;
								})

								break;
							}
						}
					}
				}
			});
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.$refs.guessYouLike.scrollbottom();
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			async tapTab(e) { //点击tab-bar
				let tabIndex = parseInt(e.currentTarget.dataset.current);
				this.tabIndex = tabIndex;

				this.setData({
					pa_id:e.currentTarget.dataset.pa_id,
					pa_starttime: e.currentTarget.dataset.pa_starttime,
					pa_endtime: e.currentTarget.dataset.pa_endtime,
					pa_state: e.currentTarget.dataset.pa_state
				})
			},

			//读取diy内容
			getDivModel: function(force_refresh) {
				var that = this,
					params = {page_type:'page_secondkill'};

					let site_id = that.$.getStorageSync('site_id');

					if (site_id)
					{
						params['site_id'] = site_id;
					}


				that.$.request({
					url: that.Config.URL.index_app,
					data: params,
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
							backgroundColor: that.PageNav.window.navigationBarBackgroundColor
						})

						if (data.page_name)
						{
							that.$.setNavigationBarTitle({
								title: data.page_name
							});
						}

						if (that.hasLogin && data.im_enable)
						{

							var perm_id = that.$.getStorageSync('uid');
							var perm_key = that.$.getStorageSync('ukey');

							let chat_url = that.$.sprintf(
									"%s/wap/im.html?from=app&item_id=%s&user_other_id=%s&puid=%s&name=%s&avatar=%s&uid=%s&ukey=%s", that.Config.fileBasePath,
									'', data.im_user_id, data.puid, encodeURIComponent('管理员'), encodeURIComponent(that.Config.SiteLogo), perm_id, encodeURIComponent(perm_key))

							that.setData({
								chatUrl: chat_url
							});
						}
					}
				});

			}
		}
	};
</script>


<style lang="scss">
	@import '../../styles/_variables.scss';
	@import '../../styles/layout.scss';

	.time-block {
		.time {
			width: 74rpx;
			height: 21rpx;
			line-height: 28rpx;
			font-size: 30rpx;
			font-family: Helvetica;
			font-weight: 400;
			color: rgba(255, 140, 151, 1);
		}

		.box-item
		{
			height: 140rpx;
			line-height: 70rpx;
		}

		.time-hl {
			font-weight: bold;
			/*color: rgba(255, 255, 255, 1);*/
		}

		.text {
			height: 23rpx;
			line-height: 23rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(255, 140, 151, 1);
			margin: 0 auto;
		}

		.text-hl-box {
			width: 102rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 18rpx;
			margin: 0 auto;
			padding:4rpx;
		}

		.text-hl {
			color: rgba(231, 34, 52, 1);
		}
	}

	.uni-swiper-tab .swiper-tab-list.active .text{
		font-size: 24rpx;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
	}

	.uni-swiper-tab .swiper-tab-list.active .text-hl{
		color: rgba(231, 34, 52, 1);
	}

	.uni-swiper-tab .swiper-tab-list.active .time{

		color: rgba(255, 255, 255, 1);
	}



	.time-current-box {
		width: 710rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 8rpx;
		margin: 0 auto;
		text-align: center;

	}

	.for-you-remmcond {
		width: 710rpx;
		height: 100rpx;
		background: #FFFFFF;
		border-radius: 8rpx 8rpx 0rpx 0rpx;
		text-align: center;
		margin: 0 auto;
		padding-top: 20rpx;
		margin-top: 20rpx;
	}

	.you-remmcond {
		width: 125rpx;
		height: 31rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
	}

	.point {
		width: 6rpx;
		height: 6rpx;
		color: #FF8691;
		// background: #FF8691;
		border-radius: 50%;
	}

	.pointd {
		width: 6rpx;
		height: 6rpx;
		color: #E72234;
		// background: #E72234;
		border-radius: 50%;
	}

	.product-item {
		width: 710rpx;
		height: 300rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 8rpx 8rpx;
		text-align: center;
		margin: 0 auto;
	}

	.product-item-img {
		width: 260rpx;
		height: 260rpx;
		border-radius: 8px;
		float: left;
	}

	.product-item-name {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		padding-left: 40rpx;
		padding-top: 40rpx;
	}

	.product-item-market {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;

	}

	.product-item-unit {
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FF5A00;
	}

	.buy {
		width: 140rpx;
		height: 52rpx;
		background: linear-gradient(90deg, #EF5967, #D80F22);
		border-radius: 26rpx;
		color: #FFFFFF;
		text-align: center;
		padding-bottom: 10rpx;
	}


.u-pa .m-tab {
    top: 0;
}

.filter-box {
    top: 0;
}
</style>
