<template>
  <div id="lists-cp">
    <ul v-if="ssrList.length" class="lists-box">
      <li
        v-for="item in ssrList"
        :key="item.newsId"
        @click="changeCurrentId(item.newsId,item.newsTitle)"
        :class="['list',{isActive:item.newsId === currentId},{withOutSummary: !needFrom},{withType: needType}]"
      >
       <div class="list-inner-item">
        <div class="refresh-recommend-btn" v-if="item.isRefreshBtn" @click="refreshRecommend">
          刷新啊
        </div>
        <div class="normal-content-box" v-else>
          <span class="list-dot" v-if="!needFrom"></span>
          <img class="head-img" v-if="needHeadImg" :src="item.headImgUrl+'?q=0.3'" alt="">
          <div class="title-box">
            <p :class="['title',{withImg: needHeadImg},{noWarp: !needFrom}]">
            <span
              v-if="needType"
            >{{$initTime(new Date(item.publishTime)).format('M-D')}}&nbsp;&nbsp;[{{item.columnName}}]</span>
              {{item.newsTitle}}
            </p>
            <span class="time" v-if="yearDate && type.parameter.columnID != 45 && !needType">{{$initTime(item.publishTime).format('Y-M-D')}}</span>
            <span class="time" v-else-if="!needFrom && !needType">{{$initTime(item.publishTime).format('H:m')}}</span>
          </div>
          <p v-if="needFrom && needSummary" class="summary">{{ deleteHtml(item.newsAbstract)}}</p>
          <div class="info" v-if="needFrom ">
            <div class="stock-source">
               <span v-if="item.isHot || item.isTop" :class="[{isHot: item.isHot},{isTop: item.isTop}]">
                {{item.isHot? '热' : item.isTop ? '置顶' : ''}}
               </span>
               <p
                class="stockname"
                v-if="needStock && item.newsStock"
              >{{item.newsStock ? checkStockName(item.newsStock) : ''}}</p>
              <span class="source">来源：{{item.from || item.source}}</span>
            </div>
            <div class="flex-grow-box"></div>
            <span class="time">{{$initTime(item.publishTime).format('M-D H:m')}}</span>
          </div>
        </div>
       </div>
      </li>
    </ul>
    <p v-else-if="!isSending" class="nothing">
      <img src="/img/nothing.png" alt="">
      <span>暂无内容</span>
    </p>
    <div :class="['loading-box',{isCenter: ssrList.length <= 0}]" v-if="isSending">
      <div class="loading"><img src="@/assets/img/loading.gif" alt="">正在加载...</div>
    </div>
  </div>
</template>

<script>
  import ArticleDetail from "@/components/news/articleDetail";
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    components: {
      ArticleDetail
    },
    props: {
      _currentId: {},
      yearDate: {
        type: Boolean,
        default: false
      },
      ssrList: {},
      // 获取的文章类型
      type: {
        type: Object,
        required: true
      },
      // 是否需要描述内容
      needSummary: {
        type: Boolean,
        default: false
      },
      // 标题开头是否显示类型
      needType: {
        type: Boolean,
        default: false
      },
      // 是否显示来自哪个股票
      needStock: {
        type: Boolean,
        default: false
      },
      // 是否显示内容来源
      needFrom: {
        type: Boolean,
        default: false
      },
      // 是否弹窗显示
      needDialog: {
        type: Boolean,
        default: false
      },
      // 是否显示头图
      needHeadImg: {
        type: Boolean,
        default: false
      },
      // 板块id
      blockindex: {
        default: false
      },
      // 相关股票
      stocks: {
        default: false
      },
      userStock: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        // 文章列表
        lists: [],
        // 当前文章的id
        currentId: this._currentId,
        // 是否正在发送请求
        isSending: false,
        parameter: {
          page: 1,
          count: 15,
          newsStocks: [], // ['sh00001']
          columnID: null,
          fromTime: null,
          toTime: null
        },
        articleDetail: {
          title: "",
          content: "",
          author: "",
          time: "",
          currentId: "",
          columnName: "",
        },
        dialogVisible: false,
        // 是否是自选内容
        isSelf: false,
      };
    },
    methods: {
      ...mapActions(["getArticleDetail"]),
      refreshRecommend() {
        this.$emit('refreshRecommend')
      },
      deleteHtml(content) {
        return content
          .replace(/<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g, '').replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "")
          .replace(/\s+/g, "")
          .replace(/<img.*/g, "")
      },
      checkStockName(codes) {
        codes = codes.split(",");
        for (let i = 0; i < codes.length; i++) {
          let e = codes[i];
          if (this.selfStockList[e]) {
            return this.selfStockList[e];
          }
        }
      },
      changeCurrentId(id, title) {
        this.currentId = id;
        this.$emit("changeCurrentId", id);
        if (!id) {
          this.articleDetail = {
            title: null,
            content: "暂无内容",
            author: null,
            time: null,
            currentId: null,
            columnName: null,
          };
          return;
        }
        // 如果不在终端，则进行网页弹窗
        if (!this.needDialog) return;
        if (!title) return;
      },
      async getArticleDetail(id) {
        this.dialogVisible = true;
        this.articleDetail = null;
        let {data} = await this.$axios(getArticleDetail({newsid: id})).catch(
          e => {
          }
        );
        let article = data[0];
        this.articleDetail = {
          title: article.newsTitle,
          time: article.publishTime,
          content: article.newsContent,
          author: article.from,
          currentId: this.currentId,
          columnName: article.columnName,
        };
      }
    },
    async mounted() {
      let dtbBox = document.querySelector("#lists-cp");
      let dtbCt = document.querySelector(".lists-box");
      let that = this;
      let infiniteDtb = () => {
        let scrollTop = dtbBox.scrollTop || dtbBox.scrollTop;
        let clientHeight = dtbCt.offsetHeight;
        let bodyHeight = document.querySelector("body").offsetHeight;
        if (parseInt(scrollTop) + bodyHeight > parseInt(clientHeight) - 300) {
          if (!that.isSending) {
            that.isSending = true;
            this.$emit('needMoreInfo')
          }
        }
      };
      dtbBox.addEventListener("scroll", infiniteDtb);
    },
    computed: {
      ...mapGetters(['userInfo']),
      selfStockList() {
        let selfStockList = {}
        this.userStock.forEach(e => {
          const code =
            e.mktType === "131073" ? `SZ${e.secuCode}` : `SH${e.secuCode}`;
          selfStockList[code] = e.secuName;
        })
        return selfStockList
      }
    },
    watch: {
      ssrList: {
        deep: true,
        handler() {
          this.isSending = false
        }
      }
    }
  };
