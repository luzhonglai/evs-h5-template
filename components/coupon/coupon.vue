
<template>
	<view>
        <!-- 新手大礼包 -->
        <view :class="['msk', (!user_is_new || isClosed)?'hide':'']" @tap="cancel">
            <view class="msk_box" url="../receivecontent/receivecontent" @tap="innertouch">
                <image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/Package.png" style='width:100%'></image>
                <view class="msk_box_info" style='right:16%;top:40%;'><text>{{__('￥')}}</text><label>{{CouponAmount}}</label>

                </view>
                <view class="btn_receivenow" @tap="receivenow"></view>
                <view class="btn_cancel" @tap="cancel">✕</view>
            </view>
        </view>


        <view class="msk1" @tap="cancelsuccess" v-if="isShowSuccessBox">
            <view class="m-coupon-box" @tap="innertouch">
                <view :class="mskType==1?'m-coupon-box-top':'m-coupon-box-top2'"></view>
                <view class="m-coupon-box-content">
                    <scroll-view scroll-y="true" class="m-coupon-box-list">
                        <view class="m-coupon-box-item" v-for="(item, index) in coupon_rows" :key="index">
                            <view class='m-coupon-box-item-left'><label style='font-size:24rpx;margin-top:14rpx'>{{__("￥")}}</label>{{item.voucher_price || item.activity_rule.voucher_price}}
                            </view>
                            <view class='m-coupon-box-item-right'><label>{{sprintf(__('有效日期至：%s'), item.voucher_end_date || item.activity_endtime)}}</label>
                                <text>{{item.activity_name}}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="m-coupon-box-bottom"></view>
                <view class="close_msk" @tap="cancelsuccess">
                    <image style="width:50rpx;height:50rpx"
                           src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/delete.png"></image>
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

    import $ from "../../helpers/util";

    export default{
        props:{
            Coupons:{
                type:Object,
                default:{}
            },
            user_is_new:{
                type:Number,
                default:0
            },
            CouponAmount:{
                type:Number,
                default:0.00
            },
            mskType:{
                type:Number,
                default:1
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', '__']),
        data(){
            return{
                isShowSuccessBox:false,
                isClosed:false,
                coupon_rows:[]
            }
        },
        mounted() {
        },
        methods:{
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
            receivenow: function () {
                this.userReceiveCoupon()
            },
            cancel: function () {
                this.setData({isClosed: true})
            },
            cancelsuccess: function () {
                this.setData({isShowSuccessBox: false})
            },
            innertouch: function () {
            },
            userReceiveCoupon: function () {
                let that = this;
                var params = {
                    CouponIds: "",
                    user_is_new: this.userInfo.user_is_new
                };


                this.forceUserInfo((user) => {
                    if (user) {
                        $.request({
                            url: this.Config.URL.user.receive_new_gift,
                            data: params,
                            success: function(data, status, msg, code) {
                                if (200 == status) {
                                    $.alert(that.__("领取成功!"));

                                    that.login({user_is_new:0});

                                    that.setData({isShowSuccessBox: true, coupon_rows: data.items})
                                } else {
                                    $.alert(msg);
                                }
                            },
                        });
                    }
                });

            }
        }
    }
</script>

<style scoped>
    .video{
        width: 750rpx;
    }

    .top{
        position: absolute;
        top:0;
        background-image: linear-gradient(to top , rgba(0,0,0,0) , rgba(0,0,0,0.7));
        width: 750rpx;
        height: 300rpx;
    }
    .bottom{
        position: absolute;
        bottom: 0;
        background-image: linear-gradient(to top , rgba(0,0,0,0.7) , rgba(0,0,0,0));
        width: 750rpx;
        height: 300rpx;
    }
    .progressBar{
        border-radius: 2upx;
        height: 4upx;
        background-color: #FFFFFF;
        z-index: 999999;
        position: absolute;
        bottom: 40upx;
    //#ifndef APP-PLUS-NVUE
    animation: flicker 4s linear infinite;
        animation-direction:alternate;
    //#endif
    }
    //#ifndef APP-PLUS-NVUE
    @keyframes flicker {
        0% { box-shadow:0 0 0 #FFFFFF; }
        /** 暂停效果 */
        10% { box-shadow:0 0 2upx #FFFFFF; }
        50% { box-shadow:0 0 10upx #FFFFFF; }
        60% { box-shadow:0 0 12upx #FFFFFF; }
        90% { box-shadow:0 0 18upx #FFFFFF; }
        100% { box-shadow:0 0 20upx #FFFFFF; }

    }
    //#endif
</style>

