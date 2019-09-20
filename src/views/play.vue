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
    <div class="play-center ">
      <div class="d-flex flex-column jc-center">
        <div class="first text-center text-grey-1">{{firstLrc}}</div>
        <div class="second text-center my-5 text-white fs-lg">{{secondLrc}}</div>
        <div class="last text-center text-grey-1">{{lastLrc}}</div>
      </div>
    </div>
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
      <div class="progresBar d-flex jc-between ai-center text-grey-1 fs-sm">
        <div class="left">01:23</div>
        <div class="center">
          <div class="bar" :style="myProgress"></div>
          <div class="round"></div>
        </div>
        <div class="right">03:39</div>
      </div>
    </div>
  </div>
</template>

<script>
import topBar from '../components/TopBar'
import { Toast } from 'mint-ui'
export default {
  name: 'play',
  data () {
    return {
      music: {},
      musicList: [],
      index: null,
      // 音乐的播放与暂停
      flag: this.$store.state.playFlag,
      // 歌词
      lrc: null,
      // 歌曲进度
      myProgress: null,
      // 第一行歌词
      firstLrc: '',
      // 第二行歌词
      secondLrc: '',
      // 第三行歌词
      lastLrc: ''
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
    },
    getMusicPlayTime () {
      return this.$store.state.musicTime
    }
  },
  watch: {
    getStoreId (newVal) {
      this.getMusicDetail(newVal)
      this.getMusicList()
      this.getMusicIndex()
      this.getMusicLyric(newVal)
    },
    getMusicPlayTime (time) {
      console.log(time)
      const longTime = this.music.dt / 1000
      const percentage = parseInt(time / longTime * 100)
      this.myProgress = { width: percentage + '%' }
      // var num = 0
      // 歌词
      // 监听到时间变化后 获取时间对应的歌词
      if (this.lrc[parseInt(time)] !== undefined && this.lrc[parseInt(time)] !== '') {
        // 第一行歌词
        var oldTime = parseInt(time) - 1
        for (let i = 0; i < 30; i++) {
          if (this.lrc[oldTime - i] !== undefined && this.lrc[oldTime - i] !== '') {
            this.firstLrc = this.lrc[oldTime - i]
            break
          }
        }
        // 第二行歌词
        this.secondLrc = this.lrc[parseInt(time)]
        console.log(this.lrc[parseInt(time)])
        // 第三行歌词
        const newTime = parseInt(time) + 1
        for (let i = 0; i < 30; i++) {
          if (this.lrc[newTime + i] !== undefined && this.lrc[newTime + i] !== '') {
            this.lastLrc = this.lrc[newTime + i]
            break
          }
        }
      }
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
          const oldLrc = res.data.lrc.lyric
          this.lrc = this.parseLyric(oldLrc)
          console.log(this.lrc)
        }
      })
    },
    // 正则表达式处理歌词
    parseLyric (lrc) {
      var lyrics = lrc.split('\n')
      var lrcObj = {}
      for (var i = 0; i < lyrics.length; i++) {
        var lyric = decodeURIComponent(lyrics[i])
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g
        var timeRegExpArr = lyric.match(timeReg)
        if (!timeRegExpArr) continue
        var clause = lyric.replace(timeReg, '')
        for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
          var t = timeRegExpArr[k]
          var min = Number(String(t.match(/\[\d*/i)).slice(1))
          var sec = Number(String(t.match(/:\d*/i)).slice(1))
          var time = min * 60 + sec
          if (clause === '') {
            break
          }
          lrcObj[time] = clause
        }
      }
      return lrcObj
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
      .progresBar{
        width: 100%;
        height: 20px;
        position: absolute;
        top: -30px;
        .center{
          width: 80%;
          height: 1px;
          background-color: #d2d2d2;
          display: flex;
          align-items: center;
          justify-content: start;
          .bar{
            width: 0%;
            height: 2px;
            background-color: #d2d2d2;
          }
          .round{
            width: 8px;
            height: 8px;
            background-color: #fff;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }
        }
      }
    }
  }
</style>
