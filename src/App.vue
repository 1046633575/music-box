<template>
  <div id="app">
    <router-view></router-view>
    <router-view name="link"></router-view>
    <!--底部播放栏-->
    <Footer ref="footer"></Footer>
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
  methods: {
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
  }
</style>
