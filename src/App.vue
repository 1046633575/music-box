<template>
  <div id="app">
    <div class="main">
      <keep-alive exclude="songList,kong">
        <router-view></router-view>
      </keep-alive>
      <router-view name="link"></router-view>
      <!--底部播放栏-->
      <Footer ref="footer"></Footer>
    </div>
  </div>
</template>

<script>
import Footer from './components/FooterPlay'
export default {
  data () {
    return {
      music: {},
      musicUrl: ''
    }
  },
  components: {
    Footer: Footer
  },
  created () {
  },
  methods: {
  },
  computed: {
    getListFlag () {
      return this.$store.state.listFlag
    }
  },
  watch: {
    // 监听到 flag ，发生变化后通过 refs 打开列表
    getListFlag (newVal) {
      if (newVal) {
        this.$store.commit('changeListFlag', false)
        this.$refs.footer.openList()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "assets/scss/variables.scss";
  #app{
    width: 100%;
    height: 100%;
    min-width: 320px;
    max-width: 640px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,.3);
    position: relative;
    margin: 0 auto;
    overflow: hidden;
    .main{
      width: 100%;
      height: 100%;
      overflow: scroll;
    }
  }
</style>
