<template>
  <div class="password_tip_page">
    <div class="dialog_content">
      <div class="close_icon"><img @click="closeDialog" src="@/assets/img/close.png" alt=""></div>
      <div class="label">私密模式</div>
      <div class="form_wrap">
        <input type="text" placeholder="请输入密码" v-model="privatePassword"/>
        <div class="btn" @click="toCheckPassword">确定</div>
      </div>
      <div class="des">联系客服获取密码，或拨打客服热线4001587118</div>
    </div>
  </div>
</template>

<script>
import { mapActions,mapState } from "vuex";
export default {
  props: ['topicId', 'serviceId'],
  data() {
    return {
      privatePassword:''
    };
  },
  computed:{
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapActions(["checkPassword"]),
    async toCheckPassword(){
      if(!this.privatePassword){return}
      let {data: dataRes} = await this.checkPassword({
        password: this.privatePassword,
	      topicId: this.topicId
      })
      if(dataRes && dataRes.errcode === 0){
        this.privatePassword = '';
        this.$emit('closeDialog');
        this.$openwebview(`/live/${this.topicId}/${this.serviceId}`)
      }else{
        this.privatePassword = '';
        this.$message.closeAll();
        this.$message({
          message: dataRes.errmsg,
          type: 'error',
        })
      }
    },
    closeDialog(){
      this.$emit('closeDialog');
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/css/global.less";
.password_tip_page{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  z-index: 5;
  .dialog_content{
    margin: 280px auto;
    width: 460px;
    height: 240px;
    background: #2F313C;
    border: 1px solid #23262E;
    padding: 0px 0px 30px 0px;
    .flexBox(center,center,column);
    .close_icon{
      width: 100%;
      text-align: right;
      img{
        width: 28px;
        margin-right: 16px;
        cursor: pointer;
      }
    }
    .label{
      width: 88px;
      height: 29px;
      font-size: 22px;
      color: #FFFFFF;
      line-height: 29px;
    }
    .form_wrap{
      .flexBox(space-between, center);
      margin: 29px 0;
      input{
        width: 275px;
        height: 38px;
        background: #FFFFFF;
        padding-left: 17px;
        border: none;
        outline: none;
      }
      .btn{
        width: 98px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        font-size: 14px;
        color: #FFFFFF;
        cursor: pointer;
        margin-top:4px;
        margin-left: 12px;
        background: url('../../assets/img/go_live.png');
        background-size:100% 100% ;
      }
    }
    .des{
      height: 24px;
      font-size: 16px;
      color: #A9AEB8;
      line-height: 24px;
    }
  }
}
</style>
