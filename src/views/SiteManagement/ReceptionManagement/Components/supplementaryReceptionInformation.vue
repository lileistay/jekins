<template>
  <div  class="returnVisitDetial">
    <el-scrollbar class="el-scrollbar">
      <div class="customer-info-bar">
        <span>{{ obj.customerName }} {{ obj.customAge }}</span>
        <span>媒介：{{ obj.channelTypeName }}/{{ obj.channelName }}</span>
        <span />
        <!-- <span>线上客服:{{张三}} /</span> -->
        <span>渠道：网络咨询/</span>
        <span>接诊编号：{{ obj.receptionNumber }}</span>
      </div>

      <el-card class="el-card">
        <el-row :gutter="40">
          <el-col
            :xs="24"
            :md="6"
          >
            <div class="card-item">
              <div class="title"><i class="el-icon-menu" />接诊信息</div>
              <div class="card-item-box">
                <div>
                  接待时间：{{ obj.receptionTime }}
                </div>
                <div>接待人：{{ obj.gmaName }}</div>
                <div>美学顾问：{{ obj.acName }}</div>
              </div>

            </div>
          </el-col>
          <el-col
            :xs="24"
            :md="6"
          >
            <div class="card-item">
              <div class="title"><i class="el-icon-edit" /></div>
              <div class="card-item-box">
                <div>分诊科室：{{ obj.departmentName }}</div>
                <div>新老客户：{{ customer(obj.customerStatus) }}</div>
                <div>客户代表：{{ obj.crName }}</div>
              </div>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :md="6"
          >

            <div class="card-item">
              <div class="title"><i class="el-icon-phone" />客户意向描述</div>
              <div class="card-item-box">
                <el-form size="mini">
                  <el-form-item>
                    <el-input
                      v-model="obj.intentionDescription"
                      type="textarea"
                      disabled
                    />
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :md="6"
          >
            <div class="card-item">
              <div class="title"><i class="el-icon-phone" />分诊备注</div>
              <el-form size="mini">
                <el-form-item>
                  <el-input
                    v-model="obj.remark"
                    type="textarea"
                    disabled
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="height: 250px">

        <div>
          <el-form
            ref="tabaDate"
            label-width="120px"
            size="mini"
            :rules="rules"
          >
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col>
                <el-form-item label="医生" prop="doctorId">
                  <!-- <el-select v-model="tabaDate.doctorId"> -->
                  <el-select filterable v-model="obj.doctorId">
                    <el-option
                      v-for="item in sysUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="咨询备注" prop="consultationNotes">
                  <el-input
                    v-model="obj.consultationNotes"
                    rows="8"
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
              <el-col style="display: flex">
                <el-form-item label="模板供参考：" />
                <div style="font-size: 12px;margin-top: 6px">
                  职业：
                  <br>
                  消费能力描述：
                  <br>
                  有无既往了解史：
                  <br>
                  是否添加微信：
                  <br>
                  面诊医生：
                  <br>
                  有无使用工具设计：
                  <br>
                  本次设计方案及报价：
                  <br>
                  未成交原因：
                  <br>
                  其他铺垫及建议方案：
                  <br>
                  其他备注：

                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>

      </el-card>
      <div class="card-item-btn">
        客户信息
      </div>
      <el-card>

        <el-row>
          <el-col :span="12">
            <el-card>
              <p
                class="project"
                style="margin-bottom:10px"
              >客户标签 &nbsp;<span>先选择标签，在点添加按钮，可添加多个标签保存</span></p>
              <el-form size="mini">
                <el-form-item>
                  <el-select filterable v-model="labelForm.customerLabelTypeId" clearable @change="labelTypeSelection">
                    <el-option
                      v-for="(labelType,labelTypeIndex) in customerLabelTypeData"
                      :key="labelTypeIndex+'labelType'"
                      :label="labelType.labelTypeName"
                      :value="labelType.customerLabelTypeId"
                    />
                  </el-select>
                  <el-select filterable v-model="labelForm.labelDataId" clearable>
                    <el-option
                      v-for="(labelTypeChild,labelTypeChildIndex) in customerLabelTypeChildData"
                      :key="labelTypeChildIndex+'labelTypeChild'"
                      :label="labelTypeChild.labelTypeName"
                      :value="labelTypeChild.customerLabelTypeId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="labelForm.remark" style="width:60%" placeholder="备注" />
                  <el-button size="mini" @click="addCustomerLabelTypeToTable">添加</el-button>
                </el-form-item>
              </el-form>
              <el-table :data="list" height="120px" style="width: 100%" size="mini">
                <el-table-column label="操作" width="55" align="center">
                  <template slot-scope="{row}">
                    <span class="el-icon-close" @click.stop="removeTableItem(row)" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="labelTypeName"
                  label="标签类型"
                  width="180"
                  align="center"
                />
                <el-table-column
                  prop="labelDataName"
                  label="标签"
                  width="180"
                  align="center"
                />
                <el-table-column
                  prop="remark"
                  label="备注"
                  align="center"
                />
              </el-table>
            </el-card>
            <el-card>
              <p
                class="project"
                style="margin-bottom:10px"
              >客户需求 &nbsp; <span>先选择客户需求，再点添加按钮，可添加个需求再保存[未解决的需求不能重复添加]</span></p>
              <el-form size="mini">
                <el-form-item>
                  <el-select
                    v-model="customerDemandInfo.demandTypeId"
                    style="width:25%"
                    clearable
                    filterable
                    placeholder="选择需求类型"
                    @change="change"
                  >
                    <el-option
                      v-for="item in DemandData"
                      :key="item.demandTypeId"
                      el-option
                      :label="item.demandTypeName"
                      :value="item.demandTypeId"
                    />

                  </el-select>
                  <el-select
                    v-model="customerDemandInfo.demandId"
                    style="width:25%"
                    clearable
                    filterable
                    placeholder="选择需求"
                  >
                    <el-option
                      v-for="item in DemandList"
                      :key="item.demandId"
                      el-option
                      :label="item.demandName"
                      :value="item.demandId"
                    />
                  </el-select>
                  <el-select
                    v-model="customerDemandInfo.demandLevel"
                    style="width:25%"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in dict.type.demand_level"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    v-model="customerDemandInfo.isNeeded"
                    style="width:25%"
                    clearable
                    filterable
                    placeholder="是否刚需"
                  >
                    <el-option
                      v-for="item in dict.type.just_needed"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    v-model="customerDemandInfo.demandTime"
                    type="date"
                    clearable
                    format="yyyy-MM-dd"
                    style="width:25%;margin-right:5px"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                  <el-checkbox
                    v-model="customerDemandInfo.education"
                    true-label="1"
                    false-label="2"
                  >教育</el-checkbox>
                  <el-checkbox
                    v-model="customerDemandInfo.isDiscount"
                    true-label="1"
                    false-label="2"
                  >折扣</el-checkbox>
                  <el-checkbox
                    v-model="customerDemandInfo.expert"
                    true-label="1"
                    false-label="2"
                  >专家</el-checkbox>
                  <el-checkbox
                    v-model="customerDemandInfo.experience"
                    true-label="1"
                    false-label="2"
                  >体验</el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="customerDemandInfo.demandRemarks"
                    style="width:60%"
                    autocomplete="备注"
                  />
                  <el-button
                    size="mini"
                    @click="add"
                  >添加</el-button>
                </el-form-item>
                <!--                tableData-->
              </el-form>
              <el-table
                :data="tableData"
                style="width:100%"
                size="mini"
                height="200"
              >
                <el-table-column
                  label="需求类型"
                  width="100px"
                  prop="demandTypeName"
                />
                <el-table-column
                  label="需求名称"
                  prop="demandName"
                />
                <el-table-column
                  label="需求时间"
                  prop="demandTime"
                  width="100"
                />
                <!--                <el-table-column-->
                <!--                  label="状态"-->
                <!--                  :formatter="stateformatter"-->
                <!--                  prop="state"-->
                <!--                />-->
                <!--                <el-table-column-->
                <!--                  label="解决时间"-->
                <!--                  width="100"-->
                <!--                  prop="solutionTime"-->
                <!--                />-->
                <el-table-column
                  label="是否刚需"
                  :formatter="isNeededformatter"
                  prop="isNeeded"
                />
                <!--                <el-table-column-->
                <!--                  label="教育"-->
                <!--                  :formatter="isNeededformatter"-->
                <!--                  prop="education"-->
                <!--                />-->
                <!--                <el-table-column-->
                <!--                  label="折扣"-->
                <!--                  :formatter="isNeededformatter"-->
                <!--                  prop="isDiscount"-->
                <!--                />-->
                <!--                <el-table-column-->
                <!--                  label="专家"-->
                <!--                  :formatter="isNeededformatter"-->
                <!--                  prop="expert"-->
                <!--                />-->
                <!--                <el-table-column-->
                <!--                  label="体验"-->
                <!--                  :formatter="isNeededformatter"-->
                <!--                  prop="experience"-->
                <!--                />-->
                <el-table-column label="备注" prop="demandRemarks" width="160" />
                <el-table-column label="开发策略" width="350px">
                  <template slot-scope="{row}">
                    <el-checkbox v-model="row.education" true-label="1" false-label="2">教育</el-checkbox>
                    <el-checkbox v-model="row.isDiscount" true-label="1" false-label="2">折扣</el-checkbox>
                    <el-checkbox v-model="row.expert" true-label="1" false-label="2">专家</el-checkbox>
                    <el-checkbox v-model="row.experience" true-label="1" false-label="2">体验</el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="160px">
                  <template slot-scope="{row}">
                    <div v-if="row.id !== ''">
                      <el-button size="mini" :disabled="row.state==='1'" @click="solve(row)">{{ row.state === '1'?'已解决':'未解决' }}</el-button>
                      <el-button size="mini" @click="putdemand(row.customerDemandId)">编辑</el-button>
                    </div>
                    <div v-else>
                      <el-button size="mini" @click="removeDemand(row)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col
            style="margin-left:15px"
            :span="11"
          >
            <el-card>
              <p class="project">{{ this.isDeal==='1'? '未成交项目':'接诊项目' }} &nbsp;<span>{{ this.isDeal==='1' ? '先导入未成交项目，可导入多个项目再导入':'' }}</span></p>
              <el-row type="flex" justify="end">
                <el-button v-if="isDeal==='1'" size="mini" @click="NoDeal">导入</el-button>
              </el-row>
              <el-table
                v-if="isDeal==='1'"
                style="width: 100%"
                height="200px"
                size="mini"
                :data="adduser"
              >
                <el-table-column
                  label="产品名称"
                  prop="projectName"
                  width="150px"
                />
                <el-table-column
                  label="单位"
                  prop="priceUnit"
                />
                <el-table-column
                  label="价格"
                  prop="priceOne"
                />
                <el-table-column
                  label="价格2"
                  prop="priceTwo"
                />
                <el-table-column
                  label="折扣"
                  prop="discountNumber"
                />
                <el-table-column
                  label="次数"
                  prop="priceNum"
                />
              </el-table>
              <!--              成交的项目表格-->
              <el-table v-else style="width: 100%" height="200px" size="mini" :data="ReceptionItemsList">
                <el-table-column label="项目" prop="projectName" />
                <el-table-column label="备注" />
              </el-table>
            </el-card>
            <el-card v-if="isDeal==='1'">
              <p
                class="project"
                style="margin-bottom:10px"
              > 未成交原因&nbsp;<span>先选择未成交原因，在点添加按钮，可添加多中原因再保存</span></p>
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col>
                  <el-form ref="form" size="mini" :rules="rules">
                    <el-form-item prop="label">
                      <el-select
                        v-model="form.reason"
                        clearable
                      >
                        <el-option
                          v-for="item in dict.type.reason_choice"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-button
                        size="mini"
                        @click="addreason"
                      >添加</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col />

              </el-row>
              <el-table
                style="width: 100%"
                size="mini"
                :data="labelList"
              >
                <el-table-column
                  label="操作"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span
                      class="el-icon-close"
                      @click.stop="removelabel(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="原因"
                  prop="reason"
                />
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <el-table
          style="width: 100%"
          :data="ReceptionData"
          size="mini"
          height="200px"
        >
          <el-table-column
            label="接诊时间"
            width="200"
            prop="receptionTime"
          />
          <el-table-column
            label="接诊编号"
            prop="receptionNumber"
          />
          <el-table-column
            label="分诊备注"
            prop="remark"
          />
          <el-table-column
            label="咨询备注"
            prop="consultationNotes"
          />
        </el-table>

        <el-row
          type="flex"
          justify="end"
        >
          <el-button
            size="mini"
            @click="preservation"
          >保存</el-button>
          <el-button
            size="mini"
            @click="colseOpen"
          >关闭</el-button>
        </el-row>
      </el-card>

      <!-- 未成交添加弹层 -->
      <elasticLayer :dialog-visible.sync="dialogVisible" @updata="updata" />
      <Adddemand
        :id="id"
        ref="put"
        :dialog-visible.sync="showDialog"
        @RefreshList="RefreshList"
      />
    </el-scrollbar>

  </div>
