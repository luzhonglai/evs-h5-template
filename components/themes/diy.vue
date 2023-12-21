<template name="diy">
    <view v-if="loadPageFlag" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor)), backgroundSize:'100% auto'}">

        <view v-for="(item, i) in PageContent" class="dropItem" :key="i" :style="{
                        clear: (item.eltmType==1 || item.eltmType==3) ? 'none' : 'both',
                        paddingTop:(item.paddingTop||0)*2+'rpx',
                        paddingBottom:(item.paddingBottom||0)*2+'rpx',
                        paddingLeft:(item.paddingLeft||0)*2+'rpx',
                        paddingRight:(item.paddingRight||0)*2+'rpx',
                        width:(375-(item.paddingLeft||0)-(item.paddingRight||0))*2+'rpx'}">
            <!--第一个模板-->
            <view :data-id="(item.eltm1.data.did)" :data-name="(item.eltm1.data.name)" :data-type="(item.eltm1.data.selectType)"
                  :data-keyword="(item.eltm1.data.keyWord || '')" :data-appid="(item.eltm1.data.AppId || '')" :data-appurl="(item.eltm1.data.AppUrl)"
                  :data-MinAppUrl="(item.eltm1.data.MinAppUrl || '')" @click="tplGoToPage" v-if="item.eltmType==1" :class="{boxFlexItem1:item.flexNum==1,boxFlexItem2:item.flexNum==2,boxFlexItem3:item.flexNum==3,boxFlexItem4:item.flexNum==4,boxFlexItem5:item.flexNum==5,ms:1==1,s1:item.eltm1.layout==1,s2h:item.eltm1.layout==2,s2v:item.eltm1.layout==3,s4h:item.eltm1.layout==4,s4v:item.eltm1.layout==5,s8h:item.eltm1.layout==6,s8v:item.eltm1.layout==7,s16:item.eltm1.layout==8,s250h:item.eltm1.layout==9,fl:item.eltm1.align==1,fr:item.eltm1.align==2,borderStyle:item.eltm1.border}"
                  :style="{width:item.eltm1.width+'rpx',height:item.eltm1.height+'rpx',paddingTop:item.eltm1.paddingTop+'px',  paddingRight:item.eltm1.paddingRight+'px', paddingBottom:item.eltm1.paddingBottom+'px', paddingLeft:item.eltm1.paddingLeft+'px', backgroundColor:item.bgColor}">
                <image lazy-load mode="scaleToFill" :src="(item.eltm1.data.path)"></image>
            </view>
            <!--第一个模板-->
            <!--第二个模板-->
            <view v-if="(item.eltmType==2 && item.eltm2.data.words)" class="m-RichText" :style="{padding:(item.eltm2.padding)+'px',backgroundColor:(item.bgColor), borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', clear: 'both'}">
                <wxParse :content="item.eltm2.data.words" />
            </view>
            <!--第二个模板-->
            <!--第三个模板-->
            <view v-if="(item.eltmType==3)" style="position: relative;" :class="{fl:item.eltm3.align==1,fr:item.eltm3.align==2}">
                <view v-if="(item.eltmType==3) && i<3 && (item.eltm3.showNbg || item.eltm3.showNbg!=0)" :class="item.eltm3.showNbg ? 'bg-ellipse' : ''" :style="{backgroundColor: PageNav.window.navigationBarBackgroundColor}"></view>
                <swiper v-if="(item.eltmType==3)" class="m-scrollBox" :style="{width:(item.eltm3.width*2)+'rpx', height:(item.eltm3.height*2)+'rpx', 'background-color':(item.bgColor), clear: 'both'}"
                        :indicator-dots="item.eltm3.progress"  :indicator-color="item.eltm3.color" :indicator-active-color="item.eltm3.activeColor"  :autoplay="item.eltm3.autoplay">

                    <swiper-item v-for="(sitem, si) in item.eltm3.data" :key="si">
                        <view :data-id="(sitem.did)" :data-name="(sitem.name)" :data-type="(sitem.selectType)" :data-keyword="(sitem.keyWord || '')"
                              :data-appid="(sitem.AppId || '')" :data-appurl="(sitem.AppUrl)" :data-MinAppUrl="(sitem.MinAppUrl || '')" @click="tplGoToPage">
                            <image lazy-load mode="heightFix" :style="{width:(item.eltm3.width*2)+'rpx', height:(item.eltm3.height*2)+'rpx', borderRadius: item.eltm3.borderRadius+ 'px'}" :src="(sitem.path)"></image>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
            <!--第三个模板-->


            <!--第四个模板-->
            <scroll-view v-if="(item.eltmType==4)" :scroll-y="item.eltm4.listTyle!=5" :scroll-x="item.eltm4.listTyle==5" :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', clear: 'both'}">

                <view v-if="(item.eltmType==4)" :class="{m_plist:1, p1:item.eltm4.listTyle==1, p2:item.eltm4.listTyle==2, p3:item.eltm4.listTyle==3, p4:item.eltm4.listTyle==4, p5:item.eltm4.listTyle==5}">
                    <view class="m_pitem" v-for="(items, ii) in item.eltm4.data" v-if="items" :key="ii" :data-id="(items.did)" :data-name="(items.name)"
                          :data-type="(items.selectType)" :data-keyword="(items.keyWord || '')" :data-appid="(items.AppId || '')" :data-appurl="(items.AppUrl)"
                          :data-MinAppUrl="(item.MinAppUrl || '')" @click="tplGoToPage">
                        <view class="m_pinfo">
                            <view class="pimg" v-if="item.eltm4.listTyle!=5">
                                <image lazy-load mode="widthFix" style="width:100%;height:100%" :src="($.img(items.path, 360,  360))"></image>
                            </view>
                            <view class="pimg" v-else>
                                <image lazy-load mode="heightFix" :src="($.img(items.path, 360,  360))"></image>
                            </view>

                            <view class="pinfo">

                                <view class="pname">
                                    <label  :style="{height:'unset !important','line-clamp':item.eltm4.charLine}">{{items.name}}</label>
                                </view>

                                <view class="pSelling"
                                      v-if="items.ProductTips!='' && item.eltm4.isProductTips"
                                      :style="item.eltm4.isPrice?'':'display: inline-block; padding-top: 24rpx;padding-bottom: 24rpx'">
                                    {{items.ProductTips||''}}
                                </view>

                                <view class="pprice" v-if="item.eltm4.isPrice" :style="{color:item.eltm4.priceColor}">

                                    <view class="pc" :style="{color:item.eltm4.priceColor}">
                                        <block v-if="item.eltm4.isPrice"><label>{{__('￥')}}</label>{{items.ItemSalePrice}}
                                        </block>
                                    </view>

                                    <block v-if="items.item_unit_points">
                                        <label style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{items.item_unit_points}}</label> <label>{{__('积分')}}</label>
                                    </block>

                                    <block v-if="items.item_unit_sp">
                                        <label style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{items.item_unit_sp}}</label> <label>{{__('众宝')}}</label>
                                    </block>


                                    <view v-if="(item.eltm4.btnType==4)" class="c4" :style="{backgroundColor:(item.eltm4.btnColor),color:(item.eltm4.btnFontColor)}">
                                        <label v-if="(item.eltm4.btnType==4)">{{item.eltm4.btnText}}</label>
                                    </view>
                                    <view v-else :class="'c'+(item.eltm4.btnType)">
                                        <label v-if="(item.eltm4.btnType==3)">buy</label>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <!--第四个模板-->

            <!--第五个模板-->
            <view v-if="(item.eltmType==5)" class="m-blank" :style="{height:(item.eltm5.height)+'px','line-height':(item.eltm5.height)+'px','background-color':(item.bgColor)}">
            </view>
            <!--第五个模板-->

            <!--第六个模板-->
            <scroll-view scroll-x v-if="item.eltmType==6" style='clear:both'>
                <view v-if="(item.eltmType==6)" :class="{boxFlex:1 ,fdRow:item.eltm6.flexDirection==0, fdRowReverse:item.eltm6.flexDirection==1, fdColumn:item.eltm6.flexDirection==2, fdColumnReverse:item.eltm6.flexDirection==3, fwNowrap:item.eltm6.flexWrap==0,fwWrap:item.eltm6.flexWrap==1,fwWrapReverse:item.eltm6.flexWrap==2,jcFlexStart:item.eltm6.justifyContent==0,jcFlexEnd:item.eltm6.justifyContent==1,jcCenter:item.eltm6.justifyContent==2,jcSpaceBetween:item.eltm6.justifyContent==3,jcSpaceAround:item.eltm6.justifyContent==4,aiFlexStart:item.eltm6.alignItems==0,aiFlexEnd:item.eltm6.alignItems==1,aiCenter:item.eltm6.alignItems==2,aiBaseline:item.eltm6.alignItems==3,aiStretch:item.eltm6.alignItems==4}"
                      :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">
                    <view v-for="(items, ii) in item.eltm6.data" :key="ii" :data-id="(items.did)" :data-name="(items.name)" :data-type="(items.selectType)"
                          :data-keyword="(items.keyWord || '')" :data-appid="(items.AppId || '')" :data-appurl="(items.AppUrl)" :data-MinAppUrl="(item.MinAppUrl || '')"
                          @click="tplGoToPage" class="boxFlexItem1" :style="{paddingTop:(item.eltm6.paddingTop)+'px',paddingBottom:(item.eltm6.paddingBottom)+'px',paddingLeft:(item.eltm6.paddingLeft)+'px',paddingRight:(item.eltm6.paddingRight)+'px',fontSize:(item.eltm6.fontSize)+'px',color:(item.eltm6.fontColor)}">
                        <view v-if="(item.eltm6.type==1)">{{items.name}}</view>
                        <image lazy-load mode="widthFix" v-if="(item.eltm6.type==0)" :src="(items.path)" class="img" :style="{width:(items.flexNum>1?(items.flexNum+'px'):((w - item.eltm6.paddingLeft - item.eltm6.paddingRight) + 'px')), width:'100%',height:(item.eltm6.height)+'px'}"></image>
                    </view>
                </view>
            </scroll-view>
            <!--第六个模板-->


            <!--第七个模版-->
            <view v-if="(item.eltmType==7) && item.eltm7.data.length>0" :class="{boxGrids:1, boxGridsBorder:item.eltm7.border }" :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">
                <view :class="{boxGrid:1, boxGridBorder:item.eltm7.border}" v-if="(item.eltmType==7) && item.eltm7.data.length/item.eltm7.column <= 2"" v-for="(items, ii) in item.eltm7.data"
                :key="ii" :style="{width:((100/item.eltm7.column))+'%','padding-top':(item.eltm7.paddingTop)+'px','padding-bottom':(item.eltm7.paddingBottom)+'px','padding-left':(item.eltm7.paddingLeft)+'px','padding-right':(item.eltm7.paddingRight)+'px','background-color':(item.bgColor)}"
                :data-id="(items.did)" :data-name="(items.name)" :data-mobile="(items.mobile)" :data-type="(items.selectType)" :data-keyword="(items.keyWord || '')"
                :data-appid="(items.AppId || '')" :data-appurl="(items.AppUrl)" :data-MinAppUrl="(item.MinAppUrl || '')" @click="tplGoToPage">
                <view class="boxGridIcon">
                    <image lazy-load :src="(items.path)"></image>
                </view>
                <label class="boxGridLabel">{{items.name}}</label>
            </view>

            <swiper v-if="(item.eltmType==7) && item.eltm7.data.length/item.eltm7.column > 2" class="m-scrollBox"  :class="{boxGrids:1, boxGridsBorder:item.eltm7.border }"  :indicator-dots="true" :autoplay="false" :style="{height: '340rpx', backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">
                <block v-for="(bitems, bi) in item.eltm7.data" :key="bi">
                    <swiper-item v-if="(bi%(item.eltm7.column*2)==0)">
                        <view :class="{boxGrid:1, boxGridBorder:item.eltm7.border}" v-if="ii >= bi  && ii < (bi+item.eltm7.column*2)" v-for="(items, ii) in item.eltm7.data"
                              :key="ii" :style="{width:((100/item.eltm7.column))+'%','padding-top':(item.eltm7.paddingTop)+'px','padding-bottom':(item.eltm7.paddingBottom)+'px','padding-left':(item.eltm7.paddingLeft)+'px','padding-right':(item.eltm7.paddingRight)+'px','background-color':(item.bgColor)}"
                              :data-id="(items.did)" :data-name="(items.name)" :data-mobile="(items.mobile)" :data-type="(items.selectType)" :data-keyword="(items.keyWord || '')"
                              :data-appid="(items.AppId || '')" :data-appurl="(items.AppUrl)" :data-MinAppUrl="(item.MinAppUrl || '')" @click="tplGoToPage">
                            <view class="boxGridIcon">
                                <image lazy-load :src="(items.path)"></image>
                            </view>
                            <label class="boxGridLabel">{{items.name}}</label>
                        </view>
                    </swiper-item>

                </block>
            </swiper>
        </view>
        <!--第七个模版-->


        <!--第八个模版-->
        <view v-if="(item.eltmType==8)" class="mTel" :style="{'background-color':(item.bgColor)}" :data-tel="(item.eltm8.tel)" @tap="callTel">
            <label class="iconfont icon-dianhua--copy" :style="{'font-size':'30px',color:(item.eltm8.fontColor)}"></label>
        </view>
        <!--第八个模版-->
        <!--第九个模版-->
        <navigator url="/pagesub/search/search" class="u-search-box" v-if="(item.eltmType==9)" :style="{'background-color':(item.bgColor),'padding-top':(item.eltm9.paddingTop)+'px','padding-bottom':(item.eltm9.paddingBottom)+'px','padding-left':(item.eltm9.paddingLeft)+'px','padding-right':(item.eltm9.paddingRight)+'px'}">
            <view class="u-search-cont">
                <uni-icons type="search" size="22" color="#666666" />
                <text>{{item.eltm9.tipText}}</text>
            </view>
        </navigator>

        <uni-nav-bar v-if="(item.eltmType==9 && false)" :statusBar="false" :fixed="true" color="#333333" :backgroundColor="BgConfig.BackgroundObj.bgColor" background-color="#ffffff" right-icon="scan" @click-left="showCity" @click-right="scan">
            <block slot="left">
                <view class="city">
                    <view>{{ city }}</view>
                    <uni-icons type="arrowdown" color="#333333" size="22" />
                </view>
            </block>
            <view class="input-view">
                <uni-icons type="search" size="22" color="#666666" />
                <input confirm-type="search" class="input" type="text" :placeholder="__('输入搜索关键词')" @click="onSearch">
            </view>
        </uni-nav-bar>

        <!--第九个模版-->
        <!--第十一个模版-->
		<movable-area class="movableAreaIM" v-if="(item.eltmType==11 && hasLogin && chatUrl)" >
			<movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
        <view class="mCS" :style="{'background-color':(item.bgColor), borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">
            <!-- #ifdef MP-WEIXIN&&false -->
            <label class="iconfont icon-more" :style="{'font-size':'30px',color:(item.eltm11.fontColor)}"></label>
            <contact-button size="27" type="default-dark" session-from="weapp"></contact-button>
            <!-- #endif -->

            <view class="m-footer-btn-item" v-if="chatUrl" data-name="管理员"  data-keyword="" data-appid="0" :data-appurl="(chatUrl)" :data-type="99" @click="tplGoToPage" style="line-height: 96rpx;">
                <label class="iconfont icon-more" :style="{'font-size':'30px',color:(item.eltm11.fontColor)}"></label>
            </view>
        </view>
		    </movable-view>
		</movable-area>
        <!--第十一个模版-->
        <!--第十二个模版-->
        <view v-if="(item.eltmType==12)" :style="{'background-color':(item.bgColor), borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden','padding-top':(item.eltm12.paddingTop)+'px','padding-bottom':(item.eltm12.paddingBottom)+'px','padding-left':(item.eltm12.paddingLeft)+'px','padding-right':(item.eltm12.paddingRight)+'px'}">

            <!-- #ifdef H5 -->
            <video :poster="item.eltm12.poster" :src="(item.eltm12.src)" :controls="(item.eltm12.controls)" :loop="(item.eltm12.loop)" :style="{width:(item.eltm12.width*2)+'rpx',height:(item.eltm12.height*2)+'rpx', 'background-color':(item.bgColor)}" objectFit="fill">
            </video>
            <!-- #endif -->

            <!-- #ifndef H5 -->
            <video :poster="item.eltm12.poster" :src="(item.eltm12.src)" :controls="(item.eltm12.controls)" :autoplay="(item.eltm12.autoplay)" :loop="(item.eltm12.loop)" :style="{width:(item.eltm12.width*2)+'rpx',height:(item.eltm12.height*2)+'rpx', 'background-color':(item.bgColor)}" objectFit="fill" v-if="!hideDiy">
            </video>
            <!-- #endif -->
        </view>
        <!--第十二个模版-->



        <form class="formBox" @submit="formSubmit" @reset="formReset" v-if="item.eltmType==13"
              :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', clear: 'both'}">
            <view v-for="(items, idx) in item.eltm13.data" :key="idx">
                <view class="fromInput" v-if="items.type==1"><label :style="{color:item.eltm13.labelColor}">{{items.labelText}}</label><input
                        type='text' :name="''+items.id" maxlength="200" :placeholder="items.placeholderText"
                        :style='{borderColor:items.borderColor,color:item.eltm13.textColor}'/></view>
                <view class="fromInput" v-if="items.type==2"><label :style="{color:item.eltm13.labelColor}">{{items.labelText}}</label>
                    <picker mode="date" :value="items.name" :data-id="items.id" @change="bindDateChange">
                        <view class="picker">{{items.name||__('请选择时间')}}
                        </view>
                    </picker>
                </view>
                <view class="fromInput" v-if="items.type==3"><label :style="{color:item.eltm13.labelColor}">{{items.labelText}}</label><textarea
                        :name="''+items.id" maxlength="400" :placeholder="items.placeholderText"
                        :style="{borderColor:items.borderColor,color:item.eltm13.textColor}"></textarea>
                </view>
                <radio-group :name="''+items.id" class="fromInput" v-if="items.type==4"><label
                        :style="{color:item.eltm13.labelColor}">{{items.labelText}}</label>
                    <view class="fromCK_item" v-for="(info, idx) in items.data" :key="idx">
                        <radio :color="items.selColor" :value='info.text'/>
                        <text :style="{color:item.eltm13.textColor}">{{info.text}}</text>
                    </view>
                </radio-group>
                <checkbox-group :name="''+items.id" class="fromInput" v-if="items.type==5"><label
                        :style="{color:item.eltm13.labelColor}">{{items.labelText}}</label>
                    <view class="fromCK_item" v-for="(info, idx) in items.data" :key="idx">
                        <checkbox :color="items.selColor" :value='info.text'/>
                        <text :style="{color:item.eltm13.textColor}">{{info.text}}</text>
                    </view>
                </checkbox-group>
                <view class="fromInput" v-if="items.type==6"><label :style="{color:item.eltm13.labelColor}">{{items.labelText}}</label>
                    <view class='upload-view'>
                        <view v-for="(info, idx) in items.data" :key="idx" class='upload-img-item'>
                            <image mode="aspectFit" :src='info'></image>
                            <view class='del-upload-img' :data-id="items.id" :data-index='idx'
                                  @click.stop='delUploadImg'><label class='iconfont icon-delete'></label></view>
                        </view>
                        <view class='upload-img' v-if="items.data.length<items.moreNum" :data-id="items.id"
                              :data-num='items.moreNum' @tap='formUploadImage'></view>
                    </view>
                </view>
            </view>
            <view class="formSubmit">
                <button class="formButtom" formType="submit"
                        :style="{backgroundColor:item.eltm13.btnColor,color:item.eltm13.fontColor}">
                    {{item.eltm13.btnText}}
                </button>
            </view>
        </form>
        <view v-if="item.eltmType==14" class='notice'
              :style="{'background-color':item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden','padding-top':item.eltm14.paddingTop*2 + 'rpx', 'padding-bottom':item.eltm14.paddingBottom*2 + 'rpx',clear: 'both'}">
            <view class="notice-icon ">
                <image :src="item.eltm14.image?item.eltm14.image:'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/notice/Notice1.png'"></image>
            </view>
            <swiper autoplay :vertical="item.eltm14.scrollDir==0?true:false" circular class="notice-content">
                <swiper-item v-for="(items, idx) in item.eltm14.data"  :key="idx"  :data-id="items.did"
                             :data-name="items.name" :data-type="items.selectType"
                             :data-keyword="items.keyWord  || ''" :data-appid="items.AppId  || ''"
                             :data-appurl="items.AppUrl" :data-MinAppUrl="item.MinAppUrl  || ''"
                             @tap="tplGoToPage"><label
                        :style="{color:item.eltm14.fontColor}">{{items.name}}</label></swiper-item>
            </swiper>
            <view class="notice-arrow" :style="{color:item.eltm14.arrowColor}"><label
                    class="iconfont icon-right"></label></view>
        </view>
        <view class="head-title" v-if="item.eltmType==15"
              :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden',marginTop:item.eltm15.margin_top*2+'rpx',marginBottom:item.eltm15.margin_bottom*2+'rpx',clear: 'both'}">
            <image v-if="item.eltm15.isIcon" :src="item.eltm15.icon" mode="aspectFit"></image>
            <view class="title-label" :style="{color:item.eltm15.titleColor}">{{item.eltm15.title}}</view>
            <diy-countdown v-if="item.eltm15.isCountdown" :class="'countdown-box time' + item.eltm15.cssType"
                           :startTime="item.eltm15.startTime" :endTime="item.eltm15.endTime"
                           cttitle="cttitle" time-box="time-box"></diy-countdown>
            <view v-if="item.eltm15.isLink" :data-id="item.eltm15.data.did"
                  :data-name="item.eltm15.data.name" :data-type="item.eltm15.data.selectType"
                  :data-keyword="item.eltm15.data.keyWord  || ''" :data-appid="item.eltm15.data.AppId  || ''"
                  :data-appurl="item.eltm15.data.AppUrl"
                  :data-MinAppUrl="item.eltm15.data.MinAppUrl  || ''" @tap="tplGoToPage" class="title-linke"
                  :style="{color:item.eltm15.fontColor, fontSize:'24rpx'}">{{item.eltm15.linkText}}
                <label class="uni-icon uni-icon-arrowright" :style="{color:item.eltm15.arrowColor, fontSize:'30rpx'}"></label></view>
        </view>

        <view v-if="item.eltmType==16"
              :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden',marginTop:item.eltm16.margin_top*2+'rpx',marginBottom:item.eltm16.margin_bottom*2+'rpx',clear: 'both'}">
            <scroll-view scroll-x v-if="item.eltm16.layout==1">
                <view class="activity-box1">
                    <block v-for="(items, idx) in item.eltm16.data" :key="idx">
                        <navigator v-if="items.selectType!=15"
                                   :url="'/pages/product/detail?pid='+items.did"
                                   class="activity-item" :data-Mid="items.mid || ''">
                            <view class="activity-img">
                                <image :src="items.path"/>
                                <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                                      :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                                    <diy-countdown :startTime="items.StartTimeStr"
                                                   :endTime="items.EndTimeStr" :showType="1"></diy-countdown>
                                </view>
                                <view class="mark" v-if="item.eltm16.isLabel">
                                    <image :src="items.selectType==12?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize3.png':items.selectType==13?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize1.png':items.selectType==14?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize2.png':'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize5.png'"
                                    />
                                </view>
                            </view>
                            <view class="activity-info">
                                <view class="activity-name"
                                      v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                                      :style="{height:item.eltm16.charLine==1?'30rpx':'64rpx','-webkit-line-clamp':item.eltm16.charLine}">
                                    {{items.name}}
                                </view>
                                <view class="activity-price"
                                      v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                                        class="price"
                                        :style="{color:item.eltm16.priceColor}">{{__('￥')}}{{items.ItemSalePrice}}</label><label
                                        class="del-price"
                                        v-if="items.selectType==14">{{__('￥')}}{{items.MarketPice}}</label><label
                                        class="tip" v-if="items.selectType==12||items.selectType==13">{{items.UserLimit}}{{__('人团')}}</label>
                                </view>
                                <view class="activity-desc" v-if="item.eltm16.isShowNum">
                                    {{__('已有')}}{{items.OrderCount}} {{__('人参加')}}
                                </view>
                            </view>
                        </navigator>
                        <button v-else class="activity-item" :data-pid="items.did" :data-Mid="items.mid || ''"
                                @click.stop='goCutprice'>
                            <view class="activity-img">
                                <image :src="items.path"/>
                                <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                                      :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                                    <diy-countdown :startTime="items.StartTimeStr"
                                                   :endTime="items.EndTimeStr" :showType="1"></diy-countdown>
                                </view>
                                <view class="mark" v-if="item.eltm16.isLabel">
                                    <image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize5.png'/>
                                </view>
                            </view>
                            <view class="activity-info">
                                <view class="activity-name"
                                      v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                                      :style="{height:item.eltm16.charLine==1?'30rpx':'64rpx','-webkit-line-clamp':item.eltm16.charLine}">
                                    {{items.name}}
                                </view>
                                <view class="activity-price"
                                      v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                                        class="price"
                                        :style="{color:item.eltm16.priceColor}">{{__('￥')}}{{items.ItemSalePrice}}</label>
                                </view>
                                <view class="activity-desc" v-if="item.eltm16.isShowNum">
                                    {{__('已有')}}{{items.OrderCount}} {{__('人参加')}}
                                </view>
                            </view>
                        </button>
                    </block>
                </view>
            </scroll-view>
            <view v-if="item.eltm16.layout==2" class="activity-box2">
                <block v-for="(items, idx) in item.eltm16.data" :key="idx">
                    <navigator v-if="items.selectType!=15"
                               :url="'/pages/product/detail?pid='+items.did"
                               class="activity-item" :data-Mid="items.mid || ''">
                        <view class="activity-img">
                            <image :src="items.path"/>
                            <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                                  :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                                <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                               :showType="1"></diy-countdown>
                            </view>
                            <view class="mark" v-if="item.eltm16.isLabel">
                                <image :src="items.selectType==12?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize3.png':items.selectType==13?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize1.png':'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize2.png'"/>
                            </view>
                        </view>
                        <view class="activity-info">
                            <view class="activity-name"
                                  v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                                  :style="{height:item.eltm16.charLine==1?'30rpx':'64rpx','-webkit-line-clamp':item.eltm16.charLine}">
                                {{items.name}}
                            </view>
                            <view class="activity-price"
                                  v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                                    class="price"
                                    :style="{color:item.eltm16.priceColor}">{{__('￥')}}{{items.ItemSalePrice}}</label><label
                                    class="del-price" v-if="items.selectType==14">{{__('￥')}}{{items.MarketPice}}</label><label
                                    class="tip" v-if="items.selectType!=14">{{items.UserLimit}}{{__('人团')}}</label>
                            </view>
                            <view class="activity-desc" v-if="item.eltm16.isShowNum">{{__('已有')}}{{items.OrderCount}} {{__('人参加')}}
                            </view>
                        </view>
                    </navigator>
                    <button v-else class="activity-item" :data-pid="items.did" :data-Mid="items.mid || ''"
                            @click.stop='goCutprice'>
                        <view class="activity-img">
                            <image :src="items.path"/>
                            <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                                  :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                                <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                               :showType="1"></diy-countdown>
                            </view>
                            <view class="mark" v-if="item.eltm16.isLabel">
                                <image src="https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize5.png"/>
                            </view>
                        </view>
                        <view class="activity-info">
                            <view class="activity-name"
                                  v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                                  :style="{height:item.eltm16.charLine==1?'30rpx':'64rpx','-webkit-line-clamp':item.eltm16.charLine}">
                                {{items.name}}
                            </view>
                            <view class="activity-price"
                                  v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                                    class="price"
                                    :style="{color:item.eltm16.priceColor}">{{__('￥')}}{{items.ItemSalePrice}}</label></view>
                            <view class="activity-desc" v-if="item.eltm16.isShowNum">{{__('已有')}}{{items.OrderCount}} {{__('人参加')}}
                            </view>
                        </view>
                    </button>
                </block>
            </view>
            <view v-if="item.eltm16.layout==3" class="activity-box3">
                <block v-for="(items, idx) in item.eltm16.data" :key="idx">
                    <navigator v-if="items.selectType!=15"
                               :url="'/pages/product/detail?pid='+items.did"
                               class="activity-item" :data-Mid="items.mid || ''">
                        <view class="activity-img">
                            <image :src="items.path"/>
                            <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                                  :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                                <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                               :showType="1"></diy-countdown>
                            </view>
                            <view class="mark" v-if="item.eltm16.isLabel">
                                <image :src="items.selectType==12?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize3.png':items.selectType==13?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize1.png':items.selectType==14?'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize2.png':'https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize5.png'"
                                />
                            </view>
                        </view>
                        <view class="activity-info">
                            <view class="activity-name"
                                  v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                                  :style="{height:item.eltm16.charLine==1?'30rpx':'64rpx','-webkit-line-clamp':item.eltm16.charLine}">
                                {{items.name}}
                            </view>
                            <view class="activity-desc"><label class="tip"
                                                               v-if="items.selectType==12||items.selectType==13">{{items.UserLimit}}{{__('人团')}}</label><label
                                    v-if="item.eltm16.isShowNum">{{__('已有')}}{{items.OrderCount}} {{__('人参加')}}</label></view>
                            <view class="activity-price"
                                  v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                                    class="price"
                                    :style="{color:item.eltm16.priceColor}">{{__('￥')}}{{items.ItemSalePrice}}</label><label
                                    class="del-price" v-if="items.selectType==14">{{__('￥')}}{{items.MarketPice}}</label>
                                <view class='activity-btn'
                                      :style="{backgroundColor:item.eltm16.btnBgColor,color:item.eltm16.btnFontColor}">
                                    {{items.words||(items.selectType==14?__('去秒杀'):items.selectType==15?__('去砍价'):__('立即开团'))}}
                                </view>
                            </view>
                        </view>
                    </navigator>
                    <button v-else class="activity-item" :data-pid="items.did" :data-Mid="items.mid || ''"
                            @click.stop='goCutprice'>
                        <view class="activity-img">
                            <image :src="items.path"/>
                            <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                                  :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                                <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                               :showType="1"></diy-countdown>
                            </view>
                            <view class="mark" v-if="item.eltm16.isLabel">
                                <image src='https://e-mall-1316691179.cos.ap-shanghai.myqcloud.com/mall/appicon/auth/prize5.png'/>
                            </view>
                        </view>
                        <view class="activity-info">
                            <view class="activity-name"
                                  v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                                  style="{height:item.eltm16.charLine==1?'30rpx':'64rpx','-webkit-line-clamp':item.eltm16.charLine}">
                                {{items.name}}
                            </view>
                            <view class="activity-desc"><label class="tip"
                                                               v-if="items.selectType==12||items.selectType==13">{{items.UserLimit}}{{__('人团')}}</label><label
                                    v-if="item.eltm16.isShowNum">{{__('已有')}}{{items.OrderCount}} {{__('人参加')}}</label></view>
                            <view class="activity-price"
                                  v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                                    class="price"
                                    :style="{color:item.eltm16.priceColor}">{{__('￥')}}{{items.ItemSalePrice}}</label><label
                                    class="del-price" v-if="items.selectType==14">{{__('￥')}}{{items.MarketPice}}</label>
                                <view class='activity-btn'
                                      :style="{backgroundColor:item.eltm16.btnBgColor,color:item.eltm16.btnFontColor}">
                                    {{items.words||(items.selectType==14?__('去秒杀'):items.selectType==15?__('去砍价'):__('立即开团'))}}
                                </view>
                            </view>
                        </view>
                    </button>
                </block>
            </view>
        </view>
        <view v-if="item.eltmType==17" :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', marginTop:item.eltm17.margin_top*2+'rpx',marginBottom:item.eltm17.margin_bottom*2+'rpx',clear: 'both'}">
            <scroll-view scroll-x>
                <view class="coupon_box">
                    <button class="coupon_item" open-type='getUserInfo' v-if="item.eltmType==17 && item.eltm17.layout==1"
                            v-for="(items, idx) in item.eltm17.data" :key="idx" :data-id="items.did"
                            :data-name="items.name" :data-type="items.selectType"
                            :data-keyword="items.keyWord  || ''"
                            :data-appid="items.AppId  || ''" :data-appurl="items.AppUrl"
                            :data-MinAppUrl="item.MinAppUrl  || ''" @tap="tplGoToPage" style="margin:0">
                        <view class="coupon_price">{{__('￥')}}{{items.ItemSalePrice}}</view>
                        <view class="coupon_desc">{{items.name || items.ProductTips}}</view>
                    </button>
                    <button v-if="item.eltmType==17 && item.eltm17.layout==2" open-type='getUserInfo'
                            v-for="(items, idx) in item.eltm17.data" :key="idx" class="coupon_img"
                            :data-id="items.did" :data-name="items.name" :data-type="items.selectType"
                            :data-keyword="items.keyWord  || ''"
                            :data-appid="items.AppId  || ''" :data-appurl="items.AppUrl"
                            :data-MinAppUrl="item.MinAppUrl  || ''" @tap="tplGoToPage" style="margin:0">
                        <image :src="items.path"></image>
                    </button>
                </view>
            </scroll-view>
        </view>
        <view class='official-account' v-if="item.eltmType==18"
              :style="{backgroundColor:item.bgColor,paddingTop:item.eltm18.paddingTop*2+'rpx',paddingBottom:item.eltm18.paddingBottom*2+'rpx',clear: 'both'}">
            <official-account @error="mpError"  @load="mpLoad"></official-account>
        </view>

        <!--301模板-->
        <guess-you-like ref="guessYouLike" :uniId="uniId" :isFilterTop0="true" :isShowFilter="item.eltm101.isShowFilter" :isShowLoading="item.eltm101.isShowLoading" :optionStr="item.eltm101.options"  :viewtype="item.eltm101.viewtype*1" :titleText="item.eltm101.title" :titleColor="item.eltm101.titleColor" :bgColor="item.bgColor" :paddingLeft="item.paddingLeft||0"  :paddingRight="item.paddingRight||0" :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}" v-if="item.eltmType==101"></guess-you-like>
        <!--301模板-->


        <!--302模板-->
        <store-lists ref="storeLists" :uniId="uniId"  :isFilterTop0="!item.eltm102.isShowFilter" :isShowFilter="item.eltm102.isShowFilter" :isShowLoading="item.eltm102.isShowLoading" :optionStr="item.eltm102.options"  :viewtype="item.eltm102.viewtype*1" :titleText="item.eltm102.title" :titleColor="item.eltm102.titleColor" :bgColor="item.bgColor" paddingTop="0" :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}"  v-if="item.eltmType==102"></store-lists>
        <!--302模板-->
		
		<!--303模板-->
		<guess-you-like ref="guessYouLike" :uniId="uniId" :isFilterTop0="true" :isShowFilter="item.eltm103.isShowFilter" :isShowLoading="item.eltm103.isShowLoading" :optionStr="item.eltm103.options"  :viewtype="item.eltm103.viewtype*1" :titleText="item.eltm103.title" :titleColor="item.eltm103.titleColor" :bgColor="item.bgColor" :paddingLeft="item.paddingLeft||0"  :paddingRight="item.paddingRight||0" :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}" v-if="item.eltmType==103"></guess-you-like>
		<!--301模板-->
    </view>
    </view>
