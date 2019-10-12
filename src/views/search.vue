<template>
  <div class="search-container">
    <div class="w-100 d-flex ai-center jc-bewteen">
      <div class="back">
        <Top-Bar></Top-Bar>
      </div>
      <div class="searchBar">
        <header class="w-100 d-flex ai-center bg-grey-2 pl-3 b-radius-32" style="background-color: #f4f0f0">
          <i class="iconfont icon-sousuo"></i>
          <input v-model="key" class="flex-1 h-100 bg-grey-2 b-radius-32" style="background-color: #f4f0f0" autofocus type="text" placeholder="请输入歌手或歌曲">
        </header>
      </div>
    </div>
    <div class="list pt-3">
      <div class="list-item d-flex ai-center text-black mb-3" v-for="(item, i) in songList" :key="item.id">
        <div class="left">{{i+1}}</div>
        <div @click="changeVuex(item.id,i)" class="center h-100 d-flex ai-center jc-between">
          <div class="first w-100 h-100 d-flex flex-column jc-around ">
            <div class="name w-100 text-ellipsis-1">{{item.name}}</div>
            <div class="author w-100 fs-xs text-grey-3 text-ellipsis-1">{{item.artists[0].name}}</div>
          </div>
        </div>
        <div class="second"><i class="iconfont icon-xinxipt" style="font-size: 24px;"></i></div>
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
      songList: []
    }
  },
  components: {
    TopBar
  },
  watch: {
    key: function (newVal) {
      this.getSearch(newVal)
    }
  },
  methods: {
    // 获取搜索内容，函数节流
    getSearch (key) {
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
        }
      }
    }
    .list{
      width: 100%;
      height: 85%;
      -webkit-border-radius: 14px;
      -moz-border-radius: 14px;
      border-radius: 14px;
      overflow: scroll;
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
</style>
