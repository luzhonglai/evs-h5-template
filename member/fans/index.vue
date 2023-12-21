<template>
	<view class="page">

		<view class="m-banner-img">
			<view class="member-top">
				<navigator url="/member/member/data" class="m-user-info">
					<image lazy-load :src="(userInfo.user_avatar)" mode="scaleToFill" />
					<view class="m-name">
						<label>{{userInfo.user_nickname}}</label>
						<text v-if="fxData.user_role.user_role_name"> - </text>
						<text class="sup">{{fxData.user_role.user_role_name}}</text>
					</view>
				</navigator>
				<view class="g-flex member-order-tab">
					<navigator url="/member/fans/endorsement" class="g-flex-item">
						<view class="iconfont zc zc-qrcode i-type"></view>
						{{__('生成推广码')}}
					</navigator>
					<navigator url="/pagesub/westore/index" class="g-flex-item" v-if="plantform_fx_westore_enable">
						<view class="iconfont zc zc-dianpu i-type"></view>
						{{__('我的小店')}}
					</navigator>
				</view>
			</view>
		</view>
		<view class="m-panel-bd">
			<view class="m-media-box m-media-box-small-appmsg">
				<view :class="{'m-cells':1, iconBoxLattice:true}">
					<navigator v-if="true" url="/member/fans/list" class="m-cell m-cell-access">
						<view class="m-cell-hd " style="color:#db384c">
							<label >{{fxData.all_num}}</label>
						</view>
						<view class="m-cell-bd m-cell-primary">
							<p>{{__('累计邀请')}}</p>
						</view>
						<text class="m-cell-ft"></text>
					</navigator>

                    	<navigator v-if="true" url="/member/fans/list" class="m-cell m-cell-access">
                    		<view class="m-cell-hd " style="color:#db384c">
                    			<label >{{fxData.month_num}}</label>
                    		</view>
                    		<view class="m-cell-bd m-cell-primary">
                    			<p>{{__('本月新增')}}</p>
                    		</view>
                    		<text class="m-cell-ft"></text>
                    	</navigator>

                        <navigator v-if="true" url="/member/fans/profitlist" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.user_commission_now}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('累计佣金')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="commission_withdraw_mode==0" url="/member/cash/commissionapply" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.user_commission_now}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('佣金提现')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>
                        <navigator v-else url="/member/cash/commissionwithdraw" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.user_commission_now}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('佣金提现')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="false" url="/member/fans/index" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.product_num}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('推广商品')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="false" url="/member/fans/index" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.order_num}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('推广订单')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                    	<navigator v-if="false" url="/member/fans/index" class="m-cell m-cell-access">
                    		<view class="m-cell-hd " style="color:#db384c">
                    			<label >{{fxData.finish_nums}}</label>
                    		</view>
                    		<view class="m-cell-bd m-cell-primary">
                    			<p>{{__('完成订单')}}</p>
                    		</view>
                    		<text class="m-cell-ft"></text>
                    	</navigator>


                        <navigator v-if="true" url="/member/fans/profitlist?level=1" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_buy_amount_0}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('累计消费奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="fxData.user_role.user_is_sp" url="/member/fans/profitlist?level=6" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_directseller_amount_0}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('累计销售奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="fxData.user_role.user_is_pt" url="/member/fans/profitlist?level=15" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_partner_buy_trade}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('合伙消费奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="fxData.user_role.user_is_pt" url="/member/fans/profitlist?level=25" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_partner_directseller_trade}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('合伙销售奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>


                        <navigator v-if="fxData.user_role.user_is_ca" url="/member/fans/profitlist?level=10" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_buy_ca}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('市代消费奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="fxData.user_role.user_is_ca" url="/member/fans/profitlist?level=20" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_directseller_ca}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('市代销售奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>



                        <navigator v-if="fxData.user_role.user_is_da" url="/member/fans/profitlist?level=11" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_buy_da}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('区代消费奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="fxData.user_role.user_is_da" url="/member/fans/profitlist?level=21" class="m-cell m-cell-access">
                        	<view class="m-cell-hd " style="color:#db384c">
                        		<label >{{fxData.commission_directseller_da}}</label>
                        	</view>
                        	<view class="m-cell-bd m-cell-primary">
                        		<p>{{__('区代销售奖')}}</p>
                        	</view>
                        	<text class="m-cell-ft"></text>
                        </navigator>



				</view>
			</view>
		</view>



		<view style="margin-left: 20upx;margin-top: 20upx;margin-bottom: 10upx;">
		    <text>{{__('最近收入')}}</text>
		</view>
		<view class="qiun-charts" >
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			<!--#endif-->
		</view>

		<!-- #ifdef APP-PLUS -->
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
					  @saveImg="saveImg"  ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->
	</view>
</template>

<script>
	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'

	import uCharts from './u-charts/u-charts.min.js';

	import {
		mapState,
		mapMutations
	} from 'vuex'

	var _self;
	var canvaLineA=null;
	var lastMoveTime=null;//最后执行移动的时间戳


	export default {
		data() {
			return {

				fxData:{
					base:{},
					member_info:{},
					user_role:{}
				},

				PageQRCodeInfo: {
					Path: "",
					IsShare: !1,
					IsShareBox: !1,
					IsJT: !1
				},
				shareData:{},



				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				Interactive:'',//交互显示的数据
				plantform_fx_westore_enable: 0,
				
				isShowMoney:true,
				commission_withdraw_mode:0
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			shareBoxMp,
			shareBoxApp
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('推广中心')
			});

			var that = this;
			this.refreshData();

            this.getPlantformInfo(function(plantformInfo) {
                that.setData({
					plantform_fx_westore_enable: plantformInfo.config.plantform_fx_westore_enable
                });
				
				that.commission_withdraw_mode = plantformInfo.config.plantform_commission_withdraw_mode || 0
				
				//如果启用了支付方式
				if (that.$.inArray(plantformInfo.payment_channel_code_row, 'money'))
				{
					that.isShowMoney = true;
				}
				else
				{
					that.isShowMoney = false;
				}
            });
			

				_self = this;
				//#ifdef MP-ALIPAY
				uni.getSystemInfo({
					success: function (res) {
						if(res.pixelRatio>1){
							//正常这里给2就行，如果pixelRatio=3性能会降低一点
							//_self.pixelRatio =res.pixelRatio;
							_self.pixelRatio =2;
						}
					}
				});
				//#endif
				this.cWidth=uni.upx2px(750);
				this.cHeight=uni.upx2px(450);
				this.getServerData();
		},
		onShareAppMessage() {
			return {
				title: this.userInfo.user_nickname,
				path: "/pagesub/westore/index?wd_id=" + this.userInfo.user_id
			}
		},
		onBackPress() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
				return true;
			}
			// #endif
			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
				return true;
			}
			// #endif
		},
		onUnload() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
			}
			// #endif
			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
		},
		onNavigationBarButtonTap(e) {
			var that = this;

			if (e.index === 0) {
				that.onShareBox(e);
			} else {
				uni.showToast({
					title: "你点了收藏按钮",
					icon: "none"
				})
			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceuserInfo', 'getuserInfo']),

			refreshData: function(callback) {

				var that = this;
				let params = {};

				that.$.request({
					url: this.Config.URL.fx.index,
					data: params,
					/* ajaxCache: {
                        timeout: this.Config.CACHE_EXPIRE
                    }, */
					success: function(data, status, msg, code) {
						that.setData({
							fxData: data
						})
					}
				});
			},
			onShareBox: function(e) {

				let that = this;
				var $href = that.$.sprintf('%s/tmpl/member/directseller_store.html?u_id=%d&FX=%d', this.Config.WapSiteUrl, this.post.wd_id, this.userInfo
						.user_id);


				$href = that.$.sprintf('%s/h5/pagesub/westore/index?wd_id=%s&uid=%d', that.Config.SiteUrl, this.post.wd_id, this.userInfo.user_id);

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				// #endif

				// #ifdef MP-WEIXIN
				$href = "/pagesub/westore/index?wd_id=" + this.post.wd_id;
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.store_data.westore_name,
						shareText: this.store_data.westore_name,
						href: $href,
						image: this.store_data.invite_info.qrcode
					}
				});

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif

				// #ifdef MP-WEIXIN
				this.$refs.shareBoxMp.show();
				// #endif
			},







				getServerData(){
						let that = this;
						that.$.request({
							url: this.Config.URL.fx.getCommissionTimeline,
							data: {},
							/* ajaxCache: {
								timeout: this.Config.CACHE_EXPIRE
							}, */
							success: function(data, status, msg, code) {
									_self.showLineA("canvasLineA", data);

							}
						});
				},
				showLineA(canvasId,chartData){
					canvaLineA=new uCharts({
						$this:_self,
						canvasId: canvasId,
						type: 'line',
			  colors:['#facc14', '#f04864', '#8543e0', '#90ed7d'],
						fontSize:11,
						padding:[15,15,0,15],
						legend:{
							show:true,
							padding:5,
							lineHeight:11,
							margin:0,
						},
						dataLabel:false,
						dataPointShape:true,
						background:'#FFFFFF',
						pixelRatio:_self.pixelRatio,
						categories: chartData.categories,
						series: chartData.series,
						animation: true,
						xAxis: {
							type:'grid',
							gridColor:'#CCCCCC',
							gridType:'dash',
							dashLength:8,
							//disableGrid:true
						},
						yAxis: {
							gridType:'dash',
							gridColor:'#CCCCCC',
							dashLength:8,
						},
						width: _self.cWidth*_self.pixelRatio,
						height: _self.cHeight*_self.pixelRatio,
						extra: {
							line:{
								type: 'straight'
							}
						}
					});

				},
				touchLineA(e) {
					lastMoveTime=Date.now();
				},
				moveLineA(e){
					let currMoveTime = Date.now();
					let duration = currMoveTime - lastMoveTime;
					if (duration < Math.floor(1000 / 60)) return;//每秒60帧
					lastMoveTime = currMoveTime;

					let currIndex=canvaLineA.getCurrentDataIndex(e);
					if(currIndex>-1&&currIndex<canvaLineA.opts.categories.length){
						let riqi=canvaLineA.opts.categories[currIndex];
						let leibie=canvaLineA.opts.series[0].name;
						let shuju=canvaLineA.opts.series[0].data[currIndex];
						this.Interactive=leibie+':'+riqi+'-'+shuju+'元';
					}
					canvaLineA.showToolTip(e, {
						format: function (item, category) {
							return category + ' ' + item.name + ':' + item.data
						}
					});
				},
				touchEndLineA(e){
					let currIndex=canvaLineA.getCurrentDataIndex(e);
					if(currIndex>-1&&currIndex<canvaLineA.opts.categories.length){
						let riqi=canvaLineA.opts.categories[currIndex];
						let leibie=canvaLineA.opts.series[0].name;
						let shuju=canvaLineA.opts.series[0].data[currIndex];
						this.Interactive=leibie+':'+riqi+'-'+shuju+'元';
					}
					canvaLineA.touchLegend(e);
					canvaLineA.showToolTip(e, {
						format: function (item, category) {
							return category + ' ' + item.name + ':' + item.data
						}
					});
				}/*,
				changeData(){
					if(isJSON(_self.textarea)){
						let newdata=JSON.parse(_self.textarea);
						canvaLineA.updateData({
							series: newdata.series,
							categories: newdata.categories
						});
					}else{
						uni.showToast({
							title:'数据格式错误',
							image:'../../../static/images/alert-warning.png'
						})
					}
				}*/
		}
	}
