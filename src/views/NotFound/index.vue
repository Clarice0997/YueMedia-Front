<template>
    <div class="not-found-container">
      <div class="img-container">
          <img src="@/assets/image/page_not_found.svg" alt="page not found">
      </div>
    </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style lang="less" scoped>
.not-found-container{
  width: 100%;
  height: 100%;

  .img-container{
    display: flex;
    align-items: center;
    justify-content: center;

    img{
      width: 40%;
      height: 25%;
    }
  }
}
</style>