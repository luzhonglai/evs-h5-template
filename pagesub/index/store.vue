<template name="commonTPL">
	<view class="page">
		<view>
			<view class="m-banner" v-if="loadStoreInfoComplete">
				<image :src="(store_info.BackGroundPath)" />
				<view class="m-content-box">
				</view>
				<view class="m-logo">
					<image :src="(store_info.WapLogoPath)" />
				</view>
				<view class="m-shopinfo">
					<label style="font-size: 36upx;">{{store_info.store_name}}</label>
					<label class="iconfont icon-qijiandian" v-if="false"></label>
					<label class="service-star-box" v-if="store_info.store_star_num>0">
						{{__('综合体验')}}
						<view class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]" :key="ii">
							<label
								:class="['iconfont',  'icon-start', (itemIndex<=(store_info.store_star_num))?'sel':'']"></label>
						</view>
					</label>
					<label style="margin-left:20upx;" v-if="false">{{store_info.store_grade_name}}</label>
					<text style="width: 56%;display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;"
						v-if="(store_info.store_slogan!='')">{{sprintf(__('公告：%s'), store_info.store_slogan)}}</text>

				</view>
				<view class="tag-view">
					<uni-tag :text="__('已收藏')" mark="right" type="gray" size="normal" inverted="1" circle="true"
						data-type="groupbuy" v-if="store_info.analytics.store_collect"
						@click="onUnlikeStore(store_info.store_id)"></uni-tag>


					<uni-tag :text="__('收藏')" mark="right" type="shopsuite" size="normal" inverted="1" circle="true"
						data-type="groupbuy" v-if="store_info.analytics.store_collect<1"
						@click="onLikeStore(store_info.store_id)"></uni-tag>

					<uni-tag :text="sprintf(__(' %d 次'), store_info.analytics.store_favorite_num)" mark="true"
						type="shopsuite" size="normal" inverted="1" circle="true" data-type="groupbuy"></uni-tag>
				</view>
			</view>

			<view v-if="loadStoreConfigComplete">
			<diy v-if="commonTPL.TemplateKey=='shopdiy'" :BgConfig="BgConfig" :PageContent="PageContent" :pageId="pageId"
				:PageNav="PageNav" :StoreInfo="commonTPL.shopInfo" :loadPageFlag="loadPageFlag"></diy>

			<block v-if="commonTPL.TemplateKey!='shopdiy'">
				<view class="g-flex m-ba-tab" v-if="(commonTPL.TemplateKey != '')">
					<view :class="['g-flex-item',  commonTPL.tapindex==1?'m-ba-item-select':'']" @click="clickRecommend" v-if="(commonTPL.TemplateKey != 'shop6')">
						<!--我加的判断-->
						<view class="m-ba-icon">
							<label class="iconfont icon-discount"></label>
						</view>
						<view>{{__('推荐')}}</view>
					</view>
					<view :class="['g-flex-item', commonTPL.tapindex==2?'m-ba-item-select':'']" @click="clickListAllProduct">
						<view class="m-ba-icon">{{commonTPL.shopInfo.AllProduct}}</view>
						<view>{{__('全部商品')}}</view>
					</view>
					<view :class="['g-flex-item', commonTPL.tapindex==3?'m-ba-item-select':'']" @click="clickListNewProduct">
						<view class="m-ba-icon">{{commonTPL.shopInfo.NewProduct}}</view>
						<view>{{__('上新')}}</view>
					</view>
					<view :class="['g-flex-item', commonTPL.tapindex==4?'m-ba-item-select':'']" @click="clickGetStoreData">
						<view class="m-ba-icon">
							<label class="iconfont icon-store"></label>
						</view>
						<view>{{__('店铺简介')}}</view>
					</view>
					<view :class="['g-flex-item', commonTPL.tapindex==4?'m-ba-item-select hide':'hide']"
						@click="showSupplyProducts">
						<view class="m-ba-icon">
							<label class="iconfont icon-store"></label>
						</view>
						<view>{{__('供应商')}}</view>
					</view>
				</view>


				<shoptheme1 v-if="(commonTPL.tapindex==1 && commonTPL.TemplateKey=='shop1')" :commonTPL="commonTPL">
				</shoptheme1>
				<shoptheme2 v-if="(commonTPL.tapindex==1 && commonTPL.TemplateKey=='shop2')" :commonTPL="commonTPL">
				</shoptheme2>
				<shoptheme3 v-if="(commonTPL.tapindex==1 && commonTPL.TemplateKey=='shop3')" :commonTPL="commonTPL">
				</shoptheme3>
				<shoptheme4 v-if="(commonTPL.tapindex==1 && commonTPL.TemplateKey=='shop4')" :commonTPL="commonTPL">
				</shoptheme4>
				<shoptheme5 v-if="(commonTPL.tapindex==1 && commonTPL.TemplateKey=='shop5')" :commonTPL="commonTPL">
				</shoptheme5>
				<shoptheme6 v-if="(commonTPL.tapindex==1 && commonTPL.TemplateKey=='shop6')" :commonTPL="commonTPL">
				</shoptheme6>

				<view v-if="loadStoreCategoryComplete">
				<shoptheme6 v-if="(commonTPL.tapindex==2 && commonTPL.TemplateKey=='shop6')" :commonTPL="commonTPL" ref="shop6"></shoptheme6>
				<view v-else-if="(commonTPL.tapindex==2)" class="m-scroll-box">
					<scroll-view scroll-y="true" @scrolltolower="scrollbottom" @scroll="scrollView"
						@scrolltoupper="scrollTop" class="m-product-all"
						:class="['m-product-all', 'u-pa', commonTPL.istop?'u-patop':'u-pabtn']">
						<view class="m-tab">
							<view class="m-navbar">
								<view class="m-navbar-item"
									:class="['m-navbar-item', commonTPL.post.orderby=='product_sale_num'?'m-navbar-item-on':'']"
									@click="clickSortBySaleNum">
									{{__('销量')}}
								</view>
								<view class="m-navbar-item"
									:class="['m-navbar-item', commonTPL.post.orderby=='product_add_time'?'m-navbar-item-on':'']"
									@click="clickNewpd">
									{{__('新品')}}
								</view>
								<view class="m-navbar-item"
									:class="['m-navbar-item', commonTPL.post.orderby=='product_unit_price'?'m-navbar-item-on':'']"
									@click="clickSortByPrice">
									<label class="m-sort"> {{__('价格')}}
										<image
											:src="'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/' + (commonTPL.sort==1?'sort-desc':'sort-asc') + '.png'" />
									</label>
								</view>
							</view>
						</view>
						<view :class="['m-product-list', commonTPL.viewtype==1?'fadeIn animated m-listv':'']">
							<navigator v-for="(item, i) in commonTPL.pdlist" :key="i"
								:url="'/pages/product/detail?is_store_flag=' +  (commonTPL.isStoreFlag) + '&pid=' + item.id"
								class="m-product-item" style="border-radius: 19upx;">
								<view class="m-product-img">
									<image :src="(item.ProductPic)" mode="aspectFill" style="border-radius: 19upx;" />
								</view>
								<view class="m-product-info">
									<view class="m-product-name">
										<label>{{item.SalesName}}</label>
									</view>
									<view class="m-product-price">
										<block v-if="item.ItemSalePrice">
											<label>{{__('￥')}}</label>{{number_format(item.ItemSalePrice, 2)}}
										</block>

										<block v-if="item.product_unit_points">
											<label style="margin: 0upx 10upx;">+</label><label
												style="font-size:32upx">{{number_format(item.product_unit_points)}}</label>
											<label>{{__('积分')}}</label>
										</block>

										<block v-if="item.product_unit_sp">
											<label style="margin: 0upx 10upx;">+</label><label
												style="font-size:32upx">{{item.product_unit_sp}}</label>
											<label>{{__('众宝')}}</label>
										</block>
									</view>
								</view>
							</navigator>
						</view>
						<view class="u-top-default">
							<view class="u-view" @click="onViewType">
								<label
									:class="['iconfont zc',  (commonTPL.viewtype==1?'zc-viewlist':'zc-viewgallery')]"></label>
							</view>
							<view class="u-back hide" @click="retruntop">
								<label class="iconfont icon-fanhuidingbu"></label>
							</view>
						</view>
						<view class="m-loading-box">
							<block v-if="(commonTPL.ispage)">
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
				</view>
				</view>

				<view v-if="loadStoreCategoryComplete">
				<shoptheme6 v-if="(commonTPL.tapindex==3 && commonTPL.TemplateKey=='shop6')" :commonTPL="commonTPL" @ckallPD6="ckallPD6">
				</shoptheme6>
				<scroll-view v-else-if="(commonTPL.tapindex==3)" scroll-y="true" @scrolltolower="scrollbottom"
					@scrolltoupper="scrollTop" @scroll="scrollView"
					:class="['m-product-all u-pa' , commonTPL.istop?'u-patop':'u-pabtn']">
					<view :class="['m-product-list', 'no-tap', commonTPL.viewtype==1?'fadeIn animated m-listv':'']">
						<block v-for="(item, i) in commonTPL.pdlist" :key="i">
							<navigator
								:url="'/pages/product/detail?is_store_flag=' + commonTPL.isStoreFlag + '&pid=' + item.id"
								class="m-product-item" style="border-radius: 19upx;">
								<view class="m-product-img">
									<image :src="(item.ProductPic)" mode="aspectFill" style="border-radius: 19upx;" />
								</view>
								<view class="m-product-info">
									<view class="m-product-name">
										<label>{{item.SalesName}}</label>
									</view>
									<view class="m-product-price">
										<block v-if="item.ItemSalePrice">
											<label>{{__('￥')}}</label>{{number_format(item.ItemSalePrice, 2)}}
										</block>

										<block v-if="item.product_unit_points">
											<label style="margin: 0upx 10upx;">+</label><label
												style="font-size:32upx">{{number_format(item.product_unit_points)}}</label>
											<label>{{__('积分')}}</label>
										</block>

										<block v-if="item.product_unit_sp">
											<label style="margin: 0upx 10upx;">+</label><label
												style="font-size:32upx">{{item.product_unit_sp}}</label>
											<label>{{__('众宝')}}</label>
										</block>
									</view>
								</view>
							</navigator>
						</block>
					</view>
					<view class="u-top-default">
						<view class="u-view" @click="onViewType" style="line-height: 96rpx;">
							<label
								:class="['iconfont zc',  (commonTPL.viewtype==1?'zc-viewlist':'zc-viewgallery')]"></label>
						</view>
						<view class="u-back hide" @click="retruntop">
							<label class="iconfont icon-fanhuidingbu"></label>
						</view>
					</view>
					<view class="m-loading-box">
						<block v-if="(commonTPL.ispage)">
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
				</view>

				<view v-if="(commonTPL.tapindex==4)" class="m-ShopProfile">
					<view class="m-cells" style="">
						<view style="position: relative;height: 130rpx;margin:0 20rpx">
							<view @click.stop="gotomap" :data-lat="(commonTPL.shopInfo.store_latitude)"
								:data-address="(commonTPL.shopInfo.LegalAdress)"
								:data-name="(commonTPL.shopInfo.store_name)"
								:data-lng="(commonTPL.shopInfo.store_longitude)">
								<label class="zc zc-shouhuodizhi address-icon" style="width: 45px;height:45px;"></label>
								<view class="m-cell" style="width:440rpx;height:91upx;position: absolute;">
									<view class="m-cell-bd" style="position: relative;left: 70rpx;font-size: 12px;">
										<text style="font-weight: 700;">{{commonTPL.shopInfo.LegalAdress}}</text>
										<text v-if="distance" @click.stop="gotomap"
											:data-lat="(commonTPL.shopInfo.store_latitude)"
											:data-address="(commonTPL.shopInfo.LegalAdress)"
											:data-name="(commonTPL.shopInfo.store_name)"
											:data-lng="(commonTPL.shopInfo.store_longitude)"
											style="color: #999;width:100upx;font-size: 20upx;right: 10rpx;bottom:24rpx;margin-left:20rpx;">{{sprintf(__('距您 %s'), distance)}}</text>
									</view>
								</view>
							</view>
							<span style="position: absolute;right: 140rpx;top: 28rpx;">
								<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/phone_sp.png"
									style="width: 4rpx;height:70rpx;border-radius: 24%;" />
							</span>

							<view class="m-cell" style="float: right;position: absolute;width: 80rpx;right:0rpx;"
								@click="callPhone(commonTPL.shopInfo.LegalNumber)">
								<view class="m-cell-bd">
									<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/phone.png" class="t"
										style="width: 44rpx;height: 44rpx;position: relative;left: 18rpx;top:8rpx;" />
									<text
										style="display: block;position: absolute;left: 16%;top: 66rpx;font-size: 12px;">{{__('联系商家')}}</text>
								</view>
							</view>
						</view>

						<view class="m-cell" style="padding:0;position: relative;">
							<view class="m-cell-bd">
								<!-- <text>{{sprintf(__('店铺介绍：%s'), commonTPL.shopInfo.VendorInfo)}}</text> -->
								<wxParse :content="commonTPL.shopInfo.VendorInfo || '　'" :imageProp="{padding:0}" />
							</view>
						</view>


						<view class="m-cell" v-if="false" style="margin:0 20rpx">
							<view class="m-cell-bd">
								<swiper indicator-dots="true" autoplay="true" interval="3000" duration="300">
									<swiper-item v-for="(item, ii) in commonTPL.shopInfo.info.store_slide" :key="ii"
										v-if="item.check">
										<image lazy-load class="slide-image" mode="aspectFill" :src="(item.img)"
											:data-src="(item.img)" @click="previewProductImg" />
									</swiper-item>
								</swiper>
							</view>
						</view>
					</view>
				</view>

				<!--评论-->
				<view v-if="(commonTPL.tapindex==5)">
					<block v-if="(comment_row.length > 0)">
						<view class="uni-padding-wrap">
							<view class="uni-comment">
								<view v-for="(comment,cc) in comment_row" :key="cc" class="uni-comment-list"
									style="border-bottom: 1px solid #eee">
									<view class="uni-comment-face">
										<image :src="comment.user_avatar" mode="widthFix"></image>
									</view>
									<view class="uni-comment-body">
										<view class="uni-comment-top">
											<text>{{comment.user_name}}</text>
										</view>
										<view class="uni-comment-date">
											<text>{{comment.comment_time}}</text>
										</view>
										<view class="uni-comment-content">{{comment.comment_content}}</view>
										<view v-if="comment.comment_image[0]" class="m-cell-bd"
											style="padding: 0;margin: 0;line-height: 1;">
											<view class="uni-uploader-body">
												<view class="uni-uploader__files">
													<block v-for="(image,ii) in comment.comment_image" :key="ii">
														<view class="uni-uploader__file">
															<image class="uni-uploader__img"
																:src="comment.comment_image[ii]"></image>
														</view>
													</block>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>


						<navigator :url="'/pages/index/addcomment?is_store=' + options.store_id" class="m-nullpage"
							style="height: 286upx;margin-top: 0%;">
							<view class="m-nullpage-middle">
								<label class="iconfont icon-xiecomment"></label>
								<view class="m-null-tip">
									<text>{{__('我也说两句~')}}</text>
									<text>{{__('去评论~')}}</text>
								</view>
							</view>
						</navigator>
					</block>
					<block v-else>
						<navigator :url="'/pages/index/addcomment?is_store=' + options.store_id" class="m-nullpage">
							<view class="m-nullpage-middle">
								<label class="iconfont icon-xiecomment"></label>
								<view class="m-null-tip">
									<text>{{__('暂时没有评论哦~')}}</text>
									<text>{{__('去评论~')}}</text>
								</view>
							</view>
						</navigator>
					</block>

				</view>

				<!--评论-->
			</block>
			</view>
		</view>

	</view>
