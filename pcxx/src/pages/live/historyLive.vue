<template>
  <div class="live_room_wrap_page">
    <div class="live_room_wrap">
      <!-- 左边展示 -->
      <div class="box_left">
        <div class="live_main_content">
          <div class="video_content" v-if="!onlyText">
            <div class="video_wrap" v-show="currentLive.flv">
              <video tabindex="-1"></video>
            </div>
            <div class="video_cover_wrap" v-show="!currentLive.flv">
              <img src="@/assets/img/live/video_cover.png" alt="">
            </div>
          </div>
          <LiveHeader v-if="isReady" :onlyText="onlyText" :currentLive="currentLive"/>
        </div>
      </div>
      <!-- 右边展示 -->
      <div class="box_right">
        <!-- 视频直播的样式 -->
        <div class="graphic_right_content">
          <div class="tab_wrap">
            <div class="tab_item isActive">节目单</div>
          </div>
          <div class="right_content">
            <div class="program_list_wrap">
              <ProgramList :programList="playbill" @changeHistoryProgram="changeHistoryProgram" :onlyText="onlyText" :key="1" currentType="2"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgramList from "@c/live/programList";
import InteractiveChat from "@c/live/interactiveChat";
import LiveHeader from "@c/live/liveHeader";
import LiveTeacherCard from "@c/live/liveTeacherCard";
import TeacherGrade from "@c/public/teacherGrade";
import { mapActions, mapState } from "vuex";
export default {
  metaInfo () {
    return {
      title: this.currentLive.topicName,
    }
  },
  components: {
   ProgramList,
   LiveHeader,
   LiveTeacherCard,
   TeacherGrade
  },
  data(){
    return {
      workShopRoomId: 0, // 工作室Id
      liveType:1, //1视频直播 2 图文直播
      currentTab:1, // 1聊天互动 2节目单 3大赛直击
      serviceId: 0, //老师虚拟ID根据大直播间返回的serviceId动态获取(没有值时传0不报错)
      isReady: false, // 是否所有数据请求好了
      historyDate: "",
      videoPassword: "",
      mainRoomInfo: {
        joinCount: 0,
      },
      playbill: [], // 节目单列表
      currentLive: {
        flv: '',
        introduction: "",
        platform: 1, // 1哈哈哈 6哈哈哈
        roomType: '',
        serviceId: '',
        showUrl: '',
        state: '',
        teachers: '',
        topicId: '',
        topicName: '',
        liveType: '',
        isView: ''
      },
      roomId: 0,
      joinCount: 0,
      onlyText: true,
      isCanPass: 1,
      liveTopic: '',
      originRoomFlv: '',
      currentProgramId: this.$route.params.id, // 当前历史节目单的id
    }
  },
  computed:{
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getSingleRoomLive","reqLiveRoomId"]),
    async getRoomType(){
      let {data: roomIdResData} = await this.reqLiveRoomId({
          userId: this.userInfo.userId
        }).catch(e => {
        return {
          data: {}
        };
      });
      const roomId = roomIdResData ? roomIdResData.data : 6032
      this.workShopRoomId = roomId;
    },
    // 初始化播放器
    initPlayer() {
      // $Chimee ----- plugins/c_k_flv.js 里注册的
      const chimee = this.$Chimee.play({
        wrapper: ".video_wrap",
        src: this.currentLive.flv,
        src: 'http://tv.huaxuntg.com/gwd-20201119.mp4',
        isLive: true,
        controls: true,
        autoplay: true,
      });
    },
    changeHistoryProgram(data){
      this.currentProgramId = data;
      this.getLiveRoomMsg();
    },
    async getLiveRoomMsg(){
      const userId = this.userInfo.userId;
      const userInfo = this.userInfo
      // TODO: 到时候liveid可能是写死的
      const serviceId = this.serviceId
      let timer = new Date().getTime()
      let {data: getRoomIdResData} = await this.getSingleRoomLive({
          roomId: this.workShopRoomId,
          userId: this.userInfo.userId
        })
      getRoomIdResData = getRoomIdResData ? getRoomIdResData.data : {};
      const programList = getRoomIdResData.programList ? getRoomIdResData.programList : [];
      let getRoomIdRes = getRoomIdResData ? getRoomIdResData : {};
      const {topicName: liveTopic} = getRoomIdRes;
      let originRoomFlv = '';
      if(getRoomIdRes.state == 1){
        originRoomFlv = getRoomIdRes.playUrl
        ? getRoomIdRes.playUrl.replace("rtmp", "https") + ".flv"
        : "";
      }else{
        originRoomFlv =  getRoomIdRes.playUrl;
      }
      const currentLive = {
        flv: originRoomFlv,
        introduction: "",
        platform: 1,
        roomType: getRoomIdRes.roomType,
        serviceId: getRoomIdRes.serviceId,
        showUrl: getRoomIdRes.playUrl,
        state: getRoomIdRes.state,
        teachers: getRoomIdRes.serviceName,
        topicId: getRoomIdRes.topicId,
        topicName: getRoomIdRes.topicName,
        liveType: getRoomIdRes.liveType,
        isView: 1
      };
      this.serviceId = getRoomIdRes.serviceId;
      const roomId = getRoomIdRes.topicId;
      const joinCount = getRoomIdRes.joinCount;
       // 找到当前要播放的历史直播
      const topicName = getRoomIdResData.topicName;
      const currentProgram = programList.find(e => e.id == this.currentProgramId);
      currentProgram.showUrl = "rtmp://8091.liveplay.myqcloud.com/live/8091_6114_1608110385";
      Object.assign(currentLive,  currentProgram || {});
      currentLive.topicName = currentProgram && currentProgram.introduction ? currentProgram.introduction : topicName;
      currentLive.nikName = currentLive.teacherName;
      currentLive.introduction = currentLive.introduction;
      currentLive.headPhotoAddress = currentLive.teacherPicture ? currentLive.teacherName : "https://m.tgw360.com/img/face_default.png";
      // let onlyText = currentLive.liveType != 1 ? false : getRoomIdRes.liveType != 1 ? false : true;
      // 历史直播只有视频直播
      let onlyText = false;
      if(currentLive.state == 1){
         currentLive.flv = currentLive.showUrl
        ? currentLive.showUrl.replace("rtmp", "https") + ".flv"
        : currentLive.flv;
      }else{
        currentLive.flv = currentLive.showUrl;
      }
      this.mainRoomInfo = getRoomIdRes
      this.playbill = programList
      this.currentLive = currentLive
      this.roomId = roomId;
      this.joinCount = joinCount
      this.onlyText = onlyText
      this.liveTopic = liveTopic
      this.originRoomFlv = originRoomFlv
      this.$nextTick(() => {
        if (document.querySelector(".live_room_list .live_card.isLiving")) {
          document.querySelector(".live_room_list .live_card.isLiving").scrollIntoView();
        }
        if (!this.isCanPass || this.onlyText) return;
        this.initPlayer();
      })
      this.isReady = true
    },
  },
  async mounted(){
    await this.getRoomType();
    this.getLiveRoomMsg();
  }
};
</script>

