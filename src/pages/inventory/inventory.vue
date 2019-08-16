<template>
	<view class="content">
		<view class="m-container">
			<template v-if="stockData.length!==0">
				<mySwiper :listData="stockData" @changeIndex="getSwiperKey"></mySwiper>
			</template>
			<view class="tag_title_box">
				<!-- <uni-tag text="出入库明细" type="default" :inverted="true" :circle="true"></uni-tag> -->
				出入库明细
			</view>
			<view class="m-flex-align tab_box">
				<view class="m-align-justify-c select_ways" @click="showPicker">
					<text>{{selectWay===""?"按类型":selectWay}}</text>
					<!-- <uni-icon type="arrowdown" size="20"></uni-icon> -->
					<text class="m-icon">&#xe601;</text>
				</view>
				<wuc-tab :tab-list="tabList[pickerIndex]" :tabCur.sync="TabCur" textFlex @change="tabChange" class="wuc_tab"></wuc-tab>
			</view>
		</view>
		<scroll-view scroll-y="true" class="m-scroll">
			<!-- 按类型查找 -->
			<template v-if="pickerIndex === 0">
				<template v-if="TabCur === 0">
					<!-- 销售的数据 -->
					<inventory-msg v-for="(item,key) in saleData" :key="key" :info="item" @sendId="getId"></inventory-msg>
					<!-- 购买信息数据 -->
					<!-- 进货的数据 -->
					<inventory-msg v-for="(item,key) in intoGoodsData" :key="'buy_'+key" :type="1" :info="item"></inventory-msg>
					<!-- 赠送的数据 -->
					<inventory-msg v-for="(item,key) in giveData" :key="'give_'+key" :type="1" :info="item"></inventory-msg>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else-if="TabCur === 1">
					<inventory-msg v-for="(item,key) in saleData" :key="key" :info="item" @sendId="getId"></inventory-msg>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else-if="TabCur === 2">
					<inventory-msg v-for="(item,key) in intoGoodsData" :key="'buy_'+key" :type="1" :info="item"></inventory-msg>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else>
					<!-- 赠送的数据 -->
					<inventory-msg v-for="(item,key) in giveData" :key="'give_'+key" :type="1" :info="item"></inventory-msg>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
			</template>
			<!-- 按时间查找 -->
			<template v-else>
				<view class="no_more_data">功能完善中...0.0~</view>
			</template>
		</scroll-view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" themeColor="#4C83D6" :deepLength="3" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		 <!-- 二维码弹出层 -->
		<view class="post" v-show="tishi">
			<view class="content" style="text-align: center;width: 580upx;margin: 0 auto;">
				<view style="padding-top: 20upx;margin-top: 30upx;">
					<view @click="guanbi">
						<img id="test" style="width: 100%;height: 100%;"/>
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
	</view>
</template>

<script>
	import mySwiper from '@/components/jing-swiper/jing-swiper.vue';
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import inventoryMsg from '@/components/inventoryMsg.vue';
	import mpvuePicker from 'mpvue-picker';
	import canvas_x from '../../common/ewm/canvas_x.js';
	export default {
		components: {
			WucTab,
			mpvuePicker,
			mySwiper,
			inventoryMsg
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
				// 当前选择产品的数据
				curProductData: [],
				// tab当前选择
				TabCur: 0,
				// 库存管理的所有数据
				stockData: [],
				// tab分类：销售数据集合
				saleData: [],
				// tab分类：赠送数据集合
				giveData: [],
				// tab分类：进货数据集合
				intoGoodsData: [],
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
			this.getStock()
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
					parts: [
						{
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
						// {
						// 	type: 'text',
						// 	text: '玫瑰',
						// 	textAlign: 'left',
						// 	lineAlign: 'TOP',
						// 	x: 440,
						// 	y: 1115,
						// 	color: 'black',
						// 	size: '30px',
						// 	// bold: true
						// },
					],
					width: 680,
					height: 680
				}, (err, data) => {
					document.getElementById('test').src = data
				})
			},
			// 获取 mySwiper 切换下标
			getSwiperKey(key) {
				console.log(this.stockData[key]);
				// this.mySwiperKey = key
				this.TabCur = 0
				this.curProductData = []
				this.giveData = []
				this.intoGoodsData = []
				this.curProductData = this.stockData[key]
				this.saleData = this.curProductData.orgSales
				for (let item of this.curProductData.buyProductRecords) {
					// 支付方式1现金2微信3支付宝4赠送5月结
					if (item.payModel === 4) {
						this.giveData.push(item)
					} else {
						this.intoGoodsData.push(item)
					}
				}
			},
			tabChange(index) {
				this.TabCur = index;
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
				// let oDealerID;
				// if (this.dealerId !== '') {
				// 	oDealerID = this.dealerId
				// } else {
				// 	oDealerID = this.dealerMsg.dealerID
				// }
				// if (oDealerID === null || oDealerID === undefined || oDealerID === '') {
				// 	return;
				// }
				this.stockData = []
				this.curProductData = []
				this.saleData = []
				this.giveData = []
				this.intoGoodsData = []
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
							console.log(this.stockData);
							// this.stockData = oData.dealerProducts
							this.curProductData = this.stockData[0]
							this.saleData = this.curProductData.orgSales
							for (let item of this.curProductData.buyProductRecords) {
								// 支付方式1现金2微信3支付宝4赠送5月结
								if (item.payModel === 4) {
									this.giveData.push(item)
								} else {
									this.intoGoodsData.push(item)
								}
							}
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
		height: calc(100vh - 490upx);
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
