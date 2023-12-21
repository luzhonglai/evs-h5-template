<template>
<view class="page">
	<status-bar></status-bar>

	<view :class="['input-view', lang_standard?'':'top']">
		<uni-icons type="search" size="22" color="#666666" style="line-height: 60rpx;"/>
		<input confirm-type="search" class="input" type="text" :placeholder="__('输入搜索关键词')" @click="onSearch">
	</view>


	<view class="categroy-list"  style="position: absolute;margin-top:90rpx;" v-if="!lang_standard">
		<view>
			<navigator hover-class="none"  url="/activity/fightgroup/activi?cname=GR0UP PURCHASE" v-if="false">
				<image lazy-load mode="scaleToFill"  style="width:100%;height:188upx;"  src="../../static/images/diben/purchas.png"/>
			</navigator>
			<uni-collapse ref="add" class="warp" @change="change" v-for="(val, aid) in detail" :key="aid">
				<uni-collapse-item :title="val.category_name" open="true">
					<template v-if="(detail.length > 0)">
						<uni-list>
							<view v-for="(cate, pi) in val.sub">
								<uni-list-item  v-if="(cate.category_is_enable == 1)"  :key="pi" :title="(cate.category_name)"  thumb=""  @click="goto(cate.id,val.id,val.category_name)"/>
							</view>
						</uni-list>
					</template>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		<view style="width:100%;height:100upx;"></view>
	</view>

	<view class="main" style="z-index: 100px;" v-else>
		<view class="page-body">
			<scroll-view class="categroy-left"  scroll-y>
				<view data-id="brand" data-index="-2"
					@click="switchTab"
					:class="{'cate-list uni-ellipsis':1, on:(curIndex === -2)}">{{__('品牌推荐')}}</view>
				<view v-for="(item, category_index) in category" :key="category_index" :data-id="(item.category_id)" :data-index="(category_index)"
					@click="switchTab"
					:class="{'cate-list uni-ellipsis':1, on:(curIndex === category_index)}" style="white-space: normal;height:100upx;line-height:40upx; display: flex;
	           align-items: center;
	           justify-content: center;">{{item.category_name}}</view>
			</scroll-view>


			<scroll-view class="categroy-right" scroll-y @scrolltolower="scrollbottom" :scroll-top="scrollTop" @scroll="scroll" scroll-with-animation="true" >
				<block v-if="category_deep == 2">
					<view style="white-space: nowrap;overflow-y:auto;">
						<label :class="['m-category-list', c_id == 0 ? 'active': '']" data-id="0" @click="switchLevel2Category">全部分类</label>
						<label :class="['m-category-list', c_id == item.category_id ? 'active': '']" :data-id="item.category_id" @click="switchLevel2Category" v-for="(item, index) in detail" :key="index">{{item.category_name}}</label>
					</view>

					<block v-for="(item, p_index) in product_items" :key="item.id">
						<navigator v-if="curIndex !== -2" :url="'/pages/product/detail?pid=' + (item.item_id)" class="m-product-item" style="height: 180upx;" hover-class="none">
						    <view class="m-product-img product-list" style="height: 160upx;">
								<block v-if="false">
									<view class="flag flag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</view>
									<view class="flag flag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</view>
									<view class="flag flag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</view>
									<view class="flag flag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</view>
								</block>
								<image lazy-load :src="(item.product_image)"  v-if="item.product_image"  style="width: 160upx;height: 160upx;margin-bottom:0;"/>
						    </view>
						    <view class="m-product-info1" style="display:flex; flex-flow: column;justify-content: space-between;width: 374upx;height:190upx;padding: 28upx 0;">
						        <view class="m-product-name2" style="font-size: 26upx;line-height: 40upx;">
									<label>
									<text class="tag tag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</text>
									<text class="tag tag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</text>
									<text class="tag tag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</text>
									<text class="tag tag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</text>

									{{item.product_name}}</label>
						        </view>
						        <view class="m-product-price1">
						            <view class="money">
						                <block v-if="item.item_unit_price">
						                    <label>{{__('￥')}}</label><label style="font-size:26upx">{{number_format(item.item_unit_price, 2)}}</label>
						                </block>

										<block v-if="item.product_unit_points">
											<label style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{number_format(item.product_unit_points)}}</label> <label>{{__('积分')}}</label>
										</block>

										<block v-if="item.product_unit_sp">
						                    <label style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.product_unit_sp}}</label> <label>{{__('众宝')}}</label>
										</block>
						            </view>
						            <view class="num" v-if="(item.product_sale_num>0)">
						                <text>{{__('已售')}} </text> <label style="color:#db384c">{{item.product_sale_num}}</label>
						            </view>
						        </view>
						    </view>
						</navigator>
					</block>
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


				</block>
				<block v-else-if="(detail.length > 0)">
				<!--上级分类 全部-->
				<block  v-if="curIndex !== -2">
					<navigator :url="'/pages/product/list?category_id=' + (category[curIndex].id) + '&cname=' + (category[curIndex].category_name) + '&page_id=' + (category[curIndex].page_id)" class="m-cell m-cell-access" style="padding:30rpx 44rpx 10rpx">
						<view class="m-cell-bd m-cell-primary">
							<p>{{__('全部分类')}}</p>
						</view>
						<text class="m-cell-ft"></text>
					</navigator>

					<block v-if="false">
						<view v-if="true" class="categroy-parent"><navigator :url="'/pages/product/list?category_id=' + (category[curIndex].id) + '&cname=' + (category[curIndex].category_name) + '&page_id=' + (category[curIndex].page_id)"><label>{{__('全部分类')}}</label></navigator></view>
						<view v-else class="product-list">
							<navigator :url="'/pages/product/list?category_id=' + (category[curIndex].id) + '&cname=' + (category[curIndex].category_name) + '&page_id=' + (category[curIndex].page_id)">
								<image lazy-load  :src="(category[curIndex].category_image)"></image>
								<view class="classname category-level-2 uni-ellipsis" style="color: #ffac13;"><text>{{__('全部分类')}}</text></view>
							</navigator>
						</view>
					</block>
				</block>

				<block v-for="(item, category_order) in detail" :key="category_order">
	                    <block v-if="curIndex !== -2">
							<navigator :url="'/pages/product/list?category_id=' + (item.id) + '&cname=' + (item.category_name) + '&page_id=' + (item.page_id)" class="m-cell m-cell-access" style="margin-top: 0rpx;">
								<view class="m-cell-bd m-cell-primary">
									<p>{{item.category_name}}</p>
								</view>
								<text class="m-cell-ft"></text>
							</navigator>

							<block v-if="false">
								<view class="categroy-parent" v-if="true"><navigator :url="'/pages/product/list?category_id=' + (item.id) + '&cname=' + (item.category_name) + '&page_id=' + (item.page_id)"><label class=" uni-ellipsis">{{item.category_name}}</label></navigator></view>
								<view class="product-list" v-else>
									<navigator :url="'/pages/product/list?category_id=' + (item.id) + '&cname=' + (item.category_name) + '&page_id=' + (item.page_id)">
										<image lazy-load  :src="(item.category_image)"></image>
										<view class="classname category-level-2 uni-ellipsis" style="height:76upx;"><text>{{item.category_name}}</text></view>
									</navigator>
								</view>
							</block>
	                        <view class="product-list" v-for="(val, pi) in item.sub" :key="val.id">
	                        	<navigator :url="'/pages/product/list?category_id=' + (val.id) + '&cname=' + (val.category_name) + '&page_id=' + (val.page_id)">
	                        		<image lazy-load  :src="(val.category_image)"></image>
	                        		<view class="classname uni-ellipsis" style="height:40rpx;display: inherit;white-space:inherit;word-break:break-all;line-height:1.5;"><text>{{val.category_name}}</text></view>
	                        	</navigator>
	                        </view>
							<br>
	                    </block>
	                    <block v-else>
	                        <view class="product-list"  v-for="(brand, inx) in item.items" v-bind:key="brand.id">
	                            <navigator :url="'/pages/product/list?brand_id=' + (brand.brand_id) + '&cname=' + (brand.brand_name) + '&page_id=' + (brand.page_id || 0)">
	                                <image lazy-load :src="(brand.brand_image)" style="width:140upx;height:140upx;"></image>
	                                <view class="classname text-overflow uni-ellipsis" ><text>{{brand.brand_name}}</text></view>
	                            </navigator>
	                        </view>
	                    </block>
					<!--</view>-->
				</block>
				</block>
				<block v-else>
				<block v-for="(item, category_order) in product_items" :key="item.id">

					<navigator v-if="curIndex !== -2" :url="'/pages/product/detail?pid=' + (item.item_id)" class="m-product-item" style="height: 180upx;" hover-class="none">
					    <view class="m-product-img product-list" style="height: 160upx;">
							<block v-if="false">
								<view class="flag flag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</view>
								<view class="flag flag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</view>
								<view class="flag flag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</view>
								<view class="flag flag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</view>
							</block>
							<image lazy-load :src="(item.product_image)"  v-if="item.product_image"  style="width: 160upx;height: 160upx;margin-bottom:0;"/>
					    </view>
					    <view class="m-product-info1" style="display:flex; flex-flow: column;justify-content: space-between;width: 374upx;height:190upx;padding: 28upx 0;">
					        <view class="m-product-name2" style="font-size: 26upx;line-height: 40upx;">
								<label>
								<text class="tag tag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</text>
								<text class="tag tag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</text>
								<text class="tag tag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</text>
								<text class="tag tag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</text>

								{{item.product_name}}</label>
					        </view>
					        <view class="m-product-price1">
					            <view class="money">
					                <block v-if="item.item_unit_price">
					                    <label>{{__('￥')}}</label><label style="font-size:26upx">{{number_format(item.item_unit_price, 2)}}</label>
					                </block>

									<block v-if="item.product_unit_points">
										<label style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{number_format(item.product_unit_points)}}</label> <label>{{__('积分')}}</label>
									</block>

									<block v-if="item.product_unit_sp">
					                    <label style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.product_unit_sp}}</label> <label>{{__('众宝')}}</label>
									</block>
					            </view>
					            <view class="num" v-if="(item.product_sale_num>0)">
					                <text>{{__('已售')}} </text> <label style="color:#db384c">{{item.product_sale_num}}</label>
					            </view>
					        </view>
					    </view>
					</navigator>
					<!--</view>-->
				</block>
				</block>
			</scroll-view>
		</view>
	</view>

	<view class="u-top">
		<movable-area class="movableArea">
			<movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
				<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nav/black/nav_gotop.png' :class='(isquicknav?"quicknav":"hide")' @tap="returnTop"></image>
		    </movable-view>
	    </movable-area>
	</view>
