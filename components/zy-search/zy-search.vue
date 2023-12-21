<template name="zy-search">
	<view>
		<view class="search">
			<slot></slot>
			<!-- 使用$emit触发实例上(父组件)的自定义方法并传入参数 -->
			<!-- <button type="primary" @click="$emit('test','block')">方形</button> -->
			<!-- sync双向数据绑定语法糖 -->
			<!-- <button type="primary" @click="changeStyle">双向数据绑定改变style</button> -->
			<!-- #ifdef APP-PLUS -->
				<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/zy-search/voice.svg" mode="aspectFit" @click="startRecognize()" class="voice-icon"></image>
			<!-- #endif -->
			<template v-if="isFocus">
				<input maxlength="20" focus type="text" value="" confirm-type="search" @confirm="searchStart()" :placeholder="__('请输入关键词搜索')" v-model.trim="searchText"/>
			</template>
			<template v-else>
				<input maxlength="20" type="text" value="" confirm-type="search" @confirm="searchStart()" :placeholder="__('请输入关键词搜索')" v-model.trim="searchText"/>
			</template>
			<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/zy-search/search.svg" mode="aspectFit" @click="searchStart()" class="search-icon"></image>
		</view>
		<view :class="'s-' + theme" v-if="hList.length > 0">
			<view class="header">
				{{__('历史记录')}}
				<image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/zy-search/delete.svg" mode="aspectFit" @click="delhistory"></image>
			</view>
			<view class="list">
				<view v-for="(item,index) in hList" :key="index" @click="keywordsClick(item)">{{item}}</view>
			</view>
		</view>
		<view :class="'wanted-' + theme" v-if="showWant">
			<view class="header">{{__('猜你想搜的')}}</view>
			<view class="list">
				<view v-for="(item,index) in hotList" :key="index" @click="keywordsClick(item)">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"zy-search",
		props:{
			isFocus:{	//是否自动获取焦点
				type: Boolean,
				default: false
			},
			theme:{	//选择块级显示还是圆形显示
				type: String,
				default: 'block'
			},
			showWant:{	//是否展示推荐菜单
				type: Boolean,
				default: false
			},
			hotList: { //推荐列表数据
				type: Array,
				default () {
					return []
				}
			},
			searchHisList: {
				type: Array,
				default () {
					return []
				}
			},
			suggestText: {
				type: String,
				default: ''
			},

			speechEngine: { //语音引擎=>讯飞:iFly,百度:'baidu'
				type: String,
				default: 'baidu'
			}
		},
		data() {
			return {
				searchText:'',								//搜索关键词
				hList:[]		//历史记录
			};
		},
		created() {
			var that = this;
			setTimeout(()=>{
				this.setData({
					searchText: this.suggestText
				});

				if (this.searchHisList.length > 0)
				{
					//this.hList = this.searchHisList;
					this.hList = uni.getStorageSync('search_cache');
				}
				else
				{
					this.hList = uni.getStorageSync('search_cache');
				}
			}, 200)
		},
		methods: {
			searchStart: function() {	//触发搜索
				let _this = this;
				if (_this.searchText == '') {
					uni.showToast({
						title: _this.__('请输入关键字'),
						icon: 'none',
						duration: 1000
					});
				}else{
		
					uni.getStorage({
						key:'search_cache',
						success(res){
							let list = res.data;
							let t = true;
							if(list.length > 5){
								for(let item of list){
									if(item == _this.searchText){
										return;
									}
								}
								list.pop();
								list.unshift(_this.searchText);
							}else{
								for(let item of list){
									if(item == _this.searchText){
										t = false;
									}
								}
								if(t)
								{
									list.unshift(_this.searchText);
								}
								
							}
							_this.hList = list;
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
							_this.$emit('getSearchText', _this.searchText);
						},
						fail() {
							_this.hList = [];
							_this.hList.push(_this.searchText);
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
							_this.$emit('getSearchText', _this.searchText);
						}
					})
				}
			},
			keywordsClick (item) {	//推荐搜索
				this.searchText = item;
				this.$emit('getSearchText', item);
			},
			delhistory () {		//清空历史记录
				this.hList = [];
				uni.setStorage({
					key: 'search_cache',
					data: []
				});
			},
			startRecognize: function() {	//语音输入
				let _this = this;
				let options = {};
				options.engine = _this.speechEngine;
				options.punctuation = false; // 是否需要标点符号
				options.timeout = 10 * 1000;
				plus.speech.startRecognize(options, function(s) {
					_this.searchText = _this.searchText + s;
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.search{
		width: 640upx;
		margin: 30upx auto 0;
		position: relative;
		input{
			background-color: #F7F7F7;
			padding: 10upx 74upx;
			font-size: 28upx;
			border-radius: 50upx;
		}
		.voice-icon{
			width: 36upx;
			height: 36upx;
			padding: 16upx 20upx 16upx 0;
			position: absolute;
			left: 16upx;
			top: 4upx;
			z-index: 10;
		}
		.search-icon{
			width: 36upx;
			height: 36upx;
			padding: 16upx 20upx 16upx 0;
			position: absolute;
			right: 0;
			top: -2upx;
			z-index: 10;
		}
	}
	.s-block{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
			position: relative;
			image{
				width: 36upx;
				height: 36upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				padding: 20upx 0;
				border-top: 2upx solid #FFF;
    			border-left: 2upx solid #FFF;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				background-color: #F7F7F7;
			}
		}
	}
	.s-circle{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
			border-bottom: 2upx solid #F9F9F9;
			position: relative;
			image{
				width: 36upx;
				height: 36upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;
			view{
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}
	.wanted-block{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				padding: 20upx 0;
				border-top: 2upx solid #FFF;
				border-left: 2upx solid #FFF;
				background-color: #F7F7F7;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.wanted-circle{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;
			view{
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}
</style>
