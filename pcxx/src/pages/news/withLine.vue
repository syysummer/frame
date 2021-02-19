<template>
  <div id="lists-with-line" class="individuation-scrollbar">
    <ul class="lists-box">
      <li
        v-for="item in lists"
        :key="item.newsId"
        class="list"
        :class="[{isActive: currentId === item.newsId}]"
        @click="changeCurrentId(item.newsId,item.newsTitle)"
      >
        <div class="dot"></div>
        <div class="contentZone">
          <div class="time">{{$initTime(item.publishTime).format('M-D H:m')}}</div>
          <div class="title">{{item.newsTitle}}</div>
          <div class="summary"><p>{{deleteHtml(item.newsAbstract)}}
          </p></div>
        </div>

      </li>
    </ul>
    <div :class="['loading-box',{isCenter: lists.length <= 0}]" v-if="isSeending">
      <div class="loading"></div>
      <p>loading....</p>
    </div>
  </div>
</template>

<script>
  import ArticleDetail from "@/components/news/articleDetail";
  import { mapActions } from "vuex";
  export default {
    components: {
      ArticleDetail
    },
    data() {
      return {
        typeList: {
          recommend: {
            title: "推荐",
            listStyle: {
              needSummary: false,
              needDialog: false,
              needType: false,
              needStock: false,
              needFrom: true,
              needHeadImg: true
            }
          },
          self: {
            title: "自选要闻",
            listStyle: {
              needSummary: true,
              needDialog: false,
              needType: false,
              needStock: true,
              needFrom: true
            }
          },
          39: {
            title: "要闻",
            listStyle: {
              needSummary: false,
              needDialog: false,
              needType: false,
              needStock: false,
              needFrom: true,
              needHeadImg: true
            }
          },
          42: {
            title: "机会",
            listStyle: {
              needSummary: true,
              needDialog: false,
              needType: false,
              needStock: false,
              needFrom: true
            }
          },
          43: {
            title: "公司",
            listStyle: {
              needSummary: true,
              needDialog: false,
              needType: false,
              needStock: false,
              needFrom: true
            }
          },
          45: {
            title: "7✖24小时",
            listStyle: {
              needSummary: false,
              needDialog: false,
              needType: false,
              needStock: false,
              needFrom: false
            }
          },
          51: {
            title: "大盘",
            listStyle: {
              needSummary: true,
              needDialog: false,
              needType: false,
              needStock: false,
              needFrom: true
            }
          },
          53: {
            title: "其他",
            listStyle: {
              needSummary: true,
              needDialog: false,
              needType: false,
              needStock: false,
              needFrom: true
            }
          }
        },
        type:{
          title: "",
          listStyle: {
            needSummary: false,
            needDialog: false,
            needType: false,
            needStock: false,
            needFrom: true
          }
        },
        lists: [],
        dialogVisible: false,
        articleDetail: null,
        parameter: {
          page: 1,
          count: 15,
          newsType: 1,
          newsStocks: null,
          columnID: null
        },
        isSeending: false,
        currentId: ''
      };
    },
    created() {
      this.isSeending = true
      const params = this.$route.params;
      const type = this.typeList[params.id] || {
        title: "",
        listStyle: {
          needSummary: false,
          needDialog: false,
          needType: false,
          needStock: false,
          needFrom: true
        }
      };
      const currentType = {
        text: type.title,
        listStyle: type.listStyle,
        parameter: {
          columnID: params.id === "self" ? null : params.id,
          newsType: params.newsType,
          otherType: typeof params.id === "number" ? null : params.id
        }
      };
      this.parameter.count = currentType.listStyle.needSummary ? 18 : 26;
      this.type = currentType;
      this.parameter.columnID = this.type.parameter.columnID;
      this.parameter.newsType = this.type.parameter.newsType;
      this._getNewsListsDate();
    },
    mounted() {
      let dtbBox = document.querySelector("#lists-with-line");
      let dtbCt = document.querySelector(".lists-box");
      let that = this;
      let infiniteDtb = () => {
        let scrollTop = dtbBox.scrollTop || dtbBox.scrollTop;
        let clientHeight = dtbCt.offsetHeight;
        let bodyHeight = document.querySelector("body").offsetHeight;
        if (parseInt(scrollTop) + bodyHeight > parseInt(clientHeight) - 300) {
          if (!that.isSeending) {
            that.isSeending = true;
            this.parameter.page++;
            this._getNewsListsDate();
          }
        }
      };
      dtbBox.addEventListener("scroll", infiniteDtb);
    },
    methods: {
      ...mapActions(["getNewsListsResDate"]),
      deleteHtml(content) {
        return content
          .replace(/<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g, '').replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "")
          .replace(/\s+/g, "")
          .replace(/<img.*/g, "")
      },
      changeCurrentId(id, title) {
        this.currentId = id;
        this.$popupWeb({
          url: `/article/${id}?layout=light`,
          title,
        })
      },
      async _getNewsListsDate() {
        let {data} = await this.getNewsListsResDate({
            ...this.parameter
        })
        let lists = data.data && data.data.newsList ? data.data.newsList : [];
        if (this.parameter.page === 1) {
          this.lists = [...lists];
        } else {
          this.lists.push(...lists);
        }
        this.isSeending = false;
      },
    }
  };