</template>

<script>
	// 仅仅作为初始化数据结构使用
	var thatProm = {
		isStoreFlag: 1,
		ProductInfo: {},
		addCar: !1,
		count: 0,
		windowHeight: 0,
		categoryname: "",
		click6: !0,
		cid: 0,
		cartlist: {},
		isdata: !0,
		select_cart_ids: [],
		tapindex: 2,
		viewtype: 1,
		shopInfo: {
			analytics: {
				store_collect: 0
			},
			store_slogan: "",
			base: {},
			info: {
				store_slide: {}
			},
			VendorInfo: '　'
		},
		pdlist: [],
		sort: 2,
		ispage: !0,
		flag: !0,
		distance: 0,
		istop: !1,
		TemplateKey: "",
		smallCategory: [], // 店铺分类列表
		loadStoreCategoryComplete: !1, // 当前选中的店铺分类信息是否加载完成
		currentCategoryId: 0, // 当前选中的店铺分类ID
		currentCategoryName: '', // 当前选中的店铺分类名称
		AdContent: {},
		post: {
			store_id: 0,
			orderby: 1,
			sort: 2,
			isnew: !1,
			curpage: 1
		},
		formdate: "",
		pageId: 0,
	};
	import wxParse from '@/components/u-parse/u-parse.vue'
	import paymentBox from '../../components/payment-box.vue'

	import uniPopup from '../../components/uni-popup/uni-popup.vue';

	import shoptheme1 from '../../components/themes/shoptheme1.vue'
	import shoptheme2 from '../../components/themes/shoptheme2.vue'
	import shoptheme3 from '../../components/themes/shoptheme3.vue'
	import shoptheme4 from '../../components/themes/shoptheme4.vue'
	import shoptheme5 from '../../components/themes/shoptheme5.vue'
	import shoptheme6 from '../../components/themes/shoptheme6.vue'
	import diy from '../../components/themes/diy.vue'
	import uniTag from '@/components/uni-tag/uni-tag.vue';

	import favorite from "@/helpers/favorite";

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				options: {},
				Coupons: [],
				isCancelSuccess: !0,
				isCancel: !0,
				CouponAmount: 0,
				user_is_new: 0,
				pageId: '',
				loadPageFlag: false,
				PageContent: [],
				BgConfig: {
					BackgroundObj: {
						type: 1,
						bgColor: '#ffffff',
						"pathColor": "#f8f8f8",
						"path": ""
					}
				},
				PageNav: {
					window: {
						"navigationBarBackgroundColor": "#ffffff",
						"navigationBarTextStyle": "black",
						"navigationBarTitleText": "",
						"backgroundColor": "#f8f8f8",
						"backgroundTextStyle": "dark"
					}
				},
				AdContent: {},
				TemplateKey: "",
				commonTPL: Object.assign({}, thatProm),
				indexArray: [],
				splist: [],
				splistStr: [],
				pid: 0,
				index: 0,
				ShareImg: "",
				ShareTitle: "",
				refresh: !0,
				ispage: !0,
				flag: !0,
				w: 0,
				comment_row: [],
				latitude: 0,
				longitude: 0,
				distance: 0,
				discountNum: 0,
				discountNNum: 0,
				initThatProm: Object.assign({}, thatProm),
				initPageData: null,
				store_id: 1001,
				store_info: null,
				loadStoreInfoComplete: !1, // 加载店铺基本信息完成
				loadStoreConfigComplete: !1, // 加载店铺配置信息完成
				loadStoreCategoryComplete: !1, // 加载店铺配置信息完成

			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			shoptheme1,
			shoptheme2,
			shoptheme3,
			shoptheme4,
			shoptheme5,
			shoptheme6,
			diy,
			uniTag,
			wxParse
		},
		onLoad: function(options) {
			this.initStorePageData(options)
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.reloadShop6Data();
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// 离开页面，注销事件
			var that = this;

			that.setData({
				commonTPL: thatProm
			})

			this.notice.removeNotification("RefreshProduct", that);
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh:async function() {
			this.reloadShop6Data();
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
				path: "/pagesub/index/store?store_id=" + this.options.store_id + "&uid=" + this.userInfo.user_id
			}
		},


		/**
		 * 用户点击右上角分享朋友圈
		 */
		onShareTimeline: function() {
			return {
				title: this.ShareTitle,
				query: {
					uid: this.userInfo.user_id,
					store_id: this.options.store_id
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
			ckLabel: function(e) {
			},
			reloadShop6Data: function () {
				let that = this;
				if (this.$refs.shop6) {
					this.$refs.shop6.reloadCategoryProduct();
				}

				that.$.stopPullDownRefresh();
				that.$.hideLoading();
			},
 			initStorePageData: function(options) {
				var that = this;

				that.$.showLoading();

				//that.commonTPL 全局有效，状态保留了。 清除上次数据
				that.$set(that.commonTPL, 'istop', !1)
				that.$set(that.commonTPL, 'pdlist', [])


				this.setData({
					options: options,
					distance: options.d || 0,
					store_id: options.store_id || 1001
				});

				var w = that.$.getSystemInfoSync().windowWidth;
				that.setData({
					w: w
				})

				this.notice.addNotification("RefreshProduct", that.RefreshProduct, that);

				// 执行获取店铺信息的回调函数
				this.getStoreInfo({
					'callback':async function(store) {
						uni.setNavigationBarTitle({
						    title: store.store_name
						});

						let tmp = Object.assign({}, store);
						let coord = that.$.bMapTransQQMap(tmp['store_longitude'], tmp['store_latitude']);
						tmp['store_longitude'] = coord.lng;
						tmp['store_latitude'] = coord.lat;

						let tmpThatProm = that.commonTPL

						tmpThatProm.shopInfo = tmp

						that.setData({
							ShareImg: store.WapLogoPath,
							ShareTitle: store.store_name,
							store_info: store,
							loadStoreInfoComplete: !0
						});
						try {
							that.$set(that.commonTPL, 'windowHeight', that.$.getSystemInfoSync().windowHeight - 50);
						} catch (n) {
							//console.log(" Do something when catch error", n)
						}

						//店铺分类数据
						await that.getStoreConfig();
						await that.getStoreCategory();



						setTimeout(function() {
							//初始化微信分享
							let $title = store.store_name;
							let $desc = '';
							let $link = that.$.sprintf('%s/h5/pagesub/index/store?store_id=%s', that
								.Config.SiteUrl, options.store_id);
							let $img_url = store.WapLogoPath;

							//初始化微信分享
							that.$.wxShare($title, $desc, $link, $img_url)
						}, 100);

						that.$.getLocation({
							type: "wgs84",
							success: function(response) {
								that.setData({
									latitude: response.latitude,
									longitude: response.longitude
								});
								console.info("手机定位:");
								console.info(JSON.stringify(response))

								//计算距离  shopInfo

								/**
								 * 计算两个经纬度的距离(米)
								 */
								let getDistance = function(lat1, lng1, lat2, lng2) {
									var radLat1 = lat1 * Math.PI / 180.0;
									var radLat2 = lat2 * Math.PI / 180.0;
									var a = radLat1 - radLat2;
									var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
									var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2),
											2) +
										Math.cos(radLat1) * Math.cos(radLat2) * Math
										.pow(Math.sin(b / 2), 2)));
									s = s * 6378.137; // EARTH_RADIUS;
									s = Math.round(s * 10000) / 10;
									return s;
								}

								let d = getDistance(that.latitude, that.longitude, coord.lat, coord.lng);

								if (d) {
									d = that.$.distanceFormat(d || 0);
								}

								that.setData({
									distance: d || 0
								});

								that.getNearbylist()
							},
							fail: function() {
								that.$.confirm("手机定位失败");


								that.getNearbylist()
							}
						})
					},
					store_id: options.store_id
				});

				//存入本地
				uni.setStorageSync('store_id', options.store_id);
			},

			//读取diy内容
			getDivModel: function() {
				var that = this,
					param = {
						store_id: this.store_id
					};

				that.$.request({
					url: this.Config.URL.store.index_diy,
					data: param,
					loading: false,
					success: function(data, status, msg, code) {
						that.setData({
							loadPageFlag: true,
							pageId: data.page_id,
							PageContent: that.$.parseJSON(data.page_code),
							BgConfig: that.$.parseJSON(data.page_config),
							ShareImg: data.page_share_image,
							ShareTitle: data.page_share_title
						});
					}
				});
			},

			RefreshProduct: function(e) {
				e ? this.setData({
					refresh: !0
				}) : this.setData({
					refresh: !1
				})
			},

			//初始化数据，获取店铺分类
			getStoreCategory: function() {
				var that = this;

				var param = {
					store_id: that.store_id
				};

				return new Promise((resolve, reject) => {
					that.$.request({
						url: that.Config.URL.store.product_category,
						data: param,
						loading: false,
						ajaxCache: {
							timeout: that.Config.CACHE_EXPIRE
						},
						success: function(data, status, msg, code) {
							let tmp = that.commonTPL

							that.$set(that.commonTPL, 'smallCategory', data.leaf);
							that.$set(that.commonTPL, 'loadStoreCategoryComplete', !0);
							that.setData({
								"loadStoreCategoryComplete": !0
							});

							if (data.leaf.length > 0) {
								that.$set(that.commonTPL, 'cid', data.leaf[0].id);
								that.$set(that.commonTPL, 'currentCategoryId', data.leaf[0].id);
								that.$set(that.commonTPL, 'categoryname', data.leaf[0].store_product_cat_name);
								that.$set(that.commonTPL, 'currentCategoryName', data.leaf[0].store_product_cat_name);
							}


							if (1 == that.commonTPL.tapindex) {

							} else if (2 == that.commonTPL.tapindex) {
								that.listAllProduct();

							} else if (3 == that.commonTPL.tapindex) {
								that.listNewProduct();
							} else if (4 == that.commonTPL.tapindex) {
								that.getStoreData();
							} else if (5 == that.commonTPL.tapindex) {

							}

							that.$.stopPullDownRefresh()
							that.$.hideLoading();
						},

						fail: function(err) {}
					});
				})
				//读取店铺商品分类 todo 根据需要读取。
			},

			// 点击推荐
			clickRecommend: function() {
				this.$set(this.commonTPL, 'tapindex', 1);
			},
			clickListAllProduct: function() {
				this.$set(this.commonTPL, 'tapindex', 2);
				this.listAllProduct();
			},
			// 全部商品
			listAllProduct: function(e) {
				let that = this;
				that.$set(that.commonTPL, 'pdlist', []);
				// 使用了模块shopthemes，在模块中加载数据
				if (that.commonTPL.TemplateKey === "shop6") {
					that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
						store_category_ids: that.commonTPL.currentCategoryId,
						store_id: this.store_id,
						orderby: 1,
						sort: 2,
						isnew: !1,
						curpage: 1
					}));
				} else {
					that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
						store_id: this.store_id,
						orderby: 1,
						sort: 2,
						isnew: !1,
						curpage: 1,
						is_activity: 3
					}));
					that.getProductList();
				}
			},
			clickListNewProduct: function () {
				let that = this;
				that.$set(that.commonTPL, 'tapindex', 3);

				this.listNewProduct();
			},
			// 新品上市
			listNewProduct: function() {
				let that = this;
				that.$set(that.commonTPL, 'pdlist', []);

				// 使用了模块shopthemes，在模块中加载数据
				if (that.commonTPL.TemplateKey === "shop6") {
					that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
						store_category_ids: that.commonTPL.currentCategoryId,
						store_id: this.store_id,
						sidx: 'product_add_time',
						sord: 'DESC',
						orderby: 1,
						sort: 2,
						isnew: !0,
						curpage: 1,
						store_id: this.store_id
					}));
				} else {
					that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
						store_id: that.store_id,
						sidx: 'product_add_time',
						sord: 'DESC',
						orderby: 2,
						sort: 2,
						isnew: !0,
						curpage: 1,
						is_activity: 1
					}));
					this.getProductList();
				}
			},
			clickGetStoreData: function () {
				let that = this;
				that.$set(that.commonTPL, 'tapindex', 4);

				that.getStoreData();
			},
			// 查看店铺简介
			getStoreData: function() {

			},
			// 切换商品显示方式
			onViewType: function() {
				var that = this;

				that.$set(that.commonTPL, 'viewtype', that.commonTPL.viewtype === 0 ? 1 : 0);
			},

			clickSortBySaleNum: function() {
				this.sortBySaleNum();
			},
			/**
			 * 销量排序
			 */
			sortBySaleNum: function() {
				var that = this;

				that.$set(that.commonTPL, 'pdlist', [])
				that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
					"sidx": "product_sale_num",
					"sord": 'DESC',
					"curpage": 1
				}));

				this.getProductList();
			},

			clickNewpd: function() {
				this.newpd();
			},

			/**
			 * 新品排序
			 */
			newpd: function() {
				var that = this;

				that.$set(that.commonTPL, 'pdlist', [])
				that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
					"sidx": "product_add_time",
					"sord": 'DESC',
					"curpage": 1
				}));

				this.getProductList()
			},

			clickSortByPrice: function() {
				this.sortByPrice();
			},

			/**
			 * 价格排序
			 */
			sortByPrice: function() {
				let that = this;

				that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
					"sidx": "product_unit_price",
					"sord": that.commonTPL.sort === 1 ? 'DESC' : 'ASC',
					"curpage": 1
				}));

				that.$set(that.commonTPL, 'sort', that.commonTPL.sort == 1 ? 2 : 1)
				that.$set(that.commonTPL, 'pdlist', [])

				this.getProductList()
			},
			scrollbottom: function(e) {
				let that = this;
				if (that.commonTPL.flag) {
					that.setData({
						flag: !1
					}), clearTimeout(n);
					var n = setTimeout(function() {
							that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {curpage: that.commonTPL.post.curpage + 1}));
							that.getProductList()
						},500)
				};
			},

			getProductList: function() {
				let that = this;

				that.$set(that.commonTPL, 'flag', !1);

				let params = Object.assign({}, that.commonTPL.post, {
					"isnew": that.commonTPL.post.isnew ? 1 : 0,
					"user_cart_quantity": that.commonTPL.TemplateKey === "shop6" ? 1 : 0
				});
				that.$.request({
					url: this.Config.URL.store.product,
					loading: true,
					data: params,
					success: function(data, status, msg, code) {
						for (var i = 0; i < data.items.length; i++) {
							data.items[i]['id'] = data.items[i]['item_id'];
							data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
							data.items[i]['productName'] = data.items[i]['product_name'];
							data.items[i]['SalesName'] = data.items[i]['product_name'];
							data.items[i]['ProductPic'] = data.items[i]['product_image'];
							data.items[i]['ItemSalePrice'] = data.items[i]['product_unit_price'];
							data.items[i]['SaleNum'] = data.items[i]['product_sale_num'];
							data.items[i]['Stock'] = data.items[i]['product_quantity'];
							data.items[i]['HasManualSku'] = data.items[i]['item_color'].length > 1;
							data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
							//data.items[i]['user_cart_quantity'] = 1;
						}

						if (data.items.length > 0) {
							if (that.commonTPL.post.curpage == 1 && data.items.length < 10) {

								that.$set(that.commonTPL, 'flag', !1);
								that.$set(that.commonTPL, 'ispage', !1);
							} else {
								that.$set(that.commonTPL, 'flag', !0);
								that.$set(that.commonTPL, 'ispage', !0);
							}
							that.$set(that.commonTPL, 'pdlist', that.commonTPL.pdlist.concat(data.items));

						} else {
							that.$set(that.commonTPL, 'flag', !1)
							that.$set(that.commonTPL, 'ispage', !1)
						}
					}
				});
			},
			scrollView: function(e) {
				let that = this;
				if (e.detail.deltaY < -305) {
					that.$set(that.commonTPL, 'distance', e.detail.deltaY);
					that.$set(that.commonTPL, 'istop', !0);
				}
			},
			scrollTop: function() {
				let that = this;

				that.$set(that.commonTPL, 'istop', !1);
			},
			returnTop: function() {
				let that = this;

				that.$set(that.commonTPL, 'distance', 0);
			},
			showSupplyProducts: function() {
				this.$.gopage('/pages/product/list?store_type=2');
			},
			//店铺首页信息数据读取
			getStoreConfig: function() {
				var that = this;
				var param = {
					store_id: this.store_id
				};
				return new Promise((resolve, reject) => {
				        that.$.request({
				        	url: this.Config.URL.store.contents,
				        	data: param,
				        	loading: false,
				        	success: function(data, status, msg, code) {
				        		that.setData({
				        			loadStoreConfigComplete: !0
				        		})

								that.$set(that.commonTPL, 'TemplateKey', (data.store_template > 1000 || data.store_template === 'shop7') ? 'shopdiy' : data.store_template);

				        		if ('shopdiy' == that.commonTPL.TemplateKey) {

								}
								else {
				        			for (var i = 0; i < data.contents['F1ProductContents'].length; i++) {
				        				data.contents['F1ProductContents'][i]['ProductContentID'] = data.contents[
				        					'F1ProductContents'][i]['item_id'];
				        				data.contents['F1ProductContents'][i]['ProductName'] = data.contents[
				        					'F1ProductContents'][i]['product_name'];
				        				data.contents['F1ProductContents'][i]['Price'] = data.contents[
				        					'F1ProductContents'][i]['product_unit_price'];
				        				data.contents['F1ProductContents'][i]['ImagePath'] = data.contents[
				        					'F1ProductContents'][i]['product_image'];
				        				data.contents['F1ProductContents'][i]['TitleType'] = data.contents[
				        					'F1TitleType'];
				        			}


				        			for (var i = 0; i < data.contents['F2ProductContents'].length; i++) {
				        				data.contents['F2ProductContents'][i]['ProductContentID'] = data.contents[
				        					'F2ProductContents'][i]['item'];
				        				data.contents['F2ProductContents'][i]['ProductName'] = data.contents[
				        					'F2ProductContents'][i]['name'];
				        				data.contents['F2ProductContents'][i]['Price'] = data.contents[
				        					'F2ProductContents'][i]['product_unit_price'];
				        				data.contents['F2ProductContents'][i]['ImagePath'] = data.contents[
				        					'F2ProductContents'][i]['img'];
				        				data.contents['F2ProductContents'][i]['TitleType'] = data.contents[
				        					'F2TitleType'];
				        				data.contents['F2ProductContents'][i]['ProductLinkUrl'] = data.contents[
				        					'F2ProductContents'][i]['url'];
				        			}

				        			for (var i = 0; i < data.contents['F3ProductContents'].length; i++) {
				        				data.contents['F3ProductContents'][i]['ProductContentID'] = data.contents[
				        					'F3ProductContents'][i]['item_id'];
				        				data.contents['F3ProductContents'][i]['ProductName'] = data.contents[
				        					'F3ProductContents'][i]['product_name'];
				        				data.contents['F3ProductContents'][i]['Price'] = data.contents[
				        					'F3ProductContents'][i]['product_unit_price'];
				        				data.contents['F3ProductContents'][i]['ImagePath'] = data.contents[
				        					'F3ProductContents'][i]['product_image'];
				        				data.contents['F3ProductContents'][i]['TitleType'] = data.contents[
				        					'F3ProductContents'][i]['title'];
				        				data.contents['F3ProductContents'][i]['ProductLinkUrl'] = data.contents[
				        					'F3ProductContents'][i]['link_url'];
				        			}

				        		}
								that.$set(that.commonTPL, 'AdContent', data.contents);

				        		that.setData({
				        			AdContent: data.contents,
				        			TemplateKey: that.commonTPL.TemplateKey,
				        			commonTPL: that.commonTPL,
				        			discountNum: data.discount_num,
				        			discountNNum: data.no_discount_num
				        		})
								if (that.commonTPL.smallCategory.length > 0 && that.commonTPL.TemplateKey == "shop6") {
									that.$set(that.commonTPL, 'tapindex', 2);
								}

				        		that.commonTPL.TemplateKey == "shopdiy" && that.getDivModel() //shopdiy用户自定义UI
								resolve('success')
				        	},
				        	complete: function(res, status) {}
				        });
				    });
				//读取店铺商品分类
			},

			sao: function() {
				let that = this;
				that.$.scanCode({
					success: function(e) {
						var t = e.result.split("=");
						t.length > 2 || t.length < 2 ? that.$.alert("无法识别") : t[0] == "productId" ? that.$
							.isNull(t[1]) ? that.$.alert("无法识别") : that.$.navigateTo(
								"/pages/product/detail?pid=" + t[1]) : t[0] == "eventId" ? that.$.isNull(t[
								1]) ? that.$.alert("无法识别") : that.$.navigateTo(
								"../activitycheckin/activitycheckin?eventId=" + t[1]) : that.$.alert(
								"无法识别")
					},
					fail: function(e) {
						that.$.alert("无法识别")
					}
				})
			},
			doReceive: function() {
				this.cancel(), this.userReceiveCoupon()
			},
			cancel: function() {
				this.setData({
					isCancel: !1
				})
			},
			cancelsuccess: function() {
				this.setData({
					isCancelSuccess: !0
				})
			},
			userReceiveCoupon: function() {
				var e = {

						CouponIds: "",

						user_is_new: this.user_is_new
					},
					that = this;
				that.$.xsr(that.$.makeUrl(userapi.UserReceiveCoupon, e), function(e) {
					e.Code == 0 ? that.setData({
						isCancelSuccess: !1,
						Coupons: e.Info
					}) : that.$.alert(e.Msg)
				})
			},

			onLikeStore: function(store_id) {
				favorite.onLikeStore(store_id, (flag) => {
					this.commonTPL.shopInfo.analytics.store_collect = 1;
					this.commonTPL.shopInfo.analytics.store_favorite_num++;
				})
			},

			onUnlikeStore: function(store_id) {
				favorite.onUnlikeStore(store_id, (flag) => {
					this.commonTPL.shopInfo.analytics.store_collect = 0;
					this.commonTPL.shopInfo.analytics.store_favorite_num--;
				})
			},
			previewProductImg: function(e) {
				var that = this,
					n = [];
				for (var r in this.commonTPL.shopInfo.info.store_slide) {
					if (this.ProductInfo.productPicList[r].check) {
						n.push(this.ProductInfo.productPicList[r].img);
					}
				}

				var i = e.target.dataset.src;

				that.$.previewImage({
					current: i,
					urls: n
				})
			},
			callPhone: function(e) {
				var that = this;
				uni.makePhoneCall({phoneNumber:e + ''})
			},
			gotomap: function(e) {
				var that = this;
				that.$.openLocation({
					latitude: parseFloat(e.currentTarget.dataset.lat),
					longitude: parseFloat(e.currentTarget.dataset.lng),
					name: e.currentTarget.dataset.name,
					address: e.currentTarget.dataset.address,
					scale: 28
				})
			},
			getNearbylist: function() {
				var post = this.post;
				var that = this;

				var params = {
					lat: that.latitude,
					lng: that.longitude,
					store_id: that.options.store_id,
					is_store: 1,
					city: that.$.getStorageSync("city"),
				};
			},
		}
	};
