<template>
  <div class="ad-page">
    <img v-show="adUrl" :src="adUrl" @click="goAdPage" alt="">
  </div>
</template>

<script>
import { mapActions,mapState } from "vuex";
export default {
  props: ['productId'],
  data() {
    return {
      adDetail: {},
      adUrl: '',
      linkUrl: '',
      isLoading: false,
    };
  },
  computed:{
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapActions(["getAD"]),
    goAdPage(){
      if(this.linkUrl){
        this.$openwebview(this.linkUrl)
      }
    }
  },
  async mounted() {
    this.isLoading = true;
    let {data: dataRes} = await this.getAD({
      productId: this.productId,
      recordcount: 1,
      userid: this.userInfo.userId
    })
    const list = dataRes && dataRes.data ? dataRes.data.info : [];
    const adInfo = list[0] ? list[0] : [];
    this.adDetail = adInfo;
    if(adInfo.Content){
      this.adUrl = JSON.parse(adInfo.Content).url;
      this.linkUrl = adInfo.LinkURL
    }
    this.isLoading = false;
  },
};
</script>

<style lang="less" scoped>
.ad-page{
  width: 100%;
  height: 148px;
  img{
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
