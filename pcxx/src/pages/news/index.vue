<template>
  <div class="news_page_wrap">
    <div class="news_page">
      <NewsNavBar />
      <router-view />
    </div>
  </div>
</template>

<script>
import NewsNavBar from "@c/news/newsNavBar";
export default {
  metaInfo () {
    return {
      title: '财经新闻',
    }
  },
  components:{
    NewsNavBar
  }
}
</script>
<style lang="less">
  .news_page_wrap{
    width: 100%;
    height: 100vh;
    padding: 10px 0px;
    .news_page{
      width: 1208px;
      height: calc(100% - 60px);
      margin: 0 auto;
    }
  }
</style>
