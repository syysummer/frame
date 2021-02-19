<template>
  <div class="container">
    <div class="content-box">
      <div class="video-box">
        <div class="video">
          <video autoplay controls controlslist="nodownload" ref="video">
            <source :src="currentLesson.videoUrl" type="video/mp4" />
          </video>
        </div>
        <div class="video-info">
          <p>{{ currentLesson.lessonsName }}</p>
          <b>{{ currentLesson.watchCount }}人学过</b>
          <p>
            {{
              analysisStrangeTimeFormat(currentLesson.onsaleTime, "MM-dd HH:mm")
            }}
          </p>
        </div>
      </div>
      <div class="video-list">
        <p class="list-title">热门课程</p>
        <ul>
          <li
            :class="currentLesson.lessonsId === item.lessonsId ? 'active' : ''"
            :key="index"
            v-for="(item, index) in hotList"
            @click="handleCurrentLesson(item)"
          >
            <img v-lazy="tgwImgHandle(item.pic + '?cc=256x160')" />
            <div>
              <p>{{ item.lessonsName }}</p>
              <b>{{
                analysisStrangeTimeFormat(item.onsaleTime, "MM-dd HH:mm")
              }}</b>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="video-search">
      <div class="nav-video">
        <span
          :class="queryType == 1 ? 'active' : ''"
          @click="handleWinnerVideo()"
          >赢家宽屏</span
        >
        <span
          :class="queryType == 2 ? 'active' : ''"
          @click="handleQuickGuide()"
          >视频教学</span
        >
      </div>
      <div class="toolbar" v-if="queryType == 1">
        <!-- 栏目 -->
        <span
          :class="currentColumnId == item.id ? 'active' : ''"
          :key="index"
          v-for="(item, index) in columnList"
          @click="handleCurrentColumn(item)"
          >{{ item.typeName }}</span
        >
        <!-- 八大战法 -->
        <div class="tactic-bar">
          <span
            v-show="currentColumnId == 0"
            :class="currentTacticId == item.id ? 'active' : ''"
            :key="index + 'tactic'"
            v-for="(item, index) in tacticList"
            @click="handleCurrentTactic(item.id)"
            >{{ item.typeName }}</span
          >
          <span v-show="currentColumnId != 0">
            {{ currentColumn.describe }}
          </span>
        </div>
      </div>

      <courseList
        :size="parameter.size"
        :page="1"
        :isPage="true"
        :columnId="currentColumnId"
        :tacticId="currentTacticId"
      ></courseList>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { tgwImgHandle, analysisStrangeTimeFormat } from "@/utils/common";
