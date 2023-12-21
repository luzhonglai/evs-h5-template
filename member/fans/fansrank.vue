<template>
    <view>
        <view v-if="(CashData.isShowDistributionButton||isShowBtn)">
            <view class="m-endorsementBox">
                <view class="m-endorsementBox-bg">
                </view>
                <view class="m-userinfo">
                    <view class="m-photo">
                        <image lazy-load :src="(UserInfo.user_avatar)"></image>
                    </view>
                    <view class="m-text">
                        <label>{{sprintf(__('我是%s'), UserInfo.user_nickname)}}</label>
                        <text>{{sprintf(__('我为%s代言'), StoreName)}}</text>
                    </view>
                </view>
            </view>
            <view class="u-toptip" v-if="(ProductInfo!=null)">
                <view class="u-loadmore u-loadmore-line">
                    <text class="u-loadmore-tips">{{__('为您推荐')}}</text>
                </view>
            </view>
            <view class="m-product-list" v-if="(ProductInfo!=null)">
                <navigator open-type="redirect" :url="(ProductUrl) + '?pid=' + (ProductInfo.pid) + '&uid=' + (UserBase.user_id)"
                           class="m-product-item">
                    <view class="m-product-img">
                        <image lazy-load :src="(ProductInfo.ppic)" mode="aspectFill" />
                    </view>
                    <view class="m-product-info">
                        <view class="m-product-name">
                            <label>{{ProductInfo.pname}}</label>
                        </view>
                        <view class="m-product-price">
                            <label>{{__('￥')}}</label>{{ProductInfo.pprice}}
                            <button class="u-btn u-btn-default">{{buyname}}</button>
                        </view>
                    </view>
                </navigator>
            </view>
            <image lazy-load v-if="(ProductInfo==null)" :src="(invite_info.qrcode)" class="QRCodeBOx" mode="widthFix"></image>

            <view class="m-text-box" v-if="(RuleEnabled&&flag==false)">
                <view @click="showTip">
                    <label class="iconfont icon-14052218"></label>{{__('推广规则')}}
                </view>
                <view>
                    <view>
                        {{sprintf(__('当你的粉丝在店铺内支付订单后，订单中的所有商品，都有相应的收益比例：一级粉丝 %s%% ，二级粉丝 %s%% 。将支付订单金额和收益比例相乘后，累计计算出你此单的总收益。* 注： - 不计算收益的内容：运费、优惠券、关税，以及收益比例为0的商品；'), Level1Discount, Level2Discount)}}
                        {{__(' - 如果发生了退货退款，需要按照实际退货数量对收益进行相应的扣除；- 按照国家法律规定，当你的月累计收入达到相关税金起征点后，商家会为你代缴税款，你的收益将是税后收入；')}}
                    </view>
                </view>
            </view>
            <view class="m-text-box" v-else>
                <view @click="showTip">
                    <label class="iconfont icon-14052218"></label>{{__('推广规则')}}
                </view>
                <view>
                    <view>{{__('成功邀请一位好友，可获积分奖励')}}</view>
                    <view>{{__('当好友产生消费时，再获得返利奖励')}}</view>
                </view>
            </view>

            <view class="m-text-box1" v-if="(RuleEnabled&&flag)">
                <rich-text :nodes="htmlString"></rich-text>
            </view>
            <navigator v-if="(ProductInfo==null && isShowBtn && CashData.isShowDistributionButton)" class="u-btn u-btn-default"
                       @click="share">{{__('我也要代言')}}</navigator>
            <navigator class="u-btn u-btn-default" @click="share" v-if="(ProductInfo!=null &&isShowBtn)">{{__('我也要推广')}}</navigator>

            <button v-if="(ProductInfo==null && isShowBtn==false && CashData.isShowDistributionButton)" class="u-btn u-btn-default"
                    @click="onShareBox">{{__('分享赚钱')}}</button>

            <view class="u-tap-btn">
                <navigator url="/pages/index/index" open-type="switchTab" class="u-go-home">
                    <view class="iconfont icon-shouyeshouye"></view>
                </navigator>
            </view>

            <view class="m-msk" v-if="(isShowMag)" @click="closeMsk">
                <image lazy-load mode="widthFix" :src="(imgUrl) + 'share_tips.png'"></image>
            </view>
        </view>
        <navigator url="/pages/index/index" open-type="switchTab" class="m-nullpage" v-if="(CashData.isShowDistributionButton==false&&isShowBtn==false)">
            <view class="m-nullpage-middle">
                <view class="m-null-tip">
                    <text>{{__('对不起，您现在还没有分销权限')}}</text>
                    <text>{{__('多多购物有助于获取权限哦。')}}</text>
                </view>
            </view>
        </navigator>

        <share-box-mp :PageQRCodeInfo="PageQRCodeInfo" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
                      @saveImg="saveImg"></share-box-mp>
        <share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>

    </view>
</template>