</script>

<style lang="scss">

	@import '../../styles/_variables.scss';


	.u-loadmore
	{
		width: 100%;
	}


	.member-top {
		-webkit-animation: changeBg 20s infinite;
		animation: changeBg 20s infinite;
		background-color: #ff6700;
		background-image: url('data:image/png;base64,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');
		background-size: cover;
		text-align: center;
		width: 100%;
		/*height: 11rem;*/

		overflow: hidden;
		height: 480upx; /* 320 */

		color: #fff;
		position: relative;
		z-index: 1;
	}

	@-webkit-keyframes changeBg {
		0% {
			background-color: #ff6700;
		}

		90% {
			background-color: #ff6700;
		}

		10% {
			background-color: #fb6e52;
		}

		20% {
			background-color: #ffce55;
		}

		30% {
			background-color: #a0d468;
		}

		40% {
			background-color: #48cfae;
		}

		50% {
			background-color: #4fc0e8;
		}

		60% {
			background-color: #5d9cec;
		}

		70% {
			background-color: #ac92ed;
		}

		80% {
			background-color: #ec87bf;
		}
	}

	@keyframes changeBg {
		0% {
			background-color: #ff6700;
		}

		90% {
			background-color: #ff6700;
		}

		10% {
			background-color: #fb6e52;
		}

		20% {
			background-color: #ffce55;
		}

		30% {
			background-color: #a0d468;
		}

		40% {
			background-color: #48cfae;
		}

		50% {
			background-color: #4fc0e8;
		}

		60% {
			background-color: #5d9cec;
		}

		70% {
			background-color: #ac92ed;
		}

		80% {
			background-color: #ec87bf;
		}
	}

	.m-banner-img {
		width: 100%;
		/*height: 200upx;*/
		vertical-align: top;
		position: relative;
	}

	.m-user-info {
		text-align: center;
		/*
		position: absolute;
		top: 115upx;
		width: 140upx;
		height: 140upx;
		left: 50%;
		margin-left: -70upx;
		*/
		z-index: 3;
		color: #666;
		margin-top:100upx;
	}

	.m-user-info image {
		width: 140upx;
		height: 140upx;
		border-radius: 120upx;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);

		position: absolute;
		left:305upx;
	}

	.m-user-info .m-name {
		position: absolute;
		top:260upx;
		text-align: center;
		width: 750upx;
	}

	.m-user-info text, .m-user-info label {
		line-height: 70upx;

		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #fff;
		font-weight: bold;
	}

	.m-user-info .Phone {
		width: 140upx;
		height: 140upx;
		border-radius: 120upx;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);
		overflow: hidden;
	}

	.m-user-info .NickName {
		line-height: 70upx;
		display: block;
		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.member-order-tab {
		font-size: 12px;
		text-align: center;
		background: rgba(0, 0, 0, 0.1);
		line-height: 20px;
		/*box-shadow: 0px 0upx 10upx rgba(0, 0, 0, 0.35);*/

		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.i-type {
		font-size: 40upx;
	}

	.m-cell-hd {
		text-align: center;
		line-height: 56upx;
	}

	.member-order-tab .g-flex-item {
		padding: 28upx 0 20upx 0;
	}

	.member-order-tab .g-flex-item:active {
		background-color: #ececec;
	}

	.my_od {
		border-left: 1px solid #dfdfdf;
	}

	.all_order {
		position: relative;
		display: block;
	}

	.m-panel-bd {
		margin-top: 20upx;
	}

	.m-panel-bd label {
		vertical-align: middle;
		font-size: 50upx;
		margin: 0upx 10upx;
	}

	.m-cell-primary {
		font-size: 24upx;
		margin-top: 10upx;

		label {
			font-size: 24upx;
		}
	}

	.m-animate-img {
		width: 100%;
		height: 250upx;
		overflow: hidden;
		-webkit-animation: imageAnimation 15s linear infinite alternate;
		animation: imageAnimation 15s linear infinite alternate;
		webkit-backface-visibility: hidden;
		-webkit-filter: blur(5px);
		filter: blur(5px);
		margin-top: -20px;
	}

	.m-animate-warp {
		overflow: hidden;
		height: 200upx;
		-webkit-animation: imageAnimation 15s linear infinite alternate;
		animation: imageAnimation 15s linear infinite alternate;
	}

	@-webkit-keyframes imageAnimation {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: 0 100%;
		}
	}

	@keyframes imageAnimation {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: 0 100%;
		}
	}

	.iconBoxLattice .m-cell {
		display: inline-block;
		width: 25%;
		box-sizing: border-box;
		text-align: center;
		border-right: 1upx solid #f8f8f8;
		border-bottom: 1upx solid #f8f8f8;
	}

	.iconBoxLattice .m-cell .iconfont {
		font-size: 60upx;
	}

	.iconBoxLattice .m-cell::before {
		border: none;
	}

	.iconBoxLattice .m-cell p {
		font-size: 24upx;
	}

	.iconBoxLattice .m-cell label {
		font-size: 24upx;
	}

	.iconBoxLattice .m-cell label.iconfont {
		font-size: 60upx;
	}

	.iconBoxLattice .m-cell label.zc {
		font-size: 48upx;
	}

	.iconBoxLattice .m-cell image {
		display: inline-block !important;
		margin: 0 !important;
		padding: 0 !important;
		width: 60upx !important;
		height: 60upx !important;
	}

	.iconBoxLattice .m-cell-ft {
		display: none;
	}

	.msk {
		position: fixed;
		top: 0;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
	}

	.model {
		width: 80%;
		height: 290upx;
		background: #fff;
		border-radius: 6upx;
		margin: auto;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.hint {
		height: 200upx;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.hint::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-bottom: 1px solid #e5e5e5;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 200%;
		height: 200%;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		-webkit-transform-origin: left top;
		transform-origin: left top;
	}

	.hint .title {
		font-size: 36upx;
	}

	.hint .content {
		width: 80%;
		color: #999999;
		font-size: 30upx;
		margin-top: 20upx;
	}

	.operation {
		height: 90upx;
		display: flex;
		align-items: center;
	}

	.cancel,
	.success {
		flex: 1;
		background: #fff;
		height: 90upx;
		font-size: 36upx;
	}

	button::after {
		line-height: none;
	}

	.cancel {
		position: relative;
		text-align: center;
		line-height: 90upx;
	}

	.success {
		color: #3cc51f;
		padding: 0;
	}

	.cancel::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-right: 2px solid #e5e5e5;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 200%;
		height: 200%;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		-webkit-transform-origin: left top;
		transform-origin: left top;
	}

	.m-cell-bd label {
		margin: 0upx 5upx;
	}




	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 450upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 450upx;
		background-color: #FFFFFF;
	}
</style>
