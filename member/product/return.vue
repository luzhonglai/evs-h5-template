<template>
	<view class="page">
		<view :class="(show?'cover':'')" style="z-index:2">
		</view>
		<view class="m-box" v-if="is_data">
			<view class="m-box-item" style="z-index:1">
				<view class="m-title">
					<view class="m-pimg" style="width: 96upx;">
						<image lazy-load mode="scaleToFill" :src="(data_info.order.item.order_item_image)"></image>
					</view>
					<view style="font-size:24upx;color:#888;float:left;width: 614upx;">
						<label>
							{{data_info.order.item.item_name}}
						</label>
						<label>
							{{__('￥')}}{{data_info.order.item.order_item_unit_price}} x {{data_info.order.item.order_item_quantity}}
						</label>
					</view>
				</view>
				<view class="m-text">
					<textarea style="z-index:2" auto-height v-model="return_buyer_message" :placeholder="__('退款原因')"  placeholder-class="placeholder-class" maxlength="200"
					 @input="inputOpinion" />
					</view>
				<view class="m-upImg">
					<view class="m-upImg-item"  v-for="(imglist, ii) in data_info.comment_image"   :key="ii">
						<image lazy-load mode="aspectFit"  :src="(imglist)" @click="ImgTap"></image>
						<view v-if="true" class="u-del-item"  :data-index="(ii)" @click.stop="delImg"><label class="iconfont icon-delete" :data-index="(ii)"></label></view>
					</view>
					<view v-if="true" class="m-upImg-item upSelect"  @click.stop="upImgs">
						<label  class="iconfont icon-xiangji"></label>
					</view>
				</view>
			</view>

		</view>
		<view class="m-VComment">
			<view class="m-VConmmenBox">
				<view class="m-label">{{__('退款金额')}}</view>
				<view class="m-startBox">
					<input v-model="return_refund_amount" type="digit"  :placeholder="__('请输入退款金额')" placeholder-class="placeholder-class"  style="line-height: 80upx;height: 80upx;"></input>

				</view>
				<view class="m-label m-right">{{sprintf(__('可退金额 ￥ %s'), data_info.order.item.order_item_can_refund_amount)}}</view>
			</view>
			<view class="m-VConmmenBox">
						<view class="m-label">{{__('退货数量')}}</view>
						<view class="m-startBox">
							<input v-model="return_item_num" type="number" :placeholder="__('请输入退货数量')"  placeholder-class="placeholder-class"  style="line-height: 80upx;height: 80upx;"></input>
						</view>
				<view class="m-label m-right">{{sprintf(__('可退数量 %s'), data_info.order.item.order_item_can_return_num)}}</view>
			</view>
			<view class="m-VConmmenBox">
						<view class="m-label">{{__('联系方式')}}</view>
						<view class="m-startBox">
							<input v-model="return_tel" type="number" :placeholder="__('请输入联系方式')"  placeholder-class="placeholder-class"  style="line-height: 80upx;height: 80upx;"></input>
						</view>
			</view>

		</view>
		<view style="height:120upx;"></view>
		<view class="m-submitComment" v-if="(!isDisable)">
			<view class="m-subBtn" @click="submitComment">
				{{__('提交退货申请')}}
			</view>
		</view>
		<view class="alert" v-if="(show)" style="z-index:3">
			<image lazy-load style="width:50upx;height:50upx" src="/static/images/true.png"></image>
			<text style="margin-left:20upx" >{{Info}}</text>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			data_info: { order: {item:{}}, comment_image: [] },
			CommentImgList: [],
			isDisable: !1,
			show: !1,
			Info: '',
			is_data: false,
			param: {},

			order_item_id: '',
			return_buyer_message:'',
			return_refund_amount:'',
			return_item_num:'',
			return_tel: ''
		};
	},
	computed: mapState([
		'Config',
		'StateCode',
		'notice',
		'plantformInfo',
		'shopInfo',
		'userInfo',
		'hasLogin'
	]),
	onLoad: function(options) {
		uni.setNavigationBarTitle({
			title:this.__('售后申请')
		});

		this.setData({
			order_item_id: options.order_item_id
		})
		this.refreshData(options)
	},
	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
		refreshData: function(options){
					var that = this;
			var params = { order_id: options.order_id, order_item_id: options.order_item_id };

			that.$.request({
				url: this.Config.URL.user.return_item,
				data: params,
				success: function(data, status, msg, code) {
					data.comment_image = [];

					if (status == 200) {
						that.setData({ data_info: data, is_data: true, param: params });
					}
				}
			});
		},
		inputOpinion: function(e) {
			var param = this.param;
			param.return_buyer_message = e.detail.value;

			this.setData({ param: param });
		},
		upImgs: function(e) {
			var that = this;
			var dataInfo = this.data_info;
			if (dataInfo.comment_image && dataInfo.comment_image.length == 9) {
				that.$.alert('最多上传9张图片！');
				return;
			}
			let ukey = uni.getStorageSync('ukey');
			//that.$.showLoading();
				that.$.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: function(n) {
						that.$.showLoading();
						var r = n.tempFilePaths;
						that.$.uploadFile({
							url: that.Config.URL.upload,
							method: 'POST',
							filePath: r[0],
							name: 'upfile',
							formData: {'perm_key':ukey},
							//header: { 'content-type': 'multipart/form-data' },
							success: function(n) {
								that.$.hideLoading();
								var up_res = that.$.parseJSON(n.data);

								var s = up_res.data.url;
								dataInfo.comment_image.push(s);
								that.setData({ data_info: dataInfo });
							},
							fail: function(e) {
								that.$.hideLoading();
							},
							complete: function(e) {
								that.$.hideLoading();
							}
						});
					},
					fail: function(e) {
						that.$.hideLoading();
					},
					complete: function(e) {
						that.$.hideLoading();
					}
				});
		},
		delImg: function(e) {
			//console.info(e);
			var dataInfo = this.data_info;
			var that = this;
			that.$.confirm(
				'是否放弃上传本张图片?',
				function(n) {
					if (n.confirm) {
						var i = [];
						for (let s = 0; s < dataInfo.comment_image.length; s++) {
							if (s != e.target.dataset.index) {
								var o = dataInfo.comment_image[s];
								i.push(o);
							}
						}
						dataInfo.comment_image = i;

						that.setData({ data_info: dataInfo });
					}
				},
				!0
			);
		},
		submitComment: function(e) {
			var that = this;
			var dataInfo = this.data_info;
		
			if (!that.return_refund_amount)
			{
				that.$.showModal({
					title: "提示",
					content: "退款金额必填！",
					showCancel: !1,
				})
				return;
			}
			
			if (that.return_refund_amount < 0)
			{
				that.$.showModal({
					title: "提示",
					content: "退款金额必须是正数！",
					showCancel: !1,
				})
				return;
			}
			
			if (that.return_refund_amount > dataInfo.order.item.order_item_can_refund_amount)
			{
				that.$.showModal({
					title: "提示",
					content: "退款金额必须小于可退金额！",
					showCancel: !1,
				})
				return;
			}

			if (that.return_item_num > that.data_info.order.item.order_item_can_return_num)
			{
				that.$.showModal({
					title: "提示",
					content: "退货数量必须小于等于可退数量！",
					showCancel: !1,
				})
				return;
			}

			if (!that.return_item_num)
			{
				that.$.showModal({
					title: "提示",
					content: "退货数量必填！",
					showCancel: !1,
				})
				return;
			}			
			
			var g = /^[1-9]*[1-9][0-9]*$/;
			if(!g.test(that.return_item_num))
			{
				that.$.showModal({
					title: "提示",
					content: "退货数量必须是正整数！",
					showCancel: !1,
				})
				return;
			}

			that.$.confirm(
				'确认退货?',
				function(e) {
					if (e.confirm) {
						var comment_image = ''
						if (dataInfo.comment_image) {
							comment_image = dataInfo.comment_image.toString()
						}
						var params = {
							order_id: dataInfo.order.order_id,
							order_item_id: that.order_item_id,
							return_refund_amount:that.return_refund_amount,
							return_item_num:that.return_item_num,
							return_buyer_message:that.return_buyer_message,
							upload_img:comment_image,
							refund_type: 2,
							return_tel: that.return_tel,
						};
						that.$.request({
							url: that.Config.URL.user.return_add_one,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert('申请退货成功！', function() {
										let url = that.$.sprintf('/member/member/returndetail?return_id=%s', data.return.return_id)
										that.$.gopage(url);

										/*
										setTimeout(function() {
											that.$.navigateBack(1);
										}, 2e3);
										*/
									});
								}
								else
								{
									that.$.showModal({
										title: "提示",
										content: msg,
										showCancel: !1,
									})
								}
							}
						});
					}
				},
				!0
			);
		},
		ImgTap: function(e) {
			var that = this,
				urls = [];

			for (var i in this.data_info.comment_image) {
				urls.push(this.data_info.comment_image[i]);
			}
			var s = e.target.dataset.src;

			that.$.previewImage({ current: s, urls: urls });
		}
	}
};
</script>


