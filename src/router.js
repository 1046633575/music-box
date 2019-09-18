import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main'
import Rank from './views/rank'
import Nav from './components/Nav'
import songList from './views/songList'

Vue.use(Router)

export default new Router({
  // mode: 'history', //去除连接后面的 #
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/main'
      // components: {
      //   default: Nav,
      //   'link': Main
      // }
    },
    {
      path: '/main',
      components: {
        default: Nav,
        'link': Main
      }
    },
    {
      path: '/rank',
      components: {
        default: Nav,
        'link': Rank
      }
    },
    {
      path: '/songList',
      components: {
        default: songList
      }
    },
    {
      path: '/rankList',
      components: {
        default: songList
      }
    }
  ]
})
