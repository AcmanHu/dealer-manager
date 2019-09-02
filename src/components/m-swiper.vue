<template>
	<view>
		<swiper class="swiper" :indicator-dots="indicatorDots" :current="current" next-margin="50rpx" previous-margin="50rpx"
		 @change="handleChange" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item>
				<view class="swiper-item uni-bg-red">A</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item uni-bg-green">B</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item uni-bg-blue">C</view>
			</swiper-item>
		</swiper>
		<view class="">
			<text>上一个</text>
			<text @click="next">下一个</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			listData: {
				type: Array,
				default: function() {
					return [];
				}
			},
		},
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500,
				current: 0,
			};
		},
		
		computed: {
			infoList() {
				return this.listData
			}
		},
		methods: {
			next() {
				this.current++
			},
			handleChange(e) {
				this.currentIndex = e.detail.current
				this.$emit('changeIndex', e.detail.current)
				// console.log(e.detail.current)
			}
		}
	}
</script>

<style lang="scss">

</style>
