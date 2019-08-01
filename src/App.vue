<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 颜色表 */
	// @font-face {
	// 	font-family: 'iconfont';
	// 	/* project id 1267782 */
	// 	src: url('https://at.alicdn.com/t/font_1267782_p1t3lyxuk.eot');
	// 	src: url('https://at.alicdn.com/t/font_1267782_p1t3lyxuk.eot?#iefix') format('embedded-opentype'),
	// 		url('https://at.alicdn.com/t/font_1267782_p1t3lyxuk.woff2') format('woff2'),
	// 		url('https://at.alicdn.com/t/font_1267782_p1t3lyxuk.woff') format('woff'),
	// 		url('https://at.alicdn.com/t/font_1267782_p1t3lyxuk.ttf') format('truetype'),
	// 		url('https://at.alicdn.com/t/font_1267782_p1t3lyxuk.svg#iconfont') format('svg');
	// }
	@font-face {
		font-family: 'iconfont';
		src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2')
	}

	.m-color-red {
		color: red;
	}

	.m-color-goto {
		color: #0099ff;
	}

	.m-flex-space-b {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.m-align-justify-c {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.m-flex-align {
		display: flex;
		align-items: center;
	}

	.m-flex-align-wrap {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.m-dir-justify {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.m-container {
		padding: 20upx !important;
		box-sizing: border-box;
	}

	.m_placeholder {
		color: #808080;
	}

	.m-footer {
		position: fixed;
		background: #fff;
		width: 100%;
		bottom: 0;
		z-index: 10;
		padding: 20upx 0;
	}

	.m-shadow_box {
		box-shadow: 0 6upx 20upx 0 #E2E2E2;
		border-radius: 4upx;
	}

	.m-search-box {
		height: 80upx;
		background: #f2f2f2;
		padding: 30upx;
		box-sizing: border-box;
		border-radius: 80upx;

		.serach_input_box {
			padding-left: 30upx;
			color: #808080;
			font-size: $uni-font-size-base;
		}
	}

	.no_more_data {
		color: #808080;
		font-size: $uni-font-size-base;
		margin: 40upx 0;
		text-align: center;
	}

	.m-icon {
		font-family: iconfont;
	}

	button::after {
		border: none;
	}

	.input-box {
		padding: 50upx;
		font-size: 30upx;

		.input-item {
			display: flex;
			align-items: center;
			background: white;
			border-bottom: 1upx solid #eeeeee;
			padding: 30upx 0;
			// line-height: 100upx;
			// height: 100upx;

			.input-label {
				width: 180upx;
				// text-align: right;
			}

			.input-body {
				position: relative;
				// height: 100upx;
				width: calc(100% - 150upx);

				.input {
					// line-height: 100upx;
					// height: 100upx;
					position: relative;
					font-size: 28upx;
				}

				.eye {
					position: absolute;
					height: 50upx;
					width: 50upx;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				}

				.btn-code {
					position: absolute;
					right: 0upx;
					top: 50%;
					transform: translateY(-50%);
					background: none;
					color: #205592;
					width: 160upx;
					font-size: 24upx;
					box-sizing: border-box;
					text-align: right;
					padding: 0;
					height: 100upx;
					line-height: 100upx;
				}
			}

		}

		.select {
			padding-top: 40upx;
			display: flex;
			justify-content: space-between;
			color: #003B67;
		}
	}

	.button {
		margin: 0 30upx;
		background: #08B6F2;
		border-radius: 50upx;
		line-height: 80upx;
		height: 80upx;
		color: white;
		font-size: 32upx;
	}

	.jinyong,
	.shiyong,
	.jiaofei,
	.guoqi {
		position: relative;
	}

	.jinyong::before {
		content: "";
		background: url("./static/mark/jinyong.png") no-repeat;
		background-size: 74px 60px;
		width: 74px;
		height: 60px;
		position: absolute;
		right: 0;
		top: 0;
	}

	.shiyong::before {
		content: "";
		background: url("./static/mark/shiyong.png") no-repeat;
		background-size: 74px 60px;
		width: 74px;
		height: 60px;
		position: absolute;
		right: 0;
		top: 0;
	}

	.jiaofei::before {
		content: "";
		background: url("./static/mark/jiaofei.png") no-repeat;
		background-size: 74px 60px;
		width: 74px;
		height: 60px;
		position: absolute;
		right: 0;
		top: 0;
	}

	.guoqi::before {
		content: "";
		background: url("./static/mark/guoqi.png") no-repeat;
		background-size: 74px 60px;
		width: 74px;
		height: 60px;
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
