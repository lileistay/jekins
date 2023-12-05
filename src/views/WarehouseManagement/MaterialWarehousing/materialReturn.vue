<template>
  <!--  退料-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">退料入库
        </div>
        <el-form
          ref="form"
          class="mentform"
          :model="form"
          size="mini"
          :rules="rules"
          label-width="100px"
          style="margin-top:10px "
        >
          <el-col :span="4">
            <el-form-item label="出库单号:">
              <el-input v-model="form.outDocumentNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="执行人:">
              <el-select
                v-model="form.executeUserName"
                disabled
                filterable
                class="fullInput"
                placeholder="请选择"
                style="width: 100%;"
              >
                <el-option
                  v-for="(userItem, index) in userList"
                  :key="index"
                  :label="userItem.nickName"
                  :value="userItem.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="执行日期:">
              <el-input v-model="form.operationDate" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="领料人员:" prop="outPerson">
              <el-input v-model="form.outPerson" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料部门:" prop="departmentId">
              <treeselect
                v-model="form.departmentId"
                :options="menuOptions"
                :normalizer="normalizer"
                placeholder="选择部门"
                style="width: 260px"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input v-model="form.remark" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="mentediv">
        <div class="formBody" style="min-height: 520px">
          <div slot="searchBar">
            <div style="width: 100%;height:35px; background-color: #1abc9c">
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                size="mini"
              >导入物资
              </el-button>
            </div>
            <el-table
              :data="tableData"
              border
              size="mini"
              max-height="480"
              style="width: 100%"
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
            >
              <el-table-column prop="inBatchNumber" width="300" label="出库批次号" />
              <el-table-column prop="materialName" label="物资名称" />
              <el-table-column prop="matTypeName" width="150" label="物资类型" />
              <el-table-column prop="outNumber" width="150" label="出库数量" />
              <el-table-column prop="materialSpec" width="150" label="规格	" />
              <el-table-column prop="unitName" width="150" label="物资单位" />
              <el-table-column prop="returnNum" width="150" label="可退料数量	" />
              <el-table-column prop="rQuantity" width="300" label="退货数量">
                <template slot-scope="scope">
                  <el-input-number
                    v-model.number="scope.row.rQuantity"
                    size="mini"
                    style="width: 100%"
                    @blur="outnum(scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-folder-checked"
          :loading="submitLoading"
          @click="returnRoom"
        >保存
        </el-button>
        <el-button size="mini" type="danger"  icon="el-icon-close" @click="remode">关闭
        </el-button>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import vm from '@/utils/util'
