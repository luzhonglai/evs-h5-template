<template>
	<view class="swiperContent">
		<swiper
			@change="change"
			@animationfinish="animationfinish"
			:indicator-dots="indicatorDots"
			:indicator-active-color="indicatorActiveColor"
			:indicator-color="indicatorColor"
			:current="current"
			:interval="interval"
			:duration="duration"
			:circular="circular"
			:vertical="vertical"
			:previous-margin="previousMargin"
			:next-margin="nextMargin"
			:display-multiple-items="displayMultipleItems"
			:skip-hidden-item-layout="skipHiddenItemLayout"
			:autoplay="(autoplay && flag)"
			:style="{'height':swiperHeight+'px'}"
			:class="(swiperType && displayMultipleItems ==1 && !vertical && !fullScreen)?'cardSwiper':'' "
			class="screen-swiper"
		>
			<swiper-item class="swiper-item"  v-for="(item,index) in swiperList" :key="index" :class="(cardCur==index && displayMultipleItems ==1 && !vertical &&  !fullScreen)?'cur':''"  @tap="tplGoToPage" :data-id="(item.did)" :data-name="(item.name)" :data-type="(item.selectType)" :data-keyword="(item.keyWord)" :data-appid="(item.AppId)" :data-appurl="(item.AppUrl)" :data-MinAppUrl="(item.MinAppUrl)">
				<view v-if="item[imageKey] && !item[videoKey]">
					<image :src="item[imageKey]"  :style="{'height':swiperHeight+'px'}"></image>
				    <text v-if="textTip" class="swiperText" :style="{
						'bottom':(swiperType?(textStyleBottom+12):textStyleBottom)+'%',
						'right':textStyleRight+'%',
						'color':textStyleColor,
						'background':textStyleBgcolor,
						'font-size':upxtopx(textStyleSize)
					}">{{item[textKey]}}</text>
				</view>
				<view v-if="item[videoKey]">
				<video :src="item[videoKey]" @play="play" @pause="pause" :style="{'height':swiperHeight+'px'}" autoplay loop muted :autoplay="videoAutoplay" objectFit="cover"></video>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item"  v-if="swiperList.length==0" >
				<text></text>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name:'bw-swiper',
		created:function(){
			var that = this;
			if(this.fullScreen){
				uni.getSystemInfo({
					success:function(e){
					that.swiperHeight = e.screenHeight -44
				}})
			}
		},
		mounted:function(){
			if(!this.fullScreen){
				const query = uni.createSelectorQuery().in(this);
				query.select('.swiper-item').boundingClientRect(data => {
					if(!!data){
						this.swiperHeight = data.width/this.w_h;
					}
				}).exec();
			}
		},
		props: {
			fullScreen:{ // 是否全屏
				type:Boolean,
				default:false
			},
			swiperList:{ // 滑块视图容器数据
				type:Array,
				required: true,
				default:function(){
					return []
				}
			},
			swiperType:{  // false => 全屏限高轮播图 true => 卡塔式轮播图
				type:Boolean,
				default:false
			},
			videoAutoplay:{ // true =>自动播放
				type:Boolean,
				default:false
			},
			videoKey:{  // 视频映射的键
				type:String,
				default:'src'
			},
			imageKey:{ //  图片映射的键
				type:String,
				default:'img'
			},
			textKey:{ //   文字说明映射的键
				type:String,
				default:'text'
			},
			textTip:{ // 图片文字说明 false => 隐藏
				type:Boolean,
				default:false
			},
			textStyleSize:{ // 图片文字大小
				type:Number,
				default:24
			},
			textStyleBottom:{ // 图片文字位置
				type:Number,
				default:5
			},
			textStyleRight:{ // 图片文字位置
				type:Number,
				default:5
			},
			textStyleColor:{ // 图片文字颜色
				type:String,
				default:'#ffffff'
			},
			textStyleBgcolor:{ // 图片文字背景色
				type:String,
				default:'transparent'
			},
			w_h:{  //宽高比 推荐 w/h => 2
				type:Number,
				default:2
			},
			skipHiddenItemLayout:{ //是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息
				type:Boolean,
				default:false
			},
			displayMultipleItems:{ //同时显示的滑块数量
				type:Number,
				default:1
			},
			nextMargin:{ // 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值 头条小程序不支持
				type:String,
				default:'0px'
			},
			previousMargin:{//前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值头条小程序不支持
				type:String,
				default:'0px'
			},
			vertical:{ //滑动方向是否为纵向 卡牌  不支持纵向以及同时显示的2块以上滑块数量
				type:Boolean,
				default:false
			},
			circular:{ // 是否采用衔接滑动
				type:Boolean,
				default:true
			},
			duration:{ // 滑动动画时长
				type:Number,
				default:400
			},
			interval:{ // 自动切换时间间隔
				type:Number,
				default:2500
			},
			current:{ // 当前所在滑块的 index
				type:Number,
				default:0
			},
			autoplay:{ // 是否自动切换
				type:Boolean,
				default:false
			},
			indicatorColor:{ // 指示点颜色
				type:String,
				default:'#CCCCCC'
			},
			indicatorActiveColor: { // 当前选中的指示点颜色
				type: String,
				default: '#ffffff'
			},
			indicatorDots: { // 是否显示面板指示点
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				flag:true,
				cardCur:0,
				swiperHeight:300
			}
		},
		computed:{

		},
		methods: {
			upxtopx:function(size){
				// #ifdef MP-WEIXIN
				return uni.upx2px(size)+'px'
				// #endif
				// #ifndef MP-WEIXIN
				return size+'upx';
				// #endif
			},
			play:function(){
				this.flag = false
			},
			pause:function(){
				this.flag = true
			},

			tplGoToPage: function(e) {
				let that = this;
				var t = e.currentTarget.dataset;
				switch (parseInt(t.type)) {
					case 1:
						that.$.gopage("/pages/product/detail?pid=" + t.id);
						break;
					case 2:
						that.$.gopage("/pages/product/list?category_id=" + (t.id || 0) + "&cname=" + t.name);
						break;
					case 3:
						that.$.gopage("/pages/product/list?pname=" + t.keyword);
						break;
					case 4: //快捷入口
						if (t.appurl.indexOf("article-list") >= 0) {
							that.$.gopage('/pagesub/article/list');
						} else if (t.appurl.indexOf("fightgroupsorderlist") >= 0) {
							that.$.gopage('/activity/fightgroup/order');
						} else if (t.appurl.indexOf("fightgroupslist/fightgroupslist") >= 0) {
							that.$.gopage('/activity/fightgroup/list');
						} else if (t.appurl.indexOf("bargainlist/bargainlist") >= 0) {
							that.$.gopage('/activity/cutprice/list');
						} else if (t.appurl.indexOf("receivecontent/receivecontent") >= 0) {
							that.$.gopage('/activity/coupon/list');
						} else if (t.appurl.indexOf("cashaccount/cashaccount") >= 0) {
							that.$.gopage('/member/cash/predeposit');
						} else if (t.appurl.indexOf("fanslist/fanslist") >= 0) {
							that.$.gopage('/member/fans/list');
						} else if (t.appurl.indexOf("nearbylist/nearbylist") >= 0) {
							that.$.gopage('/chain/chain/list');
						} else if (t.appurl.indexOf("kind_id=1202") >= 0) {
							that.$.gopage('/member/order/list?kind_id=1202');
						} else if (t.appurl.indexOf("endorsement/endorsement") >= 0) {
							that.$.gopage('/member/fans/endorsement');
						} else if (t.appurl.indexOf("?type=3&sl=3") >= 0) {
							that.$.gopage('/member/order/list?type=3&sl=3');
						} else if (t.appurl.indexOf("goodcollection/goodcollection") >= 0) {
							that.$.gopage('/member/member/favorites');
						} else if (t.appurl.indexOf("fansrank/fansrank") >= 0) {
							that.$.gopage('/member/fans/fansrank');
						} else if (t.appurl.indexOf("favorable/favorable") >= 0) {
							that.$.gopage('/chain/chain/favorable');
						} else if (t.appurl.indexOf("fanslist/fanslist") >= 0) {
							that.$.gopage('/member/fans/list');
						} else if (t.appurl.indexOf("scan/scan") >= 0) {
							that.$.gopage('/chain/chain/scan');
						} else if (t.appurl.indexOf("smashgoldeneggs/smashgoldeneggs") >= 0) {
							that.$.gopage('/activity/smashgoldeneggs/detail');
						} else if (t.appurl.indexOf("luckydraw/luckydraw") >= 0) {
							that.$.gopage('/member/luckydraw/detail');
						} else {
							that.$.gopage(t.appurl);
						}

						break;
					case 5:
						if (t.appurl.indexOf("fanslist/fanslist") >= 0) {
							that.$.gopage('/member/fans/list');
						} else {
							that.$.gopage("/pagesub/article/list?category_id=" + (t.id || 0));
						}
						//that.$.gopage(t.appurl);
						break;
					case 6:
						that.$.gopage("/pagesub/article/detail?id=" + t.id);
						//that.$.gopage(t.appurl);
						break;
					case 7:
						uni.navigateToMiniProgram({
							appId: t.appid,
							path: t.appurl || ""
						});
						break;
					case 8:
						that.$.gopage("/pagesub/diy-page/diy-page?id=" + t.id);
						break;
					case 9:
						that.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(t.appurl) + "&tn=" + t.name + "&tc=" + t.appid + "&tb=" +
								t.keyword);
						break;
					case 99:
						that.$.gopage(
								'/pagesub/webpage/web?u=' +
								encodeURIComponent(t.appurl) +
								'&tn=' +
								t.name +
								'&tc=' +
								t.appid +
								'&tb=' +
								t.keyword
						);

					case 10:
						that.$.gopage(t.appurl);
						break;
					case 11:
						that.$.gopage(t.appurl);
						break;
				}
			},

			clickItem:function(index){
				if(this.swiperList.length>0){
					this.$emit('clickItem',this.swiperList[index])
				}
			},
			change:function(e){
				this.$emit('change',e)
			},
			animationfinish:function(e){
				this.cardCur = e.detail.current;
				this.$emit('animationfinish',e)
			}
		}
	}
</script>

<style>
.cardSwiper .swiper-item{
	width:86%!important;
	overflow: initial;
}
.cardSwiper .swiper-item view{
	width: 100%;
	display: block;
	height: 100%;
	border-radius: 10upx;
	transform: scale(0.9,0.8);
	opacity: 0.7;
	transition: all 0.1s ease-in 0s;
	overflow: hidden;
	box-sizing: border-box;
	margin-left:8.1%;
}
.cardSwiper .cur  view{
	transform:  initial;
	opacity: 1;
	transition: all 0.1s ease-in 0s;
}
.swiper-item view{
	height:100%;
	width:100%;
	position: relative;
}
.swiperText{
	position: absolute;
	color:#ffffff;
	z-index:2;
	border-radius: 4upx;
	padding:0 4upx;
}
.screen-swiper image{
	width:100%;
}
.screen-swiper video,
.swiper-item video {
	width: 100%;
	display: block;
	height: 100%;
}
.swiperContent{
	width:100%;
}
</style>
