<template>
	<view>
		<view class="no_more_data">功能研发中...0.0~</view>
<!-- 		<uniNumBox @change="numChange" :min="1" :max="100" v-model="numVal"></uniNumBox>
		<button type="primary" @click="clearData" style="margin: 80upx 0;">清空数据</button>
		<numBox :value="1" :min="1" :circle="true" @change="numChange"></numBox> -->
	</view>
</template>

<script>
	import numBox from '../../components/numberBox.vue';
	import uniNumBox from '../../components/uni-number-box.vue';
	export default {
		components:{
			numBox,
			uniNumBox
		},
		data() {
			return {
				numVal: 1,
			};
		},
		methods:{
			clearData() {
				this.numVal = 1
			},
			numChange(e) {
				console.log(this.numVal);
			}
		}
	}
</script>

<style lang="scss">

</style>
