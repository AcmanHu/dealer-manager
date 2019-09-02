<template>
	<view class="content">
		<view class="m-container m-flex-align tab_box">
			<view class="m-align-justify-c select_ways" @click="showPicker">
				<text>{{selectWay===""?"按类型":selectWay}}</text>
				<text class="m-icon">&#xe601;</text>
			</view>
			<view class="wuc_box">
				<wuc-tab :tab-list="tabList[pickerIndex]" :tabCur.sync="TabCur" textFlex @change="tabChange" @tabData="getTabData" class="wuc_tab"></wuc-tab>
			</view>
		</view>
		<scroll-view scroll-y="true" class="m-scroll">
			<template v-if="pickerIndex === 0">
				<template v-if="TabCur === 0">
					<view :class="['m-shadow_box detail_box', {isChoose: item.isChoose}]" v-for="(item, key) in monthSaleData" :key="key"
					 @click="selectProduct(key)">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">产品：<text class="cont">{{item.productName}}</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">单价：<text class="cont">{{item.salePrice}}</text></view>
								<view class="title">进货时间：<text class="cont">{{item.orderTime[0]}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.count * item.salePrice}}</text>
						</view>
					</view>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else>
					<view :class="['m-shadow_box detail_box', {isChoose: item.isChoose}]" v-for="(item, key) in oneSaleData" :key="key"
					 @click="selectProduct(key)">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">产品：<text class="cont">{{item.productName}}</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">单价：<text class="cont">{{item.salePrice}}</text></view>
								<view class="title">进货时间：<text class="cont">{{item.orderTime[0]}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.count * item.salePrice}}</text>
						</view>
					</view>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
			</template>
			<template v-else>
				<view class="no_more_data">功能完善中....0.0~</view>
			</template>
		</scroll-view>
		<view class="m-footer">
			<button class="button" @click="toPay">立即支付</button>
		</view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" :deepLength="3" themeColor="#4C83D6" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import mpvuePicker from 'mpvue-picker';
	export default {
		components: {
			WucTab,
			mpvuePicker
		},
		data() {
			return {
				// 经销商信息
				dealerMsg: uni.getStorageSync('HdealerMsg'),
				dealerWXOpenID: uni.getStorageSync('HopenID'),
				TabCur: 0,
				// 产品选择index
				chooseList: [],
				// 选择的所有数据集合
				allSelectList: [],
				// tabList数据
				tabList: [
					[{
						name: '全部'
					}],
					[{
						name: '全部'
					}, {
						name: '本月'
					}, {
						name: '上月'
					}, {
						name: '今年'
					}]
				],
				selectWay: "",
				pickerIndex: 0,
				// ---------picker数据------------
				mode: 'selector',
				pickerValueArray: [{
						label: '按类型',
						value: 1,
					},
					{
						label: '按时间',
						value: 2,
					}
				],
				pickerValueDefault: [0],
				// ------------月结单子的数据---------------
				monthSaleData: [],
				// 单个店铺单子数据
				oneSaleData: [],
				// 支付的总金额
				payMoney: 0,
			};
		},
		onShow() {
			this.getProductData()
			this.getData()
			// this.$Toast()
		},
		methods: {
			tabChange(index) {
				// console.log(index);
				this.TabCur = index;
			},
			getTabData(data) {
				if (data.id) {
					this.oneSaleData = []
					for (let item of this.monthSaleData) {
						if (item.productID === data.id) {
							this.oneSaleData.push(item)
						}
					}
					// console.log(this.monthSaleData);
					// console.log(data)
				} else {
					console.log(123)
				}
			},
			// picker列表弹窗
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			// 确定时触发
			onConfirm(e) {
				console.log(e);
				this.pickerIndex = e.index[0]
				this.selectWay = e.label
			},
			// 取消时触发
			onCancel(e) {
				this.pickerIndex = e.index[0]
				this.selectWay = e.label
			},
			// 选择产品
			selectProduct(key) {
				if (this.TabCur === 0) {
					console.log(key);
					let flag = this.monthSaleData[key]
					if (flag.isChoose) {
						this.monthSaleData[key].isChoose = false
					} else {
						this.monthSaleData[key].isChoose = true
					}
				} else {
					console.log(key);
					let flag = this.oneSaleData[key]
					if (flag.isChoose) {
						this.oneSaleData[key].isChoose = false
					} else {
						this.oneSaleData[key].isChoose = true
					}
				}

				// if(this.TabCur === 0) {
				// 	if(this.allSelectList.includes(id)) {
				// 		this.allSelectList = this.allSelectList.filter(ele => {
				// 			return ele !== id;
				// 		})
				// 	} else {
				// 		this.allSelectList.push(id)
				// 	}
				// } else {
				// 	
				// 	
				// }
			},
			// 选择产品
			chooseProduct(key) {
				// if(this.TabCur === 0) {
				// 	
				// } else {
				// 	
				// 	
				// }
				let cList = this.chooseList[this.TabCur]
				if (cList.includes(key)) {
					this.chooseList[this.TabCur] = cList.filter(function(ele) {
						return ele != key;
					});
				} else {
					this.chooseList[this.TabCur].push(key);
				}
			},
			// 获取数据
			getData() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetIsMonthSaleBill", {
						data: {
							DealerID: this.dealerMsg.dealerID
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						console.log("数据", res);
						let oData = res.data.value
						for (let item of oData) {
							item.isChoose = false
							item.orderTime = item.orderTime.split('T')
						}
						console.log(oData);
						this.monthSaleData = oData
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model()
						console.error('error:', error);
					});
			},
			// 获取产品数据
			getProductData() {
				uni.showLoading({
					title: '加载中'
				});
				this.tabList[0].splice(0, this.tabList[0].length)
				this.tabList[0].push({
					name: '全部'
				})
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
						this.chooseList = []
						this.chooseList.push([])
						let oData = res.data.value
						for (let item of oData) {
							let obj = {}
							obj.name = item.p.productName
							obj.id = item.productID
							this.tabList[0].push(obj)
							this.chooseList.push([])
						}
						console.log(this.chooseList.length)
						// console.log(obj);
						// this.$set(this.tabList, 0, JSON.parse(JSON.stringify(arr).replace(/productName/g,"name")))
						// this.tabList[0] = JSON.parse(JSON.stringify(arr).replace(/productName/g,"name"));
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 支付
			toPay() {
				let payData = []
				let money = 0
				this.monthSaleData.forEach(res => {
					if (res.isChoose) {
						money += res.money
						payData.push(res.id)
					}
				})
				this.payMoney = money
				if (payData.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '您还未选择产品'
					});
				} else {
					uni.setStorageSync('monthPayData', payData)
					this.weChatPay()
				}
				console.log(this.payMoney)
			},
			// 月结支付
			monthPay() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/MonthPay", {
						data: {
							ID: [],
							PayBillID: ''
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					})
					.then(res => {
						uni.hideLoading();
						console.log(res);
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
					money: this.payMoney,
					openId: this.dealerWXOpenID,
					url: 'h5/index.html#/pages/my/my',
					extra: this.dealerWXOpenID + '$' + this.dealerMsg.dealerID
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
						console.log(JSON.parse(oData));
						window.location.href = toUrl.data
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
					});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tab_box {
		overflow: hidden;
		.select_ways {
			font-size: $uni-font-size-base;
			white-space: nowrap;
		}
		.wuc_box{
			width: calc(100% - 120upx);
		}
		.wuc_tab {
			flex: 1;
			font-size: $uni-font-size-base;
		}
	}

	.m-scroll {
		height: calc(100vh - 270upx);
	}

	.isChoose {
		position: relative;
	}

	.isChoose::after {
		font-family: "iconfont" !important;
		font-size: 60upx;
		color: red;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		content: '\e600';
		position: absolute;
		right: 0;
		top: 0;
	}

	.detail_box {
		padding: 30upx;
		box-sizing: border-box;
		margin: 20upx;

		.detail_cont {
			.cont_box {
				flex: 1;
				font-size: $uni-font-size-base;

				.title {
					color: #999;
					padding: 5upx 0;

					.cont {
						color: #000;
					}
				}
			}
		}

		.foot_cont {
			text-align: right;
			padding-top: 20upx;
			font-size: $uni-font-size-sm;

			.price {
				font-size: $uni-font-size-lg;
				font-weight: bold;
				color: red;
				margin: 0 6upx;
			}
		}
	}
</style>
