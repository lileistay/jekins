<template>
    <!--长嘱-->
    <div class="box">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="临时医嘱描述信息" name="first">
          <Longorderentrys :czHis="czHis"  :IsReloads="IsReloads" />
        </el-tab-pane>
        <el-tab-pane label="描述性临时医嘱信息" name="second">
          <descriptiveOrderss :czHis="czHis"  />
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script>
  import Longorderentrys from './Longorderentrys'
  import descriptiveOrderss from './descriptiveOrderss'
  export default {
    name: 'long0rder',
    components: {
      descriptiveOrderss,
      Longorderentrys
    },
    data() {
      return {
        activeName: 'first',
        title: '添加描述性医嘱'
      }
    },
    props:['czHis','IsReloads'],
  watch:{
    'czHis': {
      deep: true,
      handler: function(newV) {
      //  this.search();
      }
    },
    'IsReload': {
      deep: true,
      handler: function (newV) {
      }
    },
  },
  }
  </script>
  
  <style scoped>
  
  </style>