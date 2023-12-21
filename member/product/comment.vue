<template>
	<view class="page">
		<view :class="(show?'cover':'')" style="z-index:2">
		</view>
		<view class="m-box">
			<view class="m-box-item" v-for="(item, i) in CommentInfo.items"  style="z-index:1" :key="i">
				<view class="m-title" style="display: grid;">
					<view>
						<view class="m-pimg">
							<image lazy-load mode="scaleToFill" :src="(item.order_item_image)"></image>
						</view>
						<view style="font-size:24upx;color:#888;float:left;width: 540upx;">
							<label>
								{{item.item_name}}
							</label>
						</view>
				  </view>
					<view class="m-start">
						<view class="m-label">{{__('是否满意')}}</view>
						<view v-if="(item.order_item_evaluation_status==0)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"
						  :key="ii">
							<label :class="['iconfont', 'icon-start', (item.comment_scores!=null&&itemIndex<=item.comment_scores)?'sel':'']"
							 :data-index="(itemIndex)" data-type="4" :data-id="(item.item_id)" @click="ServiceStart"></label>
						</view>
						<view v-if="(item.order_item_evaluation_status==1)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"
						  :key="ii">
							<label :class="['iconfont',  'icon-start', (item.comment_scores!=null&&itemIndex<=item.comment_scores)?'sel':'']"></label>
						</view>
					</view>
				</view>
				<view v-if="(item.order_item_evaluation_status==0)" class="m-text">
					<textarea style="z-index:2" auto-height :placeholder="__('分享你的购买心得')" maxlength="200" :data-id="(item.item_id)" @input="inputOpinion" />
				</view>
				<view class="m-text" v-if="(item.order_item_evaluation_status==1)">
					<label :data-id="(item.item_id)" disabled="true" >{{item.comment_content}}</label>
				</view>
				<view class="m-upImg">
					<view class="m-upImg-item" :data-id="(item.item_id)" v-for="(imglist, ii) in item.comment_image"  :key="ii">
						<image lazy-load mode="aspectFit" :data-id="(item.item_id)" :src="(imglist)" @click="ImgTap"></image>
						<view v-if="(item.order_item_evaluation_status==0)" class="u-del-item" :data-id="(item.item_id)" :data-index="(ii)" @click.stop="delImg"><label class="iconfont icon-delete" :data-id="(item.item_id)" :data-index="(ii)"></label></view>
					</view>
					<view v-if="(item.order_item_evaluation_status==0)" class="m-upImg-item upSelect" :data-id="(item.item_id)" @click.stop="upImgs">
						<label :data-id="(item.item_id)" class="iconfont icon-xiangji"></label>
					</view>
				</view>
			</view>

		</view>
		<view class="m-VComment">
			<view class="m-VConmmenBox">
				<view class="m-label">{{__('描述相符')}}</view>
				<view v-if="(!isDisable)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
					<label :class="['iconfont',  'icon-start', (itemIndex<=CommentInfo.evaluation.store_desccredit)?'sel':'']" :data-index="(itemIndex)" :data-type="1" @click="ServiceStart"></label>
				</view>
				<view v-if="(isDisable)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
					<label :class="['iconfont',  'icon-start', (isDisable&&itemIndex<=CommentInfo.order_evaluation.comment_store_desc_credit)?'sel':'']"></label>
				</view>
			</view>
			<view class="m-VConmmenBox">
				<view class="m-label">{{__('服务态度')}}</view>
				<view v-if="(!isDisable)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
					<label :class="['iconfont',  'icon-start', (itemIndex<=CommentInfo.evaluation.store_servicecredit)?'sel':'']" :data-index="(itemIndex)" :data-type="2" @click="ServiceStart"></label>
				</view>
				<view v-if="(isDisable)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
					<label :class="['iconfont',  'icon-start', (isDisable&&itemIndex<=CommentInfo.order_evaluation.comment_store_service_credit)?'sel':'']"></label>
				</view>
			</view>
			<view class="m-VConmmenBox">
				<view class="m-label">{{__('发货速度')}}</view>
				<view v-if="(!isDisable)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
					<label :class="['iconfont',  'icon-start', (itemIndex<=CommentInfo.evaluation.store_deliverycredit)?'sel':'']" :data-index="(itemIndex)" :data-type="3" @click="ServiceStart"></label>
				</view>
				<view v-if="(isDisable)" class="m-startBox" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
					<label :class="['iconfont',  'icon-start', (isDisable&&itemIndex<=CommentInfo.order_evaluation.comment_store_delivery_credit)?'sel':'']"></label>
				</view>
			</view>
		</view>
		<view style="height:120upx;"></view>
		<view class="m-submitComment" v-if="(!isDisable)">
			<view class="m-subBtn" @click="submitComment">
				{{__('提交评价')}}
			</view>
		</view>
		<view class="alert" v-if="(show)" style="z-index:3">
			<image lazy-load style="width:50upx;height:50upx" src="/static/images/true.png"></image>
			<text style="margin-left:20upx" >{{Info}}</text>
		</view>
	</view>