</script>


<style lang="scss">
	@import "../../styles/_variables";
	@import '../../styles/layout.scss';
	@import '../../styles/store_themes.scss';
	@import '../../styles/store_tpl.scss';

	.tag-view {

		position: absolute;
		bottom: 20upx;
		right: 20upx;
		z-index: 100;
		display: inline-flex;

	}


	.tag-mark-right {
		border-top-left-radius: 15px;
		border-bottom-left-radius: 15px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;

	}

	.m-shopinfo {
		width: 556upx;

		.service-star-box {
			background-color: gray;
			line-height: 20upx;
			height: 20upx;
			border-radius: 20upx;

			font-size: 20upx;
			color: white;
			width: 240upx;
			padding: 6upx 6upx;
			margin-left: 4upx;
			float: right;
			text-align: center;

			.m-startBox {
				display: inline-block;
				color: #eee;
				line-height: 20upx;
				height: 20upx;
				font-size: 20upx;

				.icon-start {
					color: #fff;
					top: 0;
					margin-left: 4upx;
				}

				.sel.icon-start {
					color: $default-skin-bg;
				}

			}

			.m-startBox label {
				font-size: 20upx;
			}
		}
	}

	.u-pa .m-product-list {
		padding-top: calc(82rpx) !important;
	}

	.uni-comment-date {
		font-size: 10px;
		color: #999999;
	}

	.address-icon {
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		top: 30rpx;
		left: 4rpx;

		color: red;

		&:before {
			font-size: 32px;
		}
	}

	.t {
		width: 90rpx;
		height: 90rpx;
		/* left: 0px; */
		position: absolute;
		top: 18rpx;
	}

	.uni-uploader__img {
		display: block;
		width: 182upx;
		height: 182upx;
	}

	.uni-uploader__file {
		margin: 9upx;
		width: 182upx;
		height: 182upx;
	}
</style>