<style lang="scss">
@import '../../styles/_variables';

.m-box-item {
	margin-bottom: 20upx;
}
.m-title {
	box-sizing: border-box;
	height: 260upx;
	background-color: #fff;
	border-bottom: 1px solid #eee;
	padding: 20upx;
	height:120upx;
	display: inline-flex;
}
.m-pimg {
	width: 90upx;
	height: 90upx;
	background-color: sandybrown;
	margin-right: 20upx;
	vertical-align: middle;
	float: left;
}
.m-pimg image {
	width: 100%;
	height: 100%;
}
.m-start {
	height: 70upx;
	display: inline-block;
	vertical-align: middle;
	line-height: 70upx;
	float: left;
}
.m-label {
	font-size: 28upx;
	color: #333;
	vertical-align: middle;
	margin-right: 10upx;
	display: inline-block;
	line-height: 80upx;
	height: 80upx;
	width: 120upx;
}
.m-startBox {
	display: inline-block;
	/* color: #eee; */
	width: 360upx;
}
.m-startBox label {
	padding: 0 5px;
	font-size: 36upx;
}

.m-right {
	width: 260upx;
	color: #36BC9B;
	font-size: 26upx;
}

.sel {
	color: $default-skin-bg;
}
.m-VComment {
	background-color: #fff;
	padding: 20upx;
	margin-top: 20upx;
}

