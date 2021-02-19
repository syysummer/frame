
import Vue from 'vue'
import Router from 'vue-router'
const Course = () => import('@p/course/index.vue')
const CourseDetail = () => import('@p/course/course-detail.vue')
const TeacherColumn = () => import('@p/teacherColumn/index.vue')
const TeacherColumnDetail = () => import('@p/teacherColumn/_id.vue')
const TopTenDetail = () => import('@p/teacherColumn/topTenDetail.vue')

//组件模块
const Home = () => import('@p/home');
const HistoryLive = () => import('@p/live/historyLive');
const Live = () => import('@p/live/liveRoom');
const News = () => import('@p/news/index');
const NewsColumn = () => import('@p/news/news/index');
const NewsWithLine = () => import('@p/news/withLine');
const Article = () => import( '@/pages/news/article');
const Helper = () => import( '@/pages/helperWord/index');
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/live',
      name: 'Live',
      component: Live
    },
    {
      path: '/historyLive/:id',
      name: 'HistoryLive',
      component: HistoryLive
    },
    {
      path: '/course',
      name: 'Course',
      component: Course,
      meta: { title: "哈哈哈" }
    },
    {
      path: '/course/detail/:id/:type',
      name: 'CourseDetail',
      component: CourseDetail
    },
    { path: '/news',
      name: 'News',
      component: News,
      children:[
        {
          path: '/news/:newsType/:id',
          name: 'NewsColumn',
          component: NewsColumn,
        },
        {
          path: '/news/:newsType/:id/withLine',
          name: 'NewsWithLine',
          component: NewsWithLine,
        }
      ] 
    },
    {
      path: '/article/:id',
      name: 'Article',
      component: Article
    },
    { path: '/teacherColumn', name: 'TeacherColumn', component: TeacherColumn },
    { path: '/teacherColumn/:id', name: 'TeacherColumnDetail', component: TeacherColumnDetail },
    { path: '/topTenDetail/:id', name: 'TopTenDetail', component: TopTenDetail },
    {
      path: '/helper',
      name: 'Helper',
      component: Helper
    },
  ]
})