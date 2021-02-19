<template>
  <div class="header_content_page" :class="[{live_header_text: onlyText},{live_header_video: !onlyText}]">
    <div class="live_header" v-if="onlyText">
      <div class="title">
        <h2>{{currentLive.topicName}}</h2>
      </div>
      <div class="popularity"><img src="@/assets/img//live/hotRate.png" alt="">{{currentLive.hotRate ? currentLive.hotRate : currentLive.joinCount}}人气</div>
    </div>
    <div class="live_header live_video" v-else>
      <div class="title">
        <h2>{{currentLive.topicName}}</h2>
      </div>
      <div class="live_teacher_message">
        <div class="left_wrap">
          <div class="teacher">
            <img :src="currentLive.teacherPicture ? currentLive.teacherPicture : currentLive.servicePicture" onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';" alt="" />
            <div class="teacher_name">{{currentLive.teacherName ? currentLive.teacherName : currentLive.serviceName}}</div>
          </div>
          <SubjectGrade :kid="currentLive.topicId" :likeType="9" :type="'live'" :detail="{title:currentLive.topicName,section:'直播互动',author: currentLive.teachers, entry:'直播互动',type: '直播'}"/>
        </div>
        <div class="popularity"><img src="@/assets/img/live/hotRate.png" alt="">{{currentLive.hotRate ? currentLive.hotRate : currentLive.joinCount}}人气</div>
      </div>
      <TeacherGrade :kid="currentLive.topicId" :likeType="9" styleType="1" :detail="{title:currentLive.topicName,section:'直播互动',author: currentLive.teachers, entry:'直播互动',type: '直播'}"/>
    </div>
  </div>
</template>
<script>
import SubjectGrade from "@c/public/subjectGrade";
import TeacherGrade from "@c/public/teacherGrade";
export default {
  props: ['currentLive', 'onlyText', 'roomId'],
  data(){
    return {
    }
  },
  components:{
    SubjectGrade,
    TeacherGrade
  },
  methods:{
  }
}
</script>
<style lang="less" scoped>
@import "@/assets/less/global.less";
.header_content_page{
  width: 100%;
  height: 100%;
  &.live_header_text{
    padding: 20px 20px 20px 0px;
    background: #23262E;
  }
  &.live_header_video{
    padding: 20px 0px 0px;
    background: #141A1F;
    .live_header{
      .title{
        h2{
          width: 100%;
        }
      }
    }
  }
  .live_header{
    .flexBox(space-between,center);
    .title{
      padding: 0px 20px;
      .flexBox(flex-start,center);
      h2{
        width: 650px;
        .single_hide;
        height: 28px;
        font-size: 20px;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 28px;
      }
    }
    .popularity{
      .flexBox(flex-end,center);
      height: 20px;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 20px;
      img{
        width: 18px;
        margin-right: 6px;
      }
    }   
    &.live_video{
      .flexBox(flex-start,flex-start,column);
      margin-bottom: 1px;
      .live_teacher_message{
        margin-top: 20px;
        width: 100%;
        padding: 0px 20px 20px;
        .flexBox(space-between,center,row);
        .left_wrap{
          width: 80%;
          .flexBox(flex-start,center,row);
          .teacher{
            .flexBox(flex-start,center,row);
            img{
              width: 24px;
              height: 24px;
              border-radius: 50%;
              margin-right: 8px;
            }
            .teacher_name{
              min-width: 30px;
              margin-right: 32px;
              height: 20px;
              font-size: 16px;
              color: #A9AEB8;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
