<template>
  <div class="songList-container">
    <!--顶部返回栏-->
    <top-bar :title="title" :flag="false"></top-bar>
    <div class="content text-black d-flex flex-column">
      <div class="fixed">
        <!--背景-->
        <img class="bg" src="../assets/image/collection.png" alt="">
        <div class="dv"></div>
        <div class="top d-flex jc-between fs-xl">
          <div class="img">
            <img class="w-100 h-100 b-radius-3" src="../assets/image/collection.png" alt="">
          </div>
          <div class="title">我的收藏</div>
        </div>
        <div class="center fs-lg d-flex ai-center">
          <div @click="changeVuex(collectionList[0].id,0)" class="d-flex ai-center">
            <i class="iconfont icon-bofang" style="font-size: 24px;"></i>
            <span class="pl-3">播放全部(共{{collectionList.length}}首)</span>
          </div>
        </div>
      </div>

      <div class="bottom-fa flex-1">
        <div class="bottom">
          <div class="list pt-3">
            <div class="list-item d-flex ai-center text-black mb-3" v-for="(item, i) in collectionList" :key="item.id">
              <div class="left">{{i+1}}</div>
              <div @click="changeVuex(item.id,i)" class="center h-100 d-flex ai-center jc-between">
                <div class="first w-100 h-100 d-flex flex-column jc-around ">
                  <div class="name w-100 text-ellipsis-1">{{item.name}}</div>
                  <div class="author w-100 fs-xs text-grey-3 text-ellipsis-1">{{item.ar[0].name}}</div>
                </div>
              </div>
              <div class="second" @click="deleteMusic(i)"><i class="iconfont icon--close" style="font-size: 24px;"></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topBar from '../components/TopBar'
export default {
  name: 'songList',
  data () {
    return {
      collectionList: [],
      title: '歌曲列表'
    }
  },
  components: {
    topBar
  },
  created () {
    this.getCollectionList()
  },
  methods: {
    // 用户点击了列表中的歌曲，在 vuex 中改变 播放歌曲列表及索引,id
    changeVuex (id, i) {
      this.$store.commit('changeMusicId', id)
      this.$store.commit('changeIndex', i)
      this.$store.commit('changeMusicList', this.collectionList)
      this.$store.commit('changeAuthorFlag', true)
    },
    // 获取收藏列表
    getCollectionList () {
      this.collectionList = JSON.parse(localStorage.getItem('collectionList'))
    },
    // 删除收藏
    deleteMusic (i) {
      this.collectionList.splice(i, 1)
      // 同步 localStorage
      localStorage.setItem('collectionList', JSON.stringify(this.collectionList))
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
    .iconfont.active{
      color: #E20000;
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
        background-color: #fff;
      }
      .bottom{
        position: relative;
        z-index: 9;
        /*top: 165px;*/
        left: 0;
        padding: 0 10px;
        background-color: #fff;
        min-height: 100%;
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

