<template>
  <div class="helper">
    <div class="menu_nav">
      <Menu />
    </div>
    <div class="main-content">

    </div>
  </div>
</template>

<script>
import Menu from "@c/helper/menu";
export default {
  name: 'helper',
  components:{
    Menu
  }
}
</script>

<style lang="less">
.home{
  display: flex;
  display: -webkit-flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  div{
    text-align: center;
    font-size: 20px;
  }
}
</style>
