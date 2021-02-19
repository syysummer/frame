<template>
  <div class="teacher-grade" :class="[{verticle: styleType == 2}]">
    <p>您觉得老师讲的怎么样？</p>
    <div class="btn-box">
      <button @click="appraise(1)" class="perfect">完全看懂</button>
      <button @click="appraise(2)" class="good">基本看懂</button>
      <button @click="appraise(3)" class="bad">没看懂</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  props: {
    kid: {
      required: true
    },
    likeType: {
      required: true
    },
    detail:{
      required: false
    },
    styleType: { // 1 左右展示 2 上下展示
      require: false
    }
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(["appraiseProduct"]),
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
      const labelMap = {
        1: '完全看懂',
        2: '基本看懂',
        3: '没看懂'
      }
      let {data: resData} = await this.appraiseProduct({
        kid: this.kid,
        likeType: this.likeType,
        assessType: status,
        userId: this.userInfo.userId
      })
      const res = resData ? resData : {};
      if (res.data) {
        this.$message.success({
          message: res.errmsg,
        })
      } else {
        this.$message.error({
          message: res.errmsg,
        })
      }
    },
  },
  computed: {
  ...mapState(['userInfo'])
  }
};
</script>

<style lang="less" scoped>
  @import "@/assets/less/global.less";
  .teacher-grade {
    width: 100%;
    height: 60px;
    padding: 0px 12px;
    border-top: 1px solid #000;
    .flexBox(flex-start, center, row);
    p {
      height: 20px;
      font-size: 16px;
      color: #A9AEB8;
      line-height: 20px;
    }
    .btn-box {
      display: flex;
      margin-left: 24px;
      button {
        font-size: 12px;
        margin-right: 16px;
        width: 84px;
        height: 24px;
        line-height: 24px;
        border: none;
        outline: none;
        cursor: pointer;
      }
      .perfect {
        color: #A9AEB8;
        background: #2F313C;
      }
      .good {
        color: #E38900;
        background: #2F313C;
      }
      .bad {
        color: #A9AEB8;
        background: #2F313C;
      }
    }
    &.verticle{
      height: 100px;
      padding: 16px;
      .flexBox(space-between, flex-start, column);
      .btn-box {
        width:100%;
        .flexBox(space-between, center, row);
        margin-left: 0px;
        button{
          margin-right: 0px;
          width: 84px;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
</style>
