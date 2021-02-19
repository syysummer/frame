<template>
  <div class="news_nav_bar">
    <div class="new_title_wrap">
      <img src="@/assets/img/teacherColumn/title-icon.png" alt="">
      <div class="news_title">财经资讯</div>
    </div>
    <ul class="nav_bar">
      <li class="nav_item" 
      :class="[{isActive: currentNewsType === item.path}]" 
      v-for="(item,index) in navLists" 
      :key="index"
      @click="toggleNews(item.path)"
      >{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data(){
    return {
      navLists: [
        {
          name: "推荐",
          path: "/news/1/recommend"
        },
        {
          name: "要闻",
          path: "/news/1/39"
        },
        {
          name: "7X24小时",
          path: "/news/1/45/withLine"
        },
        {
          name: "自选",
          path: "/news/1/self"
        },
        {
          name: "机会",
          path: "/news/1/42"
        },
        {
          name: "公司",
          path: "/news/1/43"
        },
        {
          name: "大盘",
          path: "/news/1/51"
        },
        {
          name: "公司",
          path: "/news/1/53"
        }
      ],
      currentNewsType: ''
    }
  },
  created(){
    this.currentNewsType = this.$route.path;
  },
  methods:{
    toggleNews(path){
      if(this.currentNewsType === path){return};
      this.currentNewsType = path;
      this.$router.push(path)
    }
  }
}
</script>
<style lang="less" scoped>
@import "@/assets/less/global.less";
.news_nav_bar{
  width: 100%;
  height: 60px;
  background: url("../../assets/img/teacherColumn/topBarBG.png");
  background-size:100% 100%;
  padding-left: 32px;
  .flexBox(flex-start,center);
  .new_title_wrap{
    .flexBox(space-between,center);
    width:100px;
    margin-right: 28px;
    img{
      width: 17px;
      height: 19px;
    }
    .news_title{
      height: 22px;
      font-size: 18px;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 22px;
    }
  }
  .nav_bar{
    .flexBox(flex-start,center);
    .nav_item{
      padding: 0 16px;
      height: 18px;
      font-size: 16px;
      color: #A9AEB8;
      line-height: 18px;
      cursor: pointer;
      &.isActive{
        color: #FF2323;
      }
    }
  }
}
</style>
