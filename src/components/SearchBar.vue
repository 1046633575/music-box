<template>
  <div class="container w-100 ">
    <header class="w-100 d-flex ai-center bg-grey-2 pl-3 b-radius-6">
      <i class="iconfont icon-sousuo"></i>
      <input class="flex-1 h-100 bg-grey-2 b-radius-6" type="text" placeholder="请输入歌手或歌曲">
    </header>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
  .container{
    height: 50px;
    padding: 5px 0;
    header{
      height: 40px;
      i{
        font-size: 26px;
      }
    }
  }
</style>
