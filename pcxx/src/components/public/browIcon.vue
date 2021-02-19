<template>
  <div class="emoji-icon">
    <span class="key-btn" @click="isShowBox = !isShowBox">
      <img src="@/assets/img/face.png" alt="">
    </span>
    <div class="emoji-box" v-show="isShowBox">
      <img
        v-for="index in 75"
        :src="'/img/face/face'+index+'.png'"
        @click="useFace(index)"
        alt
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import { emojiMap, emojiUrl } from "@/plugins/emojiMap";
export default {
  data() {
    return {
      isShowBox: false,
      emojiMap,
      emojiUrl
    };
  },
  methods: {
    checkClickEvent(e) {
      const emojiBoxDom = document.querySelector(".emoji-box");
      if (e.target === document.querySelector(".key-btn img")) return;
      if (!this.isShowBox) return;
      for (let i = 0; i < e.path.length; i++) {
        const k = e.path[i];
        if (k === emojiBoxDom) {
          return;
        }
      }
      this.isShowBox = false;
    },
    useFace(i) {
      this.isShowBox = false;
      this.$emit("useFace", i);
    }
  },
  mounted() {
    document.addEventListener("click", this.checkClickEvent);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkClickEvent);
  },
  watch: {
    isShowBox(v) {}
  }
};
</script>

<style lang="less" scoped>
.emoji-icon {
  position: relative;
  margin: 5px;
  .key-btn {
    cursor: pointer;
    font-size: 12px;
    width: 20px;
    height: 20px;
    display: block;
    text-align: center;
    img {
      width: 22px;
    }
  }
  .emoji-box {
    background-color: #fff;
    position: absolute;
    bottom: 30px;
    left: -5px;
    border: 1px solid #ccc;
    width: 300px;
    height: 150px;
    overflow-x: hidden;
    overflow-y: scroll;
    user-select: none;
    padding: 2px;
    img {
      cursor: pointer;
      margin: 3px;
      width: 25px;
      height: 25px;
    }
  }
}
</style>