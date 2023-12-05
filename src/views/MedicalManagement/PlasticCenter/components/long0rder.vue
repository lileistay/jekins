<template>
  <!--长嘱-->
  <div class="box">
    <el-tabs v-model="activeName" type="card" @tab-click="newClick">
      <el-tab-pane label="长嘱医嘱描述信息" name="first">
        <Longorderentry :czHis="czHis" :IsReloadnew="IsReloadnew" />
      </el-tab-pane>
      <el-tab-pane label="描述性长期医嘱信息" name="second">
        <descriptiveOrders :czHis="czHis" @change="newchange"   />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Longorderentry from './Longorderentry'
import descriptiveOrders from './descriptiveOrders'
export default {
  name: 'long0rder',
  components: {
    descriptiveOrders,
    Longorderentry
  },
  props:['czHis','IsReloadnew'],
  watch:{
    'czHis': {
      deep: true,
      handler: function(newV) {

      }
    },
    'IsReloadnew': {
      deep: true,
      handler: function (newV) {
      }
    },
  },
  data() {
    return {
      activeName: 'first',
      title: '添加描述性医嘱',
      newValue:{}
    }
  },
  methods:{
    newchange(val){

      // alert(val)
    },
    newClick(){
      
    }
  }
}
</script>

<style scoped>

</style>