<script>
    import shareBoxMp from '../../components/share-box-mp.vue'
    import shareBoxApp from '../../components/share-box-app.vue'

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data() {
            return {
                options: {},
                invite_info: {},
                UserInfo: {},
                isShowBtn: !1,
                ProductInfo: null,
                isShowMag: !1,
                Level1Discount: 0,
                Level2Discount: 0,
                imgUrl: "",
                ProductUrl: "",
                StoreName: "",
                StoreLogo: "",
                buyname: "",
                PromotionRule: "",
                htmlString: "",
                RuleEnabled: !0,
                flag: !0,
                CashData: {},
                shareData:{}
            };
        },

        components: {
            shareBoxMp,
            shareBoxApp
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('粉丝排行榜')
            });


            var that = this;
            this.getPlantformInfo(function(site) {
                that.setData({
                    StoreName: site.name,
                    StoreLogo: site.logo,
                });
            });


            this.setData({
                options: options
            })

            that.$.isNull(options.type) ? this.setData({
                ProductUrl: "/pages/product/detail",
                buyname: "去购买"
            }) : this.setData({
                ProductUrl: "/pages/product/detail",
                buyname: "去预约"
            });

            /*
			that.$.getCache("isShowMag", function(e) {},
				function() {
					that.$.setCache("isShowMag", "true", function() {
						that.setData({
							isShowMag: !0
						})
					})
				});
                */

            if (that.$.isNull(this.userInfo)) {
                this.forceUserInfo(function(user) {
                    if (user) {
                        that.setData({
                            isShowBtn: that.$.isNull(options.uid) ? !1 : !0
                        });
                        that.showButton();
                        that.getPageInfo(that.$.isNull(options.uid) ? that.userInfo.user_id : options.uid)
                    }
                });

            } else {
                this.setData({
                    isShowBtn: that.$.isNull(options.uid) ? !1 : !0
                });
                this.showButton();
                this.getPageInfo(that.$.isNull(options.uid) ? this.userInfo.user_id : options.uid);

                if (that.$.isNull(options.pid)) {
                    that.$.setNavigationBarTitle({
                        title: "我要代言"
                    });
                } else {
                    that.$.setNavigationBarTitle({
                        title: "我要推广"
                    });

                    this.setData({
                        ProductInfo: options
                    })

                    this.getPlantformInfo(function(site) {
                        that.setData({
                            flag: !0,
                            RuleEnabled: site.promotion
                        });

                        that.htmlString = site.promotion.replace(/\\/g, "").replace(/<img/g,
                            "<img style=\"display:none;\"");
                    });
                }
            }
        },

        onBackPress() {
            if (this.$refs.shareBoxApp.showBoxView) {
                this.$refs.shareBoxApp.cancel();
                return true;
            }
        },
        onUnload() {
            if (this.$refs.shareBoxApp.showBoxView) {
                this.$refs.shareBoxApp.cancel()
            }
        },
        onNavigationBarButtonTap(e) {
            var that = this;

            if (e.index === 0) {
                that.onShareBox();
                /*
                that.setData({
                    shareBoxFlag: 1,
                    shareContetnFlag: 1
                })
                */
            } else {
                uni.showToast({
                    title: "你点了收藏按钮",
                    icon: "none"
                })
            }
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            showButton: function() {
                var that = this,
                    paremt = {
                        user_id: this.userInfo.user_id
                    };
                that.setData({
                    CashData: {
                        isShowDistributionButton: true
                    }
                });
            },
            onShareAppMessage: function() {
                let that = this;
                this.setData({
                    isShowMag: !1
                });
                var e, t, n;
                return that.$.isNull(this.ProductInfo) ? (e = "/member/fans/endorsement?uid=" + this.UserInfo.Id, t = this.UserInfo.user_nickname +
                    "偷偷的告诉你，粉丝也能赚钱哦~") : (e = "/member/fans/endorsement?pid=" + this.ProductInfo.pid + "&pname=" + this.ProductInfo.pname +
                    "&pprice=" + this.ProductInfo.pprice + "&ppic=" + this.ProductInfo.ppic + "&uid=" + this.UserInfo.Id + "&type=" +
                    this.ProductInfo.type, t = "我发现这个商品很好，非常适合你哦！"), {
                    title: t,
                    desc: t,
                    path: e
                }
            },
            share: function() {
                this.getPageInfo(this.userInfo.user_id);
                this.setData({
                    isShowBtn: !1
                })
            },
            getPageInfo: function(e) {
                var that = this,
                    params = {
                        user_id: e,
                        path: "pages/index/index?uid=" + e,
                        width: 430
                    };
                that.setData({
                    Level1Discount: this.shopInfo.Level1Discount,
                    Level2Discount: this.shopInfo.Level2Discount,
                    imgUrl: this.shopInfo.ShopConfig.AppIconPath
                });

                //生成二维码并返回地址。 - 需要修改调整为小程序地址
                that.$.request({
                    url: this.Config.URL.fx.invite,
                    data: params,
                    success: function(data, status, msg, code) {
                        if (200 == status) {
                            that.setData({
                                invite_info: data.invite_info
                            });
                        } else {
                            that.setData({
                                flag: !1,
                                ispage: !1
                            })
                        }
                    }
                });

                that.$.request({
                    url: this.Config.URL.user.overview,
                    data: params,
                    success: function(data, status, msg, code) {
                        if (200 == status) {
                            that.setData({
                                UserInfo: data.member_info,
                                UserBase: data.base
                            });
                        }
                    }
                });
            },
            closeMsk: function() {
                this.setData({
                    isShowMag: !1
                })
            },
            onShareBox: function(e) {
                let that = this;
                // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
                // #ifdef APP-PLUS
                var $href = that.$.sprintf('%s/tmpl/index.html?FX=%d', this.Config.WapSiteUrl, this.userInfo
                    .user_id);
                $href = that.$.sprintf('%s/h5/pages/index/index?uid=%d', that.Config.SiteUrl, this.userInfo.user_id);
                // #endif
                // #ifdef MP-WEIXIN
                var $href = "/pages/index/index?uid=" + this.userInfo.user_id;
                // #endif


                var path, title, image;


                if (that.$.isNull(this.ProductInfo))
                {
                    path = "/member/fans/endorsement?uid=" + this.userInfo.user_id;
                    title = this.userInfo.user_nickname + "偷偷的告诉你，粉丝也能赚钱哦~";
                    image = this.StoreLogo;
                }
                else
                {
                    path = "/member/fans/endorsement?pid=" + this.ProductInfo.pid + "&pname=" + this.ProductInfo.pname +
                        "&pprice=" + this.ProductInfo.pprice + "&ppic=" + this.ProductInfo.ppic + "&uid=" + this.userInfo.user_id + "&type=" +
                        this.ProductInfo.type;

                    title = "我发现这个商品很好，非常适合你哦！"
                    image = this.ProductInfo.ppic;
                }

                this.setData({
                    shareData: {
                        shareTitle: title,
                        shareText: title,
                        href: $href,
                        image: image
                    }
                });

                this.$refs.shareBoxApp.show()
            }
        }
    }
