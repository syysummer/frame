
      

<template>
  <div class="container">
    <div class="top-bar">
      <div class="top-bar-left">
        <span class="top-title">名师专栏</span>
        <span>构建专属于您的操盘知识体系</span>
      </div>
      <div>选时·选股·买卖·风控·心态</div>
    </div>

    <div class="box-left">
      <div class="main-box">
        <div class="nav-sub">
          <span
            :class="currentColumnId == item.id ? 'active' : ''"
            :key="index"
            v-for="(item, index) in columnList"
            @click="handleCurrentColumn(item.id)"
            >{{ item.typeName }}</span
          >
        </div>
        <div class="list" v-if="!isLoading && viewlist.length">
          <ul>
            <li
              :key="item.index"
              v-for="item in viewlist"
              @click="$openwebview(`/view/${item.viewId}`)"
            >
              <img
                class="cover"
                v-lazy="tgwImgHandle(item.pictureInfo[0].pictureAddress)"
              />
              <div class="desc">
                <h4 class="single_hide">{{ item.viewKitsTitle }}</h4>
                <p class="single_hide">
                  {{ item.summary.replace(/\s*/g, "") }}
                </p>
                <p>
                  <!-- <img
                    class="avatar"
                    :src="tgwImgHandle(item.publishHeadAddress)"
                  /> -->
                  <span>{{ item.publishUserName }}</span>
                  <span>{{ item.readCount }}人看过</span>
                  <i>{{
                    analysisStrangeTimeFormat(
                      item.publishTime,
                      "yyyy-MM-dd HH:mm"
                    )
                  }}</i>
                </p>
              </div>
            </li>

            <div class="load_more" v-if="!isLastPage" @click="loadMore">
              点击加载更多
              <img src="@/assets/img/contest/jiantou_xiangxia.png" alt="" />
            </div>
            <div class="load_more" v-else>没有更多数据</div>
          </ul>
        </div>

        <div class="list" v-if="isLoading">
          <div class="loading" v-if="isLoading">
            <img src="@/assets/img/loading.gif" alt="" />正在加载...
          </div>
        </div>
        <div class="no-data" v-if="!isLoading && !viewlist.length">
          <EmptyState />
        </div>
      </div>
    </div>
    <div class="box-right">
      <div class="hotViews-box">
        <hotViews />
      </div>
    </div>
  </div>
</template>

<script>

import hotViews from "@c/view/topTenViews";
import EmptyState from "@c/public/emptyState";
import { mapActions } from "vuex";
import { tgwImgHandle, analysisStrangeTimeFormat, base64_decode } from "@/utils/common";

