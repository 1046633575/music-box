<template>
  <div class="songList-container">
    <!--顶部返回栏-->
    <top-bar :title="title" :flag="false"></top-bar>
    <div class="content text-black d-flex flex-column">
      <div class="fixed">
        <!--背景-->
        <img class="bg" :src="playList.coverImgUrl" alt="">
        <div class="dv"></div>
        <div class="top d-flex jc-between fs-xl">
          <div class="img">
            <img class="w-100 h-100 b-radius-3" :src="playList.coverImgUrl" alt="">
          </div>
          <div class="title">{{playList.name}}</div>
        </div>
        <div class="center fs-lg d-flex ai-center">
          <div @click="changeVuex(playList.tracks[0].id,0)" class="d-flex ai-center">
            <i class="iconfont icon-bofang" style="font-size: 24px;"></i>
            <span class="pl-3">播放全部(共{{playList.tracks.length}}首)</span>
          </div>
        </div>
      </div>

      <div class="bottom-fa flex-1">
        <div class="bottom">
          <div class="list pt-3">
            <div class="list-item d-flex ai-center text-black mb-3" v-for="(item, i) in musicList" :key="item.id">
              <div class="left">{{i+1}}</div>
              <div @click="changeVuex(item.id,i)" class="center h-100 d-flex ai-center jc-between">
                <div class="first w-100 h-100 d-flex flex-column jc-around ">
                  <div class="name w-100 text-ellipsis-1">{{item.name}}</div>
                  <div class="author w-100 fs-xs text-grey-3 text-ellipsis-1">{{item.ar[0].name}}</div>
                </div>
              </div>
              <div class="second" @click="openMenu(i)"><i class="iconfont icon-xinxipt" style="font-size: 24px;"></i></div>
            </div>
          </div>
        </div>
      </div>
      <mt-actionsheet
        :actions="actions"
        v-model="flag">
      </mt-actionsheet>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import topBar from '../components/TopBar'
export default {
  name: 'songList',
  data () {
    return {
      // 控制菜单的显示与隐藏
      flag: false,
      playList: [],
      musicList: [],
      title: '歌曲列表',
      // 菜单项配置
      actions: [
        {
          name: '下一曲播放',
          method: this.nextMusic
        },
        {
          name: '收藏',
          method: this.collection
        }
      ],
      index: 0
    }
  },
  components: {
    topBar
  },
  created () {
    this.getSongSheetDetail(this.$route.query.id)
  },
  computed: {
    getMusicList () {
      return this.$store.state.musicList
    }
  },
  watch: {
    getMusicList (newVal) {
      this.musicList = newVal
    }
  },
  methods: {
    // 获取歌单详情
    getSongSheetDetail (id) {
      this.$http.get('/playlist/detail?id=' + id).then(res => {
        if (res.data.code === 200) {
          this.playList = res.data.playlist
          this.musicList = res.data.playlist.tracks
        }
      }).catch(() => {
        Toast({
          message: '数据获取失败',
          position: 'bottom',
          duration: 5000
        })
      })
    },
    // 用户点击了列表中的歌曲，在 vuex 中改变 播放歌曲列表及索引,id
    changeVuex (id, i) {
      this.$store.commit('changeMusicId', id)
      this.$store.commit('changeIndex', i)
      this.$store.commit('changeMusicList', this.musicList)
      this.$store.commit('changeAuthorFlag', true)
    },
    // 打开菜单
    openMenu (i) {
      this.flag = true
      this.index = i
    },
    // 下一曲播放
    /**
     * 1.调整列表，把当前点击的歌曲移动到正在播放的歌曲后面
     * 2.vuex 中创建布尔值默认 false
     * 3.歌曲播放完后如果 vuex 中布尔值为 true，直接播放列表中的下一曲，播放后将 vuex 中布尔值改为 false
     */
    nextMusic () {
      // 获取当前播放歌曲索引
      const index = this.$store.state.index
      // 获取歌曲列表
      let musicList = this.$store.state.musicList
      // 要移动的歌曲索引
      const i = this.index
      // 要移动的歌曲项
      const music = musicList[i]
      // 删除歌曲项
      musicList.splice(i, 1)
      if (i > index) {
        // 添加到当前播放处
        musicList.splice(index + 1, 0, music)
      } else {
        musicList.splice(index, 0, music)
        // 同步index
        this.$store.commit('changeIndex', index - 1)
      }
      // 同步 vuex
      this.$store.commit('changeMusicList', musicList)
      this.$store.commit('changeNextMusicFlag', true)
    },
    collection () {
      console.log('收藏成功')
    }
  }
}
</script>

<style lang="scss" scoped>
  .songList-container{
    width: 100%;
    height: 100%;
    .bg{
      width: 100%;
      height: 165px;
      filter:blur(150px);
      -webkit-filter:blur(150px);
      -moz-filter:blur(150px);
      -ms-filter:blur(150px);
      -o-filter:blur(150px);
      position: absolute;
      top: 0;
    }
    .content{
      width: 100%;
      height: 100%;
      /*padding-top: 50px;*/
      position: absolute;
      top: 0;
      left: 0;
      /*background:hsla(0,0%,100%,.4) border-box;*/
      .fixed{
        position: relative;
        z-index: 9;
        padding-top: 50px;
      }
      .top{
        width: 100%;
        height: 100px;
        padding: 0 10px;
        margin-bottom: 15px;
        .img{
          width: 100px;
          height: 100px;
        }
        .title{
          width: 65%;
          font-weight: 600;
        }
      }
      .center{
        width: 100%;
        height: 50px;
        background-color: #fff;
        padding: 0 10px;
        -webkit-border-radius: 14px 14px 0 0 ;
        -moz-border-radius: 14px 14px 0 0 ;
        border-radius: 14px 14px 0 0 ;
        position: relative;
        z-index: 10;
      }
      .bottom-fa{
        height: 500px;
        overflow: scroll;
        padding-bottom: 50px;
      }
      .bottom{
        position: relative;
        z-index: 9;
        /*top: 165px;*/
        left: 0;
        padding: 0 10px;
        background-color: #fff;
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
</style>
