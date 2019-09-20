import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 歌曲id
    musicId: 299264,
    // 歌曲在列表中的索引
    index: 0,
    // 歌曲列表
    musicList: [],
    // 歌曲播放状态
    playFlag: true,
    // 控制底部播放栏的显示
    footerFlag: true,
    // 歌曲当前播放时长
    musicTime: 0
  },
  mutations: {
    changeMusicId (state, id) {
      this.state.musicId = id
    },
    changeIndex (state, index) {
      this.state.index = index
    },
    changeMusicList (state, list) {
      this.state.musicList = list
    },
    changePlayFlag (state, flag) {
      this.state.playFlag = flag
    },
    changeFooterFlag (state, flag) {
      this.state.footerFlag = flag
    },
    changeMusicTime (state, num) {
      this.state.musicTime = num
    }
  }
})
