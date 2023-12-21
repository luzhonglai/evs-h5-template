<template>
	<view>
		<block v-if="(isPage)">
			<view v-if="(outdated)" class="box">
				<view class="remainingcount">您还有{{RemainingCount}}次机会</view>
				<view class="egg-box">
					<view class="hammer" animation="(animationData)"></view>
					<view class="egg-top">
						<view class="egg (move?'move1':'')" @click="knock">
							<image lazy-load :src="(ImgPath) + 'goldenEggs' + (selectImg==1?'-1':'') + '.png'" mode="widthFix" :data-num="1"></image>
						</view>
						<view class="egg (move?'move2':'')" @click="knock">
							<image lazy-load :src="(ImgPath) + 'goldenEggs' + (selectImg==2?'-1':'') + '.png'" mode="widthFix" :data-num="2"></image>
						</view>
					</view>
					<view class="egg-bottom">
						<view class="egg (move?'move3':'')" @click="knock">
							<image lazy-load :src="(ImgPath) + 'goldenEggs' + (selectImg==3?'-1':'') + '.png'" mode="widthFix" :data-num="3"></image>
						</view>
						<view class="egg (move?'move4':'')" @click="knock">
							<image lazy-load :src="(ImgPath) + 'goldenEggs' + (selectImg==4?'-1':'') + '.png'" mode="widthFix" :data-num="4"></image>
						</view>
						<view class="egg (move?'move5':'')" @click="knock">
							<image lazy-load :src="(ImgPath) + 'goldenEggs' + (selectImg==5?'-1':'') + '.png'" mode="widthFix" :data-num="5"></image>
						</view>
					</view>
				</view>
				<view class="winner-box">
					<view class="winner-title">本期中奖名单</view>
					<image lazy-load :src="(ImgPath) + 'tip-1.png'" class="winner-img" mode="widthFix"></image>
					<view class="winner-list">
						<block v-if="(DrawInfo.winner_rows.items.length >0)">
							<swiper autoplay="true" interval="4000" duration="2000" vertical="false" circular="true" class="m-luckylist">
								<swiper-item v-for="(items, i) in rows" :key="i">
									<block v-for="(item, j) in DrawInfo.winner_rows.items" :key="j">
										<view v-if="(j>=(i*5) && j<=((i+1)*5))" class="m-winner-item ">{{item.user_nickname}}砸中
											<label class="prize-name">{{item.awards_name}}</label>
										</view>
									</block>
								</swiper-item>
							</swiper>
						</block>
						<view class="m-winner-item" style="background: #FEE39F;" v-else>暂无中奖名单数据</view>
					</view>
				</view>
				<view class="rule-box">
					<image lazy-load :src="(ImgPath) + 'tip-2.png'" class="winner-img" mode="widthFix"></image>
					<wxParse :content="DrawInfo.activity_rule.activity_intro + ''"  />
				</view>
			</view>

			<view class="activity-outdated" v-else>
				<view class="m-nullcontent">
					<view class="m-nullpage-middle">
						<label class="iconfont icon-meiyougengduo"></label>
						<view class="m-null-tip">
							<text>亲~您来晚了哦</text>
							<text>该砸金蛋活动已经失效啦~</text>
						</view>
					</view>
				</view>
			</view>
		</block>


		<view class="u-tap-btn">
			<navigator url="/member/member/prize?category=2" class="u-go-home">
				<view class="iconfont icon-iconcanjiahuodong01"></view>
			</navigator>
			<view class="red-dot"></view>
			<navigator url="/pages/index/index" open-type="switchTab" class="u-go-home">
				<view class="iconfont icon-shouyeshouye" style="font-size:50upx;"></view>
			</navigator>
		</view>
		<view class="mskprize" v-if="(clickmsk)" @click="cancelprize">
			<view class="m-result-box bounceIn animated" @click.stop="nothing" v-if="(PrizeResult.index >= 0)">
				<view class="m-result-cancel" @click="cancelprize">✕</view>

				<block v-if="PrizeResult.awards_enable">
					<view class="m-success-text">{{__('恭喜你获得了')}}</view>
				</block>
				<block v-if="!PrizeResult.awards_enable">
					<view class="m-success-text">{{__('未中奖')}}</view>
				</block>
				
				<image lazy-load :src="(PrizeResult.awards_image)" class="m-success-img" />
				<view class="m-success-name">{{PrizeResult.prize}}</view>
				<view class="m-success-name">{{PrizeResult.awards_title}}</view>
				<view class="m-success-bottom">
					<navigator url="/member/member/prize?category=2" class="succes-checkprice">查看奖品</navigator>
					<view class="succes-continue" @click="cancelprize">继续抽奖</view>
				</view>
			</view>
			<view class="m-result-box wobble animated" @click.stop="nothing" v-else>
				<view class="m-result-cancel" @click="cancelprize">✕</view>
				<view class="m-failimg-bg">
					<image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/nothing.png" class="m-fail-img" />
				</view>
				<view class="m-fail-name">{{DrawInfo.LosingDesc}}</view>
				<view class="m-fail-button" @click="cancelprize">继续抽奖</view>
			</view>
		</view>
		<view class="mskshare" v-if="(clickshare)" @click="cancelshare">
			<!-- <image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/share.png" class="share-oncemore" mode="widthFix"></image> -->
			<view class="share-text">
				<view>你今天已经没有砸蛋机会了</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $ from "../../helpers/util";

	import dayCountdown from "../../components/day-countdown.vue";

	import wxParse from '@/components/u-parse/u-parse.vue'
	
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				options:{},
				click: !1,
				clickmsk: !1,
				clickshare: !1,
				drawdesc: [],
				DrawInfo: {},
				RemainingCount: 0,
				PrizeResult: {},
				rows: [],
				Coupons: [],
				isCancelSuccess: !0,
				isCancel: !0,
				CouponAmount: 0,
				user_is_new: 0,
				isPage: !1,
				outdated: !1,
				ImgPath: "",
				animationData: {},
				selectImg: 0,
				move: !1,
				activity_id: 0
			}
		},
		components: {
			dayCountdown,
			wxParse
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin'
		]),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('砸金蛋')
			});

			var that = this;
			that.setData({
				activity_id: options.activity_id || 0,
				options:options
			});

            that.getPlantformInfo(function(plantformInfo) {
				$.isNull(that.userInfo) ? that.getUserInfo(function() {
						that.setData({
							user_is_new: that.userInfo.user_is_new,
							CouponAmount: that.userInfo.CouponAmount
						}), that.initData()
					},
					options.uid) : that.initData()
            });
			
		},
		onShow: function() {
			var e = $.createAnimation({
				duration: 500,
				timingFunction: "ease"
			});
			this.animation = e, this.animation.top(0).left(0).step(), this.setData({
				animationData: this.animation.export()
			})
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			knock: function(e) {
				if (!this.click) {
					this.setData({
						click: !0
					});
					if (this.RemainingCount > 0) {
						this.getPosition();
					} else if (this.RemainingCount == 0) {
						this.setData({
							clickshare: !0
						});
						return
					}
					this.animation.top(e.changedTouches[0].pageY - 375).left(e.changedTouches[0].pageX - 75).step(), this.setData({
						animationData: this.animation.export()
					}), setTimeout(function() {
						this.animation.translateX(-25).rotate(-120).step(), this.setData({
							animationData: this.animation.export()
						})
					}.bind(this), 500), setTimeout(function() {
						this.animation.translateX(25).rotate(60).step(), this.setData({
							animationData: this.animation.export()
						})
					}.bind(this), 1e3), setTimeout(function() {
						this.setData({
							selectImg: e.target.dataset.num
						})
					}.bind(this), 1200)
				}
			},

			onShareAppMessage: function() {
				var e = this;
				return this.setData({
					clickshare: !1,
					click: !1
				}), {
					title: "我已经中奖啦，你也赶紧来砸金蛋吧~",
					desc: "幸运砸金蛋，快来参与吧~",
					path: "/activity/smashgoldeneggs/smashgoldeneggs?uid=" + this.userInfo.user_id,
					success: function(t) {
						e.sharefriend()
					}
				}
			},
			sharefriend: function() {
				var e = {
						Category: 2
					},
					t = this;
				$.xsr1($.makeUrl(activityapi.ShareLuckyDraw, e), function(e) {
					e.Code == 0 && e.Info != null && (t.setData({
						RemainingCount: t.RemainingCount
					}), t.initData())
				})
			},

			initData: function() {
				let that = this;
				// 2砸金蛋，1大转盘
				var params = {
					activity_type: 2,
					activity_type_id: this.StateCode.ACTIVITY_TYPE_LOTTERY,
					activity_id: this.activity_id
				};

				// 等级规则
				$.request({
					url: this.Config.URL.user.listsLottery,
					data: params,
					success: function(data, status, msg, code) {
						that.setData({
							isPage: !0,
							ImgPath: that.plantformInfo.AppIconPath
						});
						//console.log(that.plantformInfo.AppIconPath);
						if (status == 200) {
							that.setData({
								DrawInfo: data,
								RemainingCount: data.remaining_count,
								outdated: data.outdated,
								activity_id: data.activity_id
							});
							if (that.DrawInfo.winner_rows.items.length > 0) {
								var n = that.DrawInfo.winner_rows.items.length % 5 > 0 ? parseInt(that.DrawInfo.winner_rows.items.length /
										5 + 1) : that.DrawInfo.winner_rows.items.length / 5,
									r = [];
								for (var i = 0; i < n; i++) {
									r.push(i);
								}
								that.setData({
									rows: r
								})
							}


							if ($.isNull(data.activity_rule.activity_intro)) {

								this.drawdesc = data.activity_rule.activity_intro.replace(/\\/g, "").replace(/<img/g,
									"<img style=\"display:none;\"");

								this.setData({
									drawdesc: drawdesc
								})
							}
						} else {
							that.setData({
								outdated: !1
							})
						}

					}
				});
			},
			getPosition: function() {
				var params = {
						activity_id: this.activity_id
					},
					t = this;
				// 等级规则
				$.request({
					url: this.Config.URL.user.doLottery,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							t.setData({
								PrizeResult: data
							})
							setTimeout(function() {
									t.setData({
										clickmsk: !0
									});
								},
								2e3);
						} else {
							($.alert("抽奖失败"), t.setData({
								click: !1
							}));
						}
					}
				});

			},
			cancelprize: function() {
				this.animation.top(0).left(0).translateX(0).rotate(0).step(), this.setData({
					clickmsk: !1,
					selectImg: 0,
					animationData: this.animation.export(),
					move: !0
				});
				var e = this;
				setTimeout(function() {
						e.setData({
							move: !1
						})
					},
					1e3), setTimeout(function() {
						e.setData({
							click: !1
						})
					},
					1200), this.initData()
			},
			cancelshare: function() {
				this.setData({
					clickshare: !1
				}), this.setData({
					prize: -1,
					times: 0,
					click: !1
				})
			},
			nothing: function() {},
			doReceive: function() {
				this.cancel(), this.userReceiveCoupon()
			},
			cancel: function() {
				this.setData({
					isCancel: !1
				})
			},
			cancelsuccess: function() {
				this.setData({
					isCancelSuccess: !0
				})
			},
			innertouch: function() {},
			userReceiveCoupon: function() {
				var params = {
					activity_id: this.activity_id,
					activity_type: 2,
					activity_type_id: this.StateCode.ACTIVITY_TYPE_LOTTERY
				};
				var t = this;
				$.request({
					url: this.Config.URL.user.listsLotteryHistory,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							t.setData({
								isCancelSuccess: !1,
								Coupons: data.items
							});
						} else {
							$.alert(msg);
						}
					}
				});
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	page {
		background: url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/smashingEggs-bg.png) center top no-repeat #cb1944;
		background-size: cover;
		box-sizing: border-box;
	}

	.activity-outdated {
		position: absolute;
		width: 100%;
		height: 100%;
		background: #f8f8f8;
	}

	.box {
		margin: 0 30upx 30upx;
	}

	.remainingcount {
		position: relative;
		margin-top: 435upx;
		color: yellow;
		font-size: 36upx;
		text-align: center;
		font-weight: bold;
	}

	.egg-box {
		margin-top: 120upx;
		text-align: center;
		position: relative;
	}

	.egg {
		width: 230upx;
		display: inline-block;
	}

	.egg image {
		width: 100%;
	}

	.hammer {
		position: absolute;
		width: 150upx;
		height: 150upx;
		background: url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/Hammer.png) center top no-repeat;
		background-size: cover;
		z-index: 5;
	}

	.egg-top {
		margin-bottom: 22upx;
	}

	.winner-box {
		background: #FEE39F;
		position: relative;
		padding-bottom: 20upx;
		margin-top: 130upx;
	}

	.winner-title {
		text-align: center;
		color: $default-skin-bg;
		font-size: 28upx;
		line-height: 70upx;
		height: 70upx;
		font-weight: bold;
	}

	.winner-img {
		width: 150upx;
		position: absolute;
		left: -12upx;
		top: 8upx;
	}

	.winner-list {
		max-height: 300upx;
		border: 1px solid $default-skin-bg;
		margin: 0 20upx;
		overflow: scroll;
		position: relative;
	}

	.m-winner-item {
		height: 50upx;
		color: $default-skin-bg;
		font-size: 26upx;
		line-height: 50upx;
		padding-left: 30upx;
		box-sizing: border-box;
	}

	.m-winner-item:nth-child(odd) {
		background: #FAD97C;
	}

	.m-winner-item:nth-child(even) {
		background: #FEE39F;
	}

	.prize-name {
		position: absolute;
		left: 380upx;
	}

	.rule-box {
		background: #FEE39F;
		position: relative;
		margin-top: 20upx;
		padding: 70upx 30upx 30upx;
		font-size: 26upx;
		line-height: 40upx;
		color: $default-skin-bg;
	}

	.mskprize {
		position: fixed;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.70);
		z-index: 5;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		text-align: center;
	}

	.mskshare {
		position: fixed;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.70);
		z-index: 5;
		top: 0;
		left: 0;
	}

	.share-oncemore {
		width: 700upx;
		margin: 0 auto;
	}

	.share-text {
		margin: 0 auto;
		font-size: 40upx;
		line-height: 80upx;
		color: white;
		text-align: center;
		margin-top: 45%
	}

	.m-result-box {
		width: 500upx;
		height: 600upx;
		background: #DB384B;
		position: relative;
		border-radius: 20upx;
	}

	.m-result-cancel {
		position: absolute;
		right: 25upx;
		top: 15upx;
		font-size: 36upx;
	}

	.m-success-text {
		line-height: 80upx;
		margin-top: 50upx;
		font-size: 30upx;
	}

	.m-success-img {
		width: 250upx;
		height: 250upx;
		background: white;
		margin: 0 auto;
	}

	.m-success-name {
		color: #FFAC33;
		font-size: 26upx;
		line-height: 50upx;
		height: 50upx;
	}

	.m-success-bottom {
		position: absolute;
		bottom: 40upx;
		line-height: 65upx;
		font-size: 28upx;
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.succes-continue {
		height: 65upx;
		width: 200upx;
		background: #FFCA3A;
		display: inline-block;
		border-radius: 5upx;
	}

	.succes-checkprice {
		height: 65upx;
		width: 200upx;
		background: white;
		color: black;
		display: inline-block;
		border-radius: 5upx;
		margin-right: 30upx;
	}

	.m-failimg-bg {
		width: 350upx;
		height: 350upx;
		border-radius: 175upx;
		background-color: rgba(255, 255, 255, 0.10);
		margin: 40upx auto 20upx;
		padding: 50upx;
		box-sizing: border-box;
	}

	.m-fail-img {
		width: 100%;
		height: 100%;
		border-radius: 150upx;
		background-color: rgba(255, 255, 255, 0.20);
	}

	.m-fail-name {
		font-size: 26upx;
		line-height: 50upx;
	}

	.m-fail-button {
		width: 300upx;
		height: 65upx;
		line-height: 65upx;
		position: absolute;
		bottom: 40upx;
		background: #FFCA3A;
		border-radius: 5upx;
		font-size: 28upx;
		left: 100upx;
	}

	.red-dot {
		width: 20upx;
		height: 20upx;
		border-radius: 10upx;
		background: $default-skin-bg;
		position: fixed;
		bottom: 220upx;
		right: 20upx;
		z-index: 5;
	}

	.u-tap-btn {
		position: fixed;
		right: 20upx;
		bottom: 40upx;
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
		font-size: 36upx;
	}


	.move1 {
		position: relative;
		animation: mymove1 1s;
		-webkit-animation: mymove1 1s reverse;
	}

	@keyframes mymove1 {
		from {
			left: 0px;
		}

		to {
			left: 230upx;
		}
	}

	@-webkit-keyframes mymove1 {
		from {
			left: 0px;
		}

		to {
			left: 230upx;
		}
	}

	.move2 {
		position: relative;
		animation: mymove2 1s reverse;
		-webkit-animation: mymove2 1s reverse;
	}

	@keyframes mymove2 {
		from {
			top: 0px;
			left: 0;
		}

		to {
			top: 285upx;
			left: 115upx;
		}
	}

	@-webkit-keyframes mymove2 {
		from {
			top: 0px;
			left: 0;
		}

		to {
			top: 285upx;
			left: 115upx;
		}
	}

	.move3 {
		position: relative;
		animation: mymove3 1s reverse;
		-webkit-animation: mymove3 1s reverse;
	}

	@keyframes mymove3 {
		from {
			bottom: 0px;
			left: 0;
		}

		to {
			bottom: 285upx;
			left: 115upx;
		}
	}

	@-webkit-keyframes mymove3 {
		from {
			bottom: 0px;
			left: 0;
		}

		to {
			bottom: 285upx;
			left: 115upx;
		}
	}


	.move4 {
		position: relative;
		animation: mymove4 1s reverse;
		-webkit-animation: mymove4 1s reverse;
	}

	@keyframes mymove4 {
		from {
			right: 0px;
		}

		to {
			right: 230upx;
		}
	}

	@-webkit-keyframes mymove4 {
		from {
			right: 0px;
		}

		to {
			right: 230upx;
		}
	}

	.move5 {
		position: relative;
		animation: mymove5 1s reverse;
		-webkit-animation: mymove5 1s reverse;
	}

	@keyframes mymove5 {
		from {
			right: 0px;
		}

		to {
			right: 230upx;
		}
	}

	@-webkit-keyframes mymove5 {
		from {
			right: 0px;
		}

		to {
			right: 230upx;
		}
	}
</style>
