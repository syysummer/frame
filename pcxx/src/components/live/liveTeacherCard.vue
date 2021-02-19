<template>
  <div class="live_teacher_card">
    <div class="title_state">
      <div class="avatar">
        <img :src="mainRoomInfo.headPhotoAddress" onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';" alt="" />
      </div>
      <div class="live_detail">
        <div class="teacher">{{mainRoomInfo.nikName}}</div>
      </div>
    </div>
    <div class="live_summary">投顾简介: {{introduction}}</div>
    <div class="line"></div>
    <div class="evaluate_wrap">
      <span>您的评价是我们的动力：</span>
      <SubjectGrade :kid="mainRoomInfo.topicId" :likeType="9" :type="'live'" :detail="{title:mainRoomInfo.topicName,section:'直播互动',author: mainRoomInfo.teachers, entry:'直播互动',type: '直播'}"/>
    </div>
  </div>
</template>
<script>
import SubjectGrade from "@c/public/subjectGrade";
import { mapActions, mapState } from "vuex";
export default {
  props: ['mainRoomInfo'],
  components: {
    SubjectGrade
  },
  data(){
    return {
      certificateNO: '',
      introduction: ''
    }
  },
  computed:{
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getTeacherCNO"])
  },
  async mounted(){
    const serviceId = this.mainRoomInfo.serviceId;
    const userId = this.userInfo.userId;
    let {data: dataRes} = await this.getTeacherCNO({
      serviceId,
      userId
    })
    this.certificateNO = dataRes && dataRes.data ? dataRes.data.certificateNO : '';
    this.introduction = dataRes && dataRes.data ? dataRes.data.introduction : '';
  }
}
</script>
<style lang="less" scoped>
  @import "@/assets/less/global.less";
  .live_teacher_card{
   width: 100%;
   height: 267px;
   padding: 20px 20px 26px;
   background: #141A1F;
   border-bottom:10px solid #000;
   .title_state{
     .flexBox(flex-start, center, column);
     .avatar{
       width: 52px;
       height: 52px;
       border-radius: 50%;
       overflow: hidden;
       margin-bottom: 16px;
       img{
         width: 100%;
         height: 100%;
       }
     }
     .live_detail{
       .teacher{
        height: 22px;
        font-size: 18px;
        color: #FFFFFF;
        line-height: 22px;
       }
     }
   }
   .live_summary{
      font-size: 14px;
      color: #A9AEB8;
      line-height: 24px;
      margin-top: 21px;
      height: 48px;
      .more_hide;
      color: #FFFFFF;
   }
   .line{
     width: 100%;
     margin-top: 20px;
     border-bottom:1px solid #262A33;
   }
   .evaluate_wrap{
     height: 58px;
     .flexBox(space-between, center, row);
     span{
      height: 18px;
      font-size: 14px;
      color: #A9AEB8;
      line-height: 18px;
     }
   }
  }
</style>
