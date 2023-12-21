<template>
	<view class="page">
		<view v-if="isShow">
			<view class='notHave' v-if="Info.IsEnabled != true">
				<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/construction.png'></image>
				<view class='notText'>{{__('积分商城正在建设中...')}}
				</view>
			</view>
			<view v-if="Info.IsEnabled == true">
				<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav" :loadPageFlag="loadPageFlag"></diy>
				<view class='forRecordBox'>
					<view class='headPortrait' @click.stop='vipImg'>
						<image :src='vipInfo.user_avatar'></image>
					</view>
					<view class='nickBox'>
						<navigator url="/integral/integral/integral">
							<view class='nick'>
								<view class="nickName">{{userInfo.user_nickname}}</view>
								<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/gold.png'></image><text class='vip'>{{vipInfo.user_level_name}}</text>
							</view>
							<view class='usable'><text>{{__('可用积分')}}：</text><text>{{vipInfo.user_points || 0 }}</text></view>
						</navigator>
					</view>
					<navigator url="/integral/integral/record" class='recordBox'>
						<view>
							<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/hist.png'></image><text>{{__('兑换记录')}}</text>
							<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/arrow.png'></image>
						</view>
					</navigator>
				</view>
				<view :class="flag4?'cover':''" style="z-index:9"></view>
				<view class='overbalance' v-if="mostParticipants.length >0">
					<view class='overbalanceTitle'>
						<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/gift lite.png'></image><text>{{__('超值热兑')}}</text>
					</view>
					<scroll-view class='overbalanceConversion' scroll-x='true'>
						<block v-for="(item, index) in mostParticipants" :key="index">
							<!--积分兑换产品-->
							<button @click="details" class='everyConversion' id="item.ProductOractivity_id" v-if="item.activity_type == 1">
								<image :src='item.activity_rule.voucher_image'></image><text class='titel'>{{item.activity_name}}</text>
								<view class='integralBtn'><text>{{item.activity_rule.requirement.points.needed}}{{__('积分')}}</text><button>{{__('兑换')}}</button></view>
							</button>
							<!--积分兑换优惠券-->
							<button @click="exchangeCoupon" class='everyConversion' :data-id='item.activity_id' :data-eventId='item.activity_type_id'
							 v-if="item.Type == 2">
								<view class='moreCoupon'>
									<view>{{__('￥')}}
										<text>{{item.DiscountMoney}}</text></view>
									<view><text>{{item.CouponUserDesc}}</text></view>
								</view><text class='titel'>{{item.Name}}</text>
								<view class='integralBtn'><text>{{item.ProductPoint}}{{__('积分')}}</text><button>{{__('兑换')}}</button></view>
							</button>
						</block>
					</scroll-view>
				</view>
				<view class='conversionTitle' v-if="three">
					<view :class="tabTrue?'titleTab ItemsIndex':'titleTab'" :data-type="1" @click.stop='forTab'>{{__('积分商品')}}</view>
					<view :class="tabTrue==false?'ItemsIndex':''" :data-type="2" @click.stop='forTab'>{{__('积分兑劵')}}</view>
					<view class='filtrate' @click.stop='sizeTab' v-if="tabTrue">
						<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/filler.png'></image><text>{{__('筛选')}}</text>
					</view>
				</view>
				<view v-else>
					<view class='onlyMall' v-if="forGoods">
						<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/basket.png'></image>
						<view class='titleTab'>{{__('积分商品')}}</view>
						<view class='filtrate' @click.stop='sizeTab'>
							<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/filler.png'></image><text>{{__('筛选')}}</text>
						</view>
					</view>
					<view class='onlyCoupon' v-if="forConvertible">
						<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/coupon@1x.png'></image>
						<view class='titleTab'>{{__('积分兑券')}}</view>
						<view class='filtrate' @click.stop='sizeTab'>
							<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/filler.png'></image><text>{{__('筛选')}}</text>
						</view>
					</view>
				</view>
				<view class='sizerBox' :style='{"z-index":sizerIsShow, visibility:hideShow}'>
					<view class='sortTit'>{{__('排序')}}</view>
					<view class='sizer'>
						<block v-for="(item, index) in sizer" :key="index">
							<view :data-index='index+1' :class="(index+1)==swithType?'Items':''" @click.stop='sizerCondition'>{{item}}</view>
						</block>
					</view>
					<view style='font-size: 24upx;line-height: 33upx;color: #000000;margin-bottom: 23upx;'>{{__('积分区间')}}</view>
					<form @submit='confirm'>
						<view class='InputBox'><input :placeholder='__("最低积分")' type='number' v-model='minNum' name="minNum" placeholder-class='place'></input><text
							 style='font-size:24upx;margin:0 9upx;'>-</text><input :placeholder='__("最高积分")' type='number' v-model='maxNum' name="maxNum"
							 placeholder-class='place'></input></view>
						<view class='resetBtn'>
							<button @click.stop='reset'>{{__('重置筛选条件')}}</button><button form-type='submit'>{{__('确定')}}</button></view>
					</form>
				</view>
				<view class='commodityBox' v-if="tabTrue == true&&forGoods">
					<view v-if="commodityList.length <= 0" class="expect">{{__('积分商品正在备货中')}}
					</view>
					<block v-for="(item, index) in commodityList" :key="index">
						<view class='commodityLeft' @click.stop='details' :id="item.item_id">
							<image :src='item.product_image'></image><text>{{item.product_name}}</text>
							<view class='price'>
								<view>{{number_format(item.product_unit_points)}} {{__('积分')}}</view>
								<view>
									<view v-if="item.IsShowSoldAmount">{{__('已售')}} {{item.product_sale_num}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="m-coupon-item" v-if="tabTrue == false&&forConvertible">
					<view v-if="couponListityList.length <= 0" class="expect">{{__('积分兑券活动正在准备中')}}
					</view>
					<block v-for="(item, index) in couponListityList" :key="index">
						<view @click="exchangeCoupon" class="button yes" :data-id='item.activity_id' :data-eventId='item.activity_type_id'
						 :data-showsucessbutton="item.ShowSucessButton">
							<view class="m-coupon-info">
								<view class="m-coupon-text"><label>{{item.activity_name}}</label>
									<view class='CouponUserDesc_box'>
										<view class="text1">{{item.activity_note}}</view>
									</view>
									<view class='integralVal'><text>{{__('￥')}}</text><text>{{item.activity_rule.voucher_price}}</text><text>{{item.activity_rule.requirement.points.needed}}{{__('积分兑换')}}</text></view>
								</view>
							</view>
							<view class='but_box'>
								<view class='but_top'>
									<view class='but_rule'><text style='padding-top:18upx;'>{{__('已兑')}}</text><text style='font-size: 30upx;'>{{item.activity_rule.voucher_quantity_use || 0 }}</text></view>
								</view>
								<view class='lingqu' v-if="item.ShowSucessButton == true">{{__('已兑完')}}
								</view>
								<view class='lingqu' v-else>{{__('立即兑换')}}
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="m-loading-box" v-if="commodityList.length>0&&tabTrue">
					<block v-if="ispage">
						<view class="u-loadmore"><label class="u-loading"></label><text class="u-loadmore-tips">{{__('正在加载')}}</text></view>
					</block>
					<block v-else>
						<view class="u-loadmore u-loadmore-line"><text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text></view>
					</block>
				</view>
				<view class="m-loading-box" v-if="couponListityList.length>0&&tabTrue ==false">
					<block v-if="ispageCon">
						<view class="u-loadmore"><label class="u-loading"></label><text class="u-loadmore-tips">{{__('正在加载')}}</text></view>
					</block>
					<block v-else>
						<view class="u-loadmore u-loadmore-line"><text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text></view>
					</block>
				</view>
			</view>
			<view class="msk2" v-if="!flag" @tap="outertouch">
				<view class='m-coupon-box' @click.stop='innertouch'>
					<view class='coupon_title'>{{__('兑换成功')}}</view>
					<view class='coupon_back' style=''>
						<view style='width:100%;height:280upx;background:#fff;border-top-left-radius: 20upx;border-top-right-radius: 20upx'>
							<view class='shopbox'>
								<view class='shop_name'>{{Coupons.activity_name}}
								</view>
							</view>
							<view class='context_box'>
								<view v-if="islength.length<4" class='left'><text style='font-size:48upx'>{{__('￥')}}</text><text style='font-size:80upx'>{{Coupons.activity_rule.voucher_price}}</text></view>
								<view v-else class='left2'><text style='font-size:26upx'>{{__('￥')}}</text><text style='font-size:70upx'>{{Coupons.activity_rule.voucher_price}}</text></view>
								<view class='right' v-if="islength.length<4">
									<view class='youhuiquan' style='font-size:28upx'>{{Coupons.CouponMoneyLimitDec}}</view>
									<view class='manjian' style='font-size:24upx'>{{Coupons.CouponTypeDec}}</view>
								</view>
								<view v-else class='right'>
									<view class='youhuiquan' style='font-size:28upx'>{{Coupons.CouponMoneyLimitDec}}</view>
									<view class='manjian' style='font-size:24upx'>{{Coupons.CouponTypeDec}}</view>
								</view>
							</view>
							<view class='youxiaoqi'><text>{{Coupons.StrValidateEnd}}</text></view>
						</view>
						<view style='width:100%;height:32upx'>
							<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/partingLine.png' style='width:100%;height:100%;vertical-align:top;'></image>
						</view>
						<view style='width:100%;height:136upx;background:#fff;border-bottom-left-radius: 20upx;border-bottom-right-radius: 20upx'>
							<navigator class='lijishiyong_box' :url="'/pagesub/index/store?store_id=' + Coupons.store_id" hover-class='none'>
								<view class='lijishiyong'>{{__('立即使用')}}</view>
							</navigator>
						</view>
						<view class="close_msk1" v-if="!flag" @click.stop="outertouch">
							<image style="width:50upx;height:50upx" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/delete.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view :class="[animation ? '' : 'zhezhaoceng']">
		<movable-area class="movableArea">
			<movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
				<view class="u-top" v-if="isnav">
					<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_icon_nav.png' class='quicknav' @tap='nav'></image>
					<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_gotop.png' :class='[isquicknav?"quicknav":"hide"]'
					 @tap="returnTop"></image>
				</view>
				<view v-else @tap='outnav'>
					<view class="u-top1">
						<view style='position:relative'>
							<navigator :class="animation?'navtext1':'navtext'" url='/pages/index/index' open-type='switchTab'><text>{{__('首页')}}</text>
								<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/homePage.png' class='quicknav'></image>
							</navigator>
							<navigator :class="animation?'navtext1':'navtext'" url='/member/member/coupon'><text>{{__('优惠券')}}</text>
								<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/myticket.png' class='quicknav'></image>
							</navigator>
							<navigator :class="animation?'navtext1':'navtext'" url='/member/member/task'><text>{{__('会员中心')}}</text>
								<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/vipcentre.png' class='quicknav'></image>
							</navigator>
							<navigator :class="animation?'navtext1':'navtext'" url='/pages/index/member' open-type='switchTab'><text>{{__('个人中心')}}</text>
								<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/personal.png' class='quicknav'></image>
							</navigator>
							<view class='navtext'>
								<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_icon_close.png' class='quicknav'></image>
							</view>
						</view>
					</view>
				</view>
			</movable-view>
		</movable-area>
		</view>
		<view class="alert" v-if="flag3" style="z-index:1000">
			<image style="width:50upx;height:50upx" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/true.png"></image><text
			 style="margin-left:20upx">{{Info1.Describe}}</text>
		</view>
		<view class="alert1" v-if="flag4" style="z-index:1000">
			<view>{{__('抱歉！今日您已签到')}}</view>
			<view style="margin-top:20upx">{{__('~明天再来哦~')}}</view>
		</view>
		<view class='u-top3' style='z-index:10' v-if="hasSigned ==false">
			<view style="width: 120upx;height: 60upx;position: ：relative;">
				<button hover-class='none' style="box-shadow:4px 1px  15px 1px rgba(0,0,0,0.1)" class='anniu_qd' v-if="hasSigned ==false"
				 @tap="click">
					<image class='inter_bj' style="box-shadow:20px 2px  10px 2px rgba(0,0,0,0.1)" src='/static/images/integra.png'></image>
				</button>
			</view>
		</view>
		<view class='u-top3' style='z-index:10' v-else>
			<view style="width: 136upx;height: 60upx;position: ：relative;">
				<image class='inter_bj' style="" src='/static/images/true_qd.png'></image>
				<view v-if="hasSigned ==true" style="font-size: 26upx;color: #ebebe7;position: absolute;top: 19%;left:26%;" @tap="click">{{__('已签到')}}
				</view>
			</view>
		</view>


	</view>
</template>


<script>

	import diy from '../../components/themes/diy.vue'
	import dateUtil from "../../helpers/util_date";

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				ShareImg: '',
				ShareTitle: '',

				pageId: '',
				loadPageFlag: false,
				PageContent: [],
				BgConfig: {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}},
				PageNav:{window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}},

				scposition: -1,
				old: {
					scposition: 0
				},
				screenHeight: 37,
				nextflg: !0,
				flag4: !1,
				flag1: !1,
				three: "",
				forGoods: "",
				forConvertible: "",
				tabTrue: !0,
				commodityBox: "",
				couponItem: "none",
				sizerIsShow: "-1",
				hideShow: "hidden",
				IsTab: !1,
				vipInfo: {},
				mostParticipants: "",
				sizer: ["默认", "人气", "积分", "新品"],
				swithType: 1,
				commodityList: [],
				Info: {
					EPointSlideList: [{'ImageUrl':'', 'url':'/pages/index/index'},{'ImageUrl':'', 'url':'/pages/index/index'}],
					IsEnabled: true
				},
				couponListityList: [],
				pageIndex: 1,
				commodityPageIndex: 1,
				minNum: '',
				maxNum: '',
				flag: !0,
				Coupons: "",
				Id: "",
				ispage: !0,
				ispageCon: !0,
				isquicknav: !1,
				isnav: !0,
				isShow: !1,
				hasSigned: !1,
				flag3: !1,
				Info1: {},

				animation: !0,
				islength: !1,
				initX: '690',
				initY: '1336',
				opacity: 1,
				background: "f8f8f8"
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			diy
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
				title:this.__('积分商城')
			});
			var that = this;

			that.sizer =  [that.__("默认"), that.__("人气"), that.__("积分"), that.__("新品")];


			if (that.hasLogin) {} else {}

			that.initialize();
			that.load();


			that.findUsablePoint();

			that.GetEPointCouponList(that.commodityPageIndex);

			that.GetEPointProductList(that.pageIndex);

			that.$.getSystemInfo({
			    success: function (t) {
			        that.setData({screenHeight: t.screenHeight})
			    }
			});


			that.initData(false);
		},

		onShow: function() {},
		onPullDownRefresh: function() {
			var that = this;

			that.initialize();
			that.load();

			that.findUsablePoint();
			/*
         that.GetFavoriteEPointEventList();
         */


			that.GetEPointCouponList(that.commodityPageIndex);

			that.GetEPointProductList(that.pageIndex);

			wx.stopPullDownRefresh()
		},
		onReachBottom: function() {
			if (this.nextflg) {
				var that = this;
				clearTimeout(t);
				var t = setTimeout(function() {
					if (1 == that.tabTrue && that.ispage) {
						that.setData({
							pageIndex: that.pageIndex + 1
						});
						that.GetEPointProductList(that.pageIndex)
					}

					if (0 == that.tabTrue && that.ispageCon) {
						that.setData({
							commodityPageIndex: that.commodityPageIndex + 1
						});
						that.GetEPointCouponList(that.commodityPageIndex)
					}
				}, 500)
			}
		},
		onShareAppMessage: function() {
			return {
				title: this.ShareTitle,
				imageUrl: this.ShareImg || "",
				path: "/integratShop/integralPage/integralPage?uid=" + this.userInfo.Id
			}
		},
		/**
		 * 页面滚动触发事件的处理函数
		 */
		onPageScroll: function(e) {
			this.scroll(e)
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),

			//初始化数据，获取店铺分类
			initData: function(force_refresh) {
				var that = this;
				that.getDivModel(force_refresh)
			},
			doNothing: function() {
			},

			//读取diy内容
			getDivModel: function(force_refresh) {
				var that = this,
					params = {page_type:'page_point'};

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
							pageId: data.page_id,
							PageContent: that.$.parseJSON(data.page_code),
							BgConfig: that.$.parseJSON(data.page_config),
			                PageNav: that.$.parseJSON(data.page_nav),
							ShareImg: data.page_share_image,
							ShareTitle: data.page_share_title,
							loadPageFlag: true
						});
					}
				});
			},

			initialize: function() {
				var that = this,
					params = {
						//vendorId: that.cf.storeId
					};

				/*

				that.$.request({
				    url: this.Config.URL.user.voucherList,
				    data: params,
				    success: function (data, status, msg, code) {
				        if (status == 200) {
				            data.Info.EPointSlideList.length <= 0 && that.setData({
				                showHide: "none"
				            });

				            var a = data.Info.ExchangeSwitchState,
				                e = 1 == (1 & a),
				                o = 2 == (2 & a),
				                n = e && o;
				            0 == e && that.setData({
				                tabTrue: !1
				            }), that.setData({
				                Info: data.Info,
				                forGoods: e,
				                forConvertible: o,
				                three: n,
				                isShow: !0
				            })
				            } else {
				                that.setData({
				                    isShow: !0
				                })
				            }
				        }
				    }
				});
				*/
				that.setData({
					//Info: data.Info,
					forGoods: true,
					forConvertible: true,
					three: true,
					isShow: !0
				})
			},
			findUsablePoint: function() {
				var that = this,
					params = {
						user_id: this.userInfo.Id,
						//VendorId: that.cf.storeId
					};
				that.setData({
					vipInfo: that.userInfo
				})
			},
			GetFavoriteEPointEventList: function() {
				var that = this,
					params = {
						//vendorId: that.cf.storeId
					};

				that.$.request({
					url: this.Config.URL.user.voucherList,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
							    mostParticipants: data.Info
							})
						}
						else {}
					}
				})

				/*
				that.$.xsr(that.$.makeUrl(integraiAPI.GetFavoriteEPointEventList, t), function(t) {
				    //console.log("res", t), 0 == t.Code && a.setData({
				        mostParticipants: t.Info
				    })
				})
				*/
			},
			GetEPointProductList: function(page) {
				var that = this,
					params = {
						//vendorId: that.cf.storeId,
						swithType: that.swithType,
						points_from: that.minNum,
						points_to: that.maxNum,
						rows: 10,
						page: page
					};


				that.$.request({
					url: this.Config.URL.point.product,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							let tmp = [];
								tmp = that.commodityList.concat(data.items);
							if (data.page >= data.total) {
								that.setData({
									commodityList: tmp,
									ispage: false
								})
							} else {
								that.setData({
									commodityList: tmp,
									ispage: true
								})
							}

						} else {}
					}
				})

				/*
				that.$.xsr1(that.$.makeUrl(integraiAPI.GetEPointProductList, params), function(t) {
				    if (0 == t.Code && that.setData({
				        commodityList: that.commodityList.concat(t.Info),
				        ispage: !0
				    }), 1 == t.Code) {
				        if (1 < that.pageIndex) {
				            var a = that.pageIndex;
				            a--
				        }
				        that.setData({
				            pageIndex: a,
				            ispage: !1
				        })
				    }
				})
				*/
			},
			GetEPointCouponList: function(page) {
				var that = this,
					params = {
						//vendorId: that.cf.storeId,
						swithType: that.swithType,
						points_from: that.minNum,
						points_to: that.maxNum,
						rows: 10,
						page: page
					};

				that.$.request({
					url: this.Config.URL.point.voucher,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							let tmp = [];
							tmp = that.couponListityList.concat(data.items);
							if (data.page >= data.total) {
								that.setData({
									couponListityList: tmp,
									ispageCon: false
								})
							} else {
								that.setData({
									couponListityList: tmp,
									ispageCon: true
								})
							}

						} else {}
					}
				})
			},
			details: function(t) {
				wx.navigateTo({
					url: "/integral/integral/product?pid=" + t.currentTarget.id
				})
			},
			exchangeCoupon: function(t) {
				var that = this,
					i = t.currentTarget.dataset.id;
				that.setData({
					Id: i
				}), t.currentTarget.dataset.showsucessbutton ? that.$.alert(that.__("来晚了，已兑完")) : wx.showModal({
					title: that.__("提示"),
					content: that.__("是否确认兑换？"),
					success: function(t) {
						if (t.confirm) {
							var a = {
								//vendorId: that.cf.storeId,
								user_id: that.userInfo.user_id,
								couponId: i
							};



							var params = {
								activity_id: i,
								user_is_new: 0
							};
							that.$.request({
								url: that.Config.URL.user.voucher_add,
								data: params,
								success: function(t, status, msg, code) {
									that.reloadUserResource(function (user_info) {
										return user_info;
									});

									if (200 == status) {
										for (var a = that.couponListityList, e = 0, o = a.length; e < o; e++) {
											if (i === a[e].activity_id)
											{
												a[e].activity_rule.voucher_quantity_use++;
											}
										}

										that.setData({
											Coupons: t,
											couponListityList: a,
											flag: !1
										})
										
									} else {
										that.$.alert(msg);
									}
								},
							});

						}
					}
				})
			},
			sizerCondition: function(t) {
				this.setData({
					swithType: t.currentTarget.dataset.index
				})
			},
			confirm: function(a) {
				var that = this;
				if (parseInt(a.detail.value.minNum) > parseInt(a.detail.value.maxNum)) that.$.alert(that.__("请输入正确的积分区间"));
				else {
					if (that.setData({
							IsTab: !1,
							sizerIsShow: "-2",
							hideShow: "hidden",
							pageIndex: 1
						}), 1 == that.tabTrue) {
						var params = {
							//vendorId: that.cf.storeId,
							swithType: that.swithType,
							points_from: a.detail.value.minNum ? parseInt(a.detail.value.minNum) : 0,
							points_to: a.detail.value.maxNum ? parseInt(a.detail.value.maxNum) : 0,
							rows: 10,
							page: 1
						};



						that.$.request({
							url: this.Config.URL.point.product,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									if (data.items.length > 0) {
										that.setData({
											commodityList: []
										});

										if (data.page >= data.total) {
											that.setData({
												commodityList: that.commodityList.concat(data.items),
												minNum: parseInt(a.detail.value.minNum),
												maxNum: parseInt(a.detail.value.maxNum),
												ispage: false
											})
										} else {
											that.setData({
												commodityList: that.commodityList.concat(data.items),
												minNum: parseInt(a.detail.value.minNum),
												maxNum: parseInt(a.detail.value.maxNum),
												ispage: true
											})
										}
									} else {
										setTimeout(function() {
											wx.showModal({
												title: that.__("提示"),
												content: that.__("抱歉，没有找到符合条件的商品，请重新筛选"),
												showCancel: !1
											})
										}, 650)
									}
								} else {
									setTimeout(function() {
										wx.showModal({
											title: that.__("提示"),
											content: that.__("抱歉，没有找到符合条件的商品，请重新筛选"),
											showCancel: !1
										})
									}, 650)
								}
							}
						})
					}
					if (0 == that.tabTrue) {
						params = {
							//vendorId: that.cf.storeId,
							swithType: that.swithType,
							points_from: parseInt(a.detail.value.minNum),
							points_to: parseInt(a.detail.value.maxNum),
							pageSize: 10,
							commodityPageIndex: that.pageIndex
						};
						that.setData({
							commodityPageIndex: 1
						});



						params = {
							//vendorId: that.cf.storeId,
							swithType: that.swithType,
							points_from: that.minNum,
							points_to: that.maxNum,
							rows: 10,
							page: 1
						};

						that.$.request({
							url: this.Config.URL.point.voucher,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									if (data.items.length > 0) {
										that.setData({
											couponListityList: []
										});

										if (data.page >= data.total) {
											that.setData({
												couponListityList: that.couponListityList.concat(data.items),
												minNum: parseInt(a.detail.value.minNum),
												maxNum: parseInt(a.detail.value.maxNum),
												ispage: false
											})
										} else {
											that.setData({
												couponListityList: that.couponListityList.concat(data.items),
												minNum: parseInt(a.detail.value.minNum),
												maxNum: parseInt(a.detail.value.maxNum),
												ispage: true
											})
										}
									} else {
										setTimeout(function() {
											wx.showModal({
												title: that.__("提示"),
												content: that.__("抱歉，没有找到符合条件的商品，请重新筛选"),
												showCancel: !1
											})
										}, 650)
									}
								} else {
									setTimeout(function() {
										wx.showModal({
											title: that.__("提示"),
											content: that.__("抱歉，没有找到符合条件的商品，请重新筛选"),
											showCancel: !1
										})
									}, 650)
								}
							}
						})


					}
				}
			},
			reset: function() {
				this.setData({
					swithType: 1,
					minNum: null,
					maxNum: null,
					commodityList: [],
					couponListityList: []
				})

				this.GetEPointProductList(this.pageIndex)
				this.GetEPointCouponList(this.commodityPageIndex)
			},
			outertouch: function() {
				this.setData({
					flag: !0
				})
			},
			vipImg: function() {
				wx.navigateTo({
					url: "/pages/index/member"
				})
			},
			innertouch: function() {
				this.setData({
					flag: !1
				})
			},
			skip: function(t) {
				let that = this;
				if ("" != t.currentTarget.dataset.linkurl) {
					t.currentTarget.dataset.linkurl;
					that.$.goToTabBar(null, "../../" + t.currentTarget.dataset.linkurl)
				}
			},
			sizeTab: function() {
				this.IsTab ? this.setData({
					IsTab: !1,
					sizerIsShow: "-2",
					hideShow: "hidden"
				}) : this.setData({
					IsTab: !0,
					sizerIsShow: "2",
					hideShow: ""
				})
			},
			forTab: function(t) {
				//console.info('sssssssssss')
				var a = this.tabTrue;
				var type = t.currentTarget.dataset.type;

				1 == type && this.setData({
					tabTrue: !0
				});

				2 == type && this.setData({
					tabTrue: !1
				});

				a && 1 == type && this.setData({
					commodityBox: "none",
					couponItem: ""
				});

				0 == a && 2 == type && this.setData({
					commodityBox: "",
					couponItem: "none"
				});
				
				this.setData({
					hideShow: "hidden"
				})
			},
			click: function() {
				var that = this;
				var param = {
					user_id: this.userInfo.user_id,
					//VendorId: that.cf.storeId
				};
				//console.log("签到", param);


				that.$.request({
					url: this.Config.URL.user.signIn,
					data: param,
					success: function(data, status, msg, code) {
						that.reloadUserResource(function (user_info) {
						});

						that.setData({
							Info1: {
								Describe: msg
							}
						});

						if (200 == status) {
							that.setData({
								flag3: !0
							}), setTimeout(function() {
								that.setData({
									flag3: !1
								})
							}, 2e3), that.findUsablePoint()
						} else {
							that.setData({
								flag4: !0
							}), setTimeout(function() {
								that.setData({
									flag4: !1
								})
							}, 2e3)
						}

						that.load()
					}
				});
			},
			load: function() {
				var that = this;


				//是否已经签到
				var params = {
					user_id: this.userInfo.user_id,
				};

				that.$.request({
					url: this.Config.URL.user.signState,
					data: params,
					success: function(data, status, msg, code) {
						that.setData({
							hasSigned: data.state == 250 ? true : false
						})
					}
				});


				var params = {
					user_id: this.userInfo.Id,
					//VendorId: that.cf.storeId
				};


				that.$.request({
					url: this.Config.URL.point.index,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								mostParticipants: data.voucherlist,
								//couponListityList: data.voucherlist,
								//commodityList: data.items
							});
						} else {}
					}
				})

			},
			scrollbottom: function(t) {
				if (this.nextflg) {
					var that = this;
					setTimeout(function() {

						if (1 == that.tabTrue && ispage) {
							var t = that.pageIndex;
							t++, that.setData({
								pageIndex: t
							}), that.GetEPointProductList(that.pageIndex)
						}

						if (0 == that.tabTrue && ispageCon) {
							var a = that.commodityPageIndex;
							a++, that.setData({
								commodityPageIndex: a
							}), that.GetEPointCouponList(that.commodityPageIndex)
						}
					}, 500)
				}
			},
			scrolltoupper: function(t) {
				t.detail.scrollTop >= this.screenHeight ? this.setData({
					isquicknav: !0
				}) : this.setData({
					isquicknav: !1
				})
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
			returnTop: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			nav: function() {
				this.setData({
					isnav: !1,
					animation: !1
				})
			},
			outnav: function() {
				var t = this;
				this.setData({
					animation: !0
				}), setTimeout(function() {
					t.setData({
						isnav: !0
					})
				}, 250)
			}
		}
	};
