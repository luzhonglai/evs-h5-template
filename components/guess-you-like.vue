<template>
    <view>
	<view class="m-tips" style="" v-if="titleText">
		<view class="m-tips-str" :style="'line-height: 100rpx;height: 100rpx;font-size: 32upx;font-weight: 500;color:' + titleColor">{{titleText}}</view>
	</view>
    <view scroll-y="true" class="m-product-all u-pa" :style="{backgroundColor:bgColor}" @scrolltolower="scrollbottom" :scroll-top="scposition" @scroll="scrolltoupper">
        <view :class="['m-tab', isFilterTop0 ? 'm-tab-top' : ''] " v-if="isShowFilter">
            <view class="m-navbar">
                <view :class="{'m-navbar-item':1,  'm-navbar-item-on':post.sidx=='product_sale_num'}" @click="sealnum">
                    {{__('销量')}}
                </view>
                <view :class="{'m-navbar-item':1,  'm-navbar-item-on':post.sidx=='product_add_time'}" @click="newpd">
                    {{__('新品')}}
                </view>
                <view :class="{'m-navbar-item':1,  'm-navbar-item-on':post.sidx=='product_unit_price'}" @click="pdprice">
                    <label class="m-sort"> {{__('价格')}} <image lazy-load :src="'/static/images/' + (sort==1?'sort-desc':'sort-asc') + '.png'" /></label>
                </view>
                <view :class="{'m-navbar-item':1,  'm-navbar-item-on':(is_filter)}" @click="onOpenFilter">
                    {{__('筛选')}}
                    <i></i>
                </view>
            </view>
        </view>
        <view  :class="{'m-product-list':1, 'm-listv':viewtype==1}" v-if="(isdata)">
            <block v-for="(item, i) in pdlist" :key="i">
                <navigator v-if="(!isFG)" :url="(item.is_virtual?'/pages/product/detail':'/pages/product/detail') + '?pid=' + (item.id)" class="m-product-item" :style="{marginLeft:(i%2==0 ? 10-paddingLeft : 5)*2 + 'rpx'}">
                    <view class="m-product-img product-list">
                        <block v-if="false">
						<view class="flag flag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</view>
						<view class="flag flag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</view>
						<view class="flag flag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</view>
						<view class="flag flag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</view>
                        </block>

						<image lazy-load :src="($.img(item.ProductPic, 360,  360))"  v-if="item.ProductPic" />
                    </view>
                    <view class="m-product-info1" style="display:flex; flex-flow: column;justify-content: space-between;">
                        <view class="m-product-name2">
							<label>
                                <text class="tag tag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</text>
                                <text class="tag tag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</text>
                                <text class="tag tag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</text>
                                <text class="tag tag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</text>{{item.SalesName}}</label>
                        </view>
                        <view class="m-product-name2" v-if="false">
							<uni-tag text="产地" type="success" size="small" :inverted="true" class="p-tag"></uni-tag>
							<uni-tag text="距离" type="royal" size="small" :inverted="true" class="p-tag"></uni-tag>
							<uni-tag text="溯源" type="gray" size="small" :inverted="true" class="p-tag"></uni-tag>
                        </view>
                        <view class="m-product-price1">
                            <view class="money">
                                <block v-if="item.ItemSalePrice">
                                    <label>{{__('￥')}}</label>{{number_format(item.ItemSalePrice, 2)}}
                                </block>

								<block v-if="item.product_unit_points">
									<label style="margin: 0upx 10upx;">+</label>{{number_format(item.product_unit_points)}} <label>{{__('积分')}}</label>
								</block>

								<block v-if="item.product_unit_sp">
                                    <label style="margin: 0upx 10upx;">+</label>{{item.product_unit_sp}} <label>{{__('众宝')}}</label>
								</block>
                            </view>
                            <view class="num" v-if="(plantformInfo.config.product_salenum_flag && item.SaleNum>0)">
                                <text>{{__('已售')}} </text> <label style="color:#db384c;margin-left: 2px;">{{item.SaleNum}}</label>
                            </view>
							<view :class="'c'+1" v-if="false">
							</view>
                        </view>
                    </view>
                </navigator>
            </block>


			<view class="u-top-default" v-if="false">
				<view class="u-view" @click="viewType" style="line-height: 96rpx;">
					<label :class="(viewtype==1?'iconfont zc zc-viewlist':'iconfont zc zc-viewgallery')"></label>
				</view>
				<view class="u-back" @click="returnTop">
					<label class="iconfont icon-fanhuidingbu"></label>
				</view>
        	</view>
    </view>
    <navigator url="/pagesub/search/search" redirect="true" class="m-nullpage" v-else>
        <view class="m-nullpage-middle">
            <label class="iconfont icon-sousuo-sousuo"></label>
            <view class="m-null-tip">
                <text>{{__('亲~找不到您想要的商品')}}</text>
                <text>{{__('再多点提示呗')}}</text>
            </view>
        </view>
    </navigator>


		<view class="m-loading-box" v-if="isShowLoading">
		    <!-- <block v-if="(ispage)">
		        <view class="u-loadmore">
		            <label class="u-loading"></label>
		            <text class="u-loadmore-tips">{{__('正在加载')}}</text>
		        </view>
		    </block>
		    <block v-else> -->
		        <view class="u-loadmore u-loadmore-line">
		            <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
		        </view>
		    <!-- </block> -->
		</view>
    </view>



	<uni-drawer :visible="rightDrawerVisible" mode="right" @close="onCloseFilter">
	    <view style="padding:30upx;">
	        <view class="uni-padding-wrap uni-common-mt">
	            <view class="uni-title">{{__('价格区间')}}</view>
	            <view>
	                <view style="display: inline-flex">
	                    <input class="uni-numbox-value" type="number" v-model="post.price_from"  placeholder-class="placeholder-class" :placeholder="__('最低价')"/>
	                    <view class="uni-dot">-</view>
	                    <input class="uni-numbox-value" type="number" v-model="post.price_to"  placeholder-class="placeholder-class" :placeholder="__('最高价')"/>
	                </view>
	            </view>

	            <view class="uni-title uni-common-mt">{{__('积分区间')}}</view>
	            <view>
	                <view style="display: inline-flex">
	                    <input class="uni-numbox-value" type="number" v-model="post.points_from"  placeholder-class="placeholder-class" :placeholder="__('最低积分')"/>
	                    <view class="uni-dot">-</view>
	                    <input class="uni-numbox-value" type="number" v-model="post.points_to"  placeholder-class="placeholder-class" :placeholder="__('最高积分')"/>
	                </view>
	            </view>

				<block v-if="true">
				<!-- #ifndef MP-BAIDU -->
	            <view class="uni-title uni-common-mt">{{__('商品类型')}}</view>
	            <view>
	                <view class="tag-view">
	                    <uni-tag :text="__('赠品')" type="shopsuite" size="small" :inverted="inverted.gift" data-type="gift" @click="setType('gift')"></uni-tag>
	                </view>
	                <view class="tag-view">
	                    <uni-tag :text="__('拼团')" type="shopsuite" size="small" :inverted="inverted.groupbuy" data-type="groupbuy"  @click="setType('groupbuy')"></uni-tag>
	                </view>
	                <view class="tag-view">
	                    <uni-tag :text="__('限时折扣')" type="shopsuite" size="small" :inverted="inverted.xianshi" data-type="xianshi"  @click="setType('xianshi')"></uni-tag>
	                </view>
	                <view class="tag-view">
	                    <uni-tag :text="__('虚拟')" type="shopsuite" size="small" :inverted="inverted.virtual" data-type="virtual" @click="setType('virtual')"></uni-tag>
	                </view>
	            </view>

	            <view class="uni-title uni-common-mt">{{__('店铺服务')}}</view>
	            <view>
	                <view class="tag-view" v-for="(contract, index) in contract_row" :key="index">
	                    <uni-tag :text="contract.contract_type_name" type="shopsuite" size="small" :inverted="contract.contract_is_unselected" :data-id="contract.contract_type_id"   :data-index="index"  @click="setContract(index)"></uni-tag>
	                </view>

	            </view>


				<block v-if="market_row.length>0">
				<view class="uni-title uni-common-mt">{{__('市场')}}</view>
				<view>
					<view class="tag-view" v-for="(market, index) in market_row" :key="index">
						<uni-tag :text="market.category_name" type="shopsuite" size="small" :inverted="market.market_is_unselected" :data-id="market.market_category_id"   :data-index="index"  @click="setMarket(index)"></uni-tag>
					</view>
				</view>
				</block>
				<!-- #endif -->
				</block>

				<block v-if="assist.length>0">
				<block v-for="(items, aid) in assist" :key="items.assist_id">
				<view class="uni-title uni-common-mt">{{items.assist_name}} <label :data-aid="aid" @click="assistItemReset">{{__('全部')}}</label></view>

				<view v-if="items['item'].length>0">
					<view class="tag-view" v-for="(assist_item, idx) in items['item']" :key="idx">
						<uni-tag :text="assist_item.assist_item_name" type="shopsuite" size="small"  :inverted="assist_item.assist_is_unselected" :data-id="assist_item.assist_item_id"   :data-index="idx"  @click="setAssist(aid, idx)"></uni-tag>
					</view>
					<!--
					<checkbox-group  @change="assistItemChange" :data-aid="aid" v-if="'checkbox' == items.assist_format">
				    <view class="tag-view"  v-for="(assist_item, idx) in items['item']" :key="assist_item.id">
						<label>
							<checkbox :value="assist_item.assist_item_id+''" :checked="assist_item.checked" />{{assist_item.assist_item_name}}
						</label>
				    </view>
					</checkbox-group>
					<radio-group  @change="assistItemRadionChange" :data-aid="aid" v-if="'radio' == items.assist_format">
				    <view class="tag-view"  v-for="(assist_item, idx) in items['item']" :key="assist_item.id">
						<label>
							<radio :value="assist_item.assist_item_id+''" :checked="assist_item.checked" />{{assist_item.assist_item_name}}
						</label>
				    </view>
					</radio-group>
					-->
				</view>
				</block>
				</block>

				<view style="height: 100rpx;line-height: 100rpx;"></view>
				<view class="uni-common-mt" style="position: fixed;bottom: 30rpx;background-color: #006EFF;">
					<button class="button" type="warn" size="medium" @tap="onFilter" style="width: 350upx;margin: 0;">{{__('筛选商品')}}</button>
				</view>
	        </view>
	    </view>
	</uni-drawer>
    </view>
