<template>
	<view>
		<view class="m-tab">
			<view class="m-navbar">
				<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="level1">
					{{sprintf(__('一级粉丝(%s)'), numFan1)}}
				</view>
				<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']" @click="level2">
					{{sprintf(__('二级粉丝(%s)'), numFan2)}}
				</view>
				<view :class="['m-navbar-item', tapindex==3?'m-navbar-item-on':'']" @click="level3" v-if="isDistLevel3">
					{{sprintf(__('三级粉丝(%s)'), numFan3)}}
				</view>
			</view>
		</view>

		<scroll-view class="m-scrollBox" scroll-y="true" @scrolltolower="scrollbottom" v-if="(UserFans.length>0)">
			<view class="m-panel-bd">
				<view v-for="(item, index) in UserFans"  :key="index" class="m-media-box m-media-box-appmsg">
					<view class="m-media-box-hd">
						<image lazy-load class="m-media-box-thumb" :src="(item.user_avatar)" />
					</view>
					<view class="m-media-box-bd">
						<label class="m-media-box-title">{{item.user_nickname}}</label><label class="m-media-box-level" v-if="item.user_level_name">{{item.user_level_name}}</label><label class="m-media-box-num">{{__('收益：')}}<text>{{__('￥')}}{{item.ugc_amount}}</text></label>
						<view class="m-media-box-info">
							<view class="m-media-box-info-meta m-tiem">{{item.user_time_str}}</view>
							<view class="m-media-box-info-meta m-num" v-if="item.ugc_level != 1">{{__('来源:')}}{{item.p_name || __('已注销')}}</view>

							<view class="m-media-box-info-meta m-num" v-if="false">LV{{item.ugc_level}}</view>
						</view>
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
		</scroll-view>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{__('赶快去圈粉吧')}}</text>
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
		data() {
			return {
				page: 1, tapindex: 1, ispage: !0, flag: !0, UserFans: [], numFan1: 0, numFan2: 0, numFan3: 0,
				isDistLevel3:true
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('我的粉丝')
			});

			this.setData({UserFans: []}), this.getFunlist();
			let that = this;

			// #ifdef MP-WEIXIN
			this.isDistLevel3 = false;
			// #endif


			// #ifdef H5
			if (this.$.isWeixin()) {
				this.isDistLevel3 = false;
			}
			// #endif
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			level1: function () {
				this.setData({tapindex: 1, UserFans: [], page: 1}), this.getFunlist()
			},
			level2: function () {
				this.setData({tapindex: 2, UserFans: [], page: 1}), this.getFunlist()
			},
			level3: function () {
				this.setData({tapindex: 3, UserFans: [], page: 1}), this.getFunlist()
			},

			getFunlist: function () {
				var params = {page: this.page, ugc_level: this.tapindex},
						that = this;
				that.$.request({
					url: this.Config.URL.fx.lists_commission,
					data: params,
					success: function (data, status, msg, code) {
						if (data.items.length > 0) {


							for (var r = 0; r < data.items.length; r++) {
								data.items[r]['user_time_str'] = that.$.datetimeFormatter(data.items[r]['user_time']);
							}

							if (data.page >= data.total) {
								that.setData({
									UserFans: that.UserFans.concat(data.items),
									flag: !1,
									ispage: !1
								});
							} else {
								that.setData({
									UserFans: that.UserFans.concat(data.items),
									flag: !0,
									ispage: !0
								})
							}

							that.setData({
								numFan1: data.user_fans.level_1,
								numFan2: data.user_fans.level_2,
								numFan3: data.user_fans.level_3,
							});

						} else {
							that.setData({flag: !1, ispage: !1})
						}
					}
				});

			},
			scrollbottom: function () {
				if (this.flag) {
					var e = this;
					e.setData({flag: !1}), clearTimeout(t);
					var t = setTimeout(function () {
						e.setData({page: parseInt(e.page) + 1}), e.getFunlist()
					}, 500)
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../styles/_variables";

	.m-panel-bd{background-color: #fff;}
	.m-media-box-num{float: right;font-size:28upx;}
	.m-media-box-num text{color:$default-skin-bg;}
	.m-scrollBox{position: absolute;top: 0;left: 0;width: 100%;height: 100%;padding-top:70upx;}
	.m-num{float: right;color: $default-skin-bg}
	.m-media-box-thumb{border-radius: 100%;}

	.m-tab{position: fixed;width: 100%;top: var(--window-top);z-index: 2;}
	.m-navbar-item {padding: 20upx 0;font-size: 24upx;}
	.m-navbar-item:after {border: none;}
	.m-navbar-item.m-navbar-item-on {background-color: #fff;color: $default-skin-bg;}
	.m-navbar-item.m-navbar-item-on::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6upx;border-bottom: 6upx solid $default-skin-bg;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}



	.m-media-box-info-meta{
		padding-right: 14upx;
	}

	.m-media-box-level{

		font-size: .45rem;
		line-height: .6rem;
		background-color: #ff6700;
		height: .6rem;
		padding: 0 .1rem;
		margin-left: .2rem;
		border-radius: .1rem;
		box-shadow: 1px 1px 1px rgba(0,0,0,.15);
		color:#fff;
	}
</style>

