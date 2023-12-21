<template>
    <view>
        <view class="sstouch-main-layout" v-if="loadComplete">
            <block>
                <h3 class="sstouch-default-list-tit">{{__('我的退款申请')}}</h3>
                <ul class="sstouch-default-list">
                    <view>
                        <h4>{{__('退款编号')}}</h4>
                        <label class="num">{{return_data.return_id}}</label>
                    </view>
                    <view>
                        <h4>{{__('申请时间')}}</h4>
                        <label class="num">{{return_data.return_add_time}}</label>
                    </view>
                    <view>
                        <h4>{{__('退款原因')}}</h4>
                        <label class="num">{{return_data.return_buyer_message}}</label>
                    </view>
                    <view>
                        <h4>{{__('申请金额')}}</h4>
                        <label class="num">{{sprintf(__('￥%s'), return_data.submit_return_refund_amount)}}</label>
                    </view>
                    <view>
                        <h4>{{__('退款金额')}}</h4>
                        <label class="num">{{sprintf(__('￥%s'), return_data.return_refund_amount)}}</label>
                    </view>
					<view>
					    <h4>{{__('联系方式')}}</h4>
					    <label class="num">{{return_data.return_tel}}</label>
					</view>
                    <view v-if="false">
                        <h4>{{__('备注')}}</h4>
                        <label class="num">{{return_data.return_buyer_message}}</label>
                    </view>
                    <view>
                        <h4>{{__('退款商品明细')}}</h4>
                        <ul class="items">
                            <view class="mt10" v-for="(item, index) in return_data.items"  :key="index">
                                <div class="sstouch-order-item">
                                    <div class="sstouch-order-item-con">
                                        <div class="goods-block">
                                            <navigator :url="sprintf('/pages/product/detail?pid=%s', item.item_id)">
                                                <div class="goods-pic">
                                                    <image :src="item.order_item_image"/>
                                                </div>
                                                <dl class="goods-info" style="margin-right: auto;">
                                                    <dt class="goods-name">{{item.item_name}} x {{ item.return_item_num }}</dt>
                                                    <dd class="goods-type">{{item.spec_info}}</dd>
                                                </dl>
                                                <div class="store-totle">
                                                    <label class="refund-sum">{{__('退款金额：')}}<em>{{__('￥')}}{{item.return_item_subtotal}}</em></label>
                                                </div>
                                           
                                            </navigator >
												<view v-if="item.return_item_image && item.return_item_image.length>0">
												    <label class="pics" style="float:left;">
												        <h5>{{__('上传凭证')}}</h5>
												        <image style="width:120upx;height: 120upx;padding:0 10upx;" :src="img_src" v-for="(img_src, ii) in item.return_item_image"  :key="ii"  :data-index="index" :data-img="img_src" @click="previewImg"  />
												    </label>
												</view>
                                        </div>
                                    </div>
                                </div>
                            </view>
                        </ul>
                    </view>

                    <view v-if="false && return_data.return_is_paid == 0 && return_data.return_state_id != StateCode.RETURN_PROCESS_FINISH && return_data.return_state_id != StateCode.RETURN_PROCESS_REFUSED && return_data.return_state_id != StateCode.RETURN_PROCESS_CANCEL">
                        <navigator href="javascript:void(0);" :data-return_id="return_id" class="btn-l confirm-refund" @click="confirm">{{__('确认收款')}}<em></em></navigator >
                    </view>
                    <navigator v-if="return_data.return_state_id == StateCode.RETURN_PROCESS_CHECK && return_data.return_is_paid == 0" href="javascript:void(0);" :data-return_id="return_id" class="btn-l cancel-return" @click="cancel">{{__('取消退单')}}</navigator >
                    <navigator v-if="false && return_data.return_state_id == StateCode.RETURN_PROCESS_REFUSED && return_data.return_is_paid == 0" href="javascript:void(0);" :data-return_id="return_id" class="btn-l cancel-return" @click="cancel">{{__('再次申请')}}</navigator >
                </ul>
                <h3 class="sstouch-default-list-tit">{{__('商家退款处理')}}</h3>
                <ul class="sstouch-default-list">
                    <view>
                        <h4>{{__('审核状态')}}</h4>
                        <label class="num">{{ return_data.return_state_name}}</label>
                    </view>
                    <view :class="(return_data.return_state_id == StateCode.RETURN_PROCESS_SUBMIT || return_data.return_state_id == StateCode.RETURN_PROCESS_CHECK) ? 'hide' : ''">
                        <h4>{{__('是否退货')}}</h4>
                        <block v-if="(return_data.return_flag == 1)">
                        	<label class="num">{{ __("退货") }}</label>
                        </block>
                        <block v-else-if="(return_data.return_flag == 2)">
                        	<label class="num">{{__("取消订单")}}</label>
                        </block>
                        <block v-else>
                        	<label class="num">{{__("不退货")}}</label>
                        </block>
					
                    </view>
					<view :class="((return_data.return_state_id== StateCode.RETURN_PROCESS_SUBMIT || return_data.return_state_id== StateCode.RETURN_PROCESS_CHECK) && return_data.return_flag) ? 'hide' : ''">
					    <h4>{{__('退货地址')}}</h4>
					    <label class="num">{{return_data.return_addr}}    {{return_data.return_mobile == 0?'':return_data.return_mobile}}</label>
					</view>
					<view :class="(return_data.return_state_id== StateCode.RETURN_PROCESS_SUBMIT || return_data.return_state_id== StateCode.RETURN_PROCESS_CHECK) ? 'hide' : ''">
					    <h4>{{__('联系人')}}</h4>
					    <label class="num">{{return_data.return_contact_name}}</label>
					</view>
                    <view :class="(return_data.return_state_id== StateCode.RETURN_PROCESS_SUBMIT || return_data.return_state_id== StateCode.RETURN_PROCESS_CHECK) ? 'hide' : ''">
                        <h4>{{__('商家备注')}}</h4>
                        <label class="num">{{return_data.return_store_message}}</label>
                    </view>
					<block v-if="(return_data.return_state_id == StateCode.RETURN_PROCESS_RECEIVED && return_data.return_flag == 1) || return_data.contract_type_ids">
						<view :class="(return_data.return_tracking_name && return_data.return_tracking_number) ? 'hide' : ''">
						    <view class="m-cell">
						    	 <h4>{{__('退货单物流名称')}}</h4>
						    	<input class="u-input" type="text" style="width:60%;float:right;" :value="logistics_name" :placeholder="__('请输入退货单物流名称')" @input="inputlogistics_name" />
						    </view>
						    <view class="m-cell">
						    	 <h4>{{__('退货单物流单号')}}</h4>
						    	<input class="u-input" type="text" style="width:60%;float:right;" :value="logistics_num" :placeholder="__('请输入退货单物流单号')" @input="inputlogistics_num" />
						    </view>
							
							 <navigator href="javascript:void(0);" :data-return_id="return_id" class="btn-l confirm-refund" @click="confirmLogistics">{{__('确认提交')}}<em></em></navigator >
						</view>
					</block>
					
					<view :class="(return_data.return_tracking_name && return_data.return_tracking_number) ? '' : 'hide'">
					    <view class="m-cell">
					    	 <h4>{{__('退货单物流名称')}}</h4>
					    	<label class="num">{{return_data.return_tracking_name}}</label>
					    </view>
					    <view class="m-cell">
					    	 <h4>{{__('退货单物流单号')}}</h4>
					    	<label class="num">{{return_data.return_tracking_number}}</label>
					    </view>
					</view>
                </ul>

                <view v-if="return_data.plantform_return_state_id != StateCode.PLANTFORM_RETURN_STATE_WAITING">
                    <h3 class="sstouch-default-list-tit">{{__('商城退款审核')}}</h3>
                    <ul class="sstouch-default-list">
                        <view>
                            <h4>{{__('平台确认')}}</h4>
                            <label class="num" v-if="return_data.plantform_return_state_id == StateCode.PLANTFORM_RETURN_STATE_WAITING">{{__('待处理')}}</label>
                            <label class="num" v-if="return_data.plantform_return_state_id == StateCode.PLANTFORM_RETURN_STATE_AGREE">{{__('处理中')}}</label>
                            <label class="num" v-if="return_data.plantform_return_state_id == StateCode.PLANTFORM_RETURN_PROCESS_FINISH">{{__('已完成')}}</label>
                        </view>
                        <view>
                            <h4>{{__('平台备注')}}</h4>
                            <label class="num">{{return_data.return_platform_message}}</label></view>
                    </ul>
                </view>
            </block>

            <view v-if="return_data.detail_array">
                <h3 class="sstouch-default-list-tit">{{__('退款详细')}}</h3>
                <ul class="sstouch-default-list">
                    <view>
                        <h4>{{__('支付方式')}}</h4>
                        <label class="num">{{return_data.detail_array.refund_code}}</label></view>
                    <view>
                        <h4>{{__('在线退款金额')}}</h4>
                        <label class="num">{{return_data.detail_array.pay_amount}}</label></view>
                    <view>
                        <h4>{{__('账户余额返还金额')}}</h4>
                        <label class="num">{{return_data.detail_array.pd_amount}}</label></view>
                    <view>
                        <h4>{{__('充值卡返还金额')}}</h4>
                        <label class="num">{{return_data.detail_array.rcb_amount}}</label></view>
                </ul>
            </view>

        </view>
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
				return_data: {
                    "return_id": "",
                    "service_type_id": 2,
                    "order_id": "",
                    "return_refund_amount": 1,
                    "store_id": 1001,
                    "buyer_user_id": 10001,
                    "return_add_time": "2019-06-14 15:26:26",
                    "return_year": 0,
                    "return_month": 0,
                    "return_day": 0,
                    "return_reason_id": 0,
                    "return_buyer_message": "",
                    "return_addr_contacter": "",
                    "return_tel": "",
                    "return_addr": "",
                    "return_post_code": 0,
                    "express_id": 0,
                    "return_tracking_number": "",
                    "plantform_return_state_id": 3180,
                    "return_state_id": 3105,
                    "return_is_paid": 0,
                    "return_flag": 1,
                    "return_type": 1,
                    "return_order_lock": 1,
                    "return_item_state_id": 2030,
                    "return_store_time": "0000-00-00 00:00:00",
                    "return_store_message": "",
                    "return_commision_fee": 0,
                    "return_finish_time": "0000-00-00 00:00:00",
                    "return_platform_message": "",
                    "return_is_settlemented": 0,
                    "return_settlement_time": 0,
                    "id": "FX-20190614-00062",
                    "buyer_user_name": " ",
                    "submit_return_refund_amount": 1,
                    "order_item_ids": {
                    },
                    "return_reason_name": null,
                    "items": [],
                    "return_state_name": "",
                    "plantform_return_state_name": ""
                },
				return_id: '',
				logistics_name: '',
				logistics_num: '',
				logistics_name: '',
				loadComplete: !1,
				showPlantform: !1
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('退货详情')
            });

			var that = this;

			that.setData({
				return_id: options.return_id
			})

			that.getReturn(options);
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			/*
			 * 读取商品数据
			 */
			getReturn: function(options) {

				var that = this;
				let params = {return_id: that.return_id}


				that.$.request({
					url: this.Config.URL.user.return_get,
					data: params,
					success: function(data, status, msg, code) {

						that.setData({
							return_data: data,
							logistics_name: data.return_tracking_name,
							logistics_num: data.return_tracking_number,
							loadComplete: !0,
							showPlantform: data.plantform_return_state_id != that.StateCode.PLANTFORM_RETURN_STATE_WAITING
						})
					}
				});
			},
            confirm:function () {
                let that = this;

                that.$.request({
                    url: this.Config.URL.user.return_confirm_refund,
                    data: {return_id:that.return_id},
                    success: function(data, status, msg, code) {
                        that.$.gopage("/member/member/returnlist");
                    }
                });
            },
            cancel:function () {
			    let that = this;

                that.$.request({
                    url: this.Config.URL.user.return_cancel,
                    data: {return_id:that.return_id},
                    success: function(data, status, msg, code) {
                        that.$.gopage("/member/member/returnlist");
                    }
                });
            },
			
			inputlogistics_name: function(e) {
				this.setData({
					logistics_name: e.detail.value
				})
			},
			
			inputlogistics_num: function(e) {
				this.setData({
					logistics_num: e.detail.value
				})
			},
			
			previewImg: function(e) {
				var that = this,
					n = [];
					
				var index = e.target.dataset.index;
				
					n = this.return_data.items[index].return_item_image;
				
			
				var i = e.target.dataset.src;
			
				that.$.previewImage({
					current: i,
					urls: n
				})
			},
			
			confirmLogistics: function() {
				let that = this;
				
				if(!that.logistics_name)
				{
					that.$.alert(that.__('请输入物流名称'))
					return;
				}
				
				if(!that.logistics_num)
				{
					that.$.alert(that.__('请输入物流单号'))
					return;
				}
				var params = {
					return_id:that.return_id,
					logistics_num: that.logistics_num,
					logistics_name: that.logistics_name,
				}
				that.$.request({
				    url: this.Config.URL.user.return_tracking,
				    data: params,
				    success: function(data, status, msg, code) {
						if(status == 200)
						{
							that.return_data.return_tracking_name = that.logistics_name,
							that.return_data.return_tracking_number = that.logistics_num,
					
							that.$.alert(that.__('操作成功'))
						}
						else
						{
							that.$.alert(that.__('操作失败'))
						}
				    }
				});
			}
		}
	}
</script>

<style lang="scss">

	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";

	.u-loadmore
	{
		width: 100%;
	}

	.m-orderlist {
		padding-top: 0upx;
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}
	
	.sstouch-default-list{
		padding-bottom: 22rpx;
		h4{
			float: left;
		}
	}
	

</style>
