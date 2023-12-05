<template>
  <div style="font-size: 12px">
<div style="width: 100%;height: 100%;" v-for="(item,index) in codeArr" >
  <div class="title" style="text-align: center;font-weight: bolder;font-size: 18px;margin-top: 20px">{{message}}</div>
  <div style="width: 100%;display: flex;align-items: center;">
    <div style="width: 33%;margin-left: 20px">入库单号：{{ print.inDocumentNo }}</div>
    <div style="width: 33%">供应商：{{ print.companyName }}</div>
    <div style="width: 33%">执行人：{{ print.executeUserName }}</div>
  </div>
  <div style="width: 100%;display: flex;align-items: center;margin-top: 5px;">
    <div style="width: 33%;margin-left: 20px">库房：{{ print.whouseName }}</div>
    <div style="width: 33%">执行日期：{{ print.inhouseData }}</div>
    <div style="width: 33%">
      <template v-for="item in dict.type.document_type">
        <span :key="item.value" v-if="item.value === print.documentType">入库单类型：{{ item.label }}</span>
      </template>
    </div>

  </div>
  <div class="Table">
    <table  style="border-collapse: collapse;width: 98%;margin-left: 20px" border="1">
      <thead style="font-family: normal;font-size: 12px">
      <th>入库批次号</th>
      <th>物资名称</th>
      <th>单位</th>
      <th>规格</th>
      <th>进价</th>
      <th>数量</th>
      <th>物资分类</th>
      <th>金额</th>
      <th>产地</th>
      <th>生产批次</th>
      </thead>
      <tbody>
      <tr style="padding: 4px;line-height: 1;font-size: 12px;" v-for="itemChildren in item">
        <td>{{itemChildren.inBatchNumber}}</td>
        <td style="width: 150px;padding: 4px;">{{itemChildren.materialName}}</td>
        <td class="Padding">{{itemChildren.unitName}}</td>
        <td class="Padding">{{itemChildren.materialSpec}}</td>
        <td class="Padding Right">{{itemChildren.purchasePrice}}</td>
        <td class="Padding">{{itemChildren.quantity}}</td>
        <td style="min-width: 70px;padding-left: 3px">{{itemChildren.matTypeName}}</td>
        <td class="Padding Right">{{itemChildren.amountOfMoney}}</td>
        <td style="min-width: 70px;padding-left: 3px">{{itemChildren.place}}</td>
        <td style="min-width: 100px;padding-left: 3px">{{itemChildren.productionBatch}}</td>
      </tr>
      </tbody>
    </table>
<!--    <el-table-->
<!--      :data="item"-->
<!--      style="width: 100%">-->
<!--      <el-table-column prop="inBatchNumber" label="入库批次号" width="150"  />-->
<!--            <el-table-column prop="materialName" label="物资名称"  />-->
<!--            <el-table-column pr    <table  style="border-collapse: collapse;" border="1">
      <thead style="font-family: normal;font-size: 12px">
      <th>入库批次号</th>
      <th>物资名称</th>
      <th>单位</th>
      <th>规格</th>
      <th>进价</th>
      <th>数量</th>
      <th>物资分类</th>
      <th>金额</th>
      <th>产地</th>
      <th>生产批次</th>
      </thead>
      <tbody>
      <tr style="padding: 4px;line-height: 1;font-size: 12px;" v-for="newitem in item">
        <td>{{newitem.inBatchNumber}}</td>
        <td style="width: 150px;padding: 4px;">{{newitem.materialName}}</td>
        <td class="Padding">{{newitem.unitName}}</td>
        <td class="Padding">{{newitem.materialSpec}}</td>
        <td class="Padding">{{newitem.purchasePrice}}</td>
        <td class="Padding">{{newitem.quantity}}</td>
        <td style="min-width: 70px;padding-left: 3px">{{newitem.materialTypeName}}</td>
        <td class="Padding">{{newitem.amountOfMoney}}</td>
        <td style="min-width: 70px;padding-left: 3px">{{newitem.place}}</td>
        <td style="min-width: 100px;padding-left: 3px">{{newitem.productionBatch}}</td>
      </tr>
      </tbody>
    </table>op="unitName" label="单位" width="50"  />-->
