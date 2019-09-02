<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// this.userAgentWx()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			userAgentWx() {
				var useragent = navigator.userAgent;
				if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
					// 这里警告框会阻塞当前页面继续加载
					alert('请在微信客户端访问本页面');
					// 以下代码是用javascript强行关闭当前页面
					var opened = window.open('about:blank', '_self');
					opened.opener = null;
					opened.close();
				}
			}
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

	.m-container-t {
		padding: 10upx 20upx !important;
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
			padding: 16upx 0;
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
	.no_pay,
	.guoqi {
		position: relative;
	}

	.no_pay::after {
		font-family: "iconfont" !important;
		font-size: 40px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		content: "\e629";
		position: absolute;
		right: -36px;
		color: #f42d2a;
		top: 0;
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
