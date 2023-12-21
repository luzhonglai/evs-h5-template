
<template>
    <view class="page">
        <view class='bj_able'>
            <view class="totalMoney">
                <view class='able_text'>{{__('向')}} {{store_name}} {{__('支付金额')}}</view>
            </view>
            <view class='able_input'>
                <view class='able_fuhao'>{{Currency}}</view>
                <input class='input_lab'  type="digit" @input="inputnum" maxlength="8" @blur="blur" v-model='deliveryNum'></input>
                <view class='pict_fal' @click="clearnum">
                    <image class='fal_pic' src='/static/images/false.png'></image>
                </view>
            </view>
            <view class="nodiscount" v-if="isshow1">
                <checkbox-group class="check" @change="checkboxChange"><label class="checkbox">
                    <checkbox style="transform:scale(0.6);-webkit-transform:scale(0.6);-o-transform:scale(0.6);-moz-transform:scale(0.6);-ms-transform:scale(0.6)" />{{__('输入不参与优惠金额')}}
                </label></checkbox-group>
            </view>
            <view class="title" style="background"></view>
            <view class="totalMoney  no_lab" v-if="isshow" style="background:#fff"><label>不参与优惠金额：</label><input placeholder="询问服务员后输入"
                                                                                                                      type="digit" @input="onNodiscount" maxlength="8" @blur="blur1" :value="nodiscountvalue" /></view>
            <view class="discount" v-if="isshow1 && shop_discount<10">
                <image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/discount-icon.png" style="width:50upx;height:54upx;float:left;margin-top:16upx"></image><text
                    style="float:left;margin-left:20upx">{{shop_discount||10}}折</text><text style="color:#db384c;float:right">-{{Currency}}{{discount}}</text>
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
            <form report-submit="true" @submit="paysubmit" v-if='isSubmit'><button class="payment" formType="submit">{{__('确认支付')}}</button></form>
            <form report-submit="true" v-else><button class="payment" formType="submit">{{__('确认支付')}}</button></form>
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

		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" kind="favorable" ref="paymentBox"  @onCancel="onCancel"  @onPaid="onPaid"  @onFail="onFail"></payment-box>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'


    import paymentBox from '../../components/payment-box.vue'
	
    export default {
        data: function() {
            return {
                store_name: "",
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
                order_id: "",
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
                Currency: '￥',
                store_id: 0,
				
				paymentData:{}
            }
        },
        components: {
            paymentBox
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('优惠买单')
            });

            var that = this;
			
			that.setData({
                Currency: that.__('￥'),
			    store_id: options.store_id || 1001
			});

            this.forceUserInfo(function (user) {
                that.load();
            });
        },

        onUnload(){
            // 离开页面，注销事件
            var that = this
            this.notice.removeNotification("RefreshCoupon1", that);
			
			
			if (this.$refs.paymentBox.showBoxView) {
			    this.$refs.paymentBox.cancel();
			}
        },
        methods: {

            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),

            load: function() {
				let that = this;

                // 初始化页面
                that.$.request({
                    type: 'post',
                    url: this.Config.URL.store.info,
                    data: {store_id: that.store_id, action:'intro'},
                    dataType: 'json',
                    success: function(data, status, msg, code) {
                        //console.log("优惠买单：", data);
                        that.setData({
                            shop_discount: data.info.store_discount,
                            store_name: data.base.store_name,
                            //Description: data.Description,
                            //CouponEnabeld: data.CouponEnabeld
                        });
                        //console.log("CouponEnabeld", that.CouponEnabeld);

                        false ? that.setData({
                            isshow1: !1
                        }) : that.setData({
                            isshow1: !0
                        });

                        that.inputVal()
                    }
                });



                this.notice.addNotification("RefreshCoupon1", that.RefreshCoupon1, that);

                var e = 'VendorFeatureSet'; - 1 < e.indexOf("ECashCard") ? (this.setData({
                    isECashCard: !0
                }), this.GetUserUsableECash()) : this.setData({
                    isECashCard: !1
                }), -1 < e.indexOf("Coupon") ? this.setData({
                    isCoupon: !0
                }) : this.setData({
                    isCoupon: !1
                })
            },
            clearnum: function(a) {
                this.setData({
                    deliveryNum: ""
                })
            },
            GetUserUsableECash: function() {
                var a = {
                        userName: this.userInfo.UserName,
                        orderRealTotal: 0
                    },
                    that = this;
                that.$.xsr(that.$.makeUrl(orderapi.GetUserUsableECash, a), function(a) {
                    that.setData({
                        MaxUsableCash: a.Info[0].MaxUsableCash,
                        MaxUsableECardCash: a.Info[0].MaxUsableECardCash,
                        MaxUsableExtraCash: a.Info[0].MaxUsableExtraCash
                    })
                })
            },
            RefreshCoupon1: function(a) {
                this.setData({
                    couponItemId: a.couponItemId,
                    IsUseCoupon: a.IsUseCoupon,
                    DiscountMoney: a.DiscountMoney,
                    MoneyLimit: a.MoneyLimit
                }), this.inputVal()
            },
            inputnum: function(e) {
                let that = this;
                this.setData({
                    money: e.detail.value
                });

                parseFloat(e.detail.value) - (parseFloat(e.detail.value) - parseFloat(this.nodiscount || 0)) * (1 - this.shop_discount / 10) < parseFloat(this.MoneyLimit) && this.setData({
                    couponItemId: 0,
                    IsUseCoupon: 0,
                    DiscountMoney: 0,
                    MoneyLimit: 0
                });

                that.$.isNull(e.detail.value) && this.setData({
                    couponItemId: 0,
                    IsUseCoupon: 0,
                    DiscountMoney: 0,
                    MoneyLimit: 0
                });

                parseFloat(this.nodiscount) > parseFloat(e.detail.value) && (that.$.showModal({
                    title: "提示",
                    content: "不参与优惠金额应小于总金额"
                }), this.setData({
                    nodiscount: 0,
                    discount: 0
                }));

                this.inputVal()
            },
            onNodiscount: function(a) {
                let that = this;
                this.setData({
                    nodiscount: a.detail.value
                });
                parseFloat(this.money) - (parseFloat(this.money) - parseFloat(a.detail.value || 0)) * (1 - this.shop_discount / 10) < parseFloat(this.MoneyLimit) && this.setData({
                    couponItemId: 0,
                    IsUseCoupon: 0,
                    DiscountMoney: 0,
                    MoneyLimit: 0
                });

                parseFloat(a.detail.value) > parseFloat(this.money) && (that.$.showModal({
                    title: "提示",
                    content: "不参与优惠金额应小于总金额"
                }), this.setData({
                    nodiscount: 0,
                    discount: 0,
                    nodiscountvalue: ""
                }));

                this.inputVal()
            },
            blur: function(a) {
                let that = this;
                /^\d{1,10}(\.\d{1,2})?$/.test(a.detail.value) || that.$.showModal({
                    title: "提示",
                    content: "请输入正确金额"
                })
            },
            blur1: function(a) {
                let that = this;
                /^\d{1,10}(\.\d{1,2})?$/.test(a.detail.value) || that.$.showModal({
                    title: "提示",
                    content: "请输入正确金额"
                })
            },
            inputVal: function() {
                let that = this;
                var a = this.money,
                    t = this.nodiscount,
                    e = this.shop_discount,
                    o = this.DiscountMoney;
                this.setData({
                    discount: ((a - t) * (1 - e / 10)).toFixed(2),
                    payment: (a - (a - t) * (1 - e / 10) - o).toFixed(2)
                }), this.payment < 0 && this.setData({
                    payment: 0
                }), isNaN(this.discount) && this.setData({
                    discount: 0
                }), isNaN(this.payment) && this.setData({
                    payment: 0
                }), 0 == this.MaxUsableCash && this.setData({
                    realPayMoney: this.payment
                }), this.MaxUsableCash >= this.payment ? this.setData({
                    balance: this.payment,
                    realMoney: 0
                }) : this.setData({
                    balance: this.MaxUsableCash,
                    realMoney: (this.payment - this.MaxUsableCash).toFixed(2)
                }), this.setData({
                    realPayMoney: this.realMoney
                }), 0 == this.isBalance && this.setData({
                    realPayMoney: this.payment
                })
            },
            suitcouponlist: function() {
                var a = this.money,
                    t = this.nodiscount,
                    e = this.shop_discount;
                this.setData({
                    discount: ((a - t) * (1 - e / 10)).toFixed(2)
                });
                var o = {
                        userId: this.userInfo.Id,
                        store_id: 1001,
                        realMoney: (a - (a - t) * (1 - e / 10)).toFixed(2)
                    },
                    that = this;
                that.$.xsr(that.$.makeUrl(cartapi.GetUsableCouponItemListForQuickPay, o), function(a) {
                    that.setData({
                        info: a.Info
                    }), that.$.navigateTo({
                        url: "../favorablesuitcouponlist/favorablesuitcouponlist?val=" + JSON.stringify(a.Info) + "&id=" + that.couponItemId
                    })
                })
            },
            checkboxChange: function(a) {
                0 < a.detail.value.length ? this.setData({
                    isshow: !0
                }) : this.setData({
                    isshow: !1,
                    nodiscount: 0
                }), this.inputVal()
            },
            paysubmit: function(a) {
                var that = this;
                if (that.$.isNull(this.money) || 0 == this.money) return that.$.showModal({
                    title: "提示",
                    content: "请输入消费总金额"
                }), !1;
                if (!/^\d{1,10}(\.\d{1,2})?$/.test(that.money)) return that.$.showModal({
                    title: "提示",
                    content: "请输入正确金额"
                }), !1;
                if (that.isshow && !/^\d{1,10}(\.\d{1,2})?$/.test(that.nodiscount)) return that.$.showModal({
                    title: "提示",
                    content: "请输入正确金额"
                }), !1;
                if (parseFloat(that.nodiscount) > parseFloat(that.money)) return that.$.showModal({
                    title: "提示",
                    content: "不参与优惠金额应小于总金额"
                }), !1;
                this.isBalance ? (0 == this.MaxUsableCash && this.setData({
                    eCardCash: (1 * this.MaxUsableECardCash).toFixed(2),
                    extraCash: (1 * this.MaxUsableExtraCash).toFixed(2)
                }), 0 != this.MaxUsableCash && 0 == this.balance && this.setData({
                    eCardCash: (1 * this.MaxUsableECardCash).toFixed(2),
                    extraCash: (1 * this.MaxUsableExtraCash).toFixed(2)
                }), this.balance >= this.MaxUsableECardCash && this.setData({
                    eCardCash: (1 * this.MaxUsableECardCash).toFixed(2),
                    extraCash: (this.balance - 1 * this.MaxUsableECardCash).toFixed(2)
                }), this.balance < this.MaxUsableECardCash && this.setData({
                    eCardCash: (1 * this.balance).toFixed(2),
                    extraCash: 0
                })) : this.setData({
                    eCardCash: 0,
                    extraCash: 0
                });

                var param = {
                    userName: this.userInfo.UserName,
                    payTypeId: 9,
                    couponItemId: this.couponItemId,
                    totalMoney: this.money,
                    preferential: this.shop_discount,
                    preferentialMoney: this.discount,
                    nonPreferentialMoney: this.nodiscount || 0,
                    realMoney: this.realPayMoney,
                    firstType: 2,
                    eCardCash: this.eCardCash,
                    extraCash: this.extraCash,
                    store_id: this.store_id
                };

				that.$.request({
				    url: this.Config.URL.pay.favorable,
				    data: param,
				    success: function (data, status, msg, code) {
				        if (status == 200)
				        {
							that.gotopay(data.pay_sn, param.realMoney);
				        }
				        else
				        {
				            that.$.alert(msg)
				        }

				    },

				    fail: function (err) {
				    }
				});
            },
            gotopay_old: function() {

                var that = this, param = {
                    order_id: this.order_id,
                    openid: this.userInfo.openId,
                    store_id: this.shopInfo.store_id,
                    typ: 'json',
                    payment_channel_code: 'wx_native',
                    prepay_flag: 1
                };


                that.$.request({
                    url: this.Config.URL.pay.pay,
                    data: param,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
                            that.$.requestPayment({
                                timeStamp: data.timeStamp,
                                nonceStr: data.nonceStr,
                                "package": data.package,
                                signType: data.signType,
                                paySign: data.paySign,
                                success: function (n) {
                                    that.returnUrl(param.order_id)
                                },
                                fail: function (e) {
                                    that.$.redirectTo("/chain/chain/favorabledetail?on=" + param.order_id)
                                },
                                complete: function (n) {
                                    n.errMsg == "requestPayment:cancel" && (that.$.redirectTo("/chain/chain/favorabledetail?on=" + param.order_id), that.sendMessage(param.order_id, 1))
                                }
                            })
                        }
                        else
                        {
                            that.$.alert(msg)
                        }

                    },

                    fail: function (err) {
                    }
                });
            },
			
			gotopay: function(order_id, order_payment_amount) {
			    var that = this;
			
			    that.setData({
			         order_id: order_id,
			        'paymentData': {
			            order_id: order_id,
			            orderSelMoneyAmount: order_payment_amount,
			
			            user_money: this.userInfo.user_money,
			            user_points:this.userInfo.user_points,
			            user_recharge_card:this.userInfo.user_recharge_card,
			            user_sp:this.userInfo.user_sp
			        }
			    });
			
			    this.$refs.paymentBox.show();
				
			    return true;
			},
			
			onCancel: function(e) {
			    return
			},
			onPaid: function(e) {
			    let that = this
				
				if (this.$refs.paymentBox.showBoxView) {
				    this.$refs.paymentBox.cancel();
				}
			
				that.reloadUserResource(function (user_info) {
					that.$.alert(that.__('支付成功'), function(){
						that.$.gotopage("/chain/chain/favorabledetail?order_id=" + that.order_id)
					}, 2000)
				});
			
			},
			onFail: function(e) {
			},
			
            returnUrl: function(a) {
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
	
	.store-box { 
		width: 90%; display: flex;line-height:92upx;height: 92upx; border-radius: 8upx; padding-left: 24upx;
		font-weight: 700;
		    font-size: 16px;
	}
	
    .totalMoney { width: 90%; display: flex; margin: 24upx auto 0; justify-content: space-betwee; height: 92upx; border-radius: 8upx; } .totalMoney label { width: 54%; height: 92upx; line-height: 92upx; font-size: 26upx; color: #000; } .totalMoney input { height: 92upx; line-height: 92upx; font-size: 26upx; text-align: right; margin-right: 20upx; } .nodiscount { width: 90%; margin: 51upx auto 20upx auto; } .check { height: 58upx; line-height: 58upx; font-size: 26upx; color: #808080; } .discount { height: 85upx; line-height: 90upx; padding: 0 40upx; background: #fff; font-size: 28upx; color: #000; margin: 24upx 0; } .pay { padding: 0 40upx; background: #fff; } .coupon { display: flex; justify-content: space-between; height: 98upx; line-height: 98upx; font-size: 26upx; color: #000; border-bottom: 1upx solid #f1f1f1; } .payments { display: flex; justify-content: space-between; height: 98upx; line-height: 98upx; font-size: 28upx; color: #000; } .payment { width: 90%; height: 80upx; line-height: 82upx; background: #db384c; color: #fff; margin-top: 50upx; } .explain { width: 90%; margin: 50upx auto; } .title { font-size: 28upx; color: #000; } .content { font-size: 24upx; color: #717171; margin-top: 10upx; } .m-cell-ft::after { content: " "; display: inline-block; height: 12upx; width: 12upx; border-width: 4upx 4upx 0 0; border-color: #999; border-style: solid; -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0); transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0); position: relative; margin-top: -8upx; top: -4upx; right: -4upx; } .u-back2 image { border-radius: 100%; width: 77upx; height: 77upx; border: 1px solid #eee; font-size: 20upx; text-align: center; background-color: #fff; box-shadow: 0px 4upx 8upx rgba(0, 0, 0, 0.35); z-index: 999; opacity: 0.8; line-height: 77upx; margin-bottom: 20upx; } .bj_able { background: #fff; width: 92%; margin: 0 auto; padding-bottom: 40upx; } .able_text { letter-spacing: 2upx; width: 54%; height: 92upx; line-height: 92upx; font-size: 26upx; color: #000; } .able_input { width:90%; margin:20upx auto 0 auto; border-bottom:1upx solid #f1f1f1; height:110upx; display:flex; } .able_fuhao { font-family: PingFangSC-Medium; font-size: 60upx; color: #000; letter-spacing: 0.84upx; text-align: center; line-height: 94upx; margin-right: 10upx; font-weight: bold } /* .input_lab { float: left; width: 75%; height: 100%; } */ .checkbox { font-family: PingFangSC-Regular; font-size: 26upx; color: #7b7b7b; letter-spacing: 0.5upx; text-align: center; } .no_lab { width: 90%; display: flex; margin: 24upx auto 0; justify-content: space-betwee; height: 98upx; border-radius: 8upx; line-height: 98upx; border-bottom: 1upx solid #f1f1f1; } .pict_fal { width: 38upx; height: 38upx; position: absolute; top: 161upx; right: 9%; } .fal_pic { width: 38upx; height: 38upx; } .input_lab{ width: 87%; font-family: UICTFontTextStyleBody; font-size: 74upx; height: 74upx; /* line-height:74upx; *//* padding:8upx 0; */ min-height: 83upx; line-height: normal; box-sizing: border-box; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; vertical-align: middl; font-weight: bold }
</style>
