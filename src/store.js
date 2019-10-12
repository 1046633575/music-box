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
    musicTime: 0,
    // 控制底部列表显示歌手名称
    authorFlag: true,
    // 列表的显示与隐藏
    listFlag: false,
    // 列表播放状态，1：列表顺序 2：单曲循环 3：随机播放
    listState: 1
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
    },
    changeAuthorFlag (state, flag) {
      this.state.authorFlag = flag
    },
    changeListFlag (state, flag) {
      this.state.listFlag = flag
    },
    changeListState (state, num) {
      this.state.listState = num
    }
  }
})
