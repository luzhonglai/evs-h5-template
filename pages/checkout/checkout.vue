<template>
	<view style="overflow-x: hidden;">
		<view>
			<view v-if="(ud_id>0)" @click="selectAddress" class="m-addres-info m-cell-access">
				<view class="m-ad-name">
					<text>{{submitinfo.delivery_address_row.ud_name}}</text>
					<text>{{submitinfo.delivery_address_row.ud_mobile}}</text>
				</view>
				<view class="m-ad-address" v-if="(addressFlag)">
					<text>
						{{submitinfo.delivery_address_row.ud_province}}/{{submitinfo.delivery_address_row.ud_city}}/{{submitinfo.delivery_address_row.ud_county}}
						{{submitinfo.delivery_address_row.ud_address}}
					</text>
				</view>
				<view class="m-cell-ft"></view>
			</view>
			<view v-else class="m-addres-info m-cell-access" @click="selectAddress">
				<view class="m-ad-address u-null-ad" v-if="isVirtual">
					<label class="iconfont icon-shouhuodizhi"></label>{{__('你还没有收货地址,马上')}}
					<text>{{__('添加')}}</text>
				</view>
				<view class="m-ad-address u-null-ad" v-else>
					<label class="iconfont icon-shouhuodizhi"></label>{{__('你还没有个人联系信息,马上')}}
					<text>{{__('添加')}}</text>
				</view>
				<view class="m-cell-ft "></view>
			</view>
		</view>


		<block v-if="canSelfpick && !isVirtual" >
			<view class="distribution" v-if="(true)">
				<view style="width:30%">{{__('配送方式')}}</view>
				<view class="check" style="display:flex;align-items: center;width:70%;justify-content: space-around">
					<view style="display:flex;align-items: center;" v-if="(delivery)"  @click="express">
						<image v-if="(addressFlag)" style="width:32upx;height:32upx;border-radius:50%"
							src="/static/images/ziti.png" />
						<view v-else class="border"
							style="border-radius:50%;width:26upx;height:26upx;border:1px solid #db384c" />
						<view style="margin-left:10upx">{{__('物流配送')}}</view>
					</view>
					<view style="display:flex;align-items: center" v-if="(deliverys)"  @click="draw" :data-store_id="store_id">
						<image v-if="(selfpickFlag)" style="width:32upx;height:32upx;border-radius:50%"
							src="/static/images/ziti.png" />
						<view v-else class="border"
							style="border-radius:50%;width:26upx;height:26upx;border:1px solid #db384c" />
						<view style="margin-left:10upx">{{__('门店自提')}}</view>
					</view>
					<view style="display:flex;align-items: center" v-if="false" @click="serve" :data-store_id="store_id">
						<image v-if="(storeServeFlag)" style="width:32upx;height:32upx;border-radius:50%"
							src="/static/images/ziti.png" />
						<view v-else class="border"
							style="border-radius:50%;width:26upx;height:26upx;border:1px solid #db384c" />
						<view style="margin-left:10upx">{{__('到店服务')}}</view>
					</view>
				</view>
			</view>

			<!-- 自提 -->
			<block v-if="(selfpickFlag || storeServeFlag)">
				<view v-if="(selfpickFlag || storeServeFlag)" class="m-cells"
					style="background:#fff;font-size:28upx;padding:20upx 30upx">
					<picker mode="date" :value="date" :start="stdate" :end="eddate" @change="bindDateChange">
						<view class="picker" style="display:flex;justify-content: space-between">
							<view>{{__('选择自提日期:')}}</view>
							<view style="color:#717171;padding-right:40upx">{{date||starttime}}</view>
						</view>
					</picker>
				</view>

				<navigator v-if="((selfpickFlag || storeServeFlag) && chain_id)"
					:url="'/chain/chain/list?issub=1&ud_id=' + (ud_id) + '&store_id=' + (store_id) + '&item_id=' + (item_ids) + '&spid=' + (spinfo)"
					class="m-addres-info m-cell-access" style="margin-top:20upx">
					<label style="font-size:28upx;margin-left:20upx">{{__('请选择自提门店:')}}</label>
					<view class="nearbylist-item" :data-address="(ChainInfo.chain_address)"
						:data-name="(ChainInfo.chain_name)" :data-lat="(ChainInfo.chain_lat)"
						:data-lng="(ChainInfo.chain_lng)">
						<view class="item-info">
							<label class="item-name">{{ChainInfo.chain_name}}</label>
							<label v-if="(ChainInfo.chain_opening_hours&&ChainInfo.chain_close_hours)"
								style="font-size:24upx;color:#717171;margin-left:20upx;">
								({{ChainInfo.chain_opening_hours||""}}~{{ChainInfo.chain_close_hours||""}})
							</label>
							<label class="item-distance">{{ChainInfo.distance}}</label>
							<view class="item-phone">{{__('商家电话：')}}<text v-if="ChainInfo.chain_mobile">{{ChainInfo.chain_mobile}}</text></view>
							<view class="item-address">
								<label class="iconfont icon-shouhuodizhi "
									style="font-size:40upx;margin-right:15upx;"></label>
								<label>{{ChainInfo.chain_address}}</label>
							</view>
						</view>
					</view>
				</navigator>
				<view v-if="((selfpickFlag || storeServeFlag) && false)" class="m-cells m-cells-form"
					style="margin-top:20upx;z-index:1">
					<view class="m-cell">
						<view class="m-cell-hd" style="width:20%">
							<label class="u-label">{{__('提货人')}}</label>
						</view>
						<view class="m-cell-bd">
							<input class="u-input" maxlength="20" type="text" :value="(showud_name)"
								:placeholder="__('请输入提货人姓名')" @input="inputud_name" />
						</view>
						<div v-if="(ud_name=='')" class="m-cell-ft">
							<uni-icons class="m-icon-warn" type="warn"></uni-icons>
						</div>
					</view>

					<view v-if="(selfpickFlag || storeServeFlag)" class="m-cell">
						<view class="m-cell-hd" style="width:20%">
							<label for="" class="u-label">{{__('手机号码')}}</label>
						</view>
						<view class="m-cell-bd">
							<input class="u-input" type="number" :value="(showphone)" placeholder="请输入手机号码"
								@input="inputphone" />
						</view>
						<div v-if="(!isre || phone=='')" class="m-cell-ft">
							<uni-icons class="m-icon-warn" type="warn"></uni-icons>
						</div>
					</view>
				</view>
			</block>
			<!-- 自提 -->

		</block>


		<view class="m-cells m-cells-form" v-if="(false)">
			<view class="m-cell">
				<view class="m-cell-hd" style="width: 140upx;"><label class="u-label">{{__('导购员')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="salesperson_id" :placeholder="__('请输入导购员编号')" />
				</view>
				<div v-if="(salesperson_id=='')" class="m-cell-ft">
					<uni-icons class="m-icon-warn" type="warn"></uni-icons>
				</div>
			</view>
		</view>
		<view class="m-cells m-cells-form" v-if="(false)">
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('预约人')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="(showud_name||'')" :placeholder="__('请输入预约人姓名')"
						@input="inputud_name" />
				</view>
				<div v-if="(ud_name=='')" class="m-cell-ft">
					<uni-icons class="m-icon-warn" type="warn"></uni-icons>
				</div>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label for="" class="u-label">{{__('电话号码')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="number" :value="(showphone ||'')" :placeholder="__('请输入电话号码')"
						@input="inputphone" />
				</view>
				<div v-if="(!isre || phone=='')" class="m-cell-ft">
					<uni-icons class="m-icon-warn" type="warn"></uni-icons>
				</div>
			</view>
		</view>
		<view class="m-product-all">
			<view class="m-product-list">
				<block v-for="(store_items, store_index) in submitinfo.items" :key="store_index">
					<view class="m-store" :data-id="(store_items.id)">
						<view class="m-store-c">
							<label class="m-store-info">
								<label class="iconfont icon-store"> {{store_items.store_name}}</label>
							</label>

							<span style="float: right;font-size: 10px;padding-right: 10rpx;color: #B2B2B2;"
								v-if="selfpickFlag || storeServeFlag">{{__('自提地址: ')}}
								{{store_items.store_address}}</span>
						</view>
					</view>
					<view v-for="(item, itemindex) in store_items.items" :key="itemindex" class="m-product-item"
						style="height: auto;flex-direction: column;">
						<view :class="'m-item-c ' + ((item.cart_id==0)?'del':'')" :data-id="(item.cart_id)">
							<navigator :url="'/pages/product/detail?pid=' + (item.item_id)" class="m-product-img">
								<image :src="(item.product_image)" />
							</navigator>
							<view class="m-product-info">
								<navigator :url="'/pages/product/detail?pid=' + (item.item_id)">
									<view class="m-product-name">
										<label><text v-if="(item.show_typename)"
												class="tag tag-orange">{{item.show_typename}}</text>{{item.product_name}}</label>
										<label class="m-min-name"
											style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">
											{{item.item_spec_name?item.item_spec_name:""}}
										</label>
									</view>
									<view class="m-product-price">
										<block v-if="true || item.item_unit_price>=0">
											<label>{{__('￥')}}</label>{{number_format(item.item_unit_price, 2)}}
										</block>

										<label class="pre-info-price" v-if="(item.discount_sale_money>0)">
											-{{__('￥')}}{{number_format(item.discount_sale_money, 2)}}
										</label>

										<block v-if="item.item_unit_points">
											<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label
												style="font-size:32upx">{{item.item_unit_points}}</label><label>{{__('积分')}}</label>
										</block>

										<block v-if="item.item_unit_sp">
											<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label
												style="font-size:32upx">{{item.item_unit_sp}}</label><label>{{__('众宝')}}</label>
										</block>

										<text style="float: right;padding-right: 50upx;">x{{item.cart_quantity}}</text>
									</view>
								</navigator>
							</view>
						</view>
						<!-- 模板调用单品加价购、赠品、满减 -->
						<!--
		            pulse_gift_cart
		            pulse_bargains
		            pulse_bargains_cart
		            pulse_reduction
		            -->
						<!-- pulse_gift_cart -->
						<view v-if="(item.pulse_gift_cart.length > 0)"
							v-for="(pluse, giftindex) in item.pulse_gift_cart" :key="giftindex" class="m-item-act"
							:data-id="(pluse.cart_id)">
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)"
								class="m-product-img m-act-img">
								<image :src="(pluse.product_image)" />
							</navigator>
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name"
								style="height:100upx;line-height:100upx;font-size: 28upx;">
								<label>【{{__('赠品')}}】{{pluse.product_item_name}}</label>
								<text>x{{pluse.num}}</text>
							</navigator>
						</view>

						<!-- pulse_reduction -->
						<block v-if="(item.pulse_reduction.length > 0)"
							v-for="(pluse, reductionindex) in item.pulse_reduction" :key="reductionindex">
							<view v-if="(pluse.reduceMoney > 0)" class="m-item-act">
								<view class="m-product-img  icon-activity icon-activity-reduction">
								</view>
								<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
									<label>【{{sprintf(__('满减 -￥%s'), number_format(pluse.reduceMoney, 1))}}】</label>
									<text>x{{pluse.times}}</text>
									<!--{{pluse.actName}}-->
								</view>
							</view>
						</block>


						<!-- pulse_bargains_cart -->
						<view v-if="(item.pulse_bargains_cart.length > 0)"
							v-for="(pluse, bargainsindex) in item.pulse_bargains_cart" :key="bargainsindex"
							class="m-item-act" :data-id="(pluse.cart_id)">
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)"
								class="m-product-img m-act-img">
								<image :src="(pluse.product_image)" />
							</navigator>
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name"
								style="height:100upx;line-height:100upx;font-size: 28upx;width:400upx;">
								<label>【{{__('加价购')}}】{{pluse.product_item_name}}</label>
								<text>x{{pluse.num}}</text>
							</navigator>
						</view>
					</view>


					<!-- 店铺加价购 pulse_bargains -->
					<view class="m-product-item" v-if="(store_items.bargains.length > 0)"
						v-for="(pluse, bargainsindex) in store_items.bargains" :key="bargainsindex">
						<view class="m-item-act" v-if="(pluse.length > 0 || pluse.actId)" :data-id="(pluse.cart_id)">
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)"
								class="m-product-img m-act-img">
								<image :src="(pluse.product_image)" />
							</navigator>
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name"
								style="height:100upx;line-height:100upx;font-size: 28upx;">
								<label>【{{__('加价购')}}】{{pluse.actName}}</label>
								<text>x{{pluse.num}}</text>
							</navigator>
						</view>
					</view>

					<!-- 店铺赠品 activitys.gift -->
					<view class="m-product-item" v-if="(store_items.activitys.gift.length > 0)"
						v-for="(pluse, giftindex) in store_items.activitys.gift" :key="giftindex">
						<view class="m-item-act" v-if="(pluse.length > 0 || pluse.actId)" :data-id="(pluse.cart_id)">
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)"
								class="m-product-img m-act-img">
								<image :src="(pluse.product_image)" />
							</navigator>
							<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name"
								style="height:100upx;line-height:100upx;font-size: 28upx;">
								<label>【{{__('赠品')}}】{{pluse.product_item_name}}</label>
								<text>x{{pluse.num}}</text>
							</navigator>
						</view>
					</view>

					<!-- 店铺满返优惠券 activitys.manhui -->
					<block v-if="(store_items.activitys.manhui && store_items.activitys.manhui.length > 0)">
						<view><label>【{{__('满返优惠券')}}】</label></view>
						<view class="m-product-item" v-for="(pluse, manhuiindex) in store_items.activitys.manhui"
							:key="manhuiindex" style="height: 140upx;">
							<view class="m-item-act">
								<navigator url="/activity/coupon/list" class="m-product-img m-act-img"
									style="width: 30%">
									<image style="width: 100%;" :src="(pluse.give_row.voucher_image || '')" />
								</navigator>
								<view class="act-item-name"
									style="height:100upx;line-height:100upx;font-size: 28upx;width:60%;padding: 0 30upx;">
									<label>{{pluse.give_name}} </label>
									<label v-if="!pluse.give_enable"  style="color:gray;margin-left:10rpx;">  {{__('尚未满足条件')}}</label>
								</view>
							</view>
						</view>
					</block>



					<!-- 店铺满减 activitys.reduction  -->
					<block v-if="(store_items.activitys.reduction.length > 0)"
						v-for="(pluse, reductionindex) in store_items.activitys.reduction" :key="reductionindex">
						<view class="m-product-item" v-if="(pluse.actId) && (pluse.reduceMoney > 0)">
							<view class="m-item-act" style="height: auto;" :data-id="(pluse.cart_id)">
								<view class="m-product-img  icon-activity icon-activity-reduction">
								</view>
								<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
									<label>【{{sprintf(__('满减 -￥%s'), mf(pluse.reduceMoney))}}】</label>
									<text>x{{pluse.times}}</text>
									<!--{{pluse.actName}}-->
								</view>
							</view>
						</view>
					</block>

					<block v-if="(isVirtual)">

						<view class="datetime" v-if="(product_service_date_flag)"
							style="background:#fff;border-top:1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;margin-top:20upx;padding:20upx 20upx;display:flex;font-size:30upx">
							<view class="section" style="width:60%">
								<picker mode="date" :value="(date)" :start="(stdate)" :end="(eddate)"
									@change="bindDateChange">
									<view class="picker">
										{{__('选择日期:')}} {{date}}
									</view>
								</picker>
							</view>
							<view class="section" style="width:40%">
								<picker mode="time" :value="(time)" @change="bindTimeChange">
									<view class="picker">
										{{__('选择时间:')}} {{time}}
									</view>
								</picker>
							</view>
						</view>

						<!--地图-->
						<navigator
							:url="'/chain/chain/list?issub=1&ud_id=' + ud_id + '&item_id=' + item_id + '&spid=' + spinfo + '&store_id=' + (store_id)"
							class="m-addres-info m-cell-access" style="margin-top:20upx" v-if="(chainFlag)">
							<label style="font-size:28upx;margin-left:20upx">{{__('请选择门店:')}}</label>
							<view class="nearbylist-item" :data-address="(ChainInfo.chain_address)"
								:data-name="(ChainInfo.chain_name)" :data-lat="(ChainInfo.chain_lat)"
								:data-lng="(ChainInfo.chain_lng)">
								<view class="item-info">
									<label class="item-name">{{ChainInfo.chain_name}}</label>
									<label class="item-distance">{{ChainInfo.distance}}</label>
									<view class="item-phone" v-if="ChainInfo.chain_mobile">{{__('商家电话：')}}
										<text>{{ChainInfo.chain_mobile}}</text>
									</view>
									<view class="item-address">
										<label class="iconfont icon-shouhuodizhi "
											style="font-size:40upx;margin-right:15upx;"></label>
										<label>{{ChainInfo.chain_address}}</label>
									</view>
								</view>
							</view>
						</navigator>
						<!--地图-->

						<view class="m-cells m-cells-form hide" style="margin-top:20upx;z-index:1">
							<view class="m-cell" v-if="(product_service_contactor_flag)">
								<view class="m-cell-hd" style="width:20%">
									<label class="u-label">{{__('预约人')}}</label>
								</view>
								<view class="m-cell-bd">
									<input class="u-input" maxlength="20" type="text" :value="(showud_name)"
										placeholder="请输入预约人姓名" @input="inputud_name" />
								</view>
								<div v-if="(ud_name=='')" class="m-cell-ft">
									<uni-icons class="m-icon-warn" type="warn"></uni-icons>
								</div>
							</view>

							<view class="m-cell" v-if="(product_service_contactor_flag)">
								<view class="m-cell-hd" style="width:20%">
									<label for="" class="u-label">{{__('手机号码')}}</label>
								</view>
								<view class="m-cell-bd">
									<input class="u-input" type="number" :value="(showphone)" placeholder="请输入手机号码"
										@input="inputphone" />
								</view>
								<div v-if="(!isre || phone=='')" class="m-cell-ft">
									<uni-icons class="m-icon-warn" type="warn"></uni-icons>
								</div>
							</view>
							<view class="m-cell" v-if="(true)">
								<view class="m-cell-hd" style="width:20%">
									<label for="" class="u-label">{{__('详细地址')}}</label>
								</view>
								<view class="m-cell-bd">
									<input class="u-input" maxlength="100" type="text" :value="(showdetail )"
										placeholder="请输入详细地址" @input="inputdetail" />
								</view>
								<view v-if="(detail=='')" class="m-cell-ft">
									<uni-icons class="m-icon-warn" type="warn"></uni-icons>
								</view>
							</view>
						</view>


						<view class="m-cells-title">{{__('备注')}}</view>
						<view class="m-cells m-cells-form">
							<view class="m-cell">
								<view class="m-cell-bd">
									<textarea class="u-textarea" maxlength="200" :value="(store_items.remark)"
										:data-id="(store_index)" :data-store_id="(store_items.store_id)"
										@input="inputRemark"></textarea>
									<view class="u-textarea-counter">
										<label>{{order_message_len[store_index] || 0}}</label>/200
									</view>
								</view>
							</view>
						</view>
						<view class="hint m-cell" v-if="(kind_id==1202)">
							<text>{{__('温馨提示:请您确认预约时间与地址，仔细核对手机号并保持电话畅通。下单成功后您可在“我的预约”查看订单。距离预约服务时间超过24小时您可以取消预约订单，距离预约服务时间24小时之内可以联系商家取消预约订单。')}}
							</text>
						</view>
					</block>
					<block v-else>
						<view class="m-cells-title">{{__('备注')}}</view>
						<view class="m-cells m-cells-form">
							<view class="m-cell">
								<view class="m-cell-bd">
									<textarea class="u-textarea" maxlength="200" :value="(store_items.remark)"
										:data-id="(store_index)" :data-store_id="(store_items.store_id)"
										@input="inputRemark"></textarea>
									<view class="u-textarea-counter">
										<label>{{order_message_len[store_index] || 0}}</label>/200
									</view>
								</view>
							</view>
						</view>
					</block>
					<view class="m-cells total-info">
						<view class="m-cell" @click="listInvoice" :data-id="(store_index)"
							:data-user_invoice_id="user_invoice_id" v-if="store_items.sc_is_enabled_invoice === 1">
							<view class="m-cell-bd">
								<text>{{__('发票')}}</text>
								<text class="highlight12" v-if="(invoice_header && user_invoice_id)">
									({{invoice_header}})
								</text>
								<text class="highlight12" v-else-if="(user_invoice_id == 0)">
									({{__('不需要发票')}})
								</text>
								<text class="highlight12" v-else>({{__('不需要发票')}})</text>
							</view>
							<view class="arrow m-cell-access">
								<view class="m-cell-ft "></view>
							</view>
						</view>
						<view class="m-cell">
							<view class="m-cell-bd">
								<text>{{__('商品总额')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt">
								{{__('￥')}}{{number_format(store_items.productMoneySelGoods, 2)}}
							</view>
							<view class="arrow"></view>
						</view>
						<view class="m-cell" v-if="store_items.productPointsSel">
							<view class="m-cell-bd">
								<text>{{__('积分抵扣')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt">{{store_items.productPointsSel}}{{__('积分')}}</view>
							<view class="arrow"></view>
						</view>

						<view class="m-cell" v-if="store_items.productSpSel">
							<view class="m-cell-bd">
								<text>{{__('众宝抵扣')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt">{{store_items.productSpSel}}{{__('众宝')}}</view>
							<view class="arrow"></view>
						</view>

						<view class="m-cell m-cell-parent" v-if="(store_items.activityDiscountMoney>0)">
							<view class="m-cell-bd">
								<text>{{__('活动优惠')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt">
								-{{__('￥')}}{{number_format(store_items.activityDiscountMoney,2)}}</view>
							<view class="arrow"></view>
						</view>

						<block v-if="store_items.discount_items">
							<view class="m-cell m-cell-sub" v-if="(store_items.discount_items.limited_discount>0)">
								<view class="m-cell-bd">
									<text>{{__('限时折扣')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">
									-{{__('￥')}}{{number_format(store_items.discount_items.limited_discount,2)}}
								</view>
								<view class="arrow"></view>
							</view>
							<view class="m-cell m-cell-sub" v-if="(store_items.discount_items.one_piece_discount>0)">
								<view class="m-cell-bd">
									<text>{{__('单件折')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">
									-{{__('￥')}}{{number_format(store_items.discount_items.one_piece_discount,2)}}
								</view>
								<view class="arrow"></view>
							</view>
							<view class="m-cell m-cell-sub" v-if="(store_items.discount_items.reduction>0)">
								<view class="m-cell-bd">
									<text>{{__('满减')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">
									-{{__('￥')}}{{number_format(store_items.discount_items.reduction,2)}}
								</view>
								<view class="arrow"></view>
							</view>
							<view class="m-cell m-cell-sub" v-if="(store_items.discount_items.giftbag>0)">
								<view class="m-cell-bd">
									<text>{{__('组合套餐')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">
									-{{__('￥')}}{{number_format(store_items.discount_items.giftbag,2)}}
								</view>
								<view class="arrow"></view>
							</view>
							<view class="m-cell m-cell-sub" v-if="(store_items.discount_items.multple>0)">
								<view class="m-cell-bd">
									<text>{{__('多件折')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">
									-{{__('￥')}}{{number_format(store_items.discount_items.multple,2)}}
								</view>
								<view class="arrow"></view>
							</view>
							<view class="m-cell m-cell-sub" v-if="(store_items.discount_items.reduction_again>0)">
								<view class="m-cell-bd">
									<text>{{__('折上折')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">
									-{{__('￥')}}{{number_format(store_items.discount_items.reduction_again,2)}}</view>
								<view class="arrow"></view>
							</view>
						</block>

						<!-- 提货券，初始为0，选择提货券后再修改 -->
						<view class="m-cell" @click="suitredemptionlist" :data-id="(store_index)"
							:data-redemption_id="(store_items.redemption_id)"
							v-if="(store_items.redemption_items.length>0)">
							<view class="m-cell-bd">
								<text>{{__('提货券')}}</text>
								<text class="highlight12" v-if="(store_items.redemption_items.length>0)">
									({{store_items.redemption_items.length}}{{__('张提货券可用')}})
								</text>
								<text class="highlight12" v-else>{{__('(无可用提货券)')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt"
								v-if="(store_items.redemption_use_row && store_items.redemption_use_row.redemption_price)">
								-{{__('￥')}}{{store_items.redemption_use_row.redemption_price}}
							</view>
							<view class="arrow m-cell-access">
								<view class="m-cell-ft "></view>
							</view>
						</view>
						<!-- 优惠券，初始为0，选择优惠券后再修改 -->
						<view class="m-cell" @click="suitcouponlist" :data-id="(store_index)"
							:data-user_voucher_id="(store_items.user_voucher_id)"
							v-if="(store_items.voucher_items.length>0)">
							<view class="m-cell-bd">
								<text>{{__('优惠券')}}</text>
								<text class="highlight12" v-if="(store_items.voucher_items.length>0)">
									({{store_items.voucher_items.length}}{{__('张优惠券可用')}})
								</text>
								<text class="highlight12" v-else>{{__('(无可用优惠券)')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt"
								v-if="(store_items.voucher_use_row && store_items.voucher_use_row.voucher_price)">
								-{{__('￥')}}{{store_items.voucher_use_row.voucher_price}}
							</view>
							<view class="arrow m-cell-access">
								<view class="m-cell-ft "></view>
							</view>
						</view>
						<!--会员折扣 -->
						<view class="m-cell" v-if="(store_items.policy_discount_amount>0)">
							<view class="m-cell-bd">
								<text>{{__('会员折扣')}}</text>
								<text
									style="font-size:24upx;color:#717171">{{sprintf(__('(%s折)'), store_items.policy_discountrate/10)}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt">
								-{{__('￥')}}{{number_format(store_items.policy_discount_amount,2)}}</view>
							<view class="arrow"></view>
						</view>
						<view class="m-cell">
							<view class="m-cell-bd">
								<text>{{__('运费')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt">
								+{{__('￥')}}{{number_format(store_items.freight,2) || 0}}</view>
							<view class="arrow"></view>
						</view>

						<!-- 返利 -->
						<view class="m-cell" v-if="(store_items.store_rebate>0)">
							<view class="m-cell-bd">
								<text>{{__('获得红包')}}</text>
							</view>
							<view class="m-cell-ft m-order-typetxt">{{sprintf(__('￥%.2f'), store_items.store_rebate)}}
							</view>
							<view class="arrow"></view>
						</view>

						<!-- 积分 -->
						<view class="m-cell" v-if="(0)">
							<view class="m-cell-bd">
								<text>{{__('使用积分')}}</text>
								<text style="font-size:24upx;color:#717171">{{sprintf(__('(可使用%s积分)'), 0)}}</text>
							</view>
							<input type="number" class=" m-cell-ft m-order-typetxt" :value="(integral)"
								placeholder="请输入抵扣积分" @input="count" />
							<view class="arrow"></view>
						</view>

						<!-- 积分 -->
						<view class="m-cell" v-if="(0)">
							<view class="m-cell-bd">
								{{__('积分抵现')}}
							</view>
							<view class="m-cell-ft m-order-typetxt" style="padding-right:20upx">
								-{{__('￥')}}{{number_format(discount,2)}}</view>
						</view>
						<!-- 余额抵扣 -->
						<view class="m-cell" v-if="(0)">
							<view class="m-cell-bd">
								<text>{{__('余额抵扣')}}</text>
								<text style="font-size:24upx;color:#717171">{{sprintf(__('(可使用￥%s)'), 0)}}</text>
							</view>
							<view class=" m-cell-ft m-order-typetxt" v-if="(isBalance)">
								{{__('￥')}}{{number_format(balance,2)}}
							</view>
							<switch checked @change="switchChange" style="transform:scale(0.6);" />
						</view>

						<view class="m-cell ">
							<view class="m-cell-bd">
							</view>
							<view class="m-cell-ft m-total-info">
								{{__('总金额：')}}
								<text
									class="m-total-price">{{sprintf(__('￥%.2f'), store_items.store_amount != null ? store_items.store_amount : store_items.order_money_select_items+store_items.freight)}}</text>
							</view>
						</view>
						<view v-if="(delivery_item_none_row.length > 0)">
							<block v-for="(items, i) in delivery_item_none_row" :key="i">
								{{items.product_item_name}},
							</block>
						</view>
					</view>


				</block>
			</view>
		</view>



		<view class="u-cleanbox"></view>

		<view class="m-footer-btn">
			<view class="m-footer-btn-list">
				<view class="m-footer-btn-item m-cart-total">
					<view :style="'line-height: ' + (submitinfo.orderSelFreightAmount>0 ? 40 : 40) + 'rpx;'">
						{{__('合计：')}}

						<block v-if="order_amount">
							<label>{{__('￥')}}</label>
							<text class="m-total-price">{{number_format(order_amount,2)}}</text>
						</block>


						<label v-if="submitinfo.orderSelPointsAmount" style="padding: 0 6px"> + </label>
						<text class="m-total-price"
							v-if="submitinfo.orderSelPointsAmount">{{submitinfo.orderSelPointsAmount}}</text>
						<label v-if="submitinfo.orderSelPointsAmount">{{__('积分')}}</label>


						<label v-if="submitinfo.orderSelSpAmount" style="padding: 0 6px"> + </label>
						<text class="m-total-price"
							v-if="submitinfo.orderSelSpAmount">{{submitinfo.orderSelSpAmount}}</text>
						<label v-if="submitinfo.orderSelSpAmount">{{__('众宝')}}</label>
					</view>
					<view style="line-height: 40rpx;font-size: 24rpx;">
						<block v-if="submitinfo.orderDiscountAmount>0">
							{{__('优惠')}}(<label>{{__('￥')}}{{number_format(submitinfo.orderDiscountAmount, 2)}}</label>)
							<label style="margin-right: 10upx;"></label>
						</block>

						<block v-if="submitinfo.order_rebate_amount>0">
							{{__('获得红包')}}(<label>{{__('￥')}}{{number_format(submitinfo.order_rebate_amount, 2)}}</label>)
							<label style="margin-right: 10upx;"></label>
						</block>

						<block v-if="submitinfo.orderSelFreightAmount>0">
							{{__('运费')}}(<label>{{__('￥')}}{{number_format(submitinfo.orderSelFreightAmount,2)}}</label>)
						</block>
						<block v-else>
							{{__('免运费')}}
						</block>
					</view>
				</view>
			</view>
			<view v-if="(isSubmit)" class="m-footer-btn-main u-disabled">
				{{__('正在提交....')}}
			</view>
			<block v-else>
				<view v-if="(!can_delivery && delivery_item_none_row.length > 0)">
					<button class="m-footer-btn-main" formType="submit">{{__('不可配送')}}</button>
				</view>
				<view v-else-if="(show_oos && delivery_item_none_row.length > 0)">
					<button class="m-footer-btn-main" formType="submit">{{__('暂时缺货')}}</button>
				</view>
				<form v-else-if="(!order_id)" report-submit="true" @submit="submitorder">
					<button class="m-footer-btn-main" formType="submit">{{__('提交订单')}}</button>
				</form>
				<form v-else report-submit="true" @submit="submitorder">
					<button class="m-footer-btn-main" formType="submit">{{__('去支付')}}</button>
				</form>
			</block>
		</view>

		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox" @onCancel="onCancel"
			@onPaid="onPaid" @onFail="onFail"></payment-box>
	</view>
</template>

<script>
	import paymentBox from '../../components/payment-box.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				options: {},
				AddressInfo: {},
				cartinfo: {},
				isVirtual: 0,
				ud_id: 0,
				spinfo: "",
				remark: "",
				remarkLength: 0,
				formId: "",
				submitinfo: {
					items: [],
					UserMembership: {}
				},
				user_voucher_ids: [],
				redemption_ids: [],
				order_message: {},
				order_message_len: {},
				isSubmit: !1,
				order_id: "",
				paymentData: {},
				integral: "",
				discount: 0,
				disbursements: "",
				IsUseCoupon: 1,
				canSelfpick: 0, //是否允许自提
				addressFlag: 1, // 快递配送
				storeSelfPickFlag: 0, // 店铺自提
				storeServeFlag: 0, // 到店服务
				selfpickFlag: 0, //是否自提
				chainFlag: 0,
				date: "",
				starttime: "",
				endtime: "",
				pid: "",
				ud_name: "",
				phone: "",
				stdate: "",
				eddate: "",
				time: "",
				st: "",
				et: "",
				addInfo: "",
				addInfo1: "",
				shipMethod: 0,
				physicalStoreId: "",
				item_ids: [],
				store_id: '',
				userId: '',
				chain_id: 0,
				checked_store: 0,
				item_id: '',
				activity_id: 0,
				sponsorId: 0,
				balance: 0,
				realMoney: 0,
				isBalance: !0,
				eCardCash: 0,
				extraCash: 0,
				isMembership: !0,
				isECashCard: !0,
				isCoupon: !0,
				isTmplMsg: !0,
				can_delivery: !1,
				ifcart: 1,
				cart_id: '',
				order_amount: 0,
				ChainInfo: {},
				chain_rows: [],
				transportIds: [],
				delivery:false,
				deliverys:false,
				latitude: '',
				longitude: '',

				invoice_header: '',
				invoice_type_id: 0,
				user_invoice_id: 0,
				invoice_row: {},

				urlArgs: {},
				delivery_item_none_row: [],
				show_oos: false,
				product_service_date_flag: false,
				product_service_contactor_flag: false,

				showPopupFlag: false,
				popupMsg: '',

				isFightGroup: 0,



				showud_name: '', //请输入预约人姓名
				showphone: '', //请输入电话号码
				isre: '', //请输入预约人姓名
				showdetail: '', //请输入预约详细地址
				detail: '', //
				isdata: '', //
				kind_id: 1201,
				salesperson_id: '' //销售员Id
			}
		},
		components: {
			paymentBox
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('订单提交')
			});

			var that = this;

			//只传入item_id即可，数据从服务端读取。
			this.setData({
				activity_id: options.activity_id || 0,
				urlArgs: options,
				options: options
			});

			if (options.ifcart) {
				this.setData({
					ifcart: parseInt(options.ifcart)
				})
			}

			if (options.cart_id) {
				this.setData({
					cart_id: options.cart_id
				})
			}

			if (options.checked_store) {
				this.setData({
					checked_store: options.checked_store
				})
			}

			//门店自提
			if (options.chain_id) {
				this.setData({
					chain_id: parseInt(options.chain_id),
					canSelfpick: true,
					addressFlag: false,
					selfpickFlag: true,
					storeServeFlag: false,
				})
			} else {
				let chain_id = this.$.getStorageSync('chain_id');

				//不使用默认切换门店模式
				chain_id = 0

				if (chain_id) {} else {
					chain_id = 0
				}

				this.urlArgs.chain_id = chain_id

				if (chain_id) {
					this.setData({
						chain_id: parseInt(chain_id),
						canSelfpick: true,
						addressFlag: false,
						selfpickFlag: true,
						storeServeFlag: false,
					})
				} else {}
			}
			// end 门店自提

			var n = new Date,
				s = new Date((new Date).getTime() + 2 * 24 * 60 * 60 * 1000),
				r = new Date;
			var stdate = n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate(),
				sdate = s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + (s.getDate()),
				eddate = (r.getFullYear() + 1) + "-" + (r.getMonth() + 1) + "-" + r.getDate();

			this.setData({
				stdate: stdate,
				date: sdate,
				eddate: eddate
			})

			var time = n.getHours() + ':' + n.getMinutes();

			this.setData({
				time: time,
				st: time,
				et: time
			})

			this.notice.addNotification("RefreshOrder", that.RefreshOrder, that);
			this.notice.addNotification("RefreshOrderChain", that.RefreshOrderChain, that);
			this.notice.addNotification("RefreshCoupon", that.RefreshCoupon, that);
			this.notice.addNotification("RefreshRedemption", that.RefreshRedemption, that);
			this.notice.addNotification("GotoPayCheckout", that.gotopay, that);
			this.notice.addNotification("Refreshinvoice", that.Refreshinvoice, that);

			this.forceUserInfo(function(user) {
				that.getPlantformInfo(function(plantformInfo) {
					that.setData({
						storeSelfPickFlag: plantformInfo.config.product_ziti_flag
					});

					that.getCartList();
				});
			})
			// var n = this.shopInfo.VendorFeatureSet;
			// n.indexOf("Membership") > -1 ? this.setData({isMembership: !0}) : this.setData({isMembership: !1}), n.indexOf("ECashCard") > -1 ? this.setData({isECashCard: !0}) : this.setData({isECashCard: !1}), n.indexOf("Coupon") > -1 ? this.setData({isCoupon: !0}) : this.setData({isCoupon: !1}), n.indexOf("TmplMsg") > -1 ? this.setData({isTmplMsg: !0}) : this.setData({isTmplMsg: !1})
		},
		onUnload: function() {
			//移除通知
			var that = this
			this.notice.removeNotification("RefreshOrder", that);
			this.notice.removeNotification("RefreshOrderChain", that);
			this.notice.removeNotification("RefreshCoupon", that);
			this.notice.removeNotification("RefreshRedemption", that);
			this.notice.removeNotification("GotoPayCheckout", that);
			this.notice.postNotificationName("Refreshinvoice", that);

			if (this.$refs.paymentBox.showBoxView) {
				this.$refs.paymentBox.cancel();
			}
		},
		onBackPress() {
			if (this.$refs.paymentBox.showBoxView) {
				this.$refs.paymentBox.cancel();

				return true;
			}
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),
			refreshData(options) {
				let that = this;
				this.forceUserInfo(function(user) {
					that.getCartList();
				});

			},
			inputud_name: function(e) {
				this.setData({
					ud_name: e.detail.value
				})
			},
			inputphone: function(e) {
				this.setData({
					phone: e.detail.value
				}), /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({
					isre: !0
				}) : this.setData({
					isre: !1
				})
			},
			RefreshOrder: function(e) {
				this.setData({
					ud_id: e.ud_id,
					chain_id: this.chain_id,
					spinfo: e.spid,
					addInfo1: this.addInfo
				})

				// 修正urlArgs的ud_id参数
				this.editUrlArgs('ud_id', e.ud_id);

				this.getCartList();
			},
			RefreshOrderChain: function(e) {
				//console.info(JSON.stringify(e));
				this.setData({
					ChainInfo: e.ChainInfo,
					chain_id: e.ChainInfo.chain_id
				})
				this.getCartList()
			},
			RefreshCoupon: function(options) {
				var that = this;
				var voucher_items = that.$.parseJSON(options.val);
				var user_voucher_ids = this.user_voucher_ids;

				for (var i = 0; i < voucher_items.length; i++) {
					var store_id = voucher_items[i].store_id;

					//如果当前为不使用store_id
					if (voucher_items[i].user_voucher_id == options.user_voucher_id) {
						if (!that.$.inArray(user_voucher_ids, options.user_voucher_id)) {
							user_voucher_ids.push(options.user_voucher_id)
						}
					} else {
						//删除已经存在的
						that.$.arrayRemove(user_voucher_ids, voucher_items[i].user_voucher_id);
					}
				}

				this.setData({
					user_voucher_ids: user_voucher_ids
				})


				//修改店铺代金券数据,
				//todo 未来修改为服务端操作。
				var submitinfo = that.submitinfo;
				var order_amount = submitinfo.orderSelMoneyAmount; //减去使用的代金券数据

				//循环店铺
				for (var sid = 0; sid < submitinfo.items.length; sid++) {
					//循环使用的代金券
					for (var j = 0; j < submitinfo.items[sid].voucher_items.length; j++) {
						var voucher_item = submitinfo.items[sid].voucher_items[j];
						var user_voucher_id = voucher_item.user_voucher_id;

						//初始换店铺使用代金券数据为空
						//如有发现一个，则退出本次循环。
						submitinfo.items[sid].voucher_use_row = [];
						submitinfo.items[sid].user_voucher_id = 0;

						//如果为使用中
						if (that.$.inArray(user_voucher_ids, user_voucher_id)) {
							submitinfo.items[sid].voucher_use_row = voucher_item;
							submitinfo.items[sid].user_voucher_id = user_voucher_id;

							//order_amount = order_amount - voucher_item.voucher_price;
							//submitinfo.items[sid].store_amount = submitinfo.items[sid].order_money_select_items + submitinfo.items[sid].freight - voucher_item.voucher_price;

							order_amount = parseFloat((order_amount - voucher_item.voucher_price).toFixed(12));
							order_amount = Math.max(0, order_amount)


							submitinfo.items[sid].store_amount = parseFloat((submitinfo.items[sid]
								.order_money_select_items + submitinfo.items[sid].freight - voucher_item
								.voucher_price).toFixed(12));

							submitinfo.items[sid].store_amount = Math.max(0, submitinfo.items[sid].store_amount)

							//console.info(submitinfo.items[sid].store_amount)
							break; //如有发现一个，则退出本次循环。
						}
					}
				}

				that.setData({
					submitinfo: submitinfo,
					order_amount: order_amount
				});
				//this.getCartList()
			},
			RefreshRedemption: function(options) {
				var that = this;
				var redemption_items = that.$.parseJSON(options.val);
				var redemption_ids = this.redemption_ids;

				for (var i = 0; i < redemption_items.length; i++) {
					var store_id = redemption_items[i].store_id;

					//如果当前为不使用store_id
					if (redemption_items[i].redemption_id == options.redemption_id) {
						if (!that.$.inArray(redemption_ids, options.redemption_id)) {
							redemption_ids.push(options.redemption_id)
						}
					} else {
						//删除已经存在的
						that.$.arrayRemove(redemption_ids, redemption_items[i].redemption_id);
					}
				}

				this.setData({
					redemption_ids: redemption_ids
				})

				//修改店铺代金券数据,
				//todo 未来修改为服务端操作。
				var submitinfo = that.submitinfo;
				var order_amount = submitinfo.orderSelMoneyAmount; //减去使用的代金券数据
				console.log(order_amount);
				//循环店铺
				for (var sid = 0; sid < submitinfo.items.length; sid++) {
					//循环使用的代金券
					for (var j = 0; j < submitinfo.items[sid].redemption_items.length; j++) {
						var redemption_item = submitinfo.items[sid].redemption_items[j];
						var redemption_id = redemption_item.redemption_id;
						console.log(redemption_id);
						//初始换店铺使用代金券数据为空
						//如有发现一个，则退出本次循环。
						submitinfo.items[sid].redemption_use_row = [];
						submitinfo.items[sid].redemption_id = 0;
						//如果为使用中
						if (that.$.inArray(redemption_ids, redemption_id)) {
							submitinfo.items[sid].redemption_use_row = redemption_item;
							submitinfo.items[sid].redemption_id = redemption_id;

							//order_amount = order_amount - voucher_item.voucher_price;
							//submitinfo.items[sid].store_amount = submitinfo.items[sid].order_money_select_items + submitinfo.items[sid].freight - voucher_item.voucher_price;

							order_amount = parseFloat((order_amount - redemption_item.redemption_price).toFixed(12));
							order_amount = Math.max(0, order_amount)


							submitinfo.items[sid].store_amount = parseFloat((submitinfo.items[sid]
								.order_money_select_items + submitinfo.items[sid].freight - redemption_item
								.redemption_price).toFixed(12));

							submitinfo.items[sid].store_amount = Math.max(0, submitinfo.items[sid].store_amount)

							//console.info(submitinfo.items[sid].store_amount)
							break; //如有发现一个，则退出本次循环。
						}
					}
				}
				console.log(order_amount);
				that.setData({
					submitinfo: submitinfo,
					order_amount: order_amount
				});
				//this.getCartList()
			},
			Refreshinvoice: function(options) {
				var that = this;
				that.setData({
					user_invoice_id: options.user_invoice_id,
					invoice_type_id: options.invoice_type_id,
					invoice_header: options.invoice_header,
				})
			},
			getCartList: function() {
				var that = this,
					params = this.urlArgs;

				if (that.chain_id) {
					params.chain_id = that.chain_id;
					params.if_chain = 1;
				}

				if (that.checked_store) {
					params.checked_store = that.checked_store;
				}

				//  决定配送方式
				if (that.selfpickFlag || that.storeServeFlag) {
					params.delivery_type_id = 5;
				} else if (that.addressFlag) {
					params.delivery_type_id = 10;
				}
				// params.delivery_type_id = that.selfpickFlag ? 5 : 10; //是否自提;  //DELIVERY_TYPE_SELF_PICK_UP = 5
				params.is_delivery = that.selfpickFlag ? 0 : 1; //是否自提

				that.$.request({
					url: this.Config.URL.cart.checkout,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							for(var i=0;i<=data.transportIds.length;i++){
								if(data.transportIds[i]==10){
									that.delivery=true
								}
								if(data.transportIds[i]==5){
									that.deliverys=true
								}
								
							}
							that.transportIds=data.transportIds

							var ud_id = 0;
							if (!that.$.isNull(data.delivery_address_row)) {
								ud_id = data.delivery_address_row.ud_id;
							} else {
								
							}

							//无货
							if (data.items.length == 0) {

								that.$.confirm(that.__('无符合条件的商品'), that.$.navigateBack);
							}

							if (data.if_virtual) {
								var item_row = data.items[0].items[0];

								that.setData({
									item_ids: [item_row.item_id]
								});

								that.drawSelf(item_row.store_id);
								that.setData({
									kind_id: item_row.kind_id,
									isVirtual: data.if_virtual,
									product_service_date_flag: item_row.product_service_date_flag,
									product_service_contactor_flag: item_row
										.product_service_contactor_flag,
									ud_id: ud_id,
									store_id: item_row.store_id,
									chainFlag: item_row.product_valid_type == 1002 ? false : true,
									addressFlag: item_row.product_valid_type == 1002 ? true :
										false,
									submitinfo: data,
									chain_id: that.chain_id
								});
							} else {
								var item_row = data.items[0].items[0];

								if (that.chain_id) {
									that.drawSelf(item_row.store_id);
								}

								that.setData({
									store_id: item_row.store_id,
									isVirtual: data.if_virtual,
									product_service_date_flag: 1,
									product_service_contactor_flag: 1,
									ud_id: ud_id,
									submitinfo: data,
									chain_id: that.chain_id
								});

							}


							that.setData({
								order_amount: data.orderSelMoneyAmount
							});

							//地址信息监测
							if (ud_id > 0) {
								//that.checkDelivery(ud_id);
							}

							if (that.user_voucher_id > 0) {
								that.useVoucher(that.user_voucher_id);
							}

							//判断线上线下店铺
							for (let i = 0; i < data.items.length; i++) {
								if (1 == data.items[i]['store_o2o_flag']) {
									//判断显现店铺门店自提
									that.storeSelfPickFlag = true;

									if (that.storeSelfPickFlag) {
										that.setData({
											canSelfpick: true,
											deliverys: true
										})
									}
								}
							}

						} else {
							that.$.confirm(msg, that.$.navigateBack);
						}
					},
					fail: function(err, ms) {
						//console.info(err);

						that.$.confirm(err);
					}
				});
			},
			hidePopup: function(e) {
				//console.info(e);
				this.setData({
					showPopupFlag: false
				});
			},
			checkDelivery: function(ud_id) {
				var that = this;
				var params = that.urlArgs;
				params.ud_id = ud_id;
				that.spid ? params.cart_id = that.spid : '';

				that.$.request({
					url: this.Config.URL.cart.checkDelivery,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							if (data.need_edit == 1) {
								// 该地址信息不完整
								that.$.alert("该收货地址不完整，请重新选择！");
							} else {
								that.setData({
									submitinfo: data,
								});

								that.setData({
									can_delivery: data.can_delivery,
									show_oos: data.show_oos,
									delivery_item_none_row: data.items.delivery_item_none_row,
								});

								// 修正urlArgs的ud_id参数
								that.editUrlArgs('ud_id', ud_id);
							}

						}
					}
				});
			},
			useVoucher: function(user_voucher_id) {
				var that = this;
				var params = {
					user_voucher_id: user_voucher_id,
					store_id: that.store_id,
					voucher_type: 'voucher'
				};
				that.spid ? params.cart_id = that.spid : '';
				that.$.request({
					url: this.Config.URL.user.voucher_used,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							var submitinfo = that.submitinfo;

							submitinfo.total_voucher_price = data.items[0].voucher_price;
							submitinfo.user_voucher_id = data.items[0].user_voucher_id;

							var total_voucher_price = submitinfo.total_voucher_price ? submitinfo
								.total_voucher_price : 0;
							var order_money_select_items = submitinfo.order_money_select_items ? submitinfo
								.order_money_select_items : 0;
							var freight = submitinfo.freight ? submitinfo.freight : 0;
							var activityDiscountMoney = submitinfo.activityDiscountMoney ? submitinfo
								.activityDiscountMoney : 0;

							submitinfo.orderSelMoneyAmount = parseFloat((order_money_select_items +
								freight - total_voucher_price - activityDiscountMoney).toFixed(12));
							submitinfo.orderSelMoneyAmount = Math.max(0, submitinfo.orderSelMoneyAmount)


							that.setData({
								submitinfo: submitinfo,
							});
							// 修正urlArgs
							that.editUrlArgs('user_voucher_id', data.items[0].user_voucher_id);
						}
					}
				});
			},
			count: function(e) {
				let that = this;
				this.setData({
						integral: e.detail.value
					}), e.detail.value == 0 && this.setData({
						integral: ""
					}), parseInt(e.detail.value) > parseInt(this.submitinfo.UserMembership.UsablePoint) ? (this
						.setData({
							integral: "",
							discount: 0,
							disbursements: this.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice
						}), that.$.showModal({
							title: "提示",
							content: "请输入正确积分额度"
						})) : this.setData({
						discount: (this.integral / this.submitinfo.UserMembership.PointAsCashRate).toFixed(2),
						disbursements: (this.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice - this.integral /
							this.submitinfo
							.UserMembership.PointAsCashRate).toFixed(2)
					}), this.disbursements < 0 && this.setData({
						disbursements: 0
					}), (this.integral / this.submitinfo.UserMembership.PointAsCashRate).toFixed(2) > this.submitinfo
					.ShoppingCartHeaderInfo
					.ActualPayPrice && this.setData({
						discount: this.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice
					}), this.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash >= this.disbursements ? this.setData({
						balance: this.disbursements,
						realMoney: 0
					}) : this.setData({
						balance: this.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash,
						realMoney: (this.disbursements - this.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash)
							.toFixed(2)
					})
			},
			getLocalTime: function(e) {
				e = e.replace("/Date(", "").replace(")/", "");
				var t = new Date(parseInt(e));
				return t
			},
			getUrlParam: function(name, url) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [,
					""])[1].replace(/\+/g, '%20')) || null
			},
			
			submitorder: function(e) {
				let that = this;
				if (that.$.isNull(that.order_id)) {

					var params = that.urlArgs;
					
					if (that.user_voucher_ids.length == 1) {
						params.user_voucher_id = that.user_voucher_ids[0]
					}

					if (this.ud_id == 0) {
						let msg = that.__("请选择你的收货地址！")

						if (that.isVirtual) {
							msg = that.__("请选择你的个人联系信息！")
						}

						that.$.showModal({
							title: that.__("提示"),
							showCancel: !1,
							content: msg
						});
						return
					}

					if (this.isVirtual) {
						var datetime = this.date + " " + this.time,
							n = datetime.replace(/-/g, "/");
						var r = new Date;
						var i = new Date(n);
						var s = r.getTime(),
							o = i.getTime();

						if (o - s < 0) {
							that.$.showModal({
								title: "提示",
								showCancel: !1,
								content: "您选择的预约时间已不在服务预约时间范围内!"
							});
							return
						}

						if (this.product_service_date_flag)
							if (that.$.isNull(this.date) || that.$.isNull(this.time)) {
								that.$.showModal({
									title: "提示",
									showCancel: !1,
									content: "请选择预约服务日期与时间!"
								});
								return
							}

						/*
			                if (!/^1[23456789]\d{9}$/.test(this.phone) && this.product_service_contactor_flag) {
			                    that.$.showModal({title: "提示", showCancel: !1, content: "手机号有误!"});
			                    return
			                }

			                if (this.sp == 1) {
			                    if (that.$.isNull(this.ud_name) && this.product_service_contactor_flag) {
			                        that.$.showModal({title: "提示", showCancel: !1, content: "请填写预约人姓名!"});
			                        return
			                    }
			                    if (that.$.isNull(this.phone) && this.product_service_contactor_flag) {
			                        that.$.showModal({title: "提示", showCancel: !1, content: "请填写预约人手机号码!"});
			                        return
			                    }
			                } else {
			                    if (that.$.isNull(this.ud_name) && this.product_service_contactor_flag) {
			                        that.$.showModal({title: "提示", showCancel: !1, content: "请填写预约人姓名!"});
			                        return
			                    }
			                    if (that.$.isNull(this.phone) && this.product_service_contactor_flag) {
			                        that.$.showModal({title: "提示", showCancel: !1, content: "请填写预约人手机号码!"});
			                        return
			                    }
			                    if (that.$.isNull(this.detail)) {
			                        that.$.showModal({title: "提示", showCancel: !1, content: "请填写预约人服务地址!"});
			                        return
			                    }
			                }
			                */
					}
					var paymentTypeId = that.submitinfo.items[0].items[0].payment_type_id;
					params.payment_form_id = paymentTypeId;

					params.user_voucher_ids = JSON.stringify(that.user_voucher_ids);
					params.redemption_ids = JSON.stringify(that.redemption_ids);
					params.ud_id = params.ud_id || that.ud_id;
					params.ifcart = that.ifcart; // 传入cart_id时直接购买，未传时走购物车
					params.cart_id = that.cart_id;
					params.payment_type_id = that.StateCode.PAYMENT_TYPE_ONLINE;

					//  决定配送方式
					if (that.selfpickFlag || that.storeServeFlag) {
						params.delivery_type_id = 5;
					} else if (that.addressFlag) {
						params.delivery_type_id = 10;
					}
					// params.delivery_type_id = that.selfpickFlag ? 5 : 10; //是否自提;  //DELIVERY_TYPE_SELF_PICK_UP = 5
					params.delivery_time_id = 1;

					params.invoice_type_id = 1;
					params.order_invoice_title = "";

					params.order_message = JSON.stringify(that.order_message);

					params.virtual_service_date = that.date;
					params.virtual_service_time = that.date + ' ' + that.time;
					params.chain_id = that.chain_id;
					params.checked_store = that.checked_store;

					params.distributor_id = uni.getStorageSync('store_id');
					params.salesperson_id = that.salesperson_id;
					params.user_invoice_id = that.user_invoice_id;

					let source_item_id = uni.getStorageSync('source_item_id');
					params.source_item_id = source_item_id;

					params.is_delivery = that.selfpickFlag ? 0 : 1; //是否自提
					params.kind_id = that.kind_id;
					that.$.request({
						url: this.Config.URL.user.order_add,
						data: params,
						method: "POST",
						success: function(data, status, msg, code) {
							//console.info(JSON.stringify(data));
							if (200 == status) {

								//删除旧数据
								if (source_item_id) {
									let source_item_id_row = JSON.parse(source_item_id);
									for (let store_idx = 0; store_idx < data.items.length; store_idx++) {
										for (let item_idx = 0; item_idx < data.items[store_idx].items
											.length; item_idx++) {
											let order_item_id = data.items[store_idx].items[item_idx]
												.item_id;

											//完成后删除数据吧
											if (source_item_id) {
												for (var tk in source_item_id_row) {
													if (source_item_id_row[tk].u) {
														if (tk == order_item_id) {
															delete source_item_id_row[tk];
														} else {
															let time = parseInt(Date.parse(new Date()) /
																100)
															//判断是否超时
															if (time - source_item_id_row[tk].t > 86400 *
																30) {
																delete source_item_id_row[tk];
															}
														}
													} else {
														delete source_item_id_row[tk];
													}
												}


											}
										}
									}

									uni.setStorageSync('source_item_id', JSON.stringify(
										source_item_id_row));
								}

								that.setData({
									order_id: data.order_id.join(','),
								});

								if (data.gb_id) {
									that.isFightGroup = data.gb_id;
								}

								that.setData({
									'paymentData': {
										order_id: that.order_id,
										orderSelMoneyAmount: data.orderSelMoneyAmount.toFixed(2),

										user_money: data.user_money,
										user_points: data.user_points,
										user_recharge_card: that.userInfo.user_recharge_card,
										user_sp: that.userInfo.user_sp
									}
								});


								that.reloadUserResource(function(user_info) {

								});

								/*
								that.$.showToast({
								    title: "添加订单成功！"
								});
								*/
								//
								// that.gotopay();
								// 判断如果是虚拟商品
								// const item = that.submitinfo.items[0].items[0];
								// 	if(item.payment_type_id === 1){
								// 		that.$.gotopage("/member/order/detail?on=" + that.order_id)
								// 	} else {
								that.notice.postNotificationName("GotoPayCheckout")
								// }
							} else {
								/*
								setTimeout(() => {

								that.setData({
									showPopupFlag: true,
									popupMsg: msg
								});

								}, 10);
                                */
								if (data && data.hasOwnProperty('mobile_is_bind') || code == 77011) {
									that.$.confirm(msg,
										function(data) {
											if (data.confirm) {
												//绑定手机操作
												that.$.gopage("/member/member/bindphone");

											}
										},
										true);
								} else {
									that.$.confirm(msg);
								}

							}
						},
						fail: function(data, status, msg, code) {
							that.$.showToast({
								title: msg
							})
						}
					});
				} else {
					const item = that.submitinfo.items[0].items[0];
					if (item.payment_type_id === 1) {
						that.$.gotopage("/member/order/detail?on=" + that.order_id)
					} else {
						that.gotopay()
					}
					//that.gotopay()
				}
			},
			gotopay: function(e) {
				//console.info('gotopay');
				setTimeout(() => {
					this.$refs.paymentBox.show();
				}, 400)

				return true;

				var param = {
					order_id: this.order_id,
					openid: this.userInfo.openId,
					typ: 'json',
					payment_channel_code: 'wx_native',
					prepay_flag: 1
				};

				var that = this;
				this.isSubmit = !0;

				that.$.request({
					url: this.Config.URL.pay.pay,
					data: param,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$.requestPayment({
								timeStamp: data.timeStamp,
								nonceStr: data.nonceStr,
								"package": data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(n) {
									that.isTmplMsg && that.sendMessage(param.order_id, 2);
									that.returnUrl(param.order_id)
								},
								fail: function(n) {
									that.$.gotopage("/member/order/detail?on=" + param
										.order_id);
									that.isTmplMsg && that.sendMessage(param.order_id, 1)
								},
								complete: function(n) {
									if (n.errMsg == "requestPayment:cancel") {
										that.$.gotopage("/member/order/detail?on=" + param
											.order_id);

										that.isTmplMsg && that.sendMessage(param.order_id, 1);
									}
								}
							})
						} else {
							that.$.alert(msg)
						}
					},

					fail: function(err) {}
				});
			},
			inputRemark: function(e) {
				//console.info( e.detail.value);
				//console.info( e.detail.value.length);
				//console.info( e.currentTarget.dataset.id);
				//console.info( e.currentTarget.dataset.store_id);
				var submitinfo = this.submitinfo;
				submitinfo.items[e.currentTarget.dataset.id].remark = e.detail.value;
				submitinfo.items[e.currentTarget.dataset.id].remarkLength = e.detail.value.length;


				var order_message_len = this.order_message_len;
				var order_message = this.order_message;

				this.$set(this.order_message_len, e.currentTarget.dataset.id, e.detail.value.length);
				this.$set(this.order_message, e.currentTarget.dataset.store_id, e.detail.value);
				//order_message_len[e.currentTarget.dataset.id] = e.detail.value.length;
				//order_message[e.currentTarget.dataset.store_id] = e.detail.value;


				this.setData({
					order_message: order_message,
					order_message_len: order_message_len
				})

				this.setData({
					submitinfo: submitinfo
				})
			},
			sendMessage: function(e, t) {
				let that = this;
				var n = {
					api: this.Config.URL.wx.get_tpl_msg_config,
					pages: "/member/order/detail?on=" + e,
					formId: this.formId,
					WeiXinOpenId: this.userInfo.openId,
					value: {
						order_id: e,
						msg_type: t == 1 ? 'OrderSubmitMessage' : 'OrderPaySuccessWXMessage'
					}
				};

				that.$.sendTpl(n)
			},
			suitcouponlist: function(e) {
				var that = this;
				var urlArgs = that.urlArgs;
				urlArgs.user_voucher_id = parseInt(e.currentTarget.dataset.user_voucher_id); //当前选中的
				urlArgs.val = JSON.stringify(that.submitinfo.items[e.currentTarget.dataset.id].voucher_items);
				
				if (that.user_voucher_ids.length == 1) {
					urlArgs.user_voucher_id = that.user_voucher_ids[0]
				}
				
				var url = that.$.createUrl("/activity/coupon/member", urlArgs);
				that.$.navigateTo({
					url: url
				})
			},
			suitredemptionlist: function(e) {
				var that = this;
				var urlArgs = that.urlArgs;
				urlArgs.redemption_id = parseInt(e.currentTarget.dataset.redemption_id); //当前选中的
				urlArgs.val = encodeURIComponent(JSON.stringify(that.submitinfo.items[e.currentTarget.dataset.id]
					.redemption_items));
				var url = that.$.createUrl("/activity/redemption/member", urlArgs);
				that.$.navigateTo({
					url: url
				})
			},
			listInvoice: function(e) {
				var that = this;
				var urlArgs = that.urlArgs;

				urlArgs.user_invoice_id = parseInt(e.currentTarget.dataset.user_invoice_id); //当前选中的
				urlArgs.issub = 1;
				var url = that.$.createUrl("/member/invoice/list", urlArgs);
				that.$.navigateTo({
					url: url
				})
			},
			onCancel: function(e) {},
			onPaid: function(e) {
				//重新加载用户资源数据
				let that = this;

				that.reloadUserResource(function(user_info) {
					that.returnUrl(that.order_id);
				});
			},
			onFail: function(e) {
				let that = this;
				that.$.gotopage("/member/order/detail?on=" + this.order_id)
			},
			returnUrl: function(e) {
				var that = this;

				if (that.isFightGroup) {
					that.$.gotopage("/activity/fightgroup/detail?gb_id=" + that.isFightGroup + "&on=" + e);
				} else {
					// 延时100毫秒等待异步队列setPaidYes的处理
					setTimeout(function() {
					  that.$.gotopage("/member/order/detail?on=" + e + "&init_pay_flag=true");
					}, 100);
				}

				return

				if (!that.$.isNull(that.spinfo)) {
					var n = JSON.parse(that.spinfo);
					if (n.isFightGroup == 2) {
						if (n.isOwner) {
							that.$.gotopage("/activity/fightgroup/detail?on=" + e);
							return
						}
						that.$.navigateBack(1, function() {
							this.notice.postNotificationName("RefreshFG")
						});
						return
					}
					that.$.gotopage("/member/order/detail?on=" + e);
					return
				}
				that.$.gotopage("/member/order/detail?on=" + e);
				return
			},
			selectAddress: function() {
				var that = this;
				var urlArgs = that.urlArgs;
				var url = '';

				//console.info('selectAddress');

				/*
			        that.$.chooseAddress({
			            success: function (t) {
			                var params = {
			                    ud_city: t.cityName,
			                    ud_county: t.countyName,
			                    ud_province: t.provinceName,
			                    ud_address: t.detailInfo,
			                    errMsg: t.errMsg,
			                    ud_name: t.userName,
			                    nationalCode: t.nationalCode,
			                    ud_postalcode: t.postalCode,
			                    ud_mobile: t.telNumber,
			                    user_id: this.userInfo.user_id
			                };

			                that.$.request({
			                    url: that.Config.URL.user.check_wechat_address,
			                    data: params,
			                    success: function (data, status, msg, code) {
			                        //判断返回结果，直接设置
			                        if (status == 200) {
			                            if (data.ud_id > 0) {
			                                that.setData({ud_id: data.ud_id})
			                                url = "/member/address/list";
			                                urlArgs.issub = "true";
			                                urlArgs.ud_id = data.ud_id;
			                            }

			                            that.$.navigateTo({url: that.$.createUrl(url, urlArgs)});
			                        } else {
			                            that.$.alert(msg);
			                        }
			                    }
			                });
			                //that.$.xsr(that.$.makeUrl(orderapi.selectAddressInfo, params), function (t) {
			                 //   that.setData({ud_id: t.Info.id}), that.getCartList()
			                //})
			            },
			            fail: function (t) {

			                if (that.ud_id > 0) {
			                    url = "/member/address/list";
			                    urlArgs.issub = "true";
			                    urlArgs.ud_id = that.ud_id;
			                } else {
			                    url = "/member/address/manage";
			                    urlArgs.ud_id = -1;
			                    urlArgs.issub = "true";
			                }
			                that.$.navigateTo({url: that.$.createUrl(url, urlArgs)});
			            }
			        })
			        */

				if (that.ud_id > 0) {
					url = "/member/address/list";
					urlArgs.issub = "true";
					urlArgs.ud_id = that.ud_id;
				} else {
					url = "/member/address/manage";
					urlArgs.ud_id = -1;
					urlArgs.issub = "true";
				}
				that.$.navigateTo({
					url: that.$.createUrl(url, urlArgs)
				});

			},

			getNearbylist: function(store_id) {
				var that = this;
				var params = {
					store_id: store_id,
					item_id: that.item_ids.join(","),
					lat: that.latitude,
					lng: that.longitude,
					page: 1,
					rows: 10
				};
				if (that.chain_id) {
					params['chain_id'] = that.chain_id;
					params['is_chain'] = 1;
				}

				if (that.chain_rows.length <= 0) {
					//读取店铺下面的门店列表
					that.$.request({
						url: this.Config.URL.store.getNearChain,
						data: params,
						loading: false,
						dataType: 'json',
						success: function(data, status, msg, code) {
							if (!that.$.isNull(data.items) && data.items.length > 0) {

								that.setData({
									chain_rows: data.items
								})

								for (let i = 0; i < data.items.length; i++) {
									data.items[i]['distance'] = that.$.distanceFormat(data.items[i][
										'distance'
									]);

									if (that.chain_id == data.items[i].chain_id) {
										that.setData({
											chainFlag: true,
											ChainInfo: data.items[0],
											chain_id: data.items[0].chain_id,
											AddressInfo: data.items[0],
											item_id: params.item_id,
											physicalStoreId: data.items[0].Id
										})
									}
								}

								if (!that.chain_id) {
									that.setData({
										chainFlag: true,
										ChainInfo: data.items[0],
										chain_id: data.items[0].chain_id,
										AddressInfo: data.items[0],
										item_id: params.item_id,
										physicalStoreId: data.items[0].Id
									})
								}
							} else {
								that.setData({
									chainFlag: false
								})
							}


						}
					});
				}

			},
			express: function() {
				this.setData({
					addressFlag: 1,
					selfpickFlag: 0,
					storeServeFlag: 0,
					ud_name: "",
					phone: ""
				});

				this.addressFlag ? this.setData({
					shipMethod: 0
				}) : this.setData({
					shipMethod: 1
				});

				this.getCartList()
			},

			//自提操作，需要用到 - 虚拟商品暂时共用

			draw: function(e) {
				let store_id = e.currentTarget.dataset.store_id;

				this.setData({
					addressFlag: 0,
					selfpickFlag: 1,
					storeServeFlag: 0
				});

				this.drawSelf(store_id);

				this.getCartList()
			},

			serve: function(e) {
				let store_id = e.currentTarget.dataset.store_id;

				this.setData({
					addressFlag: 0,
					selfpickFlag: 0,
					storeServeFlag: 1,
				});

				this.drawSelf(store_id);

				this.getCartList()
			},

			drawSelf: function(store_id) {
				//return ;

				var that = this;

				that.$.getLocation({
					type: "wgs84",
					success: function(t) {
						that.setData({
							latitude: t.latitude,
							longitude: t.longitude
						});
						that.getNearbylist(store_id)
					},
					fail: function() {
						that.setData({
							isdata: !0
						});

						// that.$.alert("授权失败");

						that.getNearbylist(store_id)
					}
				});



				this.selfpickFlag ? this.setData({
					shipMethod: 1
				}) : this.setData({
					shipMethod: 0
				});

				//this.getCartList();
				//this.getNearbylist(store_id)
			},
			bindTimeChange: function(e) {
				this.setData({
					time: e.detail.value
				})
			},
			bindDateChange: function(e) {
				this.setData({
					date: e.detail.value,
				})
			},
			switchChange: function(e) {
				e.detail.value ? (this.setData({
					realMoney: this.realMoney,
					isBalance: !0
				})) : (this.setData({
					disbursements: this.disbursements,
					isBalance: !1
				}))
			},
			editUrlArgs: function(paramKey, paramValue) {
				var urlArgs = this.urlArgs;
				urlArgs[paramKey] = paramValue;
				this.setData({
					urlArgs: urlArgs,
				});
			}
		}
	};
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-island-type {
		background: #fff;
		padding: 30upx 20upx;

		.m-tit {
			height: 60upx;
			line-height: 60upx;
			margin-bottom: 20upx;
		}

		.m-type {
			display: flex;
			justify-content: space-around;
		}
	}

	.m-item {
		.m-imgs {
			width: 100upx;
			height: 100upx;
			border-radius: 50%;
			background: #f1e6da;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 64upx;
				height: 64upx;
			}
		}

		.m-imgs-active {
			background: #333959;
		}

		.m-name {
			margin-top: 15upx;
		}
	}

	.m-cells {
		font-size: 28upx;
	}

	.m-addres-info {
		padding: 32upx 0;
		background-color: white;
		overflow: hidden;
		position: relative;
	}

	.m-order-typetxt {
		color: $default-skin-bg;
	}

	.m-addres-info::before {
		content: "";
		position: absolute;
		width: 100%;
		height: 6upx;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAYAAADbEj6NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTZFNEY0MzZFNERFMTFFNUE1MEFGNzBDMjEwRENBN0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTZFNEY0MzdFNERFMTFFNUE1MEFGNzBDMjEwRENBN0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NkU0RjQzNEU0REUxMUU1QTUwQUY3MEMyMTBEQ0E3RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NkU0RjQzNUU0REUxMUU1QTUwQUY3MEMyMTBEQ0E3RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn/dxJgAAAEGSURBVHjaYpToP8mABlSAuAuIAxkGH1gPxGVAfIcYxRc/lpJqvhgQtwNxAhAzDTK/nwDiXCA+Q4ziP7ccSDWfB4grgLgIiDkHmd+vAXExEO8gRrGxqTdeeRYktgAQ10ADlm2Qefo8NDIOEKuBxATPBvV3DTQcBhN4BE2MK4D4Pw0SPBM0k7cAseQg8/sbIK4H4lkgb1EjwcMSPQinAXEjEIsMMk+/AOJqIF4AxP9olOADoTWbyiDz+xcg7gDiPiD+TqwmEhO8A9R8w0Hm919APBmaET8Qq4mYBA9L9BeBWGs4eJrEBG8IjXCHQeb3f9BMDqp1npOikYQEP2yasKQmeFDBDhBgALcVQI75FJrUAAAAAElFTkSuQmCC) center repeat;
		bottom: 0;
		/*border-bottom: 2px dashed #f1e6da;*/
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
		margin-top: -14upx;
		font-family: "iconfont" !important;
		text-align: center;
		line-height: 75upx;
		font-size: 60upx;
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

	.m-addres-info .m-cell-ft {
		position: absolute;
		right: 20upx;
		top: 50%;
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
		padding: 10upx 20upx;
		font-size: 24upx;
		color: #000;
	}

	.m-total-info label {
		font-size: 32upx;
		color: $default-skin-bg;
	}

	.m-footer-btn {
		height: 100upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-top: 1upx solid #d5d5d5;
		border-radius: 0;
		z-index: 100;
		bottom: constant(safe-area-inset-bottom);
		bottom: env(safe-area-inset-bottom);
	}

	.m-footer-btn-list {
		width: 70%;
		height: 100%;
		position: relative;
		float: left;
	}

	.m-footer-btn-item {
		position: relative;
		float: left;
		width: 100%;
		font-size: 24upx;
		color: #888;
		line-height: 40upx;
		padding: 15upx 0;
		box-sizing: border-box;
		height: 100%;
	}

	.m-footer-btn-main {
		width: 30%;
		height: 100%;
		float: left;
		background-color: $default-skin-bg;
		color: #fff;
		line-height: 100upx;
		font-size: 32upx;
		text-align: center;
		border-radius: 0;
	}

	.m-cart-total {
		text-align: right;
		padding-right: 20upx;
	}

	.m-cart-total text {
		font-size: 36upx;
		color: $default-skin-bg;
	}

	.m-cart-total label {
		color: $default-skin-bg;
	}

	.m-product-price text {
		font-size: 24upx;
		color: #888;
		margin-left: 8upx;
	}

	.pre-info-price {
		height: 18upx;
		font-size: 12upx;
		color: #b0b0b0;
		margin: 0 0 0 10upx;
	}


	.u-null-ad label {
		font-size: 40upx;
	}

	.u-null-ad text {
		color: $default-skin-bg;
		text-decoration: underline;
	}

	.u-disabled {
		background-color: $default-skin-bg-disabled;
	}

	.arrow {
		width: 20upx;
	}

	.coupon {
		position: relative;
		left: 12upx;
		font-weight: bold;
		font-size: 26upx;
	}

	.nearbylist-item {
		padding: 20upx 30upx;
		border-bottom: 1px solid #eee;
		background: white;
	}

	.nearbylist-item:last-child {
		border: none;
	}

	.item-info {
		position: relative;
		font-size: 28upx;
	}

	.item-name {
		display: inline-block;
		font-size: 30upx;
	}

	.item-phone {
		line-height: 45upx;
	}

	.item-distance {
		float: right;
		font-size: 26upx;
		color: #bbb;
	}

	.item-address {
		position: relative;
		font-size: 26upx;
		color: #bbb;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		margin-right: 40upx;
		line-height: 40upx
	}

	.item-info::after {
		content: " ";
		display: inline-block;
		height: 12upx;
		width: 12upx;
		border-width: 4upx 4upx 0 0;
		border-color: #ebebe7;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		top: -4upx;
		position: absolute;
		top: 72%;
		right: 4upx;
		padding: 3upx;
	}

	.distribution {
		display: flex;
		align-items: center;
		background: #fff;
		padding: 30upx 30upx;
		margin-top: 20upx;
		font-size: 28upx;
	}



	.m-product-price1 text {
		font-size: 24upx;
		color: #888;
		margin-left: 8upx;
	}

	.m-product-price {
		/*display: flex;*/
		justify-content: space-between;
		padding-right: 20upx;
	}

	.u-cart-num {
		position: absolute;
		bottom: 20upx;
		right: 20upx
	}

	.btn {
		font-size: 28upx;
		color: #333333;
		padding-left: 20upx;
		height: 80upx;
		line-height: 80upx;
		background: #ffffff;
		border-bottom: 1px solid #d5d5d5
	}

	/*mask*/
	.drawer_screen {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		background: #000;
		opacity: 0.5;
		overflow: hidden;
	}

	/*content*/
	.drawer_box {
		width: 650upx;
		overflow: hidden;
		position: fixed;
		top: 50%;
		left: 0;
		z-index: 1001;
		background: #FAFAFA;
		margin: -150px 50upx 0 50upx;
		border-radius: 3px;
	}

	.drawer_title {
		padding: 15px;
		font: 20px "microsoft yahei";
		text-align: center;
	}

	.drawer_content {
		height: 210px;
		overflow-y: scroll;
		/*超出父盒子高度可滚动*/
	}

	.btn_ok {
		padding: 10px;
		font: 20px "microsoft yahei";
		text-align: center;
		border-top: 1px solid #E8E8EA;
		color: #3CC51F;
	}

	.top {
		padding-top: 8px;
	}

	.bottom {
		padding-bottom: 8px;
	}

	.title {
		height: 30px;
		line-height: 30px;
		width: 160upx;
		text-align: center;
		display: inline-block;
		font: 300 28upx/30px "microsoft yahei";
	}

	.hint {
		padding: 40upx;
		font-size: 12px;
		color: #717171;
	}

	.hint text {
		padding-left: 20upx;
	}

	.footer {
		border-top: 2upx solid #d5d5d5;
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 100upx;
		display: flex;
		justify-content: space-between;
	}

	.footer view {
		width: 50%;
		text-align: center;
		font-size: 32upx;
		line-height: 100upx;
	}

	.footer-btn {
		width: 50%;
		background: $default-skin-bg;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		border-radius: 1upx;
		color: #fff;
	}

	.m-store-c {
		margin: 20upx 0;
	}

	.m-store-info {
		padding: 20upx;
	}


	.m-store-info label {
		font-size: 20upx;
	}

	.u-textarea {}

	.m-product-item {
		flex-direction: column;
	}

	.m-product-item:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #ebebe7;
		color: #ebebe7;
		/*transform-origin: 0 100%;*/
		transform: scaleY(0.5);
	}

	.m-item-c {
		position: relative;
		/* width: 850upx; */
		height: 212upx;
		display: flex;
	}

	.m-item-act {
		position: relative;
		width: 850upx;
		height: 100upx;
	}

	.m-act-img {
		width: 212rpx;
		height: 212rpx;

		image {
			width: 100upx;
			height: 100upx;
		}
	}

	.act-item-name {
		width: 570upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
