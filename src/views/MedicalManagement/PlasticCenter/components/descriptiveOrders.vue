<template>
  <!--描述性医嘱-->
  <div class="box">
    <div class="box-top">
      <!-- <div class="title">{{ title }}</div> -->
      <el-form size="mini" label-width="100px" style="margin-top: 10px">
        <el-row>
         
          <el-col :span="4">
            <span style="color:red;position:absolute;margin-left:18px">*</span>
            <el-form-item label="停嘱日期:">
              <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="mini">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="姓名:">
              <el-input />
            </el-form-item>
          </el-col> -->
        </el-row>
        <span style="color:red;position:absolute;margin-left:48px">*</span>
        <el-form-item label="备注:">
          <el-input v-model="remark" type="textarea" style="width: 70%;" maxlength="80"  />
          <el-button icon="el-icon-plus" type="primary" style="margin-left: 10px" @click="add" size="mini"> 添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="box-footer">
      <br>
      <div class="title">描述性医嘱</div>
      <el-table :data="listGroup" size="mini" style="width: 100%" border>
        <el-table-column prop="createBy" label="记录人" />
        <el-table-column prop="itemName" label="医嘱内容" />
        <el-table-column prop="createTime" label="记录时间" />
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" @click="newdelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <el-dialog title="" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!-- <span>这是一段信息</span> -->
      <span >   <span style="color:red;">*</span>停嘱日期：</span> <el-date-picker v-model="value1s" type="date" placeholder="选择日期" size="mini">
      </el-date-picker>
      <br>
      <div style="display: flex;align-items: center;">

       <span style="color:red;">*</span> 备注： <el-input v-model="remarks" type="textarea" style="width: 70%;margin-top: 30px;" maxlength="80" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="adds" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'DescriptiveOrders',
  props: {
    title: {
      type: String,
      default: 'dd',
      groupNums:'',
    }
  },
  props:['czHis'],
  watch:{
    'czHis': {
      deep: true,
      handler: function(newV) {
       this.search();
      }
    }
  },
  data() {
    return {
      listGroup: [],
      value1: '',
      remark: "",
      dialogVisible: false,
      value1s: "",
      remarks: "",
      medicalAdviceId:"",
      userId:"",
      descript:'',
      descripttime:'',
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId;
    this.userId=localStorage.getItem('userId')
    this.search();
    this.value1=this.getDate()
  },
  methods: {
    getDate() {
            var date = new Date() // 获取时间
            var year = date.getFullYear() // 获取年
            var month = date.getMonth() + 1 // 获取月
            var strDate = date.getDate() // 获取日
            let newmonth = month < 10 ? '0' + month : month
            return year + '-' + newmonth + '-' + strDate
        },
    newdelete(val) {
      let arr = [];
      arr.push(val.medicalAdviceId)
      this.$api.confinementRoom.RemoveroomNumbers(arr).then(res => {
        if (res.code == 200) {
          this.$message.success('删除成功');
          this.search();
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    adds() {
      if(this.value1s==null||this.value1s==''){
         this.$message.warning('请选择停嘱日期');
         return
      }
      if(this.remarks==''){
         this.$message.warning('请输入备注');
         return
      }
      let object=JSON.parse(localStorage.getItem('val'));
      
      let data={
         endTime: this.newDate(this.value1s) + ' ' + '00:00:00',
         itemName: this.remarks
      }
      let ids={
        id:localStorage.getItem('payId'),
        inHospitalId:object.inHospitalId,
        periodicType:"3",
        deptId:this.deptId,
        groupNum :this.groupNums,
        medicalAdviceId:this.medicalAdviceId
      }
     let datas=Object.assign(data,ids)
     let arr=[];
     arr.push(datas)
      this.$api.confinementRoom.cqeditBatch(arr).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false
          this.$message.success('修改成功');
          this.search();
        }
      })
    },
    edit(row) {
       this.dialogVisible = true;
       this.groupNums=row.groupNum;
       this.medicalAdviceId=row.medicalAdviceId;
       this.remarks=row.itemName;
       this.value1s=row.createTime;

    },
    search() {
      let inHospitalId;
      inHospitalId = localStorage.getItem('inHospitalId');
      let data = {
        inHospitalId: inHospitalId,
        pageNum: 1,
        pageSize: 20,
        periodicType: '3',
        deptId: this.deptId
      };
      this.$api.confinementRoom.listGroup(data).then(res => {
        let Data = [];
        res.rows.forEach(value => {
          value.forEach(values => {
            Data.push(values)
          })
        });
        this.listGroup = Data;

      })
    },
    newDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    add() {
      if(this.value1==null||this.value1==''){
         this.$message.warning('请选择停嘱日期');
         return
      }
      if(this.remark==''){
         this.$message.warning('请输入备注');
         return
      }
      
      let object=JSON.parse(localStorage.getItem('val'))
      let str = '';
      for (let i = 0; i < 8; i++) {
        str += Math.floor(Math.random() * 10)
      }
      let data={
         endTime: this.newDate(this.value1) + ' ' + '00:00:00',
         itemName: this.remark
      }
      let ids={
        id:localStorage.getItem('payId'),
        inHospitalId:object.inHospitalId,
        periodicType:"3",
        deptId:this.deptId,
        groupNum :str
      }
      
     let datas=Object.assign(data,ids)
     let arr=[];
     arr.push(datas);
      this.$api.confinementRoom.addBatch(arr).then(res => {
        if (res.code == 200) {
          this.$emit('change','1')
          this.$message.success('添加成功');
          this.search();
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  padding: 10px;

  .box-top {
    padding: 10px;
    height: 100px;
    border: 1px solid #c3ced5;
    border-radius: 5px;
    position: relative;
    margin-bottom: 15px;
  }

  .title {
    position: absolute;
    margin-top: -22px;
    margin-left: 10px;
    background-color: #e0f0fb;
  }

  .box-footer {
    padding: 10px;
    height: 300px;
    border: 1px solid #c3ced5;
    border-radius: 5px;
    position: relative;
    overflow-y: scroll;
  }
}
</style>
