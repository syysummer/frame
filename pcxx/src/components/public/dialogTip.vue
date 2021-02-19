<template>
  <div class="dialog_tip_page">
   <div class="centent_wrap">
     <div class="content">
       <div v-if="needIcon" class="tip_icon">!</div>
       <div class="text">{{content}}</div>
     </div>
     <div class="know_btn" @click="closeDialog">知道了</div>
   </div>
  </div>
</template>
<script>
  export default {
    props: ['content', 'needIcon'],
    data(){
      return {
      }
    },
    methods: {
     closeDialog(){
       this.$emit('closeDialog');
     }
    }
  }
</script>
<style lang="less" scoped>
.dialog_tip_page{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  z-index: 100;
  .centent_wrap{
    width: 580px;
    padding: 30px;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    background: #2F313C;
    .content{
      display: flex;
      display: -webkit-flex;
      justify-content:center;
      align-content:flex-start;
      border-radius: 1px;
      .tip_icon{
        width: 20px;
        height: 20px;
        background: #A9AEB8;
        border-radius: 50%;
        color: #2F313C;
        text-align: center;
        margin-right: 8px;
        font-size: 16px;
        margin-top: 2px;
      }
      .text{
        width: 90%;
        font-size: 16px;
        color: #FFFFFF;
      }
    }
    .know_btn{
      width: 360px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #A9AEB8;;
      border: 1px solid #A9AEB8;
      cursor: pointer;
      margin: 0px auto;
      margin-top: 30px;
    }
  }
}
</style>
