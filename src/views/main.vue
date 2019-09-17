<template>
  <div class="main-container" id="main">
     <!--轮播图-->
     <mt-swipe class="mtSwiper b-radius-6" ref="mtSwiper" :auto="5000">
       <mt-swipe-item v-for="item in bannerList" :key="item.bannerId"><img class="w-100 h-100" :src="item.pic" alt=""></mt-swipe-item>
     </mt-swipe>
     <!--推荐歌单-->
     <Song-Sheet></Song-Sheet>

  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import SongSheet from '../components/SongSheet'
export default {
  data () {
    return {
      bannerList: []
    }
  },
  created () {
    this.getBanner()
  },
  mounted () {
    this.changeBannerHeight()
  },
  components: {
    SongSheet
  },
  methods: {
    // 获取轮播图数据
    getBanner () {
      this.$http.get('/banner?type=1').then(res => {
        if (res.status === 200) {
          this.bannerList = res.data.banners
        }
      }).catch(() => {
        Toast({
          message: '轮播图获取失败',
          position: 'bottom',
          duration: 5000
        })
      })
    },
    // 根据设备宽度设置轮播图高度
    changeBannerHeight () {
      let width = document.documentElement.clientWidth
      if (width >= 640) {
        document.querySelector('.mtSwiper').classList.add('newMtSwiper')
      } else {
        document.querySelector('.mtSwiper').classList.remove('newMtSwiper')
      }
      window.onresize = () => {
        width = document.documentElement.clientWidth
        if (width >= 640) {
          document.querySelector('.mtSwiper').classList.add('newMtSwiper')
        } else {
          document.querySelector('.mtSwiper').classList.remove('newMtSwiper')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss" >
  .main-container{
    padding: 0 5px 50px;
    .mtSwiper{
      height: 140px;
    }
    .newMtSwiper{
      height: 280px;
    }
  }
</style>
