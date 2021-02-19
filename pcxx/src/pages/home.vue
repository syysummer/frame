<template>
  <div class="home">
    <div class="area">
      <div class="circle leftCircle"></div>
      <div class="circle rightCircle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  mounted(){
    // "use strict"
    // var result = []; var a = 3; var total = 0; 
    // function foo(a) {
    //   var i = 0;
    //   for (; i < 3; i++) { result[i] = function() {
    //     console.log(i,a,'lll')
    //     total += i * a; console.log(total);
    //   }
    //  }
    // }
    // foo(1); result[0]();
    // result[1]();
    // result[2]();

    // const list = [1, 2, 3] 
    // const square = num => {
    //   return new Promise((resolve, reject) => { 
    //     setTimeout(() => {
    //       resolve(num * num)
    //     }, 1000)
    //   })
    // }
    // function test() { list.forEach((x,i)=> {
    //   setTimeout(async () => {
    //     const res = await square(x) 
    //       console.log(res)
    //     }, 1000 * i)
    //   })
    // }
    // test()
    // function reverseStr(str){
    //   return str.split('').reverse().join('');
    // }
    // reverseStr("www.baidu.com")


    // class Observer{
    //   constructor(){
    //     this.message = {}
    //   }
    //   on = (key, callBack) => {
    //     if(!this.message[key]){
    //       this.message[key] = [callBack]
    //     }else{
    //       this.message[key].push(callBack)
    //     }
    //   }
    //   emit = (key,agrs) => {
    //     if(!key || !this.message[key]) return
    //     this.message[key].forEach(ele => {
    //       ele(agrs)
    //     });
    //   }
    //   remove = (key) => {
    //      if(!key || !this.message[key]) return
    //      this.message[key] = null
    //   }
    // }

    // // 测试代码
    // const obs = new Observer();
    // obs.on('print000',(data) => {
    //   console.log(data)
    // })
    // obs.on('print111',(data) => {
    //   console.log(data)
    // })
    // obs.emit('print000','print000')
    // obs.emit('print111','print111')
    // obs.remove('print111')
    // console.log(obs.message.print111)
    // console.log( 10 & (7 - 1))
    
    // 请用冒泡排序算法将数组[B,A,E,C,D] 
    //  const arr = ['B','A','E','C','D'];
    //  for(let i = 0 ; i < (arr.length / 2) ; i++){
    //    for(let j = i + 1; j < (arr.length - i); j++){
    //      if(arr[j-1].charCodeAt() > arr[j].charCodeAt()){
    //        let tmp = arr[j-1];
    //        arr[j - 1] = arr[j];
    //        arr[j] = tmp;
    //      }
    //    }
    //  }
    //  console.log(arr,'aaa')

    // 遍历一遍数组找到较大的两个数
    // let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    // let Fmax = Math.max(arr[0],arr[1]);
    // let Smax = Math.min(arr[0],arr[1]);
    // arr.forEach((e,i) => {
    //   if(e > Fmax){
    //     Smax = Fmax
    //     Fmax = e
    //   }else if(e > Smax){
    //     Smax = e
    //   }
    // })
    // console.log(Fmax, Smax)
    let arr = [1,2];
    console.log(arr.constructor)
  }
}
</script>

<style lang="less">
.home{
  display: flex;
  display: -webkit-flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  .area{
    text-align: center;
    font-size: 20px;
    background: #fff;
    width: 300px;
    height: 200px;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    .circle{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 2px solid #000;
      &.leftCircle{
        transform: translateX(10px);
      }
      &.rightCircle{
        transform: translateX(-10px);
      }
    }
  }
}
</style>
