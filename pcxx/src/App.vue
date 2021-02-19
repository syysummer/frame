<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { base64_decode } from '@/utils/common';
export default {
  name: 'app',
  data(){
    return{
      isReady: false,
    }
  },
  created(){
    if(!this.isTGWBrowser()){return};
    upNativeComm.exec('userbase.info', {
      callback: (code, opt) => {
        const optNew = opt ? JSON.parse(opt) : {};
        console.log(base64_decode(optNew.token.split('.')[1]),'$$$$$')
        //部分token结尾含有特殊字符，需要过滤
        const reg = new RegExp('\u0000',"g");//g,表示全部替换。
        const userMsg = optNew.token ? JSON.parse((base64_decode(optNew.token.split('.')[1]).replace(reg,""))) : { user_id : 0, user_name: ''};
        const userInfo = {
          userId: userMsg.user_id,
          userType: !optNew.token ? 2 : 1,
          nickname: userMsg.user_name,
          headImgUrl: '',
          productid: '',
          token: optNew.token,
        }
        this.updateUserInfo({data: userInfo});
        this.isReady = true;
        this.upDateUserInfo(userMsg.user_id);
      }
    })
  },
  methods:{
    ...mapMutations(["updateUserInfo"]),
    ...mapActions(["getUserBaseInfo"]),
    async upDateUserInfo(uid){
      const userId = uid ? uid : 0;
      const {data: userMsg} = await this.getUserBaseInfo({
        userId: userId,
      })
      let userBase = {};
      let userInfoBase = this.userInfo;
      if(userMsg.data){
        userBase.nickname = userMsg.data.nickname;
        userBase.headImgUrl = userMsg.data.headimgurl;
      }
      Object.assign(userInfoBase,userBase);
      this.updateUserInfo({data: userInfoBase});
    }
  }
}
</script>
<style lang="less">
#app {
  font-family: MicrosoftYaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: justify;
  color: #ebeef5;
  padding: 0;
  margin: 0;
  background-color: #000000;
  min-width: 100vw;
  min-height: 100vh;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-size: 14px;
  font-family: Microsoft Yahei;
}
</style>
