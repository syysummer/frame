<template>
  <div class="live_room_list_wrap" :class="[{onlyText: onlyText}]">
    <ul class="live_room_list" v-if="programList.length">
      <li @click="toggleProgram(item)" :class="['live_card', {isLiving: item.state === 1 && currentType === '1'}, {isCurrentPro: item.id == currentId }]" v-for="(item,index) in programList" :key="index"> 
        <div class="program_time">
          <span>{{item.timeTags}}</span>
          <div class="living_state" :class="[{isLiving: item.state === 1},{isEnd: item.state === 2 || item.state === 0}]">
            <img :src="programIcon(item.state,item.playback)" alt="" />
            <span>{{programState(item.state,item.playback)}}</span>
          </div>
        </div>
        <div class="content_wrap">
          <div class="live_type">
            <div class="type">{{item.topicName}}</div>
            <div class="author">{{item.teachers}}</div>
          </div>
          <div class="live_des">{{item.introduction}}</div>
        </div>
      </li>
    </ul>
    <div class="no_data" v-if="!programList.length">
      <EmptyState />
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import EmptyState from "@c/public/emptyState"
  export default {
    props: {
      onlyText: {
        type: Boolean,
        require: true,
      },
      programList:{
        type: Array,
        default: []
      },
      currentType: { // 当前是历史还是直播中 1直播中 2历史直播
        type: String,
        require: true
      },
      changeHistoryProgram: {
        require: false
      }
    },
    computed:{
      programIcon(){
        const stateMap = {
          0 : 'back_play',
          1 : 'playing',
          2 : 'ending',
          3 : 'will_play'
        }
        return (state,playback) => {
          const stateText = (state == 0 || state == 2) && playback ? stateMap[0] : (state != 0 && state != 2) ? stateMap[state] : stateMap[2];
          return require(`@/assets/img/live/${stateText}.png`)
        }
      },
      programState(){
        const stateMap = {
          0 : '回放',
          1 : '直播中',
          2 : '已结束',
          3 : '即将播出'
        }
        return (state,playback) => {
          const stateText = (state == 0 || state == 2) && playback ? stateMap[0] : (state != 0 && state != 2) ? stateMap[state] : stateMap[2];
          return stateText;
        }
      }
    },
    components:{
      EmptyState
    },
    data(){
      return {
        currentId: this.$route.params.id,
      }
    },
    methods:{
      toggleProgram(item){
        const { state, liveType, playback, id } = item;
        // playback有值代表是视频直播，已结束状态可以查看历史
        const messageMap = {
          1: '该节目没有回放，请观看其他节目！',
          2: '该节目未到播出时间，敬请期待！'
        }
        if(!playback && (state == 2 || state == 0)){
          this.$message.info({
            message: messageMap[1],
          })
          return;
        }
        if(state == 3){
          this.$message.info({
            message: messageMap[2],
          })
          return;
        }
        if(this.currentType == 1){ // 直播页
          if(state == 1){
            return;
          }else{
            this.$router.push(`/historyLive/${id}`);
          }
        }else{ // 历史回放页
          if(state == 1){
            this.$router.push(`/live`);
          }else{
            this.currentId = id;
            this.$emit('changeHistoryProgram', id);
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "@/assets/less/global.less";
  .live_room_list_wrap{
    width: 100%;
    height: 609px;
    background: #141A1F;
    &.onlyText{
      height: calc(100vh - 435px);
    }
    .live_room_list{
      height: 100%;
      .live_card{
        padding: 16px 19px 0px 16px;
        height: 116px;
        box-sizing: border-box;
        &:last-child{
          margin-bottom: 20px;
        }
        .flexBox(flex-start,flex-start,column);
        .program_time{
          width: 100%;
          height: 22px;
          font-size: 16px;
          font-weight: 400;
          color: #8994AC;
          line-height: 22px;
          padding-left: 12px;
          position: relative;
          .flexBox(space-between,center,row);
          span{
            height:16px;
            line-height: 16px;
          }
          &:after{
            content: '';
            display:block;
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #A9AEB8;
            left: -6px;
          }
          .living_state{
            width: 80px;
            height: 24px;
            .flexBox(center,center,row);
            img{
              width:12px;
              height: 12px;
              margin-right: 2px;
            }
            span{
              font-size: 14px;
              color: #2AAAFF;
            }
            &.isEnd{
              span{
                color:#A9AEB8;
              }
            }
            &.isLiving{
              background: #DD0227;
              span{
                color: #FFF;
              }
            }
          }
        }
        &.isLiving{
          background: #23262E;
          .program_time{
             color: #DD0227;
             &:after{
              background: #DD0227;
             }
          }
          .content_wrap{
            border-bottom: none;
            .live_type{
              .type{
                color: #FFF;
                font-weight:600;
              }
            }
          }
        }
        &.isCurrentPro{
          background: #23262E;
        }
        .content_wrap{
          width: 100%;
          height: 69px;
          padding: 2px 12px 22px;
          margin-top: 10px;
          border-bottom:1px solid #2B2D37;
          cursor: pointer;
          .live_type{
            .flexBox(flex-start,center);
            .type{
              font-size: 16px;
              color: #A9AEB8;
              font-weight: 600;
              line-height: 14px;
              margin-right: 20px;
            }
            .author{
              font-size: 14px;
              color: #A9AEB8;
              line-height: 14px;
            }
          }
          .live_des{
            font-size: 14px;
            color: #A9AEB8;
            line-height: 19px;
            margin-top: 12px;
            .single_hide;
          }
        }
      }
    }
    .no_data{
      padding-top: 50px;
    }
  }
</style>
