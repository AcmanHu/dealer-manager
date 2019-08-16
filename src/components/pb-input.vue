<template>
	<view>
		<!-- 文本框 -->
		<template v-if="oInClear === 1">
			<input class="main-input" :class="[focus?'password_input_c':'password_input']" :value="value" :type="_type"
			 :maxlength="maxlength" :placeholder="placeholder" :adjust-position="false" :password="type==='password'&&!showPassword"
			 @input="onInput" @blur="blur_input" @focus="focus_input" />
		</template>
		<template v-else>
			<input class="main-input" :value="value" :type="_type" :maxlength="maxlength" :placeholder="placeholder"
			 :adjust-position="false" :password="type==='password'&&!showPassword" @input="onInput" @blur="blur_input" @focus="focus_input" />
		</template>
	</view>
</template>

<script>
	var myFunction;
	export default {
		data() {
			return {
				showPassword: false, //是否显示明文
				second: 0, //倒计时
				isRunCode: false, //是否开始倒计时,
				flag: false,
				oInClear: 0,
				oldVal: '',
				focus: false
			}
		},
		props: {
			type: String, //类型
			value: String, //值
			placeholder: String, //框内提示
			maxlength: {
				//最大长度
				type: [Number, String],
				default: 20,
			},
			inClear: {
				type: [Number, String],
				default: 0,
			},
			isFocus: {
				type: [Boolean, String],
				default: true,
			},
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		watch: {
			inClear: {
				handler(n, o) {
					this.oInClear = n
				},
				immediate: true
			},
		},
		mounted() {
			this.oldVal = this.value
		},
		methods: {
			blur_input() {
				// alert("失去")
				this.flag = false
				myFunction = setTimeout(() => {
					if (!this.flag) {
						window.scrollTo({
							top: 0,
							left: 0,
							behavior: "smooth"
						}) //重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)
					}
				}, 200);
				if (this.oInClear == 1) {
					if (this.value === "") {
						this.$emit('setInput', this.oldVal)
						// this.value = "888888"
					}
				}
			},
			focus_input() {
				this.flag = true
				clearTimeout(myFunction)
				if (this.oInClear == 1) {
					this.focus = true
					// this.value = ""
					this.$emit('setInput', '')
				}
			},
			onInput(e) {
				//传出值
				this.$emit('input', e.target.value)
			},
		},
		computed: {
			_type() {
				//处理值
				const type = this.type
				return type == 'password' ? 'text' : type
			}
		}
	}
</script>

<style>
	.main-input {
		position: relative;
		font-size: 28upx;
	}

	.password_input {
		color: #808080;
	}

	.password_input_c {
		color: #000;
	}
</style>
