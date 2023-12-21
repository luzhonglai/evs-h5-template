<template name="send-message" :style="{'background-color':backgroundColor}">
	<view>
	  <form bindsubmit="formSubmit" report-submit="true">
		<button class="send-button" hover-class='none' form-type="submit">
		  <slot ></slot>
		</button>
	  </form>
	</view>
</template>


<script>
	export default {
		name: "send-message",
		
		props: {
			MessageType: {
				type: Number,
				default: 3
			},
			TplKey: {
				type: String,
				default: ''
			},
			TplData: {
				type: Array,
				default() {
					return []
				},
			},
			PageUrl: {
				type: String,
				default: ''
			}
		},

		methods:
		{
			formSubmit: function (e) {
				var t = {
					FormId: e.detail.formId,
					MessageType: this.MessageType,
					TplKey: this.TplKey,
					PageUrl: this.PageUrl,
					TplData: this.TplData
				};

				//$.setTpl(t)
			}
		}
	}

</script>



<style>
/* pages/send-message/send-message.wxss */
 .send-button{background-color: transparent;display: inline-block;font-size: 24upx;padding: 0;margin: 0;text-align:inherit;line-height:inherit;border-radius: 0;}
.send-button::after{border: none;padding: 0;margin: 0;} 
</style>

