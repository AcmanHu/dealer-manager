<template>
	<view class="content">
		<view class="m-container">
			<!--  -->
			<template v-if="stockData.length!==0">
				<mySwiper :listData="stockData" @changeIndex="getSwiperKey"></mySwiper>
				<!-- <mSwiper :listData="stockData" @changeIndex="getSwiperKey1"></mSwiper> -->
			</template>
			<!--  -->
			<view class="m-flex-align tab_box">
				<!-- <view class="m-align-justify-c select_ways" @click="showPicker">
					<text>{{selectWay===""?"按类型":selectWay}}</text>
					<text class="m-icon">&#xe601;</text>
				</view> -->
				<wuc-tab :tab-list="timeTabList" :tabCur.sync="TimeTabCur" textFlex @change="TimeTabChange" class="wuc_tab"></wuc-tab>
			</view>
			<!--  -->
			<view class="m-flex-align tab_box">
				<!-- <view class="m-align-justify-c select_ways" @click="showPicker">
					<text>{{selectWay===""?"按类型":selectWay}}</text>
					<text class="m-icon">&#xe601;</text>
				</view> -->
				<wuc-tab :tab-list="tabList[pickerIndex]" :tabCur.sync="TabCur" textFlex @change="tabChange" class="wuc_tab"></wuc-tab>
			</view>
		</view>
		<!--  -->
		<scroll-view scroll-y="true" class="m-scroll">
			<myInventoryMsg v-for="(item,key) in curShowData" :key="key" :info="item" @sendId="getId"></myInventoryMsg>
			<view class="no_more_data">没有更多数据了~</view>
		</scroll-view>
		<view class="bottom_box">
			<view class="bot_info">
				进货：<text>{{jinhuo}}</text>
			</view>
			<view class="bot_info">
				赠送：<text>{{zengsong}}</text>
			</view>
			<view class="bot_info">
				销售：<text>{{xiaoshou}}</text>
			</view>
			<view class="bot_info">
				库存：<text>{{kucun}}</text>
			</view>
		</view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" themeColor="#4C83D6" :deepLength="3" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<!-- 二维码弹出层 -->
		<view class="post" v-show="tishi">
			<view class="content" style="text-align: center;width: 580upx;margin: 0 auto;">
				<view style="padding-top: 20upx;margin-top: 30upx;">
					<view @click="guanbi">
						<img id="test" style="width: 100%;height: 100%;" />
					</view>
				</view>
			</view>
			<view style="color: #ffffff;font-size: 30upx;margin-top: 70upx;">长按保存图片至相册</view>
			<!-- #ifdef APP-PLUS -->
			<image @click="guanbi" class="cha" style="width: 80upx;height: 80upx; margin-top: 25upx;margin-left: 47%;"></image>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<image @click="guanbi" class="cha" style="width: 80upx;height: 80upx; margin-top: 25upx; margin: 0;"></image>
			<!-- #endif -->
		</view>
		<!-- 自定义时间选择 -->
		<rangeDatePick :show="isDateShow" @showchange="showDatechange" start="2019-01-01" end="2200-12-01" :value="value"
		 @change="bindChange" @cancel="bindCancel" themeColor="#4C83D6" fields="day"></rangeDatePick>
	</view>
</template>

