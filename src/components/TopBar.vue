<template>
  <div class="topBar-container">
    <div class="topBar d-flex ai-center" :class="flag ? 'text-white' : 'text-black'">
      <div @click="goBack" class="goBack d-flex ai-center jc-center"><i class="iconfont icon-fanhuipt fs-xxl"></i></div>
      <div class="title d-flex ai-center flex-column">
        <div class="name fs-lg w-100 text-ellipsis-1">{{title}}</div>
        <div class="fs-sm text-grey-1 w-100 text-ellipsis-1">{{name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    name: String,
    flag: Boolean
  },
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
    .title{
      width: 85%;
      position: relative;
      z-index: 999;
    }
  }
</style>
