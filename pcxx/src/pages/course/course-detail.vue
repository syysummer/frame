<template>
  <div class="container">
    <div
      class="video-box"
      @mouseenter="handleShowTitle(1)"
      @mouseleave="handleShowTitle(0)"
    >
      <div class="video">
        <div class="title-box" v-if="showTitle == 1">
          {{ lesson.lessonsName }}
        </div>
        <video autoplay controls controlslist="nodownload" ref="video">
          <source :src="lesson.videoUrl" type="video/mp4" />
        </video>
      </div>
    </div>
    <div class="teacher-box">
      <div class="info">
        <div class="info-head">
          <span class="lesson-name">{{ lesson.lessonsName }}</span>
          <span class="watched">{{ lesson.watchCount }}人学过</span>
        </div>
        <img
          v-if="lesson.teacherPic"
          class="avatar"
          :src="tgwImgHandle(lesson.teacherPic)"
        />
        <span>{{ lesson.teacherName }}</span>
      </div>
    </div>

    <div class="more-box">
      <div class="line-title">
        <b>{{ queryType == 1 ? "课程推荐" : "相关大赛视频" }}</b>
        <a @click="$openwebview(`/course`)"
          >更多<img src="@/assets/img/contest/arrow_right.png" alt=""
        /></a>
      </div>
      <courseList
        :size="5"
        :page="1"
        :isPage="false"
        :queryType="queryType"
        :columnId="0"
        :lessonsId="lessonsId"
      ></courseList>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { tgwImgHandle, analysisStrangeTimeFormat } from "@/utils/common";
import courseList from "@c/course/courseList.vue";
export default {
  metaInfo () {
    return {
      title: this.lesson.lessonsName,
    }
  },
  components: {
    courseList,
  },
  data () {
    return {
      lesson: {},
      queryType: this.$route.params.type,
      lessonsId: this.$route.params.id,
      parameter: {
        page: 1,
        size: 4,
      },
      isAttention: 0,
      loadAttention: 0,
      showTitle: 1,
      userType: this.$store.state.userInfo.userType,
    };
  },
  methods: {
    ...mapActions(["getLessonsList", "getFollowUserState", "followUserhandle"]),
    tgwImgHandle (...arg) {
      return tgwImgHandle(...arg);
    },
    analysisStrangeTimeFormat (...arg) {
      return analysisStrangeTimeFormat(...arg);
    },

    async handleAttention () {
      if (this.userType == 2) {
        // 没登录走登录
        this.$login({});
        return false;
      }
      let { data: res } = await this.followUserhandle({
        app: 1,
        followUserId: this.lesson.userId,
        userId: this.$store.state.userInfo.userId,
        followUserType: 2,
        operateType: 1,
      });
      if (res.errcode == 0) {
        this.isAttention = 1;
        return false;
      }
      console.log(res);
    },
    handleShowTitle (status) {
      if (this.$refs.video.paused) {
        this.showTitle = 1;
      }
      else {
        this.showTitle = status;
      }

    },
  },
  async mounted () {

    let { data: res } = await this.getLessonsList({
      beginIndex: 0,
      recordCount: 1,
      app: 1,
      lessonsType: this.queryType,
      onsaleState: 1,
      lessonsId: this.lessonsId,
      viewType: 3,
      userId: this.$store.state.userInfo.userId,
    });

    if (res.list.length > 0) {
      this.lesson = res.list[0];
      setTimeout(() => {
        this.$refs.video.src = this.lesson.videoUrl;
      }, 0);

      let { data: fanInfo } = await this.getFollowUserState({
        app: 1,
        followUserId: this.lesson.userId,
        userId: this.$store.state.userInfo.userId,
        followUserType: 2,
      });
      this.loadAttention = 1;
      this.isAttention = fanInfo.data.state;

    }

    this.$refs.video.addEventListener('play', this.handleShowTitle(0));
    this.$refs.video.addEventListener('pause', this.handleShowTitle(1));
  },
  watch: {
    $route (to, from) {
      this.$router.go(0)
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1208px;
  margin: 10px auto;

  .video-box {
    .video {
      border: 1px solid #141a1f;
      height: 678px;
      width: 1208px;
      position: relative;
      .title-box {
        position: absolute;
        top: 0;
        left: 0;
        height: 52px;
        background-color: #333333;
        width: 100%;
        line-height: 52px;
        padding: 0px 20px;
        opacity: 0.7;
        color: #ffffff;
        font-size: 18px;
      }

      video {
        background-color: #000;
        height: 678px;
        width: 1208px;
      }
    }
  }
  .teacher-box {
    padding: 20px 16px;
    background-color: #181b24;
    margin-top: 1px;
    .avatar {
      float: left;
      width: 24px;
      height: 24px;
      margin-right: 8px;
      border-radius: 50%;
      vertical-align: bottom;
      background-size: 100% 100%;
    }
    .info {
      position: relative;
      .info-head {
        margin-bottom: 16px;
        .lesson-name {
          font-size: 22px;
          color: #ffffff;
          margin-right: 24px;
        }
        .watched {
          font-size: 16px;
          color: #a9aeb8;
        }
      }
      span {
        font-size: 16px;
        color: #a9aeb8;
      }
    }
  }

  .more-box {
    background-color: #181b24;
    margin-top: 10px;

    .line-title {
      background-color: #2f313c;
      height: 32px;
      padding: 0px 16px;
      line-height: 32px;
      font-size: 16px;

      a {
        float: right;
        color: #a9aeb8;
        font-size: 13px;
        img {
          width: 10px;
        }
        cursor: pointer;
      }
    }

    .course-box {
      border-top: 1px solid #2b2d37;
      padding: 0px 0px 20px 0px;
      display: flex;
      flex-wrap: wrap;
      .video-card {
        margin-left: 18px;
        display: inline-block;
        width: 279px;
        overflow: hidden;
        padding-top: 0;
        background-color: #262a33;
        margin-top: 20px;

        .img-box {
          background-color: #000;
          width: 100%;
          height: 157px;
          overflow: hidden;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          cursor: pointer;
          position: relative;

          .play {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 32px;
            height: 32px;
          }

          .video-img {
            width: 100%;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          span {
            position: absolute;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.5);
            font-size: 12px;
            bottom: 0;
            right: 0;
            padding: 1px 2px;
          }
        }

        .title {
          cursor: pointer;
          font-size: 16px;
          font-weight: bolder;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 12px;
        }

        .other-info {
          color: #a9aeb8;
          font-size: 12px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          padding: 0px 12px 12px 12px;
          span {
            font-size: 14px;
          }
          .watched {
            flex-grow: 1;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