<script>
	import mySwiper from '@/components/jing-swiper/jing-swiper.vue';
	import mSwiper from '@/components/m-swiper.vue';
	import rangeDatePick from '@/components/range-dtpicker/range-dtpicker.vue';
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import myInventoryMsg from '@/components/myInventoryMsg.vue';
	import mpvuePicker from 'mpvue-picker';
	import canvas_x from '../../common/ewm/canvas_x.js';
	export default {
		components: {
			WucTab,
			mpvuePicker,
			mySwiper,
			mSwiper,
			rangeDatePick,
			myInventoryMsg
		},
		data() {
			return {
				tishi: false,
				// 经销商信息
				dealerMsg: uni.getStorageSync('HdealerMsg'),
				// 经销商ID
				dealerId: '',
				// mySwiper 切换下标
				mySwiperKey: 0,
				// tab当前选择
				TabCur: 0,
				TimeTabCur: 1,
				// 自定义时间数据
				curOwnTimeData: [],
				// 当前时间的数据
				curTimeData: [],
				// 当前选择产品的数据
				curProductData: [],
				// 需要展示的数据
				curShowData: [],
				// 所有数据
				allStockData: [],
				// 时间汇总，上月 当月 最近上个月
				timeTotal: [],
				// ------------自定义时间区块
				isDateShow: false,
				jinhuo: 0,
				// 进货数据
				zengsong: 0,
				// 赠送数据
				xiaoshou: 0,
				// 销售数据
				kucun: 0,
				// 库存数据

				value: [],
				// tab分类数据
				tabList: [
					[{
						name: '全部'
					}, {
						name: '销售'
					}, {
						name: '进货'
					}, {
						name: '赠送'
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
				timeTabList: [],
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
			};
		},
		onLoad(option) {
			let oDealerId = Object.keys(option)
			if (oDealerId.length === 0) {
				this.dealerId = this.dealerMsg.dealerID
			} else {
				// alert("购买店铺的数据"+ JSON.stringify(uni.getStorageSync('HBuyshopData')))
				this.dealerId = option.extra
				let oData = uni.getStorageSync('HBuyshopData')
				oData.PaymentBillID = option.orderID
				// alert("页面参数" + JSON.stringify(option))
				// alert(JSON.stringify(oData))
				this.payRequest(oData)
			}
		},
		onShow() {
			this.getMonth()
			this.getStock()
		},
		watch: {
			curTimeData: {
				handler(n, o) {
					let j = 0,
						z = 0,
						x = 0;
					for (let item of n) {
						if (item.status === 1) {
							x = x + item.count
						} else {
							if (item.payModel === 4) {
								z = z + item.count
							} else {
								j = j + item.count
							}
						}
					}
					this.jinhuo = j
					this.zengsong = z
					this.xiaoshou = x
				},
				// immediate: true	
			}
		},
		methods: {
			guanbi() {
				this.tishi = false
			},
			getId(e) {
				let url = encodeURIComponent('http://ds.jete.cn/h5/index.html#/pages/shopRegister/shopRegister?id=' + e);
				let sentUrl = 'http://wx.aimeifa.com/Home/UULogin?shopID=' + this.$pubInfo.shopID + '&appID=' + this.$pubInfo
					.appID + '&loginState=1&backUrl=' + url;
				this.tishi = true;
				canvas_x.makeImage({
					type: 'url',
					parts: [{
							type: 'image',
							url: "../../static/bg.jpg",
							width: 680,
							height: 680,
							// backgroundSize: 680,
						},
						{
							type: 'qrcode',
							text: sentUrl,
							x: 0,
							y: 0,
							width: 680,
							height: 680,
							padding: 0,
							background: '#fff',
							level: 1
						},
					],
					width: 680,
					height: 680
				}, (err, data) => {
					document.getElementById('test').src = data
				})
			},
			// 获取月份
			getMonth() {
				let oDate = new Date()
				let curMonth = oDate.getMonth() + 1
				let lastMonth = curMonth - 1
				if (lastMonth === 0) {
					lastMonth = 12
				}
				let llastMonth = lastMonth - 1
				if (lastMonth === 0) {
					llastMonth = 12
				}
				this.timeTotal = [llastMonth, lastMonth, curMonth]
				this.timeTabList = [{
						name: lastMonth + '月'
					},
					{
						name: curMonth + '月'
					},
					{
						name: llastMonth + '-' + curMonth + '月'
					}, {
						name: '自定义'
					}
				]
			},
			getSwiperKey1(key) {
				console.log(key);
			},
			// 获取 mySwiper 切换下标
			getSwiperKey(key) {
				console.log(this.stockData[key]);
				this.TabCur = 0
				this.TimeTabCur = 1
				this.curProductData = []
				this.allStockData = []
				this.pubDealData(this.stockData[key])
			},
			pubDealData(data) {
				this.kucun = data.surplusCount
				this.curProductData = []
				for (let item of data.orgSales) {
					let obj = {}
					// 销售的
					obj.status = 1
					obj.id = item.id
					obj.paySate = item.patState
					obj.date = item.date
					obj.price = item.buyPrice
					obj.count = item.count
					obj.totalPrice = item.price
					this.allStockData.push(obj)
				}
				for (let item of data.buyProductRecords) {
					// 进货的
					let obj = {}
					obj.status = 2
					obj.payModel = item.payModel
					obj.date = item.orderTime
					obj.price = item.buyPrice
					obj.count = item.count
					obj.totalPrice = item.totalMoney
					this.allStockData.push(obj)
				}
				for (let item of this.allStockData) {
					let curDate = new Date()
					let curY = curDate.getFullYear()
					let curM = curDate.getMonth() + 1
					let [Y, M, D] = item.date[0].split('-')
					if (curY == Y && curM == M) {
						this.curProductData.push(item)
					}
				}
				this.curTimeData = this.curProductData
				this.curShowData = this.curProductData
			},
			TimeTabChange(index) {
				this.TimeTabCur = index;
				let curDate = new Date()
				let curY = curDate.getFullYear()
				let curM = curDate.getMonth() + 1
				switch (index) {
					case 0:
						this.curTimeData = this.allStockData.filter(item => {
							let [Y, M] = item.date[0].split('-')
							return Y == curY && M == curM - 1
						})
						this.tabChange(this.TabCur)
						break;
					case 1:
						this.curTimeData = this.curProductData
						this.tabChange(this.TabCur)
						break;
					case 2:
						let [LL, L, C] = this.timeTotal
						this.curTimeData = this.allStockData.filter(item => {
							let [Y, M] = item.date[0].split('-')
							return LL <= M
						})
						this.tabChange(this.TabCur)
						break;
					case 3:
						this.isDateShow = true
						break;
					default:
						break;
				}
			},
			tabChange(index) {
				this.TabCur = index;
				switch (index) {
					case 0:
						if (this.TimeTabCur !== 3) {
							this.curShowData = this.curTimeData
						} else {
							this.curShowData = this.curOwnTimeData
						}
						break;
					case 1:
						if (this.TimeTabCur !== 3) {
							this.curShowData = this.curTimeData.filter(item => {
								return item.status === 1
							})
						} else {
							this.curShowData = this.curOwnTimeData.filter(item => {
								return item.status === 1
							})
						}
						break;
					case 2:
						if (this.TimeTabCur !== 3) {
							this.curShowData = this.curTimeData.filter(item => {
								return item.status === 2 && item.payModel !== 4
							})
						} else {
							this.curShowData = this.curOwnTimeData.filter(item => {
								return item.status === 2 && item.payModel !== 4
							})
						}
						break;
					case 3:
						if (this.TimeTabCur !== 3) {
							this.curShowData = this.curTimeData.filter(item => {
								return item.status === 2 && item.payModel === 4
							})
						} else {
							this.curShowData = this.curOwnTimeData.filter(item => {
								return item.status === 2 && item.payModel === 4
							})
						}
						break;
					default:
						break;
				}
			},
			// -----------时间选择器事件-------------
			showDatechange() {
				this.isDateShow = !this.isDateShow;
			},
			bindChange(data) {
				let [a, b] = data
				this.curOwnTimeData = this.allStockData.filter(item => {
					return new Date(a) < new Date(item.date[0]) && new Date(item.date[0]) < new Date(b)
				})
				this.tabChange(this.TabCur)
			},
			bindCancel(e) {
				console.log(e)
			},
			// picker列表弹窗
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			// 确定时触发
			onConfirm(e) {
				this.pickerIndex = e.index[0]
				this.selectWay = e.label
			},
			// 取消时触发
			onCancel(e) {
				this.pickerIndex = e.index[0]
				this.selectWay = e.label
			},
			// 获取库存管理的数据
			getStock() {
				this.stockData = []
				this.allStockData = []
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetStock", {
						data: {
							DealerID: this.dealerMsg.dealerID
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						console.log(res);
						let oData = res.data.value
						if (oData.dealerProducts.length !== 0) {
							for (let item of oData.dealerProducts) {
								for (let i of item.buyProductRecords) {
									i.buyPrice = item.buyPrice
									i.orderTime = i.orderTime.split('T')
									i.paymentDate = i.paymentDate.split('T')
								}
								for (let j of item.orgSales) {
									j.buyPrice = item.buyPrice
									j.date = j.date.split('T')
								}
								this.stockData.unshift(item)
							}
							let oneData = this.stockData[0]
							this.pubDealData(oneData)
						}
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 调用购买产品的接口
			payRequest(data) {
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
							uni.showToast({
								icon: 'success',
								title: res.data.value
							})
							this.getStock()
							uni.removeStorageSync('HBuyshopData')
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
			}
		},
	}
</script>

<style lang="scss" scoped>
	.shop_info {
		padding: 46upx 26upx;

		.head_img_box {
			height: 120upx;
			width: 120upx;
			border-radius: 50%;
			overflow: hidden;

			image {
				height: 100%;
				width: 100%;
			}
		}

		.head_info_box {
			flex: 1;
			height: 120upx;
			margin-left: 40upx;

			.info_name {
				font-weight: bold;
				font-size: $uni-font-size-lg;

			}

			.info_price {
				color: red;
				font-size: $uni-font-size-sm;
			}

			.info_box {
				color: #999;
				font-size: $uni-font-size-base;

				.info_num {
					color: red;
					margin: 0 6upx;
					font-weight: bold;
					font-size: $uni-font-size-lg;
				}
			}
		}
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

	.tag_title_box {
		padding: 20upx 0;
		font-weight: bold;
		font-size: $uni-font-size-base;
	}

	.tab_box {
		.select_ways {
			font-size: $uni-font-size-base;
		}

		.wuc_tab {
			flex: 1;
			font-size: $uni-font-size-base;
		}
	}

	.m-scroll {
		height: calc(100vh - 460upx);
	}

	.bottom_box {
		position: fixed;
		width: 100%;
		bottom: 0;
		height: 80upx;
		background: #fff;
		box-shadow: 2px 2px 6px #ccc;
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 28upx;
	}

	.post {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		position: fixed;
		top: 0upx;
		z-index: 10000;
		text-align: center;

		// 		.wrapper {
		// 			height: 686upx;
		// 			width: 610upx;
		// 			margin: 0 auto;
		// 			margin-top: -150upx;
		// 
		// 			// margin-top: 50upx;
		// 		}
	}

	.cha {
		background-image: url('../../static/img/chacha.png');
		background-size: 80upx 80upx;
		position: relative;
		top: 40upx
	}
</style>
