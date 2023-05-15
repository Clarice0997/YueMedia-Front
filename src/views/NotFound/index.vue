<template>
  <div class="not-found-container">
    <div class="img-container">
      <img src="@/assets/image/page_not_found.svg" alt="page not found" @click="clickRouteHome" />
      <h1>哎呀！这个页面出了一点问题</h1>
      <h2>你可以返回<span @click="clickRouteHome">首页</span>探索更多精彩内容</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    clickRouteHome() {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="less" scoped>
.not-found-container {
  width: 100%;
  height: 100%;

  .img-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    img {
      width: 40%;
      height: 30%;
      cursor: pointer;
    }

    h1 {
      font-size: 2em;
      color: #a3a7b0;
      margin: 10px;
    }

    h2 {
      font-size: 1.2em;
      color: #a3a7b0;

      span {
        color: #75cafe;
        text-decoration: underline #75cafe 2px solid;
        cursor: pointer;
      }
    }
  }
}
</style>
