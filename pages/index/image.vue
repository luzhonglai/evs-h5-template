<template>
	<view class="page" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">
		<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
		<view class='banner-nav' :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:'transparent')}">
			<view class='xx-box' style="position: relative;">
				<navigator hover-class="none" class="xx" url='/member/member/message'>
					<view style="position: absolute;right: 26rpx;top:10rpx">
						<uni-badge :text="newMsgNum" type="red" class="badge"></uni-badge>
					</view>
					<image class='xx1' src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/tzxq_05.png'></image>
				</navigator>
			</view>
			<view class='input_box2' v-if="NIndex">
				<uni-icons class='iconfont icon-sousuo-sousuo' style='font-size:70upx;color:#959593' @tap='searchinput'/>
				<input v-model="story_index" class="input_box2_input" :placeholder="__('搜索您想看的内容')"
					   placeholder-style="font-size:30upx;color:#959593;line-height:54upx"
					   confirm-type="done"  @confirm="searchinput"/></view>
			<view class='sq_0-box'>
				<navigator hover-class="none" :url="'/community/community/userspace?uid=' + userInfo.user_id"
						   :class="'sq_0 ' + (istop==true?'border22':'')">
					<image lazy-load  class='sq_1'  :src="(userInfo.user_avatar)" mode="scaleToFill" />
				</navigator>
			</view>
		</view>

		<view   style="height: 88upx;" v-if="false"></view>

		<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId"  :PageNav="PageNav" :loadPageFlag="loadPageFlag"></diy>

		<WaterfallsFlow :wfList='MemberPostsList' @itemTap="choose" />

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

		<view class="u-top">
			<movable-area class="movableArea">
				<movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
					<image @click="onPostStory" src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_post.png' class='quicknav'></image>
					<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_gotop.png' :class='(isquicknav?"quicknav":"hide")' @tap="returnTop"></image>
			    </movable-view>
		    </movable-area>
		</view>
	</view>
</template>

