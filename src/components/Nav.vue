<template>
  <div class="nav-container">
    <Search-Bar></Search-Bar>
    <div class="link w-100 d-flex jc-between ai-center">
      <router-link to="/main" tag="div" class="text-grey-3 d-flex jc-center ai-center link-item recommend">推荐</router-link>
      <router-link to="/rank" tag="div" class="text-grey-3 d-flex jc-center ai-center link-item rank">排行榜</router-link>
    </div>
  </div>
</template>

<script>
import SearchBar from './SearchBar'
export default {
  data () {
    return {
    }
  },
  components: {
    SearchBar
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables';
  .nav-container{
    padding: 0 5px;
    .link{
      height: 40px;
      .link-item{
        width: 44%;
        height: 100%;
      }
    }
    .router-link-active{
      font-size: 18px;
      font-weight: bold;
      color: $border-color;
    }
  }
</style>
