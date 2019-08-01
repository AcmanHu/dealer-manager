import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		dealerOpenId:'',
		dealerMsg:{},
	},
	mutations: {
		setDealerOpenId(state, id) {
			state.dealerOpenId = id
		},
		setDealerMsg(state, msg) {
			state.dealerMsg = msg
		}
	},
	actions: {}
})

export default store
