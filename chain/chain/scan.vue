<template>
	<view class="page">
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
				vendor: 0,
				tableNum: "",
				path: ""
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('扫码点餐')
			});

			let that = this;
			
			//#ifdef H5
			that.$.gopage('/pagesub/scan/scan');
			//#endif
			
			//#ifndef H5
			that.$.scanCode({
				success: function(e) {
					// console.info(e)
					if(e.result.substr(0, 7)=="http://" || e.result.substr(0, 8)=="https://")
					{
						that.$.gopage(
							'/pagesub/webpage/web?u=' +
								encodeURIComponent(e.result)
						);
					}
					else
					{
						var t = e.result.split("=");
						
						if (t.length > 2 || t.length < 2)
						{
							that.$.alert("无法识别")
						}
						else
						{
							if (t[0] == "productId")
							{
								that.$.navigateTo("/pages/product/detail?pid=" + t[1])
							}
							else if (t[0] == "storeId")
							{
								that.$.navigateTo("/pagesub/index/store?store_id=" + t[1])
							}
							else
							{
								that.$.alert("无法识别!")
							}
							
							//that.$.navigateTo("../activitycheckin/activitycheckin?eventId=" + t[1])
						}
					}
				},
				fail: function(e) {
					that.$.alert("无法识别!")
				}
			})
			//#endif
		},

		methods: {

			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo'])
		}

	}
</script>



<style lang="scss">
	@import "../../styles/_variables";

</style>
