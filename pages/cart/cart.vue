<template>
	<view class="page">
		<status-bar></status-bar>
		<view v-if="loadComplete">
			<block v-if="isdata">
				<view class="m-product-all" style="padding-bottom: 100upx;">
					<view class="m-product-list">
						<block v-for="(store_items, storeindex) in cartlist.items" :key="storeindex">
							<view class="m-store" :data-id="(store_items.store_id)">
								<view class="m-store-c">
									<view class="m-store-ck" @click="ckStore" :data-id="(store_items.store_id)" :data-isck="(store_items.cart_select)" :data-checkable="(store_items.store_checkable)">
										<uni-icons v-if="store_items.store_checkable" :type="(store_items.cart_select?'circle-filled':'circle') " :color="(store_items.cart_select?'#DB384C':'#e3e3e3')" />
										<uni-icons v-else type="circle-filled" color="#e3e3e3" />
									</view>
									<label class="m-store-info">
										{{store_items.store_name}}
									</label>
								</view>
							</view>
							<view v-for="(item, itemindex) in store_items.items" :key="itemindex" class="m-product-item">
								<view :class="{'m-item-c':1, del:(item.cart_id==T_Id)}" @touchstart="removestart" @touchmove="removeload"
								 @touchend="removeend" :data-id="(item.cart_id)"   @longpress.stop="pressDelCart">
									<navigator :url="'/pages/product/detail?pid=' + (item.item_id)" style="font-size:28upx;line-height:2;display:block;height:100%;width:100%;">
										<view class="m-cart-ck" @click.stop="ckitem" :data-id="(item.cart_id)" :data-isck="(item.cart_select)" :data-stateid="(item.product_state_id)">
											<uni-icons v-if="(item.product_state_id == 1001)" :type="(item.cart_select?'circle-filled':'circle') " :color="(item.cart_select?'#DB384C':'#e3e3e3')" />
											<uni-icons v-else type="circle-filled" color="#e3e3e3" />
										</view>
										<view class="m-product-img">
											<image lazy-load :src="($.img(item.product_image, 200, 200))" />
										</view>
										<view class="m-product-info">
											<view class="m-product-name">
												<image v-if="(item.product_state_id != 1001)" lazy-load style="width:100upx;height:100upx;float:right" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/xiajia.png" />
												<label><text v-if="(item.show_typename)" class="tag tag-orange">{{item.show_typename}}</text>{{item.product_name}}</label>
												<label class="m-min-name" style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">{{item.item_spec_name?item.item_spec_name:""}}</label>
											</view>
											<view class="m-product-price">
												<block v-if="item.item_sale_price">
													<label>{{__('￥')}}</label> {{number_format(item.item_sale_price, 2)}} <label class="pre-info-price" v-if="(item.discount_sale_money)">-{{__('￥')}}{{number_format(item.discount_sale_money, 2)}}</label>
												</block>

												<block v-if="item.item_unit_points">
													<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.item_unit_points}}</label><label >{{__('积分')}}</label>
												</block>
												<block v-if="item.item_unit_sp">
													<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.item_unit_sp}}</label><label >{{__('众宝')}}</label>
												</block>
											</view>
											<block>
												<view class="u-cart-num">
													<view class="u-num-btn" @click.stop="sub" :data-num="(item.cart_quantity)" :data-stock="(item.cart_quantity+item.buy_limit)"
													 :data-cid="(item.cart_id)" :data-skuid="(item.item_id)" :data-userid="(item.user_id)">-</view>
													<input type="number" :value="(item.cart_quantity)" @click.stop @blur="writenum" :data-stock="(item.cart_quantity+item.buy_limit)"
													 :data-cid="(item.cart_id)" :data-skuid="(item.item_id)" :data-userid="(item.user_id)"/>
													<view class="u-num-btn thin-border-left" @click.stop="add" :data-num="(item.cart_quantity)" :data-stock="(item.cart_quantity+item.buy_limit)"
													 :data-cid="(item.cart_id)" :data-skuid="(item.item_id)" :data-userid="(item.user_id)">+</view>
												</view>
											</block>
											<!-- <block v-else>
						<view class="u-cart-num">
						  <view class="u-num-btn">-</view>
						  <input type="text" :value="(item.cart_quantity)" />
						  <view class="u-num-btn">+</view>
						</view>
					  </block> -->
										</view>
										<view class="u-del" :data-id="(item.cart_id)" @click.stop.prevent="delcart" @touchstart.stop.prevent @touchmove.stop.prevent @touchend.stop.prevent="delcart">
											{{__('删除')}}
										</view>
									</navigator>
								</view>
								<!-- 模板调用单品加价购、赠品、满减 -->
								<!--
				  pulse_gift_cart
				  pulse_bargains
				  pulse_bargains_cart
				  pulse_reduction
				  -->
								<!-- pulse_gift_cart -->
								<view v-if="(item.pulse_gift_cart.length > 0)" v-for="(pluse, giftindex) in item.pulse_gift_cart" :key="giftindex"
								 class="m-item-act" :data-id="(pluse.cart_id)">
									<view class="m-cart-ck" :data-id="(pluse.cart_id)" :data-isck="(pluse.cart_select)">
									</view>
									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="m-product-img m-act-img">
										<image lazy-load :src="($.img(pluse.product_image, 200, 200))" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
										<label>【{{__('赠品')}}】{{pluse.product_item_name}}</label>
									</navigator>
									<view v-if="(pluse.selectable)" class="m-act-change" :data-storeindex="(storeindex)" :data-itemindex="(itemindex)"
									 :data-giftindex="(giftindex)" :data-isck="(pluse.cart_select)" @click="chooseItemGift">{{__('修改')}}</view>
								</view>

								<!-- pulse_reduction -->
								<block v-if="(item.pulse_reduction.length > 0)" v-for="(pluse, reductionindex) in item.pulse_reduction" :key="reductionindex">
									<view v-if="(pluse.reduceMoney > 0)" class="m-item-act">
										<view class="m-cart-ck" @click="ckitem" :data-id="(pluse.cart_id)" :data-isck="(pluse.cart_select)">
										</view>
										<view class="m-product-img  icon-activity icon-activity-reduction">
										</view>
										<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
											<label>【{{sprintf(__('满减 -￥%s'), mf(pluse.reduceMoney,2))}}】</label>
											<!--(pluse.actName)-->
										</view>
									</view>
								</block>
								<!-- pulse_reduction -->
								<block v-if="(item.pulse_multple.length > 0)" v-for="(pluse, reductionindex) in item.pulse_multple" :key="reductionindex">
									<view v-if="(pluse.reduceMoney > 0)" class="m-item-act">
										<view class="m-cart-ck" @click="ckitem" :data-id="(pluse.cart_id)" :data-isck="(pluse.cart_select)">
										</view>
										<view class="m-product-img  icon-activity icon-activity-reduction">
										</view>
										<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
											<label>【{{sprintf(__('多件折 -￥%s'), mf(pluse.reduceMoney,2))}}】</label>
											<!--(pluse.actName)-->
										</view>
									</view>
								</block>

								<!-- pulse_bargains_cart -->
								<view v-if="(item.pulse_bargains_cart.length > 0)" v-for="(pluse, bargainsindex) in item.pulse_bargains_cart"
								 :key="bargainsindex" class="m-item-act" :data-id="(pluse.cart_id)">
									<image v-if="(pluse.product_state_id == 1002)" lazy-load class="off-shelf-simg" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/xiajia.png" />
									<view class="m-cart-ck" @click="ckitem" :data-id="(pluse.cart_id)" :data-isck="(pluse.cart_select)">
										<uni-icons :type="(pluse.cart_select?'circle-filled':'circle') " :color="(pluse.cart_select?'#DB384C':'#e3e3e3')" />
									</view>
									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="m-product-img m-act-img">
										<image lazy-load :src="($.img(pluse.product_image, 200, 200))" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;width:260upx;">
										<label>【{{__('加价购')}}】{{pluse.product_item_name}}</label>
									</navigator>

									<block>
										<view class="u-cart-num" style="right:122upx;">
											<view class="u-num-btn" @click="sub" :data-num="(pluse.cart_quantity)" :data-stock="(pluse.cart_quantity + pluse.buy_limit)"
											 :data-cid="(pluse.cart_id)" :data-skuid="(pluse.item_id)" :data-userid="(pluse.user_id)">-</view>
											<input :type="number" :value="(pluse.cart_quantity)" @blur="writenum" :data-stock="(pluse.cart_quantity + pluse.buy_limit)"
											 :data-cid="(pluse.cart_id)" :data-skuid="(pluse.item_id)" :data-userid="(pluse.user_id)"/>
											<view class="u-num-btn" @click="add" :data-num="(pluse.cart_quantity)" :data-stock="(pluse.cart_quantity + pluse.buy_limit)"
											 :data-cid="(pluse.cart_id)"  :data-skuid="(pluse.item_id)" :data-userid="(pluse.user_id)">+</view>
										</view>
									</block>
								</view>

								<!-- pulse_bargains -->
								<block v-if="(item.pulse_bargains.length > 0)" v-for="(pluse, bargainsindex) in item.pulse_bargains" :key="bargainsindex">
									<view class="m-item-act" v-if="(pluse.length > 0 || pluse.actId)" :data-id="(pluse.cart_id)">
										<image v-if="(pluse.product_state_id == 1002)" lazy-load class="off-shelf-simg" src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/xiajia.png" />
										<view class="m-cart-ck" v-if="(pluse.selectable)" :data-storeindex="(storeindex)" :data-itemindex="(itemindex)"
										 :data-bargainsindex="(bargainsindex)" :data-isck="(pluse.cart_select)" @click="chooseItemBargains">
											<uni-icons class="iconfont icon-add " style="font-size:44upx;position:relative;top:10upx;color:green;" />
										</view>
										<view class="m-cart-ck" v-else @click="chooseRaiseBuyItem" :data-item_id="(pluse.item_id)" :data-activity_id="(pluse.actId)"
										 :data-activity_item_id="(pluse.activity_item_id)" :data-cart_type="1" :data-isck="(pluse.cart_select)">
											<uni-icons :type="(isckall?'circle-filled':'circle')" :color="(isckall?'#DB384C':'#e3e3e3')" />
										</view>

										<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="m-product-img m-act-img">
											<image lazy-load :src="($.img(pluse.product_image, 200, 200))" />
										</navigator>
										<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
											<label>【{{sprintf(__('加价 ￥%s 购买'), mf(pluse.item_sale_price,2))}}】</label>
										</navigator>
									</view>
								</block>
							</view>



							<!-- 店铺加价购 pulse_bargains -->
							<view class="m-product-item" v-if="(store_items.bargains.length > 0)" v-for="(pluse, bargainsindex) in store_items.bargains"
							 :key="bargainsindex">
								<view class="m-item-act" v-if="(pluse.length > 0 || pluse.actId)" :data-id="(pluse.cart_id)">
									<view class="m-cart-ck" v-if="(pluse.selectable)" :data-storeindex="(storeindex)" :data-itemindex="(itemindex)"
									 :data-bargainsindex="(bargainsindex)" :data-isck="(pluse.cart_select)" @click="chooseStoreBargains">
										<uni-icons class="iconfont icon-add " style="font-size:44upx;position:relative;top:10upx;color:green;" />
									</view>
									<view class="m-cart-ck" v-else @click="chooseRaiseBuyItem" :data-item_id="(pluse.item_id)" :data-activity_id="(pluse.actId)"
									 :data-activity_item_id="(pluse.item_id)" :data-cart_type="1" :data-isck="(pluse.cart_select)">
										<uni-icons :type="(isckall?'circle-filled':'circle')" :color="(isckall?'#DB384C':'#e3e3e3')" />
									</view>

									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="m-product-img m-act-img">
										<image lazy-load :src="($.img(pluse.product_image, 200, 200))" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
										<label>【{{sprintf(__('加价 ￥%s 购买'), mf(pluse.item_sale_price,2))}}】</label>
									</navigator>
								</view>
							</view>



							<!-- 店铺赠品 activitys.gift -->
							<view class="m-product-item" v-if="(store_items.activitys.gift.length > 0)" v-for="(pluse, giftindex) in store_items.activitys.gift"
							 :key="giftindex">
								<view class="m-item-act" v-if="(pluse.length > 0 || pluse.actId)" :data-id="(pluse.cart_id)">
									<view class="m-cart-ck" :data-id="(pluse.cart_id)" :data-isck="(pluse.cart_select)">
									</view>
									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="m-product-img m-act-img">
										<image lazy-load :src="($.img(pluse.product_image, 200, 200))" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid='+(pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
										<label>【{{__('赠品')}}】{{pluse.product_item_name}}</label>
									</navigator>
									<view v-if="(pluse.selectable)" class="m-act-change" :data-storeindex="(storeindex)" :data-itemindex="(itemindex)"
									 :data-giftindex="(giftindex)" :data-isck="(pluse.cart_select)" @click="chooseStoreGift">{{__('修改')}}</view>
								</view>
							</view>



							<!-- 店铺满减 activitys.reduction  -->
							<view class="m-product-item" v-if="(store_items.activitys.reduction.length > 0)" v-for="(pluse, reductionindex) in store_items.activitys.reduction"
							 :key="reductionindex">
								<view class="m-item-act" v-if="((pluse.length > 0 || pluse.actId) && (pluse.reduceMoney > 0) )" :data-id="(pluse.cart_id)">
									<view class="m-cart-ck" @click="ckitem" :data-id="(pluse.cart_id)" :data-isck="(pluse.cart_select)">
									</view>
									<view class="m-product-img  icon-activity icon-activity-reduction">
									</view>
									<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
										<label>【{{sprintf(__('满减 -￥%s'), mf(pluse.reduceMoney,2))}}】</label>
										<!--(pluse.actName)-->
									</view>
								</view>
							</view>
							<!-- 店铺多件折 activitys.reduction  -->
							<view class="m-product-item" v-if="(store_items.activitys.multple.length > 0)" v-for="(pluse, reductionindex) in store_items.activitys.multple"
							 :key="reductionindex">
								<view class="m-item-act" v-if="((pluse.length > 0 || pluse.actId) && (pluse.reduceMoney > 0) )" :data-id="(pluse.cart_id)">
									<view class="m-cart-ck" @click="ckitem" :data-id="(pluse.cart_id)" :data-isck="(pluse.cart_select)">
									</view>
									<view class="m-product-img  icon-activity icon-activity-reduction">
									</view>
									<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
										<label>【{{sprintf(__('多件折 -￥%s'), mf(pluse.reduceMoney,2))}}】</label>
										<!--(pluse.actName)-->
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<view class="u-cleanbox"></view>
				<view class="m-footer-btn" :style="'bottom:' + barBottom + 'px'">
					<view class="m-footer-btn-list">
						<view class="m-footer-btn-item">
							<view class="m-cart-ck" @click="ckall" :data-isck="(isckall)">
								<uni-icons :type="(isckall?'circle-filled':'circle')" :color="(isckall?'#DB384C':'#e3e3e3')" />
							</view>
							<view class="m-cart-del" @click="delAll">
								<label class="iconfont icon-delete"></label>
							</view>
						</view>
						<view class="m-footer-btn-item m-cart-total">
							<view style="line-height: 1.4">{{__('合计：')}}
								<block v-if="cartlist.orderSelMoneyAmount">
									<label>{{__('￥')}}</label><text>{{number_format(cartlist.orderSelMoneyAmount, 2)}}</text>
								</block>

								<block v-if="cartlist.orderSelPointsAmount">
									<label style="margin: auto 10upx;">+</label><text v-if="cartlist.orderSelPointsAmount">  {{number_format(cartlist.orderSelPointsAmount)}}</text><label>{{__('积分')}}</label>
								</block>

								<block v-if="cartlist.orderSelSpAmount">
									<label style="margin: auto 10upx;">+</label><text v-if="cartlist.orderSelSpAmount">  {{number_format(cartlist.orderSelSpAmount)}}</text><label>{{__('众宝')}}</label>
								</block>
							</view>
							<view style="font-size: 20upx;line-height: 28upx"><label style="margin-right: 10upx;color:#888;">{{__('优惠:￥')}}{{number_format(cartlist.orderDiscountAmount, 2)}}</label> {{__('不含运费')}} </view>
						</view>
					</view>
					<view class="m-footer-btn-main" @click="submitorder">
						{{sprintf(__('结算(%s)'), cartlist.Total)}}
					</view>
				</view>

				<view :class="{'m-panel-sp':1, hide:selectsp==0}" @click="closesp">
					<view :style="'bottom:' + barBottom + 'px'" :class="'m-panel-sp-content ' +  (selectct==0?'bounceOutDown animated':'bounceInUp animated')" catchtap>
						<view class="m-panel-sp-pinfo">
							<view class="m-panel-sp-pname">
								<view class="m-pstock">{{__('选择商品')}}</view>
							</view>
							<uni-icons type="close" class="m-panel-sp-icon" color="#888" @click="closesp" />
						</view>
						<scroll-view class="m-panel-sp-listbox" scroll-y="true">
							<block v-for="(select_items, key1) in spdata.selecInfo" :key="key1">
								<view class="m-panel-sp-listbox-item" @click="chooseRaiseBuyItem" :data-item_id="(select_items.item_id)"
								 :data-activity_id="(spdata.actId)" :data-activity_item_id="(spdata.activity_item_id)" :data-cart_type="(cart_type)">
									<view class="m-panel-sp-labellist" v-if="(true)">
										<view class="m-panel-sp-pimg">
											<image lazy-load :src="($.img(select_items.product_image, 200, 200))" />
										</view>
										<view class="m-panel-sp-pname">{{select_items.product_item_name}}

											<view class="m-product-price">
												<label>{{__('￥')}}</label>{{number_format(select_items.item_sale_price, 2)}} <label class="pre-info-price" v-if="(select_items.discount_sale_money)">-{{__('￥')}}{{number_format(select_items.discount_sale_money, 2)}}</label>
											</view>

										</view>
									</view>
								</view>
							</block>
							<!-- <view style="height:96upx;width:100%;"></view> -->
						</scroll-view>
					</view>
				</view>
			</block>
			<block v-else>
			<navigator url="/pages/index/index" open-type="switchTab" class="m-nullpage">
				<view class="m-nullpage-middle">
					<label class="iconfont icon-konggouwuche"></label>
					<view class="m-null-tip">
						<text>{{__('购物车空空如也')}}</text>
						<text>{{__('去挑几件中意的商品吧')}}</text>
					</view>
				</view>
			</navigator>
			<guess-you-like ref="guessYouLike" :isGuessFlag="isGuessFlag" :titleText="__('——猜你喜欢——')"></guess-you-like>
		</block>
		</view>
	</view>
