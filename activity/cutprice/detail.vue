<template>
	<view>
		<view style="background: rgb(41, 36, 56);">
			<view class="bargin" v-if="(show==false)">
				<view class="part1">
					<view class="part1_image">
						<view class="goods">
							<image lazy-load :src="(Info.activity_rule.product_image)" class="goods1"></image>
							<view v-if="(end==1)">
								<view class="remaining">{{__('距离开始时间仅剩')}}</view>
								<view class="remaining_time">
									<view class="time">{{Time.hour}}</view>:
									<view class="time">{{Time.min}}</view>:
									<view class="time">{{Time.sec}}</view>
								</view>
							</view>

							<view v-if="(end==2)">
								<view class="remaining">{{__('活动时间仅剩')}}</view>
								<view class="remaining_time">
									<view class="time">{{Time.hour}}</view>:
									<view class="time">{{Time.min}}</view>:
									<view class="time">{{Time.sec}}</view>
								</view>
							</view>
							<view v-if="(end==3)">
								<view class="remaining">{{__("活动已结束")}}</view>
							</view>
							<view class="product_name">{{Info.activity_rule.item_name}}</view>
							<view class="present">
								<view class="present_price" style="font-family:'微软雅黑';font-size:32upx;color:#ffc001;">
									<label style="color:#fff">{{__('原价')}}</label> {{__('￥')}}{{Info.activity_rule.item_unit_price}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="part2">
					<image lazy-load :src="(imgPath)"></image>
					<view style="width:476upx">
						<view class="username">{{user_nickname}}</view>
						<view class="text1" v-if="(Info.is_cut==false&&istrue)">{{__('快试试刀法如何，看看你能砍掉多少')}}</view>
						<view class="text1" v-if="(Info.is_cut&&istrue)">{{__('您总共砍掉')}}
							{{__('￥')}}<label style="color:#ffc001;">{{Info.cut_row.ach_price}}</label>{{__('，离底价又近了一步')}}</view>
						<view class="text1" v-if="(Info.is_cut==false&&istrue==false)">{{__('您的好友在参加砍价活动，快帮ta砍一刀，试试刀法~')}}</view>
						<view class="text1" v-if="(Info.is_cut&&istrue==false)">{{__('您帮好友砍掉')}}
							{{__('￥')}}<label style="color:#ffc001;">{{Info.cut_row.ach_price}}</label>{{__('，刀法了得啊')}}</view>
					</view>
				</view>
				<view class="part3">
					<view class="progressBarBox">
						<view class="u-progressBar">
							<view class="u-progressBar-cont" :style="'width:' + (width) + '%'"></view>
						</view>
					</view>
					<view style="display:flex;justify-content: space-between">
						<view class="original">
							<view class="og1">{{__('原价')}}</view>
							<view class="og2" style="margin-top:6upx">{{__('￥')}}{{sprintf('%.2f',Info.activity_rule.item_unit_price)}}</view>
						</view>
						<view class="floor" v-if="(isCut==false)">{{__('已砍到底价啦！')}}</view>
						<view class="cut-off">
							<view class="cut1">{{__('已砍')}}</view>
							<view class="cut2" style="margin-top:6upx">{{__('￥')}}{{sprintf('%.2f',Info.activity_rule.item_unit_price - Info.ac_sale_price)}}</view>
						</view>
					</view>
					<!-- 还未砍价，发起人=帮砍人，活动正在进行 -->
					<view class="button" @click="bargin" v-if="(Info.is_cut==false&&istrue&&end!=1&&end!=3&&Info.order_id=='')">{{__('开始砍价')}}</view>
					<!-- 还未砍价，发起人=帮砍人，活动还未开始 -->
					<view class="button2" v-if="(Info.is_cut==false&&istrue&&end==1&&Info.order_id=='')">{{__('开始砍价')}}</view>
					<!-- 还未砍价，发起人！=帮砍人，活动还未结束 -->
					<view class="button" @click="bargin" v-if="(Info.is_cut==false&&istrue==false&&isCut&&end!=1&&end!=3&&Info.order_id=='')">{{__('帮忙砍价')}}</view>
					<!-- 已经砍价，发起人=帮砍人，活动还未结束，已砍价！=砍价空间 -->
					<view style="display:flex;justify-content: space-around" v-if="(Info.is_cut&&istrue&&isCut&&end!=1&&end!=3&&Info.order_id=='')">
						<view class="button1" @click="goshop">{{__('立即出手')}}</view>
						<!-- <button open-type="share" class="button1" style="margin:40upx 0 0 0" @click='shareBox'>{{__('找人帮砍')}}</button>  -->
						<button v-if="(Info.activity_state == 1)" class="button1" style="margin:40upx 0 0 0" @click='shareBox'>{{__('找人帮砍')}}</button>
					</view>
					<!-- 已经砍价，发起人=帮砍人，活动还未结束，已砍价=砍价空间 -->
					<view class="button" @click="goshop" v-if="(Info.is_cut&&istrue&&isCut==false&&end!=1&&end!=3&&Info.order_id=='')">{{__('立即出手')}}</view>
					<!-- 已经砍价，发起人！=帮砍人，活动还未结束，已砍价！=砍价空间 -->
					<view style="display:flex;justify-content: space-around" v-if="(Info.is_cut&&istrue==false&&isCut&&end!=1&&end!=3&&Info.order_id=='')">
						<navigator :url="'/activity/cutprice/detail?mid=' + (mid) + '&pid=' + (pid) + '&ac_id=' + (ac_id)" class="button1">{{__('我也要')}}</navigator>
						<!-- <button open-type="share" class="button1" style="margin:40upx 0 0 0" @click='shareBox'>{{__('找人帮砍')}}</button>  -->
						<button class="button1" v-if="(Info.activity_state == 1)" style="margin:40upx 0 0 0" @click='shareBox'>{{__('找人帮砍')}}</button>
					</view>
					<!-- 已经砍价，发起人！=帮砍人，活动还未结束，已砍价=砍价空间 -->
					<navigator :url="'/activity/cutprice/detail?mid=' + (mid) + '&pid=' + (pid) + '&ac_id=' + (ac_id)" v-if="(istrue==false&&isCut==false&&end!=1&&end!=3&&Info.order_id=='')"
					 class="button">{{__('我也要')}}</navigator>
					<!-- 活动已经结束 -->
					<navigator class="button" url="/activity/cutprice/list" v-if="(end==3)">{{__('再逛逛')}}</navigator>
					<navigator class="button" url="/activity/cutprice/list" v-if="(Info.order_id&&end!=3)">{{__('您已购买，再逛逛')}}</navigator>
				</view>
				<view class="part4" v-if="(Info.Description)">
					<view class="header">{{__('活动说明')}}</view>
					<rich-text :nodes="htmlString"></rich-text>
				</view>
				<view class="part5">
					<view class="header_shadow">
						<view class="header1">{{__('砍价高手')}}</view>
					</view>
				</view>
				<view class="part6" v-for="(items, index) in List"  :key="index">
					<image lazy-load :src="(items.user_avatar)" style="border-raduis:50%"></image>
					<view class="kanjia">
						<view>{{items.user_nickname}}</view>
						<view style="margin-top:20upx">{{__('砍掉价格')}}
							<label style="color:#ffc001;">{{__('￥')}}{{items.ach_price}}</label>！</view>
					</view>
				</view>
			</view>

			<view class="animation" v-if="(show)">
				<image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/cutprice/dao.png" animation="(animation)" :class="(show?'dao1':'')" @click="rotate"></image>
				<image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/cutprice/bag.png" v-if="(showImg==false)" class="bag"></image>
				<image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/cutprice/bagmoney.png" v-if="(showImg)" class="bagmoney"></image>
				<view class="Price" v-if="(showImg)">
					<view>{{__('成功砍价')}}</view>
					<view>{{__('￥')}}{{money}}</view>
				</view>
				<view class="success" v-if="(showImg)" @click="back">
					{{__('太棒啦')}}
				</view>
			</view>
		</view>
		<view class="u-tap-btn">
			<navigator url="/pages/index/index" open-type="switchTab" class="u-go-home">
				<view class="iconfont icon-shouyeshouye"></view>
			</navigator>
		</view>
		<share-box-mp :PageQRCodeInfo="PageQRCodeInfo" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
		 @saveImg="saveImg" :shareDataDefault="shareData" ref="shareBoxMp"></share-box-mp>
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		
	</view>
</template>

<script>
	function getNowFormatDate() {
		var e = new Date,
			t = "-",
			n = e.getMonth() + 1,
			r = e.getDate();
		n >= 1 && n <= 9 && (n = "0" + n), r >= 0 && r <= 9 && (r = "0" + r);
		var i = e.getFullYear() + t + n + t + r;
		return i
	}



	import $ from "../../helpers/util";
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'

	export default {
		data() {
			return {

				Time: "",
				hours: "",
				show: !1,
				showImg: !1,
				showPrice: !1,
				isCut: !0,
				imgPath: "",
				user_nickname: "",
				mid: 0,
				uid: 0,
				pid: 0,
				page: 1,
				rows: 10,
				Info: {
					activity_rule: {
						product_image: ''
					}
				},
				end: 0,
				startTime: "",
				endTime: "",
				istrue: !0,
				flag: !0,
				ispage: !0,
				width: 100,
				participantId: "",
				ac_id: 0,
				money: 0,
				List: [],
				hour: 0,
				min: 0,
				sec: 0,
				htmlString: '',
				PageQRCodeInfo: {
					Path: "",
					IsShare: !1,
					IsShareBox: !1,
					IsJT: !1
				},
				shareData: {
					shareText: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
					shareTitle: 'JDMall商城系统，支持原生App、微信小程序，邀请你一起体验！',
					href: "",
					image: ''
				}
			};
		},
		components: {
			shareBoxMp,
			shareBoxApp
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('砍价详情')
			});
			var t = this;
			// 长参数解析
			if (options.scene) {
				let longUrl = decodeURIComponent(options.scene);
				let paramsArray = longUrl.replace("longUrl=", "").split("-");
				options.mid = paramsArray[0];
				options.pid = paramsArray[1];
				options.ac_id = paramsArray[2];
				options.uid = paramsArray[3];
			}

			options.sid ? t.setData({
				imgPath: this.userInfo.user_avatar,
				user_nickname: this.userInfo.user_nickname,
				mid: options.mid,
				uid: options.sid,
				participantId: this.userInfo.user_id,
				pid: options.pid,
			}) : t.setData({
				imgPath: this.userInfo.user_avatar,
				user_nickname: this.userInfo.user_nickname,
				mid: options.mid,
				uid: options.uid || this.userInfo.user_id,
				participantId: this.userInfo.user_id,
				pid: options.pid,
			});

			t.GetVendorCutPriceEventDetail();
			t.GetOtherCutPriceActivityList();
			//t.getTime()
		},
		onShow: function() {
			this.GetVendorCutPriceEventDetail()
		},
		onBackPress() {
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
				return true;
			}
		},
		onUnload() {

			// 离开页面，注销事件
			var that = this

			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel()
			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			GetVendorCutPriceEventDetail: function() {
				var that = this,
					params = {
						activity_id: this.mid,
						user_id: this.uid,
						participant_id: this.userInfo.user_id
					};
				params.user_id == params.participant_id ? this.setData({
					istrue: !0
				}) : this.setData({
					istrue: !1
				});
				$.request({
					url: this.Config.URL.user.getCutPriceActivity,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							data.CutPricePercent = (data.activity_rule.item_unit_price - data.ac_sale_price) / (data.activity_rule.item_unit_price -
								data.activity_rule.cut_down_min_limit_price)
							that.setData({
								Info: data,
								ac_id: data.ac_id,
								width: 100 * parseFloat(data.CutPricePercent).toFixed(2)
							});
							that.getTime();
							data.ac_sale_price - data.ac_mix_limit_price <= 0 ? that.setData({
								isCut: !1
							}) : "";

							//WxParse.wxParse("PromotionRule", "html", data.activity_rule.activity_intro, that)

							that.htmlString = data.activity_rule.activity_intro.replace(/\\/g, "").replace(/<img/g,
								"<img style=\"display:none;\"");
						} else {
							that.setData({
								flag: !1,
								ispage: !0
							})
						}
					}
				});
			},
			getTime: function() {
				var e = this,
					t = (new Date).getTime(),
					s = this.Info.activity_endtime,
					n = this.Info.activity_starttime;
				var i = (new Date(n.replace(/-/g, "/"))).getTime(),
					u = (new Date(s.replace(/-/g, "/"))).getTime();
				if (i >= t) {
					var a = setInterval(function() {
						e.setData({
							Time: $.Formattime1(e.Info.activity_starttime, a),
							end: 1
						}), e.Time == undefined && e.getTime()
					}, 1e3);
					return
				}
				if (u <= t) {
					var a = setInterval(function() {
						e.setData({
							Time: $.Formattime(e.Info.activity_endtime, a),
							end: 3
						}), e.Time == undefined && e.getTime()
					}, 1e3);
					return
				}
				if (i < t < u) {
					var a = setInterval(function() {
						e.setData({
							Time: $.Formattime(e.Info.activity_endtime, a),
							end: 2
						}), e.Time == undefined && e.getTime()
					}, 1e3);
					return
				}
			},
			GetOtherCutPriceActivityList: function() {
				var params = {
						activity_id: this.mid,
						user_id: this.uid,
						page: this.page
					},
					t = this;

				$.request({
					url: this.Config.URL.user.listsCutPriceHistory,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status && data.items.length > 0) {
							t.setData({
								flag: !1
							});
							t.setData({
								ispage: !0,
								List: data.items
							});
						} else {
							t.setData({
								flag: !1,
								ispage: !0
							})
						}
					}
				});
			},
			CutPrice: function() {
				
				if(this.Info.activity_state > 1)
				{
					this.$.alert(this.__('活动已结束！'))
					return;
				}
				var params = {
						ac_id: this.ac_id,
						user_id: this.userInfo.user_id
					},
					that = this;
				$.request({
					url: this.Config.URL.user.doCutPrice,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							that.setData({
								money: data.ach_price,
								ac_id: data.ac_id,
								show: !0
							})
						} else {
							that.setData({
								show: !1
							});
							that.$.confirm(msg, function (a) {
							        if (a.confirm)
							        {
											$.redirectTo({
												url: "/activity/cutprice/list"
											})
									}
									
							})
			
						}
					}
				});
				that.GetOtherCutPriceActivityList();
			},
			onShareAppMessage: function() {
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				});
				// #endif

				return {
					title: this.Info.activity_rule.item_name,
					path: "/activity/cutprice/detail?mid=" + this.mid + "&uid=" + this.uid + "&pid=" + this.pid + "&ac_id=" + this.ac_id
				}
			},

			/**
			 * 用户点击右上角分享朋友圈
			 */
			onShareTimeline: function () {
				return {
					title: this.Info.activity_rule.item_name,
					query: {
						mid: this.mid,
						pid: this.pid,
						ac_id: this.ac_id,
						uid: this.userInfo.user_id
					}
				}
			},

			bargin: function() {
				var e = this;
				setInterval(function() {
					e.setData({
						showImg: !0
					})
				}, 600), this.CutPrice()
			},
			back: function() {
				this.setData({
					show: !1
				}), this.GetVendorCutPriceEventDetail(), this.GetOtherCutPriceActivityList()
			},
			more: function(e) {
				if (this.flag) {
					var t = this;
					clearTimeout(n);
					var n = setTimeout(function() {
						t.setData({
							page: parseInt(t.page) + 1
						}), t.GetOtherCutPriceActivityList()
					}, 500)
				}
			},
			goshop: function() {
				var e = this,
					params = {
						amount: 1,
						item_id: this.Info.activity_rule.item_id,
						ac_id: this.Info.ac_id,
						order_id: this.Info.order_id,
						ac_id: this.ac_id
					};
				if (this.Info.order_id == "") {
					$.navigateTo({
						url: "/pages/checkout/checkout?single_activity=1&ifcart=0&cart_id=" + params.item_id + "|" + params.amount +
							"&activity_id=" + this.mid + "&ac_id=" + this.ac_id
					})
				} else {
					// $.navigateTo({url: "/pages/checkout/checkout?spid=" + JSON.stringify(params) + "&activity_id=" + this.mid + "&sponsorId=" + this.uid + "&sp=" + this.Info.ServicePlaceCode + "&pm=" + this.Info.PayMethodCode + "&et=" + this.Info.BusinessHoursEnd + "&st=" + this.Info.BusinessHoursStart + "&showdate=" + this.Info.ReservationTimeEnabled + "&showname=" + this.Info.ContactEnabled})
				}
			},
			shareQRCode: function(e) {
				var that = this,
					params = {
						path:  this.Config.SiteUrl + "/h5/activity/cutprice/detail?mid=" + this.mid + "&uid=" + this.uid + "&pid=" + this.pid + "&ac_id=" + this.ac_id,
						Path: "/activity/cutprice/detail?mid=" + this.mid + "&uid=" + this.uid + "&pid=" + this.pid + "&ac_id=" + this.ac_id,
						MainImg: this.Info.activity_rule.product_image,
						MainTitle: this.Info.activity_rule.item_name,
						ProductId: this.pid,
						MarketingEventId: this.mid,
						ItemSalePrice: this.Info.activity_rule.item_unit_price,
						OriginalPrice: "",
						GroupPersonAmout: "",
						CutPrice: this.Info.activity_rule.item_unit_price - this.Info.ac_sale_price,
						UserInfoId: this.uid,
						MarketingEventTime: this.Info.activity_starttime
					};
				//生成二维码并返回地址。 - 需要修改调整为小程序地址
				$.request({
					url: this.Config.URL.wx.getMiniAppQRCodeUnlimitPoster,
					data: params,
					success: function(data, status, msg, code) {
						that.setData({
							PageQRCodeInfo: {
								Path: data.url,
								IsShare: !0,
								IsShareBox: !1,
								IsJT: !0
							}
						})
					}
				});
			},
			shareBox: function() {
				let that = this;
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				var $href = $.sprintf('%s/h5/activity/cutprice/detail?mid=%d&pid=%d&ac_id=%d&uid=%d', that.Config.SiteUrl,
										this.mid, this.pid, this.ac_id, this.uid);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = $.sprintf('%s/h5/activity/cutprice/detail?mid=%d&pid=%d&ac_id=%d&uid=%d', that.Config.SiteUrl,
						this.mid, this.pid, this.ac_id, this.uid);
				// #endif

				// #ifdef MP-WEIXIN
				$href = $.sprintf("%s/activity/cutprice/detail?mid=%d&pid=%d&ac_id=%d&uid=%d", that.Config.SiteUrl,
						this.mid, this.pid, this.ac_id, this.uid);
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.Info.activity_rule.item_name,
						shareText: '',
						href: $href,
						image: this.Info.activity_rule.product_image,
						price: this.number_format(this.Info.activity_rule.item_unit_price, 2)
					}
				});

				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif
				
				// #ifdef MP-WEIXIN
				this.$refs.shareBoxMp.show();
				// #endif
				
				
				// #ifdef H5
				if (that.$.ifUniApp())
				{
					this.$refs.shareBoxH5.show();
				}
				else
				{
					this.$refs.shareBoxMp.show();
				}
				// #endif
				
				return ;

				this.setData({
					PageQRCodeInfo: {
						Path: "",
						IsShare: !0,
						IsShareBox: !0,
						IsJT: !1
					}
				})
			},
			cancelShare: function() {
				this.setData({
					PageQRCodeInfo: {
						Path: "",
						IsShare: !1,
						IsShareBox: !1,
						IsJT: !1
					}
				})
			},
			saveImg: function() {
				var e = this;
				$.showLoading(), $.downloadFile({
					url: this.PageQRCodeInfo.Path,
					success: function(t) {
						$.hideLoading(), $.saveImageToPhotosAlbum({
							filePath: t.tempFilePath,
							success: function() {
								e.setData({
									PageQRCodeInfo: {
										Path: "",
										IsShare: !1,
										IsShareBox: !1,
										IsJT: !1
									}
								}), $.alert("保存图片成功！")
							},
							fail: function(e) {
								$.hideLoading();
							}
						})
					},
					fail: function(e) {
						$.hideLoading()
					}
				})
			},
			showCodeImg: function() {
				$.previewImage({
					current: this.PageQRCodeInfo.Path,
					urls: [this.PageQRCodeInfo.Path]
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../styles/_variables";

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

	.bargin {
		width: 750upx;
		height: 2668upx;
		background-image: url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/cutprice/bg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
	}

	.part1 {
		padding-top: 260upx;
		padding-left: 18upx;
	}

	.part1_image {
		width: 720upx;
		height: 520upx;
		background-image: url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/cutprice/detailbg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
	}

	.goods {
		padding-left: 60upx;
		padding-top: 90upx;
	}

	.wxParse-p {
		padding: 0 40upx;
	}

	.goods1 {
		max-width: 315upx;
		max-height: 330upx;
		border-radius: 8upx;
		float: left;
	}

	.remaining {
		padding-left: 340upx;
		padding-top: 18upx;
		font-size: 28upx;
		color: #fff;
		font-weight: bold;
	}

	.remaining_time {
		margin-left: 340upx;
		margin-top: 16upx;
		font-size: 30upx;
		color: #fff;
	}

	.time {
		margin-right: 10upx;
		padding-left: 21upx;
		padding-right: 26upx;
		padding-top: 4upx;
		padding-bottom: 4upx;
		display: inline;
		background-size: 100% 100%;
		background-color: rgb(86, 8, 10);
		border-radius: 8upx;
		text-align: center;
	}

	.product_name {
		padding-top: 28upx;
		font-size: 28upx;
		color: #fff;
		word-wrap: break-word;
		padding-left: 340upx;
		padding-right: 20upx;
	}

	.present {
		padding-left: 340upx;
		padding-top: 10upx;
	}

	.present_price {
		display: inline;
		font-size: 28upx;
		color: #fff;
	}

	.price {
		display: inline;
		font-size: 32upx;
		color: #fff;
	}

	.part2 {
		margin-top: 45upx;
		margin-left: 58upx;
		margin-right: 62upx;
		border: 1upx solid rgb(201, 76, 98);
		background: rgb(176, 14, 46);
		border-radius: 30upx;
		height: 146upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10upx;
	}

	.part2 image {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}

	.username {
		font-size: 28upx;
		color: #fff;
	}

	.text1 {
		font-size: 28upx;
		color: #fff;
		margin-top: 6upx;
	}

	.progress-bar {
		margin-top: 36upx;
		margin-left: 64upx;
		margin-right: 30upx;
		width: 618upx;
		height: 36upx;
		border: 5upx solid rgb(89, 10, 35);
		background: rgb(89, 10, 35);
		border-radius: 40upx;
		position: relative;
	}

	.left {
		border-radius: 40upx;
		background: rgb(255, 231, 0);
		height: 100%;
		float: left;
	}

	.original {
		color: #fff;
		float: left;
	}

	.og1 {
		padding-left: 80upx;
		padding-top: 15upx;
		font-size: 28upx;
	}

	.og2 {
		padding-left: 75upx;
		font-weight: bolder;
		padding-top: 6upx;
		color: #ffc001;
		font-family: '微软雅黑';
		font-size: 32upx;
	}

	.cut-off {
		color: #fff;
		display: flex;
		flex-flow: column;
		justify-content: center;
		margin-right: 72upx;
		text-align: right;
	}

	.cut1 {
		padding-top: 15upx;
		font-size: 28upx;
	}

	.cut2 {
		font-weight: bolder;
		padding-top: 6upx;
		color: #ffc001;
		font-family: '微软雅黑';
		font-size: 32upx;
	}

	.button {
		margin-top: 40upx;
		margin-left: 160upx;
		margin-right: 160upx;
		border: 1upx solid rgb(255, 172, 51);
		background: rgb(255, 172, 51);
		border-radius: 12upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #fff;
		font-size: 32upx;
	}

	.button1 {
		width: 240upx;
		height: 70upx;
		font-size: 32upx;
		margin-top: 40upx;
		color: #fff;
		text-align: center;
		line-height: 70upx;
		border-radius: 12upx;
		background: rgb(255, 172, 51);
	}

	.button2 {
		margin-top: 40upx;
		margin-left: 160upx;
		margin-right: 160upx;
		background: rgb(136, 136, 136);
		border-radius: 12upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #fff;
		font-size: 32upx;
	}

	.part4 {
		color: #fff;
		border-top: 2upx solid rgb(140, 19, 55);
		margin-top: 63upx;
		min-height: 360upx;
	}

	.header {
		padding-top: 36upx;
		text-align: center;
		font-size: 32upx;
		margin-bottom: 10upx;
	}

	.content {
		text-indent: 3em;
		padding-top: 22upx;
		font-size: 28upx;
	}

	.content1 {
		text-indent: 3em;
		padding-top: 20upx;
		font-size: 28upx;
	}

	.part5 {
		margin-top: 40upx;
	}

	.header1 {
		text-align: center;
		font-size: 32upx;
		color: #fff;
		background: rgb(255, 172, 51);
		border-radius: 42upx;
		height: 52upx;
		line-height: 52upx;
	}

	.header_shadow {
		margin-left: 222upx;
		margin-right: 233upx;
		border-radius: 42upx;
		height: 52upx;
		line-height: 52upx;
		padding-bottom: 4upx;
	}

	.part6 {
		display: flex;
		align-items: center;
		background: rgb(41, 36, 56);
		padding: 28upx 60upx;
	}

	.part6 image {
		width: 110upx;
		height: 110upx;
		border-radius: 50%;
	}

	.part6 .kanjia {
		display: flex;
		flex-flow: column;
		justify-content: center;
		margin-left: 40upx;
	}

	.kanjia view {
		font-size: 28upx;
		color: #fff;
	}

	.animation {
		width: 100%;
		height: 100%;
		background: black;
		position: absolute;
		top: 0;
	}

	.dao {
		width: 380upx;
		height: 340upx;
		position: absolute;
		top: 4%;
		right: 0%;
	}

	.dao1 {
		width: 380upx;
		height: 340upx;
		position: absolute;
		top: 4%;
		right: 0%;
		animation: move 300ms linear;
		animation-delay: 500ms;
		transform-origin: right bottom;
		animation-fill-mode: forwards;
	}

	@keyframes move {
		0% {
			transform: rotateX(0);
		}

		50% {
			transform: rotateZ(-45deg);
		}

		100% {
			transform: rotateZ(-30deg);
		}
	}

	.bag {
		width: 336upx;
		height: 344upx;
		position: absolute;
		top: 32%;
		left: 25%;
	}

	.bagmoney {
		width: 525upx;
		height: 516upx;
		position: absolute;
		top: 24%;
		left: 21%;
	}

	.success {
		width: 60%;
		height: 66upx;
		border-radius: 10upx;
		background: rgb(250, 51, 1);
		line-height: 66upx;
		text-align: center;
		position: absolute;
		bottom: 15%;
		left: 20%;
		color: #fff;
	}

	.Price {
		display: inline;
		font-size: 42upx;
		position: absolute;
		top: 67%;
		width: 100%;
		// #ifdef MP-WEIXIN
		top: 62% !important;
		// #endif
		text-align: center;
		color: rgb(255, 227, 130);
	}

	.more {
		color: #fff;
		font-size: 28upx;
		display: flex;
		justify-content: center;
		background: rgb(41, 36, 56);
		padding-bottom: 40upx;
	}

	/* .progressBarBox{position: absolute;right: 0;bottom: 38%;color: #888;font-size: 24upx;margin-right: 20upx;} */

	.u-progressBar {
		display: inline-block;
		width: 80%;
		height: 24upx;
		background-color: #d5d5d5;
		border-radius: 20upx;
		overflow: hidden;
		margin-left: 10%;
		margin-top: 40upx;
	}

	.u-progressBar-cont {
		height: 24upx;
		background-color: #ffc001;
	}

	.floor {
		color: #ffc001;
		font-size: 28upx;
		padding-top: 10upx;
	}
</style>
