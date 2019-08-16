<template>
	<view class="">
		<template v-if="oType === 0">
			<view :class="['m-shadow_box detail_box',{no_pay:infoDetail.patState===2}]">
				<view class="m-flex-align detail_cont">
					<view class="cont_box">
						<view class="title">日期：<text class="cont">{{infoDetail.date[0]}}</text></view>
						<view class="title">单价：<text class="cont">{{infoDetail.buyPrice}}</text></view>
					</view>
					<view class="cont_box">
						<view class="title">类型：<text class="cont">销售</text></view>
						<view class="title">数量：<text class="cont">x{{infoDetail.count}}</text></view>
					</view>
				</view>
				<view class="foot_cont m-flex-space-b">
					<text class="foot_toewm" v-if="infoDetail.patState === 2" @click="toEWM">去支付</text>
					<view class="foot_total">
						共1套，合计：¥<text class="price">{{infoDetail.price}}</text>
					</view>
				</view>
			</view>
		</template>
		<template v-else-if="oType === 1">
			<view :class="['m-shadow_box detail_box']">
				<view class="m-flex-align detail_cont">
					<view class="cont_box">
						<view class="title">日期：<text class="cont">{{infoDetail.orderTime[0]}}</text></view>
						<view class="title">单价：<text class="cont">{{infoDetail.buyPrice}}</text></view>
					</view>
					<view class="cont_box">
						<view class="title">类型：<text class="cont">进货</text></view>
						<view class="title">数量：<text class="cont">x{{infoDetail.count}}</text></view>
					</view>
				</view>
				<view class="foot_cont">
					共1套，合计：¥<text class="price">{{infoDetail.totalMoney}}</text>
				</view>
			</view>
		</template>
	</view>

</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: function() {
					return {}
				}
			},
			// 0销售数据 1是购买信息数据
			type: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				oType: this.type
			};
		},
		computed: {
			infoDetail() {
				return this.info
			}
		},
		methods: {
			toEWM() {
				this.$emit('sendId', this.infoDetail.id)
				// uni.navigateTo({
				// 	url: '../shareEWM/shareEWM?oId=' + this.infoDetail.id
				// });
			}
		},
		watch: {
			type: {
				handler(n, o) {
					this.oType = n
				},
				immediate: true
			}
		}

	}
</script>

<style lang="scss" scoped>
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

			.foot_toewm {
				border: 1px solid #00b80c;
				color: #00b80c;
				padding: 4upx 10upx;
				border-radius: 4upx;
			}

			.price {
				font-size: $uni-font-size-lg;
				font-weight: bold;
				color: red;
				margin: 0 6upx;
			}
		}
	}
</style>