</template>

<script>
	import guessYouLike from '@/components/guess-you-like.vue'
	import statusBar from '../../components/status-bar.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'
import statecode from '../../config/statecode'

	export default {
		data: function() {
			return {
				options: {},
				selectsp: 0,
				selectct: 0,
				cart_type:0,
				spdata: [],
				flag:false,
				isckall: !1,
				isck: !1,
				cartlist: {items:[]},
				X_Start: 0,
				X_End: 0,
				T_Id: 0,
				select_cart_ids: [],
				isdata: !1,
				barBottom: 0,
				itemindex:0,
				loadComplete: false, // 没有加载数据前不显示的对应内容
				isGuessFlag: false
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			statusBar,
			guessYouLike,
			uniIcons
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('购物车')
			});

			var that = this;

			let bar_bottom = 0;
			// #ifdef H5
			bar_bottom = 50;
			// #endif

			that.setData({
				options: options,
				barBottom: bar_bottom
			})

            this.getPlantformInfo(function(plantformInfo) {
                that.setData({
					isGuessFlag: plantformInfo.config.esearch_enable
                });
            });

			//console.log(this.tabBar)
			this.notice.addNotification("RefreshCart", that.RefreshCart, that);
		},

		onShow: function() {
			var that = this;

			this.getUserInfo(function(user) {
				that.getCartList()
			});
			this.showCartNum();
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// 离开页面，注销事件
			var that = this
			this.notice.removeNotification("RefreshCart", that);
		},

		onPullDownRefresh: function() {
			this.getCartList()
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum', 'showCartNum']),
			//获取平台信息
			getPlatType:function(){
				let platStr=null;
				// #ifdef MP-WEIXIN
				platStr="weiXin"
				//#endif
				
				// #ifdef H5
				platStr="H5"
				//#endif
				
				// #ifdef APP-PLUS
				platStr="APP"
				//#endif
				return	platStr
			},
			
			//计算选中信息
			ckalllength: function(data) {
				var that = this,
					selected_ids = [];
				var total_sel = 0;

				//循环所有店铺
				if (!that.$.isNull(data.items) && data.items.length > 0) {
					var isck = 0;
					var isckall = 0;
					var total = 0;

					for (var store_item_index in data.items) {
						//第一个店铺
						//var cart_items = data.items[0].items, i = 0, s = cart_items.length;
						var cart_items = data.items[store_item_index].items,
							s = cart_items.length;
						var i = 0;

						for (var item in cart_items) {
							//按照item计算 i
							cart_items[item].cart_select && (i = i + cart_items[item].cart_quantity, selected_ids.push(cart_items[item].cart_id),
								isck = 1);
						}

						total = total + i;
					}

					data.Total = total;

					that.setData({
						select_cart_ids: selected_ids
					});

					isckall = data.cart_select;

					this.setData({
						isckall: isckall
					})
					this.setData({
							isck: isck
						}),


						this.setData({
							isdata: !0
						})
				} else {
					this.setData({
						isdata: !1
					})
				}

				return data;
			},

			//店铺全选
			ckStore: function(e) {
				if (!e.currentTarget.dataset.checkable) {
					this.$.alert(this.__('商品都已下架'))
					return false;
				}
				var param = {
						//store_id: this.shopInfo.store_id,
						UID: 0,
						CID: e.currentTarget.dataset.id,
						IsCK: e.currentTarget.dataset.isck ? 0 : 1,

						action: 'store',
						store_id: e.currentTarget.dataset.id,
						cart_select: parseInt(e.currentTarget.dataset.isck) ? 0 : 1
					},
					that = this;

				//发送购物车请求
				that.$.request({
					url: this.Config.URL.cart.sel,
					data: param,
					success: function(data, status, msg, code) {
						that.getCartList()

						if (200 != status) {
							that.$.confirm(msg);
						}
						//data = that.ckalllength(data);
						//that.setData({cartlist: data});
					}
				});
			},

			//单品选中
			ckitem: function(e) {
				if (e.currentTarget.dataset.stateid != statecode.PRODUCT_STATE_NORMAL) {
					this.$.alert(this.__('该商品已下架'))
					return false;
				}
				var param = {
						//store_id: this.shopInfo.store_id,
						CID: e.currentTarget.dataset.id,
						IsCK: e.currentTarget.dataset.isck ? 0 : 1,

						cart_id: e.currentTarget.dataset.id,
						cart_select: parseInt(e.currentTarget.dataset.isck) ? 0 : 1
					},
					that = this;



				//发送购物车请求
				that.$.request({
					url: this.Config.URL.cart.sel,
					data: param,
					success: function(data, status, msg, code) {
						that.getCartList()

						if (200 != status) {
							that.$.confirm(msg);
						}
						//data = that.ckalllength(data);
						//that.setData({cartlist: data});
					}
				});
			},

			//全选
			ckall: function(e) {
				var param = {
						//store_id: this.shopInfo.store_id,
						CID: e.currentTarget.dataset.id,
						IsCK: e.currentTarget.dataset.isck ? 0 : 1,

						action: 'all',
						cart_select: parseInt(e.currentTarget.dataset.isck) ? 0 : 1
					},
					that = this;

				//发送购物车请求
				that.$.request({
					url: this.Config.URL.cart.sel,
					data: param,
					success: function(data, status, msg, code) {
						that.getCartList()

						if (200 != status) {
							that.$.confirm(msg);
						}
						//data = that.ckalllength(data);
						//that.setData({cartlist: data});
					}
				});
			},

			sub: function(e) {
				let that = this;
				var t = {
					btntype: 2,
					numval: e.currentTarget.dataset.num,
					CID: e.currentTarget.dataset.cid,
					stock: e.currentTarget.dataset.stock,
					skuId:e.currentTarget.dataset.skuid,
					userId:e.currentTarget.dataset.userid
				};
				
				if (t.numval == 1) {
					that.$.showModal({
						title: that.__("提示"),
						content: that.__("确认要删除这个商品吗？"),
						success: function(n) {
							if (n.confirm) {
								that.unifiedNum(t)
							}
						}
					})
				}
				else
				{
					that.unifiedNum(t)
				}
			},

			add: function(e) {
				let that = this;
				
				var t = {
					btntype: 1,
					numval: e.currentTarget.dataset.num,
					CID: e.currentTarget.dataset.cid,
					stock: e.currentTarget.dataset.stock,
					skuId:e.currentTarget.dataset.skuid,
					userId:e.currentTarget.dataset.userid
				};
				
				if (t.numval >= t.stock) {
					that.$.alert(that.__('不能再加了'));
					return;
				}
				
				this.unifiedNum(t)
			},

			writenum: function(e) {
				var t = {
					btntype: 3,
					numval: e.detail.value,
					CID: e.currentTarget.dataset.cid,
					stock: e.currentTarget.dataset.stock,
					skuId:e.currentTarget.dataset.skuid,
					userId:e.currentTarget.dataset.userid
				};
				this.unifiedNum(t)
			},
			unifiedNum: function(e) {

				var num_obj = {
					value: parseInt(e.numval),
					stock: parseInt(e.stock)
				};
				var flagObj={
					btntype:e.btntype,
					skuId:e.skuId,
					userId:e.userId
				};
				e.btntype == 1 && (num_obj.value = num_obj.value + 1);
				e.btntype == 2 && (num_obj.value = num_obj.value - 1);

				num_obj.value > num_obj.stock && (num_obj.value = num_obj.stock);
				
				//num_obj.value <= 0 && (num_obj.value = 1);

				var param = {
					//store_id: this.shopInfo.store_id,
					cart_id: e.CID,
					cart_quantity: num_obj.value
				};

				var that = this;
				flagObj.cart_quantity=num_obj.value;
				//发送购物车请求
				that.$.request({
					url: this.Config.URL.cart.quantity,
					data: param,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.getCartList(flagObj)
						} else {
							that.$.alert(msg);
						}
					}
				});
			},
			// 获取购物车信息
			getCartList: function(flagObj) {
				var that = this;
				var param = {};

				//发送购物车请求
				that.$.request({
					url: this.Config.URL.cart.lists,
					data: param,
					success: function(data) {
                        /*
						//统计加购数据
						if(flagObj){
							if(flagObj.btntype==1){
								//加一
								var _num=1;
							}else if(flagObj.btntype==2){
								//减一
								var _num=-1;
							}else{
								var _num=flagObj.cart_quantity;
							}
							uni.request({
								url:that.Config.statisticsPath+'/kafka/shopOrder/addCartKafka',
								method:'POST',
								data: {
									goodsNum:_num,
									skuId:flagObj.skuId,
									userId:that.$.getStorageSync('uid')
								},
								success:function(data, status, msg, code){
									//console.log(data,'+++++');
								}
							})
						}  */

						data = that.ckalllength(data);

						that.setData({
							cartlist: data
						});


						that.setData({
							loadComplete: !0
						});

						that.setCartNum(data.Total);
						that.showCartNum();

						that.$.stopPullDownRefresh()
					},
					fail: function(data) {
						that.setData({
							loadComplete: !0
						});
						that.$.alert("网络异常请重试！");
					}
				});


			},
			removestart: function(e) {
				this.setData({
					X_Start: e.touches[0].pageX
				})
			},
			removeload: function(e) {
				//console.info(e);
				this.setData({
					X_End: e.touches[0].pageX
				})
			},
			removeend: function(e) {
				this.setData({
					X_End: e.mp.changedTouches[0].pageX
				});
				this.direction(e.currentTarget.dataset.id)
			},
			direction: function(e) {

				var t = {
					xstart: this.X_Start,
					xend: this.X_End
				};

				if (t.xstart > t.xend) {
					if (t.xstart - t.xend > 100) {
						this.setData({
							T_Id: e
						})
					}
				} else {
					this.setData({
						T_Id: 0
					})
				}

			},


			pressDelCart: function(e) {
				var that = this;
				e.currentTarget.dataset.id;

				let itemList = [that.__('删除')]

				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						if (res.tapIndex == 0)
						{
							that.delcart(e);
						}
						else
						{
						}
					}
				})

			},

			// 删除购物车商品
			delcart: function(e) {
				var that = this;
				that.$.showModal({
					title: that.__("提示"),
					content: that.__("确认要删除这个商品吗？"),
					success: function(n) {
						if (n.confirm) {
							var param = {
								cart_id: e.currentTarget.dataset.id
							};
							that.$.request({
								url: that.Config.URL.cart.remove,
								data: param,
								success: function(data) {
									that.getCartList()
								}
							});
						}
					}
				})
			},
			// 结算
			submitorder: function() {
				let that = this;
				this.isck ? that.$.navigateTo({
					url: "/pages/checkout/checkout?ifcart=1"
				}) : that.$.showModal({
					title: that.__("提示"),
					content: that.__("请选择需要结算商品！"),
					showCancel: !1
				})
			},
			// 删除所有商品
			delAll: function() {
				var that = this;
				that.select_cart_ids.length <= 0 ? that.$.confirm(that.__("请选择需要删除的商品！")) : that.$.confirm(that.__("是否删除选中商品？"), function(t) {
						if (t.confirm) {
							var param = {
								cart_id: that.select_cart_ids.toString()
							};
							that.$.request({
								url: that.Config.URL.cart.remove,
								data: param,
								success: function(data) {
									that.getCartList()
								}
							});
						}
					},
					!0)
			},

			closesp: function() {
				var that = this;
				that.setData({
					selectct: 0,
					flag: !1
				}), setTimeout(function() {
						that.setData({
							selectsp: 0
						})
					},
					1e3)
			},

			//选择礼品
			chooseItemGift: function(e) {
				var that = this;

				var storeindex = e.currentTarget.dataset.storeindex;
				var itemindex = e.currentTarget.dataset.itemindex;
				var giftindex = e.currentTarget.dataset.giftindex;

				var spdata = that.cartlist['items'][storeindex]['items'][itemindex]['pulse_gift_cart'][giftindex];

				that.setData({
					selectsp: 1,
					selectct: 1,
					cart_type: 3,
					spdata: spdata
				})
			},

			chooseStoreGift: function(e) {
				var that = this;

				var storeindex = e.currentTarget.dataset.storeindex;
				var itemindex = e.currentTarget.dataset.itemindex;
				var giftindex = e.currentTarget.dataset.giftindex;

				var spdata = that.cartlist['items'][storeindex]['activitys']['gift'][giftindex];

				that.setData({
					selectsp: 1,
					selectct: 1,
					cart_type: 3,
					spdata: spdata
				})
			},

			//单品加价购
			chooseItemBargains: function(e) {
				var that = this;

				var storeindex = e.currentTarget.dataset.storeindex;
				var itemindex = e.currentTarget.dataset.itemindex;
				var bargainsindex = e.currentTarget.dataset.bargainsindex;

				var spdata = that.cartlist['items'][storeindex]['items'][itemindex]['pulse_bargains'][bargainsindex];

				that.setData({
					selectsp: 1,
					selectct: 1,
					cart_type: 1,
					spdata: spdata
				})
			},



			//店铺加价购
			chooseStoreBargains: function(e) {
				var that = this;

				var storeindex = e.currentTarget.dataset.storeindex;
				var itemindex = e.currentTarget.dataset.itemindex;
				var bargainsindex = e.currentTarget.dataset.bargainsindex;

				var spdata = that.cartlist['items'][storeindex]['bargains'][bargainsindex];

				that.setData({
					selectsp: 1,
					selectct: 1,
					cart_type: 1,
					spdata: spdata
				})
			},


			//选择礼品
			chooseRaiseBuyItem: function(e) {
				var that = this;

				var item_id = e.currentTarget.dataset.item_id;
				var activity_id = e.currentTarget.dataset.activity_id;
				var cart_type = e.currentTarget.dataset.cart_type; //购买类型(ENUM):1-购买; 2-积分兑换; 3-赠品; 4-活动促销
				var activity_item_id = e.currentTarget.dataset.activity_item_id;
				var cart_quantity = 1;

				that.addActivityItemToCart(item_id, activity_id, cart_type, activity_item_id, cart_quantity);
			},

			addActivityItemToCart: function(item_id, activity_id, cart_type, activity_item_id, cart_quantity) {
				var that = this;

				var param = {
					item_id: item_id,
					activity_id: activity_id,
					cart_type: cart_type, //购买类型(ENUM):1-购买; 2-积分兑换; 3-赠品; 4-活动促销
					activity_item_id: activity_item_id,
					cart_quantity: cart_quantity,
				};

				that.$.request({
					url: that.Config.URL.cart.add,
					data: param,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$report('fb_mobile_add_to_cart', data);
							
							that.getCartList()
							that.setData({
								selectct: 0,
								flag: !1
							}), setTimeout(function() {
									that.setData({
										selectsp: 0
									})
								},
								1e3)
						} else {
							that.$.alert(msg);
						}
					}
				});

			},
			RefreshCart: function(e) {
				this.getCartList();
			},



		}
	}
