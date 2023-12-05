<template>
    <div class="container">
      <div class="Adjuvanttherapy">
        <div class="header">
          <div>
            <el-form ref="form" :model="form" :inline="true" label-width="80px" style="margin-top: 15px" size="mini">
              <el-form-item label="产品名称">
                <el-input v-model="form.projectName" clearable />
              </el-form-item>
              <el-form-item label="简码">
                <el-input v-model="form.shorCode" clearable style="width: 120px;" />
              </el-form-item>
              <el-form-item label="产品价格">
                <el-input v-model="form.priceOne" clearable style="width: 80px;" />
                <span>至</span>
                <el-input v-model="form.endpriceOne" clearable style="width: 80px;" />
              </el-form-item>
            </el-form>
          </div>
          <div style="margin-right: 20px">
            <el-button
              icon="el-icon-search"
              size="mini"
              type="primary"
              plain
              style="margin-right:3px"
              @click="getAuxiliary(true)"
            >搜索</el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              style="float: right;"
              icon="el-icon-close"
              @click="close"
            >关闭</el-button>
            <el-button
              size="mini"
              plain
              type="primary"
              style="float: right;"
              icon="el-icon-suitcase-1"
              @click="addAdvice"
            >保存</el-button>
          </div>
        </div>
        <div class="header_middle">
          <div class="left">
            <div class="formBody">
              <span class="itemment">产品类型</span>
              <el-tree
                :data="bookProjectList"
                :props="defaultProps"
                :highlight-current="false"
                style="margin-bottom: 15px;height: 350px;"
                @node-click="treeNodeClick"
              >
                <span slot-scope="{ node,data }" style="width: 100%" class="custom-tree-node">
                  <span style="width: 100%">
                    <b v-if="!data.departmentInfoVos" class="el-icon-document" />
                    <b v-else-if="node.expanded" class="el-icon-folder-opened" />
                    <b v-else class="el-icon-folder" />
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
            <div class="formBody formBody_bot">
              <el-form ref="form" :model="form" size="mini" label-width="120px">
                <el-form-item label="开嘱时间">
                  <el-date-picker
                    v-model="StartTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 190px;"
                  />
                </el-form-item>
                <el-form-item label="临嘱结束时间">
                  <el-date-picker
                    v-model="form.time"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 190px;"
                  />
                </el-form-item>
                <el-form-item label="用药频次">
                  <el-select v-model="form.chineseUse" placeholder="请选择" size="mini" filterable>
                    <el-option
                      v-for="dict in dict.type.cm_medication_frequency"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.label"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="给药途径">
                  <el-select v-model="lives" placeholder="请选择" size="mini" filterable>
                    <el-option
                      v-for="dict in liveList"
                      :key="dict.drugId"
                      :label="dict.drugDelivery"
                      :value="dict.drugId"
                    />
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="西药用药频次">
                  <el-select v-model="form.westUse" placeholder="请选择" size="mini" filterable>
                    <el-option
                      v-for="dict in dict.type.wm_medication_frequency"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.label"
                    />
                  </el-select>
                </el-form-item> -->
                <el-form-item label="滴速">
                  <el-input v-model="form.dropVelocity" style="width: 50px;" /> &nbsp;<span>滴/分</span>
                </el-form-item>
                <el-form-item label="天数">
                  <el-input v-model="form.days" style="width: 50px;" />
                </el-form-item>
                <!-- <el-form-item label="排序号">
                  <el-input v-model="form.name" style="width: 50px;" />
                </el-form-item> -->
              </el-form>
            </div>
          </div>
          <div class="middle">
            <div class="formBody formBody_middle">
              <span class="itemment">产品列表</span>
              <sg-table
                ref="table"
                size="mini"
                border
                :pagination="pagination"
                highlight-current-row
                :table-data="tableData"
                @size-change="changelistOne" @current-change="currentChange"
                :columns="columns"
                max-height="222"
              >
                <div slot="searchBar" />
                <template #custom="data">
                  <div v-if="data.props==='caozuo'">
                    <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                      添加
                    </a>
                  </div>
                  <div v-if="data.props === 'isDiscount'">
                  <div>{{ data.custom.isDiscount=='0'?'否':'是' }}</div>
                </div>
                </template>
              </sg-table>
              <el-table
                border
                size="mini"
                :data="tableDatalist"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                :style="{'font-size': '12px'}"
                style="width: 100%"
                :height="heisl"
              >
                <el-table-column label="产品名称" width="240" prop="projectName" />
                <el-table-column label="规格" width="80" prop="specs" />
                <el-table-column label="数量" prop="priceNum">
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.priceNum"
                      :min="1" 
                      size="mini"
                      style="width: 100%"
                      @input="changepriceTwos($event,scope.row)"
                    />
                    <!-- <input :placeholder="scope.row.priceNum" type="number" @input="changepriceTwos($event,scope.row)" class="changePrice" style="outline: none;width:80px;height: 24px;border: 1px solid #DCDFE6;"> -->
                  </template>
                </el-table-column>
                <el-table-column label="单价" prop="priceOne">
                  <template slot-scope="scope">
                    <!-- <input :placeholder="scope.row.priceTwo" type="number" @input="changepriceTwo($event,scope.row)" class="changePrice" style="outline: none;width:80px;height: 24px;border: 1px solid #DCDFE6;"> -->
                    <el-input-number
                      v-model="scope.row.priceOne"
                      :min="0.00" :max="10000000.01"
                      size="mini"
                      style="width: 100%"
                      @input="changepriceTwo($event,scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="总价" prop="totalPrices">
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.totalPrices"
                      :min="0.00" :max="1000.01"
                      size="mini"
                      disabled
                      style="width: 100%"
                      @input="() => $forceUpdate()"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="单位" prop="priceUnit" />
                <el-table-column label="每次用量" prop="eachTime">
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.dosage"
                      :min="0.1"
                      size="mini"
                      style="width: 100%"
                      @input="() => $forceUpdate()"
                    />
                    <!-- <input  type="text" @input="newchangepriceTwo($event,scope.row)" class="changePrice" style="outline: none;width:80px;height: 24px;border: 1px solid #DCDFE6;"> -->
                  </template>
                </el-table-column>
                <el-table-column label="用药单位" prop="dose_unit">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.unit" filterable @change="handleSelect(scope.row,$event)">
                      <el-option
                        v-for="item in price"
                        :key="item.value"
                        :label="item.productUnitName"
                        :value="item.productUnitId"
                        
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="priceTwo" label="操作" align="center" width="60">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="deleteClick(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="right">
            <div class="formBody formBody_right">
              <span class="itemment">处方模板</span>
              <el-table
                :data="table"
                max-height="150"
                border
                index="序号"
                size="mini"
                style="width: 100%;"
                @row-click="add"
              >
                <el-table-column prop="templateName" label="所有处方类型" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import SgTable from '@/components/Table'
  import { math } from '@/utils/math'
  import { getDicts } from '@/api/sysManger/dict/data'
  export default {
    name: 'Adjuvanttherapy',
    components: {
      SgTable
    },
    dicts: ['sys_normal_disable', 'whether', 'wm_medication_frequency', 'cm_medication_frequency'],
    data() {
      return {
        StartTime:'',
        liveList:[],
        lives:"",
        heisl:"",
        form: {
          projectName: '',
          shorCode: '',
          priceOne: '',
          endpriceOne: '',
          time:"",
          deptId:"",
          searchType:'2',
          dropVelocity:"",
          days:"",
        },
        price: [],
        table: [],
        bookProjectList: [],
        defaultProps: {
          children: 'departmentInfoVos',
          label: 'departmentName'
        },
        // 分页
        pagination: {
          show: true,
          pageNum: 1,
          pageSize: 20,
          total: 0,
          currentPage: 1
        },
        tableData: [],
        columns: [
          {
            lab: '产品名称',
            val: 'projectName'
          },
          {
            lab: '规格',
            val: 'specs',
            width: 80
          },
          {
          lab: '库存量',
          val: 'quantitySum',
          width: 80
        },
          {
            lab: '简码',
            val: 'projectName',
            width: 120
            // showOverflowTooltip: true
          },
          {
            lab: '价格',
            val: 'priceOne',
            width: 80
          },
          {
            lab: '价格2',
            val: 'priceTwo',
            width: 80
          },
          {
            lab: '单位',
            val: 'priceUnit',
            width: 80
          },
          {
            lab: '是否打折',
            val: 'isDiscount',
            custom: 'isDiscount',
            width: 100
          },
          {
            lab: '折扣',
            val: 'discountNumber',
            width: 80
          },
          {
            lab: '次数',
            val: 'priceNum',
            width: 80
          },
          {
            lab: '操作',
            val: 'caozuo',
            custom: 'caozuo',
            width: 80
          }
        ],
        tableDatalist: []
      }
    },
    watch:{
          $route(){
            this.tableData=[];
    this.tableDatalist=[];
    this.form.chineseUse =''
          this.lives = ''
          this.form.dropVelocity=''
          this.form.days=''
          }
    },
    computed: {
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId;
            }
        }
    },
    created() {
      this.priceunit()
      this.getBookProjectList();
      this.form.time = this.timenow();
    this.StartTime = this.timenow();

      this.deptId = this.$store.getters.departmentId;
      this.$api.confinementRoom.Route().then(res => {
              this.liveList=res.rows;
  })
  this.heisl=document.documentElement.clientHeight-500;
    },
    methods: {
      currentChange(e){
      this.pagination.pageNum=e[1];
      this.getAuxiliary();
    },
    changelistOne(e){
      this.pagination.pageSize=e[1];
      this.getAuxiliary();
    },
      timenow() {
      var d = new Date(), str = '';
      str += d.getFullYear() + '-';
      str += d.getMonth() + 1 + '-';
      str += d.getDate();
      return str;
    },
      close(){
        document.querySelectorAll('.tags-li-icon')[document.querySelectorAll('.tags-li-icon').length-1].click()
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
      handleSelect(val,sel){
        let arr=this.tableDatalist;
               arr.forEach(item => {
          if (item.itemId === val.itemId) {
                item.eachTime=sel
          }
        })
        this.tableDatalist=[]
        this.tableDatalist=arr;
      },
      newchangepriceTwo( event,val){
        let arr=this.tableDatalist;
               arr.forEach(item => {
          if (item.itemId === val.itemId) {
            item.eachTime=event.target.value
          }
        })
        this.tableDatalist=[]
        this.tableDatalist=arr;
      },
      changepriceTwos(event,val){
        let arr=this.tableDatalist;
               arr.forEach(item => {
          if (item.itemId === val.itemId) {
            item.totalPrices=Number(event)*item.priceTwo
            item.priceNum=Number(event)
          }
        })
        this.tableDatalist=[]
        this.tableDatalist=arr;
      },
      changepriceTwo(event,val){
        let arr=this.tableDatalist;
               arr.forEach(item => {
          if (item.itemId === val.itemId) {
            item.totalPrices=Number(event)*item.priceNum
             item.priceTwo=Number(event)
          }
        })
        this.tableDatalist=[]
        this.tableDatalist=arr;
      },
      addAdvice(){
        // console.log(this.tableDatalist,'黑欸');
        // return;
        if(this.tableDatalist.length==0){
           this.$message.warning('请至少添加一条临嘱');
           return
        }
        if(this.endTime==''||this.StartTime==''){
          this.$message.warning('请选择开始医嘱时间或停嘱时间');
           return
        }
        if(this.lives==''){
          this.$message.warning('请选择给药途径');
           return
        }
        if(this.frequency==''){
          this.$message.warning('请选择用药频次');
           return
        }
        if(this.dropVelocity==''){
          this.$message.warning('请输入滴速');
           return
        }
        if(this.days==''){
          this.$message.warning('请输入天数');
           return
        }
        
        let str='';
        for(let i=0;i<8;i++){
          str+=Math.floor(Math.random()*10)
        }
        let data={
          endTime: this.newDate(this.form.time)+' '+'00:00:00',
          frequency:this.form.chineseUse,
          dropVelocity:this.form.dropVelocity,
          days:this.form.days,
           startTime:this.newDate(this.StartTime)+' '+'00:00:00',
           groupNum:str,
           periodicType:"1",
           usageWay:this.lives,
           pairNum:'0',
           inHospitalId:localStorage.getItem('inHospitalId'),
           medicalRecordId:localStorage.getItem('medicalRecordId'),
           customerName:localStorage.getItem('customerName')
        }
        let ats=[]
        this.tableDatalist.forEach(value=>{
          value.unitPrice=value.priceTwo;
        value.amount=value.priceNum
        value.totalPrice=value.totalPrices;
        value.itemName=value.projectName;
        value.materialSpec=value.specs
        let Onject=Object.assign(value,data);
        let objectval=Object.assign(Onject,JSON.parse(localStorage.getItem('val')))
        ats.push(objectval)
        })
        ats.forEach(value=>{
        value.createTime= this.gettq(value.createTime)
        value.hospitalTime= this.gettq(value.hospitalTime);
        value.updateTime= this.gettq(value.updateTime);
        value.medicalAdviceType=value.categoryId;
        value.doseUnit=value.priceUnit;
         value.priceWarehouse=value.whouseName
         value.expenseType=value.expenseTypeName
         value.executingState='1';
         value.source='医生录入';
         value.expense=value.totalPrice;
         value.doctorId=localStorage.getItem('userId');
         value.useCustomer='0';
         value.doctorName=localStorage.getItem('username')

      });
         this.$api.confinementRoom.addBatch(ats).then(res => {
                      if(res.code==200){
                        this.$message.success('保存成功');
                        document.querySelectorAll('.tags-li-icon')[document.querySelectorAll('.tags-li-icon').length-1].click()
                        // this.$router.go(-1)
                      }
              })
      },
      getAuxiliary(isserach) {
        this.form.deptId=this.deptId;
        if(isserach){
        this.form.pageNum=1;
          this.form.pageSize=this.pagination.pageSize;
      }else{
        this.form.pageSize=this.pagination.pageSize,
      this.form.pageNum=this.pagination.pageNum;
      }
        this.$api.user.malist(this.form).then(res => {
          if (res) {
            this.tableData = res.rows
            this.pagination.total = res.total
          }
        })
      },
      gettq(value){
        let str=value.split('T');
         let newstr=str[0]+' '+str[1];
         return newstr
    },
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {};
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj != 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      //引用类型
      //数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i];
          if (typeof new_obj[i] == 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { //对象
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] == 'object') {
              new_obj[key] = this.deepClone(obj[key]);
            } else {//对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj;
    },
      // 树形结构
      treeNodeClick(data) {
        // 判断是否再请求数据
        if (this.timer) {
          // 如果数据正在请求阻止并删除上次请求
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          if ('departmentInfoVos' in data) {
            this.tableData = []
          } else {
            this.categoryId = data.departmentId
            this.$api.user.malist({ categoryId: data.departmentId }).then(res => {
              if (res) {
                this.tableData = res.rows
                this.pagination.total = res.total
              }
            })
          }
        }, 500)
      },
      // 添加
      orderNumber(val) {
        var flat = false;
        let arr=this.tableDatalist;
        if(val.quantitySum==0){
            this.$message.warning('无库存禁止添加');
             return
          }
               arr.forEach(item => {
          if (item.itemId === val.itemId) {
            ++item.priceNum
            item.totalPrices=item.priceNum*item.priceTwo
            flat = true
          }
        })
        
        this.tableDatalist=arr;
        if (flat !== true) {
          val['totalPrices']=(val.priceOne)*(val.priceNum);
          val['dosage']=''
          val['dose_unit']=''
          val['unit']='';
          let vals=this.deepClone(val)
          vals.priceNum=1;
        vals['totalPrices'] = (vals.priceOne) * (vals.priceNum);
          if(vals.priceNum==0){
          vals.priceNum=1
        }
        if(vals.dosage==0){
          vals.dosage=1
        }
        this.tableDatalist.push(vals)
          
        }
        
      },
      deleteClick(index, row) {
        this.tableDatalist.splice(index, 1)
      },
      // 产品单位
      priceunit() {
        /**
         * @author 李尚
         * @date 2022/6/18
         * @Description: 添加状态
         */
        const data = {
          status: '0',
          deptId: this.deptId
        }
        this.$api.product.productList(data).then(res => {
          if (res) {
            this.price = res.rows
          }
        })
        this.$api.basicMedicalData.prescriptionTemplateSettingsList(data).then(res => {
          if (res) {
            this.table = res.rows
          }
        }).finally(() => {
        })
      },
      add(row) {
        this.$api.basicMedicalData.prescriptionTemplateSettingsInfo({
            relationshipNumber: row.relationshipNumber
        }).then(res => {
          if (res) {
            this.tableDatalist = res.rows
            this.tableDatalist.forEach(value=>{
            value.dosage=value.quantity;
            value.dose_unit=value.pharmacy
          })
          this.form.chineseUse = res.rows[0].chineseUse;
          let Name = ''
          this.liveList.forEach(value=>{
           if(value.drugId==res.rows[0].toDrugMode){
                Name=value.drugDelivery
           }
        })
          this.lives = Name
          this.form.dropVelocity=res.rows[0].dropVelocity;
          this.form.days=res.rows[0].days;
          this.tableDatalist[0].totalPrices=Number(this.tableDatalist[0].priceNum)*Number(this.tableDatalist[0].priceOne)
          }
        }).finally(() => {
        })
      },
      // 项目列表
      getBookProjectList() {
        let num=''
        getDicts('dept_adjuvant_therapy').then(res => {
               res.data.forEach(value=>{
                  if(value.dictValue==this.deptId){
                    num=value.dictLabel
                  }
               })
               
               this.$api.modules.netPower.projectTreeselect({
          deptId: this.deptId,
          departmentId:num
        }).then(res => {
          this.bookProjectList = res.data
        })
        })
  
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
     width:8px !important;
    height: 8px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    background: transparent;
}
  ::v-deep .el-input-number__decrease {
    display: none;
  }
  
  ::v-deep .el-input-number__increase {
    display: none;
  }
  //number 宽度调整
  ::v-deep .el-input-number .el-input__inner {
    padding: 0;
    width: 80px;
  }
  ::v-deep .data-sg-table .sg-table-bar-content[data-v-3363c4d1] {
    display: none;
  }
  
  .Adjuvanttherapy{
    margin: 10px 10px 0 10px;
  }
  .header{
    width: 100%;
    height: 40px;
    background-color: #1abc9c;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .formBody {
    width: 100%;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    padding: 10px 0 20px 0;
    box-sizing: border-box;
    position: relative;
    margin: 20px 0;
    .itemment {
      position: absolute;
      top: -12px;
      left: 40px;
      padding: 0 10px;
      background-color: #f2f2f2;
      color: #666666;
    }
  }
  .itemment {
    font-size: 14px;
    font-weight: 600;
  }
  .header_middle{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .formBody_bot{
    height: 280px;
  }
  .left{
    width: 22%;
  }
  .middle{
    width: 55%;
    .formBody_middle{
      height: 690px;
    }
  }
  .right{
    width: 22%;
    .formBody_right{
      height: 690px;
    }
  }
  // 树形 背景颜色
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #1abc9c !important;
    color: #ffffff;
  }
  </style>
  