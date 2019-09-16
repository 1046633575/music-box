import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main'
import Rank from './views/rank'

Vue.use(Router)

export default new Router({
  // mode: 'history', //去除连接后面的 #
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Main,
      name: 'main'
    },
    {
      path: '/rank',
      component: Rank,
      name: 'rank'
    }
  ]
})
