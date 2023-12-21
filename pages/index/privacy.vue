<template>
	<!-- 弹出层 -->
	<view class="uni-banner" style="background:#FFFFFF;"  v-if="loaded">
		<view :style="'height: ' + h + 'px; width:750uxp;padding:50upx;'">
			<scroll-view scroll-y="true"  :style="'height: ' + h + 'px; '">
					<wxParse :content="protocol_text"  />
			</scroll-view>
		</view>
		<view style="height:50px;text-align: center;">
            <view class="button-sp-area">
                <button class="mini-btn" type="default" size="mini" @tap="disagree">{{__('不同意')}}</button>

                <button class="mini-btn" type="warn" size="mini" style="margin-left: 100upx;" @tap="agree">{{__('同意')}}</button>
            </view>
		</view>
	</view>
</template>

<script>

	import wxParse from '@/components/u-parse/u-parse.vue'
	export default {
		data() {
			return {
				protocol_text:'',
				loaded:false,
				h:0
			}
		},
		components: {
			wxParse
		},
		onLoad(){
			var h = this.$.getSystemInfoSync().windowHeight;

			this.setData({
				h: h-50-50
			})

			//console.info(h)


			if (plus.os.name.toLowerCase() === 'android')
			{
				this.loadExecution()
			}
			else
			{
				this.launchFlag();
			}
		},
		methods: {
			loadExecution: function(){
				/**
				 * 获取本地存储中privacyFlag的值
				 * 若存在，说明不是首次启动，直接进入首页；
				 * 若不存在，说明是首次启动，进入引导页；
				 */
				try {
				    const value = uni.getStorageSync('privacyFlag');
				    if (value) {
				        if (value == true) {
				            this.$.gotopage('/pages/index/guide');
				        } else {
								this.getProtocal();
				        }
				    } else {
						this.getProtocal();
				    }
				} catch(e) {
					// error
					uni.setStorage({
						key: 'privacyFlag',
						data: true,
						success: function () {
							//console.log('error时存储privacyFlag');
						}
					});

					this.$.gotopage('/pages/index/guide');
				}

				return ;
			},
			launchFlag: function(){
				uni.setStorage({
				    key: 'privacyFlag',
				    data: true,
				    success: function() {
						//console.log('存储privacyFlag');
					}
				});

				this.$.gotopage('/pages/index/guide');
			},

			getProtocal: function() {
				let that = this;

				that.$.request({
				    url: that.cf.URL.protocol,
				    data: {},
				    success: function (data, status, msg, code) {
				        that.protocol_text = data.document;
						that.loaded = true;
				    }
				});
			},
			disagree: function() {
				let that = this;
				uni.showModal({
					title: '',
					content: that.__('十分抱歉，若您不同意《用户协议与隐私政策》，我们将无法为您提供服务器'),
					cancelText:that.__('关闭应用'),
					confirmText:that.__('我再想想'),
					success: function (res) {
						if (res.confirm) {
						} else if (res.cancel) {
							plus.runtime.quit();
						}
					}
				});
			},

			agree: function() {
				let that = this;

				that.launchFlag();
			},

		}
	}
</script>
<style>

</style>
