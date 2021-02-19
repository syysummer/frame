<template>
  <div>
    <div class="course-box" v-if="!isLoading && list.length">
      <div
        class="video-card"
        :key="index"
        v-for="(item, index) in list"
        @click="$openwebview(`${'/course/public'}/${item.lessonsId}`)"
      >
        <div class="img-box">
          <img src="@/assets/img/play-btn.png" alt="" class="play" />
          <img
            v-lazy="tgwImgHandle(item.pic + '?cc=558x314&q=0.5')"
            class="video-img"
          />
        </div>
        <p class="title">{{ item.lessonsName }}</p>
        <p class="other-info">
          <span class="time">{{
            analysisStrangeTimeFormat(item.onsaleTime, "yyyy-MM-dd")
          }}</span>
          <span class="watched">{{ item.watchCount }}人学过</span>
        </p>
      </div>

      <div class="load_more" v-if="!isLastPage && isPage" @click="loadMore">
        点击加载更多
        <img src="@/assets/img/contest/jiantou_xiangxia.png" alt="" />
      </div>
      <div class="load_more" v-else-if="isPage">没有更多数据</div>
    </div>
    <div class="list" v-if="isLoading">
      <div class="loading" v-if="isLoading">
        <img src="@/assets/img/loading.gif" alt="" />正在加载...
      </div>
    </div>
    <div class="no-data" v-if="!isLoading && !list.length">
      <EmptyState />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import EmptyState from "@c/public/emptyState.vue"
import { tgwImgHandle, analysisStrangeTimeFormat } from "@/utils/common";
export default {
  props: {
    size: {
      default: 4
    },
    page: {
      default: 1
    },
    isPage: {
      default: false
    },
    columnId: {
      default: 0
    },
    lessonsId: {
      default: 0
    },
    tacticId: {
      default: 0
    }
  },
  components: {
    EmptyState
  },
  data () {
    return {
      isLoading: true,
      isLastPage: false,
      list: [],
      parameter: {
        page: this.page,
        size: this.size,
      },
    };
  },
  methods: {
    ...mapActions(["getLessonsList"]),
    tgwImgHandle (...arg) {
      return tgwImgHandle(...arg);
    },
    analysisStrangeTimeFormat (...arg) {
      return analysisStrangeTimeFormat(...arg);
    },
    async handleLessons () {
      console.log('handleLessons');

      let para = {
        beginIndex: (this.parameter.page - 1) * this.parameter.size,
        recordCount: this.parameter.size,
        app: 6,
        onsaleState: 1,
        productId: 5,
        userId: this.$store.state.userInfo.userId,
        viewType: 1
      }
      if (this.tacticId != 0) {
        para['subProductId'] = this.tacticId;//八大战法id
      } else if (this.tacticId == 0) {
        para['lessonsType'] = 6;//华讯学院课程
        para['columnId'] = this.columnId;
      }
      console.log(para);

      let { data: res } = await this.getLessonsList(para);

      if (this.lessonsId != 0) {
        let index = res.list.findIndex(item => item.lessonsId == this.lessonsId);
        if (index != -1) {
          res.list.splice(index, 1);
        }
        else if (res.list.length == this.parameter.size) {
          res.list.pop();
        }
      }

      if (this.parameter.page === 1) {
        this.list = [...res.list];
      } else {
        this.list.push(...res.list);
      }
      if (res.list.length < this.parameter.size || this.parameter.page * this.parameter.size >= res.total) {
        this.isLastPage = true;
      }
      this.isLoading = false;
    },
    loadMore () {
      this.parameter.page += 1;
      this.handleLessons();
    },
  },
  watch: {
    columnId (val) {
      this.isLoading = true,
        this.isLastPage = false,
        this.parameter.page = 1,
        this.handleLessons();
    },
    tacticId (val) {
      this.isLoading = true,
        this.isLastPage = false,
        this.parameter.page = 1,
        this.handleLessons();
    }
  },
  async mounted () {
    this.handleLessons();
  },
};
</script>

<style lang="less" scoped>
.course-box {
  background-color: #141a1f;
  padding: 0px 0px 20px 0px;
  display: flex;
  flex-wrap: wrap;

  .video-card-empty {
    display: inline-block;
    width: 279px;
    overflow: hidden;
    padding-top: 0;
    margin-top: 16px;
  }
  .video-card {
    margin-left: 18px;
    display: inline-block;
    width: 279px;
    overflow: hidden;
    padding-top: 0;
    background-color: #262a33;
    margin-top: 16px;

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
</style>