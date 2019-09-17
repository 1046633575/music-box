import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/style.scss'
import './assets/iconfont/iconfont.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import { Swipe, SwipeItem, InfiniteScroll, Lazyload } from 'mint-ui'
import 'mint-ui/lib/style.css'
import Axios from 'axios'
import './assets/touch/touch'

Vue.prototype.$http = Axios
Axios.defaults.baseURL = 'http://47.95.5.96:3000'
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.use(VueAwesomeSwiper)
Vue.use(InfiniteScroll)
Vue.use(Lazyload, {
  loading: 'http://img.pcauto.com.cn/images/upload/upc/tx/bbs6/1609/21/c159/27317574_1474454365513_1024x1024.gif'
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
