import Vue from 'vue';
import axios from 'axios';
Vue.prototype.$axios = axios;
import qs from 'qs';
Vue.prototype.$qs = qs;

// axios 配置
axios.defaults.timeout = 10000;
// let host = window.location.host
// host = window.location.protocol + '//' + host.replace('web', 'api')
// console.log('host: ' + host)
// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'api' : host

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.withCredentials = true //设置为true时不能处理*的方式处理的跨域


// http request 拦截器
axios.interceptors.request.use(
	config => {
		if (config.method == 'post') {
			// config.data = qs.stringify(config.data)
		}
		return config;
	},
	err => {
		return Promise.reject(err);
});

// http response 拦截器
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					break;
				case 410:
          break;
        case 404:
          return Promise.reject('404');
          break;

			}
		}
		return Promise.reject(error.response) // 返回接口返回的错误信息
	});
export default axios;
