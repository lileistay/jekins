<template>
  <!--  领料出库打印-->
  <div style="font-size: 12px">
    <div style="width: 100%;height: 100%" v-for="(item,index) in codeArr">
      <div style="width: 100%;text-align: center;font-weight: bolder;font-size: 18px;margin-top: 20px">
        {{message}}出库单
      </div>
      <div  style="text-align: center;font-weight: bolder;font-size: 18px;margin-top: 5px"></div>
      <div>
        <el-row>
          <el-col :span="6"><div>
            <div style="margin-left: 20px">客户姓名：{{ item[0].customerName }}</div>
          </div></el-col>
          <el-col :span="6"><div>
            <div>出库单号：{{ print.outDocumentNo }}</div>
          </div></el-col>
          <el-col :span="6"><div>
            <div>执行人：{{ print.executeUserName }}</div>
          </div></el-col>
          <el-col :span="6"><div>
            <div>执行日期：{{ print.executeData }}</div>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div style="margin-left: 20px">客户卡号：{{item[0].customCardNumber}}</div>
          </el-col>
          <el-col :span="6">
            <div>领料人：{{ print.outPerson }}</div>
          </el-col>
          <el-col :span="6">
            <div>领料部门：{{ print.sectionName }}</div>
          </el-col>
          <el-col :span="6">
            <div>源库房：{{ print.oldwhouseName }}</div>
          </el-col>
          <el-col :span="6">
            <template v-for="item in dict.type.document_type">
              <span :key="item.value" v-if="item.value === print.documentType" style="margin-left: 20px">出库单类型：{{ item.label }}</span>
            </template>
          </el-col>
        </el-row>
      </div>
      <div class="detailsTable">
        <table  style="border-collapse: collapse;width: 98%;margin-left: 15px" border="1" >
          <thead style="font-family: normal;font-size: 12px">
          <th>入库批次号</th>
          <th>物资名称</th>
          <th>单位</th>
          <th>规格</th>
          <th>进价</th>
          <th>出库数量</th>
          <th>金额</th>
          <th>物资分类</th>
          </thead>
          <tbody>
          <tr style="padding: 4px;line-height: 1;font-size: 12px;" v-for="newitem in item">
            <td>{{newitem.inBatchNumber}}</td>
            <td style="width: 230px;padding: 4px;">{{newitem.materialName}}</td>
            <td class="Padding">{{newitem.unitName}}</td>
            <td class="Padding ">{{newitem.materialSpec}}</td>
            <td style="min-width: 50px;padding-left: 3px" class="Right">{{newitem.purchasePrice}}</td>
            <td style="min-width: 50px;padding-left: 3px" >{{newitem.outNumber}}</td>
            <td style="min-width: 50px;padding-left: 3px" class="Right">{{newitem.materialPrice}}</td>
            <td style="min-width: 50px;padding-left: 3px">{{newitem.materialTypeName}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div style="font-size: 12px;">
        <el-row>
          <el-col :span="12">
            <div style="margin-left: 20px">出库总金额：{{newTotal(index)}}</div>
          </el-col>
          <el-col :span="12">
            <div>出库数量：{{Total(index)}}</div>
          </el-col>
        </el-row>
      </div>
      <div style="font-size: 12px;margin-top: 10px">
        <el-row>
          <el-col :span="12">
            <div style="margin-left: 20px">领料人签名：</div>
          </el-col>
          <el-col :span="12">
            <div>库管员：</div>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
import { math } from '@/utils/math'
export default {
  dicts: ['document_type'],
  name: 'ReceiptDoc',
  watch: {
    templateList: {
      handler(newValue, oldValue) {
        this.flag = false
        this.codeArr = [];
        this.codedetail = Math.ceil(this.templateList.length / 5);
        for (let i = 0; i < this.codedetail; i++) {
          this.codeArr.push(this.templateList.slice(i * 5, i * 5 + 5))
        }
      },
      deep: true
    },
    print: {
      handler(newValue, oldValue) {
      },
      deep: true
    }
  },
  methods: {
    Total(index) {
      let six = 0;
      this.codeArr[index].forEach(value => {
        six = math.add(six, value.outNumber)
      })
      return six;
    },
    newTotal(index) {
      let six = 0;
      this.codeArr[index].forEach(value => {
        six = math.add(six, value.materialPrice)
      })
      return six;
    }
  },
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    templateList: {
      type: Array,
      default: function() {
        return []
      }
    },
    message: {
      type: String,
      default: function() {
        return ''
      }
    },
  },
  data() {
    return {
      codeArr:[],
      codedetail:'',
      flag:false,
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
  min-width: 40px;
}

.detailsTable {
  width: 100%;
  margin: 0;
  font-size: 16px;
  .elTable {
    border: 1px solid #000000;
  }
}
.table {
  width: 95%;
  margin: 0 20px 0 20px;
  font-size: 14px;
  .elTable {
    border: 1px solid #000000;
  }
}
</style>
