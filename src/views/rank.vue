<template>
  <div class="rank-container px-3 pb-5">
    <!--官方榜-->
    <h3 class="py-3">官方榜</h3>
    <div class="official-list w-100">
      <div @click="goRankList(item.id)" class="list-item w-100 d-flex py-2" v-for="item in rankList" :key="item.id">
        <div class="img">
          <img class="list-item-img b-radius-6" v-lazy="item.coverImgUrl" alt="">
        </div>
        <div class="item-right over-hidden pl-3 py-1 d-flex flex-column jc-between">
          <p class="text-black text-ellipsis-1" v-for="(song,i) in item.tracks" :key="i">{{song.first}} - {{song.second}}</p>
        </div>
      </div>
    </div>
    <!--推荐榜-->
    <h3 class="py-3">推荐榜</h3>
    <div class="recommend-list d-flex flex-wrap jc-between">
      <div @click="goRankList(item.id)" class="list-item pb-3 " v-for="item in rankList2" :key="item.id">
        <div class="img w-100">
          <img class="w-100 b-radius-6" v-lazy.song="item.coverImgUrl" alt="">
        </div>
        <div class="w-100 text-black text-ellipsis-2">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      // 官方榜
      rankList: [],
      // 推荐榜
      rankList2: []
    }
  },
  created () {
    this.getRankList()
  },
  methods: {
    // 获取排行榜
    getRankList () {
      this.$http.get('/toplist/detail').then(res => {
        if (res.data.code === 200) {
          this.rankList = res.data.list.slice(0, 4)
          this.rankList2 = res.data.list.slice(4)
        }
      }).catch(() => {
        Toast({
          message: '榜单获取失败',
          position: 'bottom',
          duration: 5000
        })
      })
    },
    // 跳转至榜单列表
    goRankList (id) {
      this.$router.push({ path: '/songList', query: { id: id } })
    }
  }
}
</script>

<style lang="scss" scoped>
  .rank-container{
    min-height: 800px;
    background-color: #fff;
    .img{
      width: 100px;
      height: 100px;
      .list-item-img{
        width: 100%;
        height: 100%;
      }
    }
    .item-right{
      width: 75%;
    }
    .recommend-list{
      .list-item{
        width: 30%;
      }
    }
  }
</style>
