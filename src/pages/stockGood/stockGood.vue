<template>
	<view>
		<view class="input-box m-container">
			<!-- 代理商名称 -->
			<view class="input-item">
				<view class="input-label">进货产品：</view>
				<view class="input-body" @click="showPicker">
					<text class="input m_placeholder">{{product}}</text>
				</view>
			</view>
			<!-- 单价 -->
			<view class="input-item">
				<view class="input-label">单价：</view>
				<view class="input-body">
					<!-- <input v-model="price" type="text" style="margin-right: 160upx;" placeholder="请输入联系人" class="input"> -->
					<text class="input m_placeholder">{{price===""?'':'￥'+price}}</text>
				</view>
			</view>
			<!-- 最低进货量 -->
			<view class="input-item">
				<view class="input-label">最低进货量：</view>
				<view class="input-body">
					<!-- <input v-model="price" type="text" style="margin-right: 160upx;" placeholder="请输入联系人" class="input"> -->
					<text class="input m_placeholder">{{minCount}}</text>
				</view>
			</view>
			<!-- 购买数量 -->
			<view class="input-item">
				<view class="input-label">进货数量：</view>
				<view class="input-body">
					<!-- <uni-number-box :min="1" @change="changeNum" :value="numVal" :disabled="disabledNum"></uni-number-box> -->
					<uniNumBox @change="changeNum" :min="minCount" :disabled="disabledNum" v-model="numVal"></uniNumBox>
				</view>
			</view>
			<!-- 应付货款 -->
			<view class="input-item">
				<view class="input-label">应付货款：</view>
				<view class="input-body">
					<!-- <input v-model="price" type="text" style="margin-right: 160upx;" placeholder="请输入联系人" class="input"> -->
					<text class="input m_placeholder">{{newPrice===""?'':'￥'+newPrice}}</text>
				</view>
			</view>
			<!-- 备注 -->
			<view class="input-item">
				<view class="input-label">备注：</view>
				<view class="input-body">
					<input v-model="remark" type="text" style="margin-right: 160upx;" placeholder="备注信息" class="input">
				</view>
			</view>
			<!-- 月末结账 -->
			<view style="margin-top: 40upx;" v-show="dealerMsg.isCheckOutForMonth === 1">
				<checkbox-group @change="checkChange">
					<label>
						<checkbox value="cb" checked="true" />月末结账
					</label>
				</checkbox-group>
			</view>
		</view>
		<view class="m-footer">
			<button class="button" @click="toPay">去支付</button>
		</view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" :deepLength="3" themeColor="#4C83D6" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onChange="onConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import {
		checkNone
	} from "@/common/common.js"
	import uniNumBox from '../../components/uni-number-box.vue';
	export default {
		components: {
			uniNumBox
		},
		data() {
			return {
				// 经销商信息
				dealerMsg: uni.getStorageSync('HdealerMsg'),
				dealerWXOpenID: uni.getStorageSync('HopenID'),
				// 
				isChecked: 1,
				// --------数字选择框---------
				minCount: 1, // 最少数量
				disabledNum: true,
				numVal: 1,
				// --------表单数据---------
				product: "请选择产品",
				price: 0,
				newPrice: 0,
				num: 1,
				remark: "",
				// --------picker数据---------
				mode: 'selector',
				pickerIndex: -1,
				pickerValueArray: [],
				pickerValueDefault: [0],
			};
		},
		onReady() {
			this.getProductData()
		},
		methods: {
			// picker列表弹窗
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			// 确定时触发
			onConfirm(e) {
				console.log(e.index[0]);
				let oIndex = e.index[0]
				console.log(this.pickerValueArray[oIndex]);
				this.pickerIndex = e.index[0]
				this.product = e.label
				this.price = this.pickerValueArray[oIndex].newPrice
				this.minCount = this.pickerValueArray[oIndex].minCount
				this.numVal = this.pickerValueArray[oIndex].minCount
				this.newPrice = this.price * this.minCount
				this.disabledNum = false
			},
			// 改变时触发
			// onChange(e) {
			// 	this.pickerIndex = e.index[0]
			// 	this.product = e.label
			// 	this.price = this.pickerValueArray[e.index[0]].newPrice
			// 	this.minCount = this.pickerValueArray[e.index[0]].minCount
			// 	this.numVal = this.pickerValueArray[e.index[0]].minCount
			// 	this.newPrice = this.price
			// 	this.disabledNum = false
			// },
			// 选择商品数量
			changeNum(e) {
				this.newPrice = this.price * this.numVal
			},
			// checkbox 改变时触发
			checkChange(e) {
				this.isChecked = e.detail.value.length
			},
			// 跳转去支付
			toPay() {
				try {
					let sign = this.product === '请选择产品' ? '' : this.product
					if (this.$Toast.checkNone(sign)) {
						uni.showToast({
							icon: 'none',
							title: '产品不能为空'
						})
						return;
					}
					let Odata = {
						ProductID: this.pickerValueArray[this.pickerIndex].id,
						Price: this.pickerValueArray[this.pickerIndex].newPrice,
						OriginalPrice: this.pickerValueArray[this.pickerIndex].price, // 原价
						Count: this.numVal,
						Remark: this.remark,
						IsCheckOutForMonth: this.dealerMsg.isCheckOutForMonth,
						DealerID: this.dealerMsg.dealerID,
						PaymentBillID: ''
					}
					console.log(Odata);
					// 判断是否显示月结按钮
					if (this.dealerMsg.isCheckOutForMonth === 1 && this.compareDate()) {
						// TODO 显示月结按钮执行 判断是否选择月结
						if (this.isChecked === 1) {
							this.payRequest(Odata)
						} else {
							Odata.IsCheckOutForMonth = 0
							uni.setStorageSync('HBuyshopData', Odata);
							this.weChatPay()
						}
					} else {
						// TODO 不月结权限时执行 支付
						uni.setStorageSync('HBuyshopData', Odata);
						this.weChatPay()
					}
				} catch (e) {
					//TODO handle the exception
					uni.showToast({
						icon: 'none',
						title: '您还未完成注册'
					});
				}
			},
			// 调用购买产品的接口
			payRequest(data) {
				console.log(data)
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/BuyProduct", {
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
							// 成功之后清空数据
							this.product = "请选择产品"
							// this.num = 1
							this.price = 0
							this.newPrice = 0
							this.numVal = 1
							this.disabledNum = true
							this.remark = ""
							// --------------------
							uni.showToast({
								icon: 'success',
								title: res.data.value
							})
							// 跳转到库存页面
							uni.navigateTo({
								url: '../inventory/inventory'
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.value
							})
							console.log(res.data)
						}
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 微信支付
			weChatPay() {
				if (!this.dealerWXOpenID) {
					return;
				}
				let data = {
					money: this.newPrice,
					openId: this.dealerWXOpenID,
					url: 'h5/index.html#/pages/inventory/inventory',
					extra: this.dealerMsg.dealerID
				}
				console.log(data);
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/WeChatPay", {
						data: {
							openId: data.openId,
							money: data.money,
							url: data.url,
							extra: data.extra
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					})
					.then(res => {
						uni.hideLoading();
						let oData = res.data.value
						let toUrl = JSON.parse(oData)
						window.location.href = toUrl.data
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 获取商品数据
			getProductData() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetProduct", {
						data: {
							Id: this.dealerMsg.dealerLevelID
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						console.log(res);
						let arr = []
						let oData = res.data.value
						for (let item of oData) {
							item.p.id = item.productID
							item.p.newPrice = item.price
							item.p.minCount = item.minCount
							arr.push(item.p)
						}
						this.pickerValueArray = JSON.parse(JSON.stringify(arr).replace(/productName/g, "label"));
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 比较时间
			compareDate() {
				let s = this.dealerMsg.noCheckOutForMonthBeginDate[0] + ' ' + this.dealerMsg.noCheckOutForMonthBeginDate[1]
				let e = this.dealerMsg.noCheckOutForMonthEndDate[0] + ' ' + this.dealerMsg.noCheckOutForMonthEndDate[1]
				let now = new Date().getTime()
				let start = new Date(s).getTime()
				let end = new Date(e).getTime()
				if (now > start && now < end) {
					return false
				} else {
					return true
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.input-label{
		width: 200upx !important;
		text-align: right !important;
	}
</style>
