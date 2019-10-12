<template>
  <div class="container">
    <h3>此页面用于刷新页面时的跳转</h3>
  </div>
</template>

<script>
export default {
  name: 'kong',
  created () {
    this.$router.replace({ path: 'songList', query: { id: this.$route.query.path } })
  }
}
</script>