</view>

</template>



<script>
    import statusBar from '../../components/status-bar.vue'
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'


	import {
		mapState,
		mapMutations
	} from 'vuex'

    export default {
        data: function(){
            return {
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
                category: [
                ],
                detail: [],
				product_items: [],
                curIndex: 0,
                isScroll: false,
				categoryId:0,
				name:'',
				category_deep: false, // false| 1| 2| 3，当前一级分类这个分支是几级分类，false为不确定
				c_id: -1,
				lang_standard:true,
				ispage: !0,
				isdata: !1,
				flag: !0,
				curpage: 1,
				category_id: !0,
				initX: '690',
				initY: '1336',
				page: 1,
				loading: true,
				w: 0,
				screenHeight: 0,
				scposition: -1,
				oldscposition: 0,
				isquicknav: !1,
				opacity: 1,
				background: "f1f1f1",
				toView: 0
            }
        },
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        components: {
            statusBar,
			uniCollapse,
			uniCollapseItem,
			uniList,
			uniListItem
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
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var that = this;

			that.lang_standard = that.Lang.standard;

			uni.setNavigationBarTitle({
				title:this.__('分类')
			});

			this.setData({
				name:options.cname,
				categoryId: options.category_id
			});

			var that = this;
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


        onReady() {
            var that = this;

			this.height = uni.getSystemInfoSync().windowHeight;


			if (that.Lang.standard)
			{
				that.$.request({
				    url: that.Config.URL.product.category,
				    loading: false,
				    ajaxCache: {
				        timeout: that.Config.CACHE_EXPIRE
				    },
				    success(data) {
				        that.setData({
				            category: data.items
				        })

						if (that.Lang.standard)
						{
							that.loadCategory(that.category[that.curIndex].category_id)
						}
				    }
				});
			}
			else
			{
				that.loadCategory(that.categoryId)
			}
        },

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.showCartNum();
		},

		methods:{
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),

			switchTab(e) {
				this.setData({
					toView: e.target.dataset.id,
					curIndex: parseInt(e.target.dataset.index),
					detail: [],
					product_items: [],
					c_id: 0,//e.target.dataset.id,
					flag: !0,
					ispage: !0,
					isdata: !0,
					category_deep: false,
					curpage: 1
				})

                if (this.curIndex == -2)
                {
                    this.loadBrand(e.target.dataset.id)
                }
                else
                {
                    this.loadCategory(e.target.dataset.id)
                }
			},
			switchLevel2Category(e){
				let that = this;
				that.setData({
					c_id: e.target.dataset.id,
					flag: !0,
					ispage: !0,
					isdata: !0,
					curpage: 1,
					product_items: []
				});
				that.loadCategory(that.category_id)
			},
			doNothing(){},
			loadCategory(category_id) {
				var that = this;
				that.$.request({
					url: that.Config.URL.product.category,
					data: {
						category_id: category_id,
						recursive: 1,
						c_id: that.c_id != 0 ? that.c_id : category_id,
						curpage: that.curpage
					},
					ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE
					},
					success(data) {
						that.setData({
							detail: data.items,
							category_deep: data.category_deep ? data.category_deep : false,
							category_id: category_id
						});

						if (that.category_deep == 2) {
							if (data.product_items.page >= data.product_items.total) {
								that.setData({
									flag: !1,
									ispage: !1
								})
								that.$set(that, 'product_items', that.product_items.concat(data.product_items.items))
							} else {
								that.setData({
									flag: !0,
									ispage: !0,
								})
								that.$set(that, 'product_items', that.product_items.concat(data.product_items.items))
							}
						} else {
							that.setData({
								flag: !0,
								ispage: !0,
							});
							that.$set(that, 'product_items', data.product_items ? data.product_items.items : [])
						}
						that.setData({
							isdata: !0
						})
					}
				});
			},
			/* scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			}, */
			scroll: function (t) {
				let that = this;

				that.setData({oldscposition: t.detail.scrollTop});

				if (100 < t.detail.scrollTop) {
					that.setData({opacity: 1, background: "f8f8f8"});
				} else {
					that.setData({
					    opacity: 0,
					    background: "fff"
					})
				}
				if (t.detail.scrollTop >= this.screenHeight) {
					this.setData({isquicknav: !0})
				} else {
					this.setData({isquicknav: !1})
				}
			},

			scrollbottom: function(e) {
			    if (this.flag && this.curIndex !== -2 && this.category_deep == 2) {
			        var that = this;
			        that.setData({ flag: !1 }), clearTimeout(n);

			        var n = setTimeout(function() {
						that.setData({ curpage: parseInt(that.curpage) + 1 })
			            that.loadCategory(that.category_id);
			        }, 500);
			    }
			},

			returnTop: function() {
				let that = this;
				//视图会发生重新渲染
				that.scrollTop = that.oldscposition
				//当视图渲染结束 重新设置为0
				that.$nextTick(() =>{
					that.scrollTop = 0
				});
				this.setData({isquicknav: !1})
			},

            loadBrand(category_id) {
            	var that = this;
            	that.$.request({
            		url: that.Config.URL.product.brand,
            		data: {
            		},
            		ajaxCache: {
            			timeout: that.Config.CACHE_EXPIRE
            		},
            		success(data) {
            			that.setData({
            				detail: data.items,
            				product_items: data.product_items ? data.product_items.items : [],
            			})
            		}
            	});
            },

			goto:function (e,r,t){
				uni.navigateTo({
				    url: '/pages/product/list?category_id=' +e+'&parent_id='+r+ '&cname='+ t
				});
			},
			change(e) {
				console.log(e)
			},
			search() {
				uni.showToast({
					title: '搜索'
				})
			},
			onSearch(e) {
				let that = this;
				that.$.gopage("/pagesub/search/search");
            }
		}

    }

