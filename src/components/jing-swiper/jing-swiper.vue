<template>
	<view class="content">
		<!-- 3D轮播 -->
		<view class="swiper_wrap">
			<swiper class="imageContainer" @change="handleChange" previous-margin="50rpx" :current='current' next-margin="50rpx"
			 :autoplay="false">
				<block v-for="(item, key) in infoList" :key="key">
					<swiper-item class="swiperitem">
						<!-- <image class="itemImg" :class="currentIndex == key ? 'swiperactive': ''" :src="item" lazy-load mode="scaleToFill"></image> -->
						<div class="itemImg m-flex-align shop_info">
							<!-- <view class="head_img_box">
								<template v-if="item.img===''">
									<image src="../../static/img/no_img.png" mode=""></image>
								</template>
								<template v-else>
									<image :src="$pubUrl+'images/'+item.img" mode=""></image>
								</template>
							</view> -->
							<view class="m-dir-justify head_info_box">
								<view><text class="info_name">{{item.productName}}</text><!-- <text class="info_price">（￥{{item.salePrice}}）</text> -->
								</view>
								<view class="info_box">
									剩余 <text class="info_num">{{item.surplusCount}}</text>
									<!-- 套 &nbsp;&nbsp;&nbsp;&nbsp;
									已销售 <text class="info_num">{{item.saleCount}}</text> 套 -->
								</view>
							</view>
							<!-- <uni-icon type="arrowright" size="30"></uni-icon> -->
						</div>
					</swiper-item>
				</block>
			</swiper>
			<view class="icon_box" v-show="showIcon">
				<image src="../../static/img/left.png" mode="" @click="prev"></image>
				<image src="../../static/img/right.png" mode="" @click="next"></image>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		uniIcon,
		uniTag
	} from "@dcloudio/uni-ui";
	export default {
		props: {
			listData: {
				type: Array,
				default: function() {
					return [];
				}
			},
		},
		components: {
			uniIcon
		},
		data() {
			return {
				currentIndex: 0,
				current: 0,
				showIcon: false
			}
		},
		computed: {
			infoList() {
				return this.listData
			}
		},
		created() {
			console.log("组件的数据", this.infoList);
			uni.getSystemInfo({
				success: (res) => {
					if (res.model == undefined) {
						this.showIcon = true
					} else {
						this.showIcon = false
					}
				}
			});
		},
		methods: {
			handleChange(e) {
				this.currentIndex = e.detail.current
				this.$emit('changeIndex', e.detail.current)
				// console.log(e.detail.current)
			},
			prev() {
				this.current = this.current < 0 ? 0 : this.current - 1
			},
			next() {
				this.current = this.current >= (this.infoList.length - 1) ? (this.infoList.length - 1) : this.current + 1
			}
		}
	}
</script>
<style lang="scss">
	$swiper-height:160upx;

	.swiper_wrap {
		position: relative;

		.icon_box {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: 99;
			display: flex;
			align-items: center;
			justify-content: space-between;

			image {
				height: 80upx;
				width: 80upx;
			}
		}
	}

	.shop_info {
		// padding: 46upx 26upx;
		// margin: 20upx;
		padding: 20upx;
		box-sizing: border-box;

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
			margin-left: 20upx;

			.info_name {
				font-weight: bold;
				font-size: $uni-font-size-lg;
			}

			.info_price {
				color: red;
				font-size: $uni-font-size-sm;
			}

			.info_box {
				color: #fff;
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

	// 3D轮播样式
	.imageContainer {
		width: 100%;
		/* height: 500rpx; */
		/* background: #000; */
		height: $swiper-height;
		background-color: #fff;
	}

	.swiperitem {
		/* height: 500rpx; */
		height: 131upx;
		padding: 0upx 20upx;
		box-sizing: border-box;
		position: relative;

		.swiperText {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: absolute;
			top: 56upx;
			left: 51upx;
			z-index: 998;
			width: 162upx;
			height: 163upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 8upx;
			padding: 10upx;

			.name {
				font-size: 26upx;
				font-weight: 500;
				color: rgba(253, 57, 91, 1);
				line-height: 37upx;
				margin-bottom: 10upx;
			}

			.zq,
			.cz {
				font-size: 20upx;
				color: rgba(253, 57, 91, 1);
				line-height: 35upx;
			}

			.addNl {
				width: 120upx;
				height: 26upx;
				background: rgba(253, 57, 91, 1);
				border-radius: 13upx;
				font-size: 20upx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				text-align: center;
				line-height: 26upx;
				margin-top: 10upx;
			}

		}
	}

	.itemImg {
		position: absolute;
		width: 95%;
		/* height: 380rpx; */
		height: $swiper-height;
		border-radius: 15rpx;
		z-index: 5;
		background: #5795f9;
		// background: linear-gradient(to top right,#2BC0E4, #EAECC6);	
		// background:linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1));
		// background: rgba(0, 0, 0, 0.7);
		// background-color: #fff;
		// opacity: 0.5;
		// top: 5%;
		// box-shadow: 0px 4upx 15upx 0px rgba(153, 153, 153, 0.24);
	}

	// .swiperactive {
	// 	width: 95%;
	// 	opacity: 1;
	// 	z-index: 10;
	// 	/* height: 430rpx; */
	// 	height: 131upx;
	// 	top: 0%;
	// 	transition: all .2s ease-in 0s;
	// }

	.zhankai {
		text-align: center;

		.iconfont {
			margin-left: 10upx;
		}
	}
</style>
