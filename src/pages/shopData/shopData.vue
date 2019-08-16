<template>
	<view class="content">
		<view class="m-container">
			<view class="m-search-box m-flex-align" @click="toSearch">
				<view class="serach_img_box">
					<text class="m-icon">&#xe620;</text>
				</view>
				<view class="serach_input_box">
					<text>店铺名称 注册号 手机号码 用户名</text>
				</view>
			</view>
			<wuc-tab :tab-list="tabList" textFlex :tabCur.sync="TabCur" @change="tabChange" class="wuc_tab"></wuc-tab>
		</view>
		<scroll-view scroll-y="true" class="m-scroll">
			<template v-if="TabCur === 0">
				<shopInfo v-for="(item, key) in normalData" :key="key" :info="item"></shopInfo>
				<shopInfo v-for="(item, key) in overdueData" :key="key" :info="item"></shopInfo>
				<view class="no_more_data">没有更多数据了~</view>
			</template>
			<template v-else-if="TabCur === 1">
				<shopInfo v-for="(item, key) in normalData" :key="key" :info="item"></shopInfo>
				<view class="no_more_data">没有更多数据了~</view>
			</template>
			<template v-else>
				<shopInfo v-for="(item, key) in overdueData" :key="key" :info="item"></shopInfo>
				<view class="no_more_data">没有更多数据了~</view>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	import {
		uniTag
	} from "@dcloudio/uni-ui";
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import shopInfo from '@/components/shopInfo.vue';
	export default {
		components: {
			WucTab,
			uniTag,
			shopInfo
		},
		data() {
			return {
				// 经销商信息
				dealerMsg: uni.getStorageSync('HdealerMsg'),
				TabCur: 0,
				tabList: [{
					name: '全部'
				}, {
					name: '正常'
				}, {
					name: '禁用'
				}],
				// 跳转到搜索的数据
				toSearchData: [],
				// 正常数据的数组
				normalData: [],
				// 禁用（过期）数据的数组
				overdueData: []
			};
		},
		onShow() {
			this.getShopData()
		},
		methods: {
			// 跳转到搜索页面
			toSearch() {
				uni.navigateTo({
					url: `../search/search?searchData=${JSON.stringify(this.toSearchData)}&type=0`
				});
			},
			tabChange(index) {
				this.TabCur = index;
			},
			// 获取店铺数据
			getShopData() {
				uni.showLoading({
					title: '加载中'
				});
				this.normalData = []
				this.overdueData = []
				this.$request
					.post("WeChatSubscription/Distributor/GetOrg", {
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
						let arr = []
						for (let item of oData) {
							item.org.productName = item.productName
							item.org.productImg = item.productImg
							item.org.orgEndDate = item.org.orgEndDate.split('T')
							arr.push(item.org)
							// orgState ----- 1=正常 2=过期 3=试用
							if (item.org.orgState === 1) {
								this.normalData.unshift(item.org)
							} else if (item.org.orgState === 2) {
								this.overdueData.unshift(item.org)
							}
						}
						this.toSearchData = arr
						uni.hideLoading();
					})
					.catch(error => {
						this.$Toast.Model()
						console.error('error:', error);
					});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.wuc_tab {
		flex: 1;
		font-size: $uni-font-size-base;
	}

	.shop_info_box {
		padding: 30upx;
		margin: 20upx;
		box-sizing: border-box;

		.shop_info_title {
			font-size: $uni-font-size-base;

			.shop_name {
				font-weight: bold;
				margin-right: 20upx;
			}

			.phone {
				margin-left: 20upx;
			}
		}

		.shop_info_body {
			margin: 20upx 0;

			.head_img_box {
				height: 120upx;
				width: 120upx;
				// border-radius: 50%;
				overflow: hidden;

				image {
					height: 100%;
					width: 100%;
				}
			}

			.info_body {
				flex: 1;
				margin-left: 40upx;
				font-size: $uni-font-size-base;

				.title {
					color: #666;

					.cont {
						color: #000;
					}
				}

				view {
					padding: 4upx 0;
				}
			}

		}

		.foot_box {
			font-size: $uni-font-size-base;

			.date_box {
				color: #999;

				.date {
					color: red;
				}
			}

			.tag_box {
				.tag {
					margin: 0 10upx;
				}
			}
		}
	}

	.m-scroll {
		height: calc(100vh - 230upx);
	}
</style>
