import store from './index';

export default {
	updateLoading(state, status) {
		state.is_loading = status
	},
}