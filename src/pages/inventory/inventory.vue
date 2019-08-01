<template>
	<view class="content">
		<view class="m-container">
			<template v-if="stockData.length!==0">
				<mySwiper :listData="stockData" @changeIndex="getSwiperKey"></mySwiper>
			</template>
			<!-- <view class="m-shadow_box m-flex-align shop_info">
				<view class="head_img_box">
					<image src="../../static/img/jete_ewm.png" mode=""></image>
				</view>
				<view class="m-dir-justify head_info_box">
					<view><text class="info_name">5A单店版</text><text class="info_price">（￥1688.00）</text></view>
					<view class="info_box">
						剩余 <text class="info_num">12</text> 套 &nbsp;&nbsp;&nbsp;&nbsp;
						已销售 <text class="info_num">12</text> 套
					</view>
				</view>
				<uni-icon type="arrowright" size="30"></uni-icon>
			</view> -->
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
					<view :class="['m-shadow_box detail_box']" v-for="(item,key) in saleData" :key="key">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">日期：<text class="cont">{{item.date[0]}}</text></view>
								<view class="title">单价：<text class="cont">{{item.buyPrice}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">类型：<text class="cont">销售</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.price}}</text>
						</view>
					</view>
					<!-- 购买信息数据 -->
					<!-- 进货的数据 -->
					<view :class="['m-shadow_box detail_box']" v-for="(item,key) in intoGoodsData" :key="'intoGoodsData'+key">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">日期：<text class="cont">{{item.orderTime[0]}}</text></view>
								<view class="title">单价：<text class="cont">{{item.buyPrice}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">类型：<text class="cont">进货</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.totalMoney}}</text>
						</view>
					</view>
					<!-- 赠送的数据 -->
					<view :class="['m-shadow_box detail_box']" v-for="(item,key) in giveData" :key="'giveData'+key">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">日期：<text class="cont">{{item.orderTime[0]}}</text></view>
								<view class="title">单价：<text class="cont">{{item.buyPrice}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">类型：<text class="cont">赠送</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.totalMoney}}</text>
						</view>
					</view>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else-if="TabCur === 1">
					<view :class="['m-shadow_box detail_box']" v-for="(item,key) in saleData" :key="key">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">日期：<text class="cont">{{item.date[0]}}</text></view>
								<view class="title">单价：<text class="cont">{{item.buyPrice}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">类型：<text class="cont">销售</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.price}}</text>
						</view>
					</view>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else-if="TabCur === 2">
					<view :class="['m-shadow_box detail_box']" v-for="(item,key) in intoGoodsData" :key="'intoGoodsData'+key">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">日期：<text class="cont">{{item.orderTime[0]}}</text></view>
								<view class="title">单价：<text class="cont">{{item.buyPrice}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">类型：<text class="cont">进货</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.totalMoney}}</text>
						</view>
					</view>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else>
					<!-- 赠送的数据 -->
					<view :class="['m-shadow_box detail_box']" v-for="(item,key) in giveData" :key="'giveData'+key">
						<view class="m-flex-align detail_cont">
							<view class="cont_box">
								<view class="title">日期：<text class="cont">{{item.orderTime[0]}}</text></view>
								<view class="title">单价：<text class="cont">{{item.buyPrice}}</text></view>
							</view>
							<view class="cont_box">
								<view class="title">类型：<text class="cont">赠送</text></view>
								<view class="title">数量：<text class="cont">x{{item.count}}</text></view>
							</view>
						</view>
						<view class="foot_cont">
							共1套，合计：¥<text class="price">{{item.totalMoney}}</text>
						</view>
					</view>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
			</template>
			<!-- 按时间查找 -->
			<template v-else>
				<view class="no_more_data">功能完善中...0.0~</view>
			</template>
		</scroll-view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" themeColor="#4C83D6" :deepLength="3" :pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm"
		 @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import mySwiper from '@/components/jing-swiper/jing-swiper.vue';
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import mpvuePicker from 'mpvue-picker';
	export default {
		components: {
			WucTab,
			mpvuePicker,
			mySwiper
		},
		data() {
			return {
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
</style>
