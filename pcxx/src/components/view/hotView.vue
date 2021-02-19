<template>
  <div class="view-container">
    <div class="line-title">
      <span>热门文章</span
      ><span @click="$openwebview(`/view`)"
        >更多<img src="@/assets/img/contest/arrow_right.png" alt=""
      /></span>
    </div>
    <div class="view-box">
      <ul>
        <li
          class="view-item"
          :key="index"
          v-for="(item, index) in list"
          @click="$openwebview(`/view/${item.viewId}`)"
        >
          <h4 class="single_hide">{{ item.viewKitsTitle }}</h4>
          <p class="desc">
            <img class="avatar" :src="tgwImgHandle(item.publishHeadAddress)" />
            <span>{{ item.publishUserName }}</span>
            <i>{{
              analysisStrangeTimeFormat(item.publishTime, "yyyy-MM-dd")
            }}</i>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { tgwImgHandle, analysisStrangeTimeFormat } from "@/utils/common";

export default {
  props: [
    "viewId",
    "pagesize"
  ],
  data () {
    return {
      list: [],
      queryType: 1,
    };
  },
  methods: {
    ...mapActions(["getViewKits"]),
    tgwImgHandle (...arg) {
      return tgwImgHandle(...arg);
    },
    analysisStrangeTimeFormat (...arg) {
      return analysisStrangeTimeFormat(...arg);
    },
    async handleViewKits () {
      let { data: res } = await this.getViewKits({
        beginIndex: 0,
        recordCount: this.pagesize,
        app: 1,
        checkState: 1,
        queryType: this.queryType,
        sortType: 1,
        styleType: 0,
        viewType: 0,
        investmentType: 0,
        serviceId: 0,
      });
      if (res.list.length > 0) {
        let index = res.list.findIndex(item => item.viewId == this.viewId);
        if (index != -1) {
          res.list.splice(index, 1);
        }
        else if (res.list.length == this.pagesize) {
          res.list.pop();
        }

        this.list = res.list;
      }
    },
  },
  async mounted () {
    this.handleViewKits();
  },
};
</script>

<style lang="less" scoped>
.view-container {
  background-color: #141a1f;

  .line-title {
    height: 36px;
    padding: 0px 16px;
    width: 354px;

    background-color: #2f313c;
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
  .view-box {
    padding: 0px 16px;
    text-align: justify;

    .view-item {
      padding: 16px 0px;
      border-bottom: 1px solid #2f2f2f;
      cursor: pointer;
      h4 {
        font-size: 16px;
        color: #ffffff;
        line-height: 21px;
        width: 100%;
      }
    }

    ul li:last-child {
      border-bottom: none;
    }
    .desc {
      margin-top: 20px;
      line-height: 20px;
      height: 20px;
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
      i {
        float: right;
        font-size: 12px;
        color: #a9aeb8;
      }
    }
  }
}
</style>