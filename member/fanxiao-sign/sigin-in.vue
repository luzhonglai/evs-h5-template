<template>
	<view>
		<view class="sign_conent_box">
			<view class="sign_conent">
				<view class="sign_conent_title">
					本月你已连续签到
					<span class="sign_conent_title_span">{{ signDays || 0 }}</span>
					天
				</view>
				<view class="sign_list_aligns">
					<scroll-view class="scroll-view_H" scroll-x="true">
						<view class="scroll_view_items" v-for="(item, index) in signList" :key="index">
							<!--  -->
							<view class="scroll_view_itemsv">
								<view class="scroll_view_item">
									<view class="scroll_view_item_img_box">
										<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/images/sign_bg.png" class="scroll_view_item_img"
											mode=""></image>
										<view class="scroll_view_item_top">{{ item.value_str }}</view>
										<!-- <view class="scroll_view_item_bottom">一张</view> -->
									</view>
									<view class="scroll_view_item_tips">签到{{ item.days }}天</view>
								</view>
								<view class="scroll_xian" v-show="index !== signList.length - 1"></view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-if="!isSign" class="sign_conent_btn" @click="cksigin">今日签到</view>
				<view v-else class="is_sign_conent_btn">已签到</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			is_sign: 0,
			continue_sign_days: 0,
			sign_list: [],
		},
		watch: {
			is_sign: function(val, oldVal) {
				this.isSign = val
			},
			continue_sign_days: function(val) {
				this.signDays = val
			},
			sign_list: function(val) {
				this.signList = val;
			}
		},
		data() {
			return {
				signDays :0,
				isSign :0,
				signList : [],
			};
		},
		methods: {
			cksigin() {
				this.$emit('click', '');
			}
		}
	};
</script>

<style lang="scss">
	.sign_conent_box {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 50upx;

		.sign_conent {
			width: 686upx;
			background: white;
			border-radius: 20upx;
			padding: 40upx 32upx;
			box-sizing: border-box;

			.sign_conent_title {
				width: 100%;
				font-size: 36upx;
				font-weight: bold;
				color: #333333;

				.sign_conent_title_span {
					color: #ff6526 !important;
				}
			}

			.sign_list_aligns {
				width: 100%;
				padding: 48upx 0 64upx 0;
				box-sizing: border-box;

				.scroll-view_H {
					width: 100%;
					display: flex;
					white-space: nowrap;

					.scroll_view_items {
						display: inline-block;
					}

					.scroll_view_itemsv {
						display: flex;
					}

					.scroll_view_item {
						.scroll_view_item_img_box {
							width: 108upx;
							height: 108upx;
							position: relative;

							.scroll_view_item_top {
								font-size: 20upx;
								color: #bf8d46;
								font-weight: bold;
								position: absolute;
								top: 32upx;
								width: 100%;
								text-align: center;
								z-index: 1;
							}

							.scroll_view_item_bottom {
								font-size: 12upx;
								color: #ffe29d;
								position: absolute;
								bottom: 18upx;
								left: 42upx;
								z-index: 2;
							}
						}

						.scroll_view_item_tips {
							width: 108upx;
							text-align: center;
							font-size: 26upx;
							padding-top: 16upx;
							color: #333333;
						}

						.scroll_view_item_img {
							width: 108upx;
							height: 108upx;
							position: absolute;
							top: 0;
							left: 0;
							z-index: 0;
						}
					}

					.scroll_xian {
						width: 64upx;
						height: 2upx;
						background: #ffe4d9;
						margin-top: 52upx;
					}
				}
			}

			.sign_conent_btn {
				width: 100%;
				border-radius: 45upx;
				background: linear-gradient(270deg, #fcae3a 0%, #f15d25 100%);
				color: #ffffff;
				text-align: center;
				padding: 22upx 0;
				font-size: 32upx;
			}

			.is_sign_conent_btn {
				width: 100%;
				border-radius: 45upx;
				background: #666;
				color: #ffffff;
				text-align: center;
				padding: 22upx 0;
				font-size: 32upx;
			}
		}
	}
</style>