</template>

<script>

var dataInfo = {
	evaluation: { store_desccredit: 0, store_servicecredit: 0, store_deliverycredit: 0 }
};

import paymentBox from '../../components/payment-box.vue';

import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			CommentInfo: {
				evaluation: { store_desccredit: 0, store_servicecredit: 0, store_deliverycredit: 0 }
			},
			CommentImgList: [],
			isDisable: !1,
			show: !1,
			Info: ''
		};
	},
	components: {
		paymentBox
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
			title:this.__('商品评价')
		});

		var that = this,
			params = { order_id: options.od, user_id: this.userInfo.user_id };
		that.$.request({
			url: this.Config.URL.user.order_comment_with_content,
			data: params,
			success: function(data, status, msg, code) {
				if (status == 200) {
					dataInfo = data;
					dataInfo.order_id = options.od;
					dataInfo.user_id = params.user_id;
					dataInfo.store_id = params.store_id;

					for (var i in dataInfo.items) {
						dataInfo.items[i].content = "";
						dataInfo.items[i].comment_content =  dataInfo.items[i].comment_content || ""
						
						
						dataInfo.items[i].comment_image = dataInfo.items[i].comment_image || [];

						if (dataInfo.items[i].order_item_evaluation_status == 1) {
							that.setData({ isDisable: !0 });
						}
					}

					dataInfo['evaluation'] = {
						store_desccredit: 0,
						store_servicecredit: 0,
						store_deliverycredit: 0
					};

					that.setData({ CommentInfo: dataInfo });
				}
			}
		});
	},
	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
		ServiceStart: function(e) {
			var dataInfo = this.CommentInfo;
			if (e.target.dataset.type == 1) {
				dataInfo.evaluation.store_desccredit = dataInfo.order_evaluation.store_desccredit =
					e.target.dataset.index;
			} else if (e.target.dataset.type == 2) {
				dataInfo.evaluation.store_servicecredit = dataInfo.order_evaluation.store_servicecredit =
					e.target.dataset.index;
			} else if (e.target.dataset.type == 3) {
				dataInfo.evaluation.store_deliverycredit = dataInfo.order_evaluation.store_deliverycredit =
					e.target.dataset.index;
			} else if (e.target.dataset.type == 4) {
				for (var t in dataInfo.items) {
					if (dataInfo.items[t].item_id == e.target.dataset.id) {
						//console.info(t);
						//console.info(e.target.dataset.index);

						this.$set(dataInfo.items[t], 'comment_scores', e.target.dataset.index);
						this.$set(dataInfo.items[t], 'scores', e.target.dataset.index);
					}
				}
			}

			//console.info(dataInfo);
			this.setData({ CommentInfo: dataInfo });
		},
		inputOpinion: function(e) {
			var dataInfo = this.CommentInfo;
			for (var t in dataInfo.items) {
				dataInfo.items[t].item_id == e.target.dataset.id &&
					(dataInfo.items[t].comment = dataInfo.items[t].comment_content =
						e.detail.value);
			}
			this.setData({ CommentInfo: dataInfo });
		},
		upImgs: function(e) {
			var that = this;
			var dataInfo = this.CommentInfo;
			for (var n in dataInfo.items) {
				if (
					dataInfo.items[n].item_id == e.target.dataset.id &&
					(dataInfo.items[n].comment_image && dataInfo.items[n].comment_image.length == 9)
				) {
					that.$.alert(that.__('最多上传9张图片！'));
					return;
				}
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
								for (var i in dataInfo.items) {
									if (dataInfo.items[i].item_id == e.target.dataset.id) {
										var s = up_res.data.url;
										dataInfo.items[i].comment_image.push(s);
										//console.info(s);
										//console.info(dataInfo.items[i]);
									}
								}
								that.setData({ CommentInfo: dataInfo });
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
			console.info(e);
			var dataInfo = this.CommentInfo;
			var that = this;
			that.$.confirm(
			that.__('是否放弃上传本张图片?'),
				function(n) {
					if (n.confirm) {
						for (var r in dataInfo.items) {
							if (dataInfo.items[r].item_id == e.target.dataset.id) {
								dataInfo.items[r].comment_image.splice(e.target.dataset.index, 1);
							}
						}
						that.setData({ CommentInfo: dataInfo });
					}
				},
				!0
			);
		},
		submitComment: function(e) {
			var that = this;
			var dataInfo = this.CommentInfo;
			for (var n in dataInfo.items) {
				if (that.$.isNull(dataInfo.items[n].comment_scores)) {
					that.$.alert(that.__('请对您购买的商品进行评分!'));
					return;
				}
			}
			if (that.$.isNull(dataInfo.order_evaluation.store_desccredit)) {
				that.$.alert(that.__('亲~请针对我们的描述给一个评分!'));
				return;
			}
			if (that.$.isNull(dataInfo.order_evaluation.store_servicecredit)) {
				that.$.alert(that.__('亲~请针对我们的服务给一个评分!'));
				return;
			}
			if (that.$.isNull(dataInfo.order_evaluation.store_deliverycredit)) {
				that.$.alert(that.__('亲~请针对我们的物流给一个评分!'));
				return;
			}
			that.$.confirm(
				that.__('是否发表评价?'),
				function(e) {
					if (e.confirm) {
						var params = {
							store_desccredit: dataInfo.order_evaluation.store_desccredit,
							store_servicecredit: dataInfo.order_evaluation.store_servicecredit,
							store_deliverycredit: dataInfo.order_evaluation.store_deliverycredit,
							order_id: dataInfo.order_id,
							user_id: dataInfo.user_id,
							store_id: dataInfo.store_info.store_id,
							item: JSON.stringify(dataInfo.items)
						};
						that.$.request({
							method: "POST",
							url: that.Config.URL.user.add_order_comment,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert(that.__('发表成功！'), function() {
										/*
										that.setData({
											show: !0,
											Info: msg
										});
										setTimeout(function() {
											that.setData({ show: !1 });
										}, 2e3);
										
										*/
									   uni.$emit("refreshComment", dataInfo.order_id)
										setTimeout(function() {
											that.$.navigateBack(1);
										}, 2e3);
									});
								} else if ( status == 250 ) {
									that.$.alert(msg);
									return;
								}
							},
						});
					}
				},
				!0
			);
		},
		ImgTap: function(e) {
			var that = this,
				urls = [];

			for (var r in this.CommentInfo.items) {
				if (this.CommentInfo.items[r].item_id == e.target.dataset.id) {
					for (var i in this.CommentInfo.items[r].comment_image) {
						urls.push(this.CommentInfo.items[r].comment_image[i]);
					}
				}
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
}
.m-pimg {
	width: 140upx;
	height: 140upx;
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
}
.m-startBox {
	display: inline-block;
	color: #eee;
}
.m-startBox label {
	padding: 0 5px;
	font-size: 36upx;
}
.sel {
	color: $default-skin-bg;
}
.m-VComment {
	background-color: #fff;
	padding: 20upx;
	margin-top: 20upx;
}
.m-VConmmenBox:first-child {
	margin-bottom: 10upx;
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
