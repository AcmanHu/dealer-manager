<template>
	<view class="content">
		<scroll-view class="m-info_box" scroll-y="true">
			<view class="title_box m-container"><text class="m_tag">登录信息</text></view>
			<view class="input-box m-container">
				<view class="input-item">
					<view class="input-label">用户名</view>
					<view class="input-body">
						<pb-input v-model="username" type="text" placeholder="用户名"></pb-input>
						<!-- <input v-model="username" @blur="blur_input" type="text" confirm-type="next" style="margin-right: 160upx;"
						 placeholder="" class="input"> -->
					</view>
				</view>
				<view class="input-item">
					<view class="input-label">密码</view>
					<view class="input-body">
						<pb-input v-model="password" type="text" placeholder="密码" :inClear="1" @setInput="getChangeInput($event,'pass')"></pb-input>
						<!-- <input v-model="password" @blur="password_blur_input" @focus="passwordFocus" type="text" style="margin-right: 160upx;"
						 placeholder="" class="input" :class="[passFocus?'password_input_c':'password_input']"> -->
					</view>
				</view>
			</view>

			<view class="m-flex-space-b title_box m-container title_box_top">
				<text class="m_tag">店铺信息</text>
			</view>
			<!-- 店铺名称 -->
			<view class="input-box m-container">
				<view class="input-item">
					<view class="input-label">店铺名称</view>
					<view class="input-body">
						<pb-input v-model="shopName" type="text" placeholder="请输入店铺名称"></pb-input>
						<!-- <input v-model="shopName" @blur="blur_input" type="text" confirm-type="next" style="margin-right: 160upx;"
						 placeholder="请输入店铺名称" class="input"> -->
					</view>
				</view>
				<!-- 联系人 -->
				<view class="input-item">
					<view class="input-label">联系人</view>
					<view class="input-body">
						<pb-input v-model="contact" type="text" placeholder="请输入联系人"></pb-input>
						<!-- <input v-model="contact" @blur="blur_input" type="text" confirm-type="next" style="margin-right: 160upx;"
						 placeholder="请输入联系人" class="input"> -->
					</view>
				</view>
				<!-- 手机号码 -->
				<view class="input-item">
					<view class="input-label">手机号</view>
					<view class="input-body">
						<!-- <input v-model="phone" @blur="blur_input" @input="phoneInput" maxlength="11" type="number" :focus="phoneFocus"
						 style="margin-right: 160upx;" placeholder="请输入手机号" class="input"> -->
						<pb-input v-model="phone" type="number" maxlength="11" @input="phoneInput" placeholder="请输入手机号"></pb-input>
						<button :disabled="!isCanSendCode" class="btn-code" @click="sendCode">{{sendMsg}}</button>
					</view>
				</view>
				<!-- 验证码 -->
				<!-- <view class="input-item" v-show="showCode"> -->
				<view class="input-item">
					<view class="input-label">验证码</view>
					<view class="input-body">
						<!-- <input placeholder="请输入验证码" @blur="blur_input" type="number" v-model="code" maxlength="6" class="input"> -->
						<pb-input v-model="code" type="number" maxlength="6" placeholder="请输入验证码"></pb-input>
						<!-- <button :disabled="!isCanSendCode" class="btn-code" @click="sendCode">{{sendMsg}}</button> -->
					</view>
				</view>
				<!-- 详细地址 -->
				<view class="input-item">
					<view class="input-label">详细地址</view>
					<view class="input-body">
						<!-- <input v-model="addressDetail" @blur="blur_input" type="text" confirm-type="next" style="margin-right: 160upx;"
						 placeholder="请输入详细地址" class="input"> -->
						<pb-input v-model="addressDetail" type="text" placeholder="请输入详细地址"></pb-input>
					</view>
				</view>
			</view>
			<view class="title_box m-container"><text class="m_tag">产品信息</text></view>
			<view class="input-box m-container">
				<!-- 代理商名称 -->
				<view class="input-item">
					<view class="input-label">选择产品</view>
					<view class="input-body">
						<text class="input m_placeholder">{{product}}</text>
					</view>
				</view>
				<!-- 价格 -->
				<view class="input-item">
					<view class="input-label">价格</view>
					<view class="input-body">
						<!-- <input v-model="price" type="text" style="margin-right: 160upx;" placeholder="请输入联系人" class="input"> -->
						<text class="input m_placeholder">{{price===""?'':'￥'+price}}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="m-footer">
			<button class="button" @click="sureRegister">确定</button>
		</view>

	</view>
