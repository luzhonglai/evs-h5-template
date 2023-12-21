
<template>
    <view class="page">
        <view class='bj_able'>
            <view class="totalMoney">
                <view class='able_text' v-if="exchange_type==2">{{__('可用积分数量')}}（{{userInfo.user_points}}）</view>
                <view class='able_text' v-else>{{__('可用余额')}}（{{userInfo.user_money}}）</view>
            </view>
            <view class='able_input'>
                <view class='able_fuhao'>{{Currency}}</view>
                <input class='input_lab'  type="digit" @input="inputnum" maxlength="8" @blur="blur" v-model='deliveryNum'></input>
                <view class='pict_fal' @click="clearnum">
                    <image class='fal_pic' src='/static/images/false.png'></image>
                </view>
            </view>

            <view class="pay">
                <view class="coupon" @click="suitcouponlist" v-if="CouponEnabeld==true&&isCoupon">
                    <view><text style='letter-spacing: 2.4upx;font-size:26upx;'>{{__('优惠券')}}</text></view>
                    <view style="color:#db384c;">-{{Currency}}{{DiscountMoney}}
                        <text class="m-cell-ft"></text></view>
                </view>
                <view class="coupon" v-if="MaxUsableCash>0&&isECashCard">
                    <view class=""><text style='font-size:26upx;'>{{__('余额抵扣')}}</text><text style="font-size:24upx;color: #333333;">({{__('可使用')}}{{Currency}}{{MaxUsableCash}})</text></view>
                    <view class=""><text class="" v-if="isBalance" style="position:absolute;right:19%;color:#db384c">{{Currency}}{{balance}}</text>
                        <switch checked @change="switchChange" style="transform:scale(0.6);position:absolute;right:36upx" />
                    </view>
                </view>
                <view class=" payments"><label style='letter-spacing: 2.4upx;font-size:26upx;'>{{__('实付款')}}</label><text style="color:#db384c">{{Currency}}{{realPayMoney}}</text></view>
            </view>
            <form report-submit="true" @submit="paysubmit" v-if='isSubmit'><button class="payment" formType="submit">{{__('确认兑换')}}</button></form>
            <form report-submit="true" v-else><button class="payment" formType="submit">{{__('确认兑换')}}</button></form>
            <view class="explain" v-if="Description">
                <view class="title">{{__('买单说明：')}}</view>
                <view class="content">{{Description}}
                </view>
            </view>
        </view>
        <view class="u-top-default">
            <navigator url='/pages/index/index' open-type="switchTab" class="u-back2">
                <image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/gohome.png'></image>
            </navigator>
        </view>

    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data: function() {
            return {
                money: "",
                nodiscount: "",
                discount: "",
                isshow: !1,
                deliveryNum: "",
                isshow1: !1,
                shop_discount: 10,
                totalMoney: "",
                payment: 0,
                info: [],
                orderNum: "",
                formId: "",
                time: "",
                Description: "",
                MoneyLimit: "",
                CouponEnabeld: "",
                discountvalue: "",
                nodiscountvalue: "",
                DiscountMoney: "0.00",
                couponItemId: 0,
                IsUseCoupon: 1,
                MaxUsableCash: 0,
                MaxUsableECardCash: 0,
                MaxUsableExtraCash: 0,
                balance: 0,
                realMoney: 0,
                isBalance: !0,
                eCardCash: 0,
                extraCash: 0,
                realPayMoney: 0,
                isECashCard: !0,
                isCoupon: !0,
                isSubmit: !0,
                Currency: __('￥'),
                store_id: 0,
                title: "",
                exchange_type: 1 //1:money->积分   2:积分->money
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('积分兑换')
            });

            var that = this;
			that.setData({
				exchange_type: options.type ? options.type : 1
			});

			if (that.exchange_type == 1)
            {
				that.title = '余额兑换积分';
            }
			else
            {
				that.title = '积分转余额';
            }

			that.$.setNavigationBarTitle({
			    title: that.title
			});

			that.getPlantformInfo(function(plantform) {
				that.forceUserInfo(function (user) {
					that.setData({
						Currency: ' ',
						store_id: 1001
					});

					that.load(options);
				});
			})
        },

        onUnload(){
            // 离开页面，注销事件
            var that = this
            this.notice.removeNotification("RefreshCoupon1", that);
        },
        methods: {

            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),

            load: function(options) {
                var store_id = 1001;

                var a = {
                    store_id: store_id
                };
                //console.log("val+++++", a);
                var that = this;

            },
            clearnum: function(a) {
				//console.info(111)
                this.setData({
                    deliveryNum: "",
					realPayMoney: ""
                })
            },
            inputnum: function(e) {
                let that = this;

				let num = e.detail.value;

				//购买积分
				if (that.exchange_type == 1)
				{
					let need_money = num * that.Config.POINTS_VAUE_RATE;

					if (need_money > that.userInfo.user_money)
					{
						num = Math.ceil(that.userInfo.user_money / that.Config.POINTS_VAUE_RATE);

						that.$.alert(that.$.sprintf('最多兑换 %d 积分', num));

						this.setData({
							deliveryNum: num
						});
					}
					else
					{
					}

					this.setData({
						realPayMoney: num * that.Config.POINTS_VAUE_RATE
					});
				}
				else
				{
					//积分转余额
					if (num > that.userInfo.user_points)
					{
						num = that.userInfo.user_points;

						that.$.alert(that.$.sprintf('积分最多可用 %d', that.userInfo.user_points));

						this.setData({
							deliveryNum: that.userInfo.user_points
						});
					}
					else
					{
					}

					this.setData({
						realPayMoney: num * that.Config.POINTS_VAUE_RATE
					});
				}
            },
            blur: function(a) {
                let that = this;
                /^\d{1,10}(\.\d{1,2})?$/.test(a.detail.value) || that.$.showModal({
                    title: "提示",
                    content: "请输入正确金额"
                })
            },
            paysubmit: function(a) {
                var that = this;
                if (that.$.isNull(this.deliveryNum) || 0 == this.deliveryNum) return that.$.showModal({
                    title: "提示",
                    content: "请输入积分总数"
                });

                if (!/^\d{1,10}(\.\d{1,2})?$/.test(that.deliveryNum)) return that.$.showModal({
                    title: "提示",
                    content: "请输入正确金额"
                });


				let url = that.Config.URL.user.money2points;
				let tips = that.$.sprintf('确认{￥%.2f兑换%i积分?', that.realPayMoney, that.deliveryNum);
				//购买积分
				if (that.exchange_type == 1)
				{
				}
				else
				{
					url = that.Config.URL.user.points2money;
					tips = that.$.sprintf('确认%i积分转为余额￥%.2f?', that.deliveryNum, that.realPayMoney);
				}

				//确认提示
				that.$.confirm(
					tips,
					function(n) {
						if (n.confirm) {
							// 初始化页面
							that.$.request({
								type: 'post',
								url: url,
								data: {points_num: that.deliveryNum},
								dataType: 'json',
								success: function(data, status, msg, code) {
									if (200 == status)
									{
                                        that.$.alert(that.__('转赠成功！'));

                                        setTimeout(function() {
                                            that.reloadUserResource(function (user_info) {
                                                that.$.gopage(
                                                    '/integral/integral/record'
                                                );
                                            });
                                        }, 2e3);
									}
									else
									{
										that.$.alert(msg);
									}
								}
							});
						}
					},
					!0
				);
            },
            gotopay: function() {

            },
            switchChange: function(a) {
                a.detail.value ? this.setData({
                    realPayMoney: this.realMoney,
                    isBalance: !0
                }) : this.setData({
                    realPayMoney: this.payment,
                    isBalance: !1
                })
            }
        }

    }
