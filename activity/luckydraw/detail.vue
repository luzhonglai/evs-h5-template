<template>
	<view>
		<block v-if="(isPage)">
			<view class="m-draw-box" v-if="outdated">
				<view class="m-title">
					<view class="m-title-main">{{DrawInfo.activity_title}}</view>
					<view class="m-title-sub">{{__('幸运大抽奖')}}</view>
					<view class="m-title-time">{{DrawInfo.activity_starttime}} ~ {{DrawInfo.activity_endtime}}</view>
				</view>
				<view class="m-table">
					<view v-for="(item, i) in PrizeList" :key="i" :class="['m-table-td', (i+1)==index?'select-table':'']" >
						<image :src="item.awards_image"></image>
						<view class="price-text">{{item.awards_name}}</view>
					</view>
					<view class="m-table-btn" @tap="LuckDraw">
						<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/activity/click.png"></image>
					</view>
				</view>
				<view class="m-tip">{{__('您还有')}}<label>{{RemainingCount}}{{__('次')}}</label>{{__('抽奖机会，快来试试手气')}}</view>
				<view class="m-model-outline">
					<view class="m-model yellow">{{__('中奖名单')}}</view>
				</view>
				<block v-if="DrawInfo.winner_rows.items.length >0">
					<swiper autoplay="true" interval="4000" duration="2000" class="m-luckylist" vertical="false" circular="true">
						<swiper-item v-for="(t_item, i) in rows" :key="i">
							<block v-for="(item, j) in DrawInfo.winner_rows.items" :key="j">
								<view v-if="j>=(i*3) && j<=((i+1)*3)" class="m-luckylist-item">
									• {{item.user_nickname}}{{__('抽中')}}
									<label>{{item.awards_name}}</label>
								</view>
							</block>
						</swiper-item>
					</swiper>
				</block>
				<view class="m-winner-nothing" v-else>{{__('暂无中奖名单数据')}}</view>
				<view class="m-model-outline">
					<view class="m-model blue">{{__('活动规则')}}</view>
				</view>
				<view class="m-rule">
					<wxParse :content="DrawInfo.activity_rule.activity_intro + ''"  />
				</view>
			</view>
			<view class="activity-outdated" v-else>
				<view class="m-nullcontent">
					<view class="m-nullpage-middle">
						<label class="iconfont icon-meiyougengduo"></label>
						<view class="m-null-tip">
							<text>{{__('亲~您来晚了哦')}}</text>
							<text>{{__('该抽奖活动已经失效啦')}}~</text>
						</view>
					</view>
				</view>
			</view>
		</block>

		<view class="u-tap-btn">
			<navigator url="/member/member/prize?category=1" class="u-go-home">
				<view class="iconfont icon-iconcanjiahuodong01"></view>
			</navigator>
			<view class="red-dot"></view>
			<navigator url="/pages/index/index" open-type="switchTab" class="u-go-home">
				<view class="iconfont icon-shouyeshouye" style="font-size:50rpx;"></view>
			</navigator>
		</view>
		<view class="mskprize" v-if="clickmsk" @tap="cancelprize">
			<view class="m-result-box bounceIn animated" catchtap="nothing" v-if="PrizeResult.index >= 0">
				<view class="m-result-cancel" @tap="cancelprize">✕</view>
				
				<block v-if="PrizeResult.awards_enable">
					<view class="m-success-text">{{__('恭喜你获得了')}}</view>
				</block>
				<block v-if="!PrizeResult.awards_enable">
					<view class="m-success-text">{{__('未中奖')}}</view>
				</block>
				<image :src="PrizeList[PrizeResult.index].awards_image" class="m-success-img" />
				<view class="m-success-name">{{PrizeResult.prize}}</view>
				<view class="m-success-name" v-if="false">{{PrizeResult.PrizeSendingMessage}}</view>
				<view class="m-success-bottom">
					<navigator url="/member/member/prize?category=1" class="succes-checkprice">{{__('查看奖品')}}</navigator>
					<view class="succes-continue" @tap="cancelprize">{{__('继续抽奖')}}</view>
				</view>
			</view>
			<view class="m-result-box wobble animated" catchtap="nothing" v-else>
				<view class="m-result-cancel" @tap="cancelprize">✕</view>
				<view class="m-failimg-bg">
					<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/nothing.png" class="m-fail-img" />
				</view>
				<view class="m-fail-name">{{DrawInfo.LosingDesc}}</view>
				<view class="m-fail-button" @tap="cancelprize">{{__('继续抽奖')}}</view>
			</view>
		</view>
		<view class="mskshare" v-if="clickshare" @tap="cancelshare">
			<!-- <image src="../../assets/share.png" class="share-oncemore" mode="widthFix"></image> -->
			<view class="share-text">
				<view>{{__('你今天已经没有抽奖机会了')}}</view>
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
				index: -1,
				count: 13,
				timer: 0,
				speed: 20,
				times: 0,
				cycle: 50,
				prize: -1,
				click: !1,
				clickmsk: !1,
				clickshare: !1,
				drawdesc: [],
				PrizeList: [],
				DrawInfo: {},
				RemainingCount: 0,
				PrizeResult: {},
				rows: [],
				Coupons: [],
				isCancelSuccess: !0,
				isCancel: !0,
				CouponAmount: 0,
				IsNewUser: 0,
				isPage: !1,
				outdated: !1,

				activity_id: !1
			}
		},
		components: {
			dayCountdown,
			wxParse
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin'
		]),
		onLoad: function (options) {
			let that = this;

			uni.setNavigationBarTitle({
				title:this.__('幸运大抽奖')
			});

			that.setData({
				activity_id: options.activity_id || 0,
				options:options
			});

			$.isNull(this.userInfo) ? this.getUserInfo(function() {
						that.setData({
							user_is_new: this.userInfo.user_is_new,
							CouponAmount: this.userInfo.CouponAmount
						}), that.initData()
					},
					options.uid) : that.initData()
		},
		onShareAppMessage: function () {
			var e = this;
			return this.setData({clickshare: !1, click: !1}), {
				title: e.__("我已经中奖啦，你也赶紧来抽奖吧~"),
				desc: e.__("幸运大抽奖，快来参与吧~"),
				path: "/activity/luckydraw/detail?uid=" + this.userInfo.user_id,
				success: function (t) {
					e.sharefriend()
				}
			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			sharefriend: function () {
				var e = {  Category: 1,
							activity_id: this.activity_id},
						t = this;
				$.request($.makeUrl(activityapi.ShareLuckyDraw, e), function (e) {
					e.Code == 0 && e.Info != null && (t.setData({RemainingCount: t.RemainingCount}), t.initData())
				})
			},
			initData: function () {
				// 2砸金蛋，1大转盘
				var params = {
							activity_type: 1,
							activity_type_id: this.StateCode.ACTIVITY_TYPE_LOTTERY,
							activity_id: this.activity_id
						},
						that   = this;
				// 等级规则
				$.request({
					url: this.Config.URL.user.listsLottery,
					data: params,
					success: function (data, status, msg, code) {
						that.setData({isPage: !0});
						if (status == 200)
						{
							that.setData({
								DrawInfo      : data,
								RemainingCount: data.remaining_count,
								outdated      : data.outdated,
								PrizeList     : data.items,
								activity_id   : data.activity_id
							});
							if (that.DrawInfo.winner_rows.items.length > 0)
							{
								var n = that.DrawInfo.winner_rows.items.length % 5 > 0 ? parseInt(that.DrawInfo.winner_rows.items.length / 5 + 1) : that.DrawInfo.winner_rows.items.length / 5,
										r = [];
								for (var i = 0; i < n; i++)
								{
									r.push(i);
								}
								that.setData({rows: r})
							}


							$.isNull(data.activity_rule.activity_intro);
						}
						else
						{
							that.setData({outdated: !1})
						}

					}
				});
			},
			getPosition: function () {
				var params = {activity_id: this.activity_id};
				var that = this;

				// 等级规则
				$.request({
					url: this.Config.URL.user.doLottery,
					data: params,
					success: function (data, status, msg, code) {
						if (status == 200) {
							
							if (typeof data !== 'string') 
							{
								(that.setData({
									prize      : data.index,
									PrizeResult: data
								}), that.roll());
							}
							else
							{
								that.setData({
									prize: -1,
									times: 0,
									click: !1
								});
								
								that.roll()
							}
						} else {
								that.setData({
									prize: -1,
									times: 0,
									click: !1
								});
								
								that.roll()
						}
					}
				});
			},
			LuckDraw: function () {
				this.click || (this.setData({
					speed: 100,
					click: !0
				}), this.RemainingCount > 0 ? this.getPosition() : this.RemainingCount == 0 && this.setData({clickshare: !0}))
			},
			luckRoll: function () {
				var e = this.index, t = this.count;
				e += 1, e > t - 1 && (e = 0), this.setData({index: e})
			},
			roll: function () {
				this.setData({times: this.times + 1}), this.luckRoll();
				
				if (this.times > this.cycle + 10 && this.prize == this.index)
				{
					if (this.prize == this.index)
					{
						clearTimeout(this.timer), this.setData({prize: -1, times: 0, click: !1}), this.initData();
						var e = this;
						setTimeout(function () {
									e.setData({clickmsk: !0})
								},
								800)
					}
					
				}
				else
				{
					//未中奖的提示【异常】
					if (this.prize == -1)
					{
							clearTimeout(this.timer), this.setData({prize: -1, times: 0, click: !1}), this.initData();
							var e = this;
							setTimeout(function () {
										e.setData({clickmsk: !0})
									},
									800)
					}
					else
					{
						if (this.times < this.cycle)
						{
							this.setData({speed: this.speed - 10});
						}
						else if (this.times == this.cycle)
						{
							var t = this.prize + 1;
							this.setData({prize: t})
						}
						else
						{
							this.times > this.cycle + 10 && (this.prize == 0 && this.index == 7 || this.prize == this.index + 1) ? this.setData({speed: this.speed + 110}) : this.setData({speed: this.speed + 20});
						}
						this.speed < 40 && this.setData({speed: this.speed + 40});
						var e = this;
						this.timer = setTimeout(function () {
									e.roll()
								},
								e.speed)
					}
				}
				
				return !1
			},
			cancelprize: function () {
				this.setData({clickmsk: !1})
			},
			cancelshare: function () {
				this.setData({clickshare: !1}), this.setData({prize: -1, times: 0, click: !1})
			},
			nothing: function () {
			},
			doReceive: function () {
				this.cancel(), this.userReceiveCoupon()
			},
			cancel: function () {
				this.setData({isCancel: !1})
			},
			cancelsuccess: function () {
				this.setData({isCancelSuccess: !0})
			},
			innertouch: function () {
			},
			userReceiveCoupon: function () {
				var params = {
					activity_id     : this.activity_id,
					activity_type   : 1,
					activity_type_id: this.StateCode.ACTIVITY_TYPE_LOTTERY
				};

				var that = this;
				$.request({
					url    : this.Config.URL.user.listsLotteryHistory,
					data   : params,
					success: function (data, status, msg, code)
					{
						if (status == 200) {
							that.setData({
								isCancelSuccess: !1,
								Coupons        : data.items
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

	page {background-color: #292438;font-family: -apple-system-font, Helvetica Neue, Helvetica, sans-serif;}
	.activity-outdated{position: absolute;width: 100%;height: 100%;background: #f8f8f8;}
	.m-draw-box{height: 1940rpx;background:url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/luckdraw_bg.png) center no-repeat;background-size: cover;padding: 42rpx;text-align: center;color: white;}
	.m-title{margin-top: 40rpx;}
	.m-title-main{font-size: 80rpx;font-weight: bold;line-height: 90rpx;height: 90rpx;overflow: hidden;}
	.m-title-sub{font-size: 60rpx;font-weight: bold;line-height: 70rpx;}
	.m-title-time{font-size: 22rpx;line-height: 40rpx;}
	/**抽奖盒子**/
	.m-table{position: relative;width: 666rpx;height: 666rpx;margin-top: 30rpx;}
	.m-table-td{width: 144rpx; height: 144rpx;position:absolute;border-radius: 8rpx;background: white;left: 0;top: 0;display: flex;align-items: center;justify-content: center;flex-direction: column;}
	.price-text{color:gray;font-size: 24rpx;overflow: hidden;height: 28rpx;line-height: 28rpx;}
	.m-table-td image{ width: 60%;height: 60%;box-sizing: border-box;margin: 10rpx;}
	.m-table-td:nth-child(2){margin-left: 174rpx;}
	.m-table-td:nth-child(3){margin-left: 348rpx;}
	.m-table-td:nth-child(4){margin-left: 522rpx;}
	.m-table-td:nth-child(5){margin-top: 174rpx;left:522rpx;}
	.m-table-td:nth-child(6){margin-top: 348rpx;left:522rpx;}
	.m-table-td:nth-child(7){margin-top: 522rpx;left:522rpx;bottom: 0;}
	.m-table-td:nth-child(8){margin-top: 522rpx;left:348rpx;bottom: 0;}
	.m-table-td:nth-child(9){margin-top: 522rpx;left:174rpx;bottom: 0;}
	.m-table-td:nth-child(10){margin-top: 522rpx;bottom: 0;}
	.m-table-td:nth-child(11){margin-top: 348rpx;}
	.m-table-td:nth-child(12){margin-top: 174rpx;}
	.m-table-btn image{width: 318rpx;height: 318rpx;border-radius: 20rpx;position: absolute;left: 174rpx;top: 174rpx;background: #FFDC44;padding: 50rpx;box-sizing: border-box;border: 10rpx;border-style:solid;border-top-color: #FFF068;border-bottom-color: #FFC61F;border-left-color: #FFC61F;border-right-color: #FFDC44;}
	.select-table{background-color: #FFAC33;}
	/**抽奖盒子**/
	.m-tip{font-size: 24rpx;line-height: 90rpx;}
	.m-tip label{color: #FFDC44;}
	.m-model-outline{width: 320rpx;height: 65rpx;margin: 0 auto;border-bottom: 1px dotted white;margin-top: 70rpx;border-radius: 33rpx;}
	.m-model{height: 60rpx;line-height: 60rpx;border-radius: 30rpx;font-size: 32rpx;font-weight: bold;}
	.yellow{background: #FFAC33;}
	.m-luckylist{font-size: 26rpx;text-align: left;margin-top: 40rpx;max-height: 240rpx;overflow: hidden;}
	.m-luckylist-item{line-height: 80rpx;border-top: 1rpx dotted white;box-sizing: border-box;height: 80rpx;}
	.m-luckylist-item label{color: #FFDC44;}
	.m-winner-nothing{text-align: left;font-size: 26rpx;padding: 30rpx 0;}

	.blue{background: #43C4E9;}
	.m-rule{font-size: 26rpx;line-height: 40rpx;text-align: left;margin-top: 30rpx;}

	.mskprize{position: fixed;height: 100%;width: 100%;background-color: rgba(0, 0, 0, 0.70);z-index: 5;top: 0;left: 0;display: flex;justify-content: center;align-items: center;color: white;text-align: center;}
	.mskshare{position: fixed;height: 100%;width: 100%;background-color: rgba(0, 0, 0, 0.70);z-index: 5;top: 0;left: 0;}
	.share-oncemore{width: 700rpx;margin: 0 auto;}
	.share-text{margin: 0 auto;font-size: 40rpx; line-height: 80rpx;color: white;text-align: center;margin-top:45%}
	.m-result-box{width: 500rpx;height: 600rpx;background: #DB384B;position: relative;border-radius: 20rpx;}
	.m-result-cancel{position: absolute;right: 25rpx;top: 15rpx;font-size: 36rpx;}
	.m-success-text{line-height: 80rpx;margin-top: 50rpx;font-size: 30rpx;}
	.m-success-img{width: 250rpx;height: 250rpx;background: white;margin: 0 auto;}
	.m-success-name{color: #FFAC33;font-size: 26rpx;line-height: 50rpx;}
	.m-success-bottom{position: absolute;bottom: 40rpx;line-height: 65rpx;font-size: 28rpx;display: flex;justify-content: center;width: 100%;}
	.succes-continue{height: 65rpx;width: 200rpx;background: #FFCA3A;display: inline-block;border-radius: 5rpx;}
	.succes-checkprice{height: 65rpx;width:200rpx;background: white;color: black; display: inline-block;border-radius: 5rpx;margin-right: 30rpx;}

	.m-failimg-bg{width: 350rpx;height: 350rpx;border-radius: 175rpx;background-color: rgba(255, 255, 255, 0.10);margin: 40rpx auto 20rpx;padding: 50rpx;box-sizing: border-box;}
	.m-fail-img{width: 100%;height: 100%;border-radius: 150rpx;background-color: rgba(255, 255, 255, 0.20);}
	.m-fail-name{font-size: 26rpx;line-height: 50rpx;}
	.m-fail-button{width: 300rpx;height: 65rpx;line-height: 65rpx;position: absolute;bottom: 40rpx;background: #FFCA3A;border-radius: 5rpx;font-size: 28rpx;left: 100rpx;}

	.red-dot{width: 20rpx;height: 20rpx;border-radius: 10rpx;background: $default-skin-bg;position: fixed;bottom: 220rpx;right: 20rpx;z-index: 5;}
	.u-tap-btn{position: fixed;right: 20rpx;bottom: 40rpx;}
	.u-go-home{border-radius: 100%;width: 80rpx;height: 80rpx;border: 1px solid #eee;font-size: 20rpx;text-align: center;background-color: #fff;box-shadow: 0px 4rpx 8rpx rgba(0,0,0,0.35);z-index: 2;opacity: 0.8;line-height:80rpx; margin-bottom: 20rpx;}
	.u-go-home .iconfont{font-size: 36rpx;}
</style>