</script>

<style lang="scss">
	@import "../../styles/_variables";
	@import '../../styles/layout.scss';

	.notHave {
		font-family: PingFangSC-Medium;
		font-size: 24upx;
		line-height: 33upx;
		color: #9b9b9b;
		/* letter-spacing: 0; */
		text-align: center;
	}

	.u-top3 {
		position: fixed;
		right: -1upx;
		top: 150upx;
		z-index: 99;
		height: 67upx;
	}

	.notHave image {
		display: block;
		width: 424upx;
		height: 209upx;
		margin: 137upx auto 100upx;
		/* margin-top: 137upx; */
	}

	.notText {
		font-family: PingFangSC-Medium;
		font-size: 26upx;
		line-height: 37upx;
		color: #000;
		margin-top: 40upx;
	}

	.button {
		position: inherit;
		display: flex;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		text-align: initial;
		text-decoration: none;
		line-height: initial;
		border-radius: 0upx;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		color: #000;
		background: none;
		border: none;

		&::after {
			border: none;
		}
	}

	.swiperbox {
		width: 100%;
		height: 424upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.forRecordBox {
		width: 100%;
		height: 160upx;
		margin-bottom: 22upx;
		box-sizing: border-box;
		padding: 30upx;
		display: flex;
		align-items: center;
		background: #fff;
		box-shadow: 0 2px 0 0 #efefef, 0 -2px 0 0 #efefef;
		position: relative;

		.headPortrait {
			width: 100upx;
			height: 100upx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.nickBox {
			margin-left: 20upx;
		}

		.nick {
			font-family: PingFangSC-Regular;
			font-size: 28upx;
			line-height: 40upx;
			color: #000;
		}
	}

	.nickName {
		display: inline-block;
		max-width: 200upx;
		height: 40upx;
		line-height: 40upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
	}

	.forRecordBox {
		.nick {
			image {
				width: 27upx;
				height: 20upx;
				margin-left: 10upx;
				margin-right: 5upx;
			}

			.vip {
				font-size: 22upx;
				color: #ffc129;
				line-height: 30upx;
			}
		}

		.usable {
			margin-top: 10upx;
			font-size: 24upx;
			line-height: 33upx;
			color: #9b9b9b;
		}
	}

	.recordBox {
		position: absolute;
		right: 30upx;

		image {
			width: 21upx;
			height: 22upx;
			margin-right: 19upx;
		}

		text {
			font-size: 24upx;
			line-height: 33upx;
			color: #9b9b9b;
		}

		image:last-child {
			width: 17upx;
			height: 17upx;
			margin-left: 17upx;
		}
	}

	.overbalance {
		width: 100%;
		margin: 22upx auto;
		box-sizing: border-box;
		background: #fff;
		box-shadow: 0 -2px 0 0 #efefef, 0 2px 0 0 #efefef;
	}

	.overbalanceTitle {
		width: 720upx;
		height: 88upx;
		font-family: PingFangSC-Medium;
		font-size: 26upx;
		color: #000;
		font-weight: 500;
		line-height: 37upx;
		margin-left: 30upx;
		padding-top: 27upx;
		padding-bottom: 24upx;
		box-sizing: border-box;
		/* letter-spacing: 0; */
		background: #fff;
		box-shadow: 0 2upx 0 0 #efefef;

		image {
			width: 23upx;
			height: 26upx;
			margin-right: 15upx;
		}
	}

	.overbalanceConversion {
		width: 100%;
		height: 469upx;
		padding: 30upx;
		box-sizing: border-box;
		white-space: nowrap;
		display: flex;
	}

	.everyConversion {
		display: inline-block;
		width: 300upx;
		height: 430upx;
		margin-right: 20upx;
		padding: 20upx 25upx 34upx;
		box-sizing: border-box;
		background: #fff;
		box-shadow: 0 5upx 10upx 0 rgba(0, 0, 0, 0.06);
		border-radius: 8upx;

		.moreCoupon {
			width: 250upx;
			height: 250upx;
			background-image: linear-gradient(-225deg, #f87c5e 0%, #db384c 100%);
			margin-bottom: 24upx;
			border-radius: 8upx;
			text-align: center;
			box-sizing: border-box;
			font-size: 24upx;
			line-height: 33upx;
			padding-top: 55upx;
			color: #fff;
		}
	}

	.moreCoupon view {
		&:first-child {
			width: 100%;
			height: 90upx;
			margin: 0 auto;
			text-align: center;
			font-size: 40upx;

			text {
				font-size: 64upx;
				line-height: 90upx;
			}
		}

		&:last-child {
			width: 100%;
			text-align: center;
			padding: 0 10upx;
			box-sizing: border-box;
			word-wrap: break-word;
			white-space: pre-wrap;
		}
	}

	.everyConversion {
		image {
			display: block;
			width: 250upx;
			height: 250upx;
			margin-bottom: 24upx;
		}

		.titel {
			display: block;
			width: 100%;
			font-family: PingFangSC-Regular;
			font-size: 24upx;
			line-height: 33upx;
			color: #000;
			/* letter-spacing: 0; */
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-bottom: 19upx;
		}

		.integralBtn {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0;
			padding: 0;

			text {
				font-family: PingFangSC-Semibold;
				font-size: 28upx;
				line-height: 40upx;
				color: #db384c;
				/* letter-spacing: 0; */
			}

			button {
				width: 100upx;
				height: 50upx;
				background: #db384c;
				border-radius: 10upx;
				font-family: PingFangSC-Regular;
				font-size: 24upx;
				color: #fff;
				/* letter-spacing: 0; */
				padding: 0;
				margin: 0;
				line-height: 50upx;
			}
		}
	}

	.sizerBox {
		width: 100%;
		height: 470upx;
		padding: 20upx 20upx 76upx 46upx;
		box-sizing: border-box;
		background: #fff;
		box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.12);
		position: absolute;
		z-index: 2;
	}

	.sortTit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: PingFangSC-Medium;
		font-size: 24upx;
		line-height: 33upx;
		color: #000;
		margin-bottom: 23upx;

		>view:last-child {
			font-size: 24upx;
			color: #db384c;
			border-bottom: 2upx solid #db384c;
		}
	}

	.sizer {
		display: flex;
		align-items: center;

		view {
			width: 100upx;
			height: 56upx;
			text-align: center;
			line-height: 56upx;
			font-size: 24upx;
			color: #9b9b9b;
			margin-right: 20upx;
			background: #fff;
			border: 1px solid #dfdfdf;
			border-radius: 8upx;
			box-sizing: border-box;
			margin-bottom: 30upx;

			&.Items {
				background: #fff9fa;
				border: 1px solid #db384c;
			}
		}
	}

	.InputBox {
		display: flex;
		align-items: center;
	}

	.place {
		font-size: 24upx;
		color: #9b9b9b;
	}

	.InputBox input {
		width: 280upx;
		height: 56upx;
		font-size: 24upx;
		background: #f8f8f8;
		border-radius: 8upx;
		text-align: center;
	}

	.resetBtn {
		display: flex;
		align-items: center;
		margin-top: 40upx;
		border-top: 3px solid #efefef;
		padding: 41upx 0;
		box-sizing: border-box;

		button {
			background: #db384c;
			border-radius: 10upx;
			width: 300upx;
			height: 70upx;
			padding: 0;
			margin: 0;
			font-size: 28upx;
			line-height: 70upx;
			color: #fff;

			&:first-child {
				background: #f5f5f5;
				border: 2upx solid #e8e8e8;
				box-sizing: border-box;
				color: #808080;
				margin-right: 20upx;
			}
		}
	}

	.conversionTitle,
	.onlyMall,
	.onlyCoupon {
		width: 100%;
		height: 88upx;
		padding: 0 30upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		font-size: 26upx;
		font-weight: 500;
		line-height: 37upx;
		color: #9d9d9d;
		background: #fff;
		position: relative;
	}

	.conversionTitle>view {
		height: 88upx;
		line-height: 86upx;
		box-sizing: border-box;
	}

	.ItemsIndex {
		color: #db384c;
		font-weight: 500;
		border-bottom: 4upx solid #db384c;
	}

	.onlyMall image,
	.onlyCoupon image {
		width: 26upx;
		height: 26upx;
		margin-top: -6upx;
		vertical-align: middle;
		margin-right: 11upx;
	}

	.titleTab {
		margin-right: 50upx;
	}

	.filtrate {
		position: absolute;
		right: 30upx;

		image {
			width: 24upx;
			height: 20upx;
			margin-right: 15upx;
		}
	}

	.commodityBox {
		display: flex;
		align-content: center;
		flex-wrap: wrap;
		min-height: 1000upx;
	}

	.expect {
		width: 100%;
		margin-top: 50upx;
		text-align: center;
		font-size: 33upx;
	}

	.commodityBox .commodityLeft:nth-child(odd) {
		margin-right: 10upx;
	}

	.commodityLeft {
		width: 370upx;
		height: 490upx;
		padding: 20upx 30upx;
		box-sizing: border-box;
		background: #fff;
		border: 2upx solid #efefef;
		margin-bottom: 10upx;

		&:first-child,
		&:nth-child(2) {
			margin-top: 0;
		}

		image {
			width: 310upx;
			height: 310upx;
			margin-bottom: 15upx;
		}

		>text {
			display: block;
			width: 100%;
			font-family: PingFangSC-Regular;
			font-size: 24upx;
			line-height: 33upx;
			color: #000;
			/* letter-spacing: 0; */
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.price {
		margin-top: 28upx;
		margin-bottom: 28upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;

		>view {
			&:first-child {
				/* display: block; */
				font-family: PingFangSC-Semibold;
				font-size: 28upx;
				line-height: 40upx;
				font-weight: 600;
				color: #db384c;
				max-width: 300upx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			&:last-child {
				/* display: block; */
				font-family: PingFangSC-Regular;
				font-size: 22upx;
				line-height: 30upx;
				color: #9b9b9b;
				/* letter-spacing: 0; */
			}
		}
	}

	.m-coupon-item {
		min-height: 1000upx;
	}

	.yes {
		width: 700upx;
		height: 192upx;
		margin: 00upx auto;
		padding: 12upx;
		box-sizing: border-box;
		background: url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/coupon_bg.png) center no-repeat;
		background-size: 100%;
		display: flex;
		align-items: center;
	}

	/* .m-coupon-info { float: left; width: 520upx; margin-left: 18upx; margin-top: 25.5upx; } */

	.m-coupon-info {
		width: 520upx;
		/* margin-left: 18upx; margin-top: 25.5upx; */
		/* display: flex; flex-direction: column; */
		padding-left: 18upx;
		box-sizing: border-box;
		height: 100%;
	}

	.m-coupon-text {
		/* float: left; width: 490upx; */
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		label {
			color: #333;
			font-size: 28upx;
			width: 100%;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		text {
			display: inline-block;
			font-size: 20upx;
			color: #999;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			padding-top: 10upx;
			box-sizing: border-box;
		}
	}

	/* .CouponUserDesc_box { display: flex; padding-top: 13upx; align-items: center; } */

	.CouponUserDesc_box {
		margin-top: 13upx;
	}

	.text1 {
		font-size: 24upx;
		color: #9b9b9b;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 5upx 10upx;
		max-width: 360upx;
	}

	.but_box {
		width: 150upx;
		height: 95%;
		float: left;
		position: relative;
	}

	.but_top {
		width: 105upx;
		height: 90upx;
		overflow: hidden;
		position: absolute;
		top: 17upx;
		left: 37upx;
	}

	.but_rule {
		width: 100upx;
		height: 100upx;
		border: 1upx solid #f43032;
		border-radius: 100%;
		color: #f43032;
		text-align: center;
		font-size: 22upx;
	}

	.integralVal text {
		font-family: PingFangSC-Semibold;
		font-size: 22upx;
		line-height: 30upx;
		color: #db384c;

		&:nth-child(2) {
			font-size: 38upx;
			line-height: 40upx;
			margin-right: 24upx;
		}
	}

	.but_rule text {
		display: block;
		line-height: 30upx;
	}

	.lingqu {
		font-size: 22upx;
		background-color: #f43032;
		padding: 8upx 5upx;
		color: #fff;
		border-radius: 77upx;
		width: 129upx;
		text-align: center;
		bottom: 0;
		left: 20upx;
		position: absolute;
	}

	.msk2 {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	.m-coupon-box {
		background-color: #db384c;
		padding: 10upx 25upx 35upx 25upx;
		border-radius: 35upx;
		width: 62%;
		margin: 25% auto;
	}

	.coupon_title {
		font-size: 52upx;
		color: #fff;
		margin: 30upx auto;
		text-align: center;
		letter-spacing: 3upx;
	}

	.coupon_back {
		width: 468upx;
		height: 450upx;
	}

	.shopbox {
		display: flex;
		align-items: center;
		padding: 28upx 48upx 22upx 38upx;
	}

	.shop_name {
		font-size: 28upx;
	}

	.context_box {
		margin: 10upx auto 0;
		display: flex;
		align-items: center;
		color: #db384c;
	}

	.left {
		margin-right: 20upx;
		text-align: center;
		width: 30%;
		max-width: 45%;
		overflow: hidden;
	}

	.left2 {
		margin-right: 20upx;
		text-align: center;
		width: 35%;
		max-width: 50%;
		overflow: hidden;
		line-height: 53px;
		font-size: 38upx;
	}

	.right {
		margin: auto 0;
		overflow: hidden;
	}

	.youhuiquan {
		border-bottom: 1upx solid #db384c;
		overflow: hidden;
		height: 47upx;
		max-width: 280upx;
		line-height: 43upx;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.manjian {
		max-width: 306upx;
		line-height: 50upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.youxiaoqi {
		font-size: 24upx;
		color: #999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding-top: 22upx;
		/* text-align: center; */
		padding-left: 38upx;
	}

	.lijishiyong_box {
		width: 100%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lijishiyong {
		width: 250upx;
		height: 60upx;
		background-color: #db384c;
		color: #fff;
		border-radius: 35upx;
		letter-spacing: 4upx;
		text-align: center;
		font-size: 28upx;
		line-height: 60upx;
		margin-top: 32upx;
	}

	.close_msk1 {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 124upx;
	}

	.cover {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0px;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
	}

	.alert {
		font-size: 32upx;
		width: 70%;
		height: 200upx;
		position: fixed;
		left: 15%;
		top: 40%;
		background: #fff;
		border-radius: 10upx;
		justify-content: center;
		display: flex;
		align-items: center;
	}

	.anniu_qd {
		font-size: 12px;
		color: #292929;
		padding-left: 0;
		padding-right: 0;
		line-height: 38upx;
		letter-spacing: 10upx;
		background: #fff;
		width: 120upx;
		height: 60upx;
		border-radius: 0;
		border-top-left-radius: 36upx;
		border-bottom-left-radius: 36upx;
	}

	.alert1 {
		font-size: 32upx;
		width: 70%;
		height: 200upx;
		position: fixed;
		left: 15%;
		top: 40%;
		background: #fff;
		border-radius: 10upx;
		justify-content: center;
		display: flex;
		flex-flow: column;
		align-items: center;
	}

	.inter_bj {
		width: 100%;
		height: 100%;
	}

	.jifen_inter {
		width: 30upx;
		height: 30upx;
		position: absolute;
		top: 20%;
		left: 12%;
	}
</style>