</script>

<style lang="less" scoped>
@import "@/assets/less/global.less";
#lists-with-line {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .scrollBar();
  &::before {
    display: block;
    content: "";
    position: absolute;
    top: 30px;
    left: 16px;
    width: 0;
    height: 0;
    z-index: 5;
  }
  .lists-box {
    width:1208px;
    margin: 0 auto;
    background-color: #141A1F;
    padding-top: 0;
    .list {
      position: relative;
      display:flex;
      flex-direction: row;
      &.isActive{
        .contentZone{
          background: #2B2D37;
        }
      }
      &:first-child{
        padding-top: 0px;
        .dot{
          width:38px;
          height:100%;
          position:absolute;
          left:-19px;
          border-right:1px solid #2B2D37;
          &::after {
            display: block;
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            top: 24px;
            left: 35px;
            border: 3px solid #A9AEB8; //每个list前面的圆点
            border-radius: 50%;
            z-index: 10;
          }
        }
        .contentZone{
          .time{
            padding:0px;
          }
        }
      }
      .dot{
        width:38px;
        height:100%;
        position:absolute;
        left:-19px;
        border-right:1px solid #2B2D37;
        &::after {
          display: block;
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          top:24px;
          left: 35px;
          border: 3px solid #A9AEB8; //每个list前面的圆点
          border-radius: 50%;
          z-index: 10;
        }
      }
      .contentZone{
        padding-left:20px;
        margin-left: 18px;
        .time {
          padding-top: 16px;
          padding-bottom: 16px;
          width: 362px;
          color:#A9AEB8;
        }
        .title {
          cursor: pointer;
          font-size: 18px;
          font-weight: 500;
          padding-bottom: 12px;
          color:#FFFFFF;
        }
        .summary {
          cursor: pointer;            
          width:1172px;
          padding-right: 18px;
          padding-bottom: 16px;
          border-bottom: 1px solid #2B2D37;
          p{
            overflow: hidden;
            text-overflow:ellipsis;
            font-size: 16px;
            color: #A9AEB8;
            display:-webkit-box;/*设置弹性盒模型*/
            -webkit-line-clamp:2;/*文本占的行数,如果要设置2行加...则设置为2*/
            -webkit-box-orient:vertical;/*子代元素垂直显示*/
          }
        }
      }
      &:hover {
        .title {
        }
      }
      &:first-child{
        .contentZone .time{
          padding-top: 16px;
          margin-bottom: 16px;
        }
      }
    }
  }
  .nothing {
    padding-left: 20px;
  }
  .loading-box {
    padding-top: 10px;
    text-align: center;
    color: #fff;
    .loading {
      margin: 0 auto;
    }
    p {
      margin-top: 5px;
      display: block;
      color:#aaa;
    }
  }
  .loading-box.isCenter {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
#lists-with-line .el-dialog__body {
  padding-top: 0;
}
#lists-with-line .article-dialog .content {
  padding: 0;
}
</style>