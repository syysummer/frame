import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'

Vue.config.productionTip = false;
import element from '@/plugins/element/index';
Vue.use(element);
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: require('@/assets/img/lazyImg.png'),
  loading: require('@/assets/img/lazyImg.png'),
  attempt: 1,
})
import '@/plugins/config/debug';
//引入Chimee
import '@/plugins/chimee/index.js';
import './plugins/globalFunc';
import '@/assets/less/global.less';
import '@/utils/initTime';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
