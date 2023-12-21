<template>
	<view class="page" v-if="loadPageFlag" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">
		<scroll-view scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom" @scrolltoupper="scrollView" @scroll="bindscroll">
			<status-bar :backgroundColor="BgConfig.BackgroundObj.bgColor"></status-bar>
			<view class='banner-nav' :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:'transparent')}">
				<view class='xx-box'>
					<navigator hover-class="none" class="xx" url='/member/member/message'>
						<image class='xx1' src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/tzxq_05.png'></image>
					</navigator>
				</view>
				<view class='input_box2' style='background: #f1f1f1;' v-if="NIndex">
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
			<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav" :loadPageFlag="loadPageFlag"></diy>
			<view class='box_title_box' v-for="(item, i) in MemberPostsList" :key="i">
				<view class='box_title'>
					<navigator hover-class="none" :url='"/community/community/userspace?uid=" + item.user_id'
							   style='position: relative;display: inline-block'>
						<view class='box_title_img'>
							<image class='box_title_image' :src="item.user_avatar"></image>
						</view>
						<view class='box_title_name'>{{item.user_nickname}}</view>
						<view class='box_title_name_time'>{{item.story_time_str}}</view>
					</navigator>
					<view v-if="item.story_is_top" class='box_title_guanzhu'>
						<view class='box_title_guanzhu_text'>{{__('置顶')}}</view>
					</view>
				</view>

				<navigator @tap="moNitor" hover-class="none" :url='"/community/community/video?id="+item.story_id' style='display: inline-block' v-if="item.story_type == 4">
					<view class='box_title_conton'>{{item.story_title}}</view>
					<view class='newsimg_box_img' v-if="item.story_file.length>0">
						<block v-for="(imgItem, j) in item.story_file" :key="j">
							<view class='newsimg_box_image3' :style='"background: url(" + imgItem + ") center no-repeat ;background-size:cover;"'></view>
						</block>
					</view>
				</navigator>

				<navigator @tap="moNitor" hover-class="none" :url='"/community/community/detail?id="+item.story_id' style='display: inline-block' v-if="item.story_type != 4">
					<view class='box_title_conton'>{{item.story_content}}</view>
					<view class='newsimg_box_img' v-if="item.story_file.length>0">
						<block v-for="(imgItem, j) in item.story_file" :key="j">
							<view class='newsimg_box_image3' :style='"background: url(" + imgItem + ") center no-repeat ;background-size:cover;"'></view>
						</block>
					</view>
				</navigator>
				<view class='pldz_box'>
					<view>
						<view class='rmtz_box_content_box_dz'>
							<image class='dz' src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/tzxq_03.png'></image>
							<span>{{item.story_brower_count}}</span></view>
						<view class='rmtz_box_content_box_pl'>
							<image class='pl' src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/tzxq_05.png'></image>
							<span style="font-size: 12px;color: #959593;">{{item.story_comment_count}}</span></view>
						<button hover-class='none' style='padding-left:22upx;' v-if="item.IsFabulous == 1"
								class='rmtz_box_content_box_pl' :data-story_id='item.story_id' open-type="getUserInfo" lang="zh_CN"
								@click="onUnLike">
							<image class='pl' src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/side1_03.png'></image>
							<span style="font-size:12px">{{item.story_like_count}}</span></button>
						<button hover-class='none' style='padding-left:22upx;' class='rmtz_box_content_box_pl' v-else
								:data-story_id='item.story_id' open-type="getUserInfo" lang="zh_CN" @click="onLike">
							<image class='pl' src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/side1_05.png'></image>
							<span style='font-size:12px;color:#959593'>{{item.story_like_count}}</span>
						</button>
					</view>
					<view class='rmtz_box_content_box_p11' v-if="false"><span>{{__('来自：')}}{{item.user_nickname}}</span></view>
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
		</scroll-view>
		<view class="u-top-default">
			<image @click="onPostStory" src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_post.png' class='quicknav'
					   style='position: fixed;right: 20rpx;bottom:220rpx'></image>
			<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_gotop.png'
				   :class='"quicknav " + (isquicknav?"":"hide")' @tap="returnTop"
				   style='position: fixed;right: 20rpx;top:82%'></image>
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
				page: 1,
				ispage: !0,
                flag:!0,
				w:0,
				chatUrl:"",
				MemberPostsList:[],
				NIndex:true,
				story_index:"",

				scposition: '',
				old: {
					scposition: 0
				},

				isClose:!0,
				is_loaded:!1,

				isquicknav: !1,
				opacity: 1,
				background: "f1f1f1",
				istop: !0
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			diy,
			statusBar
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('')
			});

			var that = this;

            that.$.showLoading();

			this.setData({
				options: options
			});

			var w = that.$.getSystemInfoSync().windowWidth;
			that.setData({
				w: w
			})

			//that.initData(false);
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;

			this.refresh || this.setData({
				refresh: !0
			})

			if (!that.is_loaded)
			{
				that.initData(false);
			}
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
			this.initData(true)
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {

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
				path: "/pages/index/index?uid=" + this.userInfo.user_id
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
		onPageScroll: function() {},

		methods: {
			...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),

			getPostsList: function () {
				let that = this;
				var params = {page: this.page, 'rand':1};

				that.$.request({
					url: this.Config.URL.sns.story_lists,
					data: params,
					success: function (data, status, msg, code) {
						if (data.items.length > 0) {
							for (var r = 0; r < data.items.length; r++) {
								data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
							}

							if (data.page >= data.total) {
								that.setData({
									MemberPostsList: that.MemberPostsList.concat(data.items),
									flag: !1,
									ispage: !1
								});
							} else {
								that.setData({
									MemberPostsList: that.MemberPostsList.concat(data.items),
									flag: !0,
									ispage: !0
								})
							}

						} else {
							that.setData({flag: !1, ispage: !1})
						}

						that.setData({is_loaded: !0})

						that.$.stopPullDownRefresh()
						that.$.hideLoading();
					}
				});
			},

			//初始化数据，获取店铺分类
			initData: function(force_refresh) {
				var that = this;

				that.getDivModel(force_refresh)


				let param = {}

				that.getPostsList()

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
									that.MemberPostsList[r]['story_like_count']++;
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
									that.MemberPostsList[r]['story_like_count']--;
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
			bindscroll: function (a) {
				//console.log(a.detail.scrollTop);

				0 != a.detail.scrollTop && wx.setStorage({
					key: "key",
					data: [a.detail.scrollTop]
				});

				100 < a.detail.scrollTop ? this.setData({
					opacity: 1,
					background: "f1f1f1",
					istop: !0
				}) : this.setData({
					opacity: 0,
					background: "fff",
					istop: !1
				});

				a.detail.scrollTop >= this.screenHeight ? this.setData({isquicknav: !0}) : this.setData({isquicknav: !1})
			},
			scrollView: function(e) {
			},
			scrollTop: function() {
			},
			scrolltoupper: function(t) {
				this.old.scposition = t.detail.scrollTop;
			},
			returnTop: function() {
				var that = this;

				// 解决view层不同步的问题
				that.setData({
					scposition: this.old.scposition
				})

				this.$nextTick(function() {
					that.setData({
						scposition: 0
					})
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

.wrap-box {
  position: relative;
  width: 750upx;
}

.box_title {
  /* height: 157upx; */
  position: relative;
  padding: 0 30upx;
}

.box_title_img {
  width: 75upx;
  height: 75upx;
  padding: 25upx 17upx 15upx 0upx;
  float: left;
  display: inline-block;
}

.box_title_image {
  width: 73upx;
  height: 73upx;
  border-radius: 100%;
  overflow: hidden;
}

.box_title_image2 {
  width: 53upx;
  height: 53upx;
  border-radius: 100%;
  border: 1upx solid #fff;
  overflow: hidden;
  margin: 17upx -5upx;
}

.box_title_name {
  min-width: 59px;
  line-height: 95upx;
  /* float: left; */
  font-size: 28upx;
  height: 112upx;
  color: #333;
  display: inline-block;
}

.box_title_name_time {
  position: absolute;
  top: 41upx;
  left: 93upx;
  min-width: 200upx;
  line-height: 95upx;
  /* float: left; */
  font-size: 24upx;
  color: #959593;
}

.box_title_guanzhu {
  display: inline-block;
  float: right;
}

.box_title_guanzhu_text {
  width: 118upx;
  text-align: right;
  color: #db384c;
  font-size: 28upx;
  line-height: 112upx;
  align-content: center;
  height: 112upx;
}

.box {
  /* float: left; */
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}

.box_text {
  font-size: 30upx;
  line-height: 55upx;
  box-sizing: border-box;
  position: relative;
  margin-top: 40upx;
  label {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}

.aaa {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  padding: 0 30upx 20upx 30upx;
  color: #606060;
}

.bbb {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  padding: 0 28upx;
}

.quanbu {
  color: #5f9ee3;
  font-size: 36upx;
  line-height: 100upx;
  padding: 0 28upx;
}

.time {
  color: #767676;
  font-size: 26upx;
  line-height: 100upx;
  padding: 0 30upx;
  height: 100upx;
}

.newsimg_box {}

.newsimg_box_img {
  padding: 0upx 24upx 20upx 24upx;
  display: flex;
}

.newsimg_box_image2 {
  width: 333upx;
  height: 333upx;
  padding: 0 14upx;
  /* float: left; */
}

.time_box {
  width: 532upx;
  height: 100upx;
  /* float: left */
}

.time_box_dz {
  width: 136upx;
  height: 100upx;
  line-height: 123upx;
  /* float: left */
}

.time_box_dz_img2 {
  width: 37upx;
  height: 40upx;
  margin-top: 17upx;
  margin-left: 20upx;
}

.time_box_dz_img {
  width: 37upx;
  height: 40upx;
  margin-top: 1upx;
  margin-left: 90upx;
}

.time_box_fx_img {
  width: 30upx;
  height: 35upx;
  margin-left: 65upx;
}

.box_box::before {
  content: " ";
  position: absolute;
  left: 28upx;
  top: 0;
  right: 28upx;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.box_title_guanzhu span {
  line-height: 156upx;
  font-size: 30upx;
  color: #ff6000;
}

.newsimg_box_image1 {
  width: 694upx;
  height: 342upx;
  padding: 0 14upx;
}

.m-orderlist {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.newsimg_box_image3 {
  width: 220upx;
  height: 220upx;
  margin: 0upx 7upx 0upx 8upx;
  display: inline-block;
}

.givealike_box {
  position: relative;
  margin: 0upx 28upx 0 28upx;
  display: flex;
}

.up {
  height: 22upx;
  width: 26upx;
  position: absolute;
  top: -21upx;
  left: 29upx;
}

.box_title_image2_box {
  /* max-width: 319upx; */
  width: 100%;
  display: flex;
  position: relative;
}

.dzys {
  width: 115upx;
  height: 61upx;
  border-left: 1upx solid #e8e8e8;
  margin-top: 37upx;
}

.dzys_img {
  width: 36upx;
  height: 40upx;
  margin: 8upx 0 0 40upx;
}

.commentaries {
  vertical-align: text-top;
  font-size: 30upx;
  border-left: 4upx solid #ed2b43;
  padding-left: 20upx;
  /* position: relative; */
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  span {
    /* position: absolute; */
    /* top: -2upx; */
  }
}

.commentaries_title {
  display: flex;
}

.touxiang_box2 {
  width: 60upx;
  height: 60upx;
  padding: 0upx 25upx 13upx 0upx;
  float: left;
}

.commentaries_title_img {
  width: 60upx;
  height: 60upx;
  padding: 29upx 25upx 29upx 25upx;
}

.commentaries_tzpl {
  width: 495upx;
  color: #ed2b43;
}

.commentaries_title_image {
  width: 60upx;
  height: 60upx;
  border-radius: 100%;
  overflow: hidden;
}

.commentaries_title_name {
  font-size: 30upx;
  margin: 30upx 25upx 25upx 0upx;
  padding-left: 28upx;
  width: 620upx;
  height: 66upx;
  background-color: #f4f8fb;
  line-height: 66upx;
}

.commentaries_text_box {
  margin: 0 25upx 0 110upx;
  clear: both;
}

.commentaries_text {
  font-size: 32upx;
  line-height: 50upx;
}

.commentaries_text_time {
  font-size: 26upx;
  padding: 29upx 0;
  color: #9aa1ae;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.commentaries_text_img {
  width: 24upx;
  height: 24upx;
  margin: 6upx 0 0 10upx;
}

.commentaries_text_revert_box {
  background-color: #f4f8fb;
  font-size: 32upx;
}

.commentaries_text_revert {
  padding: 13upx 0upx 0 28upx;
}

.commentaries_text_revert_name {
  color: #9aa1ae;
  font-size: 28upx;
}

.commentaries_text_revert_name_img {
  width: 24upx;
  height: 18upx;
}

.commentaries_text_revert_name_box {}

.allcommentaries {
  font-size: 30upx;
  color: #9aa1ae;
  text-align: center;
  margin: 75upx 0 100upx 0;
  span {
    padding: 17upx 40upx;
    border: 1upx solid #9aa1ae;
    border-radius: 40upx;
  }
}

.input_box {
  width: 100%;
  height: 87upx;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  z-index: 1;
  display: flex;
}

.input_box_img {
  width: 55upx;
  height: 55upx;
  padding: 16upx 15upx 16upx 23upx;
}

.input_box_image {
  width: 55upx;
  height: 55upx;
  border-radius: 100%;
  overflow: hidden;
}

.input_box_input {
  width: 587upx;
  height: 65upx;
  background-color: #f6f6f6;
  margin: 12upx 0upx 14upx 22upx;
  border-radius: 5upx;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  span {
    font-size: 30upx;
    margin-left: 20upx;
    color: #cbcbcb;
    line-height: 55upx;
  }
}

.input_box_fs {
  text-align: center;
  font-size: 30upx;
  color: #939ca9;
  line-height: 87upx;
  width: 113upx;
}

.tianchong {
  width: 100%;
  height: 210upx;
  background-color: #fff;
  line-height: 144upx;
  color: #9aa1ae;
  text-align: center;
  font-size: 30upx;
}

.input_box_input_input {
  width: 690upx;
  margin: 20upx 10upx;
  height: 160upx;
  background-color: #fff;
}

.hidden_box {
  background-color: #000;
  position: fixed;
  height: 100%;
  width: 100%;
  opacity: 0.6;
  z-index: 2;
}

.hidden_box_Input {
  width: 100%;
  height: 315upx;
  position: fixed;
  bottom: 0;
  z-index: 3;
  background-color: #fff;
}

.hidden_box_Input_box {
  margin: 20upx;
  border: 1upx solid #d9d9d9;
  height: 200upx;
  border-radius: 5upx;
}

.hidden_box_input {
  height: 160upx;
}

.hidden_box_Input_but {
  padding: 0 20upx;
}

.hidden_box_Input_button {
  padding: 10upx 20upx;
  background-color: #d9d9d9;
  font-size: 28upx;
  border-radius: 5upx;
  color: #fff;
  float: right;
}

.box_text_title {
  font-size: 32upx;
  padding: 30upx;
  color: #343434;
}

.commentaries_box {
  background-color: #fff;
  margin-top: 20upx;
}

.commodity_box {
  padding: 40upx 30upx;
  display: flex;
  position: relative;
}

.commodity_img {
  width: 36upx;
  height: 36upx;
  margin: 0;
  padding: 0;
}

.commodity_text {
  font-size: 30upx;
  margin-left: 17upx;
  color: #d23349;
}

.commodity_shop {
  margin: 0 30upx 0upx 30upx;
  background-color: #fbfbfb;
  width: 690upx;
  height: 160upx;
}

.commodity_shopImg {
  width: 160upx;
  height: 160upx;
  float: left;
}

.commodity_shop_name {
  padding: 22upx 40upx 0 21upx;
  font-size: 30upx;
  height: 74upx;
  float: left;
  width: 468upx;
}

.commodity_shop_nametext {
  color: #323232;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.commodity_shop_pic {
  font-size: 30upx;
  color: #d23349;
  padding: 0 0 0 21upx;
  height: 76upx;
  line-height: 76upx;
  float: left;
}

.commodity {
  position: relative;
  margin-bottom: 37upx;
  &::before {
    content: " ";
    position: absolute;
    left: 30upx;
    top: 0upx;
    right: 30upx;
    height: 1px;
    border-top: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}

.box_title_image2_box::before {
  content: " ";
  position: absolute;
  left: 0upx;
  top: 0upx;
  right: 0upx;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.box_title_image2_box_box {
  width: 571upx;
  display: flex;
  padding: 20upx 0;
  span {
    font-size: 28upx;
    color: #5c5c5c;
    line-height: 88upx;
    width: 120upx;
    text-align: right;
  }
}

.rmtz_box_title {
  width: 750upx;
  height: 86upx;
}

.rmtz_box {
  background-color: #f6f6f6;
  padding: 20upx 0;
}

.rmtz_box_content_box2 {
  width: 540upx;
  float: left;
}

.rmtz_box_content_img {
  width: 149upx;
  height: 149upx;
  float: right;
}

.rmtz_box_content_Img {
  width: 149upx;
  height: 149upx;
}

.rmtz_box_content_box {
  background-color: #fff;
  padding: 10upx 23upx;
  height: 150upx;
  position: relative;
}

.rmtz_box_content_box_text {
  width: 540upx;
  float: left;
  font-size: 30upx;
  padding-top: 15upx;
  height: 101upx;
}

.pldz_box {
  float: right;
  color: #959593;
  font-size: 24upx;
  height: 32upx;
  padding: 30upx;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.dz {
  width: 30upx;
  height: 24upx;
  vertical-align: text-top;
}

.pl {
  width: 30upx;
  height: 30upx;
  vertical-align: text-top;
}

.rmtz_box_content_box_dz {
  float: left;
  padding-right: 20upx;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
	line-height: 1.8;
  span {
    padding: 0 10upx;
	  font-size: 24rpx;
  }
}

.rmtz_box_content_box_pl {
  span {
    padding: 0 10upx;
  	font-size: 24rpx;
	  /*
    margin-top: 0;
    /*line-height: 32upx;*/
  }
  float: left;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding-left: 0px;
  padding-right: 0px;

  background-color: #fff;
	line-height: 1.8;


	-webkit-box-align: center;
	-webkit-align-items: center;
	align-items: center;
}

.rmtz_box_content_box::before {
  content: " ";
  position: absolute;
  left: 30upx;
  top: 168upx;
  right: 0upx;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.commentaries2 {
  padding: 22upx 30upx;
  position: relative;
}

.right {
  width: 20upx;
  height: 27upx;
  float: right;
}

.right2 {
  width: 20upx;
  height: 27upx;
}

.commentaries_title_box_box {
  margin: 25upx 0 0 0;
}

.commentaries2::before {
  content: " ";
  position: absolute;
  left: 30upx;
  top: 83upx;
  right: 0upx;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.touxiang_box {
  height: 86upx;
  padding: 0 25upx;
}

.name_box3 {
  height: 74upx;
  width: 490upx;
  line-height: 66upx;
  float: left;
  font-size: 30upx;
}

.name_box2 {
  height: 40upx;
  width: 615upx;
  float: left;
  font-size: 30upx;
}

.conton_box2 {
  width: 615upx;
  float: left;
  font-size: 32upx;
  line-height: 45upx;
  padding: 20upx 0;
}

.conton_box {
  padding: 10upx 28upx 0 0;
  font-size: 30upx;
}

.commentaries_text_time_img {
  width: 30upx;
  height: 33upx;
  vertical-align: text-top;
}

.commentaries_text_time_Img {
  margin-left: 13upx;
  margin-right: 30upx;
  color: #000;
  font-size: 30upx;
}

.commentaries_text_time_tome {
  width: 410upx;
}

.time_a {
  font-size: 40upx;
  font-weight: bold;
  color: #000;
  position: relative;
  display: inline-block;
}

.hidden_time_a {
  width: 244upx;
  height: 68upx;
  position: absolute;
  background: url(http://bbcfile.kukeduo.cn//ad001/20171114/813c794a-3122-406c-8a3d-19879fe382aa.png) center no-repeat;
  background-size: 100%;
  right: 42upx;
}

.zghf {
  clear: both;
  font-size: 30upx;
  margin: 0upx 0upx 0upx 110upx;
  padding-left: 28upx;
  width: 620upx;
  height: 66upx;
  background-color: #f4f8fb;
  line-height: 66upx;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.zghf_lanse {
  color: #446fcd;
}

.hidden_time_b {
  font-size: 28upx;
  color: #fff;
  border-right: 1upx solid #fff;
  line-height: 33upx;
  height: 30upx;
  margin: 19upx 0;
  width: 50%;
  text-align: center;
  display: inline-block;
}

.hidden_time_c {
  font-size: 28upx;
  color: #fff;
  line-height: 33upx;
  height: 30upx;
  margin: 19upx 0;
  width: 44%;
  text-align: center;
  display: inline-block;
}

.xiepinglun {
  width: 40upx;
  height: 40upx;
  text-align: center;
  vertical-align: text-top;
  margin-left: 15upx;
}

.box_title_conton {
  padding: 8upx 30upx 30upx;
  font-size: 30upx;
  /*line-height: 53upx;*/
  width: 690upx;
  /*height: 40upx*/;

  height: 48upx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.u_top {
  width: 80upx;
  height: 80upx;
}

.box_title_box {
  position: relative;
  z-index: 1;
  clear: both;
}

.rmtz_box_content_box_p11 {
  width: 334upx;
  text-align: right;
  color: #959593;

	height: 48upx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.box_title_box::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.u-view, .u_top {
  border: none;
}

.u-back2 {
  width: 80upx;
  height: 80upx;
  line-height: 80upx;
  border-radius: 100%;
  overflow: hidden;
  text-align: center;
  font-size: 32upx;
}

.u-view2 {
  width: 80upx;
  height: 80upx;
  line-height: 80upx;
  margin: 10upx 0;
  border-radius: 100%;
  overflow: hidden;
  text-align: center;
}

.formButtom {
  width: 100% !important;
}

.titile_top {
  width: 100%;
  background-color: #fff;
  position: fixed;
  height: 90upx;
  z-index: 9;
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
