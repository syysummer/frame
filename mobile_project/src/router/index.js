import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/views/home');
const Lottery = () => import ('@/views/lottery')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/lottery',
      name: 'Lottery',
      component: Lottery
    }
  ]
})
