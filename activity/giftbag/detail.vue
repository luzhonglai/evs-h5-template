<template>
	<view class="page">
		<block v-if="isdata">
			<view class="u-pa1 fix-titlenview-trans" >
				<view class="m-banner-ad">
					<swiper indicator-dots="true" autoplay="true" interval="3000" duration="300">
						<swiper-item>
							<image
								lazy-load
								class="slide-image"
								mode="aspectFill"
								:src="Info.activity_rule.giftbag_zu_image"
								:data-src="Info.activity_rule.giftbag_zu_image"
								@click="previewProductImg"
							/>
						</swiper-item>
					</swiper>
					<navigator v-if="Info.activity_rule.activity_video" :url="Info.activity_rule.activity_video" class="video">
						<image lazy-load src="/static/images/play.png" style="width:100upx;height:100upx"></image>
					</navigator>
				</view>

				<view class="m-activity-info">
					<view class="m-activity-title">
						<label>{{(Info.activity_rule.activity_bag_category)}}</label>
					</view>
					<view class="m-activity-tips">
						<label>{{(Info.activity_name)}}</label>
					</view>
					<view class="m-activity-price">
						<view>
							<label style="color:#c0a080;">{{ __('￥') }}{{ number_format(Info.play_amount, 2) }}</label>
							<label class="old-price" v-if="(Info.play_amount < Info.activity_rule.giftbag_amount)">{{ __('￥') }}{{ number_format(Info.activity_rule.giftbag_amount, 2) }}</label>
						</view>
						<!-- <view>
							<label class="m-imfo-sp-selext">
								<view class="u-cart-num">
									<view class="u-num-btn" @click.stop="sub">-</view>
									<input type="number" v-model="numval" @blur="writenum" />
									<view class="u-num-btn" @click.stop="add">+</view>
								</view>
							</label>
						</view> -->
					</view>
				</view>
				
				<view class="product-l">
					<navigator url="/activity/giftbag/list"
					 class="m-cell m-cell-access">
						<view class="m-cell-bd m-cell-primary">
							<p>{{__('礼包包含以下商品')}}</p>
						</view>
						<text class="ft-title">{{__('更多礼包')}}</text><text class="m-cell-ft"></text>
					</navigator>
					<scroll-view  class="scroll-view_H" scroll-x="true">
						<block v-if="(Info.item)">
							<view class="scroll-view-item_H" v-for="(item,index) in Info.item" :key="index" >
								<view>
									<view hover-class="none" :data-pid="(item.item_id)" :data-state="(item.product_state_id)" @click="gotoDetail">
										<view class="product-l-img">
											<image style="width:100%;height:100%" :src="item.product_image" />
										</view>
										
										<view class="product-l-price">
											<view class="product_name">
												<label>{{item.item_name}}</label>
											</view>
											<view class="m-project-tips">
												<label>{{(Info.product_tips)}}</label>
											</view>
											<view class="price-new" style="color:#c0a080;">
												<label>{{ __('￥') }}{{ number_format(item.item_unit_price, 2) }}</label>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<block v-else>
							<view class="m-nullpage-middle">
								<view class="m-null-tip">
									<text>{{ __('什么都没有！') }}</text>
								</view>
							</view>
						</block>
					</scroll-view>
				</view>
