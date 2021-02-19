<template>
  <div id="article-detail-cp" :class="{light: layout == 'light'}">
    <div class="article-detail-inner">
    <h1 v-if="article">{{article.title}}</h1>
    <div class="options">
      <p
        class="time"
        v-if="article"
      >{{$initTime(article.time).format('Y-M-D H:m')}}
      </p>
      <div class="flex-grow-box">&nbsp;</div>
      <div class="font-setting">
        <span>字号:</span>
        <span @click="fontSize++" class="font-btn">大</span>
        <span @click="fontSize--" class="font-btn">小</span>
      </div>
    </div>
    <div v-if="article && article.title" :class="['exceptions-clause',{morePadding: !article || !article.title}]">风险提示：本产品所载信息仅供参考，请阁下在进行投资操作时，坚持谨慎、理性的原则，综合考虑投资风险。</div>
    <div class="content" v-show="article" ref="content" v-html="content"></div>
   </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    props: {
      article: {
        type: Object,
        default: null
      },
      layout:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        fontSize: 16
      };
    },
    watch:{
      fontSize(newValue){
        let content = this.$refs.content;
        let pList = content.children ? Array.from(content.children) : [];
        pList.forEach(e => { //暂时只处理两次嵌套
          e.style.fontSize = newValue + 'px';
          let spanList = e.children ?  Array.from(e.children) : [];
          spanList.forEach(el => {
            el.style.fontSize = newValue + 'px';
          })
        });
      }
    },
    methods: {
      validateHtmlTag(str) {
        //验证字符串中是否存在html的标签
        let reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g; //验证规则
        let result = str ? str.match(reg) : false;
        return result == null ? false : true;
      }
    },
    computed: {
      ...mapGetters(['getUserInfo']),
      content() {
        let hold = this.article && this.article.content;
        let content = "";
        if (!this.validateHtmlTag(hold)) {
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
        content = content && content
          .replace(/\r/g, "")
          .replace(/\t/g, "")
          .replace(
            /\/res\/webimage\/admin/g,
            "http://www.tgw360.com/res/webimage/admin"
          );
        return content;
      }
    }
  };
</script>

<style lang="less" scoped>
@import '@/assets/less/global.less';
  #article-detail-cp {
    height: 100%;
    padding: 24px 40px 24px;
    padding-bottom: 0px;
    overflow: auto;
    background: #141A1F;
    .scrollBar;
    .article-detail-inner{
      position: relative;
      min-height: 100%;
    h1 {
      height: 28px;
      font-size: 22px;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 28px;
      .single_hide;
    }
    .options {
      padding: 14px 0;
      display: flex;
      border-bottom: 1px solid #2B2D37;
      display:-webkit-flex;
      justify-content: space-between;
      align-items: center;
      .time {
        font-size: 14px;
        color: #A9AEB8;
        span {
          margin-left: 20px;
        }
      }
      .font-setting{
        font-size: 14px;
        color: #A9AEB8;
        span:nth-child(1){
          margin-right: 9px;
        }
        span:nth-child(2){
          margin-right: 7px;
          width: 20px;
          height: 20px;
          background: #2F313C;
          text-align: center;
          line-height: 20px;
          font-size: 14px;
          color: #FFFFFF;
          padding: 3px 4px;
          cursor: pointer;
        }
        span:nth-child(3){
          width: 20px;
          height: 20px;
          padding: 3px 4px;
          background: #2F313C;
          text-align: center;
          line-height: 20px;
          font-size: 14px;
          color: #FFFFFF;
          cursor: pointer;
        }
      }
    }
    .content {
      min-height: calc(100% - 65px - 30px - 10px);
      color: #FFFFFF;
      padding: 20px 0 60px;
      font-size: 16px;
      text-align: justify;
      img {
        max-width: 40%;
      }
    }
    .exceptions-clause {
      font-size: 14px;
      color: #A9AEB8;
      position: absolute;
      text-align: center;
      left: 0;
      right: 0;
      bottom: 24px;
    }
    .morePadding {
      padding-top: 90vh;
    }
   }
  }
  #article-detail-cp.light {
    background: #FFF;
    .scrollBarLight(0px);
    h1{
      font-size: 22px;
      font-weight: bold;
      color: #333333;
      line-height: 28px;
    }
    .options{
      .time {
        color:#999;
      }
      .font-setting{
        color: #999;
        span:nth-child(2),span:nth-child(3){
          background: #FFF0DE;
          color: #F6AC44;
        }
      }
    }
    .content{
      color: #333;
    }
    .exceptions-clause{
      color: #999;
    }
  }
</style>
<style scoped>
  .content >>> table {
    width: 90%;
    margin: 0 auto;
  }
  .content >>> p {
    margin-bottom: 20px;
    line-height: 1.5em;
  }
  .content >>> img {
    max-width: 90%;
  }

</style>