</script>



<style lang="scss">

    @import "../../styles/_variables";
    .totalMoney { width: 90%; display: flex; margin: 24upx auto 0; justify-content: space-betwee; height: 92upx; border-radius: 8upx; } .totalMoney label { width: 54%; height: 92upx; line-height: 92upx; font-size: 26upx; color: #000; } .totalMoney input { height: 92upx; line-height: 92upx; font-size: 26upx; text-align: right; margin-right: 20upx; } .nodiscount { width: 90%; margin: 51upx auto 20upx auto; } .check { height: 58upx; line-height: 58upx; font-size: 26upx; color: #808080; } .discount { height: 85upx; line-height: 90upx; padding: 0 40upx; background: #fff; font-size: 28upx; color: #000; margin: 24upx 0; } .pay { padding: 0 40upx; background: #fff; } .coupon { display: flex; justify-content: space-between; height: 98upx; line-height: 98upx; font-size: 26upx; color: #000; border-bottom: 1upx solid #f1f1f1; } .payments { display: flex; justify-content: space-between; height: 98upx; line-height: 98upx; font-size: 28upx; color: #000; } .payment { width: 90%; height: 80upx; line-height: 82upx; background: #db384c; color: #fff; margin-top: 50upx; } .explain { width: 90%; margin: 50upx auto; } .title { font-size: 28upx; color: #000; } .content { font-size: 24upx; color: #717171; margin-top: 10upx; } .m-cell-ft::after { content: " "; display: inline-block; height: 12upx; width: 12upx; border-width: 4upx 4upx 0 0; border-color: #999; border-style: solid; -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0); transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0); position: relative; margin-top: -8upx; top: -4upx; right: -4upx; } .u-back2 image { border-radius: 100%; width: 77upx; height: 77upx; border: 1px solid #eee; font-size: 20upx; text-align: center; background-color: #fff; box-shadow: 0px 4upx 8upx rgba(0, 0, 0, 0.35); z-index: 999; opacity: 0.8; line-height: 77upx; margin-bottom: 20upx; } .bj_able { background: #fff; width: 92%; margin: 0 auto; padding-bottom: 40upx; } .able_text { letter-spacing: 2upx; width: 80%; height: 92upx; line-height: 92upx; font-size: 26upx; color: #000; } .able_input { width:90%; margin:20upx auto 0 auto; border-bottom:1upx solid #f1f1f1; height:110upx; display:flex; } .able_fuhao { font-family: PingFangSC-Medium; font-size: 60upx; color: #000; letter-spacing: 0.84upx; text-align: center; line-height: 94upx; margin-right: 10upx; font-weight: bold } /* .input_lab { float: left; width: 75%; height: 100%; } */ .checkbox { font-family: PingFangSC-Regular; font-size: 26upx; color: #7b7b7b; letter-spacing: 0.5upx; text-align: center; } .no_lab { width: 90%; display: flex; margin: 24upx auto 0; justify-content: space-betwee; height: 98upx; border-radius: 8upx; line-height: 98upx; border-bottom: 1upx solid #f1f1f1; } .pict_fal { width: 38upx; height: 38upx; position: absolute; top: 161upx; right: 9%; } .fal_pic { width: 38upx; height: 38upx; } .input_lab{ width: 87%; font-family: UICTFontTextStyleBody; font-size: 74upx; height: 74upx; /* line-height:74upx; *//* padding:8upx 0; */ min-height: 83upx; line-height: normal; box-sizing: border-box; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; vertical-align: middl; font-weight: bold }
</style>
