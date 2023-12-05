<template>
    <div id="app">
      <!-- <Loading :isTrue="istrue"></Loading>
      <Sollapse :title="title" :isshow="show"></Sollapse> -->
      <router-view v-if="isRouterAlive" />
    </div>
  </template>
  
  <script>
  
  import Chat from '@/components/chat.vue'
  export default {
    name: 'App',
    components:{
      Chat
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
        istrue: false,
  
        time: null,
        count: 0,
        title: "",
        show: false,
        ws: "",
        timer: "",
        id: '',
        timeshow: "",
        newmessage: "消息提示",
        messagelist: [],
        newjump: "",
        newmessagelist: [],
        Index: "",
        messagetz:"",
        messagetzs:"",
        alltime:"",
        ok:false,
        messageList:[],
  
  
      }
    },

    
  }
  </script>
  <style lang="scss">
  * {
    padding: 0;
    margin: 0;
  }
  
  
  ::-webkit-scrollbar {
    width: 0px;
    height: 0;
  
  }
  </style>
  