<template>
	<view class="ht_number">
		<view :class="['sub', {'ht_num_disable': inputVal <= min || disabled}, {'ht_circle': circle}]" @click="calValue('minus')">-</view>
		<input class="num_box" type="number" v-model="inputVal" @blur="onBlur" />
		<view :class="['inc', {'ht_num_disable': inputVal >= max || disabled}, {'ht_circle': circle}]" @click="calValue('plus')">+</view>
	</view>
</template>

<script>
	export default {
		name: 'HtNumBox',
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			circle: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputVal: 1
			};
		},
		methods: {
			calValue(type) {
				if(this.disabled) {
					return
				}
				const scale = this.getDecimalScale()
				let value = this.inputVal * scale
				let step = this.step * scale
				if(type === 'minus') {
					value -= step
				} else if (type === 'plus') {
					value += step
				}
				if(value < this.min || value > this.max) {
					return
				}
				this.inputVal = value / scale
			},
			getDecimalScale() {
				let scale = 1
				// 浮点型
				if(~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length)
				}
				return scale
			},
			onBlur(e) {
				let value = e.detail.value
				if(!value) {
					this.inputVal = 0
					return
				}
				value = +value
				if(value > this.max) {
					value = this.max
				} else if(value < this.min) {
					value = this.min
				}
				this.inputVal = value
			}
		},
		watch: {
			value: {
				handler(n) {
					this.inputVal = +n
				},
				immediate: true
			},
			inputVal(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit('change', newVal)
				}
			}
		}
	}
</script>

<style lang="scss">
	$busic-width: 70upx;
	.ht_number {
		display: inline-flex;
		align-items: center;
		height: 70upx;
		// border: 1px solid #c8c7cc;

		.sub,
		.inc {
			margin: 0;
			background-color: #007aff;
			width: 70upx;
			font-size: 40upx;
			height: 100%;
			line-height: 70upx;
			text-align: center;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			position: relative;
		}

		.sub {
			// border-right: 1px solid #c8c7cc;
		}

		.num_box {
			position: relative;
			display: block;
			font-size: 16px;
			line-height: 1.4em;
			background-color: #ffffff;
			width: 80upx;
			height: 100%;
			text-align: center;
			padding: 0;
		}

		.inc {
			// border-left: 1px solid #c8c7cc;
		}

		.ht_num_disable {
			color: #c0c0c0;
			background: #F8F8F8;
		}
		.ht_circle{
			border-radius: 50%;
		}
	}
</style>