</script>

<style lang="scss">
    @import "../../styles/_variables.scss";


	.page-body {
		display: flex;
	}


	.top {
		width:100%;
		height:82upx;
		background:rgba(255,255,255,1);
		overflow:hidden;
		position:fixed;
		z-index:99;
		line-height:82upx;

	}

	.top-left {
		margin-top:16upx;
		float:left;
	}

	.top-left img {
		width:40upx;
		height:52upx;
	}

	.b-left {
		   float:left;
		   margin-top:-4upx;

	}

	.b-left image {
		   width:40upx;
		   height:40upx;
		   margin-top:14upx;
		   margin-left:20upx
	}



	.top-right {
		width:50upx;
		height:52upx;
		margin-right:24upx;
		margin-top:14upx;
		float:right;
	}

	.top-right image {
		width:50upx;
		height:52upx;
	}

	.top-right view {
		width:50upx;
		height:30upx;
		font-size:24upx;
		position: absolute;
		margin-top:-62upx;
		font-weight:500;
		color:rgba(255,255,255,1);
		line-height:30upx;
		text-align:center;

	}

	.categroy-list {
		position: relative;
		width:100%;
		height:100%;
	}

	.uni-collapse:before {
		height:0;
	}



      .input-view {
      	display: flex;
      	background-color: #ffffff;
      	height: 60rpx;
      	padding: 14rpx 4%;
      	flex-wrap: nowrap;
      	line-height: 60rpx;
      }

      .input-view .uni-icon {
      	line-height: 60rpx !important;
      }

      .input-view .input {
      	height: 60rpx;
      	line-height: 60rpx;
      	width: 94%;
      	padding: 0 3%;
      }


	  //for ZH

	  	/* .main{
	  		margin-bottom:var(--window-bottom)
	  	} */

	      .categroy-left{
	          position: absolute;
			  // #ifndef APP-PLUS
	          top: calc(60rpx + 14rpx + 14rpx);
			  // #endif
			  // #ifdef APP-PLUS
	          top: calc(60rpx + 14rpx + 14rpx + var(--status-bar-height));
			  // #endif
	          bottom: 0;
			  z-index: 2;
	          width: 26%;
	          box-sizing: border-box;
	      }
	      .categroy-left .cate-list{
	          height: 100upx;
	          line-height: 100upx;
	          text-align: center;
	          border-left: 3px solid #eee;
	          border-right: 0px solid #fff;
	          background-color: #eee;

	      }
	      .categroy-left .cate-list.on{
	          color: $default-skin-bg-active;
	          border-color: $default-skin-bg-active;
	          border-top: 0px solid #fff;
	          border-bottom: 0px solid #fff;
	          border-right: 0px solid #fff;
	          background-color: #fff;
	      }
	      .categroy-right{
			  z-index: 1;
	          width: 74%;
			  padding-left: 26%;
	          height: auto;
	          overflow: hidden;
	          background-color: #fff;
			  position: absolute;
			  // #ifndef APP-PLUS
			  top: calc(60rpx + 14rpx + 14rpx);
			  // #endif
			  // #ifdef APP-PLUS
			  top: calc(60rpx + 14rpx + 14rpx + var(--status-bar-height));
			  // #endif
			  bottom: 0;
	      }
	      .cate-box{
	          /*height: 100%;*/
	          /*padding:40upx;*/
	          box-sizing: border-box;
	      }
	      .cate-box .cate-banner image{
	          display: block;
	          width: 100%;
	          height: 190upx;
	      }
	      .cate-title{
	          position: relative;
	          height: 50upx;
	          line-height: 50upx;
	          padding:30upx 0 30upx;
	          text-align: center;
	          color: $default-skin-bg-active;
	          font-size: 28upx;
	      }
	      .cate-title::before{
	          position: absolute;
	          left: 100upx;
	          top: 43upx;
	          content: '';
	          width: 70upx;
	          height: 4upx;
	          background: $default-skin-bg-active;
	      }
	      .cate-title::after{
	          position: absolute;
	          right: 100upx;
	          top: 43upx;
	          content: '';
	          width: 70upx;
	          height: 4upx;
	          background: $default-skin-bg-active;
	      }

	      .category-level-2{
	          color:lighten($default-skin-bg-active, 13.5%)
	      }
	      .product-list{
	          display: inline-block;
	          width: 160upx;
	          /*height: 160upx;*/
	          text-align: center;
	          margin:0 0upx 0upx 0;
	          padding:10upx;
	          font-size: 24upx;
	          vertical-align: top;
	      }
	      .product-list image{
	          width: 100upx;
	          height: 100upx;
	          margin-bottom: 20upx;
	      }
	      .product-list:nth-child(3n){
	          margin-right: 0;
	      }

	  	.uni-ellipsis {
	  		font-size: 12px;
	  		display: -webkit-box;
	  		-webkit-box-orient: vertical;
	  		-webkit-line-clamp: 2;
	  		white-space:pre-wrap
	  	}

	  	/* 分类子级内容 */
	  	.categroy-parent { background-color: transparent; margin-top: 14px; margin-bottom: 14px;}
	  	.categroy-parent navigator {position:relative; display: block;font-size: 0.545rem; line-height:1.6rem;height:1.6rem; color: #6d6d6d;text-align:center;}
	  	.categroy-parent navigator:after{content:"";border-bottom:1px solid #ddd;position:absolute;left:15%;right:15%;top:45%;}
	  	.categroy-parent navigator label{display:inline-block;position:relative;z-index:2; padding:0 10upx;background:#f2f2f2;font-size:26upx;}

	  	/*
	  	.categroy-right .categroy-parent:nth-child(1) navigator label {
	  		background-color: #ff6700;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(2) navigator label {
	  		background-color: #AC92ED;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(3) navigator label {
	  		background-color: #4FC0E8;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(4) navigator label {
	  		background-color: #A0D468;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(5) navigator label {
	  		background-color: #48CFAE;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(6) navigator label {
	  		background-color: #EC87BF;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(7) navigator label {
	  		background-color: #FFCE55;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(8) navigator label {
	  		background-color: #5D9CEC;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(9) navigator label {
	  		background-color: #FB6E52;
	  		color:#fff;
	  	}

	  	.categroy-right .categroy-parent:nth-child(10) navigator label {
	  		background-color: #AAB2BD;
	  		color:#fff;
	  	}
	  	*/












	     /*全部商品 start*/
	     .m-navbar-item {
	         padding: 20upx 0;
	         font-size: 24upx;
	         i {
	             font-size: 0upx;
	             line-height: 0;
	             vertical-align: middle;
	             display: inline-block;
	             width: 0upx;
	             height: 0upx;
	             margin-left: 9.375upx;
	             border-width: 9.375upx;
	             border-color: #aaa transparent transparent transparent;
	             border-style: solid dashed dashed dashed;
	         }
	     }
	     .m-navbar-item:after {
	         border: none;
	     }
	     .m-navbar-item.m-navbar-item-on {
	         background-color: #fff;
	         color: $default-skin-bg;
	         i {
	             border-color: $default-skin-bg transparent transparent;
	         }
	     }
	     .m-navbar-item.m-navbar-item-on::before {
	         content: ' ';
	         position: absolute;
	         left: 0;
	         bottom: 0;
	         right: 0;
	         height: 6upx;
	         border-bottom: 6upx solid $default-skin-bg;
	         color: #cccccc;
	         -webkit-transform-origin: 0 100%;
	         transform-origin: 0 100%;
	         -webkit-transform: scaleY(0.5);
	         transform: scaleY(0.5);
	         z-index: 3;
	     }
	     .m-sort {
	         position: relative;
	     }
	     .m-sort image {
	         width: 24upx;
	         height: 24upx;
	         position: absolute;
	         /*top: 50%;*/
	         margin-top: 10upx;
	         margin-left: 2upx;
	     }
	     /*全部商品 end*/
	     .m-product-price1 {
	         width: 100%;
	         display: flex;
	         justify-content: space-between;
	     }
	     .num {
	         font-size: 24upx;
	         color: #717171;
	         padding-right: 20upx;
	         /*margin-left:260upx; */
	     }

	     .u-pa .m-tab {
	         top: var(--window-top);
	     }

	     .filter-box {
	         top: var(--window-top);
	     }

	     .tag-view {
	         margin: 10upx 20upx;
	         display: inline-block;
	     }

	     .uni-numbox-value {
	         border: 2upx solid #cccccc;
	         background-color: #ffffff;
	         width: 150upx;
	         height: 48upx;
	         text-align: center;
	         display: inline-block;
	     }
	     .uni-dot {
	         width: 30upx;
	         height: 100%;
	         text-align: center;
	         display: inline-block;
	         line-height: 44upx;
	         height: 44upx;
	     }

	     .uni-padding-wrap {
	         overflow: hidden;
	         max-width: 400upx;
	     }




	     /* */
	     .product-list {
	       position: relative;
	       z-index: 1;
	       &:hover {
	         z-index: 2;
	       }
	       .flag {
	         position: absolute;
	         top: 0;
	         left: 50%;
	         z-index: 2;
	         width: 64px;
	         height: 20px;
	         margin-left: -32px;
	         font-size: 12px;
	         line-height: 20px;
	         text-align: center;
	         color: #fff;
	       }
	       .flag-reduction {
	         background-color: #e50dbb;
	         z-index: 8;
	       }

	       .flag-saleoff {
	         background-color: #e53935;
	         z-index: 7;
	       }

	       .flag-postfree {
	         background-color: #ffac13;
	         z-index: 6;
	       }

	       .flag-bargain {
	         background-color: #ffac13;
	         z-index: 4;
	       }

	       .flag-gift {
	         background-color: #2196f3;
	         z-index: 3;
	       }

	       .flag-new {
	         background-color: #83c44e;
	         z-index: 5;
	       }

	       .flag-selfsupport {
	         background-color: #f44336;
	         z-index: 10;

	         position: absolute;

	         top: 1px;
	         right: 5px;
	         left: auto;
	         width: 40px;
	       }
	     }

	     .placeholder-class{
	     	font-size: 25upx;
	     }

	     .button{
	     	line-height: 2;
	     	font-size: 34upx;
	     }

	     .uni-common-mt{
	     	margin-top: 20upx;
	     }





	     .city {
	     	display: flex;
	     	flex-direction: row;
	     	align-items: center;
	     	justify-content: center;
	     	width: 100%;
	     	margin-left: 6rpx;
	     	white-space: nowrap;
	     }


		 .m-cell{
			 padding: 32rpx 44rpx;

			 p{
				 height: 34rpx;
				 font-size: 24rpx;
				 font-weight: bold;
				 line-height: 34rpx;
				 color: #282F40;
			 }

		 }
		 .m-category-list  {
		 	display: inline-block;
		 	font-size: 24upx;
		 	padding: 6upx 15upx;
		 	border-radius: 8upx;
		 	margin: 10upx;
		 	color: #888;
		 	border: 1upx solid #d5d5d5;
		 }
		 .m-category-list.active {
		 	color: $default-skin-bg !important;
		 	border: 1upx solid $default-skin-bg !important;
		 }

		.m-cell-access .m-cell-ft:after{
			/*border-color:#c3c3c3;*/
		}
</style>
