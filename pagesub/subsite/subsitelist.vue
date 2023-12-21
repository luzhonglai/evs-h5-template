<template>
		<ss-select-city :citys="subsiteIndexRows" :hotCitys="hotCitys" :subsite_current="subsite_current" @on-select="onSelectSubsite" />
</template>


<style lang="scss">
	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100%;
		background-size: cover !important;
		background-position: top center !important;
	}
</style>

<script>
	import ssSelectCity from './ss-select-city/ss-select-city.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		/**
		 * 页面的初始数据
		 */
		data: function() {
			return {
				options: {},

				hotCitys: [],
				subsite_current: {},
				subsiteIndexRows:[
				]
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			ssSelectCity
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('选择分站')
			});

			var that = this;

			//console.info(options.city);
			that.getSubsiteList();

			//设置
			that.$set(that.subsite_current, 'subsite_name', that.$.getStorageSync('site_name'));
			that.$set(that.subsite_current, 'subsite_id', that.$.getStorageSync('site_id'));
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
			getSubsiteList:function (){
				let that = this;

				//读取分站数据
				let ss_site_id = that.$.getStorageSync('site_id') ? that.$.getStorageSync('site_id') : 0;
				that.$.request({
					url: that.Config.URL.subsite_list,
					data: {ss_site_id:ss_site_id},
					ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE
					},
					success: function(data, status, msg, code) {
						that.$set(that.subsite_current, 'subsite_name', data.subsite_current_row['subsite_name']);
						that.$set(that.subsite_current, 'subsite_id', data.subsite_current_row['subsite_id']);

						that.setData({
							subsite_current: data.subsite_current_row
						});


						that.setData({
							subsiteIndexRows: data.citys
						});

						that.setData({
							hotCitys: data.subsite_hot_rows
						});
					}
				});

				//整理数据
			},
			onSelectSubsite: function (e) {
				//console.info(e.subsite_id);

				this.notice.postNotificationName("RefreshSubsite", e);

				//返回上一页
				this.$.backpage();
			}
		}
	}
</script>
