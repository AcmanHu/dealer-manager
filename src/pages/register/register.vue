<template>
	<view class="content">
		<view class="input-box">
			<!-- 代理商名称 -->
			<view class="input-item">
				<view class="input-label">代理商名称：</view>
				<view class="input-body">
					<input v-model="name" type="text" @blur="blur_input" style="margin-right: 160upx;" placeholder="请输入代理商名称" class="input">
				</view>
			</view>
			<!-- 联系人 -->
			<view class="input-item">
				<view class="input-label">联系人：</view>
				<view class="input-body">
					<input v-model="contact" type="text" @blur="blur_input" style="margin-right: 160upx;" placeholder="请输入联系人" class="input">
				</view>
			</view>
			<!-- 手机号码 -->
			<view class="input-item">
				<view class="input-label">手机号：</view>
				<view class="input-body">
					<input v-model="phone" maxlength="11" @blur="blur_input" type="number" style="margin-right: 160upx;" placeholder="请输入手机号"
					 class="input">
					<button :disabled="!isCanSendCode" class="btn-code" @click="sendCode">{{sendMsg}}</button>
				</view>
			</view>
			<!-- 验证码 -->
			<view class="input-item">
				<view class="input-label">验证码：</view>
				<view class="input-body">
					<input placeholder="请输入验证码" @blur="blur_input" type="number" v-model="code" maxlength="6" class="input">
				</view>
			</view>
			<!-- 城市列表 -->
			<!-- <view class="input-item">
				<view class="input-label">选择城市：</view>
				<view class="input-body" @click="showPicker">
					<text class="input m_placeholder">{{area}}</text>
				</view>
			</view> -->
			<!-- 备注 -->
			<!-- <view class="input-item">
				<view class="input-label">备注：</view>
				<view class="input-body">
					<input v-model="remark" type="text" @blur="blur_input" style="margin-right: 160upx;" placeholder="备注信息" class="input">
				</view>
			</view> -->
		</view>
		<button class="button" @click="submit">提交</button>
		<!-- 城市列表 -->
		<mpvue-picker ref="mpvuePicker" themeColor="#4C83D6" :mode="mode" :deepLength="3" :pickerValueDefault="pickerValueDefault"
		 @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	var graceChecker = require('../../common/graceChecker.js');
	let timer = '';
	export default {
		components: {},
		data() {
			return {
				sendMsg: "发送验证码",
				isCanSendCode: true,

				name: "",
				contact: "",
				phone: "",
				code: "",
				area: "请选择城市",
				remark: "",

				// ---------------------------------
				mode: 'multiLinkageSelector',
				pickerValueArray: this.$Toast.cityList,
				// picker默认选中
				pickerValueDefault: [0, 0, 0]
			};
		},
		onLoad() {

		},
		methods: {
			// 城市列表弹窗
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			// 确定时触发
			onConfirm(e) {
				this.area = e.label
			},
			// 改变时触发
			onChange(e) {
				this.area = e.label
			},
			// 取消时触发
			onCancel(e) {
				this.area = e.label
			},
			blur_input() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
			},
			// 验证码
			setCodeInterval() {
				//设置验证码重新发送定时器
				let time = 60;
				clearInterval(timer);
				timer = setInterval(() => {
					time--;
					this.isCanSendCode = false;
					this.sendMsg = time + "s"
					if (time <= 0) {
						this.isCanSendCode = true;
						this.sendMsg = "重新获取";
						clearInterval(timer);
					}
				}, 1000)
			},
			// ----------
			clearCodeInterval() {
				clearInterval(timer);
				this.codemsg = "获取验证码";
			},
			//发送验证码
			sendCode() {
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
							this.setCodeInterval();
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
			async submit() {
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
				// let sign = this.area === '请选择城市' ? '' : this.area
				// if (this.$Toast.checkNone(sign)) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '城市不能为空'
				// 	})
				// 	return;
				// }

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

<style lang="scss" scoped>
	.input-box {
		padding: 20upx !important;
	}

	.input-label {
		width: 200upx !important;
		text-align: right;
	}
</style>
