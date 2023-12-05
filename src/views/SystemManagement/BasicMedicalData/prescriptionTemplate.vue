<template>
  <!-- 处方模板 -->
  <div    class="header">
    <div class="formBody">
      <div class="itement">
        <span>处方模板信息</span>
      </div>
      <el-form ref="formInline" :model="formInline" :rules="rules" class="mentform" label-width="135px" size="mini">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="处方模板名称：" prop="templateName">
              <el-input v-model="formInline.templateName" style="width: 200px;" @input="aaa" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否全局模板：" prop="isWholeTemplate">
              <el-select v-model="formInline.isWholeTemplate" filterable placeholder="请选择" style="width: 200px">
                <el-option
                  v-for="dict in dict.type.whether"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="formInline.isWholeTemplate === '0'" :span="5">
            <el-form-item label="模板使用者：" prop="templateUse">
              <el-select v-model="formInline.templateUse" filterable placeholder="请选择" style="width: 200px">
                <el-option
                  v-for="item in sysUserList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="formInline.status" filterable placeholder="请选择" style="width: 200px">
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="formInline.remark" type="textarea" style="width: 590px;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 模板详细列表-->
    <div class="formBody">
      <div class="itement">
        <span>模板详细列表</span>
      </div>
      <div>
        <div class="billing">
          <el-form :inline="true" :model="dateline" class="demo-form-inline" size="mini">
            <el-form-item>
              中药用药频次：
              <el-select v-model="dateline.chineseUse" filterable placeholder="请选择" size="mini">
                <el-option
                  v-for="dict in dict.type.cm_medication_frequency"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              西药用药频次：
              <el-select v-model="dateline.westUse" filterable placeholder="请选择" size="mini">
                <el-option
                  v-for="dict in dict.type.wm_medication_frequency"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              给药途径：
              <el-select v-model="dateline.toDrugMode" filterable placeholder="请选择" style="width: 100px">
                <el-option
                  v-for="item in drugDeliveryRouteList"
                  :key="item.drugId"
                  :label="item.drugDelivery"
                  :value="item.drugId"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              滴速：
              <el-input v-model="dateline.dropVelocity" style="width: 50px" />
              滴/分
            </el-form-item>
            <el-form-item>
              剂数：
              <el-input v-model="dateline.dose" placeholder="剂" style="width: 50px" />
            </el-form-item>
            <el-form-item>
              天数：
              <el-input v-model="dateline.days" placeholder="天" style="width: 50px" />
            </el-form-item>
            <el-button
              class="elbut"
              icon="el-icon-plus"
              type="primary"
              plain
              style="float:right;"
              size="mini"
              @click="showDialog"
            >导入</el-button>
          </el-form>
        </div>
        <el-table
          border
          :data="tableData"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :style="{'font-size': '12px'}"
          style="width: 100%"
        >
          <el-table-column label="产品名称" prop="projectName" />
          <el-table-column label="规格" prop="specs" />
          <el-table-column label="数量" prop="quantity" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity" size="mini" @input="totalPrice" />
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="priceOne" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.priceOne" disabled size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="总价" prop="sumPrice" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sumPrice" disabled size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="priceUnit" width="100" />
          <el-table-column label="每次用量" prop="eachTime" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.eachTime" size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="用药单位" prop="pharmacy" width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.pharmacy" filterable placeholder="请选择" size="mini">
                <el-option
                  v-for="dict in dict.type.medication_unit"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button size="mini" type="primary" plain icon="el-icon-folder-add" :loading="submitLoading" @click="addOrEdit">保存</el-button>
        <el-button size="mini" type="danger" plain icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
    <prescriptionTemplateImport :dialog-visible.sync="showManualDialog" @updata="updata" />
  </div>
</template>

<script>
import prescriptionTemplateImport from '@/views/SystemManagement/BasicMedicalData/prescriptionTemplateImport'
import vm from '@/utils/util'
import { math } from '@/utils/math'

