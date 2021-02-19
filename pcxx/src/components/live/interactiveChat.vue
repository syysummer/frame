<template>
  <div class="interaction">
    <div :class="['bg-box',{blockTextBox: isOnly}]">
      <div class="live-closed" v-if="state == 2 && isEndTipShow"><img src="@/assets/img/live/msg_tip.png" alt=""/><span>当前直播已结束，敬请期待下一档节目</span> <img class="close_icon" @click="isEndTipShow = false" src="@/assets/img/guanbi.png" alt=""></div>
      <div class="live-notice" v-if="isNoticeShow && Notice.content && state != 2"><span><img class="topic-img" src="@/assets/img/live/notice_lab.png" alt=""><span class="notice_text">{{Notice.content}}</span></span><img @click="isNoticeShow = false" src="@/assets/img/guanbi.png" alt=""></div>
      <ul :class="{'close-notice': !isNoticeShow || !Notice.content}">
        <li class="add-more" v-if="hasMore">
          点击
          <span class="load-more" @click="getMoreMsg">加载更多<img src="@/assets/img/live/jiantou_xiangxia.png" alt=""></span>
        </li>
        <li v-else class="no-more">没有更多消息</li>
        <li
          @click="checkBigImg"
          :class="['content-li',{blockTextLi: isOnly},{isSelf: userInfo.userId == item.userId}]"
          v-for="(item,index) in liveMsg"
          :key="index"
          v-html="item.content"
        ></li>
       </ul>
        <div class="textarea-box" v-if="userInfo.userId">
          <div
            placeholder="动动手指，玩转股市，一起来交流一下吧！"
            class="chat-box"
            name
            id="chat-box"
            cols="30"
            rows="2"
            contenteditable="plaintext-only"
            @input="changeInput"
            v-html="chatText"
          ></div>
          <div class="options">
            <BrowIcon @useFace="appendFace" />
            <button @click="sendMessage" :class="['send',{isAllowSend: allowSend}]">{{isSeending ? '发送中': '发送'}}</button>
          </div>
        </div>
        <div class="login-box" v-if="!userInfo.userId && state != 2">
          <p>登录即可参与互动，</p>
          <button @click="$login({})">立即登录 ></button>
        </div>
    </div>
    <div class="img-mode-box" @click="currentImg=undefined" v-if="currentImg">
      <div class="img-mode">
        <img :src="currentImg" alt />
      </div>
    </div>
  </div>
</template>

<script>
import BrowIcon from "@/components/public/browIcon";
import msgHandle from "@/utils/liveMsgHandler.js";
import config from '../../plugins/config/index';
import { mapActions } from 'vuex';
import {
  getStrangeTimeFormat,
  insertAtCursor
} from "@/utils/publicMethods.js";

