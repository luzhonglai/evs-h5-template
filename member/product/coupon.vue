<template>
    <view class="page">
        <view  class="m-scroll-box" v-if="(SuitProduct.length > 0)">
            <scroll-view scroll-y="true" @scrolltolower="scrollbottom" @scroll="scrollView" @scrolltoupper="scrollTop" :class="'m-product-all u-pa ' + (istop?'u-patop':'u-pabtn')">

                <view :class="'m-product-list ' + (viewtype==1?'fadeIn animated m-listv':'')" style="padding-top:0;">
                    <navigator v-for="(item, index) in SuitProduct"  :key="index" :url="(item.ProductForm==2?'/pages/product/detail':'/pages/product/detail') + '?pid=' + (item.item_id)" class="m-product-item">
                        <view class="m-product-img">
                            <image lazy-load :src="(item.product_image)" mode="aspectFill" />
                        </view>
                        <view class="m-product-info">
                            <view class="m-product-name">
                                <label>{{item.product_name}}</label>
                            </view>
                            <view class="m-product-price">
                                <label>{{__('￥')}}</label>{{item.product_unit_price}}
                            </view>
                        </view>
                    </navigator>
                </view>
                <view class="u-top-default">
                    <view class="u-view" @click="viewType" style="line-height: 96rpx;">
                        <label :class="'iconfont zc ' + (viewtype==1?'zc-viewlist':'zc-viewgallery')"></label>
                    </view>
                    <view class="u-back hide" @click="retruntop">
                        <label class="iconfont icon-fanhuidingbu"></label>
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
        </view>

        <view class="m-nullcontent" v-else>
            <view class="m-nullpage-middle">
                <label class="iconfont icon-meiyougengduo"></label>
                <view class="m-null-tip">
                    <text>{{__('亲~什么都没有')}}</text>
                    <text>{{__('该优惠券没有可适用的商品~')}}</text>
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
        name: "product-coupon",
        data: function() {
            return {
                page: 1, tapindex: 0, ispage: !0, flag: !0, SuitProduct: [], store_id: 0, viewtype: 0, voucher_item_id: 0
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('优惠券商品')
            });

            this.setData({
                store_id: options.store_id,
                voucher_item_id: options.voucher_item_id,
            }), this.getCouponlist()
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
            getCouponlist: function () {
                var params = {
                    page: this.page,
                    store_id: this.store_id,
					voucher_item_id: this.voucher_item_id,
                };

                var that = this;
                that.$.request({
                    url: this.Config.URL.store.product,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status && data.items.length > 0) {
                            if (data.page >= data.total) {
                                that.setData({
                                    SuitProduct: that.SuitProduct.concat(data.items),
                                    flag: !1,
                                    ispage: !1
                                })
                            } else {
                                that.setData({
                                    SuitProduct: that.SuitProduct.concat(data.items),
                                    flag: !0,
                                    ispage: !0
                                })
                            }
                        } else {
                            that.setData({flag: !1, ispage: !1})
                        }
                    }
                });
            },
            scrollbottom: function () {
                if (this.flag)
                {
                    var e = this;
                    e.setData({flag: !1}), clearTimeout(t);
                    var t = setTimeout(function () {
                            e.setData({page: parseInt(e.page) + 1}), e.getCouponlist()
                        },
                        500)
                }
            },
            viewType: function () {
                // 切换展示类型
                var viewType = this.viewtype;
                this.setData({
                    viewtype: viewType ? 0 : 1
                })
            }
        }
    };
</script>

<style lang="scss">
    @import "../../styles/_variables";
</style>
