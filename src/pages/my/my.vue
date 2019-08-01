<template>
	<view class="content">
		<view class="head_box">
			<view class="img_box">
				<image :src="userInfo.HeadImgurl" mode=""></image>
			</view>
			<!-- <view class="head_title">旺点5A官方指定代理商</view> -->
			<view class="head_title">{{userInfo.NickName}}({{dealerMsg.dealerName}})</view>
		</view>
		<view class="m-container">
			<view class="m-shadow_box sale_box">
				<view class="title">我的销售情况</view>
				<view class="m-flex-align sale_total_box">
					<view class="info_box">
						<view class="num">{{saleData.count}}</view>
						<view class="name">销售总量</view>
					</view>
					<view class="info_box">
						<view class="num">{{saleData.money}}</view>
						<view class="name">销售总额</view>
					</view>
				</view>
				<!-- <view class="m-flex-space-b bottom_foot">
					<view class="bt_title">
						你还有<text>{{saleData.month}}</text>套产品未支付
					</view>
					<view class="m-color-goto" @click="toSettlement">月结</view>
				</view> -->
			</view>
			<view class="list_box">
				<uni-list>
					<uni-list-item title="月末结账" @click="toSettlement"></uni-list-item>
					<uni-list-item title="销售记录" @click="toSaleRecord"></uni-list-item>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniList,
		uniListItem
	} from "@dcloudio/uni-ui";
	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				// 经销商信息
				dealerMsg: uni.getStorageSync('HdealerMsg'),
				dealerWXOpenID: uni.getStorageSync('HopenID'),
				userInfo: {},
				saleData: {}
			};
		},
		onLoad(option) {
			if (option.orderID) {
				this.monthPay(option.orderID)
			}
		},
		onShow() {
			this.getWechatInfo()
			this.getDealerInfo()
		},
		methods: {
			// 跳转到销售记录页面
			toSaleRecord() {
				uni.navigateTo({
					url: '../saleRecord/saleRecord'
				});
			},
			// 跳转到结算页面
			toSettlement() {
				uni.navigateTo({
					url: '../settlement/settlement'
				});
			},
			// 微信用户信息
			getWechatInfo() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetWeChatInfo", {
						data: {
							openID: this.dealerWXOpenID
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						let oData = JSON.parse(res.data.value).data
						this.userInfo = oData
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
			// 经销商信息
			getDealerInfo() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetSaleInfo", {
						data: {
							DealerID: this.dealerMsg.dealerID
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						this.saleData = res.data.value
						console.log(res);
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
					});
			},
			// 月结支付
			monthPay(billId) {
				let idData = uni.getStorageSync('monthPayData').join(',')
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/MonthPay", {
						data: {
							ID: idData,
							PayBillID: billId
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					})
					.then(res => {
						uni.hideLoading();
						// alert(JSON.stringify(res))
						uni.showToast({
							icon: 'success',
							title: res.data.value
						});
						uni.removeStorageSync('monthPayData')
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.head_box {
		padding-top: 60upx;
		padding-bottom: 40upx;
		border-bottom: 1px solid #e4e4e4;

		.img_box {
			height: 120upx;
			width: 120upx;
			border-radius: 50%;
			margin: 0 auto;
			overflow: hidden;

			image {
				height: 100%;
				width: 100%;
			}
		}

		.head_title {
			text-align: center;
			font-size: $uni-font-size-lg;
			font-weight: bold;
			margin-top: 20upx;
		}

	}

	.sale_box {
		.title {
			padding: 30upx;
			box-sizing: border-box;
			font-size: $uni-font-size-base;
			font-weight: bold;
		}
		.sale_total_box {
			padding-bottom: 30upx;
		}

		.info_box {
			flex: 1;
			text-align: center;

			.num {
				color: #666;
				font-size: 48upx;
			}

			.name {
				color: #999;
				font-size: $uni-font-size-base;
			}
		}

		.bottom_foot {
			border-top: 1px solid #e4e4e4;
			padding: 20upx;
			box-sizing: border-box;
			font-size: $uni-font-size-base;
			margin-top: 20upx;

			.bt_title {
				color: #999;
			}
		}
	}

	.list_box {
		margin-top: 60upx;
	}
</style>
