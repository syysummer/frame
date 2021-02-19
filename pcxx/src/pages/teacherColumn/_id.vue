<template>
  <div class="container">
    <div class="left-box">
      <div class="head-box">
        <h2>{{ view.viewKitsTitle }}</h2>

        <p class="teacher">
          <span>{{
            analysisStrangeTimeFormat(view.publishTime, "MM-dd HH:mm")
          }}</span>
          <span>{{ view.readCount }}人看过</span>
        </p>
      </div>
      <div class="content-box tgw-content" v-html="view.noPayContent"></div>
      <div class="footer-box">
        <p>
          风险提示：本产品所载信息仅供参考，请阁下在进行投资操作时，坚持审慎、理性的原则，综合考虑投资风险。
        </p>
      </div>
    </div>
    <div class="right-box">
      <div class="teacher-info">
        <img
          v-if="view.publishHeadAddress"
          class="avatar"
          :src="tgwImgHandle(view.publishHeadAddress)"
          @click="$openwebview(`/teacher/${view.publishUserId}`)"
        />
        <p
          class="teacher-name"
          @click="$openwebview(`/teacher/${view.publishUserId}`)"
        >
          {{ view.publishUserName }}
        </p>
        <p class="teacher-certNo">执业证号：{{ view.certificateNo }}</p>
        <p class="teacher-intro">
          个人简介：华讯股票会员专属直播间，由华讯研究院专业投研团队为你服务！
        </p>
        <div class="teacher-info-bottom">
          <p>你的评价是我们的动力：</p>
          <div>赞 反对</div>
        </div>
      </div>
      <div class="hotview-box">
        <hotView
          v-if="view.viewId"
          :viewId="view.viewId"
          :pagesize="6"
        ></hotView>
      </div>
    </div>
    <backTop />
  </div>
</template>

<script>
import hotView from "@c/view/hotView";
import backTop from "@c/public/backTop"
import { mapActions } from "vuex";
import { tgwImgHandle, analysisStrangeTimeFormat } from "@/utils/common";

export default {
  metaInfo () {
    return {
      title: this.view.viewKitsTitle,
    }
  },
  components: {
    hotView,
    backTop
  },
  data () {
    return {
      viewid: this.$route.params.id,
      view: {},
      isAttention: 0,
      queryType: 1,
      userType: this.$store.state.userInfo.userType,
      loadAttention: 0,
    };
  },
  methods: {
    ...mapActions(["getViewKits", "getFollowUserState", "followUserhandle"]),
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
        followUserId: this.view.publishUserId,
        userId: this.$store.state.userInfo.userId,
        followUserType: 2,
        operateType: 1,
      });
      if (res.errcode == 0) {
        this.isAttention = 1;
        return false;
      }
      console.log(res);
    }
  },
  async mounted () {
    let { data: res } = await this.getViewKits({
      beginIndex: 0,
      recordCount: 1,
      app: 1,
      checkState: 1,
      queryType: this.queryType,
      sortType: 1,
      styleType: 0,
      viewType: 0,
      viewId: this.viewid,
      userId: this.$store.state.userInfo.userId,
    });
    this.view = res.list[0];

    let { data: fanInfo } = await this.getFollowUserState({
      app: 1,
      followUserId: this.view.publishUserId,
      userId: this.$store.state.userInfo.userId,
      followUserType: 2,
    });
    this.loadAttention = 1;
    this.isAttention = fanInfo.data.state;

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
  position: relative;
  width: 1208px;
  margin: 10px auto;
  .left-box {
    width: 844px;
    background-color: #141a1f;
    padding: 24px 40px;
    margin-bottom: 10px;
    h2 {
      font-size: 22px;
      color: #ffffff;
    }
    .head-box {
      position: relative;
      border-bottom: 1px solid #2b2d37;
      padding-bottom: 20px;
      .teacher {
        line-height: 20px;
        height: 20px;
        font-size: 14px;
        color: #a9aeb8;
        margin-top: 15px;
        span:nth-of-type(n + 2) {
          margin-left: 15px;
        }
      }
      .avatar {
        float: left;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        border-radius: 50%;
        vertical-align: bottom;
        background-size: 100% 100%;
      }
      a {
        position: absolute;
        top: 0px;
        right: 0px;
        color: white;
        background: -webkit-gradient(
          linear,
          right top,
          left top,
          from(#de0629),
          to(#fe824e)
        );
        background-image: url(../../assets/img/has_follow.png);
        border-radius: 2px;
        width: 80px;
        height: 32px;
        line-height: 32px;
        text-align: center;
      }
      a.isAttention {
        background: #2f313c;
      }
    }

    .content-box {
      padding-top: 15px;
      min-height: calc(100vh - 230px);
    }

    .footer-box {
      margin-top: 20px;
      p {
        color: #a9aeb8;
        font-size: 14px;
        text-align: center;
      }
    }
  }

  .right-box {
    position: absolute;
    top: 0;
    right: 0;
    width: 354px;
    margin-bottom: 10px;
    .teacher-info {
      width: 354px;
      height: 271px;
      background-color: #141a1f;
      padding: 20px 16px 0px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        display: block;
        width: 52px;
        height: 52px;
        margin-bottom: 16px;
      }
      .teacher-name {
        font-size: 18px;
        line-height: 22px;
        color: #ffffff;
        margin-bottom: 12px;
      }
      .teacher-certNo {
        font-size: 14px;
        line-height: 18px;
        color: #a9aeb8;
        margin-bottom: 16px;
      }
      .teacher-intro {
        font-size: 16px;
        line-height: 24px;
        color: #ffffff;
        padding-bottom: 16px;
        border-bottom: 1px solid #262a33;
      }
      .teacher-info-bottom {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 14px;
          color: #a9aeb8;
        }
      }
    }
  }
}
</style>