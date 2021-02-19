<template>
  <div class="back-top">
    <img src="@/assets/img/backTop.png" @click="toTop" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: ['productId'],
  data () {
    return {

    };
  },
  methods: {
    handleScroll () {
      let scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
    },
    toTop () {

      let top = document.documentElement.scrollTop || document.body.scrollTop;
      // 实现滚动效果 
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50;
        if (top <= 0) {
          clearInterval(timeTop);
        }
      }, 10);
    }

  },
  mounted () {
    window.addEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style lang="less" scoped>
.back-top {
  position: fixed;
  right: 50px;
  bottom: 30px;
  cursor: pointer;
  padding: 10px;
}
</style>
