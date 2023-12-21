<template>
    <view>
        <scroll-view v-if="true" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
        <!-- banner -->
        <view class="sstouch-main-layout fixed-Width">
            <view id="store-wrapper" class="sstouch-store-con">
                <!-- banner -->
                <view class="sstouch-store-top" id="store_banner">


                    <!-- banner tpl -->
                    <view class="store-top-bg"><view class="img" nc_type="store_banner_img" style="background-image:url();"></view></view>
                    <view class="store-top-mask"></view>
                    <view @click='previewImg'><image id="qrcode" :src="store_data.invite_info.qrcode" class="store-avatar" /></view>
                    <view class="store-name">
                        {{store_data.westore_name}}
                    </view>
                    <view class="store-favorate">
                        <label class="num">
                            <em id="store_favornum">
                            {{store_data.product_num}}</em>
                            <p>{{__('商品')}}</p>
                        </label>
                    </view>
                </view>
            </view>
        </view>

        <view class="goods-search-list-nav posr" style="top:0px;">
            <view id="nav_ul">
                <view><label  :class="['nav-a', (post.sidx=='' || post.sidx=='product_unit_price') ? 'current' : '']" id="sort_default" @click="sortOpt">{{__('综合排序~')}}<view class="aa"></view></label></view>
                <view><label  :class="['nav-a', post.sidx=='product_sale_num' ? 'current' : '']" @click="sealnum">{{__('销量')}}</label></view>
                <view><label  :class="['nav-a', post.sidx=='product_favorite_num' ? 'current' : '']" @click="favoritenum">{{__('人气')}}</label></view>
            </view>
            <view class="browse-mode"><label  id="show_style" @click.stop="viewType"><view :class="viewtype==0? 'browse-grid' : 'browse-list'"></view></label></view>
        </view>
        <view id="sort_inner" :class="['goods-sort-inner',   isInnerFlag ? '' : 'hide']" style="position:static">
            <view><label  :class="post.sidx=='' ? 'cur' : ''" @click="sortDefault">{{__('综合排序~')}}<view class="aa"></view></label></view>
            <view><label  :class="post.sidx=='product_unit_price' &&  post.sord=='DESC' ? 'cur' : ''" @click="pdprice">{{__('价格从高到低')}}<view class="aa"></view></label></view>
            <view><label  :class="post.sidx=='product_unit_price' &&  post.sord=='ASC' ? 'cur' : ''" @click="upPrice">{{__('价格从低到高')}}<view class="aa"></view></label></view>
        </view>

        <view class="sstouch-main-layout mb20" style="margin-top:0;">
            <view id="product_list" :class="viewtype==0? 'grid' : 'list'">
                <view class="goods-secrch-list">
                    <view class="goods-item" :item_id="item['item_color'][0].item_id"   :data-item_id="item['item_id']"   :data-product_id="item['product_id']"   v-for="(item, i) in store_data.items" :key="i"   @longpress="modify">
                        <view class="goods-pic">
                            <navigator :url="'/pages/product/detail?pid=' + item['item_id']" class="a" >
                                <image :src="item.product_image" />
                            </navigator>
                        </view>
                        <dl class="goods-info">
                            <dt class="goodsName">
                                <navigator  :url="'/pages/product/detail?pid=' + item['item_id']"  class="a">
                                    <h4>{{item.product_name}}</h4>
                                </navigator>
                            </dt>
                            <p><view class="goods-price">{{__('￥')}}<label>{{item.product_unit_price}}</label></view> </p>
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

		<!-- #ifdef APP-PLUS -->
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
					  @saveImg="saveImg"  ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->
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
				options:{},
                isStoreFlag: 0,
                viewtype: 1,
                pdlist: [],
                fglist: [],
                sort: 2,
                flag: !0,
                ispage: !0,
                scposition: "",
                istop: !1,
                isdata: !1,
                isVirtual: !1,
                isInnerFlag: !1,
                post: {
                    sidx: '',
                    sord: '',
                    isnew: !1,
                    keywords: "",
                    store_category_ids: 0,
                    page: 1,
                    wd_id: null
                },

                store_data:{invite_info:{}},


				PageQRCodeInfo: {
					Path: "",
					IsShare: !1,
					IsShareBox: !1,
					IsJT: !1
				},
				shareData:{}
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			shareBoxMp,
			shareBoxApp
		},
        onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('微小店')
            });
            var that = this;

			if (options.scene) {
				var scene = decodeURIComponent(options.scene);
				var opts = {};

				opts = that.$.parse_str(scene);

				options = Object.assign(options, opts);
			}

            this.setData({
				options:options,
                isStoreFlag: options.is_store_flag ? parseInt(options.is_store_flag) : 0
            })

            this.setData({
                post: {
                    wd_id: options.wd_id || this.userInfo.user_id,
                    sidx: 'product_sale_num',
                    sord: 'DESC',
                    keywords: options.pname,
                    store_category_ids: options.store_category_id,
                    category_id: options.category_id,
                    kind_id: options.kind_id,
                    page: 1
                }
            });

            this.GetPlist(function() {
                that.pdlist.length == 0 ? that.setData({
                    isdata: !1
                }) : that.setData({
                    isdata: !0
                })



				setTimeout(function() {
					//初始化微信分享
					let $title = that.store_data.westore_name;
					let $desc = that.store_data.westore_name;
					let $link =  that.$.sprintf('%s/h5/pagesub/westore/index?wd_id=%s', that.Config.SiteUrl, that.post.wd_id);
					//let $img_url = that.store_data.invite_info.qrcode;
					let $img_url = that.userInfo.user_avatar

					//初始化微信分享
					that.$.wxShare($title, $desc, $link, $img_url)
				}, 100);
            })
        },
		onShareAppMessage() {
			return {
				title: this.store_data.westore_name,
				path: "/pagesub/westore/index?wd_id=" + this.post.wd_id
			}
		},
		onBackPress() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
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
		onUnload() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
			}
			// #endif
			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
		},
		onNavigationBarButtonTap(e) {
			var that = this;

			if (e.index === 0) {
				that.onShareBox(e);
			} else {
				uni.showToast({
					title: this.__("你点了收藏按钮"),
					icon: "none"
				})
			}
		},
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            viewType: function(e) {
                this.viewtype == 0 ? this.setData({
                    viewtype: 1
                }) : this.setData({
                    viewtype: 0
                })
            },


            /**
             * 销量排序
             */
            sortOpt: function() {
                this.setData({
                    isInnerFlag:true
                })
            },

    /**
             * 销量排序
             */
            sortDefault: function() {

                this.setData({
                    isInnerFlag:false
                })

                var post = this.post
                post.sidx = '';
                post.sord = '';
                post.page = 1;

                this.setData({
                    pdlist: [],
                    post: post
                }), this.GetPlist()
            },

            /**
             * 销量排序
             */
            sealnum: function() {
                this.setData({
                    isInnerFlag:false
                })

                var post = this.post
                post.sidx = 'product_sale_num';
                post.sord = 'DESC';
                post.page = 1;

                this.setData({
                    pdlist: [],
                    post: post
                }), this.GetPlist()
            },

            /**
             * 销量排序
             */
            favoritenum: function() {
                this.setData({
                    isInnerFlag:false
                })

                var post = this.post
                post.sidx = 'product_favorite_num';
                post.sord = 'DESC';
                post.page = 1;

                this.setData({
                    pdlist: [],
                    post: post
                }), this.GetPlist()
            },

            /**
             * 新品排序
             */
            newpd: function() {
                this.setData({
                    isInnerFlag:false
                })

                var post = this.post
                post.sidx = 'product_add_time';
                post.sord = 'DESC';
                post.page = 1;

                this.setData({
                    pdlist: [],
                    post: post
                }), this.GetPlist()
            },

            /**
             * 价格排序
             */
            pdprice: function() {
                this.setData({
                    isInnerFlag:false
                })


                var post = this.post
                post.sidx = 'product_unit_price';
                post.sord = this.sort == 1 ? 'DESC' : 'ASC';
                post.page = 1;

                this.sort == 1 ? this.setData({
                    sort: 2,
                    pdlist: [],
                    post: post
                }) : this.setData({
                    pdlist: [],
                    sort: 1,
                    post: post
                });

                this.GetPlist()
            },

            /**
             * 价格排序
             */
            upPrice: function() {
                this.setData({
                    isInnerFlag:false
                })


                var post = this.post
                post.sidx = 'product_unit_price';
                post.sord = this.sort == 1 ? 'DESC' : 'ASC';
                post.page = 1;

                this.sort == 1 ? this.setData({
                    sort: 2,
                    pdlist: [],
                    post: post
                }) : this.setData({
                    pdlist: [],
                    sort: 1,
                    post: post
                });

                this.GetPlist()
            },

            scrollbottom: function(e) {
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
                this.setData({
                    flag: !1
                });

                var that = this;
                let params = that.post;
                params.u_id = that.post.wd_id;

				// #ifdef H5
				params['poster_type'] = 1
				// #endif
				// #ifdef MP-WEIXIN
				params['poster_type'] = 2
				// #endif
				// #ifdef APP-PLUS
				params['poster_type'] = 1
				// #endif


                that.$.request({
                    url: this.Config.URL.user.direct_store_index,
                    data: params,
                    /* ajaxCache: {
                        timeout: this.Config.CACHE_EXPIRE
                    }, */
                    success: function(data, status, msg, code) {

						that.$.setNavigationBarTitle({
							title: data.westore_name
						});


                        that.setData({
                            store_data: data
                        })


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
                    }
                });
            },
            modify: function(e) {
            	var that = this;
                e.currentTarget.dataset.item_id;

                let itemList = ['删除']

                uni.showActionSheet({
                    itemList: itemList,
                    success: (res) => {
                        if (res.tapIndex == 0)
                        {
                            that.removeFromWestore(e);
                        }
                        else
                        {
                        }
                    }
                })

            },
            removeFromWestore: function(e) {
            	var that = this;

                var params = {
                    product_id:e.currentTarget.dataset.product_id
                };

                that.$.request({
                    url: this.Config.URL.user.direct_store_remove,
                    data: params,
                    success: function(data, status, msg, code) {
                        if(status == 200)
                        {
                            that.$.alert(msg);

                            that.GetPlist()
                        }
                        else
                        {
                            that.$.alert(msg);
                        }
                    }
                });

            },
			onShareBox: function(e) {

                let that = this;
				var $href = that.$.sprintf('%s/tmpl/member/directseller_store.html?u_id=%d&FX=%d', this.Config.WapSiteUrl, this.post.wd_id, this.userInfo
						.user_id);


                $href = that.$.sprintf('%s/h5/pagesub/westore/index?wd_id=%s&uid=%d', that.Config.SiteUrl, this.post.wd_id, this.userInfo.user_id);

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				// #endif

				// #ifdef MP-WEIXIN
				$href = "/pagesub/westore/index?wd_id=" + this.post.wd_id;
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.store_data.westore_name,
						shareText: this.store_data.westore_name,
						href: $href,
						image: this.store_data.invite_info.qrcode
					}
				});

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif

				// #ifdef MP-WEIXIN
				this.$refs.shareBoxMp.show();
				// #endif
			},
            returnTop: function() {
                this.setData({
                    scposition: 0
                })
            },
			previewImg: function() {
				let that = this;
				that.$.previewImage({
					current: that.store_data.invite_info.qrcode,
					urls: [that.store_data.invite_info.qrcode]
				})
			}
        }
    }
</script>

<style lang="scss">

	@import "../../styles/base.scss";
	@import "../../styles/sstouch_products_list.scss";
	@import "../../styles/sstouch_common.scss";
	@import "../../styles/sstouch_directseller_store.scss";

    .u-loadmore
    {
        width: 100%;
    }
</style>
