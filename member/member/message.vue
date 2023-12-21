<template>
    <scroll-view @scrolltolower="scrollbottom" class="m-orderlist" scroll-y="true" v-if="message_rows.length >0">
        <view class="m-panel-bd">
            <view class="m-media-box m-media-box-small-appmsg">
                <view class="m-cells">
                    <block v-for="(item, idx) in message_rows" :key="idx">
                        <view :class="['m-cell','m-cell-access', item.message_is_read?'':'active']" style='padding:38upx 30upx;color:#747474' @click="showMsgDetail(item.message_id)">
                            <view class="m-cell-hd " style="color:#44afa4">
                                <view class='commodity_shopImg'>
                                    <image class='commodity_shopImg' :src='item.user_other_avatar'></image>
                                </view>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <p style="font-size: 24upx;padding-left:30upx">
                                    <label style="color:#007AFF;padding-right:10upx" v-if="!item.message_is_read">{{__('未读')}}</label> <label style="color:#007AFF;padding-right:10upx">{{item.message_time_str}}</label>
									<u-parse :content="item.message_content + ''" :imageProp="{lazyLoad:true}"></u-parse>
                                </p>
                            </view>
                            <span class="qkk hide">{{__('去看看')}}</span>
                            <text class="m-cell-ft hide"></text>
                        </view>
                    </block>
                </view>
            </view>
        </view>
        <view class="m-loading-box">
            <block v-if="ispage">
                <view class="u-loadmore">
                    <label class="u-loading"></label>
                    <text class="u-loadmore-tips">{{__('正在加载')}}</text>
                </view>
                <view>
                    <text></text>
                </view>
            </block>
            <block v-else>
                <view class="u-loadmore u-loadmore-line">
                    <text class="u-loadmore-tips" style='background-color: #fff'>{{__('已经没有了')}}</text>
                </view>
            </block>
        </view>
    </scroll-view>
    <view class="m-nullpage" v-else>
        <view class="m-nullpage-middle">
            <view class="m-null-tip">
                <text>{{__('没有社区相关消息')}}</text>
            </view>
        </view>
    </view>
</template>

<script>
    import dateUtil from "../../helpers/util_date";
	import uParse from '@/components/u-parse/u-parse.vue'

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        components: {
			uParse
        },
        data() {
            return {
                message_rows: [],
                page: 1,
                ispage: !1,
                flag: !1
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('消息')
            });
            var that = this;
			that.getUserMessage();
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            getUserMessage: function () {
                let that = this;
                var params = {page: this.page};

                that.$.request({
                    url: this.Config.URL.user.msg_lists,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (data.items.length > 0) {
                            for (var r = 0; r < data.items.length; r++) {
                                data.items[r]['message_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['message_time']));
                            }

                            if (data.page >= data.total) {
                                that.setData({
                                    message_rows: that.message_rows.concat(data.items),
                                    flag: !1,
                                    ispage: !1
                                });
                            } else {
                                that.setData({
                                    message_rows: that.message_rows.concat(data.items),
                                    flag: !0,
                                    ispage: !0
                                })
                            }

                        } else {
                            that.setData({flag: !1, ispage: !1})
                        }
                    }
                });
            },

            scrollbottom: function (a) {
                if (this.flag && this.ispage)
                {
                    var e = this;
                    e.setData({flag: !1}), clearTimeout(t);
                    var t = setTimeout(function () {
                        e.setData({page: parseInt(e.page) + 1}), e.getUserMessage()
                    }, 500)
                }
            },
			showMsgDetail(message_id){
				let url= '/member/member/messagedetail?message_id=' + message_id;

				for (var r = 0; r < this.message_rows.length; r++) {
				    if (message_id == this.message_rows[r]['message_id'])
					{
						this.$set(this.message_rows[r], 'message_is_read', 1);
					}
				}

				uni.navigateTo({
					url:url
				})
			},
			
			preview(src, e) {
			  // do something
			},
			navigate(href, e) {
			  // do something
			  console.info(href);
			  console.info(e);

			  //this.$.gopage(href);
			}
        }
    }
</script>

<style lang="scss">

@import "../../styles/_variables";
@import url("@/components/u-parse/u-parse.css");



.qkk {
    font-size: 24upx;
    color: #999999
}

.commodity_shopImg {
    width: 70upx;
    height: 70upx;
    border-radius: 100%;
    overflow: hidden
}

.m-orderlist {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.m-cell.active{
	font-weight: 700;
}
</style>