export default {
  metaInfo () {
    return {
      title: '名师专栏',
    }
  },
  components: {
    hotViews,
    EmptyState
  },
  data () {
    return {
      isLoading: true,
      isLoadingHot: true,
      isLastPage: false,
      currentColumnId: 0,
      columnList: [],
      parameter: {
        page: 1,
        size: 15,
      },
      hotview: [],
      viewlist: [],
      queryType: 1,
    };
  },
  methods: {
    ...mapActions(["getViewKits", "getColumnList"]),
    tgwImgHandle (...arg) {
      return tgwImgHandle(...arg);
    },
    analysisStrangeTimeFormat (...arg) {
      return analysisStrangeTimeFormat(...arg);
    },
    base64_decode (...arg) {
      return base64_decode(...arg);
    },
    async handleColumnList () {
      let { data: res } = await this.getColumnList({
        fileType: 6,
        count: 20,
        index: 0,
        productId: 6,
      });
      res.data.unshift({
        typeName: "全部",
        id: "0",
      });
      this.columnList = res.data;
    },
    handleCurrentColumn (id) {
      this.currentColumnId = id;
    },
    async handleViewKits () {
      try {
        let { data: res } = await this.getViewKits({
          beginIndex: (this.parameter.page - 1) * this.parameter.size,
          recordCount: this.parameter.size,
          app: 1,
          checkState: 1,
          queryType: this.queryType,
          sortType: 1,
          styleType: 0,
          viewType: 0,
        });
        if (this.parameter.page === 1) {
          this.viewlist = [...res.list];
        } else {
          this.viewlist.push(...res.list);
        }
        if (res.list.length < this.parameter.size || this.parameter.page * this.parameter.size >= res.total) {
          this.isLastPage = true;
        }
        this.isLoading = false;
      }
      catch (err) {
        this.viewlist = [];
        this.isLoading = false;
      }
    },
    loadMore () {
      this.parameter.page += 1;
      this.handleViewKits();
    },
  },
  async mounted () {
    try {
      let { data: res_hot } = await this.getViewKits({
        beginIndex: 0,
        recordCount: 3,
        app: 1,
        checkState: 1,
        queryType: 4,
        sortType: 2,
        styleType: 0,
        viewType: 0,
      });
      this.hotview = res_hot.list;
      this.isLoadingHot = false;
    }
    catch (err) {
      this.hotview = [];
      this.isLoadingHot = false;
    }
    this.handleViewKits();
    this.handleColumnList();
  },
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 1208px;
  margin: 10px auto;

  .top-bar {
    padding-right: 24px;
    height: 60px;
    line-height: 60px;
    width: 100%;
    background-color: #2f313c;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
    .top-bar-left {
      span.top-title {
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
        margin-right: 28px;
      }
      span {
        color: #a9aeb8;
        font-size: 16px;
      }
    }
  }

  .box-left {
    width: 844px;
    margin-bottom: 10px;

    .main-box {
      height: 100%;

      .nav-sub {
        background-color: #141a1f;
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #2f2f2f;
        span {
          font-size: 16px;
          margin-right: 32px;
        }
        span:first-child {
          margin-left: 28px;
        }
      }

      .line-title {
        font-size: 16px;
        padding: 0px 16px;
        line-height: 36px;
        height: 36px;
        background-color: #2f313c;
        border-top: 1px solid #000000;
        border-bottom: 1px solid #000000;
        p {
          line-height: 34px;
          font-size: 16px;
        }
      }

      .list {
        background-color: #141a1f;
        padding: 0px 16px;
      }
      .list li {
        padding: 16px 0px;
        border-bottom: 1px solid #2f2f2f;
        background-color: #141a1f;
        cursor: pointer;
      }
      .list li:last-child {
        border-bottom: none;
      }
      .list li .cover {
        width: 156px;
        height: 100px;
        float: left;
      }
      .list li .desc {
        text-align: justify;
        margin-left: 176px;

        h4 {
          font-size: 18px;

          font-weight: bold;
          line-height: 24px;
          display: inline-block;
          color: #ffffff;
          width: 100%;
        }

        p:nth-of-type(1) {
          color: #a9aeb8;
          font-size: 16px;
          line-height: 24px;
          height: 24px;
          overflow: hidden;
          margin-top: 10px;
        }

        p:nth-of-type(2) {
          height: 20px;
          line-height: 20px;
          margin-top: 17px;

          span {
            font-size: 14px;
            color: #a9aeb8;
            margin-right: 16px;
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
        i {
          float: right;
          color: #a9aeb8;
          font-size: 12px;
        }
      }

      .list .load_more {
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        color: #a9aeb8;
        cursor: pointer;
        text-align: center;
        height: 41px;
        img {
          width: 10px;
          margin-left: 5px;
        }
      }
    }
  }
  .box-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 354px;
    margin-bottom: 10px;

    .hotViews-box {
      margin-top: 61px;
    }
  }
  .loading {
    padding: 50px;
    color: #a9aeb8;
    font-size: 14px;
    display: flex;
    justify-content: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
  }
  .no-data {
    width: 100%;
    height: 250px;
    background-color: #141a1f;
    padding-top: 1px;
  }
}
</style>>
