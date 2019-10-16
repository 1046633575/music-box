<template>
  <div class="search-container">
    <div class="w-100 d-flex ai-center jc-bewteen">
      <div class="back">
        <Top-Bar></Top-Bar>
      </div>
      <div class="searchBar">
        <header class="w-100 d-flex ai-center bg-grey-2 pl-3 b-radius-32" style="background-color: #f4f0f0">
          <i class="iconfont icon-sousuo"></i>
          <input v-model="key" v-autofocus class="flex-1 h-100 bg-grey-2 b-radius-32" style="background-color: #f4f0f0" autofocus type="text" placeholder="请输入歌手或歌曲">
          <i class="iconfont icon--close" @click="clearInput" v-show="!hotListFlag"></i>
        </header>
      </div>
    </div>
    <!--热搜列表-->
    <div class="hotList pt-3" v-show="hotListFlag">
      <div class="first w-100 ">
        <div class="name w-100 text-ellipsis-1 fs-lg pt-1 pb-3 pl-3">热门搜索</div>
      </div>
      <div class="list-item d-flex ai-center text-black mb-3" v-for="item in hotList" :key="item.id">
        <div @click="hotSearch(item.first)" class="center h-100 d-flex ai-center jc-between">
          <div class="first w-100 h-100 d-flex flex-column jc-around pl-3">
            <div class="name w-100 text-ellipsis-1">{{item.first}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--搜索到的列表-->
    <div class="list pt-3" v-show="!hotListFlag">
      <div class="list-item d-flex ai-center text-black mb-3" v-for="(item, i) in songList" :key="item.id">
        <div class="left">{{i+1}}</div>
        <div @click="changeVuex(item.id,i)" class="center h-100 d-flex ai-center">
          <div class="name text-ellipsis-1">{{item.name}}</div>
          <div class="author fs-xs text-grey-3 text-ellipsis-1"> -- {{item.artists[0].name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
export default {
  data () {
    return {
      key: '',
      time: null,
      // 搜索到的歌曲列表
      songList: [],
      // 热搜列表
      hotList: [],
      // 热搜列表的显示与隐藏
      hotListFlag: true
    }
  },
  // 自定义指令
  directives: {
    // 自动选中指令
    'autofocus': {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  components: {
    TopBar
  },
  created () {
    this.getHotList()
  },
  watch: {
    key: function (newVal) {
      this.getSearch(newVal)
    }
  },
  methods: {
    // 获取搜索内容，函数节流
    getSearch (key) {
      if (key === '') {
        this.hotListFlag = true
      } else {
        this.hotListFlag = false
      }
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.$http.get('/search?keywords=%20' + key).then(res => {
          if (res.data.code === 200) {
            this.songList = res.data.result.songs
          }
        })
      }, 500)
    },
    // 用户点击了列表中的歌曲，在 vuex 中改变 播放歌曲列表及索引,id
    changeVuex (id, i) {
      this.$store.commit('changeMusicId', id)
      this.$store.commit('changeIndex', i)
      this.$store.commit('changeMusicList', this.songList)
      this.$store.commit('changeAuthorFlag', false)
    },
    // 获取热门搜索列表
    getHotList () {
      this.$http.get('/search/hot').then(res => {
        if (res.data.code === 200) {
          this.hotList = res.data.result.hots
        }
      })
    },
    // 搜索热门歌曲
    hotSearch (key) {
      this.key = key
    },
    // 清空搜索框
    clearInput () {
      this.key = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-container{
    width: 100%;
    height: 100%;
    padding: 0 5px;
    .back{
      width: 10%;
      height: 100%;
    }
    .searchBar{
      width: 90%;
      height: 100%;
      position: relative;
      top: 0;
      z-index: 999;
      padding: 5px 0;
      header{
        height: 40px;
        i{
          font-size: 26px;
          &.icon--close{
            font-size: 16px;
            margin-right: 10px;
          }
        }
      }
    }
    .hotList{
      width: 100%;
      height: 85%;
      overflow: scroll;
      .list-item{
        width: 100%;
        height: 35px;
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
    .list{
      width: 100%;
      height: 85%;
      overflow: scroll;
      .list-item{
        width: 100%;
        height: 50px;
        .left{
          width: 10%;
          text-align: center;
        }
        .center{
          width: 90%;
        }
      }
    }
  }
</style>
