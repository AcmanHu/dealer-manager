<template>
	<view class="m-container">
		<view class="m-flex-space-b m-list" v-for="(item,key) in listData" :key="key">
			<text class="title">{{item.title}}</text>
			<text :class="['name', item.color?item.color:'']">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				detail: {},
				listData: {},
				list: {
					shopName: {
						title: '店铺名称',
						name: '靓美发艺'
					},
					contact: {
						title: '联系人',
						name: '张三'
					},
					phone: {
						title: '手机号码',
						name: '18888888888'
					},
					address: {
						title: '详细地址',
						name: '重庆市石桥铺石桥广场'
					},
					buyOrg: {
						title: '购买系统',
						name: '5A单店版'
					},
					reg: {
						title: '注册号',
						name: '22251001'
					},
					userName: {
						title: '用户名',
						name: '188883314878'
					},
					password: {
						title: '密码',
						name: '88888888'
					},
					status: {
						title: '状态',
						name: '禁用',
						color: 'red'
					},
					createTime: {
						title: '创建时间',
						name: '2019-06-05'
					},
					firstUseTime: {
						title: '首次使用时间',
						name: '2019-06-05'
					},
					lastUseTime: {
						title: '最后使用时间',
						name: '2019-06-05'
					},
					endTime: {
						title: '授权到期时间',
						name: '2020-06-05',
						color: 'red'
					},
				},
				list1: {
					product: {
						title: '销售产品',
						name: '5A单店版'
					},
					price: {
						title: '价格',
						name: '1288'
					},
					saleTime: {
						title: '销售时间',
						name: '2019-05-14'
					},
					status: {
						title: '状态',
						name: '试用中',
						color: 'red'
					},
					shopName: {
						title: '店铺名称',
						name: '靓发美艺'
					},
					contact: {
						title: '联系人',
						name: '张三'
					},
					phone: {
						title: '手机号码',
						name: '188888888'
					},
					address: {
						title: '详细地址',
						name: '重庆市石桥铺'
					}
				},
				arr: [1, 1, 1]
			};
		},
		onLoad(option) {
			let msg = JSON.parse(option.info)
			console.log(msg);
			this.detail = msg
			if (option.type === '0') {
				this.list.shopName.name = msg.orgName
				this.list.contact.name = msg.orgContacts
				this.list.phone.name = msg.orgPhone
				this.list.address.name = msg.orgAddress
				this.list.buyOrg.name = msg.productName
				this.list.reg.name = msg.reg
				this.list.userName.name = msg.orgLoginName
				this.list.password.name = msg.orgPassword
				//店铺状态1=正常2=过期3=试用
				if (msg.orgState === 1) {
					this.list.status.name = '正常'
					this.list.status.color = ''
				} else if (msg.orgState === 2) {
					this.list.status.name = '过期'
				} else if (msg.orgState === 3) {
					this.list.status.name = '试用'
				} else {}
				this.list.createTime.name = msg.orgBeginDate.split('T')[0]
				this.list.firstUseTime.name = msg.orgBeginDate.split('T')[0]
				this.list.lastUseTime.name = msg.orgBeginDate.split('T')[0]
				this.list.endTime.name = msg.orgEndDate[0] == '0001-01-01' ? '' : msg.orgEndDate[0]
				this.listData = this.list
				console.log(this.listData);
			} else if (option.type === '1') {
				this.list1.product.name = msg.productName
				this.list1.price.name = msg.price
				this.list1.saleTime.name = msg.orderDate[0]
				// 支付类型1=线上支付2=线下支付3=试用
				if (msg.payType === 1) {
					this.list1.status.name = '线上支付'
				} else if (msg.payType === 2) {
					this.list1.status.name = '线下支付'
				} else if (msg.payType === 3) {
					this.list1.status.name = '试用'
				} else {}
				this.list1.shopName.name = msg.orgName
				this.list1.contact.name = msg.orgContacts
				this.list1.phone.name = msg.orgPhone
				this.list1.address.name = msg.orgAddress
				this.listData = this.list1
			}
			console.log(msg);
		},
		methods: {},
	}
</script>

<style lang="scss" scoped>
	.red {
		color: red;
	}

	.m-list {
		padding: 20upx 0;
		border-bottom: 1px solid #e4e4e4;
		font-size: $uni-font-size-base;
		margin-top: 20upx;

		.title {
			color: #999;
		}

		.name {}
	}
</style>
