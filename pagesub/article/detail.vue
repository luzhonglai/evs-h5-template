<template>
	<view>
		<view class="banner">
			<image class="banner-img" :src="article_row.article_image"></image>
			<view class="banner-title">{{article_row.article_title}}</view>
		</view>
		<view class="article-meta">
			<text class="article-author">{{article_row.user_nickname}}</text>
			<text class="article-text">{{__('发表于')}}</text>
			<text class="article-time">{{article_row.article_add_time}}</text>
		</view>
		<wxParse :content="htmlString || __('内容为空')" />

		<share-box-mp :PageQRCodeInfo="PageQRCodeInfo" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
		 @saveImg="saveImg"></share-box-mp>
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->

	</view>
</template>

<script>
	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'

	import wxParse from '@/components/u-parse/u-parse.vue'
	//#ifdef H5
	import shareBoxH5 from '../../components/share-box-h5.vue'
	//#endif

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				Id: 0,
				article_row: {},
				htmlString: "<div>loading....<div>",

				PageQRCodeInfo: {
					Path: "",
					IsShare: !1,
					IsShareBox: !1,
					IsJT: !1
				},
        		shareData:{}
			}
		},
		components: {
			shareBoxMp,
			shareBoxApp,
			wxParse,
			//#ifdef H5
			shareBoxH5
			//#endif
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onShareAppMessage() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif

			return {
				title: this.article_row.article_title,
				path: "/pagesub/article/detail?id=" + this.Id + "&uid=" + this.userInfo.user_id
			}
		},
		/**
		 * 用户点击右上角分享朋友圈
		 */
		onShareTimeline: function () {
			return {
				title: this.article_row.article_title,
				query: {
					uid: this.userInfo.user_id,
					id: this.Id
				}
			}
		},

		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('资讯详情')
			});

			this.setData({
				options: options
			})

			this.Id = decodeURIComponent(options.id);
			this.getDetail();

		},

		onBackPress() {
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
		onUnload() {
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
		onNavigationBarButtonTap(e) {
			var that = this;

			if (e.index === 0) {
				that.onShareBox(e);
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
			getDetail() {
				let that = this;
				var params = {
					article_id: this.Id
				};
				that.$.request({
					url: this.Config.URL.cms.get,
					data: params,
					dataType: 'json',
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success: (data, status) => {
						if (status == 200) {
							this.htmlString = data.article_content.replace(/\\/g, "");

							this.setData({
								article_row: data
							})


							that.$.setNavigationBarTitle({
								title: data.article_title
							})

							setTimeout(function() {
								//初始化微信分享
								let $title = data.article_title;
								let $desc = '';
								let $link =  that.$.sprintf('%s/h5/pagesub/article/detail?id=%s', that.Config.SiteUrl, that.Id);
								let $img_url = data.article_image;

								//初始化微信分享
								that.$.wxShare($title, $desc, $link, $img_url)
							}, 100);

						}
					},
					fail: () => {
						//console.log('fail');
					}
				})
			},
			onShareBox: function(e) {
				let that = this;
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容

				var $href = that.$.sprintf('%s/tmpl/article_show.html?article_id=%d&FX=%d', this.Config.WapSiteUrl, this.Id, this.userInfo
					.user_id);

				$href = that.$.sprintf('%s/h5/pagesub/article/detail?id=%d&uid=%d', that.Config.SiteUrl, this.Id, this.userInfo.user_id);

				// #ifdef MP-WEIXIN
				var $href = "/pagesub/article/detail?id=" + this.Id + "&uid=" + this.userInfo.user_id;
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.article_row.article_title,
						shareText: this.article_row.article_title,
						href: $href,
						image: this.article_row.article_image
					}
				});

				// #ifdef H5
				if (that.$.ifUniApp())
				{
					this.$refs.shareBoxH5.show();
				}
				// #endif


				// #ifdef MP-WEIXIN
				this.$refs.shareBoxMp.show();
				// #endif

				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}

	.article-meta {
		padding: 20upx 40upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-text {
		font-size: 26upx;
		line-height: 50upx;
		margin: 0 20upx;
	}

	.article-author,
	.article-time {
		font-size: 30upx;
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 30upx;
		margin-bottom: 30upx;
	}

	/*
Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/

.cke_editable {
  font-size: 26upx;
  line-height: 2;
  /* Fix for missing scrollbars with RTL texts. (#10488) */
  word-wrap: break-word;

  blockquote {
    font-style: italic;
    font-family: Georgia, Times, "Times New Roman", serif;
    padding: 4upx 0;
    border-style: solid;
    border-color: #ccc;
    border-width: 0;
  }


  a {
    color: #0782C1;
  }

  ol, ul, dl {
    /* IE7: reset rtl list margin. (#7334) */
    /* *margin-right: 0px; */
    /* Preserved spaces for list items with text direction different than the list. (#6249,#8049)*/

    margin-left: 0px;
  }

  ul{
    display: block !important;
    list-style-type: disc !important;

    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 80upx;
    li{
      display: list-item!important;
      list-style: disc!important;;
    }
  }
  ol{
    display: block !important;
    list-style-type: decimal !important;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 80upx;

    li{
      display: list-item !important;
      list-style-type: inherit !important;
    }
  }
  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    line-height: 1.2;
  }

  hr {
    border: 0px;
    border-top: 1px solid #ccc;
  }

  img {
    &.right {
      border: 1px solid #ccc;
      float: right;
      margin-left: 15px;
      padding: 5px;
    }
    &.left {
      border: 1px solid #ccc;
      float: left;
      margin-right: 15px;
      padding: 5px;
    }
  }

  pre {
    white-space: pre-wrap;
    /* CSS 2.1 */
    word-wrap: break-word;
    /* IE7 */
    -moz-tab-size: 4;
    tab-size: 4;
  }

  .marker {
    background-color: Yellow;
  }

  span[lang] {
    font-style: italic;
  }

  figure {
    text-align: center;
    outline: solid 1px #ccc;
    background: rgba(0, 0, 0, 0.05);
    padding: 10px;
    margin: 10px 20px;
    display: inline-block;
    > figcaption {
      text-align: center;
      display: block;
      /* For IE8 */
    }
  }

  a > img {
    padding: 1px;
    margin: 1px;
    border: none;
    outline: 1px solid #0782C1;
  }

  /* Widget Styles */

  .code-featured {
    border: 5px solid red;
  }

  .math-featured {
    padding: 20px;
    box-shadow: 0 0 2px rgba(200, 0, 0, 1);
    background-color: rgba(255, 0, 0, 0.05);
    margin: 10px;
  }

  .image-clean {
    border: 0;
    background: none;
    padding: 0;
    > figcaption {
      font-size: .9em;
      text-align: right;
    }
  }

  .image-grayscale {
    background-color: white;
    color: #666;
    img {
      filter: grayscale(100%);
    }
  }

  img.image-grayscale {
    filter: grayscale(100%);
  }

  .embed-240p {
    max-width: 426px;
    max-height: 240px;
    margin: 0 auto;
  }

  .embed-360p {
    max-width: 640px;
    max-height: 360px;
    margin: 0 auto;
  }

  .embed-480p {
    max-width: 854px;
    max-height: 480px;
    margin: 0 auto;
  }

  .embed-720p {
    max-width: 1280px;
    max-height: 720px;
    margin: 0 auto;
  }

  .embed-1080p {
    max-width: 1920px;
    max-height: 1080px;
    margin: 0 auto;
  }
}

.cke_contents_ltr blockquote {
  padding-left: 20px;
  padding-right: 8px;
  border-left-width: 5px;
}

.cke_contents_rtl blockquote {
  padding-left: 8px;
  padding-right: 20px;
  border-right-width: 5px;
}


</style>
