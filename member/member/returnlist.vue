<template>
    <view v-if="loadComplete">
        <scroll-view v-if="isdata" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
            <view class="sstouch-main-layout">
                <view class="sstouch-order-list" style="padding-bottom: 12px;">
                    <view>
                        <view v-if="pdlist.length > 0">
                            <view v-for="(item, index) in pdlist"  :key="index" :class="index > 0 ? 'mt10' : ''">
                                <view class="sstouch-order-item">
                                    <view class="sstouch-order-item-head">
                                        <navigator url="javascript:void(0);" class="store"><i class="icon"></i>{{__('服务单号：')}}{{item.order_id}}</navigator><span class="state">{{item.return_state_name}}</span>
                                    </view>
                                    <view class="sstouch-order-item-con">
										<view class="m-product-list">
											<navigator :url="'/pages/product/detail?pid=' + val.item_id" v-for="(val, ii) in item.items" :key="ii" class="m-product-item">
												<view class="m-product-img">
													<image :src="(val.order_item_image)" mode="aspectFill" />
												</view>
												<view class="m-product-info">
													<view class="m-product-name">
														<label>{{val.item_name}}</label>
													</view>
										
													<view class="m-product-price">
														<text>x{{val.return_item_num}}</text>
													</view>
												</view>
											</navigator>
										</view>
                                    </view>
                                    <view class="sstouch-order-item-footer">
										<view class="m-cells" >
											<view class="m-cell m-cell-access m-info-sp" style="border-bottom: 2upx solid #ebebe7;">
													<view class="m-cell-bd">
															<text class="m-info-tip">{{__('退款总金额')}}</text>
													</view>
													<label>{{__('￥')}}{{item.return_refund_amount}}</label>
											</view>
											<view class="m-cell m-cell-access m-info-sp" style="border-bottom: 2upx solid #ebebe7;">
													<view class="m-cell-bd">
															<text class="m-info-tip">{{__('退货数量')}}</text>
													</view>
													<label>{{item.return_num}}</label>
											</view>
											<view class="m-cell m-cell-access m-info-sp" style="border-bottom: 2upx solid #ebebe7;">
													<view class="m-cell-bd">
													</view>
													<label>{{item.return_add_time}}</label>
											</view>
										</view>
                 
                                        <view class="handle">
                                            <view class="pull-right">
                                                <navigator :url="sprintf('/member/member/returndetail?return_id=%s', item.return_id)" class="btn">{{__('退款详情')}}</navigator>

                                                <navigator v-if="item.delay_state == 1" url="javascript:void(0);" :data-return_id="item.return_id" class="btn delay-btn">{{__('延迟')}}</navigator>
                                                <navigator v-if="item.ship_state == 1" :url="sprintf('/member/member/returndetail?return_id=%s', item.return_id)" class="btn key">{{__('退货发货')}}</navigator>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>


                            <view class="loading" v-if="flag"><view class="spinner"><i></i></view>{{__('订单数据读取中...')}}</view>
                        </view>
                        <view class="sstouch-norecord refund" v-else>
                            <view class="norecord-ico"><i></i></view>
                            <dl>
                                <dt>{{__('您还没有退货信息')}}</dt>
                                <dd>{{__('已购订单详情可申请退货')}}</dd>
                            </dl>
                        </view>

                    </view>
                </view>
            </view>

            <view class="m-loading-box">
                <block v-if="(ispage)">
                    <view class="u-loadmore">
                        <view class="u-loading"></view>
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
        <view class="m-nullpage" v-else>
            <view class="m-nullpage-middle">
                <label class="iconfont icon-meiyougengduo"></label>
                <view class="m-null-tip">
                    <label style="font-size:32upx;">{{__('亲~什么都没有')}}</label>
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
                pdlist: [],
                flag: !0,
                ispage: !0,
                scposition: "",
                istop: !1,
                isdata: !1,
                post: {
                    sidx: '',
                    sord: '',
                    isnew: !1,
                    keywords: "",
                    store_category_ids: 0,
                    page: 1,
                    wd_id: null
                },
				sort:0,
				loadComplete: false // 没有加载数据前不显示的对应内容
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('售后服务')
            });
            var that = this;
			that.GetPlist();
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
            scrollbottom: function(e) {
				//console.info(222)
                if (this.flag) {
                    var that = this;
                    that.setData({
                        flag: !1
                    }), clearTimeout(n);

                    var post = this.post
                    post.sidx = 'product_unit_price';
                    post.sord = this.sort == 1 ? 'DESC' : 'ASC';
                    post.page = parseInt(that.post.page) + 1;

                    var n = setTimeout(function() {
                            that.setData({
                                post: post
                            }), that.GetPlist()
                        },
                        500)
                }
            },

            /*
             * 读取商品数据
             */
            GetPlist: function(callback) {
				//console.info(1111111)
                this.setData({
                    flag: !1
                });

                var that = this;
                let params = that.post;
                params.u_id = that.post.wd_id;


                that.$.request({
                    url: this.Config.URL.user.return_lists,
                    data: params,
                    success: function(data, status, msg, code) {

                        if (data.page >= data.total) {
                            that.setData({
                                flag: !1,
                                ispage: !1,
                                pdlist: that.pdlist.concat(data.items)
                            })
                        } else {
                            that.setData({
                                flag: !0,
                                ispage: !0,
                                pdlist: that.pdlist.concat(data.items)
                            })
                        }

						that.pdlist.length == 0 ? that.setData({
						    isdata: !1,
							loadComplete : !0
						}) : that.setData({
						    isdata: !0,
							loadComplete : !0
						})
                    },
					fail: function(data) {
						that.setData({
							loadComplete: !0
						});
						that.$.alert("网络异常请重试！");
                    }
                });
            },
            returnTop: function() {
                this.setData({
                    scposition: 0
                })
            }
        }
    }
</script>

<style lang="scss">

	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";

    .u-loadmore
    {
        width: 100%;
    }

		.m-orderlist {
		padding-top: 0upx;
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}
	.m-product-img {
		width: 130upx;
		height: 130upx;
		background: #D8D8D8;
		border-radius: 16upx;
		overflow:hidden;
		margin: 36upx 32upx 34upx 32upx;
	}
	
	.m-product-img image {
		width: 100%;
		height: 100%;
		
	}
	
	.m-product-item {
		display: flex;
		justify-content: flex-start;
		align-items: center ;
		height: 200upx;
		background: #FFFFFF;
	}
	
	.m-product-info {
		height: 130upx;
	}
	
	.m-product-price {
		font-size: 26upx;
		font-weight: 400;
		color: #B2B2B2;
		line-height: 30upx;
	}
	
	.m-cell {
		padding:20upx 0upx;
		
		font-size: 28upx;
		font-weight: 500;
		color: #000000;
		line-height: 56upx;
	}
	
	.sstouch-order-item-head .state {
		font-size: 28upx;
		font-weight: 600;
		color: #000000;
		line-height: 56upx;
	}
	
	.btn {
		background: #FFFFFF;
		border-radius: 8upx;
		border: 2upx solid #000000;
	
		font-size: 28upx;
		font-weight: 500;
		color: #000000 !important;
		line-height: 40upx;
	}
</style>
