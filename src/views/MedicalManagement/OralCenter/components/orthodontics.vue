<template>
  <!--正畸-->
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="正畸检查" name="first">
        <zhengji :xflag="xflag"/>
      </el-tab-pane>
      <el-tab-pane label="正畸计划" name="second" >
        <orthodonticProgram :xflag="xflag"></orthodonticProgram>
      </el-tab-pane>
      <el-tab-pane label="正畸过程" name="third">
        <newelectronicMedicalRecord :xflag="xflag"></newelectronicMedicalRecord>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import zhengji from './orthodonticExamination'
import orthodonticProgram from './orthodonticProgram'
import newelectronicMedicalRecord from './newelectronicMedicalRecord'
import {LOG2E} from "mathjs";
export default {
  name: "orthodontics",
  props:['zhengji'],
  data(){
    return{
      activeName:"",
      xflag:''
    }
  },
  components: {
    zhengji,
    orthodonticProgram,
    newelectronicMedicalRecord
  },
  created() {
  },
  watch:{
    doctorlist(val,val1){
      console.log(val,val1)
    },
    zhengji(val,val1){
      if (val.index==3){
        this.activeName='first'
        this.xflag=0
        console.log(this.xflag,'this.xflag')
      }
    }
  },
  methods:{
    handleClick(val){
      this.xflag=val.index
    }
  }
}
</script>

<style scoped>

</style>