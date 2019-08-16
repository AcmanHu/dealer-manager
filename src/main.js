import Vue from 'vue'
import App from './App'
import request from '@/common/request/request.js'
import store from './store'
import {
	checkNone,
	checkPhone,
	checkCode,
	cityList
} from "@/common/common.js"

// const windowHeight = window.innerHeight
// Vue.directive('fixedInput', function(el) {
// 		console.log(el)
// 	el.addEventListener('blur', function() {
// 		console.log(123);
// 		let windowFocusHeight = window.innerHeight
// 		if (windowHeight == windowFocusHeight) {
// 			return
// 		}
// 		console.log(windowHeight + '--' + windowFocusHeight);
// 		console.log('修复');
// 		let currentPosition;
// 		let speed = 1; //页面滚动距离
// 		currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
// 		currentPosition -= speed;
// 		window.scrollTo(0, currentPosition); //页面向上滚动
// 		currentPosition += speed; //speed变量
// 		window.scrollTo(0, currentPosition); //页面向下滚动
// 	})
// })


let publicUrl;
// publicUrl = 'http://192.168.1.8:1006/'
import mpvuePicker from 'mpvue-picker';
if (process.env.NODE_ENV === 'development') {
	publicUrl = 'http://192.168.1.8:1006/'
	console.log('开发环境')
} else {
	publicUrl = 'http://ds.jete.cn/'
	console.log('生产环境')
}
request.setConfig({
	baseUrl: publicUrl, // 此为测试地址，需加入到域名白名单，或者更改为您自己的线上地址即可
	dataType: 'json', // 可删除，默认为json
	responseType: 'text', // 可删除，默认为text
	// 设置请求头，支持所有请求头设置，也可不设置，去掉header就行
	header: {
		'content-type': 'application/json'
	}
})

let Toast = {
	Model: function(msg) {
		uni.showModal({
			title: '提示',
			content: msg || '服务器忙碌中，请稍后再试',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	},
	checkNone,
	checkPhone,
	checkCode,
	cityList
}
let publicInfo = {
	shopID: 27966,
	appID: 'wxf8eb3ba8bcd0c5bd'
}
Vue.prototype.$Toast = Toast;
Vue.prototype.$request = request;
Vue.prototype.$store = store
Vue.prototype.$pubInfo = publicInfo
Vue.prototype.$pubUrl = publicUrl
Vue.config.productionTip = false

Vue.component('mpvuePicker', mpvuePicker)

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
