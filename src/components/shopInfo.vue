<template>
	<view :class="['m-shadow_box shop_info_box',{jinyong: shopData.orgState === 2},{shiyong: shopData.orgState === 3}]">
		<view class="shop_info_title">
			<text class="shop_name">{{shopData.orgName?shopData.orgName:'暂未填写店铺信息'}}</text>
			<text>{{shopData.orgContacts}}</text>
			<text class="phone">{{shopData.orgPhone}}</text>
		</view>
		<view class="m-flex-align shop_info_body">
			<view class="head_img_box">
				<image :src="shopData.productImg?$pubUrl+'images/'+shopData.productImg:'../../static/img/no_img.png'" mode=""></image>
			</view>
			<view class="info_body">
				<view class="">{{shopData.productName}}</view>
				<view class="title">
					注册号：<text class="cont">{{shopData.reg}}</text>
				</view>
				<view class="title">
					用户名：<text class="cont">{{shopData.orgLoginName}}</text>
				</view>
			</view>
		</view>
		<view class="m-flex-space-b foot_box">
			<view class="date_box" v-if="origin === 0">
				授权到期时间：<text class="date">{{orgEndDate}}</text>
			</view>
			<view class="date_box" v-if="origin === 1">
				销售时间：<text class="date">{{shopData.orderDate[0]}}</text>
			</view>
			<view class="tag_box">
				<uni-tag text="详情" class="tag" type="primary" :inverted="true" :circle="true" size="small" @click="toDetail"></uni-tag>
				<uni-tag text="延期" class="tag" type="primary" :inverted="true" :circle="true" size="small"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniTag
	} from "@dcloudio/uni-ui";
	export default {
		props: {
			info: {
				type: Object,
				default: function() {
					return {}
				}
			},
			// 0是店铺数据 1是销售记录
			origin: {
				type: Number,
				default: 0
			}
		},
		components: {
			uniTag
		},
		created() {
			console.log(this.shopData);
		},
		data() {
			return {
				// shopData: {}
				fromType: this.origin
			};
		},
		computed: {
			shopData() {
				return this.info
			},
			shopType() {
				return this.origin
			},
			orgEndDate() {
				let oData = ''
				if (this.shopData.orgEndDate[0]) {
					oData = this.shopData.orgEndDate[0] == '0001-01-01' ? '' : this.shopData.orgEndDate[0]
				}
				return oData
			}
		},
		methods: {
			toDetail() {
				let info = JSON.stringify(this.shopData)
				uni.navigateTo({
					url: '/pages/dataDetail/dataDetail?info=' + info + '&type=' + this.fromType
				});
			}
		},
		watch: {
			origin: {
				handler(n, o) {
					this.fromType = n
				},
				immediate: true
			}
			// shopData(val, oldval) {
			// 	console.log(val, oldval);
			// 	this.shopData = val;
			// 	console.log(this.shopData)
			// },
			// shopData: {
			// 	handler: function(val, oldVal) {
			// 		this.shopData = val
			// 		console.log(val, oldVal);
			// 	},
			// 	deep: true
			// },
		}
	}
</script>

<style lang="scss" scoped>
	.shop_info_box {
		padding: 30upx;
		margin-top: 30upx;
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