</script>


<style lang="scss">
	@import "../../styles/_variables.scss";


	/*店铺信息 start*/

	.m-store:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #ebebe7;
		color: #ebebe7;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.m-store {
		height: 100upx;
		background-color: #f5f5f5;
		border-bottom: 0upx solid #e3e3e3;
		position: relative;
		overflow: hidden;
	}

	.m-store-c {
		position: absolute;
		height: 100%;
		width: 850upx;
	}

	.m-store-ck {
		float: left;
		width: 100upx;
		height: 100%;
		position: relative;
	}

	.m-store-ck icon,
	.m-store-ck .uni-icons {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -23upx;
		margin-left: -23upx;
	}

	.m-store-info {
		height: 100upx;
		line-height: 100upx;
		width: 538upx;
		float: left;
		box-sizing: border-box;
		position: relative;
	}

	/*.m-store-info::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 1upx;border-bottom: 1upx solid #e3e3e3;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}*/



	.pre-info-price {
		height: 18upx;
		font-size: 12upx;
		color: #b0b0b0;
		margin: 0 0 0 10upx;
	}



	.m-act-img {
		width: 100upx;
		height: 100upx;
	}


	.m-item-act {
		position: relative;
		height: 100%;
		width: 850upx;
		height: 100upx;
	}


	.act-item-name {
		width: 360upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.m-act-change {
		float: right;
		width: 100upx;
		background-color: #fff;
		height: 100upx;
		line-height: 100upx;
		font-size: 28upx;
		position: absolute;
		font-size: 28upx;
		top: 0upx;
		right: 100upx;
		color: #888;
		text-align: center;
	}

	/*选择规格遮罩 start*/
	.m-panel-sp {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 4;
		background-color: rgba(0, 0, 0, 0.2)
	}

	.m-panel-sp-content {
		background-color: #fff;
		position: absolute;
		width: 100%;
		bottom: 0;
		box-shadow: 0px -10upx 15upx rgba(0, 0, 0, 0.35);
	}

	.m-panel-sp-pinfo {
		height: 80upx;
		box-sizing: border-box;
		padding: 20upx;
		position: relative;
	}

	.m-panel-sp-pimg {
		width: 100upx;
		height: 100upx;
		background-color: #fff;
		border-radius: 8upx;
		box-sizing: border-box;
		padding: 10upx;
		box-shadow: 0px 0upx 10upx rgba(0, 0, 0, 0.35);
		float: left;
	}

	.m-panel-sp-pimg image {
		width: 100%;
		height: 100%;
	}

	.m-panel-sp-pname {
		padding-left: 20upx;
		width: 580upx;
		/*float:right;*/
		font-size: 28upx;

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;

		margin-top: 6upx;
	}

	.m-panel-sp-pname .m-pprice {
		color: $default-skin-bg;
		font-size: 32upx;
		line-height: 50upx;
		font-weight: bold;
	}

	.m-panel-sp-icon {
		position: absolute;
		right: 20upx;
		top: 20upx;
	}

	/* .m-panel-sp-listbox{height: 604upx;} */
	.m-panel-sp-listbox-item {
		height: 130upx;
		border-top: 1upx solid #e3e3e3;
		box-sizing: border-box;
		padding: 10upx 20upx;
	}

	/*选择规格遮罩 end*/


	.u-cart-num {
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		z-index: 2;
	}

	.m-cart-ck {
		float: left;
		width: 100upx;
		background-color: #fff;
		height: 100%;
		position: relative;
	}

	.m-cart-ck icon,
	.m-cart-ck .uni-icons {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -23upx;
		margin-left: -23upx;
	}

	.m-product-info {
		width: 438upx;
	}

	.m-product-info::before {
		border: none;
	}

	.m-product-item::before {
		content: "";
		border: none;
	}

	.m-product-item:last-child::after {
		content: "";
		border: none;
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

	.m-product-item {
		border-bottom: 0upx solid #e3e3e3;
		position: relative;
		overflow: hidden;
		height: auto;
	}

	.m-item-c {
		position: relative;
		height: 100%;
		width: 850upx;
		height: 212upx;
	}

	.u-del {
		width: 100upx;
		background-color: $default-skin-bg;
		float: right;
		height: 100%;
		color: #fff;
		font-size: 28upx;
		text-align: center;
		line-height: 212upx;
	}

	/*底部按钮 start*/

	.m-footer-btn:before {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #ebebe7;
		color: #ebebe7;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.m-footer-btn {
		height: 100upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-top: 0upx solid #e3e3e3;
		z-index: 3
	}

	.m-footer-btn-list {
		width: 75%;
		height: 100%;
		position: relative;
		float: left;
	}

	.m-footer-btn-item {
		position: relative;
		float: left;
		width: 30%;
		font-size: 24upx;
		color: #888;
		line-height: 40upx;
		padding: 15upx 0;
		box-sizing: border-box;
		height: 100%;
	}

	.m-footer-btn-main {
		width: 25%;
		height: 100%;
		float: left;
		background-color: $default-skin-bg;
		color: #fff;
		line-height: 100upx;
		font-size: 32upx;
		text-align: center;
	}

	.m-cart-total {
		text-align: right;
		padding-right: 20upx;
		width: 70%;
	}

	.m-cart-total text {
		font-size: 36upx;
		color: $default-skin-bg;
	}

	.m-cart-total label {
		color: $default-skin-bg;
	}

	.m-cart-del {
		line-height: 70upx;
		font-size: 32upx;
	}

	/*底部按钮 end*/
	.del {
		-webkit-animation: mdel .2s 1;
		animation: mdel .2s 1;
		left: -100upx;
	}

	@-webkit-keyframes mdel {
		0% {
			left: 0;
		}

		100% {
			left: -100upx;
		}
	}

	@keyframes mdel {
		0% {
			left: 0;
		}

		100% {
			left: -100upx
		}
	}

	view {
		font-size: 28upx;
		line-height: 2;
	}

	.m-product-name {
		line-height: 40upx;
	}

	.m-product-item{
		padding: 0;
		margin-top:0;
		display: block;
	}

	.m-product-img {
		image {
			padding: 20upx;
		}
	}
	.m-act-img {
		width: 212upx;
		height: 100upx;
		image {
			width: 100upx;
			height: 100upx;
		}
	}

	.m-product-price {
		line-height: 74upx !important;
	}

	.off-shelf-img{
		width:100upx;height:100upx;float:right;position: absolute;right: 100rpx;z-index: 3;
	}
	
	.off-shelf-simg{
		width:60upx;height:60upx;float:right;position: absolute;right: 100rpx;z-index: 3;
	}
</style>
