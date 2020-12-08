import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/views/home');
const Doc = () => import('@/views/doc')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/doc',
      name: 'Doc',
      component: Doc
    }
  ]
})