</template>

<script>
  import wxParse from '@/components/u-parse/u-parse.vue'
  import diyCountdown from '../../components/themes/diy-countdown'

  import guessYouLike from '@/components/guess-you-like.vue'
  import storeLists from '@/components/store-lists.vue'

  import {
    mapState,
    mapMutations
  } from 'vuex'
  import $ from "../../helpers/util";

  export default {
    name: "diy",
    components: {
      guessYouLike,
      storeLists,
      wxParse,
      diyCountdown
    },
    props: {
      BgConfig: {
        type: Object,
        default () {
          return {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}}
        },
      },
      PageContent: {
        type: Array,
        default () {
          return []
        },
      },
      pageId:
          {
            type: String,
            default () {
              return ''
            },
          },
      PageNav: {
        type: Object,
        default () {
          return {window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}}
        },
      },
      StoreInfo: {
        type: Object,
        default () {
          return {
          }
        },
      },
      loadPageFlag:
          {
            type: Boolean,
            default () {
              return false
            },
          },
      hideDiy:
          {
            type: Boolean,
            default () {
              return false
            },
          },
      uniId:
          {
            type: String,
            default () {
              return 'diy'
            },
          }
    },
    data() {
      return {
        w: 0, //windowWidth
        loaded:false,
        chatUrl : '',
		initX: '690',
		initY: '1336',
      }
    },
	mounted() {
		let that = this;
		let view = uni.createSelectorQuery().in(that).select(".movableAreaIM");
		view.fields({
		  size: true,
		  scrollOffset: true
		}, data => {
			if (data) {
				that.setData({
					initX: data.width,
					initY: data.height - 100,
				});
			}
		}).exec();
	},
    computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
    created: function() {
      let that = this;

      if (this.StoreInfo.im_enable)
      {

        var perm_id = that.$.getStorageSync('uid');
        var perm_key = that.$.getStorageSync('ukey');

        /*
        let chat_url = that.$.sprintf(
                "%s/wap/im.html?from=app&item_id=%s&user_other_id=%s&puid=%s&name=%s&avatar=%s&uid=%s&ukey=%s", that.cf.fileBasePath,
                '', this.StoreInfo.im_user_id, this.StoreInfo.puid, encodeURIComponent('管理员'), encodeURIComponent(that.cf.SiteLogo), perm_id, encodeURIComponent(perm_key))
        */
        //chat_url = that.$.sprintf("%s/wap/tmpl/member/chat_info_app.html?from=app&item_id=%s&user_other_id=%s&puid=%s&name=%s", that.cf.fileBasePath, '', this.StoreInfo.im_user_id, this.StoreInfo.puid, encodeURIComponent('管理员'))

        let chat_url = this.$.sprintf("/im/chat/chat?uid=%s", this.StoreInfo.im_user_id);

        this.setData({
          chatUrl: chat_url
        });
      }

      setTimeout(() => {
        this.loaded = true;
      }, 10);
    },
    methods: {
      ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
	  mpError: function(e) {
		  console.info(e)
	  },
	  mpLoad: function(e) {
	  		  console.info(e)
	  },
	  doNothing: function() {
	  },
      callTel: function(e) {
        let that = this;
        that.$.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.tel
        });
      },
      tplGoToPage: function(e) {
        let that = this;
        var t = e.currentTarget.dataset;

        //console.info(t);
        switch (parseInt(t.type)) {
          case 0:
             uni.makePhoneCall({
				phoneNumber:typeof t.mobile !="undefined" ? t.mobile.toString() : "",//电话号码
				success:function(e){
					console.log(e);
				},
				fail:function(e){
					console.log(e);
				}});
            break;
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
            //console.info(t.appurl);
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



            //console.info(t.appurl);
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
			that.$.gopage(
				'/pagesub/webpage/webpage?u=' +
					encodeURIComponent(t.appurl) +
					'&tn=' +
					t.name +
					'&tc=' +
					t.appid +
					'&tb=' +
					t.keyword
			);
			break;
          case 99:
			  that.$.gopage(t.appurl);
			break;
          case 10:
            that.$.gopage(t.appurl);
			break;
          case 11:
            that.$.gopage(t.appurl);
            break;

          case 12:
			if (typeof t.mobile !="undefined")
		    {
				that.$.makePhoneCall({
					phoneNumber:t.mobile,//电话号码
					success:function(e){
						console.log(e);
					},
					fail:function(e){
						console.log(e);
					},
				});
		    }
			else
			{
				that.$.makePhoneCall({
				  phoneNumber: t.name
				});
			}
		  
            break;
          case 17:
            that.getCoupon(t.id)
            break;
        }
      },

      formUploadImage: function (t) {
        var a = this, e = t.target.dataset, o = this.PageContent, r = a.getFormImageObj(o, e.id);
        a.$.chooseImage({
          count: e.num - r.item.data.length,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: function (t) {
            a.uploadImg(t.tempFilePaths, function (t) {
              o[r.i].eltm13.data[r.j].data = r.item.data.concat(t), a.setData({PageContent: o})
            })
          }
        })
      },
      getFormImageObj: function (t, a) {
        for (var e = 0; e < t.length; e++)
        {
          if (13 == t[e].eltmType)
          {
            for (var o = t[e].eltm13.data, r = 0; r < o.length; r++)
            {
              if (o[r].id == a)
              {
                return {
                  item: o[r],
                  i: e,
                  j: r
                }
              }
            }
          }
        }
      },
      delUploadImg: function (t) {
        var a = t.currentTarget.dataset, e = this.PageContent, o = this.getFormImageObj(e, a.id);
        o.item.data.splice(a.index, 1), e[o.i].eltm13.data[o.j].data = o.item.data, this.setData({PageContent: e})
      },
      uploadImg: function (t, e) {
        let that = this;
        for (var a = 0; a < t.length; a++)
        {
          that.$.showLoading(), that.$.uploadFile({
            url: that.cf.URL.upload,
            method: "POST",
            filePath: t[a],
            name: "upfile",
            formData: {user: a, store_id: that.cf.storeId},
            //header: {"content-type": "multipart/form-data"},
            success: function (t) {
              that.$.hideLoading();

              var up_res = that.$.parseJSON(t.data);
              var url = up_res.data.url;
              e(url)
            },
            fail: function (t) {
            },
            complete: function (t) {
            }
          })
        }
      },
      bindDateChange: function (t) {
        for (var a = this.PageContent, e = 0; e < a.length; e++)
        {
          if (13 == a[e].eltmType)
          {
            for (var o = a[e].eltm13.data, r = 0; r < o.length; r++)
            {
              o[r].id == t.target.dataset.id && (o[r].name = t.detail.value);
              o[r].id == t.target.dataset.id && (this.$set(this.PageContent[e].eltm13.data, r, o[r]));
            }
          }
        }

        //this.setData({PageContent: a})
      },
      formSubmit: function (t) {
        var that = this;

        for (var a = this, e = 1, o = [], r = 0; r < a.PageContent.length; r++)
        {
          if (13 == a.PageContent[r].eltmType)
          {
            e = a.PageContent[r].eltm13.submitNum;
            for (var n = a.PageContent[r].eltm13.data, i = 0; i < n.length; i++)
            {
              var s = t.detail.value[n[i].id], d = n[i].isFillIn, c = n[i].labelText, l = n[i].type, m = n[i].id,
                  p = {}, u = !0;
              if (2 == n[i].type)
              {
                if (d)
                {
                  if (that.$.isNull(n[i].name))
                  {
                    return that.$.confirm(n[i].placeholderText), u = !1;
                  }
                  s = n[i].name, u = !0
                }
                else
                {
                  that.$.isNull(n[i].name) || (s = n[i].name), u = !0;
                }
              }
              else if (6 == n[i].type)
              {
                if (n[i].isUploadImage)
                {
                  if (0 == n[i].data.length)
                  {
                    return that.$.confirm(that.__("请上传图片！")), u = !1;
                  }
                  s = n[i].data
                }
                else
                {
                  s = n[i].data;
                }
              }
              else if (d)
              {
                if (that.$.isNull(s))
                {
                  return that.$.confirm(n[i].placeholderText), u = !1;
                }
                if (0 < n[i].isVerification)
                {
                  if (1 == n[i].isVerification)
                  {
                    if (!/^1[3456789]\d{9}$/.test(s))
                    {
                      return that.$.confirm(that.__("请输入正确的手机号码！")), u = !1;
                    }
                    u = !0
                  }
                  if (2 == n[i].isVerification)
                  {
                    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(s))
                    {
                      return that.$.confirm(that.__("请输入正确的邮箱地址！")), u = !1;
                    }
                    u = !0
                  }
                }
                else
                {
                  u = !0
                }
              }
              else
              {
                if (!that.$.isNull(s))
                {
                  if (0 < n[i].isVerification)
                  {
                    if (1 == n[i].isVerification)
                    {
                      if (!/^1[3456789]\d{9}$/.test(s))
                      {
                        return that.$.confirm(that.__("请输入正确的手机号码！")), u = !1;
                      }
                      u = !0
                    }
                    if (2 == n[i].isVerification)
                    {
                      if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(s))
                      {
                        return that.$.confirm(that.__("请输入正确的邮箱地址！")), u = !1;
                      }
                      u = !0
                    }
                  }
                  else
                  {
                    u = !0;
                  }
                }
                u = !0
              }
              u && (p.id = m, p.key = c, p.value = s, p.type = l, o.push(p))
            }
          }
        }

        var params = {
          question_data: JSON.stringify(n),
          page_id: that.pageId,
          form_data: JSON.stringify(o),
        };

        that.$.request({
          url: this.cf.URL.survey,
          data: params,
		  method:"POST",
          success: function(data, status, msg, code) {
            if (status == 200) {
            	(that.$.alert(that.__('提交信息成功！')), that.formReset());
            	 that.$.navigateBack(1);
            }
            else {
            	that.$.confirm(that.__(msg));
            }
          }
        });
      },
      formReset: function (t) {
        var that = this;
      },
      confirm: function (t) {
        var that = this;
      },
      getCoupon: function (t) {
        let  that = this;
        var params = {
          activity_id: t,
          user_is_new: 0
        };

        this.forceUserInfo((user) => {
          if (user) {
            $.request({
              url: this.Config.URL.user.voucher_add,
              data: params,
              success: function(data, status, msg, code) {
                if (200 == status) {
                  $.alert(that.__("领取成功!"));
                  //that.getCouponlist()
                } else {
                  $.alert(msg);
                }
              },
            });
          }
        });


        /*
        t && $.clearxsr($.makeUrl(userapi.UserReceiveCoupon, params), function (t) {
            0 == t.Code ? (that.setData({isCancelSuccess: !1, mskType: 2, Coupons: t.Info}), wx.showToast({
                title: "领取成功！",
                icon: "none"
            })) : wx.showToast({title: t.Msg, icon: "none"})
        })

        */
      }
    }
  }
</script>


<style lang="scss">
    @import "../../styles/_variables";

    @import '../../styles/layout.scss';
    @import '../../styles/store_themes.scss';
    @import '../../styles/store_tpl.scss';

    uni-page-body {
        background-color: #F5F5F5 !important;
        min-height: 100% !important;
        height: 100% !important;
    }
</style>
