<template>
	<view class="content">
		<view class="img_box" v-if="showQrcode">
			<tki-qrcode cid="qrcode1" ref="qrcode" :val="qrcode.val" :lv="1" :size='qrcode.size' :background="qrcode.background"
			 :foreground="qrcode.foreground" :pdground="qrcode.pdground" :icon="qrcode.icon" :iconSize="qrcode.iconsize" :onval="false"
			 :loadMake="false" @result="qrR" />
		</view>
		<view class="ewm_msg">长按二维码图片保存或分享</view>
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				src: '',
				showQrcode: false,
				qrcode: {
					val: '',
					background: '#ffffff', // 背景色
					foreground: '#000000', // 前景色
					pdground: '#000000', // 角标色
					icon: '', // 二维码图标
					size: 400,
					iconsize: 40, // 二维码图标大小
					onval: false, // val值变化时自动重新生成二维码
					loadMake: true, // 组件加载完成后自动生成二维码
					src: '' // 二维码生成后的图片地址或base64
				}
			}
		},
		onLoad(option) {
			let oId = option.oId
			this.creatEWM(oId)
			console.log(option);
		},
		methods: {
			qrR(res) {
				this.src = res
			},
			creatEWM(res) {
				let url = encodeURIComponent('http://ds.jete.cn/h5/index.html#/pages/shopRegister/shopRegister?id=' + res)
				// let sentUrl = 'http://wx.aimeifa.com/Home/UULogin?burl=' + url
				let sentUrl = 'http://wx.aimeifa.com/Home/UULogin?shopID=' + this.$pubInfo.shopID + '&appID=' + this.$pubInfo
					.appID + '&loginState=1&backUrl=' + url
				this.$set(this.qrcode, 'val', sentUrl)
				setTimeout(() => {
					this.$refs.qrcode._makeCode()
				}, 100)
				this.showQrcode = true
			}
		}
	}
</script>

<style lang="scss">
	.content{
		text-align: center;
		margin: 200upx 0;
	}
</style>