<!--            <el-table-column prop="materialSpec" label="规格" width="100" />-->
<!--            <el-table-column prop="purchasePrice" label="进价" width="50" />-->
<!--            <el-table-column prop="quantity" label="数量" width="50" />-->
<!--            <el-table-column prop="materialTypeName" label="物品分类"  />-->

<!--            <el-table-column prop="amountOfMoney" label="金额" width="50" />-->
<!--            <el-table-column prop="place" label="产地" width="80" />-->
<!--            <el-table-column prop="productionBatch"  label="生产批次" >-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="startTime" label="有效起始时间" >-->
<!--              <template #default="scope">-->
<!--                <p>{{ scope.row.startTime }}</p>-->
<!--                <template v-if="scope.row.endTime">-->
<!--                  <p>-{{ scope.row.endTime }}</p>-->
<!--                </template>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--    </el-table>-->
    <div style="width: 100%;display: flex" >
      <span style="margin-left: 20px">入库合计金额：{{modeltotal(index)}}</span>
      <span style="margin-left: 300px">入库数量：{{newmodeltotal(index)}}</span>
    </div>
    <div style="display: flex;margin-left: 20px;">
      <div style="width: 33%"><div>财务：</div></div>
      <div style="width: 33%"><div>采购/经办人：</div></div>
      <div style="width: 33%"><div>库管员：</div></div>
    </div>
  </div>

</div>



<!--      </div>-->


  </div>
</template>

<script>
import { math } from '@/utils/math'
export default {
  dicts: ['document_type'],
  name: 'ReceiptDoc',
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    message: {
      type: String,
      default: function() {
        return ''
      }
    },
    templateList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      refundList: [],
      codedetail:'',
      codeArr:[],
      totalModel:0,
      flag:false,
      newcodeArr:[],
    }
  },
  watch: {
    print: {
      handler(newValue, oldValue) {
        this.flag=false
        this.codeArr=[];
        this.codedetail=Math.ceil(this.templateList.length/5);
        for(let i=0;i<this.codedetail;i++){
          this.codeArr.push(this.templateList.slice(i*5,i*5+5))
        }
      this.newcodeArr=this.deepClone(this.codeArr)
        this.getChange(newValue)
      },
      deep: true
    }
  },
  methods: {
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
    newmodeltotal(item){
      let Num=0;
      if(!this.flag){
        let arr=this.newcodeArr[item]
        arr.forEach(value=>{
          Num=math.add(Num,value.quantity)
        })
        // this.flag=true;
      }
      return Num
    },
    modeltotal(item){
if(!this.flag){
    let six=0;
    let arr=this.newcodeArr[item]
  for(let i=0;i<arr.length;i++){
    six=math.add(six,arr[i].amountOfMoney)
  }
  return six;
    // arr.forEach(value=>{
    //   this.totalModel=math.add(this.totalModel,value.amountOfMoney)
    // })
  // console.log(arr)
  // console.log(item)
}
  //     this.totalModel=0;
  //     item.forEach(value=>{
  //       this.totalModel=math.add(this.totalModel,value.amountOfMoney)
  //     })
  // console.log(this.totalModel)
      // if(!this.flag){
      //   this.totalModel=0;
      //   let arr=this.deepClone(this.codeArr[item])
      //   arr.forEach(value=>{
      //     this.totalModel=math.add(this.totalModel,value.amountOfMoney)
      //   })
      //   this.flag=true;
      // }
      // return this.totalModel
    },
    getChange(data) {
      this.refundList = []
      const temp = {
        name1: '合计金额',
        totalArrears: data.totalArrears
      }
      this.refundList.push(temp)
    }
  }
}
</script>

<style scoped lang="scss">

@page {
  size: auto;
  margin:0mm;
}
.Right{
  text-align: right;
}
.Padding{
  min-width: 50px;
  padding-left: 3px;
}
::v-deep .Table .el-table__body-wrapper tr td{
  font-weight: normal !important;
  padding: 0px !important;
  font-size: 5px !important;
  // font-size: 12px !important;
}
::v-deep .Table .el-table__header-wrapper tr th{
  font-weight: normal !important;
  padding: 0px !important;
  font-size: 5px !important;
}


</style>