</script>

<style lang="scss">
    @import "../../styles/_variables";

    page {
        background-color: #fff;
    }

    .u-loadmore {
        margin: 60upx auto 0 auto;
    }

    .u-loadmore-tips {
        background-color: #fff !important;
    }

    .m-endorsementBox {
        width: 100%;
        overflow: hidden;
        height: 240upx;
        position: relative;
        text-align: center;
    }

    .m-endorsementBox-bg {
        height: 940upx;
        width: 940upx;
        background-color: #1e1c1d;
        -webkit-border-radius: 940upx / 320upx;
        border-radius: 940upx / 320upx;
        margin: 0 auto;
        margin-top: -700upx;
        margin-left: -100upx;
        position: relative;
    }

    .m-userinfo-bg {
        bottom: 20upx;
        width: 400upx;
    }

    .m-userinfo {
        z-index: 2;
        position: relative;
        display: inline-block;
        position: relative;
        top: -180upx;
    }

    .m-userinfo .m-photo {
        width: 124upx;
        height: 124upx;
        float: left;
    }

    .m-photo image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .m-text {
        float: left;
        text-align: left;
        line-height: 40upx;
        margin-top: 22upx;
        margin-left: 20upx;
    }

    .m-text {
        font-size: 24upx;
        color: #eebe8c;
    }

    .m-text label {
        font-size: 32upx;
        font-weight: bold;
    }

    .m-text text {
        display: block;
    }

    .m-product-info::before {
        content: "";
        border: none;
    }

    .u-btn {
        margin-top: 80upx;
    }

    .u-tip-text {
        display: block;
        font-size: 28upx;
        text-align: center;
        color: $default-skin-bg
    }

    .m-product-price .u-btn {
        margin: 0;
        float: right;
        width: 160upx;
        height: 60upx;
        font-size: 24upx;
        margin-right: 20upx;
        margin-top: -30upx;
    }

    .QRCodeBOx {
        width: 300upx;
        display: block;
        margin: 20upx auto;
    }

    .u-tap-btn {
        position: fixed;
        right: 20upx;
        bottom: 150upx;
    }

    .u-go-home {
        border-radius: 100%;
        width: 80upx;
        height: 80upx;
        border: 1px solid #eee;
        font-size: 20upx;
        text-align: center;
        background-color: #fff;
        box-shadow: 0px 4upx 8upx rgba(0, 0, 0, 0.35);
        z-index: 2;
        opacity: 0.8;
        line-height: 80upx;
        margin-bottom: 20upx;
    }

    .u-go-home .iconfont {
        font-size: 40upx;
    }

    .m-text-box {
        font-size: 24upx;
        box-sizing: border-box;
        padding: 20upx;
        color: #888;
        line-height: 40upx;
    }

    .m-text-box label {
        padding-right: 10upx;
    }

    .m-text-box1 {
        box-sizing: border-box;
        padding: 20upx 36upx;
        color: #888;
        line-height: 40upx;
    }

    .m-text-box1 label {
        padding-right: 10upx;
        font-size: 24upx
    }

    .m-msk {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        z-index: 10;
    }

    .m-msk image {
        position: fixed;
        right: 30upx;
        top: 0;
        width: 300upx;
    }
</style>