</script>

<style lang="less" scoped>
@import '@/assets/less/global.less';
  #lists-cp {
    height: 100%;
    overflow: auto;
    overflow-y: scroll;
    .scrollBar;
    .lists-box {
      .list {
        padding: 0px 16px;
        margin: 1px;
        .list-inner-item{
          padding: 16px 0px;
          margin: 0;
          border-bottom: 1px solid #2B2D37;
        }
        &::after {
          content: "";
          display: block;
          height: 0;
          clear: both;
          visibility: hidden;
        }
        .head-img {
          width: 113px;
          height: 76px;
          float: left;
          margin-right: 16px;
        }
        .title-box {
          display: flex;
          .title {
            flex-grow: 1;
            font-size: 18px;
            color: #FFF;
            font-weight: bolder;
            cursor: pointer;
            margin-bottom: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              font-size: 14px;
              color: #666;
              margin-right: 10px;
            }
          }
          .noWarp {
            height: 20px;
            padding-right: 5px;
          }
          .withImg {
            margin-bottom: 11px;
            height: 44px;
            font-size: 16px;
            white-space: normal;
            margin-top: 0;
          }
          .time {
            min-width: 70px;
            color: #eee;
            text-align: right;
            padding-right: 10px;
          }
        }
        .summary {
          cursor: pointer;
          margin-bottom: 16px;
          text-align: justify;
          font-size: 16px;
          color: #A9AEB8;
          line-height: 26px;
          .more_hide;
        }
        .info {
          .flexBox(space-between, center);
          color: #A9AEB8;
          font-size: 14px;
          .stock-source{
            .flexBox(flex-start, center);
            .stockname{
              font-size: 13px;
              margin-right: 16px;
              color:#FF2323;
            }
            .source{
              max-width: 120px;
              .single_hide;
            }
          }
          .isHot {
            border: 1px solid #920b00;
            color: red;
            height: 18px;
            line-height: 14px;
            padding: 1px 3px;
            text-align: center;
            display: inline-block;
            margin-right: 7px;
            font-size: 12px;
          }
          .isTop {
            border: 1px solid #549ef4;
            color: #549ef4;
            height: 18px;
            padding: 1px 3px;
            line-height: 14px;
            font-size: 12px;
            text-align: center;
            display: inline-block;
            margin-right: 7px;
          }
        }
      }
      .withOutSummary {
        position: relative;
        padding: 2px;
        padding-left: 10px;
        .list-dot {
          position: absolute;
          display: block;
          top: 10px;
          left: 8px;
          border-radius: 50%;
          width: 5px;
          height: 5px;
          background-color: #a9a9a9;
        }
        .title-box {
          .title {
            padding-left: 10px;
            font-size: 14px;
            margin-bottom: 0 !important;
          }
          span {
            font-size: 12px;
          }
        }
      }
      .withType {
        .list-dot {
          display: none;
        }
        .title-box {
          .title {
            padding-left: 0;
          }
        }
      }
      .isActive {
        background: #2B2D37;
        &:hover{
          background: #2B2D37;
        }
      }
    }
    .nothing {
      color: #A9AEB8;
      padding: 20px;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        margin-left: 10px;
        color: #999;
      }
    }
    .loading-box {
      padding-top: 10px;
      text-align: center;
      color: #7f7f7f;
      .flexBox(center, flex-start);
      color:#A9AEB8;
      font-size: 14px;
      img{
        width: 20px;
        margin-right: 6px;
      }
    }
    .isCenter.loading-box {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }
</style>