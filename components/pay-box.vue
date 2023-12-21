<template name="pay-box">
	<block></block>
</template>

<script>
	export default {
        name: "pay-box",
        props: {
            shareDataDefault: {
                type: Object,
                default() {
                    return {
                        shareTitle: '',
                        shareText: '',
                        href: '',
                        image: ''
                    }
                },
            },
        },
		data(){
			return {
                showBoxView:false,
                shareType:0
			}
		},
		created() {
            uni.getProvider({
                service: "share",
                success: (e) => {
                    //console.log("success", e);
                    let data = []
                    for (let i = 0; i < e.provider.length; i++) {
                        switch (e.provider[i]) {
                            case 'weixin':
                                data.push({
                                    name: '分享到微信好友',
                                    id: 'weixin',
                                    sort: 0
                                })
                                data.push({
                                    name: '分享到微信朋友圈',
                                    id: 'weixin',
                                    type: 'WXSenceTimeline',
                                    sort: 1
                                })
                                break;
                            case 'sinaweibo':
                                data.push({
                                    name: '分享到新浪微博',
                                    id: 'sinaweibo',
                                    sort: 2
                                })
                                break;
                            case 'qq':
                                data.push({
                                    name: '分享到QQ',
                                    id: 'qq',
                                    sort: 3
                                })
                                break;
                            default:
                                break;
                        }
                    }
                    this.providerList = data.sort((x, y) => {
                        return x.sort - y.sort
                    });
                },
                fail: (e) => {
                    //console.log("获取登录通道失败", e);
                    uni.showModal({
                        content: "获取登录通道失败",
                        showCancel: false
                    })
                }
            });
		},
		methods:{

            share() {
                if (this.providerList.length === 0) {
                    uni.showModal({
                        title: '当前环境无分享渠道!',
                        showCancel: false
                    })
                    return;
                }

                let itemList = this.providerList.map(function (value) {
                    return value.name
                })

                var that = this;

                uni.showActionSheet({
                    itemList: itemList,
                    success: (res) => {
                        uni.share({
                            provider: this.providerList[res.tapIndex].id,
                            scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' : "WXSceneSession",
                            type: this.shareType,

							summary : this.shareDataDefault.shareText,
							imageUrl : this.shareDataDefault.image,
							title : this.shareDataDefault.shareTitle,
                        	href : this.shareDataDefault.href,

                            success: (res) => {
                                //console.log("success:" + JSON.stringify(res));
                            },
                            fail: (e) => {
                                uni.showModal({
                                    //content: e.errMsg,
                                    content: '用户取消',
                                    showCancel:false
                                })
                            }
                        });
                    }
                })
            },

			save(){
				uni.showActionSheet({
					itemList:['保存图片到相册'],
					success: () => {
						plus.gallery.save('https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/app_download.png', function() {
							uni.showToast({
								title:'保存成功',
								icon:'none'
							})
						}, function() {
							uni.showToast({
								title:'保存失败，请重试！',
								icon:'none'
							})
						});
					}
				})
			},

            cancel() {
                this.showBoxView = false;
                this.$emit('onCancel');
            },
            show() {
                this.share();
            }
		}
	}
</script>

<style>
</style>
