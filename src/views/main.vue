<template>
  <div class="main-container">
    <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="swiperChange">
      <swiper-slide>
        <mt-swipe class="b-radius-6" :auto="5000" style="height: 140px;">
          <mt-swipe-item v-for="item in bannerList" :key="item.bannerId"><img class="w-100 h-100" :src="item.pic" alt=""></mt-swipe-item>
        </mt-swipe>
      </swiper-slide>
      <swiper-slide>
        242
      </swiper-slide>
    </swiper>

  </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      bannerList: []
    }
  },
  created () {
    this.getBanner()
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
          duration: 3000
        })
      })
    },
    swiperChange () {
      console.log('ss')
    }
  }
}
</script>

<style scoped lang="scss" >
  .main-container{
    padding: 0 5px;
  }
</style>
