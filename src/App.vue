<template>
  <div id="app">
    <router-view></router-view>
    <!--底部播放栏-->
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from './components/FooterPlay'
export default {
  data () {
    return {
    }
  },
  components: {
    Footer: Footer
  }
}
</script>

<style lang="scss">
  @import "assets/scss/variables.scss";
  #app{
    width: 100%;
    min-width: 320px;
    max-width: 640px;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,.3);
    position: relative;
  }
</style>
