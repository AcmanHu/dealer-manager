<template>
	<view class="m-container">
		<view class="success_box">
			<text class="m-icon succ_icon">&#xe68d;</text>
			<view class="title">恭喜您，注册成功！</view>
		</view>
		<view class="user_box">
			<view class="title"><text class="title_name">注册号</text><text class="num">{{reg}}</text></view>
			<view class="title"><text class="title_name">用户名</text><text class="num">{{userName}}</text></view>
			<view class="title"><text class="title_name">密码</text><text class="num">{{password}}</text></view>
		</view>
		<view class="tips_box">
			温馨提示：
			<view class="tip">1.请记住注册号，如在使用过过程中遇到疑问可提供注册号联系相关人员处理</view>
			<view class="tip">2.登录系统网址：j.jete.cn</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				reg: '',
				userName: "",
				password: ""
			};
		},
		onLoad(option) {
			console.log(uni.getStorageSync('HshopData'))
			// console.log(Object.keys(option).length);
			if (option.orderID) {
				let oData = uni.getStorageSync('HshopData')
				oData.payBillID = option.orderID
				this.reqRegister(oData)
			} else {
				let oUser = JSON.parse(option.userdata)
				this.reg = oUser.reg
				this.userName = oUser.userName
				this.password = oUser.password
			}
		},
		methods: {
			reqRegister(data) {
				console.log(data);
				uni.showLoading({
					title: '加载中'
				});
				this.$request
					.post("WeChatSubscription/Distributor/BuyOrg", {
						data: data
					})
					.then(res => {
						uni.hideLoading();
						// alert(JSON.stringify(res))
						if (res.data.statusCode === 0) {
							uni.showToast({
								icon: 'none',
								title: res.data.value
							})
						} else if (res.data.statusCode === 1) {
							let oData = res.data.value
							this.reg = oData.reg
							this.userName = oData.orgLoginName
							this.password = oData.orgPassword
							uni.showToast({
								icon: 'success',
								title: '购买成功'
							})
							uni.removeStorageSync('HshopData')
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.value
							})
						}
					})
					.catch(error => {
						uni.hideLoading();
						this.$Toast.Model();
						console.error('error:', error);
					});
			},
		}
	}
</script>

<style lang="scss">
	.success_box {
		text-align: center;
		color: #d81e06;
		padding: 60upx 0;
		border-bottom: 1px solid #e4e4e4;

		.succ_icon {
			font-size: 120upx;
		}
	}

	.title_name {
		// display: inline-block;
		// width: 120upx;
		// position: absolute;	
		display: inline-block;
		width: 120upx;
		height: 30px;
		line-height: 30px;
		text-align: justify;
		overflow: hidden;
	}

	.title_name:after {
		display: inline-block;
		content: '';
		width: 120upx;
		height: 30px;
		text-align: justify;
		overflow: hidden;
	}


	.user_box {
		color: #999;
		font-size: $uni-font-size-base;
		border-bottom: 1px solid #e4e4e4;
		padding: 40upx 20upx;

		.title {
			padding: 10upx 0;
			display: flex;
			align-items: center;
		}

		.num {
			color: #333;
			font-size: 40upx;
			position: relative;
			display: inline-block;
			margin-left: 40upx;
		}

		.num:before {
			content: '：';
			position: absolute;
			left: -40upx;
			color: #999;
		}
	}

	.tips_box {
		font-size: $uni-font-size-base;
		padding: 20upx 0;
		color: #999;

		.tip {
			padding: 10upx 0;
		}
	}
</style>
