<template>
  <div class="doc_wrap">
    <div class="nav">
      <menuTree />
    </div>
    <div class="doc_content">
      <docContent />
    </div>
  </div>
</template>

<script>
import menuTree from "@/components/doc/menuTree";
import docContent from "@/components/doc/docContent";
export default {
  name: 'Doc',
  components:{
    menuTree,
    docContent
  }
}
</script>

<style lang="less" scoped>
.flexBox(@mainAis,@subAis,@direction:'row'){
  display: flex;
  display: -webkit-flex;
  flex-direction: @direction;
  justify-content:@mainAis;
  align-items:@subAis;
}
.doc_wrap{
  width: 100%;
  .flexBox(space-between,flex-start, row);
  .nav{
    width: 20%;
    min-width: 250px;
    height: 100vh;
    background:#f5deb3;
  }
  
}
</style>
