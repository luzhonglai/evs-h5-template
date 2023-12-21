<template>
	<view>
		<view class="m-product-all">
			<view class="m-tab">
				<view class="m-navbar">
					<view :class="'m-navbar-item ' + (tapindex==1?'m-navbar-item-on':'')" @click="groupLists">
						{{__('立即开团')}}
					</view>
					<view :class="'m-navbar-item ' + (tapindex==2?'m-navbar-item-on':'')" @click="toBeGroupLists">
						{{__('即将开团')}}
					</view>
				</view>
			</view>
			<view :class="(tapindex==1?'':'hide')" style="font-size:28upx;">
				<scroll-view scroll-y="true" v-if="(pdlist.length>0)" class="m-orderlist" @scrolltolower="scrollbottom" style="width:100%;height:100%;position:absolute;padding-top:80upx;box-sizing: border-box;">
					<block v-for="(item, i) in pdlist"  :key="i">
						<navigator :url="'/pages/product/detail?pid=' + (item.activity_rule.item_id) + '&gb_id=0&MEID=' + (item.activity_id)" class="m-product-item m-product-GP">
							<view class="m-product-img">
								<image lazy-load :src="(item.activity_rule.product_image)" />
							</view>
							<view class="m-product-info">
								<view class="m-product-name">
									<label><text class='u-tuan-label'>{{__('拼')}}</text>{{item.activity_rule.item_name}}</label>
									<view class="groupNumber">
										<day-countdown :timer="(item.activity_endtime)" :Type="1"></day-countdown>
									</view>
								</view>
								<view class="m-product-price" style='font-size:38upx'>
									<label>{{__('￥')}}</label>{{item.activity_rule.group_sale_price}}
									<label class="u-del-price" style='margin-left:8upx'>{{__('￥')}}{{item.activity_rule.item_unit_price}}</label>
									<button class="u-btn u-btn-default">{{__('立即开团')}}</button>
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
				</scroll-view>
				<view redirect="true" class="m-nullpage" v-else>
					<view class="m-nullpage-middle">
						<view class="m-null-tip">
							<text>{{__('亲，拼团商品正在备货中~')}}</text>
						</view>
					</view>
				</view>
			</view>

			<view :class="(tapindex==2?'':'hide')" style="font-size:28upx">
				<scroll-view scroll-y="true" v-if="(fglist.length>0)" class="m-orderlist" @scrolltolower="scrollbottomtwo" style="width:100%;height:100%;position:absolute;padding-top:80upx;box-sizing: border-box;">
					<block v-for="(item , i) in fglist"  :key="i">
						<view class="m-product-item m-product-GP">
							<view class="m-product-img">
								<image lazy-load :src="(item.activity_rule.product_image)" />
							</view>
							<view class="m-product-info">
								<view class="m-product-name">
									<label><text class='u-tuan-label'>{{__('拼')}}</text>{{item.activity_rule.item_name}}</label>
									<view class="groupNumber">
                                        	<day-countdown  :timer="(item.activity_starttime)" :Type="0"></day-countdown>
									</view>
								</view>
								<view class="m-product-price">
									<label>{{__('￥')}}</label>{{item.activity_rule.group_sale_price}}
									<label class="u-del-price">{{__('￥')}}{{item.activity_rule.item_unit_price}}</label>
									<button class="u-btn u-btn-default" style='background:#bdbdbd'>{{__('立即开团')}}</button>
								</view>
							</view>
						</view>
					</block>
					<view class="m-loading-box">
						<block v-if="(ispage1)">
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
				<view redirect="true" class="m-nullpage" v-else>
					<view class="m-nullpage-middle">
						<view class="m-null-tip">
							<text>{{__('亲，拼团商品正在备货中~')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>

	import $ from "../../helpers/util";

	import dayCountdown from "../../components/day-countdown.vue";

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
                viewtype: 0,
                pdlist: [],
                fglist: [],
                flag: !0,
                ispage: !0,
                scposition: "",
                page: 1,
                istop: !1,
                isdata: !1,
                tapindex: 1,
                activity_state: 1,

				rows:0,
				orderlist:[],
			}
		},
		components: {
			dayCountdown
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('拼团')
			});

			this.InitData()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            InitData: function ()
            {
                var that = this;
                that.setData({pdlist: []});
                var params = {
                    //store_id        : this.shopInfo.store_id,
                    activity_type_id: this.StateCode.ACTIVITY_TYPE_GROUPBOOKING,
                    activity_state  : this.activity_state,
                    page            : this.page
                };
                $.request({
                    url    : this.Config.URL.store.activity,
                    data   : params,
                    success: function (data, status, msg, code)
                    {
                        if (200 == status && data.items.length > 0) {
                            var $now = (new Date).getTime();
                            data.items.forEach(function (v,k) {
                                var $end = (new Date(v.activity_endtime.replace(/-/g, "/"))).getTime();
                                data.items[k].Time = $end - $now;
                            })
                            if (data.page >= data.total) {
                                that.setData({
                                    flag  : !1,
                                    ispage: !1,
                                    isdata: !0,
                                    pdlist: that.pdlist.concat(data.items)
                                });
                            } else {
                                that.setData({
                                    flag  : !0,
                                    ispage: !0,
                                    isdata: !0,
                                    pdlist: that.pdlist.concat(data.items)
                                });
                            }
                        } else {
                            that.setData({
                                flag  : !1,
                                ispage: !1,
                                isdata: !1
                            });
                        }
                    }
                });


            },
            groupLists: function () {
                this.setData({tapindex: 1, page: 1, rows: 10, orderlist: [], activity_state: this.StateCode.ACTIVITY_STATE_NORMAL}), this.InitData()
            },
            toBeGroupLists: function () {
                this.setData({tapindex: 2, page: 1, rows: 10, orderlist: [], activity_state: this.StateCode.ACTIVITY_STATE_WAITING}), this.InitPaging()
            },
            //saas,调用当前参与的团
            InitPaging: function () {
                this.setData({fglist: []});

                var params = {
                    //store_id        : this.shopInfo.store_id,
                    activity_type_id: this.StateCode.ACTIVITY_TYPE_GROUPBOOKING,
                    activity_state  : this.activity_state,
                    page            : this.page
                };
                var that = this;

                $.request({
                    url: this.Config.URL.store.activity,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status && data.items.length > 0) {
                            var $now = (new Date).getTime();
                            data.items.forEach(function (v,k) {
                                var $end = (new Date(v.activity_endtime.replace(/-/g, "/"))).getTime();
                                data.items[k].Time = $end - $now;
                            })
                            if (data.page >= data.total) {
                                that.setData({
                                    flag: !1,
                                    ispage: !1,
                                    isdata: !0,
                                    fglist: that.fglist.concat(data.items)
                                })
                            } else {
                                that.setData({
                                    flag: !0,
                                    ispage: !0,
                                    isdata: !0,
                                    fglist: that.fglist.concat(data.items)
                                })
                            }
                        } else {
                            that.setData({
                                flag: !1,
                                ispage: !1,
                                isdata: !1,
                            })
                        }
                    }
                });
            },
            viewType: function (e) {
                this.viewtype == 0 ? this.setData({viewtype: 1}) : this.setData({viewtype: 0})
            },
            scrollbottom: function (e)
            {
                var that = this;
                if (this.flag) {
                    e.setData({flag: !1}), clearTimeout(n);
                    var n = setTimeout(function ()
                        {
                            that.setData({page: parseInt(that.page) + 1});
                            if (that.activity_state == that.StateCode.ACTIVITY_STATE_NORMAL) {
                                this.InitData();
                            }
                            if (that.activity_state == that.StateCode.ACTIVITY_STATE_WAITING) {
                                this.InitPaging();
                            }
                        },
                        500);
                }
            },
            returnTop: function () {
                this.setData({scposition: 0})
            }
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	/*全部商品 start*/
	.groupNumber{position: absolute;bottom: 0;left: 0;font-size:24upx;color: #db384c;background: #fbebeb;text-align: center;padding: 0 10upx}
	.groupNumber .icon-icon{font-size:24upx;display: inline}
	.groupNumber text{color: #ffc001;margin: 0 2upx}
	.progressBarBox{position: absolute;right: 0;bottom: 0;color: #888;font-size: 24upx;margin-right: 20upx;}
	.u-progressBar{display:inline-block;width: 140upx;height: 20upx;background-color: #d5d5d5;border-radius: 20upx;overflow: hidden;}
	.u-progressBar-cont{height: 20upx;background-color: #ffc001;}
	.m-product-price .u-btn{padding:0;margin: 0 20upx;width: 160upx;float: right;font-size: 24upx;line-height: 50upx;margin-top: 10upx;}
	.m-product-GP{height: 232upx;}
	.m-product-GP .m-product-img {height: 223upx;width: 223upx;}
	.m-product-GP .m-product-price{line-height: 80upx;margin-top: 5upx;}
	.m-product-GP .m-product-info{height: 232upx;width: 518upx;}
	.u-del-price{color:#888888;font-size: 20upx; text-decoration:line-through;}
	/*全部商品 end*/
	/*顶部提示*/
	.u-toptip{height: 60upx;}
	.u-toptip .u-loadmore{margin-top: 0;margin-bottom: 0;position: relative;top: 20upx;}
	/*顶部提示*/
	.m-navbar-item {padding: 20upx 0;font-size: 24upx;}
	.m-navbar-item:after {border: none;}
	.m-navbar-item.m-navbar-item-on {background-color: #fff;color: #DB384C;}
	.m-navbar-item.m-navbar-item-on::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6upx;border-bottom: 6upx solid #DB384C;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}
	.m-tab{position: fixed;width: 100%;top: var(--window-top);z-index: 999;}
</style>