import courseList from "@c/course/courseList.vue";
export default {
  components: {
    courseList,
  },
  metaInfo () {
    return {
      title: '学习园地',
    }
  },
  data () {
    return {
      currentLesson: {},
      hotList: [],
      columnList: [],
      currentColumn: {},
      tacticList: [
        { id: 2, typeName: "天机战法" },
        { id: 9, typeName: "多维共振" },
        { id: 10, typeName: "三星高照" },
        { id: 11, typeName: "场景选股" },
        { id: 12, typeName: "站高望远" },
        { id: 23, typeName: "王牌尊享" },
        { id: 24, typeName: "CK操盘" },
        { id: 28, typeName: "AI金手指" },

      ],
      queryType: 1,
      currentColumnId: 0,
      currentTacticId: 0,
      parameter: {
        page: 1,
        size: 8,
      },
    };
  },
  methods: {
    ...mapActions(["getLessonsList", "gethxColumnList"]),
    handleCurrentTactic (id) {
      this.currentTacticId = id;
      console.log(this.currentTacticId);

    },
    analysisStrangeTimeFormat (...arg) {
      return analysisStrangeTimeFormat(...arg);
    },
    tgwImgHandle (...arg) {
      return tgwImgHandle(...arg);
    },
    handleCurrentColumn (item) {
      this.currentColumnId = item.id;
      this.currentColumn = item;
      // console.log(this.currentColumnId);

    },
    handleWinnerVideo () {
      this.queryType = 1;//用于切换赢家宽屏
      //默认显示全部栏目的视频
      this.currentColumnId = 0;
    },
    handleQuickGuide () {
      this.queryType = 2;//用于切换视频教学
      //快速入门
      this.currentColumnId = 2351;
    },
    handleCurrentLesson (item) {
      this.currentLesson = item;
      setTimeout(() => {
        this.$refs.video.src = this.currentLesson.videoUrl;
      }, 0);
    },
    async handleColumnList () {
      let { data: res } = await this.gethxColumnList({
        count: 10,
        fileType: 2,
        index: 0,
        modularId: 2,
        productId: 5
      });
      res.data.unshift({
        typeName: "全部",
        id: "0",
      });
      res.data.splice(8, 1);//移除快速入门
      this.columnList = res.data;
    }
  },
  async mounted () {
    document.title = "学习园地"
    let { data: res } = await this.getLessonsList({
      beginIndex: 0,
      recordCount: 5,
      app: 6,
      lessonsType: 6,
      onsaleState: 1,
      productId: 5,
      userId: this.$store.state.userInfo.userId,
      viewType: 1
    });

    this.hotList = res.list;
    if (this.hotList.length > 0) {
      this.currentLesson = this.hotList[0];
      setTimeout(() => {
        this.$refs.video.src = this.currentLesson.videoUrl;
      }, 0);
    }

    this.handleColumnList();
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/less/global.less";
.container {
  position: relative;
  width: 1208px;
  margin: 10px auto;

  .line-title {
    padding: 0px 12px;
    background-color: #2f313c;
    height: 36px;
    margin-bottom: 1px;
    line-height: 36px;
    font-size: 16px;
  }
  .content-box {
    margin-top: 10px;
    position: relative;
    margin-bottom: 10px;
    .video-box {
      .video {
        height: 474px;
        width: 844px;
      }
      video {
        background-color: #000;
        border: 1px solid #141a1f;
        height: 474px;
        width: 844px;
      }

      .video-info {
        height: 80px;
        width: 844px;
        background-color: #141a1f;
        margin-top: 1px;
        padding: 16px 20px 14px 20px;

        p:nth-of-type(1) {
          display: inline;
          font-size: 18px;
          color: #ffffff;
          line-height: 22px;
        }
        b {
          float: right;
          font-size: 14px;
          color: #a9aeb8;
        }
        p:nth-of-type(2) {
          font-size: 12px;
          color: #a9aeb8;
          margin-top: 12px;
        }
      }
    }

    .video-list {
      position: absolute;
      top: 0;
      right: 0;
      width: 354px;
      height: 555px;
      background-color: #181b24;
      overflow-y: auto;
      .scrollBar;
      .list-title {
        padding: 5px 12px;
        background-color: #2f313c;
        margin-bottom: 1px;
        font-size: 16px;
      }

      li {
        padding: 12px;
        height: 104px;
        border-bottom: 1px solid #2b2d37;
        cursor: pointer;
        img {
          width: 128px;
          height: 80px;
          float: left;
        }

        div {
          margin-left: 140px;
          height: 80px;

          p {
            font-size: 16px;
            height: 20px;
            overflow: hidden;
            color: #ffffff;
          }
          b {
            padding: 46px 0px 0px 0px;
            display: block;
            font-size: 12px;
            color: #a9aeb8;
          }
        }
      }
      li.active {
        background-color: #2b2d37;
      }
      li:last-child {
        border-bottom: none;
      }
    }
  }

  .video-search {
    background-color: #141a1f;
    .nav-video {
      height: 48px;
      background-color: #2f313c;
      line-height: 48px;
      padding: 0px 32px;

      span {
        font-size: 18px;
        line-height: 48px;
        height: 46px;
        display: inline-block;
        cursor: pointer;
        position: relative;
      }
      span.active {
        color: #ff2323;
      }
      span:nth-child(1) {
        margin-right: 68px;
      }
      span.active::after {
        content: "";
        width: 24px;
        height: 2px;
        background: #ff2323;
        position: absolute;
        left: 50%;
        bottom: -1px;
        transform: translate(-50%);
        border-radius: 2px;
      }
    }
    .toolbar {
      height: 90px; //48px
      line-height: 48px;
      padding: 0px 16px;
      border-bottom: 1px solid #2b2d37;
      span {
        font-size: 14px;
        color: #a9aeb8;
        margin-right: 26px;
        cursor: pointer;
        position: relative;
      }
      span.active {
        color: #ffffff;
      }
      span.active::after {
        content: "";
        width: 12px;
        height: 2px;
        background: #ff2323;
        position: absolute;
        left: 50%;
        bottom: -8px;
        transform: translate(-50%);
        border-radius: 2px;
      }

      .tactic-bar {
        height: 42px;
        line-height: 42px;
      }
    }
    .list-box {
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

      .load_more {
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        color: #a9aeb8;
        cursor: pointer;
        text-align: center;
        height: 41px;
        width: 100%;
        margin-top: 20px;
        img {
          width: 10px;
          margin-left: 5px;
        }
      }
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
</style>