<style lang="less" scoped>
@import '@/assets/less/global.less';
.live_room_wrap_page{
  padding-top: 10px;
}
.live_room_wrap {
  width: 1208px;
  margin: 0px auto;
  margin-bottom: 10px;
  .flexBox(space-between,flex-start);
  .box_left{
    width: 70%;
    .header_content{
      width: 100%;
      height: 80px;
      background: #141A1F;
    }
    .live_main_content{
      width: 100%;
      .video_content{
        width: 100%;
        .video_wrap,.video_cover_wrap{
          height: 474px;
         .flexBox(center,center);
          video{
            width: 100%;
          }
        } 
      }
    }
  }
  .box_right{
    width: 29%;
    min-height: 646px;
    background: #141A1F;
    >div{
      width: 100%;
      .tab_wrap{
        width: 100%;
        .flexBox(space-between, center);
        height: 36px;
        border-bottom: 1px solid #141A1F;
        background: #2F313C;
        .tab_item{
          flex: 1;
          height:100%;
          line-height:36px;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          &.isActive{
            font-size: 18px;
            color: #FF2323;
            position: relative;
            &:after{
              content: '';
              position: absolute;
              width: 24px;
              height:2px;
              bottom: 2px;
              left: 50%;
              transform: translateX(-50%);
              background: #FF2323;              
            }
          }
          &.isSingle{
            text-align: left;
            width: 60px;
            height: 36px;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 36px;
            padding-left: 16px;
            border-bottom: 1px solid #000;
          }
        }
      }
      .contest_hit{
        width: 100%;
        .contest_video_wrap{
          border-top: 9px solid #000000;
          background: #141A1F;
          padding-bottom: 48px;
          position: relative;
          &:after{
            content: '';
            position: absolute;
            display: block;
            height: 0px;
            background: #3C3C3C;
            left: 16px;
            right: 16px;
            bottom: 40px;
          }
        }
      }
      .teacher_grade{
        width: 100%;
        height: 100px;
        box-sizing: content-box;
        border-bottom:10px solid #000;
      }
      .program_list_wrap{
        width: 100%;
        max-height: 609px;
        background: #141A1F;
        .scrollBar;
        overflow-y: auto;
      }
    }
  }
}
</style>