<template>
	<view class="page">
		<view v-if="loadComplete">
			<block v-if="isdata && !issshow">
				<scroll-view class="m-nearbylist" scroll-y="true" @scrolltolower="scrollbottom">
					<view class='list-box' @click="gopage" v-for="(item, index) in Info" :key="index" :data-chain_id="(item.chain_id)" :data-chain_name="(item.chain_name)">
						<view class='item-box'>
							<view class='flex-box'>
								<image :src='item.chain_img' class='flex-shop'></image><label class='flex-title'>{{item.chain_name}}</label>
								<view class='flex-postion'>
									<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/location.png'></image><label>{{item.distance}}</label>
								</view>
							</view>
							<view class='flex-info'>
								<view class='flex-info-box' @click.stop="call" :data-phone="item.chain_mobile"><label class='flex-info-title'>{{__('商家电话：')}}</label><label
									 style='color:#0095fd'>{{item.chain_mobile}}</label></view>
								<view class='flex-info-box' @click.stop="gotomap"  :data-chain_id="(item.chain_id)" :data-chain_name="(item.chain_name)"  :data-address="(item.chain_district_info)"
					 :data-name="(item.chain_name)" :data-lat="(item.chain_lat)" :data-lng="(item.chain_lng)"><label class='flex-info-title'>{{__('商家地址：')}}</label><label>{{item.chain_district_info}}</label></view>
								<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/right.png'></image>
							</view>
						</view>
					</view>
					<view class="m-loading-box">
						<block v-if="ispage && !issshow">
							<view class="u-loadmore">
								<label class="u-loading"></label><text class="u-loadmore-tips">{{__('正在加载')}}</text>
							</view>
						</block>
						<block v-if="!ispage && !issshow">
							<view class="u-loadmore u-loadmore-line"><text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text></view>
						</block>
					</view>
				</scroll-view>
			</block>
			<view class="m-nullcontent" v-if="!isdata">
				<view class="m-nullpage-middle"><label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip"><text>{{__('亲~什么都没有')}}</text><text>{{__('附近没什么门店!')}}</text></view>
				</view>
			</view>
		</view>
		<view v-if="isdata && issshow" class='open_ba'>
			<view style="width: 200upx;/*height: 100px*/margin: 71px auto 25px auto;wxcs_style_margin: 143upx auto 50upx auto;auto: 50upx auto;">
				<image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/img/ditulogo.png' style="width: 200upx;height: 200upx;/*margin: 0 auto;*/"></image>
			</view>
			<view style="font-size: 28upx;">{{__('无法获取到您的定位，请开启地理位置权限，将根据你的位置展示附近门店。')}}</view><button style="width: 34%;height: 79upx;background: #33cc66;margin: 39px auto 0 auto;wxcs_style_margin: 79upx auto 0 auto;color: #fff;line-height: 80upx;text-align: center;"
			 open-type="openSetting" @opensetting="handler">{{__('去开启')}}</button>
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
				options: {},
				page: 1,
				ispage: !0,
				flag: !0,
				Info: [],
				latitude: 0,
				longitude: 0,
				isdata: !1,
				issshow: 0,
				item_id: 0,
				store_id: null,
				chain_id: null,
				rows: 10,
				loadComplete: false // 没有加载数据前不显示的对应内容
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('附近门店')
			});

			var that = this;
			that.setData({
				options: options,
				store_id: options.store_id ? options.store_id : '',
				item_id: options.item_id ? options.item_id : ''
			});

			that.$.getLocation({
				type: "wgs84",
				success: function(response) {
					that.setData({
						latitude: response.latitude,
						longitude: response.longitude
					});

					that.getNearbylist()
				},
				fail: function() {
					that.setData({
						isdata: !0
					});

					that.$.confirm(that.__('手机定位失败！'));

					that.getNearbylist()
				}
			})
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getNearbylist: function() {
				var that = this;
				var params = {
					lat: that.latitude,
					lng: that.longitude,
					page: that.page,
					rows: that.rows,
					store_id: that.options.store_id ? that.options.store_id : '',
					item_id: that.options.item_id ? that.options.item_id : '',
				};
				that.$.request({
					url: this.Config.URL.store.getNearChain,
					data: params,
					dataType: 'json',
					success: function(data, status, msg, code) {
						if (status == 200) {
							for (let i = 0; i < data.items.length; i++) {
								data.items[i]['distance'] = that.$.distanceFormat(data.items[i]['distance']);

								let coord = that.$.bMapTransQQMap(data.items[i]['chain_lng'], data.items[i]['chain_lat']);
								data.items[i]['chain_lng'] = coord.lng;
								data.items[i]['chain_lat'] = coord.lat;
							}

							that.setData({
								isdata: !0,
								loadComplete: !0
							});

							if (data.page >= data.total) {
								that.setData({
									flag: !1,
									ispage: !1,
									Info: that.Info.concat(data.items)
								})
							} else {
								that.setData({
									flag: !0,
									ispage: !0,
									Info: that.Info.concat(data.items)
								})
							}

						} else {
							that.setData({
								flag: !1,
								ispage: !1,
								loadComplete: !0
							});
						}
					},
					fail: function(data) {
						that.setData({
							loadComplete: !0
						});
						that.$.alert("网络异常请重试！");
					}
				});
			},
			gotomap: function(e) {
				var that = this;
				if (that.options.issub) {
					that.backCheckout(e.currentTarget.dataset);
				} else {
					that.$.openLocation({
						latitude: parseFloat(e.currentTarget.dataset.lat),
						longitude: parseFloat(e.currentTarget.dataset.lng),
						name: e.currentTarget.dataset.name,
						address: e.currentTarget.dataset.address,
						scale: 28
					})
				}
			},
			gopage:function(e){
				var that = this;
				if (that.options.issub) {
					that.backCheckout(e.currentTarget.dataset);
				} else if(that.options.is_flag){
					that.setChain(e.currentTarget.dataset);
				}else {
					this.$.gotopage('/chain/chain/index?chain_id=' + e.currentTarget.dataset.chain_id)
				}
			},
			backCheckout: function(data) {
				let that = this;
				var options = this.options;
				options.chain_id = data.chain_id;

				var params = {};
				var info_list = this.Info;
				for (var r = 0; r < info_list.length; r++) {

					if (info_list[r].chain_id == data.chain_id)
					{
						params = info_list[r];
					}
				}

				options.ChainInfo = params;

				//uni.setStorageSync('chain_id', data.chain_id);
				//uni.setStorageSync('chain_name', data.chain_name);

				that.$.navigateBack(1, function() {
					that.notice.postNotificationName("RefreshOrderChain", options)
				})
			},
			scrollbottom: function() {
				if (this.flag) {
					var e = this;
					e.setData({
						flag: !1
					}), clearTimeout(t);
					var t = setTimeout(function() {
							e.setData({
								type: e.type,
								page: parseInt(e.page) + 1,
								rows: 10
							}), e.getNearbylist()
						},
						500)
				}
			},
			setChain:function(e){
				var that = this;
				 //console.log(e);
				that.$.showModal({
				    title: '提示',
				    content: '确定该门店成为您的默认自提点吗？',
				    success: function (res) {
				        if (res.confirm) {
				           uni.setStorageSync('chain_id', e.chain_id);
				           uni.setStorageSync('chain_name', e.chain_name);

						   var params = {
						   	chain_id: e.chain_id
						   };

						   that.$.request({
						   	url: that.Config.URL.setChain,
						   	data: params,
						   	dataType: 'json',
						   	success: function(data, status, msg, code) {
						   		if (status == 200) {
						   			that.$.gopage('/pages/index/index')
						   		} else {
						   			that.$.alert('设置失败，请重新选择')
						   		}
						   	}
						   });
				        }
				    }
				});
			},
			selectchain: function(e) {
				var params = {},
					info_list = this.Info;
				for (var r = 0; r < info_list.length; r++) info_list[r].chain_id == e.currentTarget.dataset.chain_id && (params =
					info_list[r]);
				var that = this;
				that.$.navigateBack(1, function() {
					var e = {
						chain_id: that.chain_id,
						spinfo: that.spid,
						ChainInfo: params
					};
					that.notice.postNotificationName("RefreshOrderChain", e)
				})
			},
			selectAddress: function(e) {
				var params = {},
					info_list = this.Info;
				for (var r = 0; r < info_list.length; r++) info_list[r].chain_id == e.currentTarget.dataset.chain_id && (params =
					info_list[r]);
				var that = this;
				that.$.navigateBack(1, function() {
					var e = {
						chain_id: that.chain_id,
						spinfo: that.spid,
						ChainInfo: params
					};
					that.notice.postNotificationName("RefreshOrderChain", e)
				})
			},
			call: function(e) {
				let that = this;
				that.$.makePhoneCall({
					phoneNumber: e.currentTarget.dataset.phone
				})
			}
		}

	}
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.list-box {
		background-color: #fff;
		color: #333;
	}

	.item-box {
		padding: 20upx;
		border-bottom: 1upx solid #eee;
	}

	.flex-box {
		display: flex;
		align-items: center;
		position: relative;
	}

	.flex-shop {
		width: 34upx;
		height: 34upx;
	}

	.flex-title {
		font-size: 30upx;
		margin-left: 10upx;
		max-width: 75%;
		overflow: hidden;
		height: 40upx;
		line-height: 40upx;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.flex-postion {
		display: flex;
		align-items: center;
		position: absolute;
		right: 0;
	}

	.flex-postion image {
		width: 20upx;
		height: 26upx;
	}

	.flex-postion label {
		font-size: 24upx;
		color: #9b9b9b;
		margin-left: 10upx;
	}

	.m-nearbylist {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.flex-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.flex-info view {
		margin: 10upx 0 0 0;
		font-size: 28upx;
	}

	.flex-info-box {
		display: flex;
		align-items: flex-start;
	}

	.flex-info label {
		display: inline-block;
		vertical-align: top;
		word-wrap: break-word;
		width: 520upx;
	}

	.flex-info image {
		width: 40upx;
		height: 40upx;
		position: absolute;
		right: 10upx;
	}

	.flex-info-title {
		flex-basis: 145upx;
	}

	.open_ba {
		width: 80%;
		margin: 0 auto
	}

	.open_dl {
		width: 34%;
		height: 79upx;
		background: #33cc66;
		border-radius: 20upx;
		text-align: center;
		color: #fff;
		margin: 79upx auto 0 auto;
		line-height: 75upx;
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
		display: flex;
		align-items: center;
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

	.m-nearbylist {
		height: 100%;
		position: absolute
	}
</style>
