<template>
   <section class="swiper-content">
    <section class="carousel-wrap" id="carousel">
      <transition-group
        appear
        appear-class="custom-appear-class"
        appear-active-class="custom-appear-active-class"
        tag="ul" class="slide-ul"
        :name="animationName">
        <li
          v-for="(item,index) in articleL"
          :key="item.ob_content.url+index"
          v-show="index===currentIndex"
          @mouseenter="stop"
          @mouseleave="go"
          class="first-action"
        >
          <section>
            <img @click="checkAD(item)" :src="item.adUrl" target="_blank" :alt="item.AdName"/>
          </section>
        </li>
      </transition-group>
      <section v-if="articleL.length>1" class="carousel-items" @mouseenter="stop" @mouseleave="go">
        <span
          v-for="(item,index) in articleL.length"
          :class="{'active':index===currentIndex}"
          @click="change(index)"
          :key="item.picture"
        ></span>
      </section>
    </section>
  </section>
</template>

<script>
import { mapActions,mapState } from "vuex";
export default {
  props: ['productId'],
  data() {
    return {
      articleL: [],
      currentIndex: 0,
      timer: "",
      animationName: "next"
    }
  },
  computed:{
    ...mapState(["userInfo"]),
  },
  methods: {
    ...mapActions(["getAD"]),
    checkAD(item){
      if(item.LinkURL){
        this.$openwebview(item.LinkURL)
      }
    },
    changepage(type) {
      this.stop();
      switch (type) {
        case "left":
          this.currentIndex =
            this.currentIndex === 0
              ? this.articleL.length - 1
              : this.currentIndex - 1;
          break;
        case "right":
          this.currentIndex =
            this.currentIndex === this.articleL.length - 1
              ? 0
              : this.currentIndex + 1;
          break;
        }
        this.go();
      },
      go() {
        this.timer = setInterval(() => {
          this.autoPlay();
        }, 3000);
      },
      stop() {
        clearInterval(this.timer);
        this.timer = null;
      },
      change(index) {
        if(index === this.currentIndex){return}
        if (index > this.currentIndex) {
          this.animationName = "next";
        } else {
          this.animationName = "pre";
        }
        this.currentIndex = index;
      },
      beforeDestroy() {
        this.stop();
      },
      autoPlay() {
        this.currentIndex++;
        if (this.currentIndex > this.articleL.length - 1) {
          this.currentIndex = 0;
        }
      }
  },
  async mounted() {
    let {data: dataRes} = await this.getAD({
      productId: this.productId,
      recordcount: 10,
      userid: this.userInfo.userId
    })
    const list = dataRes && dataRes.data ? dataRes.data.info : [];
    list.map((e, index) => {
      if(e.Content){
        e.adUrl = JSON.parse(e.Content).url;
        e.LinkURL = e.LinkURL;
        e.ob_content = JSON.parse(e.Content);
      }
    })
    this.articleL = list;
    clearInterval(this.timer);
    this.$nextTick(() => {
      this.timer = setInterval(() => {
        this.autoPlay();
      }, 3000);
    });
  },
};
</script>
<style lang="less" scoped>
.ad-swiper-page{
  width: 100%;
  height: 100%;
  img{
    cursor: pointer;
  }
}
</style>
<style lang="less">
 .swiper-content {
    display: flex;
    width: 100%;
    height: 148px;
    overflow: hidden;
    justify-content: space-between;
    .carousel-wrap {
      position: relative;
      width: 100%;
      height: 148px;
      overflow: hidden;
      border-radius: 2px;
      &:hover .change-button {
        opacity: 1;
      }
      .change-button {
        width: 40px;
        height: 40px;
        display: block;
        color: #fff;
        position: absolute;
        top: 50%;
        transform: translateY(-40%);
        font-size: 24px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .left {
        left: 0;
        z-index: 20;
      }
      .right {
        right: 0;
      }
      .slide-ul {
        width: 100%;
        height: 100%;
        display: flex;
        li {
          position: absolute;
          width: 100%;
          height: 100%;
          section {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 148px;
            img {
              transition: all 0.4s ease;
              width: 100%;
              height: 148px;
              display: inline-block;
              position: relative;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              cursor: pointer;
            }
          }
        }
      }
      .carousel-items {
        position: absolute;
        z-index: 10;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        font-size: 0;
        span {
          display: inline-block;
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: transparent;
          cursor: pointer;
          font-size: 12px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: rgba(255, 255, 255, 0.4);
          line-height: 8px;
          border-radius: 50%;
        }
        .active {
          color: rgba(0, 0, 0, 0.8);
          background-color: rgba(255, 255, 255, 0.4);
        }
      }
      .next-enter-active {
        transition: all 10.5s ease;
        transform: translateX(0);
      }
      .next-leave-active {
        transition: all 10.5s ease;
        transform: translateX(-110%);
      }
      .next-enter {
        transform: translateX(100%);
      }
      .next-leave {
        transform: translateX(0);
      }
      .pre-enter-active {
        transition: all 10.5s ease;
        transform: translateX(0);
      }
      .pre-leave-active {
        transition: all 10.5s ease;
        transform: translateX(100%);
      }
      .pre-enter {
        transform: translateX(-110%);
      }
      .pre-leave {
        transform: translateX(0);
      }
      .custom-appear-class {
        font-size: 40px;
        color: red;
        background: green;
        transition: all 0s ease;
        transform: translateX(0);
      }
      .custom-appear-active-class {
        background: green;
        transform: translateX(0);
      }
      .first-action {
        transition: all 0s ease !important;
      }
    }
  }
</style>
