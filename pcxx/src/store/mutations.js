import store from './index'

export default {
  updateUserInfo(state, {data}) {
	  state.userInfo = data
  },
}