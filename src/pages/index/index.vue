<template>
	<view class="content">
		<view class="m-align-justify-c swiper_box">
			<!-- <text>图片显示区域</text> -->
			<swiper class="m-swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item, key) in bannerImg" :key="key">
					<view class="swiper-item">
						<image :src="item" mode="scaleToFill"></image>
					</view>
				</swiper-item>
				<!-- 	<swiper-item>
					<view class="swiper-item">
						<image src="http://www.jete.cn/uploads/allimg/190714/28-1ZG40P4440-L.png" mode="aspectFit"></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<image src="http://www.jete.cn/uploads/180719/28-1PG9103200M5.jpg" mode="aspectFit"></image>
					</view>
				</swiper-item> -->
			</swiper>
		</view>
		<view class="m-container">
			<view class="tag_title" v-if="isReg">尊敬的<text class="m-color-red">{{dealerMsg.dealerLevelName}}官方指定代理商</text>，你属{{dealerMsg.dealerLevelName}}代理商</view>
			<view class="tag_title" v-else>你还不是杰特科技销售管理系统的用户，<text class="m-color-goto" @click="toRegister">立即注册</text></view>
			<uni-grid :options="[
			{image:'../../static/homeIcon/jhgl.png',text:'进货'},
			{image:'../../static/homeIcon/xsgl.png',text:'销售'},
			{image:'../../static/homeIcon/kcgl.png',text:'库存管理'},
			{image:'../../static/homeIcon/sj.png',text:'店铺数据'},
			{image:'../../static/homeIcon/tjfx.png',text:'统计分析'},
			{image:'../../static/homeIcon/my.png',text:'我的'}]"
			 :show-out-border="false" :show-border="true" @click="toOtherPage">
			</uni-grid>
		</view>
		<!-- 竖向滚动 -->
		<!-- <view class="uni-swiper-msg">
			<view class="uni-swiper-msg-icon">
				<image src="../../static/img/jete_ewm.png" mode="widthFix"></image>
			</view>
			<swiper vertical="true" autoplay="true" circular="true" interval="2000" class="m_swiper">
				<swiper-item v-for="(item, index) in msg" :key="index">
					<text class="notice_font">{{item}}</text>
				</swiper-item>
			</swiper>
		</view> -->
		<!--  -->
	</view>
</template>

<script>
	import {
		uniGrid
	} from '@dcloudio/uni-ui';
	export default {
		components: {
			uniGrid,
		},
		data() {
			return {
				// 用户的openID
				openID: '',
				// 经销商信息
				dealerMsg: {},
				// banner img
				bannerImg: [
					'../../static/banner/c1.png',
					'../../static/banner/a2.jpg',
					'../../static/banner/a3.jpg'
				],
				msg: [
					'1888****188卖出1套5A连锁版',
					'1386****878卖出6套连锁版',
					'1598****166卖出10套旗舰版'
				],
				isReg: false,
				background: ['color1', 'color2', 'color3'],
				indicatorDots: false,
				autoplay: true,
				interval: 3000,
				duration: 500
			}
		},
		onLoad(option) {
			// console.log(option);
			if (Object.keys(option).length === 0) {
				this.openID = ''
			} else {
				this.openID = option.openID
				this.$store.commit('setDealerOpenId', this.openID)
				uni.setStorageSync('HopenID', this.openID)
			}
		},
		onShow() {
			let opID = uni.getStorageSync('HopenID')
			if (opID === '') {
				this.$Toast.Model('未找到微信openID')
			} else {
				this.getUserInfo()
			}
		},
		methods: {
			// ...mapMutations(['setDealerOpenId']),
			toOtherPage(sub) {
				switch (sub.index) {
					case 0:
						uni.navigateTo({
							url: '../stockGood/stockGood'
						});
						break;
					case 1:
						uni.navigateTo({
							url: '../sale/sale'
						});
						break;
					case 2:
						uni.navigateTo({
							url: '../inventory/inventory'
						});
						break;
					case 3:
						uni.navigateTo({
							url: '../shopData/shopData'
						});
						break;
					case 4:
						uni.navigateTo({
							url: '../plan/plan'
						});
						break;
					case 5:
						uni.navigateTo({
							url: '../my/my'
						});
						break;
					default:
						break;
				}
			},
			// 跳转到注册页
			toRegister() {
				uni.navigateTo({
					url: '../myRegister/myRegister'
				});
			},
			// 获取用户信息
			getUserInfo() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetDealerInfo", {
						data: {
							WXOpenID: uni.getStorageSync('HopenID')
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						let status = res.data.statusCode
						if (status === 1) {
							let oData = res.data.value
							if (oData !== null) {
								let mData = oData[0]
								mData.d.dealerID = mData.dealerID
								mData.d.dealerLevelID = mData.dealerLevelID
								mData.d.dealerLevelName = mData.dealerLevelName
								mData.d.systemAccountID = mData.systemAccountID
								mData.d.systemAccountName = mData.systemAccountName
								mData.d.noCheckOutForMonthBeginDate = mData.d.noCheckOutForMonthBeginDate.split('T')
								mData.d.noCheckOutForMonthEndDate = mData.d.noCheckOutForMonthEndDate.split('T')
								// --------------------------------
								this.isReg = true
								this.dealerMsg = mData.d
								this.$store.commit('setDealerMsg', this.dealerMsg)
								uni.setStorageSync('HdealerMsg', this.dealerMsg)
							} else {
								uni.showModal({
									title: '提示',
									content: '你还不是杰特科技销售管理系统用户，是否立即成为系统用户？',
									confirmText: '立即注册',
									success: function(res) {
										if (res.confirm) {
											uni.navigateTo({
												url: '../myRegister/myRegister'
											});
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									}
								});
							}
						} else if (status === 2) {
							uni.showModal({
								title: '提示',
								content: res.data.value,
								confirmText: '我知道了',
								showCancel: false,
								success: function(res) {}
							});
						} else {}
						console.log(res);
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-swiper-msg {
		width: 100%;
		padding: 12upx 10upx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: nowrap;
		position: absolute;
		top: 163upx;
		z-index: 10;

		.uni-swiper-msg-icon {
			width: 50upx;
			height: 50upx;
			margin-right: 20upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.m_swiper {
			width: 100%;
			height: 50upx;

			.notice_font {
				color: #000;
				font-size: $uni-font-size-base;
			}
		}
	}



	.content {
		position: relative;
	}

	.swiper_box {
		height: 200px;
		background: #f2f2f2;

		.m-swiper {
			height: 100%;
			width: 100%;

			.swiper-item {
				height: 100%;
				width: 100%;

				image {
					height: 100%;
					width: 100%;
				}
			}
		}
	}

	.tag_title {
		font-size: $uni-font-size-base;
		padding: 20upx 0;
	}
</style>