</template>


<script>
import uniDrawer from '@/components/uni-drawer.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import { mapState, mapMutations } from 'vuex';

export default {
		props: {
			options: {
				type: Object,
				default () {
					return {
					}
				},
			},
			optionStr: {
				type: String,
				default: '{}'
			},

			isShowFilter: {
				type: [Boolean,Number],
				default: false
			},

			isFilterTop0: {
				type: Boolean,
				default: false
			},

			viewtype: {
				type: Number,
				default: 1
			},

			titleText: {
				type: String,
				default: ''
			},

			titleColor: {
				type: String,
				default: '#bfbfbf'
			},

			bgColor: {
				type: String,
				default: '#f8f8f8'
			},

			paddingLeft: {
				type: Number,
				default: 0
			},

			paddingRight: {
				type: Number,
				default: 0
			},

			maxNumber: {
				type: Number,
				default: 100
			},

			isShowLoading: {
				type: [Boolean,Number],
				default: true
			},
			isGuessFlag:{
				type: Boolean,
				default: false
			},
			uniId:
			{
				type: String,
				default () {
					return 'guessyoulike'
				}
			}
		},
    data() {
        return {
            isStoreFlag: 0,
            h: 0,
            /* viewtype: 1, */
			assist:[],
            pdlist: [],
            fglist: [],
            sort: 2,
            flag: !0,
            ispage: !0,
            scposition: '',
			old: {
				scposition: 0
			},
            istop: !1,
            isdata: !1,
            isVirtual: !1,
            isFG: !1,
            is_filter: !1,
            post: {
                sidx: 'product_order',
                sord: 'ASC',
                isnew: !1,
                keywords: '',
                store_category_ids: 0,
                curpage: 1,
                store_id: null,

                pa_id: null,
                pa_type_id: null,

                price_from: null,
                price_to: null,

                points_from: null,
                points_to: null,

                virtual: 0,
				store_type:1
            },

            rightDrawerVisible: false,

            inverted: {
                gift: true,
                groupbuy: true,
                xianshi: true,
                virtual: true
            },
            contract_row: [],
            market_row: []
        };
    },

    components: {
        uniDrawer,
        uniTag
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
    created() {
        var that = this;

			var h = that.$.getSystemInfoSync().windowHeight;

			that.setData({
				h: h
			})


        var post = this.post;
        var options = this.options;

		let tmp_opt = JSON.parse(this.optionStr);
		options = Object.assign(options, tmp_opt);

        this.setData({
            post: {
                store_id: options.store_id,
				sidx: options.sidx ? options.sidx : 'product_order',
				sord: options.sord ? options.sord : 'ASC',
                keywords: options.pname,
                store_category_ids: options.store_category_id,
                category_id: options.category_id,
                brand_id: options.brand_id,
                product_tag_ids: options.tag_id ? [options.tag_id] : [],
                kind_id: options.kind_id,
				store_type:options.store_type,
                curpage: 1,

                price_from: options.price_from ? options.price_from : '',
                price_to: options.price_to ? options.price_to : '',

                sp_from: options.sp_from ? options.sp_from : '',
                sp_to: options.sp_to ? options.sp_to : '',

                points_from: options.points_from ? options.points_from : '',
                points_to: options.points_to ? options.points_to : '',

                pa_id: options.pa_id ? options.pa_id : '',
                pa_type_id: options.pa_type_id ? options.pa_type_id : '',

                virtual: 0,
                activity_type_ids: options.activity_type_id ? [options.activity_type_id] : [],
                contract_type_ids: options.contract_type_id ? [options.contract_type_id] : [],
                market_category_ids: options.market_category_id ? [options.market_category_id] : [],
                assist: {}
            }
        });

        this.GetPlist(function() {
            that.pdlist.length == 0 ? that.setData({ isdata: !1 }) : that.setData({ isdata: !0 });
        });

		uni.$on('diy-scrollbottom', function (data) {
			console.log('监听到事件来自 update ，携带参数 uniId 为：' + data.uniId);

			if (data.uniId == that.uniId)
			{
				console.log('监听到 scrollbottom');
				console.info(that.$refs)
				that.scrollbottom();
			}
		})
    },
	watch:{
		options(newVal, oldVal){
            this.setData({
                pdlist: []
            });

			let that = this;

			var post = this.post;
			var options = this.options;



			this.setData({
			    post: {
			        store_id: options.store_id,

					sidx: options.sidx ? options.sidx : 'product_order',
					sord: options.sord ? options.sord : 'ASC',

			        keywords: options.pname,
			        store_category_ids: options.store_category_id,
			        category_id: options.category_id,
			        brand_id: options.brand_id,
			        product_tag_ids: options.tag_id ? [options.tag_id] : [],
			        kind_id: options.kind_id,
					store_type:options.store_type,
			        curpage: 1,

			        price_from: options.price_from ? options.price_from : '',
			        price_to: options.price_to ? options.price_to : '',

			        sp_from: options.sp_from ? options.sp_from : '',
			        sp_to: options.sp_to ? options.sp_to : '',

			        points_from: options.points_from ? options.points_from : '',
			        points_to: options.points_to ? options.points_to : '',

			        pa_id: options.pa_id ? options.pa_id : '',
					pa_type_id: options.pa_type_id ? options.pa_type_id : '',

			        virtual: 0,
			        activity_type_ids: options.activity_type_id ? [options.activity_type_id] : [],
			        contract_type_ids: options.contract_type_id ? [options.contract_type_id] : [],
                    market_category_ids: options.market_category_id ? [options.market_category_id] : [],
			        assist: {}
			    }
			});

			this.GetPlist(function() {
			    that.pdlist.length == 0 ? that.setData({ isdata: !1 }) : that.setData({ isdata: !0 });
			});
		},

		optionStr(newVal, oldVal){
			this.setData({
				pdlist: []
			});

			let that = this;

			var post = this.post;
			var options = {};

			if (typeof newVal == 'string')
			{
				options = JSON.parse(newVal);
			}
			else
			{
				options = newVal;
			}

			this.setData({
				post: {
					store_id: options.store_id,
					sidx: options.sidx ? options.sidx : 'product_order',
					sord: options.sord ? options.sord : 'ASC',
					keywords: options.pname,
					store_category_ids: options.store_category_id,
					category_id: options.category_id,
					brand_id: options.brand_id,
					product_tag_ids: options.tag_id ? [options.tag_id] : [],
					kind_id: options.kind_id,
					store_type:options.store_type,
					curpage: 1,

					price_from: options.price_from ? options.price_from : '',
					price_to: options.price_to ? options.price_to : '',

					sp_from: options.sp_from ? options.sp_from : '',
					sp_to: options.sp_to ? options.sp_to : '',

					points_from: options.points_from ? options.points_from : '',
					points_to: options.points_to ? options.points_to : '',

					pa_id: options.pa_id ? options.pa_id : '',
					pa_type_id: options.pa_type_id ? options.pa_type_id : '',

					virtual: 0,
					activity_type_ids: options.activity_type_id ? [options.activity_type_id] : [],
					contract_type_ids: options.contract_type_id ? [options.contract_type_id] : [],
					market_category_ids: options.market_category_id ? [options.market_category_id] : [],
					assist: {}
				}
			});

			this.GetPlist(function() {
				that.pdlist.length == 0 ? that.setData({ isdata: !1 }) : that.setData({ isdata: !0 });
			});
		}
	},
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

        viewType: function(e) {
            this.viewtype == 0 ? this.setData({ viewtype: 1 }) : this.setData({ viewtype: 0 });
        },

        /**
         * 销量排序
         */
        sealnum: function() {
            var post = this.post;
            post.sidx = 'product_sale_num';
            post.sord = 'DESC';
            post.curpage = 1;

            this.setData({
                pdlist: [],
                post: post
            });

			this.GetPlist();
        },

        /**
         * 新品排序
         */
        newpd: function() {
            var post = this.post;
            post.sidx = 'product_add_time';
            post.sord = 'DESC';
            post.curpage = 1;

            this.setData({
                pdlist: [],
                post: post
            });

			this.GetPlist();
        },

        /**
         * 价格排序
         */
        pdprice: function() {
            var post = this.post;
            post.sidx = 'product_unit_price';
            post.sord = this.sort == 1 ? 'DESC' : 'ASC';
            post.curpage = 1;

            this.sort == 1
                ? this.setData({
                      sort: 2,
                      pdlist: [],
                      post: post
                  })
                : this.setData({
                      pdlist: [],
                      sort: 1,
                      post: post
                  });

            this.GetPlist();
        },

        /**
         * 过滤搜索
         */
        onFilter: function() {
            var post = this.post;

            post.curpage = 1;
            post.activity_type_ids = [];
            post.contract_type_ids = [];
            post.market_category_ids = [];

            var is_filter = false;

            for (var i = 0; i < this.contract_row.length; i++) {
                if (!this.contract_row[i].contract_is_unselected) {
                    post.contract_type_ids.push(this.contract_row[i].contract_type_id);

                    is_filter = true;
                }
            }

			for (var i = 0; i < this.market_row.length; i++) {
			    if (!this.market_row[i].market_is_unselected) {
			        post.market_category_ids.push(this.market_row[i].market_category_id);

			        is_filter = true;
			    }
			}

            if (!this.inverted.gift) {
                post.activity_type_ids.push(this.StateCode.ACTIVITY_TYPE_GIFT);
                is_filter = true;
            }

            if (!this.inverted.groupbuy) {
                post.activity_type_ids.push(this.StateCode.ACTIVITY_TYPE_DIY_PACKAGE);
                is_filter = true;
            }

            if (!this.inverted.xianshi) {
                post.activity_type_ids.push(this.StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT);
                is_filter = true;
            }

            if (!this.inverted.virtual) {
                post.virtual = 1;
                is_filter = true;
            } else {
                post.virtual = 0;
            }

			post.assist = {};

			let ao = {};
			for (var a = 0, lenA = this.assist.length; a < lenA; ++a) {
				var items = this.assist[a].item;

				let temp = [];
				for (var i = 0, lenI = items.length; i < lenI; ++i) {

					if (!items[i].assist_is_unselected)
					{
						temp.push(items[i].assist_item_id);
					}
				}

				if (temp.length > 0)
				{
					ao[this.assist[a].assist_id] = temp;
				}
			}

			/*
			post.assist = JSON.stringify(ao);
			post.activity_type_ids = JSON.stringify(post.activity_type_ids);
			post.contract_type_ids = JSON.stringify(post.contract_type_ids);
			post.market_category_ids = JSON.stringify(post.market_category_ids);
			*/

			post.assist = ao;
			post.activity_type_ids = post.activity_type_ids;
			post.contract_type_ids = post.contract_type_ids;
			post.market_category_ids = post.market_category_ids;
			
            this.setData({
                pdlist: [],
                post: post,
                is_filter: is_filter
            });

            this.GetPlist();

            this.rightDrawerVisible = false;
        },


		assistItemReset: function (e) {
			var aid = parseInt(e.target.dataset.aid);

			let assist = this.assist.concat();
			var items = assist[aid].item;

			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;
			}

			this.setData({assist:assist})
		},

		assistItemChange: function (e) {
			var values = e.detail.value;
			var aid = parseInt(e.target.dataset.aid);

			let assist = this.assist.concat();
			var items = assist[aid].item;

			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;
				for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
					if (items[i].assist_item_id == values[j]) {
						items[i].checked = true;
						break
					}
				}
			}

			this.setData({assist:assist})
		},
		assistItemRadionChange: function (e) {
			var value = e.target.value;
			var aid = parseInt(e.target.dataset.aid);

			let assist = this.assist.concat();
			var items = assist[aid].item;

			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;
					if (items[i].assist_item_id == value) {
						items[i].checked = true;
						break
					}
			}

			this.setData({assist:assist})
		},
        scrollbottom: function(e) {
            if (this.flag) {
                var that = this;
                that.setData({ flag: !1 }), clearTimeout(n);

                var post = this.post;
				/*
                post.sidx = 'product_unit_price';
                post.sord = this.sort == 1 ? 'DESC' : 'ASC';
				*/
                post.curpage = parseInt(that.post.curpage) + 1;

                var n = setTimeout(function() {
                    that.setData({
                        post: post
                    }),
                        that.GetPlist();
                }, 500);
            }
        },

        /*
             * 读取商品数据
             */
        GetPlist: function(callback) {
			
			let url = this.Config.URL.store.product;
			
			if (this.isGuessFlag)
			{
				url = this.Config.URL.product.guess;
			}
			
            this.setData({ flag: !1 });
            var that = this;
			
			let params = Object.assign({}, that.post);
			
			params.assist = JSON.stringify(that.post.assist);
			params.activity_type_ids = JSON.stringify(that.post.activity_type_ids);
			params.contract_type_ids = JSON.stringify(that.post.contract_type_ids);
			params.market_category_ids = JSON.stringify(that.post.market_category_ids);
			params.product_tag_ids = JSON.stringify(that.post.product_tag_ids);
			
            that.$.request({
                url: url,
                data: params,
				loading: false,
                ajaxCache: {
                    timeout: this.Config.CACHE_EXPIRE
                },
                success: function(data, status, msg, code) {
                    for (var i = 0; i < data.items.length; i++) {
                        data.items[i]['id'] = data.items[i]['item_id'];
                        data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
                        data.items[i]['ProductName'] = data.items[i]['product_name'];
                        data.items[i]['ProductTips'] = data.items[i]['product_tips'];
                        data.items[i]['SalesName'] = data.items[i]['product_name'];
                        data.items[i]['ProductPic'] = data.items[i]['product_image'];
                        data.items[i]['ItemSalePrice'] = data.items[i]['item_unit_price'];
                        data.items[i]['SaleNum'] = data.items[i]['product_sale_num'];
                        data.items[i]['Stock'] = data.items[i]['product_quantity'];
                        data.items[i]['HasManualSku'] = data.items[i]['item_color'].length > 1;
                        data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
                        data.items[i]['user_cart_quantity'] = 1;
                    }

					if (that.assist.length == 0)
					{


						for (var i = 0; i < data.assist.length; i++) {
							for (var j = 0; j < data.assist[i]['item'].length; j++) {
								data.assist[i]['item'][j].assist_is_unselected = true
							}
						}
						that.setData({
						  assist: data.assist
						})
					}

					if (200 == status && data.items.length > 0) {
						if (data.page >= data.total || data.page >= that.maxNumber) {
							that.setData({
								flag: !1,
								ispage: !1,
								pdlist: that.pdlist.concat(data.items),
							})
						} else {
							that.setData({
								flag: !0,
								ispage: !0,
								pdlist: that.pdlist.concat(data.items),
							})
						}

						that.setData({
							isdata: !0
						})

					} else {
						that.setData({
							flag: !1,
							ispage: !1,
							isdata: !1
						})
					}


                    callback && callback();

                }
            });
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
        },
        onCloseFilter() {
            this.rightDrawerVisible = false;
        },
        onOpenFilter() {
            this.rightDrawerVisible = true;

            //
            let that = this;

            if (this.contract_row.length == 0) {
                that.$.request({
                    url: that.Config.URL.search_filter,
                    data: {},
                    ajaxCache: {
                        timeout: this.Config.CACHE_EXPIRE
                    },
                    success: function(data, status, msg, code) {
                        let aaa = data.contract;

                        for (var i = 0; i < aaa.length; i++) {
                            aaa[i].contract_is_unselected = true;
                        }

                        that.setData({ contract_row: aaa });


						let market = data.market;

						for (var i = 0; i < market.length; i++) {
							market[i].market_is_unselected = true;
						}

						that.setData({ market_row: market });
                    }
                });
            }
        },

        setType(type) {
            this.inverted[type] = !this.inverted[type];
        },

        setContract(index) {
            this.contract_row[index].contract_is_unselected = !this.contract_row[index]
                .contract_is_unselected;
        },

        setMarket(index) {
			console.info(this.market_row[index]);
            this.market_row[index].market_is_unselected = !this.market_row[index].market_is_unselected;
        },

		setAssist(aid,index) {
			console.info(this.assist[aid]['item'][index]);
			this.assist[aid]['item'][index].assist_is_unselected = !this.assist[aid]['item'][index].assist_is_unselected;
        }
    }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables.scss';

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
    display: flex;
    justify-content: space-between;

	label{
		font-weight: initial;
	}
}
.m-listv
{
	.m-product-price1 {
		width: 312rpx;
	}
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
.u-pa .m-tab-top {
    top: 0;
}

.filter-box {
    top: var(--window-top);
}

.filter-box-top {
    top: 0;
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


.u-pa {
    position: inherit!important;
}

.u-pa .m-product-list
{
	padding-top:0upx;
}

.u-pa .m-tab{
	position: relative;
}

.dropItem {
}


	.u-pa .m-product-list{
		padding:0px!important;
	}

	.m-listv .m-product-item:nth-child(1){
		margin-top: 20rpx!important;
	}

	.m-listv .m-product-item:nth-child(2){
		margin-top: 20rpx!important;
	}


	.m-listv .m-product-item:nth-child(odd){
		margin-left: 0;
	}

	.m-listv .m-product-item:nth-child(even){
		margin-right: 0;
	}

</style>