</template>

<script>
	let timer = '';
	import pbInput from '@/components/pb-input.vue'
	export default {
		components: {
			pbInput
		},
		data() {
			return {
				// 用户openID
				userOpenID: "",
				// 验证码
				sendMsg: "发送验证码",
				isCanSendCode: true,
				// 特殊的ID 获取店铺数据
				specialId: "",
				detailData: {},
				changeMsg: "更改",
				// 电话号码聚焦
				phoneFocus: false,
				// 验证码
				showCode: false,
				// ---------表单数据------------
				product: "暂无产品",
				price: 0,
				shopName: "",
				contact: "",
				phone: "",
				oldPhone: "",
				code: "",
				addressDetail: "",
				username: "",
				password: "888888",
				// --------------------------------
				passFocus: false
			};
		},
		onLoad(option) {
			// alert("页面参数"+JSON.stringify(option));
			this.specialId = option.id
			this.userOpenID = option.openID
			console.log("参数", option);
			this.getMsg()
		},
		onShow() {
			// console.log(this.specialId)
		},
		methods: {
			getChangeInput(e, str) {
				console.log(e, str);
				if (str === 'pass') {
					this.password = e
				} else if (str === 'price') {
					this.price = e
				}
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
			// 电话输入框聚焦时触发
			focusPhone() {
				this.showCode = true
			},
			// 电话输入框失去焦点时触发
			blurPhone() {
				if (this.$Toast.checkNone(this.phone, '电话不能为空')) {
					return;
				}
				if (!this.$Toast.checkPhone(this.phone)) {
					return;
				}
				if (this.phone === this.oldPhone) {
					this.showCode = false
				} else {
					this.showCode = true
				}
			},
			// 电话输入时触发
			phoneInput(e) {
				this.username = e.detail.value
			},
			// 点击更改手机号
			changePhone() {
				if (this.changeMsg === '更改') {
					this.changeMsg = '取消'
					this.showCode = true
					this.phoneFocus = true
				} else {
					this.changeMsg = '更改'
					this.showCode = false
					this.phoneFocus = false
				}
			},
			// 获取信息
			getMsg() {
				console.log("特殊的id", this.specialId)
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetSaleOrg", {
						data: {
							id: this.specialId
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						console.log(res);
						if (res.data.value.length === 0) {
							uni.showToast({
								icon: 'none',
								title: '没有该id的数据'
							});
							// this.$Toast.Model("没有该id的数据");
						} else {
							let msg = res.data.value[0].os;
							if (msg) {
								this.detailData = res.data.value[0]
								this.product = res.data.value[0].productName
								this.price = msg.price
								this.shopName = msg.orgName
								this.contact = msg.orgContacts
								this.phone = msg.orgPhone
								this.oldPhone = msg.orgPhone
								this.addressDetail = msg.orgAddress
								this.username = msg.orgLoginName
								this.password = msg.orgPassword ? msg.orgPassword : '888888'
							}
							uni.hideLoading();
						}
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 确定注册
			sureRegister() {
				// console.log(this.userOpenID);
				if (this.$Toast.checkNone(this.shopName, '店铺名称不能为空')) {
					return;
				}
				if (this.$Toast.checkNone(this.contact, '联系人不能为空')) {
					return;
				}
				if (this.$Toast.checkNone(this.phone, '电话不能为空')) {
					return;
				}
				if (!this.$Toast.checkPhone(this.phone)) {
					return;
				}
				if (this.$Toast.checkNone(this.code, '验证码不能为空')) {
					return;
				}
				if (!this.$Toast.checkCode(this.code)) {
					return;
				}
				if (this.$Toast.checkNone(this.addressDetail, '地址不能为空')) {
					return;
				}
				if (this.$Toast.checkNone(this.username, '系统用户名不能为空')) {
					return;
				}
				if (this.$Toast.checkNone(this.password, '系统密码不能为空')) {
					return;
				}
				let data = this.detailData.os
				data.id = this.detailData.id
				data.dealerID = this.detailData.dealerID
				data.productID = this.detailData.productID
				// data.createID = (data.createID).toString()
				data.vCode = this.code
				data.orgName = this.shopName
				data.orgContacts = this.contact
				data.orgPhone = this.phone
				data.orgAddress = this.addressDetail
				data.orgLoginName = this.username
				data.orgPassword = this.password
				data.reg = data.reg
				data.ver = data.ver
				data.payBillID = ""
				data.wxOpenID = ""
				console.log("确定注册", data)
				// uni.showLoading({
				// 	title: '加载中'
				// });
				// this.isPhoneRegister(this.phone, (res) => {
				// 	if (res) {
				if (data.payType === 1) {
					let oData = {
						reg: data.reg,
						ver: data.ver,
						money: data.price,
						openId: this.userOpenID,
						url: 'h5/index.html#/pages/registerSuccess/registerSuccess'
					}
					uni.setStorageSync('HshopData', data);
					// 验证验证码是否有效
					this.isCodeUse(res => {
						if (res) {
							this.weChatPay(oData)
						}
					})
				} else {
					// 验证验证码是否有效
					this.isCodeUse(res => {
						if (res) {
							this.reqRegister(data)
						}
					})
				}
				// 	}
				// })
			},
			// 购买店铺的接口
			reqRegister(data) {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/BuyOrg", {
						data: data
					})
					.then(res => {
						console.log(res);
						uni.hideLoading();
						if (res.data.statusCode === 0) {
							uni.showToast({
								icon: 'none',
								title: res.data.value
							})
						} else if (res.data.statusCode === 1) {
							let oData = res.data.value
							let formData = {
								reg: oData.reg,
								userName: oData.orgLoginName,
								password: oData.orgPassword
							}
							uni.navigateTo({
								url: '../registerSuccess/registerSuccess?userdata=' + JSON.stringify(formData)
							});
							uni.showToast({
								icon: 'success',
								title: '注册成功'
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
			//发送验证码
			sendCode() {
				if (!this.$Toast.checkPhone(this.phone)) {
					return
				}
				// alert(this.phone)
				/*
				 * 发送验证码逻辑
				 */
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/VerificationCode", {
						data: {
							Phone: this.phone,
							Type: 1
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
			// 判断验证码是否有效
			isCodeUse(callback) {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/BuyOrgVerificationCode", {
						data: {
							phone: this.phone,
							vCode: this.code
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					})
					.then(res => {
						console.log(res);
						uni.hideLoading();
						if (res.data.statusCode === 0) {
							uni.showToast({
								icon: 'none',
								title: res.data.value
							});
							callback(false)
						} else if (res.data.statusCode === 1) {
							callback(true)
						} else {
							callback(false)
						}
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 微信支付
			weChatPay(data) {
				console.log(data);
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/WeChatPayDealer", {
						data: {
							reg: data.reg,
							ver: data.ver,
							openId: data.openId,
							money: data.money,
							url: data.url
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					})
					.then(res => {
						// alert(res.data.value)
						if (res.data.statusCode === 1) {
							let oUrl = JSON.parse(res.data.value)
							window.location.href = oUrl.data
						}
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 验证手机号是否被注册
			isPhoneRegister(phone, callback) {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/IsRegister", {
						data: {
							phone: phone,
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					})
					.then(res => {
						console.log(res);
						uni.hideLoading();
						if (res.data.statusCode === 1) {
							callback(true)
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.password_input {
		color: #808080;
	}

	.password_input_c {
		color: #000;
	}

	.content {
		height: 100%;

		.m-info_box {
			height: calc(100% - 120upx);
			// overflow: hidden;
		}

		.title_box {
			background: #fff;
			// border-bottom: 2px dashed #99CCFF;
			font-weight: bold;
			border-radius: 6upx;
			font-size: $uni-font-size-sm;

			.m_tag {
				padding-left: 10upx;
				border-left: 2px solid #000;
			}
		}

		.radio_box {
			font-size: $uni-font-size-sm;
		}

		.title_box_top {
			// margin-top: 20upx;
		}

		.tips_info {
			padding: 20upx 0;
			font-size: $uni-font-size-sm;
			color: #999;
		}

		.erweima_box {
			height: 200upx;
			width: 200upx;
			margin: 40upx auto 40upx;

			.erweima {
				height: 100%;
				width: 100%;
			}
		}
	}
</style>