<!-- 
				<view class="m-cell m-cell-access " style="background-color:  #FFFFFF;;">
					<view class="m-info-sp">
						<label class="m-info-tip" style="float:left;">{{__('库存：')}}{{Info.activity_rule.giftbag_quantity}}</label>
						
						<label class="m-imfo-sp-selext" style="float:left;height: 48upx;margin-left: 30upx;">
							<view class="u-cart-num">
								<view class="u-num-btn" @click.stop="sub">-</view>
								<input type="number" v-model="numval" @blur="writenum" />
								<view class="u-num-btn" @click.stop="add">+</view>
							</view>
						</label>
						
					</view>
				</view> -->
				
				<view class="m-panel m-panel-access m-detail">
					<view class="m-tab">
						<view class="m-navbar">
							<view class="m-navbar-item m-navbar-item-on" v-if="(Info.activity_rule.activity_detail_intro)">
								{{__('活动详情')}}
							</view>
						
					
						</view>
					</view>
					<view class="m-RichText" v-if="Info.activity_rule.activity_detail_intro">
						<wxParse :content="Info.activity_rule.activity_detail_intro" />
					</view>
				
			
			
		
				</view>
				<view style="width:100%;height:100upx;"></view>
			</view>
			
			
			
			<view class="m-footer-btn m-fg-btn" >
				<view class="m-footer-btn-list" style="width:100%">
					<!-- <view class="m-footer-btn-item" style="width:92upx;">
						<view class="u-go-home1" @click="onShareBox">
							<view class="m-footer-btn-icon">
								<image src="../../static/images/share.png"/>
							</view>
							<text style="font-size: 20upx;">{{__('分享')}}</text>
						</view>
					</view> -->
					<block v-if="(Info.activity_state == 0)">
						<view class="m-footer-btn-main m-footer-desable" style="width: 100%;">
							{{__('活动未开启')}}
						</view>
					</block>
					<block v-else>
						<view class="m-footer-btn-main" style="width: 658upx;background:linear-gradient(to right, #dbc4aa, #ba9877);" @click="ckselectsp">
							{{__('加入购物车')}}
						</view>
						<view class="m-footer-btn-main m-footer-desable" style="width: 658upx;"  v-if="(Info.activity_rule.giftbag_quantity <= 0)">
							{{__('库存不足')}}
						</view>
						<view class="m-footer-btn-main" style="width: 658upx;background-color: #333959;" v-else @click="goCheckout">
							{{__('立即购买')}}
						</view>
					</block>
					
				</view>
						
						
			</view>
		</block>
		<view class="m-nullpage" v-else>
			<view class="m-nullpage-middle" v-if="loaded">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{ __('什么都没有！') }}</text>
				</view>
			</view>
			<view class="m-nullpage-middle" v-else><loading></loading></view>
		</view>

		<!-- #ifdef APP-PLUS -->
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #endif -->

		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->

		<!-- #ifndef APP-PLUS -->
		<share-box-mp
			:shareDataDefault="shareData"
			@cancelShare="cancelShare"
			@showCodeImg="showCodeImg"
			@shareQRCode="shareQRCode"
			@saveImg="saveImg"
			ref="shareBoxMp"
		></share-box-mp>
		<!-- #endif -->

		<mpvue-city-picker
			:themeColor="themeColor"
			ref="mpvueCityPicker"
			:pickerValueDefault="cityPickerValueDefault"
			@onCancel="onCancel"
			@onConfirm="onConfirm"
		></mpvue-city-picker>

		<!-- <quick-nav @onReturnTop="onReturnTop" @onShareBox="onShareBox" :isquicknav="isquicknav"></quick-nav> -->
	</view>
</template>

<script>
function getNowFormatDate() {
	var e = new Date(),
		t = '-',
		n = e.getMonth() + 1,
		r = e.getDate();
	n >= 1 && n <= 9 && (n = '0' + n), r >= 0 && r <= 9 && (r = '0' + r);
	var i = e.getFullYear() + t + n + t + r;
	return i;
}

import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue';

import wxParse from '@/components/u-parse/u-parse.vue';

import shareBoxMp from '../../components/share-box-mp.vue';
import shareBoxApp from '../../components/share-box-app.vue';
import shareBoxH5 from '../../components/share-box-h5.vue';

import quickNav from '../../components/quick-nav.vue';
import headerNavMenu from '../../components/header-nav-menu.vue';

import uniBadge from '../../components/uni-badge.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import loading from '@/components/loading.vue';

var intervalDate;
var intervalPt;
var intervalCt;
var intervalTimeAct;

