<template>
  <div class="topBar-container">
    <div class="topBar d-flex ai-center text-black">
      <div @click="goBack" class="goBack d-flex ai-center jc-center"><i class="iconfont icon-fanhuipt fs-xxl"></i></div>
      <div class="name fs-xl">歌单</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    // 返回
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .topBar-container{
    width: 100%;
    height: 50px;
    padding: 5px 0;
    position: fixed;
    top: 0;
    z-index: 999;
    .goBack{
      width: 40px;
      height: 40px;
      .icon-fanhuipt{
        font-size: 26px;
      }
    }
  }
</style>
