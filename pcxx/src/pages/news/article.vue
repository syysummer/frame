<template>
  <div class="article-page" :class="{light: layout == 'light'}">
    <ArticleDetail :article="articleDetail" :layout="layout"/>
  </div>
</template>

<script>
  import { mapActions } from "vuex";
  import ArticleDetail from "@/components/news/articleDetail";
  export default {
    components: {
      ArticleDetail
    },
    data(){
     return {
        articleDetail: {
          title: '',
          time: '',
          content: '',
          author: '',
          currentId: '',
          columnName: '',
          readCnt: 0
        },
        layout: ''
     }
    },
    async created(){
      const id = this.$route.params.id;
      this.layout = this.$route.query.layout;
      let { data } = await this.getArticleResDetail({newsid: id});
      let article = data.data && data.data[0] ? data.data[0] : {};
      this.articleDetail = {
        title: article.newsTitle,
        time: article.publishTime,
        content: article.newsContent,
        author: article.from,
        currentId: id,
        columnName: article.columnName,
        readCnt: article.readCnt
      }
    },
    methods:{
      ...mapActions(["getArticleResDetail"])
    }
  };
</script>
<style lang="less" scoped>
  .article-page {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 10px 10px;
    box-sizing: border-box;
    background: #141A1F;
    &.light{
      background: #fff;
    }
  }
</style>