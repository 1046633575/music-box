<template>
  <div class="play-container">
    <top-bar :title="music.name" :name="music.ar[0].name" :flag="true"></top-bar>
    <img class="bg" :src="music.al.picUrl" alt="">
    <div class="dv"></div>
    <!--播放cd图片-->
    <div class="play-top d-flex jc-center ai-center">
      <div class="box d-flex jc-center ai-center b-radius-50">
        <div class="box-top"></div>
        <img class="b-radius-50" :src="music.al.picUrl" alt="">
      </div>
    </div>
    <!--歌词-->
    <div class="play-center"></div>
    <!--底部控制栏-->
    <div class="play-bottom d-flex jc-around ai-center text-white">
      <div class="state">
        <i class="iconfont icon-xunhuanbofang"></i>
        <i class="iconfont icon-danquxunhuan"></i>
        <i class="iconfont icon-suijibofang"></i>
      </div>
      <div class="left">
        <i class="iconfont icon-shangyiqu"></i>
      </div>
      <div class="center">
        <i @click="play" v-show="flag" class="iconfont icon-zanting1"></i>
        <i @click="pause" v-show="!flag" class="iconfont icon-bofang-wangyiicon"></i>
      </div>
      <div class="right">
        <i class="iconfont icon-xiayiqu"></i>
      </div>
      <div class="menu">
        <i class="iconfont icon-caidan"></i>
      </div>
    </div>
  </div>
</template>

<script>
import topBar from '../components/TopBar'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      music: {},
      musicList: [],
      index: null,
      // 音乐的播放与暂停
      flag: this.$store.state.playFlag
    }
  },
  components: {
    topBar
  },
  created () {
    this.getMusicDetail(this.$store.state.musicId)
    this.getMusicList()
    this.getMusicIndex()
    this.getMusicLyric(this.$store.state.musicId)
  },
  // 监听 vuex 的变化
  computed: {
    getStoreId () {
      return this.$store.state.musicId
    }
  },
  watch: {
    getStoreId (newVal) {
      this.getMusicDetail(newVal)
      this.getMusicList()
      this.getMusicIndex()
      this.getMusicLyric()
    }
  },
  methods: {
    // 获取歌曲详情
    getMusicDetail (id) {
      this.$http.get('http://47.95.5.96:3000/song/detail?ids=' + id).then(res => {
        if (res.data.code === 200) {
          this.music = res.data.songs[0]
          console.log(this.music)
        }
      }).catch(() => {
        Toast({
          message: '数据获取失败',
          position: 'bottom',
          duration: 5000
        })
      })
    },
    // 获取列表数据
    getMusicList () {
      this.musicList = this.$store.state.musicList
    },
    // 获取当前歌曲在列表中的索引，用于切换上下曲
    getMusicIndex () {
      this.index = this.$store.state.index
    },
    // 获取歌词
    getMusicLyric (id) {
      this.$http.get('http://47.95.5.96:3000/lyric?id=' + id).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.lrc)
        }
      })
    },
    // 播放歌曲
    play () {
      if (this.$store.state.playFlag === false) {
        this.$store.commit('changePlayFlag', true)
        this.flag = this.$store.state.playFlag
      }
      this.$store.commit('changePlayFlag', false)
      this.flag = this.$store.state.playFlag
      document.querySelector('#audio').play()
    },
    // 暂停歌曲
    pause () {
      if (this.$store.state.playFlag === false) {
        this.$store.commit('changePlayFlag', true)
        this.flag = this.$store.state.playFlag
        document.querySelector('#audio').pause()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .play-container{
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    .bg{
      width: 100%;
      height: 100%;
      filter:blur(150px);
      -webkit-filter:blur(150px);
      -moz-filter:blur(150px);
      -ms-filter:blur(150px);
      -o-filter:blur(150px);
      position: absolute;
      top: 0;
    }
    .dv{
      width: 100%;
      height: 100%;
      background:hsla(0,0%,0%,.6) border-box;
    }
    .play-top{
      width: 100%;
      height: 50%;
      position: absolute;
      top: 0;
      z-index: 9;
      .box{
        width: 260px;
        height: 260px;
        background: url("../assets/image/disc.png") no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
        img{
          width: 64%;
        }
        .box-top{
          width: 84px;
          height: 120px;
          background: url("../assets/image/needle.png") no-repeat;
          -webkit-background-size: cover;
          background-size: cover;
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 9;
        }
      }
    }
    .play-center{
      width: 100%;
      height: 40%;
      background-color: pink;
      position: absolute;
      top: 50%;
      z-index: 9;
    }
    .play-bottom{
      width: 100%;
      height: 10%;
      position: absolute;
      top: 90%;
      z-index: 9;
      .state,
      .left,
      .center,
      .right,
      .menu{
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      .iconfont{
        font-size: 24px;
        position: absolute;
      }
      .center{
        .iconfont{
          font-size: 44px;
        }
      }
    }
  }
</style>
