<template>
	<view class="register">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="../../static/img/jete_logo.jpg"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput v-model="name" type="text" placeholder="代理商名称"></wInput>
				<wInput v-model="contact" type="text" placeholder="联系人"></wInput>
				<wInput v-model="phone" type="number" maxlength="11" placeholder="手机号"></wInput>
				<!-- 		<wInput v-model="passData" type="password" maxlength="11" placeholder="登录密码" isShowPass></wInput> -->
				<wInput v-model="code" type="number" maxlength="6" placeholder="验证码" isShowCode ref="runCode" @setCode="getVerCode()"></wInput>
			</view>

			<wButton text="注 册" :rotate="isRotate" @click.native="startReg()"></wButton>

			<!-- 底部信息 -->
			<!-- <view class="footer">
				<text @tap="isShowAgree" class="cuIcon" :class="showAgree?'cuIcon-radiobox':'cuIcon-round'">同意</text> -->
			<!-- 协议地址 -->
			<!-- <navigator url="" open-type="navigate">《协议》</navigator>
			</view> -->
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button

	export default {
		data() {
			return {
				//logo图片 base64
				logoImage: '../../static/img/jete_wem.png',
				phoneData: '', // 用户/电话
				passData: '', //密码
				verCode: "", //验证码
				showAgree: true, //协议是否选择
				isRotate: false, //是否加载旋转
				// ---------表单信息
				name: "",
				contact: "",
				phone: "",
				code: "",
				area: "请选择城市",
				remark: ""
			}
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			_this = this;
		},
		methods: {
			isShowAgree() {
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
			getVerCode() {
				//获取验证码
				if (!this.$Toast.checkPhone(this.phone)) {
					return
				}

				/*
				 * 发送验证码逻辑
				 */
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/VerificationCode", {
						data: {
							Phone: this.phone
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						console.log(res);
						uni.hideLoading();
						if (res.data.statusCode === 1) {
							// 倒计时开始
							// this.setCodeInterval();
							this.$refs.runCode.$emit('runCode');
							uni.showToast({
								icon: 'none',
								title: res.data.value
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.value
							})
						}
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			async startReg() {
				// 注册逻辑
				if (this.$Toast.checkNone(this.name)) {
					uni.showToast({
						icon: 'none',
						title: '代理商名称不能为空'
					})
					return;
				}
				if (this.$Toast.checkNone(this.contact)) {
					uni.showToast({
						icon: 'none',
						title: '联系人不能为空'
					})
					return;
				}
				if (!this.$Toast.checkPhone(this.phone)) {
					return;
				};
				if (!this.$Toast.checkCode(this.code)) {
					return;
				};
				let data = {
					DealerName: this.name,
					Contacts: this.contact,
					Phone: this.phone,
					vCode: this.code,
					Address: '',
					Remark: this.remark,
					WXOpenID: uni.getStorageSync('HopenID')
				};
				console.log(data);
				uni.showLoading({
					title: '加载中'
				});
				try {
					let res = await this.$request.post('WeChatSubscription/Distributor/Register', {
						data: data
					});
					console.log(res);
					uni.hideLoading();
					if (res.data.statusCode === 0) {
						uni.showToast({
							icon: 'none',
							title: res.data.value
						})
					} else if (res.data.statusCode === 1) {
						uni.showToast({
							icon: 'success',
							title: res.data.value
						})
						uni.navigateBack({
							delta: 1
						});
					} else {
						console.log(res.data)
					}
				} catch (e) {
					uni.hideLoading();
					//TODO handle the exception
				}
			}
		}
	}
</script>

<style scoped>
	@import url("../../components/watch-login/css/icon.css");

	page {
		height: 100%;
	}

	.register {
		height: 100%;
		background-image: url('~@/static/bg.jpg');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* margin-top: 128upx; */
		/* height: 100%; */
	}

	/* 头部 logo */
	.header {
		width: 161upx;
		height: 161upx;
		box-shadow: 0upx 0upx 60upx 0upx rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		background-color: #fff;
		margin-top: 128upx;
		margin-bottom: 72upx;
		margin-left: auto;
		margin-right: auto;
	}

	.header image {
		width: 161upx;
		height: 161upx;
		border-radius: 50%;
	}

	/* 主体 */
	.main {
		display: flex;
		flex-direction: column;
		padding-left: 70upx;
		padding-right: 70upx;
	}

	.tips {
		color: #999999;
		font-size: 28upx;
		margin-top: 64upx;
		margin-left: 48upx;
	}

	/* 其他登录方式 */
	.other_login {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 256upx;
		text-align: center;
	}

	.login_icon {
		border: none;
		font-size: 64upx;
		margin: 0 64upx 0 64upx;
		color: rgba(0, 0, 0, 0.7)
	}

	.wechat_color {
		color: #83DC42;
	}

	.weibo_color {
		color: #F9221D;
	}

	.github_color {
		color: #24292E;
	}

	/* 底部 */
	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-top: 64upx;
		color: rgba(0, 0, 0, 0.7);
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}

	.footer text {
		font-size: 24upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
</style>
