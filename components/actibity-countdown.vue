<template name="actibity-countdown">
		<view style="display: inline-flex;">
			<text style="float:left;">{{Type==0 ? __('距离本场开始还有') : __('距离本场结束还有')}}</text>
			<text class="uni-countdown-time">{{d}}</text>
			<text style="float:left;">{{__('天')}}</text>
			<text class="uni-countdown-time">{{h}}</text>
			<text style="float:left;">:</text>
			<text class="uni-countdown-time">{{i}}</text>
			<text style="float:left;">:</text>
			<text class="uni-countdown-time">{{s}}</text>
		</view>
</template>
<script>
	export default {
		name: "actibity-countdown",
		props: {
			bgrColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: "#FFFFFF"
			},
			fontColor: {
				type: String,
				value: "#FFFFFF"
			},
			splitorColor: {
				type: String,
				default: "#FFFFFF"
			},
			timer: {
				type: String,
				default: ""
			},
            Type: {
                type: Number,
                default: 0
            }
		},
		data() {
			return {
				setTime: null,
				d: '00',
				h: '00',
				i: '00',
				s: '00',
				leftTime: 0
			}
		},
		created: function(e) {
			var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
			var res = this.timer.match(reg);
			if (res == null) {
				//console.log('时间格式错误');
				return false;
			} else {
				var year = parseInt(res[1]);
				if (year < 1000) {
					//console.log('时间格式错误');
					return false;
				}
				var month = parseInt(res[2]);
				var day = parseInt(res[3]);
				var h = parseInt(res[4]);
				if (h < 0 || h > 24) {
					//console.log('时间格式错误');
					return false;
				}
				var i = parseInt(res[5]);
				if (i < 0 || i > 60) {
					//console.log('时间格式错误');
					return false;
				}
				var s = parseInt(res[6]);
				if (s < 0 || s > 60) {
					//console.log('时间格式错误');
					return false;
				}
				var leftTime = new Date(year, month - 1, day, h, i, s);
				this.leftTime = leftTime;
				this.countDown(this);
				this.setInterValFunc(this);
			}
		},
		beforeDestroy() {
			clearInterval(this.setTime)
		},
		methods: {
			setInterValFunc: function(obj) {
				this.setTime = setInterval(function() {
					obj.countDown(obj);
				}, 1000);
			},
			countDown: function(self) {
				var leftTime = self.leftTime - new Date();
				if (leftTime > 0) {
					var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
					var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);
					var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
					var seconds = parseInt(leftTime / 1000 % 60, 10);
				} else {
					var days = 0,
                    hours = 0,
						minutes = 0,
						seconds = 0;
				}


				if (days < 10) {
					days = '0' + days;
				}
				if (hours < 10) {
					hours = '0' + hours;
				}
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				if (seconds < 10) {
					seconds = '0' + seconds;
				}
				self.d = days;
				self.h = hours;
				self.i = minutes;
				self.s = seconds;
			}
		}
	}
</script>
<style>
	.uni-countdown {
		padding: 2upx 0;
		flex-wrap: nowrap;
		justify-content: center;
	}

	.uni-countdown-splitor {
		width: auto !important;
		justify-content: center;
		line-height: 44upx;
		padding: 0 5upx;
	}

	.uni-countdown-numbers {
		line-height: 44upx;
		width: auto !important;
		padding: 0 10upx;
		justify-content: center;
		height: 44upx;

		border-radius: 8upx;
		margin: 0 5upx;
		border: 1px solid #000000;
		font-size: 22upx;
	}
	.uni-countdown-time{
		background-color: #E72234;
		border-radius:40upx;
		width: 40upx;
		height: 40upx;
		font-size:26upx;
		font-family:PingFang SC;
		font-weight:400;
		color:#FFFFFF;
		line-height:40upx;
		margin:30rpx 6upx;
		float:left;
	}


</style>
