<template>
<div id="treedetail" >
    <div class="treedetail" @click="btn()" :style="indent">
        <span>{{flag ? '-' :'+'}}</span> 
        <span>{{title}}</span>
        </div>  
     <div  v-if="flag">
        <treedetail
        v-for="(item,index) in list" 
        :key="index"
        :title="item.name"
        :list='item.children'
        :num='num + 1'
        ></treedetail>
    </div>   
    </div>
</template>
<script>
export default {
    name:'treedetail',
    props:{
        title:{
            type:String,
            default:'名称'
        },
        list:{type:Array},
        num:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            flag:false
        }
    },
    methods:{
        btn(){
            this.flag=!this.flag
        }
    },
    computed:{
        indent(){
            return `transform: translate(${this.num*20}px)`; 
        }
    }

}
</script>