<template>
  <div class="play-container">
    <top-bar :title="music.name" :name="music.ar[0].name"></top-bar>
    <img class="bg" :src="music.al.picUrl" alt="">
  </div>
</template>

<script>
import topBar from '../components/TopBar'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      music: {},
      musicList: [],
      index: null
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
    }
  },
  watch: {
    getStoreId (newVal) {
      this.getMusicDetail(newVal)
      this.getMusicList()
      this.getMusicIndex()
      this.getMusicLyric()
    }
  },
  methods: {
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
          console.log(res.data.lrc)
        }
      })
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
  }
</style>
