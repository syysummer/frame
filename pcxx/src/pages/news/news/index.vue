<template>
  <div id="lists-article">
    <div class="box-layout">
      <div class="list-wrap">
        <Lists
          @refreshRecommend="refreshRecommend"
          @needMoreInfo="getMoreInfo"
          @changeCurrentId="changeCurrentId"
          class="lists"
          :type="currentType"
          :needSummary="currentType.listStyle.needSummary"
          :needFrom="currentType.listStyle.needFrom"
          :needStock="currentType.listStyle.needStock"
          :needHeadImg="currentType.listStyle.needHeadImg"
          :blockindex="blockindex"
          :stocks="stocks"
          :ssrList="articleLists"
          :_currentId="currentId"
          v-if="isListReady"
          :userStock="userStock"
        />
        <div class="loading" v-if="!isListReady">
          <img src="@/assets/img/loading.gif" alt="">正在加载...
        </div>
      </div>
      <ArticleDetail :article="articleDetail" class="detail"/>
    </div>
  </div>
</template>

<script>
  import Lists from "@/components/news/list.vue";
  import ArticleDetail from "@/components/news/articleDetail.vue";
  import { mapActions, mapState } from "vuex";
  const validateHtmlTag = (str) => {
    //验证字符串中是否存在html的标签
    let reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g; //验证规则
    let result = str.match(reg);
    return result == null ? false : true;
  }
  const analyseContent = (ct) => {
    let hold = ct
    let content = "";
    if (!validateHtmlTag(hold)) {
      let arr = hold.split("\n");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].replace(/^\s+|\s+$/g, "") === "") {
          continue;
        }
        content += "<p class='content-p'>" + arr[i] + "</p>";
      }
    } else {
      content = hold;
    }
    content = content
      .replace(/\r/g, "")
      .replace(/\t/g, "")
      .replace(
        /\/res\/webimage\/admin/g,
        "http://www.tgw360.com/res/webimage/admin"
      );
    return content;
  }
  export default {
    components: {
      Lists,
      ArticleDetail
    },
    data() {
      return {
        isListReady: false,
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
        currentType: {
          listStyle:{}
        },
        blockindex: this.$route.query.blockindex,
        stocks: this.$route.query.stock,
        articleLists:[],
        parameter:{
          page: 1,
          count: 15,
          newsStocks: [], // ['sh00001']
          columnID: null,
          fromTime: null,
          toTime: null
        },
        lastRecommendNewsId: null,
        randomHotNum: Math.floor(Math.random() * 20),
        currentId: null,
        articleDetail: {
          title: "",
          time: "",
          content: "",
          author: "",
          currentId: "",
          columnName: "",
        },
        userStock: [],
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
      };
    },
    computed:{
      ...mapState(["userInfo"])
    },
    mounted() {
      this.initData();
    },
    methods: {
      ...mapActions([
        "getArticleResDetail",
        "getNewsListsResDate",
        "getSelfStockList",
        "getRecommenderNews",
        "getAllBlockStockList",
        "getRecommenderHistoryNews",
        "getSelfStockListOnlyStock"
      ]),
      initData(){
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
        this.type = type;
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
        this.currentType = currentType;
        this._getNewsListsDate(currentType);
      },
      async _getNewsListsDate(currentType){
        let lists = [];
        if (currentType.parameter.otherType === "recommend") {
          //  推荐文章试用不同的接口
          let {data: listRes} = await this.getRecommenderNews({
              ...this.parameter,
              hotNum: this.randomHotNum,
              userId: this.userInfo.userId
            });
          listRes = listRes.data ? listRes.data : {top:[],hot:[],recommend:[]};
          listRes.hot = listRes.hot && listRes.hot.length ? listRes.hot : [];
          listRes.top = listRes.top && listRes.top.length ? listRes.top : [];
          listRes.recommend = listRes.recommend && listRes.recommend.length ? listRes.recommend : [];
          if (this.parameter.page === 1) {
            listRes.top.forEach(e => {
              e.isTop = true;
              e.headImgUrl = e.newsImage[0].imageUrl;
              lists.push(e);
            });
            listRes.hot.forEach(e => {
              e.isHot = true;
              e.headImgUrl = e.newsImage[0].imageUrl;
              lists.push(e);
            });
            // lists.push({
            //   isRefreshBtn: true
            // })
          }
          listRes.recommend.forEach(e => {
            e.headImgUrl = e.newsImage[0].imageUrl;
            lists.push(e);
          });
          this.lastRecommendNewsId = lists[lists.length - 1].newsId;
        } else {
          if (
            currentType.listStyle.needStock ||
            currentType.parameter.otherType === "self"
          ) {
            //  如果需要股票信息或者是自选相关新闻，需要先去自选股
            let {data: stockData} = await this.getSelfStockListOnlyStock({
              userId: this.userInfo.userId
            })
            this.userStock = stockData ? stockData.data : [];
            this.parameter.newsStocks = this.userStock.map(e => {
              const code = e.mktType === "131073" ? `SZ${e.secuCode}` : `SH${e.secuCode}`;
              return code;
            });
          }
          // if (this.blockindex) { //暂不处理
          //   // 如果传了板块id，需要先去板块相关股票
          //   let {data: blockRes} = await this.getAllBlockStockList({blockindex: this.blockindex})
          //   console.log('kkkblockRes')
          //   blockRes.forEach(e => {
          //     this.parameter.newsStocks.push(`${e.exchange}${e.secucode}`);
          //   });
          // }
          if (this.stocks) {
            // 如果传了股票代码，则需要带上这些股票代码去请求列表
            this.parameter.newsStocks.push(...stocks.split(','));
          }
          // 获取列表
          let {data: listRes} = await this.getNewsListsResDate({
            ...this.parameter,
            ...currentType.parameter
          })
          listRes = listRes.data ? listRes.data : {newsList: []}
          lists = listRes.newsList.map(e => {
            e.headImgUrl = JSON.parse(e.imageUrl)[0].imageUrl;
            return e;
          });
        }
        if (this.parameter.page === 1 && !currentType.listStyle.needDialog) {
          this.articleLists = [...lists];
          this.currentId = this.articleLists[0] ? this.articleLists[0].newsId : null;
          // this.currentId改变后watch会监听currentId的变化去请求文章的数据
        } else {
          this.articleLists.push(...lists);
        }
        this.isListReady = true;
      },
      async getNewsListsDate() {
        let parameter = this.parameter;
        let currentType = this.currentType;
        let blockindex = this.blockindex;
        let stocks = this.stocks;
        let lists = [];
        let listRes = null;
        if (currentType.parameter.otherType === "recommend") {
          //  推荐文章试用不同的接口
          if (this.lastRecommendNewsId) {
            let {data: listResData} = await this.getRecommenderHistoryNews({
                newsId: this.lastRecommendNewsId,
                userId: this.userInfo.userId
              })
            listRes = listResData.data ? listResData.data : {top:[],hot:[],recommend:[]};
            listRes.hot = listRes.hot && listRes.hot.length ? listRes.hot : [];
            listRes.top = listRes.top && listRes.top.length ? listRes.top : [];
            listRes.recommend = listRes.recommend && listRes.recommend.length ? listRes.recommend : [];
          } else {
            let {data: listResData} = await this.getRecommenderNews({
                ...parameter,
                userId: this.userInfo.userId
              })
            listRes = listResData.data ? listResData.data : {top:[],hot:[],recommend:[]};
            listRes.hot = listRes.hot && listRes.hot.length ? listRes.hot : [];
            listRes.top = listRes.top && listRes.top.length ? listRes.top : [];
            listRes.recommend = listRes.recommend && listRes.recommend.length ? listRes.recommend : [];
            if (parameter.page === 1) {
              listRes.top.forEach(e => {
                e.isTop = true;
                e.headImgUrl = e.newsImage[0].imageUrl;
                lists.push(e);
              });
              listRes.hot.forEach(e => {
                e.isHot = true;
                e.headImgUrl = e.newsImage[0].imageUrl;
                lists.push(e);
              });
              lists.push({
                isRefreshBtn: true
              });
            }
          }
          listRes.recommend.forEach(e => {
            e.headImgUrl = e.newsImage[0].imageUrl;
            lists.push(e);
          });
          this.lastRecommendNewsId = lists[lists.length - 1].newsId;
        } else {
          if (
            currentType.listStyle.needStock ||
            currentType.parameter.otherType === "self"
          ) {
            // 自选
            this.parameter.newsStocks = this.userStock.map(e => {
              const code =
                e.mktType === "131073" ? `SZ${e.secuCode}` : `SH${e.secuCode}`;
              return code;
            });
          }
          // 获取列表
          let {data: listRes} = await this.getNewsListsResDate({
            ...this.parameter,
            ...currentType.parameter
          })
          listRes = listRes.data ? listRes.data : {newsList: []}
          lists = listRes.newsList.map(e => {
            e.headImgUrl = JSON.parse(e.imageUrl)[0].imageUrl;
            return e;
          });
        }
        if (parameter.page === 1 && !currentType.listStyle.needDialog) {
          this.articleLists = [...lists];
          this.currentId = this.articleLists[0]
            ? this.articleLists[0].newsId
            : null;
          await this.getArticleDetail(this.currentId);
        } else {
          this.articleLists.push(...lists);
        }
      },
      async refreshRecommend() {
        // todo: 这里准备做类似于头条的（xxx分钟观看到这，点击刷新）的效果
      },
      getMoreInfo() {
        this.parameter.page++;
        this.getNewsListsDate();
      },
      changeCurrentId(id) {
        this.currentId = id;
      },
      async getArticleDetail(id) {
        if (!id) {
          this.articleDetail = {
            title: null,
            content: "暂无内容",
            author: null,
            time: null,
            currentId,
            columnName: '',
            readCnt: 0
          };
          return;
        }
        let {data} = await this.getArticleResDetail({newsid: id});
        let article = data.data && data.data[0] ? data.data[0] : {};
        if (article.newsId == this.currentId) {
          this.articleDetail = {
            title: article.newsTitle,
            time: article.publishTime,
            content: article.newsContent,
            author: article.from,
            currentId: this.currentId,
            columnName: article.columnName,
            readCnt: article.readCnt
          };
        } else {
          console.log('不匹配')
        }
      }
    },
    watch: {
      currentId() {
        this.article = null;
        if(this.currentId){
          this.getArticleDetail(this.currentId);
        }
      },
      $route(to,from){
        this.isListReady = false;
        this.currentType = {
          listStyle:{}
        };
        this.blockindex = this.$route.query.blockindex;
        this.stocks = this.$route.query.stock;
        this.articleLists = [];
        this.parameter = {
          page: 1,
          count: 15,
          newsStocks: [], // ['sh00001']
          columnID: null,
          fromTime: null,
          toTime: null
        },
        this.lastRecommendNewsId = null;
        this.randomHotNum = Math.floor(Math.random() * 20);
        this.currentId = null;
        this.articleDetail ={
          title: "",
          time: "",
          content: "",
          author: "",
          currentId: "",
          columnName: "",
        };
        this.type = {
          title: "",
          listStyle: {
            needSummary: false,
            needDialog: false,
            needType: false,
            needStock: false,
            needFrom: true
          }
        };
        this.userStock = [];
        this.initData()
      }
    }
  };
</script>

<style lang="less" scoped>
@import "@/assets/less/global.less";
  #lists-article {
    width: 1208px;
    height: 100%;
    margin: 0 auto;
    color: #fff;
    .box-layout {
      display: flex;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
      justify-content: space-between;
      align-items: center;
      background:#000;
      .list-wrap{
        height: 100%;
        width: 34%;
        background: #141A1F;
        .lists {
          width:100%;
          height:100%;
        }
        .loading{
          .flexBox(center, flex-start);
          padding-top: 20px;
          color:#A9AEB8;
          font-size: 14px;
          img{
            width: 20px;
            margin-right: 6px;
          }
        }
      }
      .detail {
        height: 100%;
        width: 65%;
        background: #141A1F;
      }
    }
    .box {
      height: 100%;
    }
  }
</style>
<style scoped>
  #lists-article .box-layout .lists >>> .title {
    font-weight: 400 !important;
  }
  #lists-article .detail >>> h1 {
    font-weight: 400;
  }
</style>
