<template>
  <div id="turnBox">
    <ul id="turnUl" :style="{ backgroundImage : 'url(' + activeObj.turntableBgc + ')',backgroundSize:'100% 100%',}">
      <li
        v-for="(item,index) in activeObj.prizeData"
        :key="index"
        :style="{webkitTransform: 'rotate(' + -item.angle + 'deg)'}"
      >
      </li>
    </ul>
    <button @click="startPlay" class="turnBtn"> </button>
  </div>
</template>

<script>
 export default {
   name: 'Home',
   data(){
      return {
        activeObj: {
          turntableBgc:"https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1566573650,566871104&fm=26&gp=0.jpg",
          prizeData:[
            {
              id: 1,
              prize: '10元优惠券'
            },
            {
              id: 2,
              prize: '20元优惠券'
            },
             {
              id: 3,
              prize: '30元优惠券'
            },
            {
              id: 4,
               prize: '40元优惠券'
            },
             {
              id: 5,
               prize: '50元优惠券'
            },
             {
              id: 6,
              prize: '60元优惠券'
            },
             {
              id: 7,
              prize: '70元优惠券'
            },
             {
              id: 8,
              prize: '80元优惠券'
            }
          ]

        },
        pIndex: 0, // 中奖物品的下标
        rotNum:  0, // 旋转圈数基数
        time: 5000, // 旋转时间
        timer: null, // 定时器
        oTurntable: '', // 旋转圆盘背景图
        type: 0, // 0 图片 1 汉字
        isRotate: false,
      }
    },   
    created() {
      this.activeObj.prizeData = this.autoRotate(this.activeObj.prizeData)
      console.log(this.activeObj.prizeData);
    },
    //渲染完了
    mounted() {
      this.oTurntable = document.querySelector('#turnUl');
      // 过度中属性用时5s
      this.oTurntable.style.webkitTransition = 'transform ' + this.time / 1000 + 's ease';
    },
    methods:{
      //自动生成角度添加到数组上
      autoRotate(arr) {
        if (arr.length) {
          let len = arr.length;
          let base = 360 / len;
          arr.forEach((item, index) => {
            // 指的是某个奖品区域的中间 : base/2
            item.angle = 360 - (base / 2 + index * base);
          });
        }
        return arr;
      },
      // 点击开始,请求接口抽奖
      async startPlay(){
        if(this.isRotate){return}
        const a = {
          prize: "50元和包券",
          id: 4
        }
        this.startBtn(a)
      },
      // 开始转动,通过奖项级别进行匹配:id 
      async startBtn(val) {
        const self = this
        self.activeObj.prizeData.forEach((i,d)=>{
          if(i.id == val.id){
            self.pIndex = d
          }
        })
        // 拿到相应的角度调旋转接口
        self.startrotate(self.activeObj.prizeData[self.pIndex].angle, () => {
          self.fulfillHandle(self.activeObj.prizeData[self.pIndex].prize);
        });
      },
      //开始旋转 angle角度  complete回调成功函数
      startrotate(angle, complete) {
        this.isRotate = true;
        // 相应的角度 + 满圈 只是在原角度多转了几圈 360 * 6
        let rotate = 2160 * (this.rotNum + 1) + angle;
        this.oTurntable.style.webkitTransform = 'rotate(' + rotate + 'deg)';
        clearTimeout(this.timer);
        // 设置5秒后停止旋转,处理接口返回的数据
        this.timer = setTimeout(() => {
          complete();
          console.log(this.rotNum, "this.rotNum++;")
          this.rotNum++;
          this.isRotate = false;
        }, this.time);
      },
      //得奖后的处理
      fulfillHandle(prizeName) {
        console.log('抽奖结果',prizeName);
        this.$emit('result',prizeName)
      },
    }
  }
</script>

<style lang="less" scoped>
 #turnBox {
    width: 545px;
    height: 544px;
    position: relative;
    overflow: hidden;
    margin: 0px auto;
    margin-top: 30px;
    background-position: center center;
    .turnBtn {
      position: absolute;
      width: 120px;
      height: 120px;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-59%);
      overflow: hidden;
      background: transparent;
      border: none;
      outline: none;
      z-index: 3;
    }
    ul {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-repeat: no-repeat;
      background-size: 100% auto;
      li {
        position: absolute;
        box-sizing: border-box;
        color: #7e250d;
        font-size: 15px;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        line-height: 20px;
        transform-origin: 50% 50%;
        img {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 20%;
        }
      }
    }
  }
</style>
