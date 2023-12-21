<template>
	<view class="page">
		<view class="move-area" v-if="isdata">
			<movable-view v-if="(OrderInfo.IsRedPacketIcon)" inertia class="move-img" direction="all" @click='IsShowRPK'>
				<image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/rpk_min.png"></image>
			</movable-view>

			<view class="m-cell" v-if="remain_pay_time > 0 && OrderInfo.order_is_paid  != StateCode.ORDER_PAID_STATE_YES && OrderInfo.order_state_id==StateCode.ORDER_STATE_WAIT_PAY && OrderInfo.order_payment_amount == OrderInfo.trade.trade_payment_amount">
				<view class="m-cell-bd" style="text-align: center;">
					<text>{{__('订单取消倒计时')}} <text style="color: red;padding:0 10rpx"> {{remain_pay_time_str}} </text> </text>
				</view>
			</view>

			<view class="m-cells">

				<view class="m-cell ">
					<view class="m-cell-bd">
						<text>{{sprintf(__('编号：%s'), OrderInfo.order_id)}}</text>
						<text style="font-size: 20rpx;margin-left: 6rpx;"  v-if="false">{{(OrderInfo.payment_type_id==StateCode.PAYMENT_TYPE_DELIVER   || OrderInfo.payment_type_id==StateCode.PAYMENT_TYPE_OFFLINE) ? __('货到付款') : __('在线支付')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">{{OrderInfo.order_state_name}}</view>
				</view>
				<view>
					<block v-if="(OrderInfo.if_logistics && !OrderInfo.is_virtual)" v-for="(logistics_item, i) in OrderInfo.logistics"
					 :key="i">
						<view class="m-cell">
							<view class="m-cell-bd"><text>{{sprintf(__('物流单号： %s'), logistics_item.order_tracking_number||"")}}</text></view>
						</view>
						<view class="m-cell">
							<view class="m-cell-bd"><text>{{sprintf(__('物流公司： %s'), logistics_item.logistics_name||"")}}</text></view>
						</view>
						<navigator :url="'/member/order/logistics?on=' + (OrderInfo.order_id) + '&logistics_id=' + (logistics_item.logistics_id) + '&logistics_name=' + (logistics_item.logistics_name) + '&logistics_number=' +(logistics_item.logistics_number) + '&tracking_number=' + (logistics_item.order_tracking_number) + '&stock_bill_id='+(logistics_item.stock_bill_id)"
						 class="m-cell m-cell-access ">
							<view class="m-cell-bd">{{__('查看物流')}}</view>
							<view class="m-cell-ft"></view>
						</navigator>
					</block>
					<!--厂家自送 其他配送-->
					<view v-if="(OrderInfo.LogisticsKey=='VENDOR'||OrderInfo.LogisticsKey=='OTHER')">
						<view class="m-cell">
							<view class="m-cell-bd">
								<text>{{sprintf(__('送货人：%s %s'), OrderInfo.LogisticCode, OrderInfo.Shipper)}}</text>
							</view>
						</view>
					</view>
					<view v-if="(OrderInfo.LogisticsKey=='CLIENT')">
						<view class="m-cell">
							<view class="m-cell-bd">
								<text>{{sprintf(__('提货人：%s %s'), OrderInfo.LogisticCode, OrderInfo.Shipper)}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 是否需要发货 -->
			<view class="m-addres-info" v-if="(OrderInfo.if_delivery)">
				<view class="m-ad-name">
					<text>{{OrderInfo.delivery.da_name}}</text>
					<text>{{OrderInfo.delivery.da_mobile}}</text>
				</view>
				<view class="m-ad-address">
					<text>{{OrderInfo.delivery.da_province}}/{{OrderInfo.delivery.da_city}}/{{OrderInfo.delivery.da_county}}
						{{OrderInfo.delivery.da_address}}
					</text>
				</view>
			</view>

			<view v-else class="massage" style="align-items: center;justify-content: space-between">
				<view class="massage-name">
					{{sprintf(__('预约人：%s'), OrderInfo.delivery.da_name)}}
				</view>
				<view class="massage-tel" style="margin-right:40upx">
					{{sprintf(__('电话：%s'), OrderInfo.delivery.da_mobile)}}
				</view>
			</view>

			<view class="code1" v-if="((OrderInfo.is_virtual || OrderInfo.chain_id || OrderInfo.chain_code)&&OrderInfo.order_is_paid==3013)" style="background:#fff;padding-bottom:20upx">
				<image lazy-load :src="(OrderInfo.virtual_qrcode)"  :data-src="(OrderInfo.virtual_qrcode)" style="width:375upx;height:375upx" @click="previewProductImg"></image>
				<text v-if="OrderInfo.chain_code" @click="copyVirtualCode">{{sprintf(__('服务码：%s'), OrderInfo.chain_code)}}</text>
			</view>


			<view class="m-cells total-info" v-if="(OrderInfo.delivery_type_id == 5)">
				<view class="m-cell" v-if="(OrderInfo.delivery_type_id == 5)">
					<view class="m-cell-bd">
						<text>{{__('商家电话')}}</text>
					</view>
					<view @click="call" style="display:flex">
						<image lazy-load src="/static/images/call.png" style="width:30upx;height:30upx;margin-right:10upx"></image>
						<view class="m-cell-ft m-order-typetxt" style="color:#17abe3" v-if="(OrderInfo.store_tel)"> {{OrderInfo.store_tel}}</view>
					</view>
				</view>
				<view class="m-cell" v-if="(OrderInfo.delivery_type_id == 5)" style="display:flex;flex-flow: row;justify-content: space-between;align-items: stretch">
					<view class="m-cell-bd">
						<text>{{__('商家地址')}}</text>
					</view>
					
					<view style="display:flex;float: right;">
						<view class="m-cell-ft m-order-typetxt" style="color:#17abe3"> {{OrderInfo.store_address}}</view>
					</view>
				</view>
				
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('到店日期')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">{{OrderInfo.virtual_service_date}}</view>
				</view>
			</view>


			<view class="m-cells total-info" v-if="(OrderInfo.store_o2o_flag == 1 && OrderInfo.store_latitude  && OrderInfo.store_longitude)">
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('营业时间')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">{{OrderInfo.store_opening_hours}} - {{OrderInfo.store_close_hours}}</view>
				</view>
				<view class="m-cell" style="display:flex;flex-flow: row;justify-content: space-between;align-items: stretch"  @click.stop="gotomap"  :data-address="(OrderInfo.store_address)"
								:data-name="(OrderInfo.store_name)" :data-lat="(OrderInfo.store_latitude)" :data-lng="(OrderInfo.store_longitude)">
					<view style="display:flex;float: right;width: 400rpx;">
						<view class="m-cell-ft m-order-typetxt" style="color:#17abe3;float: right;overflow: hidden;text-overflow: ellipsis;word-break: break-all;white-space: nowrap;">{{OrderInfo.store_address}}{{OrderInfo.store_address}}</view>
					</view>
					<view style="display:flex;float: right;">
						<image style="width:20upx;height:26upx;margin-top:6rpx;" src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/location.png'></image>
						<view class="m-cell-ft m-order-typetxt" style="color:#17abe3;margin-left: 4rpx;">离您 {{OrderInfo.distance}}</view>
					</view>
				</view>
			</view>

			<view class="m-product-all">
				<view class="m-product-list">
					<navigator v-for="(item, i) in OrderInfo.items"  :key="i" :url="'/pages/product/detail?is_store_flag=0&pid=' + (item.item_id)"
					 class="m-product-item">
						<view class="m-product-img">
							<image lazy-load :src="(item.order_item_image)" mode="aspectFill" />
						</view>
						<view class="m-product-info">
							<view class="m-product-name">
								<label><text v-if="(item.show_typename)" class="tag tag-orange">{{item.show_typename}}</text>{{item.product_name}}</label>
								<label class="m-min-name" style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">
									{{item.spec_info?item.spec_info:""}}
								</label>

							</view>
							<view class="m-product-price">
								<block v-if="item.order_item_unit_price">
									<label>{{__('￥')}}</label>{{item.order_item_unit_price}}
								</block>
								<label class="pre-info-price" v-if="(item.order_item_discount_amount)" style="padding: 0 30upx;">
									-{{__('￥')}}{{number_format(item.order_item_discount_amount, 2)}}
								</label>

								<block v-if="item.item_unit_points">
									<label style="margin: auto 10upx;">+</label>{{item.item_unit_points}}{{__('积分')}}
								</block>

								<block v-if="item.item_unit_sp">
									<label style="margin: auto 10upx;">+</label>{{item.item_unit_sp}}{{__('众宝')}}
								</block>

								<text style="float: right;margin-right: 60upx;">x{{item.order_item_quantity}}</text>

                                <block v-if="item.is_denyreturn == false && OrderInfo.card_kind_id != 1002">
									<navigator @click.stop :url="'/member/product/return?order_id=' + (item.order_id) + '&order_item_id=' + (item.order_item_id)" v-if="(!dist_flag && item.if_return )" class="u-link-btn hide" style="line-height:30upx;">{{__('退货')}}</navigator>
								</block>
								<navigator @click.stop :url="'/member/member/returndetail?return_id=' + (item.return_id)" v-if="(item.return_id)" class="u-link-btn hide" style="line-height:30upx;">{{__('售后详情')}}</navigator>

							</view>

						</view>
					</navigator>
				</view>	  
				<view class="link_kfu" @click="goKefu">
					<label class="iconfont icon-more"></label>
					<text class="kfu_txt">联系客服</text>
				</view>
			</view>
			<view v-if="(OrderInfo.order_message)">
				<view class="m-cells-title">{{__('备注')}}</view>
				<view class="m-cells m-cells-form">
					<view class="m-cell">
						<view class="m-cell-bd">
							{{OrderInfo.order_message}}
						</view>
					</view>
				</view>
			</view>
			<!-- 门店提货 todo -->
			<view class="m-cells total-info">
				<view class="m-cell" v-if="(OrderInfo.is_virtual && OrderInfo.chain_id)">
					<view class="m-cell-bd">
						<text>{{__('门店名称')}}</text>
					</view>
					<view style="display:flex">
						<image lazy-load src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/merchant.png" style="width:30upx;height:30upx;margin-right:10upx"></image>
						<view class="m-cell-ft m-order-typetxt" style="color:#17abe3"> {{OrderInfo.chain_name}}</view>
					</view>
				</view>
				<view class="m-cell" v-if="(OrderInfo.is_virtual)">
					<view class="m-cell-bd">
						<text style="">{{__('预约时间')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt" style="color:#000">{{OrderInfo.virtual_service_time}}</view>
				</view>
				<view class="m-cell" v-if="(OrderInfo.is_virtual && OrderInfo.chain_id)">
					<view class="m-cell-bd">
						<text>{{__('商家电话')}}</text>
					</view>
					<view @click="call" style="display:flex">
						<image lazy-load src="/static/images/call.png" style="width:30upx;height:30upx;margin-right:10upx"></image>
						<view class="m-cell-ft m-order-typetxt" style="color:#17abe3"> {{OrderInfo.chain_mobile}}</view>
					</view>
				</view>
				<view class="m-cell" v-if="(OrderInfo.is_virtual && OrderInfo.chain_id)" style="display:flex;flex-flow: column;justify-content: space-between;align-items: stretch">
					<view class="m-cell-bd">
						<text>{{__('商家地址')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt" style="color:#717171;text-align:left;margin-top:20upx">{{OrderInfo.chain_address}}</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('商品总额')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt"><text>{{__('￥')}}</text>{{OrderInfo.order_item_amount}}</view>
				</view>
				<view class="m-cell" v-if="(OrderInfo.order_discount_amount>0)">
					<view class="m-cell-bd">
						<text>{{__('活动优惠')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">-<text>{{__('￥')}}</text>{{OrderInfo.order_discount_amount}}</view>
				</view>
				<block v-if="OrderInfo.activity_json && OrderInfo.activity_json.length > 0">
					<view class="m-cell m-cell-sub" v-for="(item, i) in OrderInfo.activity_json" :key="i">
						<view class="m-cell-bd">
							<text v-if="item.type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{__('限时折扣')}}</text>
							<text v-if="item.type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{__('满减')}}</text>
							<text v-if="item.type_id == StateCode.ACTIVITY_TYPE_REDUCTION_AGAIN">{{__('折上折')}}</text>
							<text v-if="item.type_id == StateCode.ACTIVITY_TYPE_ONE_PIECE_DISCOUNT">{{__('单件折')}}</text>
							<text v-if="item.type_id == StateCode.ACTIVITY_TYPE_MULTIPLE_FOLD">{{__('多件折')}}</text>
							<text v-if="item.type_id == StateCode.ACTIVITY_TYPE_GIFTBAG">{{__('组合套餐')}}</text>
						</view>
						<view class="m-cell-ft m-order-typetxt">
							-{{__('￥')}}{{number_format(item.discount,2)}}
						</view>
						<view class="arrow"></view>
					</view>
				</block>

				<view class="m-cell" v-if="(OrderInfo.CouponDiscount>0)">
					<view class="m-cell-bd">
						<text>{{__('优惠券')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">-<text>{{__('￥')}}</text>{{OrderInfo.CouponDiscount}}</view>
				</view>

				<!-- todo 会员折扣等级 -->
				<view class="m-cell" v-if="(0 && !(OrderInfo.LevelDiscount==0))">
					<view class="m-cell-bd">
						<text>{{__('会员折扣')}}</text>
						<text style="font-size:24upx;color:#717171">{{sprintf(__('%s折'), OrderInfo.MomentMemberDiscount)}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">-<text>{{__('￥')}}</text>{{OrderInfo.LevelDiscount}}</view>
				</view>
				<!-- todo 积分抵现 -->
				<view class="m-cell" v-if="OrderInfo.order_resource_ext1">
					<view class="m-cell-bd">
						<text>{{__('积分')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">-{{OrderInfo.order_resource_ext1}} {{__('积分')}}</view>
				</view>

				<view class="m-cell" v-if="OrderInfo.order_resource_ext2">
					<view class="m-cell-bd">
						<text>{{__('众宝')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">-{{OrderInfo.order_resource_ext2}} {{__('众宝')}}</view>
				</view>


				<view class="m-cell" v-if="(0 && !(OrderInfo.PointAsCash==0))">
					<view class="m-cell-bd">
						<text>{{__('积分抵现')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">-<text>{{__('￥')}}</text>{{OrderInfo.PointAsCash}}</view>
				</view>
				<view class="m-cell" v-if="(0 && deduction>0)">
					<view class="m-cell-bd">
						<text>{{__('余额抵扣')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">-<text>{{__('￥')}}</text>{{deduction}}</view>
				</view>
				<view class="m-cell" v-if="(1 || OrderInfo.if_delivery)">
					<view class="m-cell-bd">
						<text>{{__('运费')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">+<text>{{__('￥')}}</text>{{OrderInfo.order_shipping_fee}}</view>
				</view>
				<view class="m-cell tbt">
					<view class="m-cell-bd">
					</view>
					<view class="m-cell-ft m-total-info">
						<view>
							{{__('总金额')}}：
							<label class="m-total-price"><text>{{__('￥')}}</text>{{OrderInfo.order_payment_amount}}</label>
						</view>
						<view>
							{{__('待付款')}}：
							<label class="m-total-price"><text>{{__('￥')}}</text>{{OrderInfo.trade.trade_payment_amount}}</label>
						</view>
						<view class="m-total-time">{{sprintf(__('下单时间：%s'), OrderInfo.order_time)}}</view>
					</view>
					
				</view>
				<view class='my_coupon' v-if="OrderInfo.order_state_id == 2040 && OrderInfo.card_kind_id == 1002" 
				 :data-on="(OrderInfo.order_id)" @click="writeOrder">
					<view class='my_coubut'>{{__('确认领券')}}</view>
				</view>
				<view style="height:108upx;">
				</view>
			</view>
			<view class="u-cleanbox"></view>
		</view>
		<view class="m-footer-btn" v-if="!dist_flag && isdata && (OrderInfo.if_buyer_cancel || OrderInfo.order_state_id == 2060 || OrderInfo.order_state_id == 2030 || OrderInfo.order_state_id == 2020   || OrderInfo.order_state_id == StateCode.ORDER_STATE_SHIPPED  || (OrderInfo.order_is_paid  != StateCode.ORDER_PAID_STATE_YES && OrderInfo.order_state_id!=StateCode.ORDER_STATE_CANCEL))">
			<navigator :url="'/member/product/comment?od=' + (OrderInfo.order_id)" v-if="(OrderInfo.order_buyer_evaluation_status == 0 && OrderInfo.order_state_id == 2060)"
			 class="u-link-btn">{{__('去评价')}}
			</navigator>
			<navigator :url="'/member/product/comment?od=' + (OrderInfo.order_id)" v-if="(OrderInfo.order_buyer_evaluation_status == 1 && OrderInfo.order_state_id == 2060)"
			 class="u-link-btn">{{__('查看评价')}}
			</navigator>
			<form report-submit="true" @submit="gotopay">
				<button :data-on="(OrderInfo.order_id)" v-if="(OrderInfo.order_is_paid  != StateCode.ORDER_PAID_STATE_YES && OrderInfo.order_state_id!=StateCode.ORDER_STATE_CANCEL)"
				 class="u-link-btn" formType="submit">{{__('去支付')}}
				</button>
			</form>
			<view :data-on="(OrderInfo.order_id)" v-if="(OrderInfo.if_buyer_cancel)" class="u-link-btn" @click="cancelOrder">
				{{__('取消订单')}}
			</view>
			<view :data-on="(OrderInfo.order_id)" v-if="(OrderInfo.kind_id==1201 && OrderInfo.order_state_id == StateCode.ORDER_STATE_SHIPPED)" class="u-link-btn"
			 @click="confirmReceipt">{{__('确认收货')}}</view>
		</view>

		<view v-if="false && OrderInfo.order_state_id >2010 && OrderInfo.order_state_id!=2040 && OrderInfo.order_state_id != 2070 && OrderInfo.order_refund_amount == 0 && OrderInfo.order_is_paid == StateCode.ORDER_PAID_STATE_YES" class="m-footer-btn">
			<view class="u-link-btn"
				v-if="OrderInfo.kind_id==1201"
				@click="applyCancelOrder(OrderInfo)">
				{{__('申请取消订单')}}
			</view>
		</view>
		<!--<template is="shareMskTpl" data="(PageQRCodeInfo)"/>-->
		<view class="shareRPK " v-if="(showRPK && OrderInfo.IsRedPacketIcon)" @click='IsShowRPK'>
			<view class="shareRPKBox (showRPK?'animated bounceIn':'animated bounceOut')" catchtap style='background:url(https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/rpk_box.png) no-repeat;background-size: cover;'>
				<view class="sendRPK" catchtap='shareBox'></view>
				<view class="closeRPK" catchtap='IsShowRPK'></view>
			</view>
		</view>
		<view class="m-loading-box">
			<block v-if="(!OrderInfo)">
				<view class="u-loadmore">
					<label class="u-loading"></label>
					<text class="u-loadmore-tips">{{__('正在加载')}}</text>
				</view>
				<view>
					<text></text>
				</view>
			</block>
		</view>


		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox"  @onCancel="onCancel"  @onPaid="onPaid"  @onFail="onFail"></payment-box>
	</view>
</template>

<script>

	import $ from "../../helpers/util";

    import paymentBox from '../../components/payment-box.vue'


    import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
                options:{},
				OrderInfo: {delivery:{}, distance:0},
				formId: "",
				pointAsCashMoney: "",
				discount: "",
				MemberDiscount: "",
				showRPK: !0,
				ActivityGroupId: 0,
				maxRPK: 0,
				deduction: 0,
				isdata: false,

                order_id: "",
                paymentData:{},
				dist_flag: !1,
				init_pay_flag: false,
				remain_pay_time: 0,
				remain_pay_time_str: '--:--:--',
				RemainTime: false,
				
				latitude: '',
				longitude: ''
			}
		},
        components: {
            paymentBox
        },
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('订单详情')
			});

			let that = this;

			this.setData({
                options:options,
				discount: options.discount,
				pointAsCashMoney: options.pointAsCashMoney,
				MemberDiscount: options.MemberDiscount,
				dist_flag: options.dist_flag ? true : false,
				init_pay_flag: options.init_pay_flag
			});


			/* if (that.$.isNull(this.userInfo))
			{
                that.forceUserInfo(function(user) {
                    that.InitPage(options)
                });
			}
			else
			{
                that.InitPage(options)
			} */

			this.notice.addNotification("RefreshMessage", this.RefreshMessage, this);
		},
		onShow: function() {
			this.InitPage(this.options)
		},
        onUnload: function() {
            //移除通知
            var that = this

            if (this.$refs.paymentBox.showBoxView) {
                this.$refs.paymentBox.cancel();
            }
        },
        onBackPress() {
            if (this.$refs.paymentBox.showBoxView) {
                this.$refs.paymentBox.cancel();

                return true;
            }

			var that = this
			that.notice.removeNotification("RefreshMessage", that);
        },
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			goKfu:function(e){
				let that = this;
				//先判断是否登录
				let ProductInfo=that.OrderInfo.items[0];
				this.forceUserInfo(function(user) {
					var t = e.currentTarget.dataset;
					var url = that.Config.kefu+"/im_client/?web_plugin_id=24775";
					url=url+"&product_send=true&product_title="+ProductInfo.product_name+"&product_订单号="+ProductInfo.order_id+"&product_价格="+ProductInfo.order_item_amount+"&product_image="+ProductInfo.order_item_image;
					that.$.gotopage(
						'/pagesub/webpage/webpage?u='+encodeURIComponent(url)
					);
				});
			},
			writeOrder: function(e) {
				var that = this,
					params = {
						order_id: e.currentTarget.dataset.on
					};
				that.$.confirm("确定领取券？", function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_receive,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert(that.__("领券成功！"), function() {
										that.$.gopage("/member/member/coupon-dh");
									});
								} else { 
									that.$.alert(msg);
								}
							}
						});
					}
			
				}, !0)
			},
			goKefu: function(e) {
				let that = this;
				let ProductInfo=that.OrderInfo.items[0];
			
				//先判断是否登录
				this.forceUserInfo(function(user) {
					var t = e.currentTarget.dataset;
					//that.$.gopage(t.appurl);
			
					that.$.request({
						url: that.Config.URL.user.kefu_config,
						data: {user_id: that.OrderInfo.buyer_user_id, store_id:that.OrderInfo.store_id},
						loading: false,
						success: function(rd, r_status, r_msg, code) {
							if (r_status == 200) {
								let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&order_id=%s", rd.friend_id, ProductInfo.order_id);

								that.$.gopage(chat_url);
							}
							else
							{
								that.$.alert(r_msg);
							}
						}
					});
				});
			
				return ;
			},
			
			call: function() {
				let that = this;
				that.$.makePhoneCall({
					phoneNumber: this.OrderInfo.chain_mobile + ""
				})
			},

			RefreshMessage: function(e) {
				this.InitPage(this.options)
			},

			touchstart(){
				let that = this;
				that.RemainTime=setInterval(()=>{
					//console.log(this.money);
					if(that.remain_pay_time <= 0){
						clearInterval(this.RemainTime);
					}
					that.remain_pay_time--;

					let hours = that.$.doubleNum(Math.floor(that.remain_pay_time / 60 / 60));
					let minutes= that.$.doubleNum(Math.floor(that.remain_pay_time / 60 % 60));
					let seconds= that.$.doubleNum(Math.floor(that.remain_pay_time % 60));
					that.remain_pay_time_str = hours +':' + minutes + ':' + seconds
				},1000);
			},
			touchend(){
				clearInterval(this.RemainTime);
			},

			InitPage: function(options) {
				var params = {
						user_id: this.userInfo.user_id,
						order_id: options.on
					},
					that = this;
					that.touchend();
				that.$.request({
					url: this.Config.URL.user.order_detail,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							data.order_time = that.$.datetimeFormatter(data.order_time, 'yyyy-MM-dd hh:mm:ss')
							that.setData({
								isdata: true,
								OrderInfo: data,
								deduction: 0,
								remain_pay_time: data.remain_pay_time ? data.remain_pay_time : 0
								//(e.Info[0].ECardCash + e.Info[0].ExtraCash).toFixed(2)
								// 余额折扣？
							})
							
							if (that.$.isJson(data.activity_json))
							{
									that.OrderInfo.activity_json = JSON.parse(data.activity_json);
							}
							
							if (that.RemainTime === false) {
								that.touchstart();
							}
							
							//支付跳转订单
							if (that.options.init_pay_flag)
							{
								//如果未支付
								if (data.order_is_paid != that.StateCode.ORDER_PAID_STATE_YES && data.order_state_id != that.StateCode.ORDER_STATE_CANCEL)
								{
									that.$.showModal({
										title: that.__('提示'),
										content: that.__('在线支付状态更新中'),
											showCancel: false,
											confirmText: 'Ok',
										success: res => {
											if (res.confirm) {
												let redirect_url = '/member/order/detail?on=' + options.on + '&init_pay_flag=1';
												that.$.gotopage(redirect_url);

												//window.location.href = redirect_url;
											} else if (res.cancel) {
											}
										}
									});
								}
								else
								{
									//如果拼团订单
									if (that.$.inArray(data.activity_type_id, 1123))
									{
										let redirect_url = "/activity/fightgroup/detail?gb_id=" + data.gb_id + "&on=" + data.order_id;
										that.$.gotopage(redirect_url);
									}
								}

							}
							
							
							//计算店铺距离
							
							/**
							 * 计算两个经纬度的距离(米)
							 */
							let getDistance = function(lat1, lng1, lat2, lng2) {
								var radLat1 = lat1 * Math.PI / 180.0;
								var radLat2 = lat2 * Math.PI / 180.0;
								var a = radLat1 - radLat2;
								var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI /
									180.0;
								var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a /
											2),
										2) +
									Math.cos(radLat1) * Math.cos(radLat2) *
									Math
									.pow(Math.sin(b / 2), 2)));
								s = s * 6378.137; // EARTH_RADIUS;
								s = Math.round(s * 10000) / 10;
								return s;
							}
							
							that.OrderInfo.store_o2o_flag = 1
							if (that.OrderInfo.store_o2o_flag)
							{
								that.$.getLocation({
									type: "wgs84",
									success: function(response) {
										that.setData({
											latitude: response.latitude,
											longitude: response.longitude
										});
							
										that.OrderInfo.distance = 0;
										
										let d = getDistance(that.latitude, that.longitude, that.OrderInfo.store_latitude,
											that.OrderInfo.store_longitude);
											
											console.info(that.latitude, that.longitude, that.OrderInfo.store_latitude,
											that.OrderInfo.store_longitude)
											console.info(d)
										that.OrderInfo.distance = that.$.distanceFormat(d || 0)
									},
									fail: function() {
									}
								})
							}
						}
					}
				});
				/* 红包活动分享 var t = {store_id: this.shopInfo.Id, sponsorId: this.userInfo.Id, order_id: options.on};
				that.$.xsr(that.$.makeUrl(orderapi.PrepareShareLuckyRedPacket, t), function (e) {
				    that.setData({maxRPK: e.Info.LuckyOrder, ActivityGroupId: e.Info.LuckyRedPacketActivityGroupId})
				})*/
			},
			applyCancelOrder:function(OrderInfo){
				let that=this;
				uni.navigateTo({
					url:"/pagesub/product/return?order_id=" + (OrderInfo.order_id)+"&order_state="+(OrderInfo.order_state_id)
				});
			},
			cancelOrder: function(e) {
				let that = this;
				var params = {
					order_id: e.currentTarget.dataset.on
				};
				that.$.confirm(that.__("是否取消订单"), function(e) {
						if (e.confirm) {
							that.$.request({
								url: that.Config.URL.user.order_cancel,
								data: params,
								success: function(data, status, msg, code) {
									if (200 == status) {
										that.$.alert("取消成功！", function() {
											setTimeout(function () {
												that.notice.postNotificationName("RefreshMessage", e)
											}, 1500)

                                            /*
											that.$.navigateBack(1, function() {
												var e = {};
												that.notice.postNotificationName("RefreshMessage", e)
											})
                                            */
										})
									}
								}
							});
						}
					},
					!0)
			},
			confirmReceipt: function(obj) {
				var params = {
						order_id: obj.currentTarget.dataset.on
					};

				var that = this;
				that.$.confirm(that.__("是否确认收货？"), function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_receive,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert(that.__("收货成功！"), function() {
										that.notice.postNotificationName("RefreshMessage", e)
									});
								}
							}
						});
					}

				}, !0)
			},
			gotopay: function(e) {
                var that = this;

                that.setData({
                     order_id: that.OrderInfo.order_id,
                    'paymentData': {
                        order_id: that.OrderInfo.order_id,
                        orderSelMoneyAmount: that.OrderInfo.trade.trade_payment_amount,

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
				let that = this;

                that.$.alert(that.__("支付成功！"), function() {
                    that.$refs.paymentBox.cancel();
					that.options.init_pay_flag = true;
                    that.InitPage(that.options);

                    that.notice.postNotificationName("RefreshMessage", e)
                    /*
                    that.$.navigateBack(1, function() {
                        var e = {};
						that.notice.postNotificationName("RefreshMessage", e)
                    })
                    */
                })
            },
            onFail: function(e) {
				let that = this;
                that.$.alert(that.__('支付失败！'))
                //console.log("支付失败：", e)
            },

			sendMessage: function(e) {
				let that = this;
				var t = {
					api: orderapi.OrderPaySuccessWXMessage,
					pages: "/member/order/detail?on=" + e,
					formId: this.formId,
					WeiXinOpenId: this.userInfo.openId,
					value: {
						store_id: this.shopInfo.store_id,
						order_id: e
					}
				};
				that.$.sendTpl(t)
			},
			copyVirtualCode: function() {
				uni.setClipboardData({
					data: this.OrderInfo.chain_code,
					complete() {
						uni.showToast({
							title: '已复制到剪贴板'
						});
					}
				});
			},
			onShareAppMessage: function() {
				var that = this;
				return {
					title: "拼手气红包，第" + this.maxRPK + "个领取的红包最大!",
					imageUrl: "https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/shareImg.png",
					path: "pages/redpacket/redpacket?g=" + this.ActivityGroupId + "&n=" + this.maxRPK + "&uid=" + this.userInfo.Id,
					success: function() {
						that.$.xsr1(that.$.makeUrl(orderapi.ShareCount, {
							sponsorId: this.userInfo.Id,
							audienceType: 1,
							audienceId: 0,
							ContentType: 22,
							contentId: that.ActivityGroupId
						}), function(e) {})
					}
				}
			},
			shareQRCode: function(e) {
				var that = this,
					params = {
						store_id: this.shopInfo.Id,
						sponsorId: this.userInfo.Id,
						imageUrl: "https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/shareImg.png",
						path: "pages/redpacket/redpacket?g=" + this.ActivityGroupId + "&n=" + this.maxRPK + "&uid=" + this.userInfo.Id,
						luckyOrder: this.maxRPK
					};
				//生成二维码并返回地址。 - 需要修改调整为小程序地址
				that.$.request({
					url: this.Config.URL.wx.getMiniAppQRCodeUnlimit,
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
				var that = this;
				that.$.loading(), that.$.downloadFile({
					url: this.PageQRCodeInfo.Path,
					success: function(t) {
						that.$.hideloading(), that.$.saveImageToPhotosAlbum({
							filePath: t.tempFilePath,
							success: function() {
								that.setData({
									PageQRCodeInfo: {
										Path: "",
										IsShare: !1,
										IsShareBox: !1,
										IsJT: !1
									}
								}), that.$.alert("保存图片成功！"), that.$.xsr1(that.$.makeUrl(orderapi.ShareCount, {
									sponsorId: this.userInfo.Id,
									audienceType: 3,
									audienceId: 0,
									ContentType: 22,
									contentId: that.ActivityGroupId
								}))
							},
							fail: function(e) {
								that.$.hideloading();
								that.$.alert("保存图片失败！");
							}
						})
					},
					fail: function(e) {
						that.$.hideloading()
					}
				})
			},
			showCodeImg: function() {
				let that = this;
				that.$.previewImage({
					current: this.PageQRCodeInfo.Path,
					urls: [this.PageQRCodeInfo.Path]
				})
			},
			IsShowRPK: function() {
				var e = this;
				e.showRPK ? setTimeout(function() {
						e.setData({
							showRPK: !1
						})
					},
					250) : e.setData({
					showRPK: !0
				})
			},
			previewProductImg: function(e) {
				var that = this;
				var i = e.target.dataset.src;
				let n = [];

				n.push(i);
				//console.info(i);
				//console.info(n);
				that.$.previewImage({
					current: i,
					urls: n
				})
			},
			
			gotomap: function(e) {
				var that = this;
			
				that.$.openLocation({
					latitude: parseFloat(e.currentTarget.dataset.lat),
					longitude: parseFloat(e.currentTarget.dataset.lng),
					name: e.currentTarget.dataset.name,
					address: e.currentTarget.dataset.address,
					scale: 28
				})
			},
			
		}
	};
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-cells {
		font-size: 28upx;
	}

	.link_kfu{
		text-align: center;
		background-color: #fff;
		margin-top: 20upx;
		height: 80upx;
		line-height: 80upx;
		.kfu_txt{
			margin-left: 20upx;
		}
	}

	.m-order-typetxt {
		color: $default-skin-bg;
		font-size: 28rpx;

		text{
			font-size: 24rpx;
		}
	}

	.m-total-price {
		text{
			font-size: 24rpx;
		}
	}


	.m-addres-info {
		padding: 32upx 0;
		background-color: white;
		overflow: hidden;
		position: relative;
		margin-top: 20upx;
	}

	.m-ad-name {
		display: -webkit-box;
		position: relative;
		margin-left: 40upx;
		-webkit-box-flex: 1;
		height: 20px;
		line-height: 20px;
		font-weight: 400;
		font-size: 14px;
	}

	.m-ad-name text {
		margin: 0 20upx;
	}

	.m-ad-name::after {
		content: "\e7e0";
		position: absolute;
		left: -25upx;
		width: 30upx;
		height: 30upx;
		font-family: "iconfont" !important;
		text-align: center;
		line-height: 35upx;
		font-size: 60upx;
		background-size: cover;
		top: 50%;
		margin-top: -14upx;
	}

	.m-ad-address {
		width: 650upx;
		margin-left: 20upx;
		display: -webkit-box;
		-webkit-box-flex: 1;
		line-height: 40upx;
		font-weight: 400;
		font-size: 14px;
		position: relative;
		padding-left: 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #888;
	}

	.m-product-all {
		margin-top: 20upx;
	}

	.total-info {
		margin-top: 20upx;
	}

	.m-panel-hd::after {
		border: none;
	}

	.m-total-info {
		padding: 10upx;
		font-size: 24upx;
		color: #000;
	}

	.m-total-info label {
		font-size: 32upx;
		color: $default-skin-bg;
	}

	.m-total-time {
		color: #888;
	}

	.m-footer-btn {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: right;
		box-sizing: border-box;
		padding: 30upx 20upx;

		&:before {
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid #E5E5E5;
			color: #E5E5E5;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
	}

	.u-link-btn {
		margin: 0 10upx;
		vertical-align: middle;
		display: inline-block;
		line-height: 40upx;

		font-size: 24rpx;
	}

	.m-product-price text {
		font-size: 28upx;
		color: #888;
		background-color: #fff;
	}

	.massage {
		width: 100%;
		height: 100upx;
		display: flex;
		border-bottom: 2upx solid #d9d9d9;
		background: #fff;
		font-size: 28upx;
		color: #000;
	}

	.massage-name {
		margin-left: 40upx;
	}

	.massage-tel {
		margin-left: 40upx;
	}

	.code1 {
		width: 100%;
		display: flex;
		flex-flow: column;
		align-items: center;
		align-content: space-between;
	}

	.code image {
		width: 50%;
	}

	.code text {
		font-size: 24upx;
		color: #717171;
	}

	.move-area {
		/*
		position: absolute;
		min-height: 100%;
		width: 100%;
		*/
	}

	.move-img {
		height: 126upx;
		width: 100upx;
		z-index: 5;
		margin-top: 70%;
		margin-left: 650upx;
	}

	.move-img image {
		height: 126upx;
		width: 100upx;
	}

	.shareRPK {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		top: 0;
		left: 0;
		z-index: 5;
	}

	.shareRPKBox {
		width: 640upx;
		height: 698upx;
		background-color: red;
		position: absolute;
		top: 40%;
		left: 50%;
		margin-left: -320upx;
		margin-top: -349upx;
	}

	.sendRPK {
		width: 222upx;
		height: 70upx;
		position: absolute;
		left: 50%;
		margin-left: -100upx;
		top: 50%;
		margin-top: 140upx;
	}

	.closeRPK {
		width: 50upx;
		height: 50upx;
		position: absolute;
		left: 50%;
		margin-left: -22upx;
		bottom: 25upx;
	}

	.shareCodeImg {
		height: 800upx;
	}

	.m-product-name{
		font-size: 24rpx;
	}

	.m-product-img {
		image {
			padding: 20upx;
		}
	}
	
	.my_coupon {
		height: 108rpx;
		background: #fff;
		bottom: 0;
		justify-content: center;
	}
	
	.my_coubut {
		width: 50%;
		margin: 16rpx auto;
		height: 79rpx;
		background: #DB384C;
		border-radius: 10px;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 79rpx
	}
</style>

