<template>
    <div id="tree">
        <treedetail
        v-for="(item,index) in list"
        :key="index"
        :title="item.name"
        :list="item.children"
        :num='0'
        >
        </treedetail>
    </div>
</template>
<script>

/**
 * 模拟一个树形结构图
 */
const list = [
   {
  name: "电子产品",
  children: [
    {
      name: "电视",
      children: [
        {
          name: "philips",
          children: [
            { name: "philips-A" },
            { name: "philips-B" },
            { name: "philips-C" }
          ]
        },
        {
          name: "Tcl",
          children: [
            { name: "Mac Air" },
            { name: "Mac Pro" },
            {
              name: "ThinlPad",
              children: [
                {
                  name: "ThinlPad-A",
                  children: [
                    { name: "ThinlPad-A-a" },
                    { name: "ThinlPad-A-b" },
                    { name: "ThinlPad-A-c" }
                  ]
                },
                { name: "ThinlPad-B" },
                { name: "ThinlPad-C" },
                { name: "ThinlPad-D" }
              ]
            }
          ]
        },
        { name: "海兴" }
      ]
    },
    {
      name: "电脑",
      children: [{ name: "acer" }, { name: "联想" }, { name: "惠普" }]
    },
    {
      name: "可穿戴的设备",
      children: [
        {
          name: "手环",
          children: [
            { name: "华为B5手环" },
            { name: "小米手环" },
            { name: "iphone手环" }
          ]
        }
      ]
    }
  ]
},
 {
  name: "其他产品",
  children: [
    {
      name: "电视",
      children: [
        {
          name: "philips",
          children: [
            { name: "philips-A" },
            { name: "philips-B" },
            { name: "philips-C" }
          ]
        },
        {
          name: "Tcl",
          children: [
            { name: "Mac Air" },
            { name: "Mac Pro" },
            {
              name: "ThinlPad",
              children: [
                {
                  name: "ThinlPad-A",
                  children: [
                    { name: "ThinlPad-A-a" },
                    { name: "ThinlPad-A-b" },
                    { name: "ThinlPad-A-c" }
                  ]
                },
                { name: "ThinlPad-B" },
                { name: "ThinlPad-C" },
                { name: "ThinlPad-D" }
              ]
            }
          ]
        },
        { name: "海兴" }
      ]
    },
    {
      name: "电脑",
      children: [{ name: "acer" }, { name: "联想" }, { name: "惠普" }]
    },
    {
      name: "可穿戴的设备",
      children: [
        {
          name: "手环",
          children: [
            { name: "华为B5手环" },
            { name: "小米手环" },
            { name: "iphone手环" }
          ]
        }
      ]
    }
  ]
 }
]
import treedetail from './menuDetail' 
export default{
    name:'tree',
    data(){
        return{list}
    },
    components:{treedetail}  //注册子组件
}
</script>
