<template>
  <div class="topTenViews-container">
    <div class="line-title">
      <span>热门观点</span
      ><span @click="$openwebview(`/views`)"
        >更多<img src="@/assets/img/contest/arrow_right.png" alt=""
      /></span>
    </div>
    <div class="views-box">
      <div :class="{ 'nodataBG-viewsRecommend': showNoDataBG }"></div>
      <ul>
        <li
          class="views-item"
          :key="index"
          v-for="(item, index) in list"
          @click="goDetail(item.viewId)"
        >
          <h4 class="single_hide">{{ item.viewKitsTitle }}</h4>
          <div class="desc">
            <p>
              <img
                class="avatar"
                :src="tgwImgHandle(item.publishHeadAddress)"
              />
              <span>{{ item.publishUserName }}</span>
            </p>

            <span>{{ item.readCount }}人看过</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { tgwImgHandle } from "@/utils/common";

export default {
  data () {
    return {
      list: [],
      queryType: 2,
      showNoDataBG: false
    };
  },
  methods: {
    ...mapActions(["postTop10Views"]),
    tgwImgHandle (...arg) {
      return tgwImgHandle(...arg);
    },
    async handleViewKits () {
      try {
        let { data: res } = await this.postTop10Views({
          app: 6,
          begin: 0,
          productIds: "7",
          publishType: 1,
          size: 10
        });
        this.list = res.data;
      } catch (err) {
        // console.log("hotviews:");
        // console.log(err);
        if (err === '404') {
          this.showNoDataBG = true;
        }
      }
    },
    goDetail (viewId) {
      this.$router.push({ path: `/topTenDetail/${viewId}` })
    }
  },
  async mounted () {
    this.handleViewKits();
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/less/global.less";
.topTenViews-container {
  background-color: #141a1f;

  .line-title {
    height: 36px;
    padding: 0px 16px;
    width: 100%;

    background-color: #141a1f;
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
    span:nth-of-type(1) {
      font-size: 16px;
      line-height: 34px;
      color: #ffffff;
    }
    span:nth-of-type(2) {
      font-size: 13px;
      line-height: 34px;
      color: #a2a7b2;
      float: right;
      cursor: pointer;
    }
    img {
      height: 10px;
    }
  }

  .views-box {
    text-align: justify;
    padding: 0px 12px;
    // height: 1150px;

    .nodataBG-viewsRecommend {
      width: 140px;
      height: 266px;
      background: #141a1f url(../../assets/img/no_data.png) center center
        no-repeat;
      margin: 0 auto;
    }
    .views-item {
      padding: 16px 0px;
      border-bottom: 1px solid #2f2f2f;
      cursor: pointer;
      h4 {
        font-size: 16px;
        color: #ffffff;
        line-height: 20px;
        .single_hide;
      }
    }

    .views-item:last-child {
      border-bottom: none;
    }
    .desc {
      margin-top: 10px;
      line-height: 20px;
      height: 20px;
      display: flex;
      justify-content: space-between;
      span {
        font-size: 14px;
        color: #a9aeb8;
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
    }
  }
}
</style>
