<template>
	<view class="page"><view class="m-tab">
		<view class="m-navbar">
			<view :class="['m-navbar-item', (TapIndex==1?'m-navbar-item-on':'')]" @click="picDetail">
				{{__('好评')}}（{{PraiseNum}}）
			</view>
			<view :class="['m-navbar-item', (TapIndex==2?'m-navbar-item-on':'')]" @click="spcParam">
				{{__('中评')}}（{{SatisfiedNum}}）
			</view>
			<view :class="['m-navbar-item', (TapIndex==3?'m-navbar-item-on':'')]" @click="packingList">
				{{__('差评')}}（{{BadNum}}）
			</view>
		</view>
	</view>
		<scroll-view scroll-y="true" class="m-panel-bd scroll-box" @scrolltolower="scrollPage">
			<view class="m-media-box m-media-box-appmsg" v-for="(item, index) in CommentList"  :key="index">
				<view class="m-media-box-hd">
					<image lazy-load class="m-media-box-thumb" :src="(item.user_avatar)" />
				</view>
				<view class="m-media-box-bd">
					<label class="m-media-box-title">{{item.user_name}}</label>
					<view class="m-media-box-desc">
						<view style="margin-bottom:10upx;">
							<label  style="margin-right:10upx;font-size:20upx;">
								{{item.item_name}}
							</label>
						</view>
						<label v-if="(item.comment_content!=null)" >{{item.comment_content}}</label>
					</view>
					<view class="m-media-box-info">
						<view class="m-media-box-info-meta m-start" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
							<label :class="'iconfont icon-start ' + (itemIndex<=item.comment_scores)?'sel':''" :data-index="(itemIndex)" :data-type="1" @click="ServiceStart"></label>
						</view>
						<view class="m-media-box-info-meta m-tiem">{{item.comment_time}}</view>
						<view class="m-media-list">
							<image lazy-load :data-id="(item.comment_id)" v-for="(items, ii) in item.comment_image"  :key="ii" :src="(items)" @click="ImgTap"></image>
						</view>
					</view>
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
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				isStoreFlag: 0,
				viewtype: 1,
                CommentList: [],
                TapIndex:1,
				pdlist: [],
				fglist: [],
				sort: 2,
				flag: !0,
				sku: '',
				ispage: !0,
				scposition: "",
				istop: !1,
				isdata: !1,
				isVirtual: !1,
				post: {sidx: 'product_sale_num', sord: 'DESC', isnew: !1, keywords: "", store_category_ids: 0, curpage: 1, store_id:null},
                PraiseNum: 0,
                SatisfiedNum: 0,
                BadNum: 0,
				pageIndex: 1,
				rows: 10,
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('评价列表')
			});

			this.setData({sku: options.id});
			this.initData();
		},
		methods: {

			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			picDetail: function () {
				this.setData({TapIndex: 1, pageIndex: 1, flag: !0, ispage: !0, CommentList: []}), this.initData()
			},
			spcParam: function () {
				this.setData({TapIndex: 2, pageIndex: 1, flag: !0, ispage: !0, CommentList: []}), this.initData()
			},
			packingList: function () {
				this.setData({TapIndex: 3, pageIndex: 1, flag: !0, ispage: !0, CommentList: []}), this.initData()
			},
			initData: function () {
				var that = this;
                var params = {
					item_id: this.sku,

					comment_type: this.TapIndex,
					page: this.pageIndex,
					rows: this.rows,
				};
				that.$.request({
					url: this.Config.URL.product.product_comment,
					data: params,
					success: function (data, status, msg, code) {
						if (status == 200) {
							that.setData({
								PraiseNum: data.comment_num.good,
								SatisfiedNum: data.comment_num.satisfied,
								BadNum: data.comment_num.bad
							});
							if (data.page * that.rows >= data.records) {
								that.setData({
									flag: false,
									ispage: false,
									CommentList: that.CommentList.concat(data.items)
								})
							} else {
								that.setData({
									flag: true,
									ispage: true,
									CommentList: that.CommentList.concat(data.items)
								})
							}
						}
					}
				});

				/*
                that.$.xsr(that.$.makeUrl(api.getProductCommentList, params), function (t) {
                    //console.log("商品评论列表：", t), that.setData({
                        PraiseNum: t.Info.PraiseNum,
                        SatisfiedNum: t.Info.SatisfiedNum,
                        BadNum: t.Info.BadNum
                    }), t.Info != null ? t.Info.ProductCommentList.length < 10 ? that.setData({
                        flag: !1,
                        ispage: !1,
                        CommentList: that.CommentList.concat(t.Info.ProductCommentList)
                    }) : that.setData({
                        flag: !0,
                        CommentList: that.CommentList.concat(t.Info.ProductCommentList)
                    }) : that.setData({flag: !1, ispage: !1})
                })
                */
			},
			scrollPage: function (e) {
				if (this.flag)
				{
					this.setData({flag: !1});
					var t = this;
					clearTimeout(n);
					var n = setTimeout(function () {
								t.setData({pageIndex: parseInt(t.pageIndex) + 1}), t.initData()
							},
							500)
				}
			},
			ImgTap: function (e) {
				var that = this, n = [];
				for (var r in this.CommentList)
				{
					if (this.CommentList[r].comment_id == e.target.dataset.id)
					{
						for (var i in this.CommentList[r].comment_image)
						{
							n.push(this.CommentList[r].comment_image[i]);
						}
					}
				}
				var s = e.target.dataset.src;
				that.$.previewImage({current: s, urls: n})
			}
		}
	};
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-navbar-item {padding: 20upx 0;font-size: 24upx;}
	.m-navbar-item:after {border: none;}
	.m-navbar-item.m-navbar-item-on {background-color: #fff;color: $default-skin-bg;}
	.m-navbar-item.m-navbar-item-on::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6upx;border-bottom: 6upx solid $default-skin-bg;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}
	.m-tips{margin: 40upx auto;}
	.m-tab{position: fixed;top: var(--window-top);left: 0;width: 100%;z-index: 10;background-color: #fff;}
	.scroll-box{position: absolute;width: 100%;height: 100%;padding-top: 80upx;box-sizing: border-box;background-color: #f8f8f8 !important;}
	.m-start label{font-size: 24upx;}
	.m-media-box-info-meta{padding-right: 5upx;}
	.sel{color: $default-skin-bg;font-size: 24upx}
	.m-tiem{float: right;}
	.m-panel-hd label{float: right;}
	.m-panel-hd text{color: $default-skin-bg;margin-left: 10upx;}
	.m-comment .m-media-box-info-meta{font-size: 24upx;font-weight: 100;}
	.m-comment .m-media-box-hd{border-radius: 100%;overflow: hidden;vertical-align:top; }
	.m-media-list{float: left;width: 100%;}
	.m-media-list image{width: 115upx;height: 115upx;box-sizing: border-box;margin: 10upx;border: 1upx solid #eee;}
	.m-panel-bd{background-color: #fff;}
	.m-media-box-appmsg{align-items:initial;background-color: #fff;}
	.m-media-box-thumb{border-radius: 100%;}
	.m-media-box-desc{display: block; }

</style>
