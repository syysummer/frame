<template>
  <div class="no-data-tip">
    <img src="@/assets/img/no_data.png" alt="">
    暂无数据
  </div>
</template>
<script>
  export default {
  }
</script>
<style lang="less" scoped>
.no-data-tip{
  width: 100%;
  color: #FFF;
  opacity: .4;
  text-align: center;
  margin-top: 4%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  img{
    width: 140px;
    height: 140px;
  }
}
</style>
