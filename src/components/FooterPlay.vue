<template>
  <div class="container">
    <footer v-show="footerFlag"  class="d-flex w-100 jc-between ai-center px-1">
      <audio id="audio" ref="audio" v-show="false" :src="musicUrl"></audio>
      <div @click="goToPlay" class="footer-left d-flex jc-center ai-center">
        <img :src="music.al.picUrl" alt="" class="b-radius-50">
      </div>
      <div @click="goToPlay" class="footer-center flex-1 d-flex flex-column jc-center">
          <div class="w-100 name fs-lg text-black text-ellipsis-1">{{music.name}}</div>
          <div class="w-100 author fs-md text-grey-4 text-ellipsis-1">{{music.ar[0].name}}</div>
        </div>
      <div class="footer-right d-flex jc-around ai-center">
        <div>
          <i @click="play" class="iconfont icon-bofang fs-xxl" v-show="flag"></i>
          <i @click="pause" class="iconfont icon-zanting fs-xxl" v-show="!flag"></i>
        </div>
        <div @click="openList">
          <i class="iconfont icon-caidan fs-xxl"></i>
        </div>
      </div>
    </footer>
    <div class="list d-flex flex-column" v-show="musicListFlag"></div>
    <tansition name="list-content">
      <div class="list-content">
        <div class="box"></div>
        <div class="box2 flex-1">
          <div class="top d-flex ai-center jc-between fs-lg mb-3">
            <div class="left d-flex ai-center">
              <div class="d-flex ai-center">
                <i class="iconfont icon-xunhuanbofang" style="font-size: 24px;"></i>列表循环
              </div>
            </div>
            <div @click="closeList" class="right d-flex ai-center jc-center">
              <i class="iconfont icon-guanbi" style="font-size: 24px;"></i>关闭
            </div>
          </div>
          <div class="bottom">
            <div class="bottom-list">
              <div class="list-item d-flex ai-center text-black mb-3" v-for="(item, i) in musicList.tracks" :key="item.id">
                <div class="left">{{i+1}}</div>
                <div class="center h-100 d-flex ai-center jc-between pr-4">
                  <div class="first w-100 h-100 d-flex flex-column jc-around ">
                    <div class="name w-100 text-ellipsis-1">{{item.name}}</div>
                    <div class="author w-100 fs-xs text-grey-3 text-ellipsis-1">{{item.ar[0].name}}</div>
                  </div>
                </div>
                <div class="second"><i class="iconfont icon-xinxipt" style="font-size: 24px;"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </tansition>
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
      // 播放按钮的切换
      startFlag: false,
      musicList: this.$store.state.musicList,
      // 控制遮挡背景的显示与隐藏
      musicListFlag: false,
      // 控制底部播放栏的显示与隐藏
      footerFlag: true
    }
  },
  created () {
    this.getMusicDetail(this.$store.state.musicId)
    this.getMusicUrl(this.$store.state.musicId)
    this.pause()
    this.getRoutePath()
    this.getMusicPlayTime()
  },
  // 监听 vuex 的变化
  computed: {
    getStoreId () {
      return this.$store.state.musicId
    },
    getFooterFlag () {
      return this.$store.state.footerFlag
    },
    getPlayFlag () {
      return this.$store.state.playFlag
    }
  },
  watch: {
    getStoreId (newVal) {
      this.startFlag = true
      this.getMusicDetail(newVal)
      this.getMusicUrl(newVal)
      this.getMusicList()
      // this.getMusicPlayTime()
    },
    getFooterFlag (newVal) {
      this.footerFlag = newVal
    },
    getPlayFlag (newVal) {
      this.flag = newVal
    },
    // 判断路由状态，如果到了播放页面，隐藏底部播放栏，如果没到不隐藏
    $route (to, from) {
      if (to.path.indexOf('/play') !== -1) {
        this.$store.commit('changeFooterFlag', false)
      } else {
        this.$store.commit('changeFooterFlag', true)
      }
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
    },
    // 显示列表
    openList () {
      this.musicListFlag = true
      document.querySelector('.list-content').style.top = 0
    },
    // 关闭列表
    closeList () {
      this.musicListFlag = false
      document.querySelector('.list-content').style.top = '100%'
    },
    // 获取列表数据
    getMusicList () {
      this.musicList = this.$store.state.musicList
    },
    // 跳转至音乐播放页
    goToPlay () {
      this.$router.push({ path: 'play' })
    },
    // 获取当前路由，判断如果是 /play 就隐藏底部播放栏
    getRoutePath () {
      console.log(this.$route.path)
      // 判断路由状态，如果到了播放页面，隐藏底部播放栏，如果没到不隐藏
      if (this.$route.path.indexOf('/play') !== -1) {
        this.$store.commit('changeFooterFlag', false)
        console.log(this.$store.state.footerFlag)
      } else {
        this.$store.commit('changeFooterFlag', true)
        console.log(this.$store.state.footerFlag)
      }
    },
    // 在vuex 中存入歌曲数据
    // 获取播放时间
    getMusicPlayTime () {
      setInterval(() => {
        this.$store.commit('changeMusicTime', document.querySelector('#audio').currentTime)
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
  /*.list-content-enter,*/
  /*.list-content-leave-to{*/
    /*.list-content{*/
      /*top: 0;*/
    /*}*/
  /*}*/
  /*.list-content-enter-active,*/
  /*.list-content-leave-active{*/
    /*transition: all 2s;*/
  /*}*/
  footer{
    width: 100%;
    max-width: 640px;
    height: 50px;
    position: fixed;
    bottom: 0;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,.6);
    /*border-top: 1px solid #ccc;*/
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
  .list{
    width: 100%;
    height: 100%;
    background:hsla(0,0%,0%,.7) border-box;
    position: fixed;
    bottom: 0;
    z-index: 1000;
  }
  .list-content{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 100%;
    transition: all 0.5s;
    overflow: hidden;
    .box{
      width: 100%;
      height: 166px;
    }
    .box2{
      width: 100%;
      position: fixed;
      z-index: 1000;
      background-color: #fff;
      -webkit-border-radius: 14px 14px 0 0 ;
      -moz-border-radius: 14px 14px 0 0 ;
      border-radius: 14px 14px 0 0 ;
      .top{
        width: 100%;
        height: 50px;
        padding: 0 10px;
        border-bottom: 1px solid #d2d2d2;
        .right{
          width: 30%;
          height: 100%;
        }
      }
      .bottom{
        height: 500px;
        overflow: scroll;
        padding-bottom: 50px;
        .bottom-list{
          min-height: 800px;
          .list-item{
            width: 100%;
            height: 50px;
            .left{
              width: 10%;
              text-align: center;
            }
            .center{
              width: 80%;
            }
            .second{
              width: 10%;
            }
          }
        }
      }
    }
  }
</style>