export default {
  components: { prescriptionTemplateImport },
  dicts: ['sys_normal_disable', 'medication_unit', 'whether', 'wm_medication_frequency', 'cm_medication_frequency'],
  data() {
    return {
      submitLoading: false,
      loadingData: false,
      showManualDialog: false, // 导入
      formInline: {
        templateName: '',
        isWholeTemplate: '1',
        status: '0',
        remark: '',
        relationshipNumber: undefined
      },
      rules: {
        templateName: [
          { required: true, message: '请输入处方模板名称', trigger: 'blur' }
        ],
        isWholeTemplate: [
          { required: true, message: '请选择是否全局模板', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      // 表格搜索
      dateline: {
        chineseUse: '',
        westUse: '',
        toDrugMode: '',
        dropVelocity: '',
        dose: '',
        days: ''
      },
      tableData: [], // 列表
      drugDeliveryRouteList: [],
      sysUserList: [],
      removeIds: []
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getUserList(val)
    }
  },
  created() {
    if (sessionStorage.getItem('prescriptionTemplateitem') != 'undefined') {
      const val = JSON.parse(sessionStorage.getItem('prescriptionTemplateitem'))
      this.formInline.relationshipNumber = val.relationshipNumber
      this.formInline.prescriptionTemplateId = val.prescriptionTemplateId
      this.formInline.templateName = val.templateName
      this.formInline.isWholeTemplate = val.isWholeTemplate
      this.formInline.templateUse = val.templateUse
      this.formInline.status = val.status
      this.formInline.remark = val.remark
      this.dateline.chineseUse = val.chineseUse
      this.dateline.westUse = val.westUse
      this.dateline.toDrugMode =Number(val.toDrugMode)
      this.dateline.dropVelocity = val.dropVelocity
      this.dateline.dose = val.dose
      this.dateline.days = val.days
      this.getPrescriptionTemplateSettingsInfo()
    }
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getAdministrationRouteSetting()
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 关闭当前标签
     */
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    aaa() {
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 获取给药途径
    */
    getAdministrationRouteSetting() {
      this.loadingData = true
      // 添加状态
      this.$api.basicMedicalData.drugDeliveryRouteList({status: '0'}).then(res => {
        if (res) {

          this.drugDeliveryRouteList = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 获取处方模板详情
    */
    getPrescriptionTemplateSettingsInfo() {
      this.$api.basicMedicalData.prescriptionTemplateSettingsInfo({
        relationshipNumber: this.formInline.relationshipNumber
      }).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 导入数据
    */
    updata(data) {
      this.showManualDialog = false
      data.forEach(item => {
        this.$set(item, 'quantity', 1)
        this.$set(item, 'sumPrice', math.multiply(item.priceOne, item.quantity))
        this.tableData.push(item)
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 计算总价
    */
    totalPrice() {
      this.tableData.forEach(item => {
        item.sumPrice = math.multiply(item.priceOne, item.quantity)
      })
      this.$forceUpdate()
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 删除
    */
    handleDelete(index, row) {
      this.tableData.splice(index, 1)
      this.removeIds.push(row.templateListId)
    },
    showDialog() {
      this.showManualDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 保存和编辑
    */
    addOrEdit() {
      this.$refs.formInline.validate((valid) => {
        if (valid) {
          const data = Object.assign(this.dateline, this.formInline)
          this.$set(data, 'deptId', this.deptId)
          this.tableData.forEach(item => {
            this.$set(item, 'relationshipNumber', this.formInline.relationshipNumber)
          })
          this.submitLoading = true
          if (this.formInline.relationshipNumber !== undefined) {
            this.$api.basicMedicalData.editPrescriptionTemplateSettings({
              'removeIds': this.removeIds,
              'prescriptionTemplateInfo': data,
              'prescriptionList': this.tableData
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
              }
            })
          } else {
            this.$api.basicMedicalData.addPrescriptionTemplateSettings({
              'prescriptionTemplateInfo': data,
              'prescriptionList': this.tableData
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
              }
            })
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 关闭
    */
    remode() {
      this.$router.push({ path: 'prescriptionTemplateSettings' })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 获取用户信息
    */
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
        }
      })
    },
     unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
  }
}
</script>

<style scoped lang="scss">
.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 0;

  .itement {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    font-size: 14px;
    background-color: #f2f2f2;
  }

}

.billing {
  height: 30px;
  //line-height: 40px;
  background-color: #1abc9c;
  padding: 10px 10px;
  color: #ffffff;
}
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;
  .content {
    float:right;
    position: fixed;
    right: 20px;
    padding-top: 5px;
  }
}

.header {
  padding: 10px;
}
</style>