</template>

<script>
import { todayTime } from '@/utils/time'
import elasticLayer from '@/views/SiteManagement/ReceptionManagement/Components/elasticLayer.vue'
import Adddemand from '@/views/SiteManagement/ReceptionManagement/Components/addDemand'// 编辑弹层
import vm from '@/utils/util'
import { throttle } from '@/utils/throttleAndDebounce'
import {LOG2E} from "mathjs"; // 节流

export default {
  dicts: ['demand_level', 'just_needed', 'reason_choice', 'demand_status', 'whether_Newguest'],
  components: {
    elasticLayer,
    Adddemand
  },
  data() {
    const consultationNotes = (rule, value, callback) => {
      if (this.obj.consultationNotes === undefined) {
        callback('请填写咨询备注！')
      }
      callback()
    }
    return {
      ReceptionItemsList: [], // 点击成交后显示的项目
      isDeal: '', // 是否成交
      // 加载蒙版
      showDataDialog: false,
      // 表单校验规则
      rules: {
        doctorId: [
          { required: true, message: '请选择医生', trigger: 'blur' }
        ],
        consultationNotes: [
          { required: true, validator: consultationNotes, trigger: 'blur' }
        ]
      },
      id: '',
      obj: {
        customerName: '',
        customAge: '',
        channelTypeName: '',
        channelName: '',
        receptionNumber: '',
        receptionTime: '',
        gmaName: '', // 接待人名称
        acName: '', // 美学顾问
        departmentName: '',
        customerStatus: '',
        crName: '', // 客户代表
        intentionDescription: '', // 客户意向描述
        aestheticConsultant: 0,
        arrivalTime: '',
        consultationNotes: '',
        cpTransaction: '',
        customerRepresentative: 0,
        delFlag: '',
        departmentId: 0,
        doctorId: 0,
        giveMedicalAdvice: 0,
        id: 0,
        isDeal: '',
        isSecondary: '',
        jdxxId: 0,
        memberCustomerId: 0,
        receptionStatus: '',
        serviceAssistant: 0,
        transactionMoney: '',
        treatment: '',
        triageType: 0,
        unsettledItems: '',
        unsettledReason: '',
        xmTransaction: ''
      },
      showDialog: false, // 需求编辑的弹层
      adduser: [], // 弹层过来的数据
      dialogVisible: false, // 未成交项目导入弹层
      ReceptionData: [], // 接待列表数据
      sysUserList: [], // 用户列表
      selectionData: '', // id
      tabaDate: {}, // 医生和备注
      // 顾客标签类型
      customerLabelTypeData: [],
      // 标签
      customerLabelTypeChildData: [],
      administration: [], // 客户需求管理
      DemandList: [], // 根据关联显示的二级数据
      customerDemandInfo: {
        demandId: '',
        customerDemandId: '',
        demandLevel: '',
        demandRemarks: '',
        demandTime: '',
        demandTypeId: '',
        education: '',
        experience: '',
        expert: '',
        id: '',
        isDiscount: '',
        isNeeded: '',
        operationType: '',
        solutionTime: '',
        state: '2'
      },
      DemandData: [], //
      tableData: [], // 需求列表
      list: [], // 大客户数据
      // 顾客标签表单
      labelForm: {
        customerId: '',
        customerLabelId: '',
        customerLabelTypeId: '',
        customerType: 2,
        deptId: '',
        id: '',
        labelDataId: '',
        labelDataName: '',
        labelTypeName: '',
        operationType: '',
        remark: ''
      },
      form: {
        label: ''
      },
      labelList: [],
      customerLabelRelationDtos: [],
      customerDtos: []
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
      this.customerLabelType()
      this.getUserList(val)
    }
  },
  created() {
    this.selectionData = this.$route.query.id
    this.jdxxId = this.$route.query.jdxxId
    this.isDeal = this.$route.query.isDeal // 是否成交的
    this.getCustomerInfo()
    // this.singleList()//获取单挑数据的请求
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.customerLabelType() // 获取顾客标签
    this.DemandManagement() // 获取客户需求
    this.ReceptionList(this.selectionData) // 获取客户需求关系表
    this.DemandType()// 客户需求
    this.NoDealList(this.selectionData) // 未成交项目
    this.ReceptionResults(this.selectionData)
    this.TagList()// 客户标签列表
    this.notDealReasonlist(this.selectionData)
    this.UnsettledItems()
    // this.NoDealTabe(this.selectionData)
  },
  methods: {
    /**
     * @author 王发发
     * @date 2022/5/24
     * @Description: 点击需求列表中的未解决按钮
    */
    solve(custom) {
      var d = todayTime(new Date()) // 获取系统当前时间
      this.$confirm('是否解决该需求, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.demand.putDemandRelationship({ ...custom, state: '1', solutionTime: d[0] }).then((res) => {
          if (res) {
            this.ReceptionList()
          }
        })
      }).catch((err) => {
      })
    },

    // 需求列表的删除按钮
    /**
     * @author 王发发
     * @date 2022/5/24
     * @Description: 需求列表的删除按钮
    */
    removeDemand(row) {
      this.tableData.forEach((item, index) => {
        item.itemId = index
      })
      const arr = this.tableData
      const id1 = arr.findIndex((arr) => arr.itemId === row.itemId)// id1为对象的数组下标
      this.tableData.splice(id1, 1)
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 获取接诊基本信息
    getCustomerInfo() {
      this.showDataDialog = true
      this.$api.dept.ReceptionList('get', { jdxxId: this.jdxxId }).then(res => {
        this.obj = res.rows[0]
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    /**
     * @author 王发发
     * @date 2022/5/23
     * @Description: 我的接待列表 已成交的 点击后显示的项目列表
    */
    // 项目列表
    UnsettledItems() {
      this.$api.netPower.UnsettledItems({ id: this.selectionData }).then((res) => {
        if (res) {
          this.ReceptionItemsList = res.rows
        }
      })
    },
    // 获取未成交原因List
    notDealReasonlist() {
      this.$api.netPower.notDealReason({ id: this.selectionData }).then(res => {
        if (res) {
          this.labelList = res.rows
        }
      })
    },
    // 未成交项目导入
    NoDeal() {
      this.dialogVisible = true
    },
    // 添加顾客标签至表格
    addCustomerLabelTypeToTable() {
      if (this.labelForm.labelDataId === undefined || this.labelForm.customerLabelTypeId === undefined) {
        this.$message.error('请先选择标签类型和标签')
        return
      }
      const type = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === this.labelForm.customerLabelTypeId
      })
      this.labelForm.labelTypeName = type[0].labelTypeName

      const label = this.customerLabelTypeChildData.filter(filter => {
        return filter.customerLabelTypeId === this.labelForm.labelDataId
      })
      this.labelForm.labelDataName = label[0].labelTypeName

      let flag = true
      this.list.forEach(item => {
        if (item.labelDataId === this.labelForm.labelDataId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.list.push(this.labelForm)
        this.customerLabelRelationDtos.push(this.labelForm)
      } else {
        this.$message.warning('不可重复添加！')
      }
      this.labelForm = {
        labelDataId: undefined,
        customerLabelTypeId: undefined,
        labelTypeName: undefined,
        labelDataName: undefined,
        remark: undefined
      }
      this.customerLabelTypeChildData = []
    },
    // 删除表格行
    removeTableItem(row) {
      const customerLabelIds = row.customerLabelId
      if (row.id) {
        this.$confirm('是否删除此条数据？').then(async() => {
          const { msg } = await this.$api.dept.removeCustomerLabel(customerLabelIds)
          this.$message.success(msg)
          this.TagList()
        })
      } else {
        let Rindex = -1
        this.list.forEach((item, index) => {
          if (item.labelDataId === row.labelDataId) {
            Rindex = index
            return
          }
        })
        if (Rindex !== -1) {
          this.list.splice(Rindex, 1)
        }
      }
    },

    // 获取客户需求
    DemandManagement() {
      // 添加状态
      this.$api.demand.DemandManagement({status: '0'}).then((res) => {
        if (res) {
          this.administration = res.rows
        }
      })
    },
    // 需求类型
    DemandType() {
      // 添加状态
      let data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.demand.DemandType(data).then((res) => {
        if (res) {
          this.DemandData = res.rows
        }
      })
    },
    // 顾客标签选择
    labelTypeSelection(selection) {
      this.labelForm.labelDataId = undefined
      this.customerLabelTypeChildData = []
      const data = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === selection
      })
      this.customerLabelTypeChildData = data[0].customLabelData
    },
    // 获取顾客标签
    customerLabelType() {
      this.$api.modules.custLabel.customerLabelType({ deptId: this.deptId }).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data
        }
      })
    },
    updata(data) {
      this.dialogVisible = false
      data.forEach(item => {
        this.adduser.push(item)
      })
    },
    // 未成交项目列表
    NoDealList(id) {
      this.$api.UnsettledItems.NoDealList({ id: id }).then((res) => {
        if (res) {
          this.adduser = res.rows
          if (this.adduser.length !== 0) {
            this.adduser.forEach(item => {
              this.$set(item, 'priceNum', item.frequency)
            })
          }
        }
      })
    },
    // 顾客标签列表
    TagList() {
      const id = this.$route.query.id
      this.$api.dept.CustomerLabel('get', { id: id }).then((res) => {
        if (res) {
          this.list = res.rows
        }
      })
    },
    // 获取用户列表
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
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.sysUserList.push(item)
            }
          }) // 医生
        }
      })
    },
    // 为顾客添加操作原因
    addreason() {
      if (this.form.reason === '' || this.form.reason === undefined) {
        this.$message.error('请先选择未成交原因')
        return
      }
      let flag = true
      this.labelList.forEach((item) => {
        if (item.value === this.form.reason) {
          flag = false
          return
        }
      })
      if (flag) {
        const obj = this.dict.type.reason_choice.filter(item => item.value === this.form.reason)
        obj.forEach(item => {
          this.$set(item, 'reason', item.label)
        })
        this.labelList.push(obj[0])
      } else {
        this.$message.warning('不能重复添加')
      }
    },
    // 删除未成交原因
    removelabel(row) {
      const notReasonIds = row.notReasonId
      if (row.id) {
        this.$confirm('是否删除此条数据？').then(async() => {
          const { msg } = await this.$api.netPower.notRemove(notReasonIds)
          this.$message.success(msg)
          this.notDealReasonlist()
        })
      } else {
        let Rindex = -1
        this.labelList.forEach((item, index) => {
          Rindex = index
          return
        })
        if (Rindex !== -1) {
          this.labelList.splice(Rindex, 1)
        }
      }
    },
    // 添加客户需求
    add() {
      // this.tableData.push(this.customerDemandInfo)
      const objs = this.DemandData.filter((item) => {
        return item.demandTypeId === this.customerDemandInfo.demandTypeId
      })
      const type = this.DemandList.filter(filter => {
        return filter.demandId === this.customerDemandInfo.demandId
      })
      // 需求类型
      const demandTypeName = objs[0].demandTypeName
      // 需求
      const demandName = type[0].demandName
      const tab = this.customerDemandInfo
      Object.defineProperty(tab, 'demandTypeName', { value: demandTypeName })
      Object.defineProperty(tab, 'demandName', { value: demandName })
      this.tableData.push(tab)
      this.customerDemandInfo = {
        demandId: '',
        demandTypeName: '',
        demandName: '',
        customerDemandId: '',
        demandLevel: '',
        demandRemarks: '',
        demandTime: '',
        demandTypeId: '',
        education: '',
        experience: '',
        expert: '',
        id: '',
        isDiscount: '',
        isNeeded: '',
        operationType: '',
        solutionTime: '',
        state: ''
      }
    },
    // 转换表格的类型状态
    stateformatter(row, column, cellValue, index) {
      const obj = this.dict.type.demand_status.find(item => item.value == cellValue)
      return obj ? obj.label : ''
    },
    isNeededformatter(row, column, cellValue, index) {
      const obj = this.dict.type.just_needed.find(item => item.value == cellValue)
      return obj ? obj.label : ''
    },
    // 新老客户的转换
    customer(str) {
      const obj = this.dict.type.whether_Newguest.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    // 获取客户需求关系表
    ReceptionList() {
      const id = this.$route.query.id
      this.$api.demand.DemandRelationship({ id: id }).then((res) => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    // 点击保存接口
    preservation() {
      if (this.obj.consultationNotes === undefined || this.obj.consultationNotes === '' || this.obj.consultationNotes === null) {
        this.$message.error('请填写咨询备注！')
        return
      }
     // if(this.$route.query.isDeal=='2'){
     //
     //
     //  this.$api.dept.ReceptionSupplementary({
     //      'result': {
     //        'jdxxId': this.obj.jdxxId,
     //        'doctorId': this.obj.doctorId,
     //        'consultationNotes': this.obj.consultationNotes
     //      },
     //      'customerLabelRelationDtos': this.customerLabelRelationDtos, // 客户标签
     //      'noDealProjecInfos': this.adduser, // 未成交项目
     //      'customerDtos': this.tableData, // 客户需求
     //      'nodealResultDto': this.labelList // 未成交原因
     //    }).then((res) => {
     //      if (res) {
     //        this.$message.success('保存成功')
     //        this.closeTag()
     //      }
     //    })
     //    return
     // }

      else if (this.labelList.length === 0&&this.$route.query.isDeal=='1') {
        this.$message.error('请选择未成交原因！')
      } else {
        if (this.adduser.length > 0) {
          this.adduser.forEach(item => {
            this.$set(item, 'id', this.obj.id)
            this.$set(item, 'operationType', 1)
            this.$set(item, 'deptId', this.deptId)
            this.$set(item, 'frequency', item.priceNum)
            this.$set(item, 'projectTypeId', item.productItemType)
            this.$delete(item, 'createBy')
            this.$delete(item, 'createTime')
            // 将接待时间传入未成交项目
            this.$set(item, 'arrivalTime', this.obj.receptionTime)
            this.$set(item, 'receptionId', this.obj.aestheticConsultant)
          })
        } else {
          this.adduser = []
        }
        // if (this.customerDemandInfo.demandTypeId !== '') {
        //   this.$set(this.customerDemandInfo, 'id', this.obj.id)
        //   this.$set(this.customerDemandInfo, 'operationType', 1)
        //   this.customerDtos.push(this.customerDemandInfo)
        // }else {
        //   this.customerDtos = []
        // }
        if (this.tableData.length !== 0) {
          this.tableData.forEach(item => {
            this.$set(item, 'id', this.obj.id)
            this.$set(item, 'operationType', 1)
            this.$delete(item, 'createTime')
          })
        } else {
          this.tableData = []
        }
        if (this.customerLabelRelationDtos.length !== 0) {
          this.customerLabelRelationDtos.forEach(item => {
            this.$set(item, 'id', this.obj.id)
            this.$set(item, 'deptId', this.deptId)
            this.$set(item, 'operationType', 1)
            this.$set(item, 'customerType', 2)
            this.$delete(item, 'createTime')
          })
        } else {

          this.customerLabelRelationDtos = []
        }
        if (this.labelList.length > 0||this.$route.query.isDeal=='2') {
           if(this.$route.query.isDeal=='2'){
             this.labelList=[{

             }]
             this.labelList.forEach(item => {
               this.$set(item, 'id', this.obj.id)
               this.$set(item, 'deptId', this.deptId)
               this.$set(item, 'departmentId', this.obj.departmentId)
               this.$set(item, 'arrivalTime', this.obj.receptionTime)
               this.$set(item, 'aestheticConsultant', this.obj.aestheticConsultant)
               this.$set(item, 'jdxxId', this.obj.jdxxId)
               this.$delete(item, 'createTime')
             })
           }else {
             this.labelList.forEach(item => {
               this.$set(item, 'id', this.obj.id)
               this.$set(item, 'deptId', this.deptId)
               this.$set(item, 'departmentId', this.obj.departmentId)
               this.$set(item, 'arrivalTime', this.obj.receptionTime)
               this.$set(item, 'aestheticConsultant', this.obj.aestheticConsultant)
               this.$set(item, 'jdxxId', this.obj.jdxxId)
               this.$delete(item, 'createTime')
             })
           }

        } else {
          this.labelList = []
        }
        this.$api.dept.ReceptionSupplementary({
          'result': {
            'jdxxId': this.obj.jdxxId,
            'doctorId': this.obj.doctorId,
            'consultationNotes': this.obj.consultationNotes
          },
          'customerLabelRelationDtos': this.customerLabelRelationDtos, // 客户标签
          'noDealProjecInfos': this.adduser, // 未成交项目
          'customerDtos': this.tableData, // 客户需求
          'nodealResultDto': this.labelList // 未成交原因
        }).then((res) => {
          if (res) {
            this.$message.success('保存成功')
            this.closeTag()
          }
        })
      }
    },
    // 获取接待列表的数据
    ReceptionResults(id) {
      this.$api.dept.ReceptionResults({ id: id }).then((res) => {
        if (res) {
          this.ReceptionData = res.rows
        }
      })
    },
    // 监听事件
    change(selection) {
      this.customerDemandInfo.demandId = ''
      const data = this.administration.filter((item) => {
        return item.demandTypeId == selection
      })
      this.DemandList = data
    },
    // 关闭按钮
    colseOpen() {
      this.closeTag()
      // this.$router.go(-1);
    },

    // 需求编辑
    async putdemand(node) {
      const customerDemandId = node
      this.showDialog = true // 打开弹层
      await this.$refs.put.getInfoList(customerDemandId)
    },
    // 弹层自定义事件
    RefreshList() {
      this.showDialog = false
      this.ReceptionList() // 重新拉去列表
    }
  }
}
</script>

<style lang="scss" scoped>
.return-picture {
  list-style: none;
  li {
    display: flex;
    border-bottom: 1px solid #cccccc;
    padding-bottom: 10px;
    box-sizing: border-box;
    div {
      width: 50%;
      text-align: center;
      color: #666666;
    }
  }
}
.returnVisitDetial {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .el-scrollbar {
    height: 100%;
    & .customer-info-bar {
      span {
        margin: 0 6px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  & > span {
    font-size: 14px;
    margin: 0 6px;
  }
  .buttonBox {
    width: 100%;
    height: auto;
    display: flex;
    margin: 10px 0;
    .hu {
      flex: 20%;
      margin-left: auto;
      text-align: right;
    }
  }
  .el-card {
    margin-top: 10px;
    .project {
      & > span {
        font-size: 12px;
        color: red;
      }
    }
    .card-item {
      .title {
        font-size: 14px;
        font-weight: bold;
        i {
          margin-right: 6px;
        }
        margin: 10px 0;
      }
      .card-item-box {
        & > div {
          font-size: 12px;
          margin: 10px 0;
        }
      }
    }
  }
  .card-item-btn {
    margin-top: 10px;
    font-weight: bold;
    font-size: 14px;
  }
}
::v-deep .el-divider--horizontal {
  margin: 6px 0;
}
.resultLeft {
  margin-left: 10px;
  & span {
    font-size: 14px;
  }
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  z-index: 999999;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  height: 20px;
  background: #dcdcdc;
}
::v-deep .el-scrollbar {
  width: 100%;
  height: 100%;
}
</style>
