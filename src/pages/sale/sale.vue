<template>
	<view class="content">
		<scroll-view scroll-y="true" class="m_scroll">
			<view class="title_box m-container"><text class="m_tag">产品信息</text></view>
			<view class="input-box m-container">
				<!-- 代理商名称 -->
				<view class="input-item">
					<view class="input-label">选择产品</view>
					<view class="input-body" @click="showPicker">
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
			<view class="m-flex-space-b title_box m-container title_box_top">
				<text class="m_tag">店铺信息</text>
				<text class="m-color-goto" @click="showMoreInfo">{{lookMore.value}}</text>
			</view>
			<view class="input-box m-container" v-if="lookMore.status">
				<view class="tips_info">
					<view class="m-tips">温馨提示：</view>
					<view class="m-tips">1.可不填写店铺信息和登录信息直接转发链接或二维码</view>
					<view class="m-tips">2.若需建好店铺信息点击展开填写相应信息即可</view>
				</view>
			</view>
			<template v-else>
				<!-- 店铺名称	 -->
				<view class="input-box m-container">
					<view class="input-item">
						<view class="input-label">店铺名称</view>
						<view class="input-body">
							<input v-model="shopName" @blur="blur_input" type="text" style="margin-right: 160upx;" placeholder="请输入店铺名称"
							 class="input">
						</view>
					</view>
					<!-- 联系人 -->
					<view class="input-item">
						<view class="input-label">联系人</view>
						<view class="input-body">
							<input v-model="contact" @blur="blur_input" type="text" style="margin-right: 160upx;" placeholder="请输入联系人" class="input">
						</view>
					</view>
					<!-- 手机号码 -->
					<view class="input-item">
						<view class="input-label">手机号</view>
						<view class="input-body">
							<input v-model="phone" @blur="blur_input" maxlength="11" type="number" style="margin-right: 160upx;" placeholder="请输入手机号"
							 class="input">
							<!-- <button :disabled="!isCanSendCode" class="btn-code" @click="sendCode">{{sendMsg}}</button> -->
						</view>
					</view>
					<!-- 验证码 -->
					<!-- <view class="input-item">
					<view class="input-label">验证码</view>
					<view class="input-body">
						<input placeholder="请输入验证码" type="number" v-model="code" maxlength="6" class="input">
					</view>
				</view> -->
					<!-- 详细地址 -->
					<view class="input-item">
						<view class="input-label">详细地址</view>
						<view class="input-body">
							<input v-model="addressDetail" @blur="blur_input" type="text" style="margin-right: 160upx;" placeholder="请输入详细地址"
							 class="input">
						</view>
					</view>
				</view>
				<view class="title_box m-container"><text class="m_tag">登录信息</text></view>
				<view class="input-box m-container">
					<view class="input-item">
						<view class="input-label">用户名</view>
						<view class="input-body">
							<input v-model="username" @blur="blur_input" type="text" style="margin-right: 160upx;" placeholder="用户名" class="input">
						</view>
					</view>
					<view class="input-item">
						<view class="input-label">密码</view>
						<view class="input-body">
							<input v-model="password" @blur="blur_input" type="text" style="margin-right: 160upx;" placeholder="密码" class="input">
						</view>
					</view>
				</view>
			</template>
			<view class="title_box m-container"><text class="m_tag">店铺注册支付二维码和链接</text></view>
			<view class="input-box m-container">
				<view class="pay-ways-box title_box_top">
					<radio-group @change="radioChange" class="m-flex-space-b radio_box">
						<label v-for="(item, index) in items" :key="item.value">
							<radio :value="item.value" :checked="index === current" />
							{{item.name}}
						</label>
					</radio-group>
				</view>
				<view class="erweima_box" v-if="showQrcode">
					<!-- <image class="erweima" src="../../static/img/jete_ewm.png" mode=""></image> -->
					<tki-qrcode cid="qrcode1" ref="qrcode" :val="qrcode.val" :lv="1" :size='qrcode.size' :background="qrcode.background"
					 :foreground="qrcode.foreground" :pdground="qrcode.pdground" :icon="qrcode.icon" :iconSize="qrcode.iconsize"
					 :onval="false" :loadMake="false" @result="qrR" />
					<view class="">长按二维码图片保存或分享</view>
				</view>
			</view>
		</scroll-view>
		<view class="m_footer">
			<button class="button" @click="createEWM">生成二维码转发</button>
		</view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" :deepLength="3" themeColor="#4C83D6" :pickerValueDefault="pickerValueDefault"
		 @onChange="onConfirm" @onConfirm="onConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	let timer = '';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				// 经销商信息
				dealerMsg: uni.getStorageSync('HdealerMsg'),
				// 验证码
				sendMsg: "发送验证码",
				isCanSendCode: true,
				// ---------表单数据------------
				product: "请选择产品",
				price: 0,
				shopName: "",
				contact: "",
				phone: "",
				code: "",
				addressDetail: "",
				username: "",
				password: "",
				// ---------------------
				lookMore: {
					status: true,
					value: '查看更多'
				},
				// ---------picker数据------------
				mode: 'selector',
				pickerIndex: -1, // picker下标
				pickerValueArray: [],
				pickerValueDefault: [0],
				// -------------------------
				items: [{
						value: '0',
						name: '立即支付'
					},
					{
						value: '1',
						name: '线下支付',
					},
					{
						value: '2',
						name: '先试用'
					}
				],
				// 默认选中
				current: 0,
				// -----二维码配置-----
				showQrcode: false,
				qrcode: {
					val: '',
					background: '#ffffff', // 背景色
					foreground: '#000000', // 前景色
					pdground: '#000000', // 角标色
					icon: '', // 二维码图标
					size: 300,
					iconsize: 40, // 二维码图标大小
					onval: false, // val值变化时自动重新生成二维码
					loadMake: true, // 组件加载完成后自动生成二维码
					src: '' // 二维码生成后的图片地址或base64
				},
				// -----二维码配置-----end
			};
		},
		onShow() {
			this.getProductData()
			// console.log(">>>", this.$store.state.dealerMsg);
		},
		methods: {
			openPopup() {
				// this.$refs.popup.open()
				this.showPopup = true
			},
			closePopup() {

				this.showPopup = false
			},
			blur_input() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
			},
			change(e) {
				console.log(e);
			},
			// picker列表弹窗
			showPicker() {
				if (this.pickerValueArray.length === 0) {
					this.$Toast.Model('您还没有进货，请先进货')
				} else {
					this.$refs.mpvuePicker.show();
				}
			},
			// 确定时触发
			onConfirm(e) {
				console.log(e);
				console.log(this.pickerValueArray[e.index[0]]);
				let oIndex = this.pickerValueArray[e.index[0]]
				if (oIndex.status === 1) {
					this.pickerIndex = e.index[0]
					this.product = e.label
					this.price = this.pickerValueArray[e.index[0]].salePrice
				} else {
					uni.showToast({
						icon: 'none',
						title: '该产品已下架，请联系旺点工作人员'
					});
				}
			},
			// 显示更多信息
			showMoreInfo() {
				if (this.lookMore.status) {
					this.lookMore.value = '收起'
					this.lookMore.status = false
				} else {
					this.lookMore.value = '查看更多'
					this.lookMore.status = true
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
						// 倒计时开始
						this.setCodeInterval();
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: res.data.value
						})
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 
			radioChange(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			// -------二维码-------
			qrR(res) {
				this.src = res
			},
			// ---二维码----
			// 生成二维码
			createEWM() {
				/**
				 * ID 主键ID
				 * ProductID 产品ID
				 * Price 价格
				 * OrgName 店铺名称
				 * OrgContacts 店铺联系人
				 * OrgPhone 联系人电话
				 * OrgAddress 地址
				 * OrgLoginName 店铺登录名
				 * OrgPassword 店铺密码
				 * DealerID	经销商ID
				 * PayType 支付类型 1=线上支付2=线下支付3=试用
				 * DealerWXOpenID 经销商微信ID
				 * WXOpenID 顾客微信ID
				 */
				let data = {
					ProductID: '',
					Price: 0,
					OrgName: '',
					OrgContacts: '',
					OrgPhone: '',
					OrgAddress: '',
					OrgLoginName: '',
					OrgPassword: '',
					DealerID: this.dealerMsg.dealerID,
					PayType: this.current + 1,
					DealerWXOpenID: uni.getStorageSync('HopenID'),
					WXOpenID: '',
					ver: this.dealerMsg.ver,
					reg: this.dealerMsg.reg
				}
				// 判断是否显示店铺信息
				let sign = this.product === '请选择产品' ? '' : this.product;
				if (this.lookMore.status) {
					// 表单验证
					if (this.$Toast.checkNone(sign, '产品不能为空')) {
						return;
					}
					data.Price = this.price
					data.ProductID = this.pickerValueArray[this.pickerIndex].productID
					this.choosePayWays(data)
				} else {
					if (this.$Toast.checkNone(sign, '产品不能为空')) {
						return;
					}
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
					// if (this.$Toast.checkNone(this.code, '验证码不能为空')) {
					// 	return;
					// }
					// if (!this.$Toast.checkCode(this.code)) {
					// 	return;
					// }
					if (this.$Toast.checkNone(this.addressDetail, '地址不能为空')) {
						return;
					}
					if (this.$Toast.checkNone(this.username, '系统用户名不能为空')) {
						return;
					}
					if (this.$Toast.checkNone(this.password, '系统密码不能为空')) {
						return;
					}
					data.ProductID = this.pickerValueArray[this.pickerIndex].productID
					data.Price = this.price
					data.vCode = this.code
					data.OrgName = this.shopName
					data.OrgContacts = this.contact
					data.OrgPhone = this.phone
					data.OrgAddress = this.addressDetail
					data.OrgLoginName = this.username
					data.OrgPassword = this.password
					this.choosePayWays(data)
				}
			},
			choosePayWays(data) {
				/**
				 * this.current = 0 表示选择立即支付
				 * this.current = 1 表示选择线下支付
				 * this.current = 2 表示选先试用
				 */
				this.requestData(data, (res) => {
					console.log("id是", res)
					let url = encodeURIComponent('http://ds.jete.cn/h5/index.html#/pages/shopRegister/shopRegister?id=' + res)
					// let sentUrl = 'http://wx.aimeifa.com/Home/UULogin?burl=' + url
					let sentUrl = 'http://wx.aimeifa.com/Home/UULogin?shopID=' + this.$pubInfo.shopID + '&appID=' + this.$pubInfo
						.appID + '&loginState=1&backUrl=' + url
					console.log(sentUrl)
					this.$set(this.qrcode, 'val', sentUrl)
					setTimeout(() => {
						this.$refs.qrcode._makeCode()
					}, 1000)
					this.showQrcode = true
				})
			},
			// 调用经销商销售生成订单接口
			async requestData(data, callback) {
				console.log("提交的数据", data);
				uni.showLoading({
					title: '加载中'
				});
				try {
					let res = await this.$request.post('WeChatSubscription/Distributor/SaleOrg', {
						data: data
					});
					console.log(res);
					// uni.hideLoading();
					if (res.data.statusCode === 0) {
						uni.showToast({
							icon: 'none',
							title: res.data.value
						})
					} else if (res.data.statusCode === 1) {
						callback(res.data.value)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.value
						})
					}
				} catch (e) {
					uni.hideLoading();
					this.$Toast.Model();
					//TODO handle the exception
				}
			},
			// 获取经销商产品信息
			getProductData() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetProductByDealer", {
						data: {
							ID: this.dealerMsg.dealerID
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						console.log(res);
						let oData = res.data.value
						// for (let item of oData) {
						// 	item.p.id = item.productID
						// 	arr.push(item.p)
						// }
						if (oData.length !== 0) {
							this.pickerValueArray = JSON.parse(JSON.stringify(oData).replace(/productName/g, "label"));
						}
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			}
		},
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.content {
		height: 100%;
	}

	.m_scroll {
		height: calc(100% - 120upx)
	}

	.m_footer {
		padding: 20upx 0;
	}

	.content {
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
			margin-top: 20upx;
		}

		.tips_info {
			padding: 20upx 0;
			font-size: $uni-font-size-sm;
			color: #999;
		}

		.erweima_box {
			height: 300upx;
			width: 300upx;
			margin: 40upx auto 40upx;
			font-size: $uni-font-size-sm;

			.erweima {
				height: 100%;
				width: 100%;
			}
		}
	}
</style>
