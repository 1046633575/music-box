<template>
  <div class="container">
    <footer class="d-flex jc-between ai-center px-1">
      <audio id="audio" ref="audio" v-show="false" :src="musicUrl"></audio>
      <div class="footer-left d-flex jc-center ai-center">
        <img :src="music.al.picUrl" alt="" class="b-radius-50">
      </div>
      <div class="footer-center flex-1">
        <p class="w-100 name fs-lg text-black text-ellipsis-1">{{music.name}}</p>
        <p class="w-100 author fs-md text-grey-4 text-ellipsis-1">{{music.ar[0].name}}</p>
      </div>
      <div class="footer-right d-flex jc-around ai-center">
        <div>
          <i @click="play" class="iconfont icon-bofang fs-xxl" v-show="flag"></i>
          <i @click="pause" class="iconfont icon-zanting fs-xxl" v-show="!flag"></i>
        </div>
        <div>
          <i class="iconfont icon-caidan fs-xxl"></i>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      music: {},
      musicUrl: '',
      flag: this.$store.state.playFlag,
      musicId: this.$store.state.musicId,
      startFlag: false
    }
  },
  created () {
    this.getMusicDetail(this.$store.state.musicId)
    this.getMusicUrl(this.$store.state.musicId)
    this.pause()
  },
  // 监听 vuex 的变化
  computed: {
    getStoreId () {
      return this.$store.state.musicId
    }
  },
  watch: {
    getStoreId (newVal) {
      this.startFlag = true
      this.getMusicDetail(newVal)
      this.getMusicUrl(newVal)
    }
  },
  methods: {
    // 播放歌曲
    play () {
      if (this.$store.state.playFlag === false) {
        this.$store.commit('changePlayFlag', true)
        this.flag = this.$store.state.playFlag
      }
      this.$store.commit('changePlayFlag', false)
      this.flag = this.$store.state.playFlag
      this.$refs.audio.play()
    },
    pause () {
      if (this.$store.state.playFlag === false) {
        this.$store.commit('changePlayFlag', true)
        this.flag = this.$store.state.playFlag
        this.$refs.audio.pause()
      }
    },
    // 获取歌曲详情
    getMusicDetail (id) {
      this.$http.get('http://47.95.5.96:3000/song/detail?ids=' + id).then(res => {
        if (res.data.code === 200) {
          this.music = res.data.songs[0]
        }
      }).catch(() => {
        Toast({
          message: '数据获取失败',
          position: 'bottom',
          duration: 5000
        })
      })
    },
    // 获取歌曲 url
    getMusicUrl (id) {
      this.$http.get('http://47.95.5.96:3000/song/url?id=' + id).then(res => {
        if (res.data.code === 200) {
          this.musicUrl = res.data.data[0].url
        }
        if (this.startFlag) {
          setTimeout(() => {
            this.play()
          }, 100)
        }
      }).catch(() => {
        Toast({
          message: 'url获取失败',
          position: 'bottom',
          duration: 5000
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  footer{
    width: 100%;
    max-width: 640px;
    height: 50px;
    position: fixed;
    bottom: 0;
    z-index: 999;
    background-color: #fff;
    border-top: 1px solid #ccc;
    .footer-left{
      width: 50px;
      height: 100%;
      img{
        width: 35px;
        height: 35px;
      }
    }
    .footer-center{
      width: 60%;
    }
    .footer-right{
      width: 90px;
    }
    i.iconfont{
      font-size: 26px;
    }
  }
</style>
