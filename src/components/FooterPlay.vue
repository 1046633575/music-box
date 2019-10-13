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
      <div class="list-content d-flex flex-column">
        <div class="box"></div>
        <div class="box2 flex-1 d-flex flex-column">
          <div class="top d-flex ai-center jc-between fs-md mb-3">
            <div class="left d-flex ai-center" @click="changeListState">
              <div class="d-flex ai-center" v-show="listState === 1">
                <i class="iconfont icon-xunhuanbofang" style="font-size: 16px;"></i>&nbsp;列表循环
              </div>
              <div class="d-flex ai-center" v-show="listState === 2">
                <i class="iconfont icon-danquxunhuan" style="font-size: 16px;"></i>&nbsp;单曲循环
              </div>
              <div class="d-flex ai-center" v-show="listState === 3">
                <i class="iconfont icon-suijibofang" style="font-size: 16px;"></i>&nbsp;随机播放
              </div>
            </div>
            <div @click="closeList" class="right d-flex ai-center jc-end">
              <i class="iconfont icon-guanbi" style="font-size: 16px;"></i>&nbsp;关闭
            </div>
          </div>
          <div class="bottom flex-1">
            <div class="bottom-list">
              <div class="list-item d-flex ai-center text-black mb-3" :class="$store.state.index === i ? 'active' : ''" v-for="(item, i) in musicList" :key="item.id">
                <div class="left">{{i+1}}</div>
                <div class="center h-100 d-flex ai-center jc-between pr-4">
                  <div @click="changeVuex(item.id,i)" class="first w-100 h-100 d-flex flex-column jc-around ">
                    <div class="name w-100 text-ellipsis-1">{{item.name}}</div>
                    <div class="author w-100 fs-xs text-grey-3 text-ellipsis-1">{{authorFlag ? item.ar[0].name : item.artists[0].name}}</div>
                  </div>
                </div>
                <div class="second h-100 d-flex jc-center ai-center" @click="deleteListMusic(i)"><i class="iconfont icon--close" style="font-size: 16px; color: #979797;"></i></div>
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
      index: this.$store.state.index,
      musicId: this.$store.state.musicId,
      listState: this.$store.state.listState,
      // 播放按钮的切换
      startFlag: false,
      musicList: this.$store.state.musicList,
      // 控制遮挡背景的显示与隐藏
      musicListFlag: false,
      // 控制底部播放栏的显示与隐藏
      footerFlag: true,
      // 控制底部列表显示歌手名称
      authorFlag: this.$store.state.authorFlag,
      // 歌曲是否播放完
      onEnd: false
    }
  },
  created () {
    this.getMusicDetail(this.$store.state.musicId)
    this.getMusicUrl(this.$store.state.musicId)
    this.pause()
    this.getRoutePath()
    this.getMusicPlayTime()
  },
  mounted () {
    this.listenerMusicState()
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
    },
    getAuthorFlag () {
      return this.$store.state.authorFlag
    },
    getListState () {
      return this.$store.state.listState
    },
    getMusicList () {
      return this.$store.state.musicList
    }
  },
  watch: {
    getStoreId (newVal) {
      this.startFlag = true
      this.getMusicDetail(newVal)
      this.getMusicUrl(newVal)
      this.getMusicIndex()
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
    },
    getAuthorFlag (newVal) {
      this.authorFlag = newVal
    },
    getListState (newVal) {
      this.listState = newVal
    },
    getMusicList (newVal) {
      this.musicList = newVal
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
    getMusicIndex () {
      this.index = this.$store.state.index
    },
    // 跳转至音乐播放页
    goToPlay () {
      this.$router.push({ path: 'play' })
    },
    // 获取当前路由，判断如果是 /play 就隐藏底部播放栏
    getRoutePath () {
      // 判断路由状态，如果到了播放页面，隐藏底部播放栏，如果没到不隐藏
      if (this.$route.path.indexOf('/play') !== -1) {
        this.$store.commit('changeFooterFlag', false)
      } else {
        this.$store.commit('changeFooterFlag', true)
      }
    },
    // 用户点击了列表中的歌曲，在 vuex 中改变 播放歌曲列表及索引,id
    changeVuex (id, i) {
      this.$store.commit('changeMusicId', id)
      this.$store.commit('changeIndex', i)
      // this.$store.commit('changeMusicList', this.musicList)
    },
    // 获取播放时间
    getMusicPlayTime () {
      setInterval(() => {
        this.$store.commit('changeMusicTime', document.querySelector('#audio').currentTime)
      }, 1000)
    },
    // 监听歌曲是否播放完毕
    listenerMusicState () {
      setTimeout(() => {
        document.querySelector('#audio').onended = () => {
          // 获取列表状态
          const listState = this.$store.state.listState
          if (listState === 1) {
            const newIndex = this.index + 1
            const newId = this.musicList[newIndex].id
            this.$store.commit('changeMusicId', newId)
            this.$store.commit('changeIndex', newIndex)
          } else if (listState === 2) {
            this.play()
          } else {
            // 获取歌曲列表总长度
            const length = this.musicList.length
            // 得到一个随机数
            const random = Math.floor(Math.random() * length)
            // 根据随机数取到新 id
            const newId = this.musicList[random].id
            this.$store.commit('changeMusicId', newId)
            this.$store.commit('changeIndex', random)
          }
        }
      }, 2000)
    },
    // 点击改变列表播放状态
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
    // 从列表中删除歌曲
    deleteListMusic (i) {
      // 从列表中删除此项
      this.musicList.splice(i, 1)
      // 同步 vuex
      this.$store.commit('changeMusicList', this.musicList)
      // 当删除的是当前播放的歌曲时
      if (i === this.index) {
        // 如果当前播放状态是随机播放，就需要随机，如果是其他的直接播放下一曲
        if (this.$store.state.listState === 3) {
          // 获取歌曲列表总长度
          const length = this.musicList.length
          // 得到一个随机数
          const random = Math.floor(Math.random() * length)
          // 根据随机数取到新 id
          const newId = this.musicList[random].id
          this.$store.commit('changeMusicId', newId)
          this.$store.commit('changeIndex', random)
        } else {
          if (i > this.musicList.length) {
            Toast({
              message: '已经到底了',
              position: 'bottom',
              duration: 2000
            })
          } else {
            // 歌曲 id
            const newId = this.musicList[i].id
            this.$store.commit('changeMusicId', newId)
            this.$store.commit('changeIndex', i)
          }
        }
      }
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
      max-width: 640px;
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
        .bottom-list{
          min-height: 300px;
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
  .active{
    color: #E20000;
    .author{
      color: #E20000;
    }
  }
</style>