<script>
	import diy from '../../components/themes/diy.vue'
	import dateUtil from "../../helpers/util_date";
	import statusBar from '../../components/status-bar.vue'
	import uniBadge from '@/components/uni-badge.vue';

	// 瀑布流组件

	import WaterfallsFlow from '../../components/WaterfallsFlow/WaterfallsFlow.vue'

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
				ispage: !0,
				flag:!0,
				w:0,
				chatUrl:"",
				MemberPostsList:[],
				NIndex:true,
				story_index:"",
				scposition: -1,
				old: {
					scposition: 0
				},
				firstRefresh: true,

				isClose:!0,
				is_loaded:!1,

				isquicknav: !1,
				opacity: 1,
				background: "f1f1f1",
				istop: !0,
				initX: '690',
				initY: '1336',
				page: 1,
				loading: true,
				screenHeight: 0
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum']),
		components: {
			diy,
			statusBar,
			WaterfallsFlow,
			uniBadge
		},
		mounted() {
			let view = uni.createSelectorQuery().in(this).select(".movableArea");
			let that = this;

			view.fields({
			  size: true,
			  scrollOffset: true
			}, data => {
				if (data) {
					that.setData({
						initX: data.width,
						initY: data.height - 100,
					});
				}
			}).exec();
		},


		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('')
			});

			var that = this;

			//that.$.showLoading();

			this.setData({
				options: options
			});

			var w = that.$.getSystemInfoSync().windowWidth;

			that.$.getSystemInfo({
			    success: function (t) {
			        that.setData({screenHeight: t.screenHeight})
			    }
			});

			that.setData({
				w: w
			})
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;

			this.refresh || this.setData({
				refresh: !0
			})

		},

		onReady() {
			let that = this;
			setTimeout(() => {
				if (!that.is_loaded)
				{
					that.initData(false);
				}
			}, 100)
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// 离开页面，注销事件
			var that = this
			this.notice.removeNotification("RefreshProduct", that);
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			//this.getDivModel(true)
			this.initData(true)
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			if (this.flag) {
				var that = this;
				that.setData({flag: !1});
				clearTimeout(t);

				var t = setTimeout(function () {
					that.setData({page: parseInt(that.page) + 1});
					that.getPostsList()
				}, 500)
			}
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif

			return {
				title: this.ShareTitle,
				imageUrl: this.ShareImg,
				path: "/pages/index/image?uid=" + this.userInfo.user_id
			}
		},

		/**
		 * 用户点击右上角分享朋友圈
		 */
		onShareTimeline: function () {
			return {
				title: this.ShareTitle,
				query: {
					uid: this.userInfo.user_id
				},
				imageUrl: this.ShareImg,
			}
		},
		/**
		 * 页面滚动触发事件的处理函数
		 */
		onPageScroll: function(e) {
			this.scroll(e)
		},

		methods: {
			...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),


			// 选中
			choose(item) {
				// item 返回选中 JSON 对象
				//console.log(item)

				let url = "/community/community/detail?id=" + item.story_id;

				if (item.story_type == 4)
				{
					url = "/community/community/video?id=" + item.story_id;
				}

				this.$.gopage(url);
			},

			getPostsList: function (force_refresh) {
				let that = this;
				var params = {page: this.page, 'rand':1};

				that.$.request({
					url: this.Config.URL.sns.story_lists,
					data: params,
					loading: false,
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
								if(that.firstRefresh){
									that.setData({
										MemberPostsList: tmp,
										flag: !1,
										ispage: !1
									});
									that.firstRefresh = false;
								}
							} else {
								that.setData({
									MemberPostsList: tmp,
									flag: !0,
									ispage: !0
								})
							}

							//that.$forceUpdate() //二维数组，开启强制渲染

						} else {
							that.setData({flag: !1, ispage: !1})
						}

						that.setData({is_loaded: !0})

						that.$.stopPullDownRefresh()
						//that.$.hideLoading();
					}
				});
			},
			doNothing: function() {

			},

			//初始化数据，获取店铺分类
			initData: function(force_refresh) {
				var that = this;

				that.getDivModel(force_refresh)


				let param = {}

				that.getPostsList(force_refresh)


			},
			moNitor: function () {
				this.setData({isClose: !1})
			},
			onLike: function (a) {
				let that = this;
				that.forceUserInfo(function(user) {
					that.dianzan(a.currentTarget.dataset.story_id)
				});
			},
			dianzan: function (story_id) {
				var that = this, params = {
					story_id: story_id
				};

				that.$.request({
					url: this.Config.URL.sns.story_like_add,
					data: params,
					success: function (data, status, msg, code) {
						if (200 == status) {
							//that.getPostsList()

							//修正当前记录数据
							for (var r = 0; r < that.MemberPostsList.length; r++) {
								if (story_id == that.MemberPostsList[r]['story_id'])
								{
									that.MemberPostsList[r]['IsFabulous'] = 1;
								}
							}
						} else {
						}
					}
				});
			},
			onUnLike: function (a) {
				let that = this;
				that.forceUserInfo(function(user) {
					that.canceldianzan(a.currentTarget.dataset.story_id)
				});
			},
			canceldianzan: function (story_id) {
				var that = this, params = {
					story_id: story_id
				};

				that.$.request({
					url: this.Config.URL.sns.story_like_remove,
					data: params,
					success: function (data, status, msg, code) {
						if (200 == status) {
							//修正当前记录数据
							for (var r = 0; r < that.MemberPostsList.length; r++) {
								if (story_id == that.MemberPostsList[r]['story_id'])
								{
									that.MemberPostsList[r]['IsFabulous'] = 0;
								}
							}
						} else {
						}
					}
				});
			},

			onPostStory: function (a) {
				let that = this;
				that.forceUserInfo(function(user) {
					that.$.navigateTo({url: "/community/community/post"})
				})
			},

			//读取diy内容
			getDivModel: function(force_refresh) {
				var that = this,
						params = {page_type:'page_sns'};

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

						if (typeof data.page_loaded != 'undefined' && data.page_loaded)
						{
							that.setData({
								loadPageFlag: true
							});

							let page_code = that.$.parseJSON(data.page_code);

							that.setData({
								pageId: data.page_id,
								PageContent: page_code,
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
						else
						{
							that.setData({
								loadPageFlag: false
							});
						}
					}
				});
			},
			searchinput: function (a) {
				wx.navigateTo({
					url: "/community/community/lists?story_index=" + this.story_index,
					success: function (a) {
					},
					fail: function (a) {
					},
					complete: function (a) {
					}
				}), this.setData({story_index: ""})
			},

			scroll: function (t) {
				let that = this;
				that.old.scposition = t.scrollTop;

				if (100 < t.scrollTop) {
					that.setData({opacity: 1, background: "f8f8f8"});
				} else {
					that.setData({
					    opacity: 0,
					    background: "fff"
					})
				}

				if (t.scrollTop >= this.screenHeight) {
					this.setData({isquicknav: !0})
				} else {
					this.setData({isquicknav: !1})
				}

			},

			scrollbottom: function () {
				if (this.flag) {
					var that = this;
					that.setData({flag: !1});
					clearTimeout(t);

					var t = setTimeout(function () {
						that.setData({page: parseInt(that.page) + 1});
						that.getPostsList()
					}, 500)
				}
			},
			scrollView: function(e) {
			},
			scrollTop: function() {
			},
			scrolltoupper: function(t) {
				this.old.scposition = t.detail.scrollTop;
			},
			returnTop: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		}
	};
</script>


<style lang="scss">
	@import "../../styles/_variables";

	@import '../../styles/layout.scss';


	send-message button {
		display: inline-block;
		width: 100%;
		height: 100%;
		float: left;
	}

	page {
		background-color: #fff;
	}


	.banner-nav {
		/* position: absolute; */
		width: 100%;
		height: 88upx;
		z-index: 999;
		display: flex;
		align-items: center;
		/* justify-content: center; */
		justify-content: space-around;
		background-color: rgba(0, 0, 0, 0);
	}

	.xx-box {
		/* margin-top: 20upx; margin-left: 22upx; */
		width: 50upx;
		height: 50upx;
	}

	.xx {
		/* position: fixed;*/
		/* top: 20upx; left: 22upx; */
		width: 50upx;
		height: 50upx;
		z-index: 999;
		border-radius: 100%;
		opacity: 0.8;
		background-color: #fafafa;
		border: 1upx solid #fafafa;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.xx1 {
		width: 35upx;
		height: 35upx;
		margin: 9upx;
	}

	.input_box2 {
		/* position: fixed;*/
		/* top: 20upx; left: 95upx; */
		width: 560upx;
		height: 54upx;
		z-index: 99;
		border-radius: 35upx;
		opacity: 0.8;
		display: flex;
		align-items: center;
	}

	.input_box2_input {
		width: 400upx;
		font-size: 24upx;
	}

	.sq_0 {
		width: 54upx;
		height: 54upx;
		/* top: 20upx; right: 22upx; */
		z-index: 99;
		border-radius: 100%;
		overflow: hidden;
	}

	.sq_1 {
		width: 50upx;
		height: 50upx;

		border-radius: 120upx;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);
	}

	.border {
		border: 1upx solid #d9d9d9;
	}

	.border1 {
		border-bottom: 1upx solid #fafafa;
	}

	.border22 {
		/* border: 1upx solid #d9d9d9; */
	}


</style>
