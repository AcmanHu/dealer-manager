<template>
	<view class="content">
		<view class="m-container">
			<view class="m-search-box m-flex-align" @click="toSearch">
				<view class="serach_img_box">
					<!-- <image src="../../static/img/search.png" mode=""></image> -->
					<text class="m-icon">&#xe620;</text>
				</view>
				<view class="serach_input_box">
					<text>{{searchData}}</text>
				</view>
			</view>
		</view>

		<view class="m-container m-flex-align tab_box">
			<view class="m-align-justify-c select_ways" @click="showPicker">
				<text>{{selectWay===""?"按时间":selectWay}}</text>
				<!-- <uni-icon type="arrowdown" size="20"></uni-icon> -->
				<text class="m-icon">&#xe601;</text>
			</view>
			<wuc-tab :tab-list="tabList[pickerIndex]" :tabCur="TabCur" textFlex @change="tabChange" class="wuc_tab"></wuc-tab>
		</view>
		<scroll-view scroll-y="true" class="m-scroll">
			<template v-if="pickerIndex === 0">
				<template v-if="TabCur === 0 || TabCur === 4">
					<shopInfo v-for="(item, key) in saleData" :key="key" :info="item" :origin='1'></shopInfo>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
				<template v-else>
					<shopInfo v-for="(item, key) in saleData" :key="key" :info="item" :origin='1'></shopInfo>
					<view class="no_more_data">没有更多数据了~</view>
				</template>
			</template>
			<template v-else>
				<view>功能开发中...</view>
			</template>
		</scroll-view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" :deepLength="3" themeColor="#4C83D6" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<rangeDatePick :show="isDateShow" @showchange="showDatechange" start="2019-06-01" end="2200-12-01" :value="value"
		 @change="bindChange" @cancel="bindCancel" themeColor="#4C83D6" fields="day"></rangeDatePick>
	</view>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import rangeDatePick from '@/components/range-dtpicker/range-dtpicker.vue';
	import mpvuePicker from 'mpvue-picker';
	import shopInfo from '@/components/shopInfo.vue';
	export default {
		components: {
			WucTab,
			mpvuePicker,
			rangeDatePick,
			shopInfo
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				// 经销商信息
				dealerMsg: uni.getStorageSync('HdealerMsg'),
				// 时间选择器数据
				nowDate: currentDate, //获取当前时间
				isDateShow: false,
				value: [],
				chooseDate: "选择时间段",
				// tab切换下标
				TabCur: 0,
				// 产品选择index
				chooseList: [],
				// tab数据
				tabList: [
					[{
						name: '全部'
					}, {
						name: '本月'
					}, {
						name: '上月'
					}, {
						name: '今年'
					}, {
						name: '自定义'
					}],
					[{
						name: '已缴费'
					}, {
						name: '试用中'
					}, {
						name: '已过期'
					}]
				],
				// 搜索框显示的数据
				searchData: "店铺名称 注册号 手机号码 用户名",
				// 筛选方式
				selectWay: "",
				// 筛选选择下标
				pickerIndex: 0,
				// ---------picker数据------------
				mode: 'selector',
				pickerValueArray: [{
					label: '按时间',
					value: 1,
				}, {
					label: '按状态',
					value: 2,
				}],
				pickerValueDefault: [0],
				// 销售的数据
				saleData: [],
				// 筛选后的数据
				screenSaleData: []
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onShow() {
			this.getShopData()
			console.log(this.getCurDate());

		},
		methods: {
			// -----------时间选择器事件-------------
			showDatechange() {
				this.isDateShow = !this.isDateShow;
			},
			bindChange(data) {
				console.log(data)
				this.getShopData(data[0], data[1])
				this.searchData = data[0] + "至" + data[1]
			},
			bindCancel(e) {
				console.log(e)
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear() - 60;
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// end-----------时间选择器事件-------------
			// ------------tab选择改变事件-------------
			tabChange(index) {
				if (this.pickerIndex === 0) {
					if (this.TabCur !== index) {
						this.TabCur = index;
						switch (this.TabCur) {
							case 0:
								this.getShopData()
								break;
							case 1:
								// 本月
								let start = this.getCurDate()[0] + '-' + this.getCurDate()[1] + '-01'
								let end = this.getCurDate()[0] + '-' + this.getCurDate()[1] + '-' + this.getCurDate()[2]
								this.getShopData(start, end)
								break;
							case 2:
								// 上月
								let s = parseInt(this.getCurDate()[1]) - 1
								let m = s < 10 ? '0' + s : s
								let start1 = this.getCurDate()[0] + '-' + m + '-01'
								let end1 = this.getCurDate()[0] + '-' + m + '-' + this.getCurDate()[3]
								this.getShopData(start1, end1)
								break;
							case 3:
								// 今年
								let start2 = this.getCurDate()[0] + '-01' + '-01'
								let end2 = this.getCurDate()[0] + '-' + this.getCurDate()[1] + '-' + this.getCurDate()[2]
								this.getShopData(start2, end2)
								break;
							case 4:
								this.isDateShow = true
								break;
							default:
								break;
						}
					}
				} else {
					console.log("按类型查找");
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
			chooseProduct(key) {
				if (this.chooseList.includes(key)) {
					this.chooseList = this.chooseList.filter(function(ele) {
						return ele != key;
					});
				} else {
					this.chooseList.push(key);
				}
			},
			// 跳转到搜索页面
			toSearch() {
				uni.navigateTo({
					url: `../search/search?searchData=${JSON.stringify(this.saleData)}&type=1`
				});
			},
			// 获取店铺数据
			getShopData(startDate, endDate) {
				console.log(startDate, endDate);
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/GetSaleRecord", {
						data: {
							DealerID: this.dealerMsg.dealerID,
							BeginDate: startDate,
							EndDate: endDate
						},	
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					})
					.then(res => {
						console.log(res);
						this.saleData = []
						let oData = res.data.value
						for (let item of oData) {
							item.os.productName = item.productName
							item.os.orgEndDate = item.os.endDate.split('T')
							item.os.orderDate = item.os.orderDate.split('T')
							item.os.productImg = item.productImg
							// orgState ----- 1=正常 2=过期 3=试用
							this.saleData.unshift(item.os)
						}
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model()
						console.error('error:', error);
					});
			},
			// 获取当月时间
			getCurDate() {
				let date = new Date();
				//年
				let year = date.getFullYear();
				//月
				let month = date.getMonth() + 1;
				//日
				let day = date.getDate();
				// 上个月的天数
				let lastMonth = new Date(year, month - 1, 0).getDate()
				month = month < 10 ? '0' + month : month
				day = day < 10 ? '0' + day : day
				return [year, month, day, lastMonth]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab_box {
		.select_ways {
			font-size: $uni-font-size-base;
		}

		.wuc_tab {
			flex: 1;
			font-size: $uni-font-size-base;
			overflow: hidden;
		}
	}

	.m-scroll {
		height: calc(100vh - 270upx);
	}

	.isChoose {
		position: relative;
	}

	.isChoose:before {
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
				border-radius: 50%;
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
</style>
