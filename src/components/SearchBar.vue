<template>
  <div class="container w-100 ">
    <div class="d-flex jc-between">
      <header @click="goToSearch" class="w-100 d-flex ai-center bg-grey-2 pl-3 b-radius-6">
        <i class="iconfont icon-sousuo"></i>
        <input class="flex-1 h-100 bg-grey-2 b-radius-6" type="text" placeholder="请输入歌手或歌曲">
      </header>
      <div class="collection d-flex jc-center ai-center b-radius-3 fs-sm text-center" @click="goToCollection">我的<br/>收藏</div>
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
    goToSearch () {
      this.$router.push({ path: '/search' })
    },
    goToCollection () {
      this.$router.push({ path: '/collection' })
    }
  }
}
</script>

<style scoped lang="scss">
  .container{
    height: 50px;
    padding: 5px 0;
    header{
      width: 89%;
      height: 40px;
      i{
        font-size: 26px;
      }
    }
    .collection{
      width: 10%;
      height: 40px;
      background-color: #ccc;
    }
  }
</style>
