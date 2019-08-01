<template>
	<view :class="['m-shadow_box detail_box']">
		<view class="m-flex-align detail_cont">
			<view class="cont_box">
				<view class="title">日期：<text class="cont">2019-05-29</text></view>
				<view class="title">单价：<text class="cont">1899.00</text></view>
			</view>
			<view class="cont_box">
				<view class="title">类型：<text class="cont">销售</text></view>
				<view class="title">数量：<text class="cont">x1</text></view>
			</view>
		</view>
		<view class="foot_cont">
			共1套，合计：¥<text class="price">1899</text>.00
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {

			};
		},
		computed: {
			infoData() {
				let msg = this.info
				let oData = {}
				
				return oData
			}
		},
		created() {
			console.log("》》》》》》》》》", this.infoData);
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

			.price {
				font-size: $uni-font-size-lg;
				font-weight: bold;
				color: red;
				margin: 0 6upx;
			}
		}
	}
</style>
