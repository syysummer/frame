<template>
  <div class="subject-grade">
    <div class="like-box">
      <p class="like" @click="appraise(1)">
        <img :src="likeImg(likeStatus)" alt="">
        <span>{{likeCount}}</span>
      </p>
      <p class="unlike" @click="appraise(2)">
        <img :src="unlikeImg(likeStatus)" alt="">
        <span>{{unlikeCount}}</span>
      </p>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    props: {
      kid: {
        required: true
      },
      likeType: {
        required: true
      },
      detail: {
        required: true
      }
    },
    data() {
      return {
        likeCount: 0,
        unlikeCount: 0,
        likeStatus: 0, // 0 无状态， 1 喜欢， 2 踩
      }
    },
    computed:{
      ...mapState(['userInfo']),
      likeImg(){
        const subPath = this.likeStatus === 1 ? 'liked':'like';
        return (likeStatus) => {
          return require(`@/assets/img/${subPath}.png`);
        }
      },
      unlikeImg(){
        const subPath = this.likeStatus === 2 ? 'unliked':'unlike';
        return (likeStatus) => {
          return require(`@/assets/img/${subPath}.png`);
        }
      }
    },
    methods: {
      ...mapActions(["getIsLike","likeOrCancel","unlikeOrCancel"]),
      async appraise(status) {
        if (this.userInfo.userType == '2') {
          if (typeof NimCefWebInstance != "undefined") {
            // 去登录
            NimCefWebInstance.call("JumpLoginPages", function (error, result) {
            });
          }
          return
        }
        const {
          title,
          section,
          author,
          entry,
          type
        } = this.detail;
        // TODO: 发送请求，改变点赞状态
        if (status === 1) {
          await this.likeOrCancel({
            kid: this.kid,
            likeType: this.likeType,
            userId: this.userInfo.userId
          })
        } else {
          await this.unlikeOrCancel({
            kid: this.kid,
            likeType: this.likeType,
            userId: this.userInfo.userId
          })
        }
        this.getLikeCount()
      },
      async getLikeCount() {
        let {data: likeRes} = await this.getIsLike({
            kid: this.kid,
            likeType: this.likeType,
            userId: this.userInfo.userId
          }).catch(e => {
          return {
            data: {}
          }
        })
        // 无人点赞就连最基本的数据都不返回，所以要加这个判断 呵呵
        let data = likeRes.data && likeRes.data.length 
          ? likeRes.data[0] 
          : {
            likeCount: 0,
            unlikeCount: 0,
            isLike: 0,
            isUnLike: 0
          }
        this.likeCount = data.likeCount || 0
        this.unlikeCount = data.unLikeCount || 0
        this.likeStatus = data.isLike === 1 ? 1 : data.isUnLike === 1 ? 2 : 0
      }
    },
    created() {
      this.getLikeCount()
    },
    watch: {
      kid() {
        this.getLikeCount()
      }
    }
  };
</script>

<style lang="less" scoped>
@import "@/assets/less/global.less";
.subject-grade {
  min-width: 100px;
  max-width: 150px;
  height: 24px;
  p {
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    font-size: 14px;
  }
  .like-box {
    display: flex;
    justify-content: space-around;
    p {
      margin: 0;
      font-size: 12px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 18px;
        margin-right: 7px;
        margin-left: 6px;
      }
    }
    .like {
      color: #AE2626;
      img {
        margin-bottom: 6px;
      }
    }
    .unlike {
      color: #999999;
      img {
        margin-top: 6px;
      }
    }
  }
}
</style>