import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			options: {},
			activity_id: 0,
			Info: {},
			loaded: !0,
			isdata: !1,
			
			numval: 1,
			stock: 1,
			inputval: 1,

			scposition: 0,
			old: {
				scposition: 0
			},

			shareData: {
				shareText: 'GDF商城系统，支持原生App、微信小程序，邀请你一起体验！',
				shareTitle: 'GDF商城系统，支持原生App、微信小程序，邀请你一起体验！',
				href: '',
				image: '',
				price: 0
			},

			cityPickerValueDefault: [0, 0, 0],
			themeColor: '#007AFF',
			product_freight_info: { content: '无货', district_info: '上海市/上海市', if_store: false },

			latitude: '',
			longitude: '',
			
			ispage: !0,
			
			uid: 0,

			isquicknav: !1
		};
	},

	components: {
		shareBoxMp,
		shareBoxApp,
		shareBoxH5,
		quickNav,
		uniBadge,
		mpvueCityPicker,
		wxParse,
		uniTag,
		loading,
		headerNavMenu
	},
	computed: {
		...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'cartNum'])
	},
	onLoad: function(options) {
		uni.setNavigationBarTitle({
			title: this.__('礼包详情')
		});

		var that = this;

		if (options.aid) {
			this.setData({
				activity_id: options.aid
			});
			that.InitData();
		}
		
		if(options.uid)
		{
			this.setData({
				uid: options.uid
			});
			
			if(this.hasLogin)
			{
				that.sharePoint()
			}
			
		}
	},

	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum']),
		InitData: function(options) {
			var that = this;
			var params = {
				activity_id: this.activity_id
			};

			that.$.request({
				url: that.Config.URL.user.giftbag_get,
				data: params,
				success: function(data, status, msg, code) {
					if (200 == status) {
						that.setData({
							isdata: !0,
							ispage: !0,
							loaded: !0,
							Info: data
						});
					} else {
						that.setData({ flag: !1, ispage: !0 });
					}
				}
			});
		},
		ckselectsp: function(e) {
			var that = this;
			
			var pat = [];
			
			if(that.Info.activity_rule.giftbag_quantity <= 0)
			{
				uni.showModal({
					title: '提示',
					content: '当前套餐库存不足，看看别的吧！',
					success: res => {
						uni.navigateTo({
							url:"/activity/giftbag/list"
						})
					}
				});
				return false;
			}	
			
			/*
			for(let i in that.Info.activity_rule.item_quantitys)
			{
				pat.push({item_id:i,quantity:that.Info.activity_rule.item_quantitys[i]})
			}
			*/
		   
		   var items = that.Info.activity_rule.discount;
		   

		   {
		   	for(var i in items){
		   		if(items[i]){
		   			var t = items[i]['item_id'] + '|' + items[i]['rate']
		   			pat.push(t)
		   		}
		   	}
		   }
		   			
		   var str = pat.join(',');
			
			var params = {
				cart_id: str,
				activity_id: this.activity_id
			};
			
			that.$.request({
				url: that.Config.URL.cart.batchadd,
				data: params,
				success: function(data, status, msg, code) {
					if (200 == status) {
						uni.showModal({
							title: '提示',
							content: '加入购物车成功！',
							success: res => {
								uni.switchTab({
									url:"../../pages/cart/cart"
								})
							}
						});
					} else {
						uni.showModal({
							title: '提示',
							content: msg,
							showCancel: false,
							success: res => {
							}
						});
					}
				}
			});
		},
		
		sharePoint: function() {
			var that = this;
			var params = {
				uid: this.uid
			};
	
			that.$.request({
				url: that.Config.URL.user.set_sharepoint,
				data: params,
				success: function(data, status, msg, code) {
					if (200 == status) {
						console.log('成功')
					} else {
						console.log('失败')
					}
				}
			});
		},
		
		gotoDetail: function(e) {
			console.log(e)
			var state =  e.currentTarget.dataset.state
			var pid =  e.currentTarget.dataset.pid
			
			if(state == this.StateCode.PRODUCT_STATE_OFF_THE_SHELF)
			{
				this.$.alert(this.__('此商品不可单独购买'))
			}
			else
			{
				this.$.navigateTo({
					url: "/pages/product/detail?pid=" + pid
				})
			}
		},
		
		goCheckout: function() {
			var that = this;
			//var items = that.Info.activity_rule.requirement.buy.item;
			var items = that.Info.activity_rule.discount;
			
			var pat = [];
			var par = [];
			
			/*
			for(let p in that.Info.activity_rule.item_quantitys)
			{
				par.push({[p]:that.Info.activity_rule.item_quantitys[p]})
			}
			*/
			
			if(false && par)
			{
				for(var i in items){
					if(items[i]){
						var t = items[i] + '|' + par[i][items[i]]
						pat.push(t)
					}
				}
			}
			else
			{
				for(var i in items){
					if(items[i]){
						var t = items[i]['item_id'] + '|' + items[i]['rate']
						pat.push(t)
					}
				}
			}
						
			var str = pat.join(',');

			that.$.navigateTo({
				url: "/pages/checkout/checkout?ifcart=0&cart_id="+str + "&quantity=" + that.numval + "&activity_id=" + that.activity_id
			})
			
		},
		sub: function() {
			this.unifiedNum(2)
		},
		add: function() {
			this.unifiedNum(1)
		},
		writenum: function(e) {
			this.setData({
				inputval: e.detail.value
			}), this.unifiedNum(3)
		},
		unifiedNum: function(e) {
			let that = this;
			var t = {
				value: parseInt(this.numval),
				stock: parseInt(this.Info.activity_rule.giftbag_quantity),
				inputval: parseInt(this.inputval)
			};
			if (t.stock <= 0) {
				that.$.alert(that.__('亲~商品没有库存啦！'));
				return
			}
			e == 1 ? t.value = t.value + 1 : e == 2 ? t.value = t.value - 1 : (t.value = t.inputval, this.setData({
				numval: t.inputval
			}));
			if (t.value > t.stock) {
				this.setData({
					numval: t.stock
				});
				return
			}
			if (t.value <= 0) {
				this.setData({
					numval: 1
				});
				return
			}
			this.setData({
				numval: t.value
			})
		},
		
		previewProductImg: function(e) {
			var that = this,
				n = [];
			
			n.push(this.Info.activity_rule.giftbag_zu_image);
			
		
			var i = e.target.dataset.src;
		
			that.$.previewImage({
				current: i,
				urls: n
			})
		},
		
		cancelShare: function(e) {
		},
		showCodeImg: function(e) {
		},
		shareQRCode: function(e) {
		},
		saveImg: function(e) {
		},
		
		onShareBox: function(e) {
			let that = this;
			var $href = that.$.sprintf('%s/tmpl/product_detail.html?item_id=%d&FX=%d', this.Config.WapSiteUrl, this.skuid, this.userInfo
					.user_id);
		
			$href = that.$.sprintf('%s/h5/activity/giftbag/detail?aid=%d&uid=%d', that.Config.SiteUrl, this.activity_id, this.userInfo.user_id);
			// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			// #ifdef APP-PLUS
		
			// #endif
		
			// #ifdef MP-WEIXIN
			$href = "/activity/giftbag/detail?aid=" + this.activity_id + "&uid=" + this.userInfo.user_id;
			// #endif
		
			this.setData({
				shareData: {
					shareTitle: this.Info.activity_name,
					shareText: this.Info.activity_title,
					href: $href,
					image: this.Info.activity_rule.giftbag_image,
					price: this.number_format(this.Info.activity_rule.giftbag_amount, 2)
				}
			});
		
			// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			// #ifdef APP-PLUS
			this.$refs.shareBoxApp.show();
			// #endif
		
			//海报
			if (e == 3)
			{
				// #ifndef APP-PLUS
				this.$refs.shareBoxMp.show();
				// #endif
			}
			else
			{
				// #ifdef H5
				if (that.$.ifUniApp())
				{
					this.$refs.shareBoxH5.show();
				}
				else
				{
					this.$refs.shareBoxMp.show();
				}
				// #endif
			}
		
		
		
		
		},
	}
};
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