.m-VConmmenBox {
	/* margin-bottom: 10upx; */
	display: inline-flex;
}

.m-VConmmenBox:first-child {
	/* margin-bottom: 10upx; */
	display: inline-flex;
}
.m-text {
	box-sizing: border-box;
	padding: 10upx 10upx 0 10upx;
	background-color: #fff;
	font-size: 24upx;
	min-height: 100upx;
	font-size: 28upx;
	line-height: 40upx;
}
.m-text textarea {
	width: 100%;
	height: 100%;
}
.m-upImg {
	box-sizing: border-box;
	padding: 20upx;
	background-color: #fff;
}
.m-upImg-item {
	width: 120upx;
	height: 120upx;
	border: 1px solid #eee;
	display: inline-block;
	margin: 9upx;
	border-radius: 4upx;
	vertical-align: middle;
	position: relative;
}
.m-upImg-item image {
	width: 100%;
	height: 100%;
}
.u-del-item {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 40upx;
	background-color: rgba(0, 0, 0, 0.5);
	text-align: center;
	line-height: 40upx;
	color: #fff;
	z-index: 5;
}
.u-del-item label {
	font-size: 28upx;
}
.upSelect {
	background-color: #eee;
	text-align: center;
	line-height: 120upx;
}
.upSelect label {
	font-size: 40upx;
}
.m-submitComment {
	position: fixed;
	height: 100upx;
	width: 100%;
	background-color: #fff;
	border-top: 1px solid #eee;
	z-index: 5;
	left: 0;
	bottom: 0;
}
.m-subBtn {
	float: right;
	padding: 0 20upx;
	height: 100%;
	background-color: $default-skin-bg;
	color: #fff;
	font-size: 28upx;
	line-height: 100upx;
}
.m-media-box-desc {
	display: block;
}
.alert {
	font-size: 32upx;
	width: 70%;
	padding: 0 40upx;
	height: 200upx;
	position: absolute;
	left: 10%;
	top: 40%;
	background: #fff;
	border-radius: 10upx;
	justify-content: center;
	display: flex;
	align-items: center;
	z-index: 999;
}
.cover {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0px;
	background: rgba(0, 0, 0, 0.4);
	overflow: hidden;
	z-index: 998;
}
</style>