export default {
  props: [
    "ServiceID",
    "roomId",
    "isOnly",
    "joinCount",
    "userInfo",
    "title",
    "mainRoomInfo",
    "state",
    "topicId",
    "type", // 1投顾直播间2工作室(大赛直播间)
  ],
  components: { BrowIcon },
  data() {
    return {
      isSeending: false,
      chatText: "",
      chatTextNow: "",
      allMsg: [],
      socket: null,
      currentPage: 1,
      currentImg: "",
      hasMore: undefined,
      heartTimer: null, // 心跳检测
      serverTimeoutObj:null,//心跳检测服务端超时
      entryTime: Date.now(),
      isNoticeShow: true,
      isEndTipShow: true,
      Notice: {},
      lockReconnect:false,
    };
  },
  methods: {
    ...mapActions(["getLiveHistoryMsg", "getSubmitLiveMsg", "getNotice"]),
    goDetail(classStr,event){
      const par0 = event.target;
      const par1 = event.target.parentNode;
      const par2 = event.target.parentNode.parentNode;
      const par3 = event.target.parentNode.parentNode.parentNode;
      if(par0.className == classStr || par1.className == classStr || par2.className == classStr || par3.className == classStr){
        const view0 = event.target.getAttribute('data-view');
        const view1 = event.target.parentNode.getAttribute('data-view');
        const view2 = event.target.parentNode.parentNode.getAttribute('data-view');
        const view3 = event.target.parentNode.parentNode.parentNode.getAttribute('data-view');
        const viewList = [view1, view2, view3];
        let viewUrl = "";
        viewList.forEach((el) => {
          if(el){
            viewUrl = el;
          }
        })
        this.$openwebview(viewUrl);
      }
    },
    checkBigImg(e) {
      console.log(e);
      // 这里只查三层，足够了，不会有更深的情况
      for (let i = 0; i < 3; i++) {
        let item = e.path[i];
        console.log(item.className);
        if (item.className === "imgWrap") {
          this.currentImg = e.target.src;
          break;
        }
      }
      // 跳转观点详情页
      this.goDetail('live-content-msg goViewDetail',e);
      // 跳转股票详情页
      if(e.target.className == 'goStockDetail'){
        const code = e.target.getAttribute('data-code').trim();
        const market = e.target.getAttribute('data-market').trim();
        console.log(code, market,'jjhh');
        const markerMap = {
          'SZ': '0',
          'sz': '0',
          'SH': '1',
          'sh': '1',
        }
        this.$openSingleStock({code, setcode:markerMap[market]})
      }
      // 跳转链接
      if(e.target.className == 'goLinkDetail'){
        const url = e.target.getAttribute('dataHref').trim();
        this.$openwebview(url)
      }
      if(e.target.className == 'goClientLink'){
        const url = e.target.getAttribute('dataHref').trim();
        this.$goTo(url)
      }
      // 跳转至尊粉
      if(e.target.className == 'goSupremeFan'){
        let id = this.$route.params.teacherId;
        let type = 0;
        if(id == config.pzdServiceId){
          type = 1
        }else if(id == config.lqServiceId){
          type = 2
        }
        this.$openwebview(`/teacherAct/${type}`);
      }
    },
    getMoreMsg() {
      this.currentPage += 1;
      this.reqLiveHistoryMsg();
    },
    // 插入表情
    appendFace(i) {
      let dom = document.querySelector(".chat-box");
      this.chatTextNow = this.chatTextNow + `<img style="width:20px;line-height:16px;vertical-align:middle;" src='/img/face/face${i}.png' alt=""/>`;
      this.chatText = this.chatTextNow;
      clearTimeout(timer);
      var timer = setTimeout(()=>{
        if (window.getSelection) { //ie11 10 9 ff safari
            dom.focus(); //解决ff不获取焦点无法定位问题
            var range = window.getSelection(); //创建range
            range.selectAllChildren(dom); //range 选择obj下所有子内容
            range.collapseToEnd(); //光标移至最后
        } else if (document.selection) { //ie10 9 8 7 6 5
            var range = document.selection.createRange(); //创建选择对象
            //var range = document.body.createTextRange();
            range.moveToElementText(dom); //range定位到obj
            range.collapse(false); //光标移至最后
            range.select();
        }
        clearTimeout(timer)
      },5)
    },
    // 编辑文本
    changeInput(e){
      if(e.target.innerHTML){
        this.chatTextNow = e.target.innerHTML;
      }else{
        this.chatTextNow = '';
      }
    },
    // 获取直播消息
    async reqLiveHistoryMsg(reloadMsg) {
      if (reloadMsg) {
        this.currentPage = 1;
        this.allMsg = [];
        this.hasMore = true;
      }
      if (this.currentPage > 1 && !this.hasMore) return;
      let originMsg = [];
      let { data } = await this.getLiveHistoryMsg({
          page: this.currentPage,
          count: 15,
          serviceId: this.ServiceID,
          userType: this.userInfo.userType == "2" ? 3 : 1,
          liveTopicId: this.type == '2' ? 0 : this.topicId,
          publishTypeList: "1,2,3,4,5,6,7,8,10,11,12,13,14,15,16",
          userId: this.userInfo.userId
      })
      if(!data && !data.data){
        data = {data: {}}
      }
      if (data.data.total <= data.data.pageNum * data.data.pageSize || data.data.total == 0) {
        this.hasMore = false;
      }
      originMsg = [...data.data.data.reverse()];
      this.msgsHandle(originMsg);
    },
    // 格式化消息
    msgsHandle(msg) {
      let roomid = this.roomId;
      let _msg = msg.map(e => {
        return {
          content: this.msgHandle({
            ServiceID: this.ServiceID,
            msg: e
          }),
          id: e.messageId,
          userId: e.publishId
        };
      });
      this.allMsg.unshift(..._msg);
    },
    msgHandle(msg) {
      return msgHandle(
        {
          ...msg,
          selfAvatar: "https://m.tgw360.com/img/face_default.png"
        },
        this.userInfo.userId,
        true,
        this.hadAuth,
        this.vipLevel
      );
    },
    initSocket() {
      this.socket.addEventListener("open", event => {
        console.log('open开始')
        this.startHeartCheck();
      });
      this.socket.addEventListener("message", event => {
        this.resetHeartCheck();
        console.log(event.data,'检测心跳')
        if (event.data === "pong") return;
        if (
          JSON.parse(event.data).type === 4 ||
          JSON.parse(event.data).type === 3
        ) {
          console.log('节目变啦！！！')
          this.$parent.changeProgram()
          // this.$emit("changeProgram");
          return;
        }
        const msg = JSON.parse(event.data);
        Object.assign(msg, msg.MsgContent)
        msg.userType = msg.UserType;
        const data = this.msgHandle({
          ServiceID: this.ServiceID,
          msg
        });
        this.allMsg.push({
          content: data,
          id: msg.MessageID
        });
      });
      this.socket.addEventListener("close", event => {
        // TODO: 重连 
        console.log('close重连')
          this.reconnect(
              `${config.livewebsocket}/live/websocket?roomId=${this.roomId}&userId=${this.userInfo.userId}&serviceId=${this.ServiceID}&userType=${this.userInfo.userType}` 
          );
      });

      this.socket.addEventListener("error", event => {
        // TODO: 重连 
        console.log('error重连')
         this.reconnect(
              `${config.livewebsocket}/live/websocket?roomId=${this.roomId}&userId=${this.userInfo.userId}&serviceId=${this.ServiceID}&userType=${this.userInfo.userType}` 
          );
      });
    },
    createWebSocket(url){
      try{
        this.socket = new WebSocket(url);
        this.initSocket();
      }
      catch(e){
        this.reconnect(url);
      }
    },
    reconnect(url){
        if(this.lockReconnect) return;
        this.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        let that = this;
        setTimeout(function () {
            that.createWebSocket(url);
            that.lockReconnect = false;
        }, 2000);
    },
    beforeFormatText(str){
      let contStr = str;
      let subFace = /face[0-9]{1,3}/g;
      let FaceReg = /<img style="width:20px;line-height:16px;vertical-align:middle;"[\s\S]{0,}?>/g;
      const hanleFace = (faceStr,contStr) => {
        let subStr = faceStr.match(subFace) && faceStr.match(subFace)[0];
        contStr = contStr.replace(faceStr,'['+subStr+']');
        faceStr = contStr && contStr.match(FaceReg) && contStr.match(FaceReg)[0];
        return {
          faceStr,
          contStr
        }
      }
      let faceStr = contStr && contStr.match(FaceReg) && contStr.match(FaceReg)[0];
      while (faceStr) {
        let content = hanleFace(faceStr,contStr);
        contStr = content.contStr;
        faceStr = content.faceStr;
      }
      const reg = /(&nbsp;)|(&nbsp;)|(<br>)/g;
      contStr = contStr.replace(reg,' ');
      return contStr;
    },
    async sendMessage() {
      this.chatText = this.chatTextNow;
      if (!this.chatText || !this.chatText.trim()){
        return;
      }
      if(!this.allowSend){
        console.log('不要输入空')
        return;
      }
      if (this.isSeending) return;
      this.isSeending = true;
      const msg = {
        content: this.beforeFormatText(this.chatText),
        liveTopicId: this.roomId,
        messageType: 1,
        publishType: 6,
        serviceId: this.ServiceID,
        userType: this.userInfo.userType,
        sponsorUserId: this.userInfo.userId
      };
      const messageTime = getStrangeTimeFormat();
      let { data: msgRes } = await this.getSubmitLiveMsg({ ...msg })
      if(!msgRes){
        let msgRes = { messageid }
      }
      const msgId = msgRes.messageid;
      const data = this.msgHandle(
        {
          ServiceID: this.ServiceID,
          msg: {
            publishId: this.userInfo.userId,
            publishType: 6,
            messageTime,
            nickName: "",
            messageType: 1,
            userType: this.userInfo.userType,
            content: this.beforeFormatText(this.chatText),
            headAddress: this.userInfo.headImgUrl
          },
          selfName: this.userInfo.nickname,
          selfAvatar: this.userInfo.headImgUrl
        },
        this.userInfo.userId
      );
      this.allMsg.push({
        content: data,
        id: msg.MessageID,
        userId: this.userInfo.userId
      });
      this.chatTextNow = "";
      this.chatText = "";
      this.isSeending = false;
    },
    resetHeartCheck() {
        clearTimeout(this.heartTimer);
        clearTimeout(this.serverTimeoutObj);
　　　　 this.startHeartCheck();
    },
    startHeartCheck(){
      let that = this
        this.heartTimer = setTimeout(() => {
          that.socket.send("ping");
          that.serverTimeoutObj = setTimeout(function(){
            that.socket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
          }, 60000)
      }, 60000);
    },
    reloadMsg(){
      this.reqLiveHistoryMsg(true);
    },
    async reqNotice(){
      let {data: noticeDetail} = await this.getNotice({
        serviceId: this.ServiceID
      })
      this.Notice = noticeDetail && noticeDetail.data && noticeDetail.data.data.length ? noticeDetail.data.data[0] : {};
      let timeStyle = setTimeout(() => {
        let ul = document.querySelector('ul');
        let liveNotice = document.querySelector('.live-notice');
        let liveClose = document.querySelector('.live-closed');
        if(liveNotice){
          ul.style.paddingTop = parseInt(liveNotice.clientHeight) + 6 + 'px';
        }else if(liveClose){
          ul.style.paddingTop = parseInt(liveClose.clientHeight) + 6 + 'px';
        }
      },300);
    }
  },
  mounted() {
    // 建立链接
    // TODO: 这里的链接host需要改
    this.createWebSocket(
      `${config.livewebsocket}/live/websocket?roomId=${this.roomId}&userId=${this.userInfo.userId}&serviceId=${this.ServiceID}&userType=${this.userInfo.userType}`
    );
    window.onload = () => {
      setTimeout(() => {
        document
          .querySelector(".interaction .bg-box ul li:last-child")
          .scrollIntoView();
      }, 300);
    };

    setTimeout(() => {
      document
        .querySelector(".interaction .bg-box ul li:last-child")
        .scrollIntoView();
    }, 0);
    this.reqNotice()
  },
  created() {
    this.reqLiveHistoryMsg(true);
  },
  computed: {
    liveMsg() {
      if (this.currentPage === 1) {
        setTimeout(() => {
          document
            .querySelector(".interaction .bg-box ul li:last-child")
            .scrollIntoView();
        }, 0);
      }
      return this.allMsg;
    },
    allowSend(){
      let str = this.chatTextNow;
      const reg = /(&nbsp;)|(&nbsp;)|(<br>)/g;
      str = str.replace(reg, '');
      if(!str.trim()){
        return false;
      }else{
        return true;
      }
    }
  },
  watch:{
    isEndTipShow(newValue){
      let ul = document.querySelector('ul');
      if(newValue){
        let liveClose = document.querySelector('.live-closed');
        ul.style.paddingTop = parseInt(liveClose.clientHeight) + 'px';
      }else{
        ul.style.paddingTop = 6 + 'px';
      }
    },
    isNoticeShow(newValue){
      let ul = document.querySelector('ul');
      if(newValue){
        let liveNotice = document.querySelector('.live-notice');
        ul.style.paddingTop = parseInt(liveNotice.clientHeight) + 'px';
      }else{
        ul.style.paddingTop = 6 + 'px';
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import '@/assets/less/global.less';
.interaction {
  width: 100%;
  min-width: 276px;
  border-top: 1px solid #141A1F;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0;
    h2 {
      font-size: 16px;
      color: #333333;
    }
    .people {
      font-size: 14px;
      color: #666666;
      img {
        width: 13px;
        height: 13px;
      }
    }
  }
  .bg-box {
    background: #141A1F;
    height: 609px;
    position: relative;
    .bx-box-title {
      font-size: 14px;
      color: #333333;
      font-weight: 700;
    }
    ul {
      height: 467px;
      overflow: auto;
      padding-bottom: 10px;
      padding-top: 6px;
      .scrollBar;
      .add-more {
        text-align: center;
        padding-top: 10px;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        color: #A9AEB8;
        span {
          cursor: pointer;
          // color: #1882ff;
          color: #A9AEB8;
          display: flex;
          display: -webkit-flex;
          justify-content: flex-start;
          align-items: center;
          img{
            width:10px;
            margin-left: 3px;
          }
        }
      }
      .no-more {
        padding-top: 10px;
        font-size: 10px;
        text-align: center;
        margin-bottom: 2px;
        color: #A9AEB8;
      }
      li {
        padding-left: 10px;
        padding-right: 10px;
        &:nth-child(1){
          margin-bottom:12px;
        }
      }
      &.close-notice{
        padding-top: 0px;
      }
    }
    .live-closed{
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      line-height:  40px;
      background: #2F313C;
      text-align: center;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 10;
      border-bottom: 1px solid #141A1F;
      img{
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
      span{
        color:#333;
        margin-left: 2px;
        font-size: 14px;
        color: #FFBF3C;
      }
      .close_icon{
         position: absolute;
         right: 16px;
         top: 50%;
         cursor: pointer;
         transform: translateY(-50%);
      }
    }
    .live-notice{
      .flexBox(space-between, center);
      padding: 3px 0px;
      min-height:  40px;
      background: #2F313C;
      text-align: center;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 10;
      padding-right:20px;
      border-bottom: 1px solid #141A1F;
      img{
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
      span{
        color:#FFF;
        font-size: 16px;
        .flexBox(flex-start, center);
        .topic-img{
          width: 56px;
          display: inline-block;
          width: 56px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          margin-right: 12px;
        }
        .notice_text{
          width: calc(100% - 60px);
          text-align: left;
          margin-right: 6px;
        }
      }
     }
    .textarea-box {
      width: 100%;
      height: 141px;
      background: #2F313C;
      border-top: 1px solid #141A1F;
      .chat-box {
        margin: 15px 14px 16px 16px;
        border: none ;
        outline: none;
        height: 62px;
        overflow-y: auto;
        .scrollBar;
        width: calc(100% - 30px);
        padding: 9px 12px;
        resize: none;
        background: #141A1F;
        color: #A9AEB8;
        line-height: 20px;
        word-wrap:break-word;  /*遇到空格整个单词显示不完就自动换行到下一行*/
        word-break:break-all;  /*如果一行没有空格就到头截断单词换行*/
        &::-webkit-input-placeholder{
        font-size: 12px;
        }
        &:empty:before{
          content:attr(placeholder);
          font-size: 13px;
          color:#A9AEB8;
        }
        &:focus:before{
          content:none;
        }
      }
      .options {
        display: flex;
        align-items: center;
        padding:0px 16px 16px;
        width: 100%;
        .flexBox(space-between, center);
        img{
          width: 28px;
          height: 28px;
        }
        button {
          cursor: pointer;
          border: none;
          width: 65px;
          height: 32px;
          background: rgba(20,26,31,.5);
          border-radius: 2px;
          outline: none;
          color: #A9AEB8;
          font-size: 14px;
          line-height: 32px;
          letter-spacing: 0.2;
          position: relative;
          &.isAllowSend{
            width: 65px;
            height: 32px;
            background: #DD0227;
            border-radius: 1px;
            color: #fff;
          }
        }
      }
    }
    .login-box {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #2F313C;
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 10px;
      p{
        font-size: 16px;
      }
      button {
        background-color: rgba(0, 0, 0, 0);
        padding: 5px 10px;
        color: #DD0227;
        outline: none;
        border: none;
        font-weight: 800;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }
    }
  }
  .blockTextBox {
    width: 100%;
    height: calc(100vh - 90px);
    ul {
      height: calc(100% - 140px);
      .blockTextLi {
        display:flex;
        display: -webkit-flex;
        justify-content:flex-start;
        align-items: flex-start;
        .message-box {
        }
      }
      .blockTextLi.isSelf {
        text-align: right;
        position: relative;
      }
    }
  }
  .img-mode-box {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    .img-mode {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        transform: scale(1.1);
        max-width: 80vw;
        max-height: 80vh;
      }
    }
  }
}
</style>

<style scoped>
/*
因为li中的html是外部js插进去的，所有没有 scoped 加上的data，直接写的属性不会生效
所以这里使用 >>> 进行穿透，又由于 less 中不支持 >>> 写法，所以单独拎出来 */
.bg-box ul li >>> .avatar{
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.bg-box ul li >>> .user-info {
  display: flex;
  display:-webkit-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 6px;
  margin-right: 12px;
  max-width: 85%;
  flex-grow: 1;
  margin-bottom: 24px;
}
.bg-box ul li >>> .user-info .nickname {
  font-size: 14px;
  color: #fff;
}
.bg-box ul li >>> .user-info .nickname.self {
  font-size: 14px;
  margin-right: 0;
  color: #ae2626;
}
.bg-box ul li >>> .user-info .nickname.teacher {
  font-size: 14px;
  color: #FFF;
}
.bg-box ul li >>> .user-info .user-label{
  display: inline-block;
  font-size: 12px;
  color: #FFFFFF;
  width: 30px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  vertical-align: middle;
  margin-right: 12px;
  background: #DD0227;
}
.bg-box ul li >>> .user-info .nickname {
  font-size: 14px;
  color: #fff;
}
.bg-box ul li >>> .user-info .watched {
  font-size: 12px;
  color: #999;
  flex-grow: 1;
  text-align: right;
  padding-right: 10px;
}
.bg-box ul li >>> .message-box {
  padding: 10px;
  font-size: 14px;
  max-width: 100%;
  margin-top: 6px;
  background: #2F313C;
}
.bg-box ul li >>> .message-box .imgWrap {
  /*height: 300px;*/
  width: 100%;
}
.bg-box ul li >>> .message-box .imgWrap img {
  width: 100%;
  /*height: 100%;*/
}
/* ------------------- */
.bg-box ul .content-li{
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.bg-box ul .content-li >>> .avatar{
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 8px;
}
.bg-box ul .content-li.blockTextLi >>> .avatar{
  width: 40px;
  height: 40px;
}
.bg-box ul .content-li >>> .user-info .nickname {
  font-size: 14px;
  color: #fff;
  margin-right: 8px;
}
.bg-box ul .content-li >>> .user-info .watched {
  font-size: 12px;
  color: #A9AEB8;
  flex-grow: 0;
  text-align: right;
  padding-right: 10px;
}
.bg-box ul .content-li >>> .user-info .header-wrap{
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.bg-box ul .content-li >>> .user-info .header-wrap .vip-fan{
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 68px;
}

.bg-box ul .content-li >>> .message-box {
  max-width: 100%;
  font-size: 14px;
  padding: 10px;
  /* min-width: 10px; */
  display: inline-block;
}

.bg-box ul .content-li >>> .user-content {
  margin-right: 0px;
}

.bg-box ul .content-li >>> .message-box .imgWrap {
  max-height: 350px;
}

.bg-box ul .content-li >>> .message-box .imgWrap img {
  height: auto;
  max-width: 100%;
  max-height: 350px;
  width: auto;
}
/* 用户自己发言的样式 */
.bg-box ul .content-li.isSelf{
  position: relative;
}
.bg-box ul .content-li.isSelf >>> .avatar{
  position: absolute;
  top: 0;
  right: 12px;
  justify-content: flex-end;
}
.bg-box ul .content-li.isSelf >>> .user-info {
  display:flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  padding-right: 40px;
  max-width:100%;
}
.bg-box ul .content-li.isSelf.blockTextLi >>> .user-info {
  padding-right: 48px;
  max-width:100%;
}
.bg-box ul .content-li.isSelf >>> .user-info .header-wrap{
  display:flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
}
.bg-box ul .content-li.isSelf >>> .user-info .header-wrap .vip-fan{
  justify-content: flex-end;
}
.bg-box ul .content-li.isSelf >>> .self_content{
  width: 100%;
  display:flex;
  display: -webkit-flex;
  justify-content: flex-end;
  align-items: center;
}
.bg-box ul .content-li.isSelf >>> .self_content .message-box{
  text-align: left;
}
.bg-box ul .content-li >>> .user-info .nickname.self {
  font-size: 14px;
  color: #FFFFFF;
}
/* 至尊粉分享 */
.bg-box ul .content-li >>> .user-info .shareHref a{
  color: #0093FF;
}
/*观点*/
.bg-box ul .content-li >>> .user-info .live-content-msg{
  display: flex;
  display: -webkit-flex;
  justify-content:flex-start;
  align-items: center;
  cursor: pointer;
}
.bg-box ul .content-li >>> .user-info .live-content-msg img{
  min-width: 87px;
  max-width: 87px;
  height: 50px;
  margin-right: 10px;
}
.bg-box ul .content-li >>> .user-info .live-content-msg .live-content{
  height: 60px;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content:space-between;
  align-items: flex-start;
}
.bg-box ul .content-li >>> .user-info .live-content-msg .live-content .msg-title{
  width: 100%;
  padding-right: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.bg-box ul .content-li >>> .user-info .live-content-msg .live-content .label-like{
  width: 100%;
  padding-right: 10px;
  min-width: 160px;
  display: flex;
  display: -webkit-flex;
  justify-content:space-between;
  align-items: center;
  color:#A9AEB8;
}
</style>