.page-body {
	padding: 40upx;

	
	button {
		margin: 20upx 20upx;
	}

	.m-panel-sp-icon {
		position: absolute;
		right: 20upx;
		top: 10upx;
	}
}

.fix-titlenview-trans {
	background: #F5F6F7;
}

.m-banner-ad {
	width: 100%;
	height: 640upx;
	background: rgba(0, 0, 0, 0);
	opacity: 1;

	position: relative;
}

.m-banner-ad swiper {
	width: 100%;
	height: 100%;
}

.slide-image {
	width: 100%;
	height: 100%;
}

.m-activity-info {
	// width: 100%;
	height: 140upx;
	background: #FFFFFF;
	opacity: 1;
	padding: 16upx 24upx;
}

.m-panel {
	margin-top: 0;
}

	.m-activity-title {
		font-size: 30upx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 42upx;
		color: #002951;
		opacity: 1;

		overflow: hidden;
		text-overflow:ellipsis; 
		white-space: nowrap;

	}
	
	.m-activity-tips {
		font-size: 20upx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #002951;
		opacity: 0.6;

		overflow: hidden;
		text-overflow:ellipsis; 
		white-space: nowrap;

	}
	
	.m-activity-price {
		font-size: 34upx;
		font-family: Arial;
		font-weight: 400;
		line-height: 34upx;
		color: #FF4142;
		opacity: 1;
		margin-top: 12upx;
		display: flex;
		flex-direction:row;
		flex-wrap:nowrap;
		justify-content:space-between;

	}
	
	
		.product-l {
			// width: 710upx;
			height: 434upx;
			background: #FFFFFF;
			opacity: 1;
			border-radius: 8upx;
			margin:20upx;
			overflow:hidden;
			border-radius: 10upx;
			
	
		}
		
	.scroll-Y {
		height: 300upx;
	}
	
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		height: 344upx;
	}
	
	.scroll-view-item {
		height: 300upx;
		line-height: 300upx;
		text-align: center;
		font-size: 36upx;
	}
	
	.scroll-view-item_H {
		display: inline-block;
		width: 240upx;
		height: 344upx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 16upx;
		margin-right: 24upx;

	}
	
	.m-cell {
		padding: 20upx 20upx;
	}
	
	.m-cell-primary {
		font-size: 26upx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 36upx;
		color: #AF6419;
		opacity: 1;

	}
	
	.m-cell-access .m-cell-ft:after {
		border-color:#AF6419;
	}
	
	.ft-title {
		font-size: 22upx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 32upx;
		color: #AF6419;
		opacity: 1;
		margin-right: 10upx;

	}
	
	
	.product-l-img {
		width: 240upx;
		height: 240upx;
		background: rgba(0, 0, 0, 0);
		opacity: 1;
		border-radius: 16upx 16upx 0upx 0upx;

	}
	
	.product-l-price {
		   width:208upx;
		   height:88upx;
		   background:rgba(255,255,255,1);
		   padding:8upx 16upx;
	}
	
	.product_name {
		  font-size: 20upx;
		  font-family: PingFang SC;
		  font-weight: 400;
		  line-height: 28upx;
		  color: #002951;
		  opacity: 1;
		  

		   overflow: hidden;
		   text-overflow:ellipsis;
		   white-space: nowrap;
	}
	
	.m-project-tips {
		height: 18upx;
		font-size: 14upx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 18upx;
		color: #002951;
		opacity: 0.6;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		margin:4upx 0upx;

	}
	
	.price-new {
		font-size: 16upx;
		font-family: Arial;
		font-weight: 400;
		line-height: 34upx;
		color: #FF4142;
		opacity: 1;

	}
	
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		margin-left: 24upx;
	}
	
	.scroll-view-item {
		height: 300upx;
		line-height: 300upx;
		text-align: center;
		font-size: 36upx;
	}
	
	.scroll-view-item_H {
		display: inline-block;
		/* height: 260upx; */
		// line-height: 300upx;
		// text-align: center;
		font-size: 36upx;
	}
	
	.m-info-sp {
		width: 710upx;
		height: 48upx;
		background: #F5F6F7;
		opacity: 1;
		border-radius: 8upx;
		padding:0 

	}
	
	.u-cart-num {
		margin-top: 0upx;
		 // height: 100%;
		 line-height: 48upx;
		 
		width: 56px;
		height: 18px;




	
		 background: #FFFFFF;
		 border: 1px solid #F5F6F7;
		 opacity: 1;
		 border-radius: 2px;

	}
	
	.u-num-btn {
		background: #FFFFFF;
		opacity: 1;
		border-radius: 4upx;
		width: 22upx;
		height: 30upx;
		line-height: 1;
		
		border: 1px solid #F5F6F7;

	}
	
	.m-footer-btn-main {
		width: 658upx;
		height: 92upx;
		background: #DB384C;
		opacity: 1;
		line-height: 92upx;
		
	
		font-size: 30upx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		// letter-spacing: 40upx;
		opacity: 1;


	}
	
	.m-footer-btn-item {
		width: 92upx;
		height: 92upx;
	}
	
	/*底部按钮 start*/
	.m-footer-btn {
		height: 92upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: center;
		z-index: 3;
	}
	
	.m-footer-btn-list {
		width: 50%;
		height: 100%;
		position: relative;
		float: left;
		display: flex;
	}
	
	.m-footer-btn-list::before {
		content: ' ';
		position: absolute;
		left: 0;
		top: -2upx;
		right: 0;
		height: 2upx;
		border-bottom: 2upx solid #d5d5d5;
		color: #cccccc;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}
	
	.m-footer-btn-item {
		position: relative;
		float: left;
		width: 33.3333333333333%;
		font-size: 24upx;
		color: #888;
		line-height: 40upx;
		padding: 15upx 0;
		border-right: 1upx solid #d5d5d5;
		box-sizing: border-box;
	}
	
	.m-footer-btn-item::last-child {
		border: none;
	}
	
	.m-footer-btn-icon {
		width: 40upx;
		height: 40upx;
		margin: 0 auto;
		position: relative;
	}
	
	.m-footer-btn-item image {
		width: 40upx;
		height: 40upx;
	}
	
	.m-footer-btn-item contact-button {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		opacity: 0;
	}
	
	
	
	.m-footer-desable {
		-webkit-filter: grayscale(1);
		filter: grayscale(1);
	}
	
	.u-go-home1 {
		height: 100%;
	}
	
	.video {
		position: absolute;
		bottom: 40upx;
		left: 44%;
	}
	.m-tab {
		margin-top:6upx;
	}
	
	
	.m-navbar-item.m-navbar-item-on{
		background-color: #FFFFFF;
		text-align: center;
	}
	
	.old-price {
		    color: #888;
		    margin-left: 5px;
			text-decoration: line-through;
			font-size: 13px;
	}
	
	
	
	
	
	
	
	
	
	


/* share */
.textarea-wrp {
	padding: 0 20upx;
}

.page-section {
	margin-bottom: 20upx;
}

.textarea {
	border: 2upx solid #d8d8d8;
	padding: 10upx;
	height: 90upx;
	width: 690upx;
}

.uni-input {
	border: 2upx solid #d8d8d8;
	padding: 0 10upx;
	width: 690upx;
}

.m-detail {
	// padding:20upx;
	margin:20upx;
	background: #F5F6F7;
	border-radius: 20upx;
}

.m-panel:before {
	    border-top: 0px solid #E5E5E5;
}




.u-cart-num uni-input {
	width: 48upx;
	height: 36upx;
	font-size: 26upx;
}




   

   

</style>