import sgDialog from '@/components/Dialog'
import Treeselect from '@riophae/vue-treeselect'
import { GMTToStr } from '@/utils/time'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'MaterialReturn',
  components: {
    sgDialog,
    Treeselect
  },
  dicts: ['medication_unit', 'cm_medication_frequency', 'wm_medication_frequency', 'whether', 'discount'],
  data() {
    return {
      //  用户列表
      userList: [],
      RoomList: [], // 库房
      tableData: [],
      // 出库单
      form: {
        outDocumentNo: '', // 出库单号
        executeUserId: 0, // 执行人
        operationDate: '', // 执行日期
        outPerson: '', // 领料人员
        departmentId: '', // 领料部门
        remark: ''
      },
      menuOptions: [], // 部门
      rules: {
        whouseId: [
          { required: true, message: '请选择库房', trigger: 'blur' }
        ],
        supplierNo: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ]
      },
      submitLoading: false, // 暂存入库 loading
      removeIds: [],
      templateData: [], // 物资列表
      templateDatas: [], // 已选中
      queryList:{}
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  created() {
    this.user = this.$store.getters.user
    this.deptId = this.$store.getters.departmentId
    this.queryList=JSON.parse(sessionStorage.getItem('materialReturnitem'))
    this.form = this.queryList
    this.getUserList()
    this.getTreese()
    this.getDate()
  },
  methods: {
    // 点击编辑
    getDate() {
      const outDocumentNo = this.queryList.outDocumentNo
      this.$api.storageRoom.outList({ outDocumentNo: outDocumentNo }).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    // 关闭当前标签
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 导入物资-搜索
    getreturn() {
      this.$router.push({ path: 'purchaseReceipt' })
    },
    outnum(row) {
      if (row.returnNum < row.rQuantity) {
        this.$message('退货数量不得大于出库数量')
        row.rQuantity = row.returnNum
      }
    },
    // 退货
    returnRoom() {
      var insertListList = []
      this.tableData.forEach(item => {
        if (item.rQuantity > 0 && item.rQuantity !== undefined) {
          insertListList.push({
            'returnAmount': math.multiply(item.purchasePrice, item.rQuantity),
            'outDocumentNo': this.form.outDocumentNo,
            'returnedQuantity': item.rQuantity,
            'insertId': item.insertId,
            'documentType': '5',
            'materId': item.materId,
            'returnDepartmentId': item.departmentId ? item.departmentId : null,
            deptId: this.deptId,
            assist:item.assist,
            'params': {
              'outId': item.outId
            }
          })
        }
      })
      const data = {
        insertInfo: {
          deptId: this.deptId,
          executeDate: GMTToStr(new Date()), // 日期
          inhouseData: GMTToStr(new Date()),
          executeUserId: this.user.userId, // 执行人
          whouseId: this.form.whouseId, // 库房
          // totalPrice: // 总金额
          status: '1',
          documentType: '5' // 单据类型
        },
        insertListList: insertListList
      }
      this.submitLoading=true
      this.$api.storageRoom.insertInfoAdd(data).then(res => {
        if (res) {
          this.$message.success('退料成功')
          this.$router.push({ path: 'exWarehouse' })
          this.submitLoading=false
          this.getData()
        }
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.sectionId,
        label: node.sectionName,
        children: node.children
      }
    },
    /** 查询部门下拉树结构 */
    async getTreese() {
      var data = {
        status: '0',
        deptId: this.deptId
      }
      await this.$api.post.sectionInfoList(data).then(res => {
        if (res) {
          this.menuOptions = []
          const menu = { sectionId: 0, sectionName: '请选择', children: [] }
          menu.children = this.handleTree(res.rows, 'sectionId')
          this.menuOptions.push(menu)
        }
      })
    },
    // 获取系统用户列表
    getUserList() {
      // 库房
      this.$api.storageRoom.wpartmentList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.RoomList = res.rows
        }
      })
      // 添加状态
      this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.$forceUpdate()
          // 去重
          const arr1 = this.unique(res.data)
          this.userList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 大页面关闭
    remode() {
      this.closeTag()
    }
  }
}
</script>

<style scoped lang='scss'>
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

.redStr {
  display: none;
}

.formBody {
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 5px 10px 10px 10px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 10px 0 10px;
  //margin-right: 40px;
  //margin-top: 20px;
  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #75deca;
  }
}

.formBodys {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 40px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;

  .title {
    position: absolute;
    top: -11px;
    left: 25px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }

  .form-left {
    width: 25%;
    min-height: 260px;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }

  .form-right {
    width: 73%;
    min-height: 260px;
    border-radius: 10px;
    position: relative;
    border: 1px solid #c6c6c6;
  }
}

.titme {
  height: 40px;
  line-height: 40px;
  color: #ffff;
  font-size: 14px;
  margin-top: 10px;
  background-color: #1abc9c;
}

.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.header {
  font-size: 12px;
  padding-top: 5px;
  margin-bottom: 5px;
}

.management {
  padding: 6px 40px;

  .itemment {
    color: #1abc9c;
    font-size: 14px;
    font-weight: 600;
  }

  .demo-form-inline {
    line-height: 40px;
  }

  .el-input--mini {
    line-height: 37px;
  }

  a {
    font-size: 12px;
    color: #1abc9c;
    text-decoration: none;
  }
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
    position: fixed;
    right: 20px;

    .red {
      font-weight: 400;
      color: red;
    }
  }
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

::v-deep .el-input__icon:after {
  display: none;
}
</style>
