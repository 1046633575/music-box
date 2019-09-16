<template>
  <div class="container">
    <footer class="d-flex jc-between ai-center px-1">
      <audio id="audio" ref="audio" v-show="false" src="http://m10.music.126.net/20190629153145/4e387577cb7d314369becca1e5d94e91/ymusic/b7e8/df03/e357/cfb42de2491eea63cb68331a3c61fe5b.mp3"></audio>
      <div class="footer-left d-flex jc-center ai-center">
        <img src="../assets/image/music.png" alt="" class="b-radius-50">
      </div>
      <div class="footer-center flex-1">
        <p class="name fs-lg text-black">旋木</p>
        <p class="author fs-md text-grey-4">王菲</p>
      </div>
      <div class="footer-right d-flex jc-around ai-center">
        <div @click="changePlayState">
          <i class="iconfont icon-bofang fs-xxl" v-show="flag"></i>
          <i class="iconfont icon-zanting fs-xxl" v-show="!flag"></i>
        </div>
        <div>
          <i class="iconfont icon-caidan fs-xxl"></i>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: true
    }
  },
  methods: {
    // 播放或暂停
    changePlayState () {
      if (this.flag) {
        // 播放
      } else {
        // 暂停
      }
      this.flag = !this.flag
    }
  }
}
</script>

<style scoped lang="scss">
  footer{
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #ccc;
    .footer-left{
      width: 50px;
      height: 100%;
      img{
        width: 35px;
        height: 35px;
      }
    }
    .footer-right{
      width: 90px;
    }
    i.iconfont{
      font-size: 26px;
    }
  }
</style>
