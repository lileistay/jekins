<template>
  <!--  外购入库-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">入库单
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
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item :class="{redStr: bool}" label="入库单号:">
                <el-input v-model="form.inDocumentNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="执行人:">
                <el-select
                  v-model="form.executePerson"
                  :disabled="true"
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
                <el-date-picker
                  v-model="form.executeDate"
                  type="datetime"
                  placeholder="选择日期" size="mini">
                </el-date-picker>
<!--                <el-input v-model="form.executeDate" disabled />-->
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="库房:" prop="whouseId">
                <el-select v-model="form.whouseId" filterable clearable>
                  <el-option
                    v-for="(item, index) in RoomList"
                    :key="index"
                    :label="item.whouseName"
                    :value="item.whouseId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商:" prop="supplierNo">
                <el-select v-model="form.supplierNo" filterable clearable>
                  <el-option
                    v-for="(item, index) in supplier"
                    :key="index"
                    :label="item.companyName"
                    :value="item.supplierNo"
                  />
                </el-select>
                <span style="font-size: 12px;margin-left: 40px"><span style="color: red">*</span> 是否有发票</span>
                <el-radio v-model="insertion" label="0" style="margin-left: 10px">否</el-radio>
                <el-radio v-model="insertion" label="1">是</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
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
              <span class="select">
                <span>价值总额: {{ amount }}元</span>
              &nbsp;&nbsp;
                <span>总数量: {{ quantity }}件</span>
              </span>
              <el-button
                class="elbut"
                style="float:right; margin-right: 5px;"
                icon="el-icon-plus"
                type="primary"
                size="mini"
                @click="importProject"
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
              <el-table-column prop="materialName" label="物资名称">
                <template slot-scope="scope">
                  <a style="color: #3aa1ff" @click="material(scope.row)">{{
                    scope.row.materialName
                  }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="materialSpec" label="规格">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.materialSpec"
                    size="mini"
                    disabled
                    style="width: 100%"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="unitName" label="单位">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.unitName"
                    size="mini"
                    disabled
                    style="width: 100%"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="matTypeName" label="物资类型">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.matTypeName"
                    size="mini"
                    disabled
                    style="width: 100%"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="purchasePrice" label="物资进价">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.purchasePrice"
                    size="mini"
                    style="width: 100%"

                    :min="0"
                    @blur="totalPrice(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="priceOne" label="售卖价格1">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.priceOne"
                    disabled
                    size="mini"
                    style="width: 100%"
                    :precision="2"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="priceTwo" label="售卖价格2">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.priceTwo"
                    disabled
                    size="mini"
                    style="width: 100%"
                    :precision="2"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="insertNumber" label="入库数量">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.insertNumber"
                    size="mini"
                    style="width: 100%"
                    :precision="2"
                    @blur="totalAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
<!--              :precision="2"-->
              <el-table-column prop="materialPrice" label="金额">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.materialPrice"
                    size="mini"
                    style="width: 100%"

                    @blur="totalamountPrice(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="place" label="产地">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.place"
                    size="mini"
                    style="width: 100%"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="certificateNo" label="注册证号">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.certificateNo"
                    size="mini"
                    style="width: 100%"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="productionBatch" label="生产批次">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.productionBatch"
                    size="mini"
                    style="width: 100%"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="有效起始时间">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.startTime"
                    type="date"
                    size="mini"
                    style="width: 100%"
                    placeholder="选择日期"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="endTime" label="有效结束时间">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.endTime"
                    type="date"
                    size="mini"
                    style="width: 100%"
                    placeholder="选择日期"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    size="mini"
                    style="width: 100%"
                    :readonly="readly" @click.nat.native="Readonly($event)" @input="searchPayRecord"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
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
          @click="addRoom(0)"
        >暂存
        </el-button>
        <el-button :class="{redStr: bool}" size="mini" :loading="submitLoading" type="danger" @click="Delete">
          删除
        </el-button>
        <el-button size="mini" :loading="submitLoading" @click="addRoom(1)">确定入库</el-button>
        <el-button size="mini" type="danger"  icon="el-icon-close" @click="remode">
          关闭
        </el-button>
      </div>
    </div>
    <!--物资信息-->
    <sg-dialog
      title="物资信息"
      :dialog="materialtitle"
      size="60%"
      @handleClose="materialClose"
    >
      <div slot="out">
        <el-table
          :data="materialData"
          size="mini"
          border
          :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
          :cell-style="{'text-align':'center', 'font-size':'12px'}"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column prop="date" label="操作">
            <template slot-scope="scope">
              <a @click="materialchoice(scope.row)">选择</a>
            </template>
          </el-table-column>
          <el-table-column prop="inBatchNumber" label="入库批次号" />
          <el-table-column prop="date" label="物资编码" />
          <el-table-column prop="materialName" label="物资名称" />
          <el-table-column prop="materialSpec" label="规格" width="60" />
          <el-table-column prop="whouseName" label="库房" />
          <el-table-column prop="purchasePrice" label="进价" width="60" />
          <el-table-column prop="date" label="售价" width="60" />
          <el-table-column prop="place" label="产地" />
          <el-table-column prop="certificateNo" label="注册证号" />
          <el-table-column prop="productionBatch" label="生产批次" />
          <el-table-column prop="startTime" label="有效期起始时间" />
          <el-table-column prop="endTime" label="有效期结束时间" />
        </el-table>
      </div>
    </sg-dialog>
    <!--    导入物资-->
    <sg-dialog
      title="导入物资"
      :dialog="dialogVisible"
      size="60%"
      @handleClose="handleClose"
    >
      <div slot="out">
        <el-form :inline="true" :model="femptree" class="demo-form-inline" size="mini">
          <el-form-item label="物资名称:">
            <el-input v-model="femptree.materialName" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item label="简码:">
            <el-input v-model="femptree.shortCode" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item label="编码:">
            <el-input v-model="femptree.materialCode" clearable style="width: 120px" />
          </el-form-item>
          <el-button style="float:right;" type="danger" size="mini" @click="handleClose">关闭</el-button>
          <el-button style="float:right; margin-right: 5px" size="mini" @click="treeDelete">清空</el-button>
          <el-button style="float:right;" size="mini" @click="treeImport">导入</el-button>
          <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="getTree">
            搜索
          </el-button>
        </el-form>
        <div class="formBodys">
          <div class="form-left">
            <div class="title">物资类型</div>
            <el-tree
              default-expand-all
              :filter-node-method="filterNode"
              :data="deptOptions"
              :props="defaultProps"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
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
          <div class="form-right">
            <div class="title">物资列表</div>
            <div style="margin-top: 10px">
              <el-table
                :data="templateData"
                size="mini"
                height="200"
                border
                :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
                :cell-style="{'text-align':'center', 'font-size':'12px'}"
              >
                <el-table-column prop="shortCode" label="简码" width="120" />
                <el-table-column prop="materialName" label="物资名称" />
                <el-table-column prop="materialCode" label="物资编码" />
                <el-table-column prop="materialSpec" label="规格" />
                <el-table-column prop="unitName" label="单位" />
                <el-table-column prop="isMaterial" label="是否关键物资">
                  <template slot-scope="scope">
                    <p>{{ scope.row.isMaterial == '0' ? '否' : '是' }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="inventoryQuantity" label="现有库存" />
                <el-table-column prop="minStock" label="最小库存" />
                <el-table-column prop="priceNum" label="操作" fixed="right">
                  <template slot-scope="{row}">
                    <el-button size="mini" @click="additionalData(row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="height: 40px;line-height: 40px;padding-left: 10px; background-color: #1abc9c">
              已选择
            </div>
            <div style="margin-top: 10px">
              <el-table
                :data="templateDatas"
                size="mini"
                border
                height="200"
                :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
                :cell-style="{'text-align':'center', 'font-size':'12px'}"
              >
                <el-table-column prop="shortCode" label="简码" width="120" />
                <el-table-column prop="materialName" label="物资名称" />
                <el-table-column prop="materialCode" label="物资编码" />
                <el-table-column prop="materialSpec" label="规格" />
                <el-table-column prop="unitName" label="单位" />
                <el-table-column prop="isMaterial" label="是否关键物资">
                  <template slot-scope="scope">
                    <p>{{ scope.row.isMaterial == '0' ? '否' : '是' }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="inventoryQuantity" label="现有库存" />
                <el-table-column prop="minStock" label="最小库存" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </sg-dialog>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import vm from '@/utils/util'
import { timeFmt } from '@/utils/time'
import sgDialog from '@/components/Dialog'

export default {
  components: {
    sgDialog
  },
  // dicts: ['medication_unit', 'cm_medication_frequency', 'wm_medication_frequency', 'whether', 'discount'],
  data() {
    return {
      rowList: [],
      readly:true,
      insertion:"0",
      radio:'0',
      parentList: [],
      purchase: 0, // 价格
      // 物资信息 弹框
      materialtitle: false,
      materialData: [],
      amount: 0, // 价值总额
      quantity: 0, // 总数量
      bool: true,
      bools: false,
      //  用户列表
      userList: [],
      RoomList: [], // 库房
      supplier: [], // 供应商
      // ---
      tableData: [],
      // 入库单
      form: {
        inDocumentNo: '', // 入库单号
        executePerson: '', // 执行人
        executeDate: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()), // 执行日期
        whouseId: '', // 库房
        supplierNo: '', // 供应商
        remark: ''
      },
      rules: {
        whouseId: [
          { required: true, message: '请选择库房', trigger: 'blur' }
        ],
        supplierNo: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ]
      },
      submitLoading: false, // 暂存入库 loading
      dialogVisible: false, // 导入物资 关闭/打开
      // 树结构
      deptOptions: [], // 树 的数据
      defaultProps: {
        children: 'sonList',
        label: 'name'
      },
      insertListList: [],
      // 导入搜索
      femptree: {
        materialName: '', // 物资名称
        shortCode: '', // 简码
        templateUseName: '' // 物资名称
      },
      removeIds: [],
      templateData: [], // 物资列表
      templateDatas: [], // 已选中
      arrlist:[],
      arrlist1:[],
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
    },
    userId: {
      get() {
        return this.$store.getters.user.userId
      }
    }
  },
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getUserList()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    if (this.$route.query.item !== undefined) {
      this.form = this.$route.query.item
      this.form.executePerson = this.$route.query.item.executeUserId
      this.getDate()
      this.bool = false
      this.bools = true
    } else {
      this.bool = true
      this.bools = false
      this.user = this.$store.getters.user
      this.form.executePerson = this.user.userId
    }
    this.getTreeselect()
    this.getUserList()
  },
  methods: {
    Readonly(e){
      this.readly=false
    },
    searchPayRecord(payName) {
      let that = this;
      if (payName == '') {
        this.readly = true;
        setTimeout(function () {
          that.readly = false;
        }, 200)
      }
    },
    // 点击编辑

    async getDate() {
      const inDocumentNo = this.$route.query.item.inDocumentNo
      await this.$api.storageRoom.insertList({ inDocumentNo: inDocumentNo }).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    // 关闭当前标签
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 导入物资
    importProject() {
      this.dialogVisible = true
    },
    // 导入物资-搜索
    getTree() {
      this.$delete(this.femptree, 'whouseId')
      this.$delete(this.femptree, 'typeId')
      this.$delete(this.femptree, 'matTypeId')
      this.femptree.deptId=this.deptId
      this.femptree.status='0'
      this.$api.storageRoom.materialInfoLst(this.femptree).then(res => {
        if (res) {
          this.templateData = res.rows
        }
      })
    },
    // 树结构
    getTreeselect() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 删除此条数据
    handleDelete(index, row) {
      this.$confirm('此操作将永久此条库存记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.insertId !== undefined) {
          this.$api.storageRoom.insertDelete(row.insertId).then(res => {
            if (res) {
              this.$message.success('删除成功')
              this.tableData.splice(index, 1)
              this.accountsPayable = this.tableData.reduce((prev, next) => {
                return math.add(prev, next.discountAmount).toFixed(2)
              }, 0)
            }
          })
        } else {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 节点点击事件 禁用按钮
    async handleNodeClick(data, val) {
      this.rowList = []
      this.getParent(val)
      // 同级tree点击时置空，也可以判断
      this.reqlist = this.rowList
      this.templateData = []
      this.whouseName = data.name
      this.typeId = data.type
      this.single = false
      this.addBan = false
      // this.matTypeId = data.matTypeId
      if (this.reqlist[1] === undefined) {
        this.$set(this.femptree, 'materialTypeId', this.reqlist[0]) // 一级
        this.$set(this.femptree, 'typeId', this.reqlist[1]) // 二级
        this.$set(this.femptree, 'matTypeId', this.reqlist[2]) // 三级
      } else if (this.reqlist[2] === undefined) {
        this.$set(this.femptree, 'materialTypeId', this.reqlist[1]) // 一级
        this.$set(this.femptree, 'typeId', this.reqlist[0]) // 二级
        this.$set(this.femptree, 'matTypeId', this.reqlist[2]) // 三级
      } else {
        this.$set(this.femptree, 'materialTypeId', this.reqlist[2]) // 一级
        this.$set(this.femptree, 'typeId', this.reqlist[1]) // 二级
        this.$set(this.femptree, 'matTypeId', this.reqlist[0]) // 三级
      }
      this.femptree = Object.assign(this.femptree, this.pagination)
      this.femptree.deptId=this.deptId
      // this.femptree.deptId = this.deptId
      this.femptree.status='0'
      await this.$api.storageRoom.materialInfoLst(this.femptree).then(res => {
        if (res.rows.length > 0) {
          this.templateData = res.rows
        } else {
          this.templateData = []
        }
      })
    },
    getParent(node) {
      var that = this
      if (node.parent.data && !Array.isArray(node.parent.data)) {
        node.parent.data instanceof Object && that.rowList.push(node.data.id)
        that.getParent(node.parent)
      } else if (that.rowList.length === 0) {
        if (that.parentList.length === 0) {
          that.rowList.push(node.data.id)
        }
      } else {
        that.rowList.push(node.data.id)
      }
    },
    // 弹框按钮 点击添加
    additionalData(data) {
      let flag = true
      this.templateDatas.forEach((item) => {
        if (item.materId === data.materId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.templateDatas.push(data)
        this.templateData = this.templateData.filter(item => {
          return data.materId !== item.materId
        })
      } else {
        this.$message.warning('不能重复添加')
      }
    },
    // 弹框按钮 导入
    treeImport() {

      if (this.templateDatas.length !== 0) {
        this.templateDatas.forEach(item => {
          if (item.matTypeName === null) {
            item.matTypeName = item.materialName
          }
          if (item.insertNumber === null) {
            item.insertNumber = 1
          }
          if (item.remark !== undefined) {
            item.remark = ''
            item.insertNumber = 1
          }
        })
        this.tableData = this.tableData.concat(this.templateDatas)
        this.quantity = this.tableData.length
        this.dialogVisible = false
        this.templateData = []
        this.templateDatas = []
      } else {
        this.$message('导入物资不能为空')
      }
      console.log(this.tableData)
      return
    },
    // 入库数量计算-入库数量
    totalAmount(index, value) {
      this.arrlist1=[]
      if (value.insertNumber < 1) {
        this.$message('入库数量不得小于1')
        value.insertNumber = 1
        this.tableData.forEach(res => {
          res.materialPrice = math.multiply(res.insertNumber, res.purchasePrice)
          this.arrlist1.push(res.insertNumber)

        })
        this.quantity = this.sum(this.arrlist1)
        // this.tableData.forEach(res => {
        //   res.materialPrice = math.multiply(res.insertNumber, res.purchasePrice)
        //   this.amount = math.add(this.amount, res.purchasePrice)
        // })
        return
      }else {
        this.tableData.forEach(res => {
          res.materialPrice = math.multiply(res.insertNumber, res.purchasePrice)
          this.arrlist1.push(res.insertNumber)

        })
        this.quantity = this.sum(this.arrlist1)
      }
    },
    // 计算物资进价-金额
    totalamountPrice(index, value) {
      this.arrlist=[]
      if (value.materialPrice < 0) {
        this.$message('金额最小为零')
        value.materialPrice = 0
        this.tableData.forEach(res => {
          res.purchasePrice = math.divide(res.materialPrice, res.insertNumber)
          // this.amount = math.add(this.amount, res.materialPrice)
          this.arrlist.push(res.materialPrice)
        })
        this.amount=this.sum(this.arrlist)
        // this.tableData.forEach(res => {
        //   res.purchasePrice = math.divide(res.materialPrice, res.insertNumber)
        //   this.amount = math.add(this.amount, res.materialPrice)
        // })
        return
      }else {
        this.tableData.forEach(res => {
          res.purchasePrice = math.divide(res.materialPrice, res.insertNumber)
            // this.amount = math.add(this.amount, res.materialPrice)
          this.arrlist.push(res.materialPrice)
        })
        this.amount=this.sum(this.arrlist)
      }

    },
    sum(arr) {
      return eval(arr.join("+"));
    },
    // 计算金额-物资进价
    totalPrice(index, value) {
      if (value.purchasePrice < 0) {
        this.$message('物资进价最小为零')
        value.purchasePrice = 0
        this.tableData.forEach(res => {
          res.materialPrice = math.multiply(res.purchasePrice, res.insertNumber)
          this.amount = math.add(this.amount, res.materialPrice)
        })
        return
      }
      this.tableData.forEach(res => {
        res.materialPrice = math.multiply(res.purchasePrice, res.insertNumber)
        this.amount = math.add(this.amount, res.materialPrice)
      })
    },
    // 物资名称
    // eslint-disable-next-line vue/no-dupe-keys
    async material(row) {
      this.materialtitle = true
      await this.$api.storageRoom.insertList({ materId: row.materId }).then(res => {
        if (res) {
          this.materialData = res.rows
        }
      })
      if (this.purchase !== 0) {
        row.purchasePrice = this.purchase
      }
    },
    // 物资信息 关闭
    materialClose() {
      this.materialtitle = false
    },
    // 物资信息 选择
    materialchoice(row) {
      this.purchase = row.purchasePrice
      this.materialtitle = false
      this.material()
    },
    // 暂存入库 / 确定
    async addRoom(val) {
      if (this.tableData.some((val) => val.purchasePrice < 0.00)) {
        this.$message('请填写物资进价')
        return
      }
      await this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.tableData.length === 0) {
            this.$message('请先选择入库产品')
            return
          }
          this.insertListList = []
          // 新增
          let totle = 0
          this.tableData.forEach(res => {
            totle = math.add(totle, res.materialPrice)
            this.insertListList.push({
              deptId: this.deptId, // 公司id
              materialTypeId: res.materialTypeId, // 一级
              typeId: res.typeId, // 二级
              matTypeId: res.matTypeId, // 物资类型 三级
              insertId: res.insertId === undefined ? 0 : res.insertId,
              availableNumber: res.insertNumber,
              materId: res.materId, // id
              materialName: res.materialName, // 物资名称
              materialSpec: res.materialSpec, // 规格
              unitName: res.unitName, // 单位
              place: res.place,
              purchasePrice: res.purchasePrice, // 进价
              insertNumber: res.insertNumber, // 入库数量
              materialPrice: math.multiply(res.purchasePrice, res.insertNumber), // 金额
              certificateNo: res.certificateNo, // 注册证号
              productionBatch: res.productionBatch, // 生产批次
              startTime: res.startTime, // 开始时间
              endTime: res.endTime, // 结束时间
              status: val,
              remark: res.remark, // 备注
              whouseId: res.whouseId, // 库房
              documentType: '1',
              assist:res.assist
            })
            if (res.insertId === undefined) {
              res.insertId = 0
              return
            }
            // 时间格式
            if (res.startTime !== undefined) {
              const cTime = new Date(res.startTime)
              const year = cTime.getFullYear()
              var month = cTime.getMonth() + 1 < 10 ? '0' + (cTime.getMonth() + 1) : cTime.getMonth() + 1
              var day = cTime.getDate() < 10 ? '0' + cTime.getDate() : cTime.getDate()
              res.startTime = year + '-' + month + '-' + day
            } else {
              res.startTime = ''
            }
            if (res.endTime !== undefined) {
              const cTimes = new Date(res.endTime)
              const years = cTimes.getFullYear()
              var months = cTimes.getMonth() + 1 < 10 ? '0' + (cTimes.getMonth() + 1) : cTimes.getMonth() + 1
              var days = cTimes.getDate() < 10 ? '0' + cTimes.getDate() : cTimes.getDate()
              res.endTime = years + '-' + months + '-' + days
            } else {
              res.endTime = ''
            }
          })
          var insertInfo = {
            insertInfoId: this.form.insertInfoId || '',
            deptId: this.deptId,
            inhouseData: this.form.inDocumentNo === '' ? timeFmt('', new Date()) : null,
            executeDate: val === 1 ? timeFmt('', this.form.executeDate) : null,
            inDocumentNo: this.form.inDocumentNo,
            executeUserId: this.form.executePerson,
            whouseId: this.form.whouseId,
            remark: this.form.remark,
            supplierNo: this.form.supplierNo,
            status: val,
            totalPrice: totle,
            documentType: '1',
            params:{
              insertion:this.insertion,
            }

          }
          this.submitLoading = true;
          // console.log(insertInfo);
          // return
          await this.$api.storageRoom.insertInfoAdd({
            'insertInfo': insertInfo,
            'insertListList': this.insertListList
          }).then(res => {
            if (res) {
              this.templateData = res.rows
              this.$router.push({ path: 'purchaseReceipt' })
              this.submitLoading = false
            }
          })
        }
      })
    },
    Delete() {
      const insertInfoId = this.$route.query.item.insertInfoId
      this.$confirm('此操作将永久此库存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.storageRoom.insertInfoDelete(insertInfoId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.closeTag()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 弹框 清空
    treeDelete() {
      this.templateDatas = []
      this.getTree()
    },
    // 弹框按钮 关闭
    handleClose() {
      this.templateData = []
      this.templateDatas = []
      this.dialogVisible = false
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取系统用户列表
    async getUserList() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      // 库房
      await this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          this.RoomList = res.data
        }
      })
      // 供应商
      await this.$api.storageRoom.supplierList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.supplier = res.rows
        }
      })
      // this.form.executeDate = formatDate('YY-MM-DD hh:mm:ss')
      // // 添加状态
      await this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.$forceUpdate()
          this.userList = this.unique(res.data)
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((item) => !res.has(item.userId) && res.set(item.userId, 1))
    },
    // 大页面关闭
    remode() {
      // if (this.tableData.length === 0) {
      //   this.$message('请先选择入库产品')
      //   return
      // }
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

.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.select {
  font-size: 12px;
  line-height: 35px;
  padding-left: 15px;
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

// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
::v-deep .el-input__inner{
  margin-left: 5px;
}
</style>
