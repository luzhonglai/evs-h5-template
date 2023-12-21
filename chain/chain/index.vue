<template name="commonTPL">
	<view class="page">
		<view>
			<view class="m-banner" v-if="loadStoreInfoComplete">
				<image :src="(store_info.BackGroundPath)" v-if="false" />
				<view class="m-content-box">
				</view>
				<view class="m-logo">
					<image :src="(store_info.chain_img)" />
				</view>
				<view class="m-shopinfo">
					<label>{{store_info.chain_name}}</label>
					<label class="iconfont icon-qijiandian"></label>
					<text @click="gotomap" :data-address="(store_info.chain_district_info)"
						:data-name="(store_info.chain_name)" :data-lat="(store_info.chain_lat)"
						:data-lng="(store_info.chain_lng)">{{sprintf(__('门店地址：%s'), store_info.chain_address)}}</text>
				</view>
				<view class="m-shopinfo" style="width: 16%;left: 600upx;top: 50upx;z-index: 2;" v-if="false">
					<button plain="true" style="height: 60upx;font-size: 28upx;"
						@click="onShareBox">{{__('分享')}}</button>
				</view>
			</view>

			<view v-if="loadStoreConfigComplete">
				<diy v-if="commonTPL.TemplateKey=='shopdiy'" :BgConfig="BgConfig" :PageContent="PageContent"
					:pageId="pageId" :PageNav="PageNav" :StoreInfo="commonTPL.chainInfo" :loadPageFlag="loadPageFlag">
				</diy>

				<block v-if="commonTPL.TemplateKey!='shopdiy'">
					<view class="g-flex m-ba-tab" v-if="(commonTPL.TemplateKey != '')">
						<view :class="['g-flex-item',  commonTPL.tapindex==1?'m-ba-item-select':'']"
							@click="clickRecommend" v-if="(commonTPL.TemplateKey != 'shop6') && false">
							<!--我加的判断-->
							<view class="m-ba-icon">
								<label class="iconfont icon-discount"></label>
							</view>
							<view>{{__('推荐')}}</view>
						</view>
						<view :class="['g-flex-item', commonTPL.tapindex==2?'m-ba-item-select':'']"
							@click="clickListAllProduct">
							<view class="m-ba-icon">{{commonTPL.chainInfo.AllProduct}}</view>
							<view>{{__('全部商品')}}</view>
						</view>
						<view :class="['g-flex-item', commonTPL.tapindex==3?'m-ba-item-select':'']"
							@click="clickListNewProduct" v-if="false">
							<view class="m-ba-icon">{{commonTPL.chainInfo.NewProduct}}</view>
							<view>{{__('上新')}}</view>
						</view>
						<view :class="['g-flex-item', commonTPL.tapindex==4?'m-ba-item-select':'']"
							@click="clickGetStoreData">
							<view class="m-ba-icon">
								<label class="iconfont icon-store"></label>
							</view>
							<view>{{__('门店简介')}}</view>
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
						<shoptheme6 v-if="(commonTPL.tapindex==2 && commonTPL.TemplateKey=='shop6')"
							:commonTPL="commonTPL" ref="shop6"></shoptheme6>
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
										:url="'/pages/product/detail?is_chain=' +  (commonTPL.isStoreFlag) + '&pid=' + item.id + '&chain_id=' + commonTPL.chainInfo.chain_id"
										class="m-product-item" style="border-radius: 19upx;">
										<view class="m-product-img">
											<image :src="(item.ProductPic)" mode="aspectFill"
												style="border-radius: 19upx;" />
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
						<shoptheme6 v-if="(commonTPL.tapindex==3 && commonTPL.TemplateKey=='shop6')"
							:commonTPL="commonTPL" @ckallPD6="ckallPD6">
						</shoptheme6>
						<scroll-view v-else-if="(commonTPL.tapindex==3)" scroll-y="true" @scrolltolower="scrollbottom"
							@scrolltoupper="scrollTop" @scroll="scrollView"
							:class="['m-product-all u-pa' , commonTPL.istop?'u-patop':'u-pabtn']">
							<view
								:class="['m-product-list', 'no-tap', commonTPL.viewtype==1?'fadeIn animated m-listv':'']">
								<block v-for="(item, i) in commonTPL.pdlist" :key="i">
									<navigator
										:url="'/pages/product/detail?is_chain=' + commonTPL.isStoreFlag + '&pid=' + item.id + '&chain_id=' + commonTPL.chainInfo.chain_id"
										class="m-product-item" style="border-radius: 19upx;">
										<view class="m-product-img">
											<image :src="(item.ProductPic)" mode="aspectFill"
												style="border-radius: 19upx;" />
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
						<view class="m-cells">
							<view class="m-cell">
								<view class="m-cell-bd">
									<text>{{sprintf(__('联系电话：%s'), commonTPL.chainInfo.chain_mobile)}}</text>
								</view>
							</view>
							<view class="m-cell">
								<view class="m-cell-bd">
									<text>{{sprintf(__('联系地址：%s'), commonTPL.chainInfo.chain_address)}}</text>
								</view>
							</view>
							<view class="m-cell">
								<view class="m-cell-bd">
									<text>{{sprintf(__('营业时间：%s 至 %s'), commonTPL.chainInfo.chain_opening_hours,commonTPL.chainInfo.chain_close_hours)}}</text>
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

		<!-- #ifdef APP-PLUS -->
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #endif -->

		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->

		<!-- #ifndef APP-PLUS -->
		<share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg"
			@shareQRCode="shareQRCode" @saveImg="saveImg" ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->
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
		chainInfo: {

			analytics: {
				store_collect: 0
			},
			store_slogan: "",
			base: {},
			info: {
				store_slide: {}
			},

		},
		isChainFlag:0, //是否门店
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
			chain_id: 0,
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
	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'
	import shareBoxH5 from '../../components/share-box-h5.vue'

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
				TemplateKey: "shop6",
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
				chain_id: 1001,
				store_info: null,
				loadStoreInfoComplete: !1, // 加载店铺基本信息完成
				loadStoreConfigComplete: !1, // 加载店铺配置信息完成
				loadStoreCategoryComplete: !1, // 加载店铺配置信息完成

				shareData: {
					shareText: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
					shareTitle: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
					href: "",
					image: ''
				},

				shareText: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
				shareTitle: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
				href: "",
				image: '',
				PageQRCodeInfo: {
					Path: "",
					IsShare: !1,
					IsShareBox: !1,
					IsJT: !1
				},

				shareBoxFlag: 0,
				shareContetnFlag: 0,

				shareType: 0,

			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'chainInfo', 'userInfo', 'hasLogin']),
		components: {
			shoptheme1,
			shoptheme2,
			shoptheme3,
			shoptheme4,
			shoptheme5,
			shoptheme6,
			diy,
			uniTag,
			wxParse,
			shareBoxMp,
			shareBoxApp,
			shareBoxH5
		},
		onLoad: function(options) {
			this.initChainPageData(options)
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

			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
			}
			// #endif

			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: async function() {
			this.reloadShop6Data();
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

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
				path: "/chain/chain/index?chain_id=" + this.options.chain_id + "&uid=" + this.userInfo.user_id
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
					chain_id: this.options.chain_id
				},
				imageUrl: this.ShareImg,
			}
		},
		 

		onBackPress: function() {

			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
				return true;
			}
			// #endif


			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
				return true;
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
				return true;
			}
			// #endif
		},

		/**
		 * 页面滚动触发事件的处理函数
		 */
		onPageScroll: function() {},

		methods: {
			...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getChainInfo']),
			ckLabel: function(e) {},
			reloadShop6Data: function() {
				let that = this;
				if (this.$refs.shop6) {
					this.$refs.shop6.reloadCategoryProduct();
				}

				that.$.stopPullDownRefresh();
				that.$.hideLoading();
			},
			initChainPageData: function(options) {
				uni.setNavigationBarTitle({
					title: this.__('门店首页')
				});

				var that = this;

				that.$.showLoading();

				//that.commonTPL 全局有效，状态保留了。 清除上次数据
				that.$set(that.commonTPL, 'istop', !1)
				that.$set(that.commonTPL, 'pdlist', [])
				
				that.$set(that.commonTPL, 'isChainFlag', 1)


				this.setData({
					options: options,
					distance: options.d || 0,
					chain_id: options.chain_id || 1001
				});

				var w = that.$.getSystemInfoSync().windowWidth;
				that.setData({
					w: w
				})

				this.notice.addNotification("RefreshProduct", that.RefreshProduct, that);

				// 执行获取店铺信息的回调函数
				this.getChainInfo({
					'callback': async function(store) {
						uni.setNavigationBarTitle({
							title: store.chain_name
						});

						let tmp = Object.assign({}, store);
						let coord = that.$.bMapTransQQMap(tmp['chain_lng'], tmp['chain_lat']);
						tmp['chain_lng'] = coord.lng;
						tmp['chain_lat'] = coord.lat;

						let tmpThatProm = that.commonTPL

						tmpThatProm.chainInfo = tmp
						tmpThatProm.shopInfo = tmp

						that.setData({
							ShareImg: store.chain_img,
							ShareTitle: store.chain_name,
							store_info: store,
							loadStoreInfoComplete: !0
						});
						try {
							that.$set(that.commonTPL, 'windowHeight', that.$.getSystemInfoSync()
								.windowHeight - 50);
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
							let $link = that.$.sprintf('%s/h5/chain/chain/index?chain_id=%s&uid=%s',
								that.Config.SiteUrl, options.chain_id, that.userInfo.user_id);
							let $img_url = store.chain_img;

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

								//计算距离  chainInfo

								/**
								 * 计算两个经纬度的距离(米)
								 */
								let getDistance = function(lat1, lng1, lat2, lng2) {
									var radLat1 = lat1 * Math.PI / 180.0;
									var radLat2 = lat2 * Math.PI / 180.0;
									var a = radLat1 - radLat2;
									var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI /
										180.0;
									var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a /
												2),
											2) +
										Math.cos(radLat1) * Math.cos(radLat2) *
										Math
										.pow(Math.sin(b / 2), 2)));
									s = s * 6378.137; // EARTH_RADIUS;
									s = Math.round(s * 10000) / 10;
									return s;
								}

								let d = getDistance(that.latitude, that.longitude, coord.lat,
									coord.lng);

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
					chain_id: options.chain_id
				});

				//存入本地
				uni.setStorageSync('chain_id', options.chain_id);
			},
			
			//格式化数据
			getJobStateList(chain_job_state){
				switch (chain_job_state) {
					case 201:
						return '洗车适中';
					case 202:
						return '美容适中';
					case 203:
						return '保养适中';
					case 204:
						return '钣喷适中';
				}
			},
			
			getServiceList(chain_services){
				switch (chain_services) {
					case 301:
						return '易损件';
					case 302:
						return '洗车';
					case 303:
						return '轮胎';
					case 304:
						return '美容';
					case 305:
						return '保养';
					case 306:
						return '钣喷';
				}
			},
			

			//读取diy内容
			getDivModel: function() {
				var that = this,
					param = {
						chain_id: this.chain_id
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
					chain_id: that.chain_id,
					store_id: that.commonTPL.chainInfo.store_id
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
								that.$set(that.commonTPL, 'categoryname', data.leaf[0]
									.store_product_cat_name);
								that.$set(that.commonTPL, 'currentCategoryName', data.leaf[0]
									.store_product_cat_name);
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
						chain_id: this.chain_id,
						orderby: 1,
						sort: 2,
						isnew: !1,
						curpage: 1
					}));
				} else {
					that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
						chain_id: this.chain_id,
						orderby: 1,
						sort: 2,
						isnew: !1,
						curpage: 1,
						is_activity: 3
					}));
					that.getProductList();
				}
			},
			clickListNewProduct: function() {
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
						chain_id: this.chain_id,
						sidx: 'product_add_time',
						sord: 'DESC',
						orderby: 1,
						sort: 2,
						isnew: !0,
						curpage: 1,
						chain_id: this.chain_id
					}));
				} else {
					that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
						chain_id: that.chain_id,
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
			clickGetStoreData: function() {
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
						that.$set(that.commonTPL, 'post', Object.assign({}, that.commonTPL.post, {
							curpage: that.commonTPL.post.curpage + 1
						}));
						that.getProductList()
					}, 500)
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
					url: this.Config.URL.store.listsChainProduct,
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
					store_id: that.commonTPL.chainInfo.store_id
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

							//强制shop6
							/*
							that.$set(that.commonTPL, 'TemplateKey', (data.store_template > 1000 ||
									data.store_template === 'shop7') ? 'shopdiy' : data
								.store_template);
							*/
								
							that.$set(that.commonTPL, 'TemplateKey', 'shop6');

							if ('shopdiy' == that.commonTPL.TemplateKey) {

							} else {
								for (var i = 0; i < data.contents['F1ProductContents']
									.length; i++) {
									data.contents['F1ProductContents'][i]['ProductContentID'] =
										data.contents[
											'F1ProductContents'][i]['item_id'];
									data.contents['F1ProductContents'][i]['ProductName'] = data
										.contents[
											'F1ProductContents'][i]['product_name'];
									data.contents['F1ProductContents'][i]['Price'] = data.contents[
										'F1ProductContents'][i]['product_unit_price'];
									data.contents['F1ProductContents'][i]['ImagePath'] = data
										.contents[
											'F1ProductContents'][i]['product_image'];
									data.contents['F1ProductContents'][i]['TitleType'] = data
										.contents[
											'F1TitleType'];
								}


								for (var i = 0; i < data.contents['F2ProductContents']
									.length; i++) {
									data.contents['F2ProductContents'][i]['ProductContentID'] =
										data.contents[
											'F2ProductContents'][i]['item'];
									data.contents['F2ProductContents'][i]['ProductName'] = data
										.contents[
											'F2ProductContents'][i]['name'];
									data.contents['F2ProductContents'][i]['Price'] = data.contents[
										'F2ProductContents'][i]['product_unit_price'];
									data.contents['F2ProductContents'][i]['ImagePath'] = data
										.contents[
											'F2ProductContents'][i]['img'];
									data.contents['F2ProductContents'][i]['TitleType'] = data
										.contents[
											'F2TitleType'];
									data.contents['F2ProductContents'][i]['ProductLinkUrl'] = data
										.contents[
											'F2ProductContents'][i]['url'];
								}

								for (var i = 0; i < data.contents['F3ProductContents']
									.length; i++) {
									data.contents['F3ProductContents'][i]['ProductContentID'] =
										data.contents[
											'F3ProductContents'][i]['item_id'];
									data.contents['F3ProductContents'][i]['ProductName'] = data
										.contents[
											'F3ProductContents'][i]['product_name'];
									data.contents['F3ProductContents'][i]['Price'] = data.contents[
										'F3ProductContents'][i]['product_unit_price'];
									data.contents['F3ProductContents'][i]['ImagePath'] = data
										.contents[
											'F3ProductContents'][i]['product_image'];
									data.contents['F3ProductContents'][i]['TitleType'] = data
										.contents[
											'F3ProductContents'][i]['title'];
									data.contents['F3ProductContents'][i]['ProductLinkUrl'] = data
										.contents[
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
							if (that.commonTPL.smallCategory.length > 0 && that.commonTPL
								.TemplateKey == "shop6") {
								that.$set(that.commonTPL, 'tapindex', 2);
							}

							that.commonTPL.TemplateKey == "shopdiy" && that
								.getDivModel() //shopdiy用户自定义UI
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

			onLikeStore: function(chain_id) {
				favorite.onLikeStore(chain_id, (flag) => {
					this.commonTPL.chainInfo.analytics.store_collect = 1;
					this.commonTPL.chainInfo.analytics.store_favorite_num++;
				})
			},

			onUnlikeStore: function(chain_id) {
				favorite.onUnlikeStore(chain_id, (flag) => {
					this.commonTPL.chainInfo.analytics.store_collect = 0;
					this.commonTPL.chainInfo.analytics.store_favorite_num--;
				})
			},
			previewProductImg: function(e) {
				var that = this,
					n = [];
				for (var r in this.commonTPL.chainInfo.info.store_slide) {
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
				uni.makePhoneCall({
					phoneNumber: e + ''
				})
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
					chain_id: that.options.chain_id,
					is_store: 1,
					city: that.$.getStorageSync("city"),
				};
			},

			cancelShare: function(e) {},
			showCodeImg: function(e) {},
			shareQRCode: function(e) {},
			saveImg: function(e) {},

			shareBox: function(e) {

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.setData({
					shareBoxFlag: 1,
					shareContetnFlag: 1
				});
				// #endif
				// #ifdef MP-WEIXIN
				this.setData({
					PageQRCodeInfo: {
						Path: "",
						IsShare: !0,
						IsShareBox: !0,
						IsJT: !1
					}
				})
				// #endif

				//console.log(this.shareBoxFlag)
			},
			onShareBox: function(e) {
				let that = this;
				var $href = that.$.sprintf('%s/h5/chain/chain/index?chain_id=%d&uid=%d', that.Config.SiteUrl, this.chain_id,
					this.userInfo.user_id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS

				// #endif

				// #ifdef MP-WEIXIN
				$href = "/chain/chain/index?chain_id=" + this.chain_id + "&uid=" + this.userInfo.user_id;
				// #endif

				this.setData({
					shareData: {
						image: this.commonTPL.chainInfo.chain_img,
						title: this.commonTPL.chainInfo.chain_name,
						href: $href,
						path: "/chain/chain/index?chain_id=" + this.commonTPL.chainInfo.chain_id + "&uid=" +
							this.userInfo.user_id

					}
				});

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif

				//海报
				if (e == 3) {
					// #ifndef APP-PLUS
					this.$refs.shareBoxMp.show();
					// #endif
				} else {
					// #ifdef H5
					if (that.$.ifUniApp()) {
						this.$refs.shareBoxH5.show();
					} else {
						this.$refs.shareBoxMp.show();
					}
					// #endif
				}
			}
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

	.m-chainInfo {
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
