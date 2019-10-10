<template>
  <div class="play-container">
    <top-bar :title="music.name" :name="music.ar[0].name" :flag="true"></top-bar>
    <img class="bg" :src="music.al.picUrl" alt="">
    <div class="dv"></div>
    <!--播放cd图片-->
    <div class="play-top d-flex jc-center ai-center">
      <div class="box d-flex jc-center ai-center b-radius-50">
        <div class="box-top"></div>
        <img id="img" ref="img" class="b-radius-50" :src="music.al.picUrl" alt="">
      </div>
    </div>
    <!--歌词-->
    <div class="play-center ">
      <div class="d-flex flex-column jc-center" v-show="!noLrc">
        <div class="first text-center text-grey-1">{{firstLrc}}</div>
        <div class="second text-center my-5 text-white fs-lg">{{secondLrc}}</div>
        <div class="last text-center text-grey-1">{{lastLrc}}</div>
      </div>
      <div class="text-white fs-lg text-center pt-5" v-show="noLrc">纯音乐，无歌词</div>
    </div>
    <!--底部控制栏-->
    <div class="play-bottom d-flex jc-around ai-center text-white">
      <div @click="changeListState" class="state">
        <i v-show="listState === 1" class="iconfont icon-xunhuanbofang"></i>
        <i v-show="listState === 2" class="iconfont icon-danquxunhuan"></i>
        <i v-show="listState === 3" class="iconfont icon-suijibofang"></i>
      </div>
      <div @click="prevMusic" class="left">
        <i class="iconfont icon-shangyiqu"></i>
      </div>
      <div class="center">
        <i @click="play" v-show="flag" class="iconfont icon-zanting1"></i>
        <i @click="pause" v-show="!flag" class="iconfont icon-bofang-wangyiicon"></i>
      </div>
      <div @click="nextMusic" class="right">
        <i class="iconfont icon-xiayiqu"></i>
      </div>
      <div @click="openList" class="menu">
        <i class="iconfont icon-caidan"></i>
      </div>
      <!--播放进度-->
      <div class="progresBar d-flex jc-between ai-center text-grey-1 fs-sm">
        <div class="left">{{ this.$store.state.musicTime | currentFormat }}</div>
        <div class="center" id="progres" @click="changeProgresBar">
          <div class="bar" :style="myProgress"></div>
          <div class="round"></div>
        </div>
        <div class="right">{{ music.dt | dateFormat }}</div>
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
      lastLrc: '',
      // 列表状态 1：顺序  2：单曲  3：随机
      listState: this.$store.state.listState,
      // 当纯音乐无歌词时显示
      noLrc: false
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
  mounted () {
    /**
     * CD 旋转思路:
     * 1.页面加载后调用旋转方法，因为第一次进入页面时，dom还未创建，所以在 mounted 中调用
     * 2.播放暂停后调用旋转方法，用来在播放页控制旋转
     * 3.进入播放页后调用旋转方法，用于在外面改变了播放状态，进入后要调用旋转方法
     */
    this.changeCD()
  },
  // 监听 vuex 的变化
  computed: {
    // 监听歌曲 id
    getStoreId () {
      return this.$store.state.musicId
    },
    // 监听歌曲已播放时间
    getMusicPlayTime () {
      return this.$store.state.musicTime
    },
    // 监听播放状态
    getPlayFlag () {
      return this.$store.state.playFlag
    },
    // 监听列表状态
    getListState () {
      return this.$store.state.listState
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
        // 第三行歌词
        const newTime = parseInt(time) + 1
        for (let i = 0; i < 60; i++) {
          if (this.lrc[newTime + i] !== undefined && this.lrc[newTime + i] !== '') {
            this.lastLrc = this.lrc[newTime + i]
            break
          }
        }
      }
    },
    getPlayFlag (flag) {
      this.flag = this.$store.state.playFlag
      // 调用cd旋转方法
      this.rotateImg(flag)
    },
    // 判断路由状态，如果到了播放页面，隐藏底部播放栏，如果没到不隐藏
    $route (to, from) {
      if (to.path.indexOf('/play') !== -1) {
        setTimeout(() => {
          // 调用cd旋转方法
          this.rotateImg(this.$store.state.playFlag)
        }, 100)
      }
    },
    getListState (newVal) {
      this.listState = newVal
    }
  },
  methods: {
    // 第一次进入时调用 cd 旋转
    changeCD () {
      setTimeout(() => {
        // 调用cd旋转方法
        this.rotateImg(this.$store.state.playFlag)
      }, 100)
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
          // 如果是纯音乐则无歌词
          if (res.data.lrc === undefined) {
            this.noLrc = true
          } else {
            const oldLrc = res.data.lrc.lyric
            this.lrc = this.parseLyric(oldLrc)
            this.noLrc = false
          }
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
    },
    // cd图片旋转
    rotateImg (flag) {
      if (flag === true) {
        const rotateImg = document.querySelector('#img')
        rotateImg.style.animationPlayState = "paused"
      } else {
        const rotateImg = document.querySelector('#img')
        rotateImg.style.animationPlayState = "running"
      }
    },
    // 打开列表
    openList () {
      this.$store.commit('changeListFlag', true)
    },
    // 上一曲
    prevMusic () {
      // 当处在随机播放状态时，上下曲都变成随机上下曲
      if (this.listState === 3) {
        // 获取歌曲列表总长度
        const length = this.musicList.length
        // 得到一个随机数
        const random = Math.floor(Math.random() * length)
        // 根据随机数取到新 id
        const newId = this.musicList[random].id
        this.$store.commit('changeMusicId', newId)
        this.$store.commit('changeIndex', random)
      } else {
        // 根据当前索引查找列表找出上一曲
        if (this.index <= 0) {
          Toast({
            message: '已经到头了',
            position: 'bottom',
            duration: 2000
          })
        } else {
          // 新的索引
          const newIndex = (this.index - 1)
          // 歌曲 id
          const newId = this.musicList[newIndex].id
          this.$store.commit('changeMusicId', newId)
          this.$store.commit('changeIndex', newIndex)
        }
      }
    },
    // 下一曲
    nextMusic () {
      // 当处在随机播放状态时，上下曲都变成随机上下曲
      if (this.listState === 3) {
        // 获取歌曲列表总长度
        const length = this.musicList.length
        // 得到一个随机数
        const random = Math.floor(Math.random() * length)
        // 根据随机数取到新 id
        const newId = this.musicList[random].id
        this.$store.commit('changeMusicId', newId)
        this.$store.commit('changeIndex', random)
      } else {
        // 根据当前索引查找列表找出下一曲
        if (this.index > this.musicList.length) {
          Toast({
            message: '已经到底了',
            position: 'bottom',
            duration: 2000
          })
        } else {
          // 新的索引
          const newIndex = (this.index + 1)
          // 歌曲 id
          const newId = this.musicList[newIndex].id
          this.$store.commit('changeMusicId', newId)
          this.$store.commit('changeIndex', newIndex)
        }
      }
    },
    // 改变列表播放状态
    changeListState () {
      // 列表播放状态
      let listState = this.$store.state.listState
      if (listState === 1) {
        Toast({
          message: '单曲循环',
          position: 'bottom',
          duration: 1500
        })
        this.$store.commit('changeListState', listState + 1)
      } else if (listState === 2) {
        Toast({
          message: '随机播放',
          position: 'bottom',
          duration: 1500
        })
        this.$store.commit('changeListState', listState + 1)
      } else {
        Toast({
          message: '列表循环',
          position: 'bottom',
          duration: 1500
        })
        this.$store.commit('changeListState', 1)
      }
    },
    // 改变进度条进度
    changeProgresBar (e) {
      const audio = document.querySelector('#audio')
      const progres = document.querySelector('#progres')
      // 进度条据左边距离
      let leftWidth = progres.offsetLeft
      // 进度条总长度
      const width = progres.offsetWidth
      // 点击位置距左边距离
      const clientX = e.clientX
      // 点击位置和总进度比率
      const ratio = (clientX - leftWidth) / width
      // 比率对应播放时间
      const currentTime = Math.floor(this.music.dt * ratio / 1000)
      audio.currentTime = currentTime
    }
  },
  filters: {
    // 使用过滤器将毫秒转换成分钟
    dateFormat: function (val) {
      const minute = parseInt(val / 1000 / 60)
      const second = parseInt(val % 60000 / 1000) < 10 ? '0' + parseInt(val % 60000 / 1000) : parseInt(val % 60000 / 1000)
      return minute + ':' + second
    },
    currentFormat: function (val) {
      const minute = parseInt(val / 60)
      const second = parseInt(val % 60) < 10 ? '0' + parseInt(val % 60) : parseInt(val % 60)
      return minute + ':' + second
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
      background:hsla(0,0%,0%,.8) border-box;
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
          animation: rotate 25s linear infinite;
          animation-play-state:paused;/*暂停动画*/
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
  @keyframes rotate{
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
