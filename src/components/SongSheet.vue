<template>
  <div class="songSheetContainer pt-3" id="song">
    <!--顶部文字与选择框-->
    <div class="d-flex jc-between ai-center pb-3 px-2">
      <h3 >推荐歌单</h3>
      <div>
        <select>
          <option>全部</option>
          <option>热门</option>
          <option>华语</option>
        </select>
      </div>
    </div>
    <!--歌单列表-->
    <div class="list d-flex flex-wrap jc-between px-2" style="min-height: 1500px;" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <div @click="goToSongList(item.id)" class="list-item pb-3 " v-for="item in songSheetList" :key="item.id">
        <div class="img w-100">
          <img class="w-100 b-radius-3" v-lazy.song="item.coverImgUrl" alt="">
        </div>
        <div class="w-100 text-black text-ellipsis-2">{{item.name}}</div>
      </div>
      <div v-show="loadingFlag" class="w-100 d-flex jc-center ai-center fs-lg text-black" style="height: 50px;"><img class="h-100" src="http://img10.cache.hxsd.com/news/2015/11/12/691442_1447295058_5.gif" alt="">加载中...</div>
      <div v-show="!loadingFlag" class="w-100 d-flex jc-center ai-center fs-lg text-black" style="height: 50px;"><img class="h-100" src="http://img10.cache.hxsd.com/news/2015/11/12/691442_1447295058_5.gif" alt="">已经到底了</div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      // 获取到的歌单列表
      songSheetList: [],
      // 默认歌单分类
      type: '全部',
      // 一次获取多少个歌单
      limit: 30,
      // 正在获取状态
      loading: false,
      // 是否正在加载
      loadingFlag: false
    }
  },
  created () {
    this.getSongSheet()
  },
  methods: {
    // 获取对应歌单
    getSongSheet () {
      this.$http.get('/top/playlist/highquality?limit=' + this.limit + '&cat=' + this.type).then(res => {
        if (res.data.code === 200) {
          this.songSheetList = res.data.playlists
        }
      }).catch(() => {
        Toast({
          message: '歌单获取失败',
          position: 'bottom',
          duration: 5000
        })
      })
    },
    // 加载更多
    loadMore () {
      this.loadingFlag = true
      this.loading = true
      this.$http.get('/top/playlist/highquality?limit=100&cat=' + this.type).then(res => {
        if (res.data.code === 200) {
          setTimeout(() => {
            let list = res.data.playlists
            list.splice(0, 30)
            for (let i in list) {
              this.songSheetList.push(list[i])
            }
            this.loadingFlag = false
          }, 1500)
        }
      }).catch(() => {
        Toast({
          message: '加载更多失败',
          position: 'bottom',
          duration: 5000
        })
      })
    },
    // 选择歌单分类
    checkSongSheet () {
      this.sheetVisible = true
    },
    // 跳转到歌曲列表页
    goToSongList (id) {
      console.log(id)
      this.$router.push({ path: '/songList', query: { id: id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.moreSheet{
  width: 80px;
  height: 26px;
  border: 1px solid #ccc;
}
.list-item{
  width: 30%;
}
</style>
