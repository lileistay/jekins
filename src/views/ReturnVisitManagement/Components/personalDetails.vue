<template>
  <!-- 未到院顾客信息 -->
  <div>
    <div class="customerInfo-container">
      <div class="customerInfo-content">
        <div class="basicInformation-container">
          <!-- 关注问题 -->
          <div class="Concerns">
            <div class="concerns-one">
              <p class="Concerns-title">
                <i class="el-icon-search" />
                关注问题
              </p>
              <div class="treatment">
                <span style="margin: 0 10px">
                  {{ customInfo.concerns }}
                </span>
              </div>
              <p class="Concerns-title">
                <i class="el-icon-edit" />
                临客备注
              </p>
              <div style="width: 98%">
                <el-form style="width: 98%">
                  <el-form-item prop="remarks">
                    <el-input v-model="customInfo.remarks" disabled type="textarea" :rows="5" />
                  </el-form-item>
                </el-form>
              </div>
              <p class="Concerns-title">
                <i class="el-icon-paperclip" />
                临客标签
                <el-link type="primary" :underline="false" @click="customerLabelEdit">
                  <i class="el-icon-circle-plus" /> 添加标签
                </el-link>
              </p>
              <div style="width: 98%">
                <div style="margin-left: 10px">
                  <el-table
                    size="mini"
                    :data="data"
                    max-height="120"
                    border
                  >
                    <el-table-column
                      label="标签"
                      width="90"
                      prop="labelTypeName"
                      align="center"
                    />
                    <el-table-column
                      label="添加人"
                      prop="createBy"
                      width="90"
                      align="center"
                    />
                    <el-table-column
                      label="添加时间"
                      prop="createTime"
                      align="center"
                      show-overflow-tooltip
                    />
                    <el-table-column
                      label="备注"
                      prop="remark"
                      align="center"
                      show-overflow-tooltip
                      width="80"
                    />
                  </el-table>
                </div>

              </div>
              <p class="Concerns-title">
                <i class="el-icon-notebook-2" />
                添加跟进记录
              </p>
              <div style="width: 98%">
                <el-form style="width: 98%">
                  <el-form-item prop="remark">
                    <el-input v-model="customInfo.remark" type="textarea" :rows="3" resize="none" />
                  </el-form-item>
                </el-form>
                <p style="font-size: 10px; margin: 20px 0 0 10px;color: red"> 先填写记录，再点击按钮，保存信息</p>
                <el-button
                  v-has-permi="['confinement:followUpRecord:add']"
                  type="primary"
                  size="mini"
                  style="float: right;margin: -20px 15px 0 0"
                  icon="el-icon-plus"
                  :loading="submitLoading"
                  @click="add"
                >添加跟进记录
                </el-button>
              </div>
              <p class="Concerns-title">
                <i class="el-icon-alarm-clock" />
                跟进时间
              </p>
              <div style="width: 98%;">
                <div style="margin-left: 10px">
                  <el-table
                    size="mini"
                    border
                    :data="tableData"
                    style="width: 100%"
                    max-height="120"
                  >
                    <el-table-column
                      prop="createTime"
                      label="跟进时间"
                      width="110"
                      show-overflow-tooltip
                      align="center"
                    />
                    <el-table-column
                      prop="createBy"
                      label="跟进人"
                      width="80"
                      align="center"
                    />
                    <el-table-column
                      prop="remark"
                      label="跟进内容"
                      show-overflow-tooltip
                      align="center"
                    />
                    <el-table-column
                      label="操作"
                      align="center"
                      width="50"
                    >
                      <template slot-scope="scope">
                        <i align="center" class="el-icon-delete-solid" @click="deletes(scope.row)" v-has-permi="['delverRemove:list']" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧 -->
          <div class="concerns-two">
            <el-card class="el-card">
              <div class="container-basic">
                <div>
                  <div class="title"><i class="el-icon-user-solid" />基本信息</div>
                  <ul class="basic-item-box">
                    <li>建档时间：{{ customInfo.createTime }}</li>
                    <li>预约时间：{{ customInfo.appointmentTime }}</li>
                    <li>预约项目：{{ customInfo.bookingPeojectName }}</li>
                    <li>怀孕几周：{{ customInfo.pregnantWeek }}周</li>
                    <li>预产期：{{ customInfo.preProduction }}</li>
                    <li>房间类型：{{ customInfo.roomType }}</li>
                    <li>胎数：{{ customInfo.fertility }}</li>
                  </ul>
                </div>
                <div>
                  <div class="title"><i class="el-icon-phone" />联系方式</div>
                  <ul class="basic-item-box">
                    <li>电话号码:
                      <span> {{ customInfo.customPhone }} </span>
                      <el-button v-show="show" size="mini" @click="toshow">显示电话</el-button>
                    </li>
                    <li>微信：{{ customInfo.wechat }}</li>
                    <li>QQ: {{ customInfo.qq }}</li>
                    <li>地址：{{ customInfo.province }}{{ customInfo.city }}{{ customInfo.area }}</li>
                  </ul>
                </div>
                <div>
                  <div class="title"><i class="el-icon-s-unfold" />其他信息</div>
                  <ul class="basic-item-box">
                    <li>意向度：{{ Degree(customInfo.degreeIntention) }}</li>
                    <li>媒介： {{ customInfo.channelName }}</li>
                    <li>建档类型：{{ customInfo.typeThreeName }}</li>
                    <li>推荐人：{{ customInfo.refereeName }}</li>
                    <li>员工推荐人：{{ customInfo.redName }}</li>
                  </ul>
                </div>
              </div>
            </el-card>
            <el-row>
              <el-card>
                <!-- <el-col :span="12"> -->
                <Return-record v-if="huifang!==null" :huifang="huifang" />
              </el-card>
            </el-row>
            <!-- 客户标签弹层 -->
            <sg-dialog title="临客标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabelDialogs">
              <div slot="out">
                <div class="dialog-box">
                  <div class="title">
                    <div style="margin-bottom: 15px;font-size: 15px">客户基本信息</div>
                  </div>
                  <div class="content">
                    <el-form label-width="80px" size="mini" disabled>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="客户姓名">
                            <el-input v-model="manualForm.userInfo.customerName" class="full-width" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="客户电话">
                            <el-input v-model="manualForm.userInfo.customPhone" class="full-width" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="客户性别">
                            <el-select filterable v-model="manualForm.userInfo.customSex" class="full-width" placeholder="请选择性别">
                              <el-option
                                v-for="dict in dict.type.sys_user_sex"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="经济能力">
                            <el-select  filterable v-model="manualForm.userInfo.economicCapacity" class="full-width" placeholder="请选择">
                              <el-option
                                v-for="dict in dict.type.economic_capacity"
                                :key="Number(dict.value)"
                                :value="Number(dict.value)"
                                :label="dict.label"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="建档时间">
                            <el-input v-model="manualForm.userInfo.createTime" class="full-width" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="线上客服">
                            <el-input v-model="manualForm.userInfo.onlineUserName" class="full-width" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </div>
                <div class="dialog-box">
                  <div class="title">
                    <div style="margin-bottom: 15px;font-size: 15px">添加标签</div>
                  </div>
                  <div class="content">
                    <el-form label-width="80px" size="mini" :loading="manualFormLoading">
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="标签类型">
                            <el-select
                              v-model="manualForm.form.customerLabelTypeId"
                              class="full-width"
                              placeholder="请选择标签类型"
                              @change="labelTypeSelection"
                              filterable
                            >
                              <el-option
                                v-for="(labelType,labelTypeIndex) in customerLabelTypeData"
                                :key="labelTypeIndex+'labelType'"
                                :label="labelType.labelTypeName"
                                :value="labelType.customerLabelTypeId"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="标签">
                            <el-select filterable v-model="manualForm.form.labelDataId" class="full-width" placeholder="请选择标签">
                              <el-option
                                v-for="(labelTypeChild,labelTypeChildIndex) in customerLabelTypeChildData"
                                :key="labelTypeChildIndex+'labelTypeChild'"
                                :label="labelTypeChild.labelTypeName"
                                :value="labelTypeChild.customerLabelTypeId"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="登记时间">
                            <el-date-picker
                              v-model="manualForm.form.registerTime"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              class="full-width"
                              placeholder="选择日期"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="备注信息">
                            <el-input
                              v-model="manualForm.form.remark"
                              placeholder="请输入备注信息"
                              type="textarea"
                              :rows="3"
                              resize="none"
                              class="full-width"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item>
                            <el-button
                              type="primary"
                              icon="el-icon-plus"
                              :loading="manualFormLoading"
                              @click.stop="addCustomerLabelTypeToTable"
                            >添加
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </div>
                <div class="dialog-box">
                  <div class="title">
                    <div style="margin-bottom: 15px;font-size: 15px">顾客标签</div>
                  </div>
                  <div class="content">
                    <el-table
                      :data="manualFormTableData"
                      stripe
                      size="mini"
                      style="width: 100%"
                    >
                      <el-table-column
                        type="index"
                        width="50"
                        label="序号"
                        align="center"
                      />
                      <el-table-column
                        prop="labelDataName"
                        label="标签"
                        align="center"
                      />
                      <el-table-column
                        prop="createBy"
                        label="登记人"
                        align="center"
                      />
                      <el-table-column
                        prop="createTime"
                        label="登记日期"
                        width="140"
                        align="center"
                      />
                      <el-table-column
                        prop="remark"
                        label="备注"
                        width="200"
                        align="center"
                      />
                      <el-table-column
                        prop="address"
                        label="编辑"
                        align="center"
                        width="80"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" size="mini">
                            <span style="color: red" @click.stop="removeToTable(scope.row)">删除</span>
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </sg-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReturnRecord from '@/components/ReturnRecord'
import SgDialog from '@/components/Dialog' // 客户标签弹层
// import { throttle } from '@/utils/throttleAndDebounce' // 节流

export default {
  dicts: ['sys_user_sex', 'degree_intention_list', 'economic_capacity'],
  components: { ReturnRecord, SgDialog },
  props: ['customInfo'],
  data() {
    return {
      submitLoading: false,
      load: false, // 手机好隐藏和显示
      show: true,
      from: {},
      item: '',
      flag: true,
      tableData1: [],
      tableData: [], // 跟进时间
      forms: {
        remark: ''
      },
      // 顾客标签类型
      customerLabelTypeData: [],
      customerLabelTypeChildData: [],
      manualFormTableData: [],
      // 顾客标签
      manualForm: {
        userInfo: {},
        manualReport: {
          isOneReturnVisit: true
        },
        form: {
          customerLabelTypeId: undefined,
          labelDataId: undefined,
          registerTime: this.getNowTime(),
          remark: undefined,
          labelTypeName: undefined,
          labelDataName: undefined
        }
      },
      manualFormLoading: false,
      id: '', // 接受传递过来的id
      huifang: [], // 接受回访的数据
      PersonalDetails: [], // 个人详情
      data: [], // 临客标签
      customLabelDialog: false // 显示客户信息弹层
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
      this.customerLabelType(val)
    }
  },
  created() {
    this.PersonalDetails.push(this.customInfo)
    this.id = this.$route.query.id
    // this.id = sessionStorage.getItem('notInHospitalid')
    this.ReturnVisit(this.id) // 回访详情
    this.CustomerLabel(this.id) // 临客回访表格数据
    this.customerLabelType() // 获取顾客标签
    this.followuprecord()
  },
  methods: {
    getNowTime() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      return defaultDate
    },
    toshow() {
      // this.show = !this.show
      // this.load = !this.load
      this.show = !this.show
      if (this.show === true) {
        this.load = false
      } else {
        this.$api.user.customidGetPhone({ customeerId: this.id }).then(res => {
          if (res) {
            this.customInfo.customPhone = res.msg
            this.load = true
          }
        })
      }
    },
    // 用户信息
    customerInfo() {
      const id = this.$route.query.id
      this.$api.user.getinfo(id).then(res => {
        if (res) {
          this.from = res.data
        }
      })
    },
    // 个人详情
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // // // 临客标签
    // 获取顾客标签信息
    getUserLabelInfo(id) {
      this.$api.modules.netPower.getUserLabelInfo({ id: id }).then((res) => {
        if (res) {
          this.manualForm.userInfo = res.data.customInfoVo
          this.manualFormTableData = res.data.labelRelations
        }
      })
    },
    // 客户标签删除按钮
    removeToTable(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.netPower.deleteCustomerLabel(row.customerLabelId).then(res => {
          if (res.code === 200) {
            this.CustomerLabel()
            this.$message.success('删除成功')
            this.CustomerLabel()
            this.getUserLabelInfo(this.id)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 个人详情
    details() {
      const id = this.id
      this.$api.dept.receiveReceptionSheet(id, 'get').then(res => {
        if (res) {
          this.PersonalDetails = res.data
        }
      })
    },
    // 回访详情
    ReturnVisit(id) {
      this.$api.modules.netPower.returnVisitPlan({ id: id }).then((res) => {
        if (res) {
          this.huifang = res.rows
        }
      })
    },
    // 为顾客添加标签
    addUserLabel(data) {
      this.manualFormLoading = true
      this.$api.modules.netPower.addUserLabel(data).then(res => {
        if (res) {
          this.getUserLabelInfo(this.id)
        }
      }).finally(() => {
        this.manualFormLoading = false
      })
    },
    // 顾客标签选择
    labelTypeSelection(selection) {
      this.manualForm.form.labelDataId = undefined
      this.customerLabelTypeChildData = []
      const data = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === selection
      })
      this.customerLabelTypeChildData = data[0].customLabelData
    },
    // 添加标签
    // 客户信息标签
    customerLabelEdit() {
      this.getUserLabelInfo(this.id)
      this.customLabelDialog = true
    },
    customLabelDialogs() {
      this.manualForm.form.customerLabelTypeId = ''
      this.manualForm.form.labelDataId = ''
      this.manualForm.form.remark = ''
      this.customLabelDialog = false
    },
    // 添加客户信息按钮
    addCustomerLabelTypeToTable() {
      if (this.manualForm.form.labelDataId === undefined || this.manualForm.form.customerLabelTypeId === undefined) {
        this.$message.error('请先选择标签类型和标签')
        return
      }
      const type = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === this.manualForm.form.customerLabelTypeId
      })
      this.manualForm.form.labelTypeName = type[0].labelTypeName

      const label = this.customerLabelTypeChildData.filter(filter => {
        return filter.customerLabelTypeId === this.manualForm.form.labelDataId
      })
      this.manualForm.form.labelDataName = label[0].labelTypeName

      let flag = true
      this.manualFormTableData.forEach(item => {
        if (item.labelDataId === this.manualForm.form.labelDataId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.manualForm.form.customerId = this.manualForm.userInfo.customId
        this.manualForm.form.id = this.id

        this.addUserLabel(this.manualForm.form)
      } else {
        this.$message.warning('不可重复添加！')
      }
      this.getUserLabelInfo(this.id)
      this.CustomerLabel()
      this.customerLabelType()
      this.manualForm.form = {
        labelDataId: undefined,
        customerLabelTypeId: undefined,
        labelTypeName: undefined,
        labelDataName: undefined,
        registerTime: undefined,
        remark: undefined
      }
      this.customerLabelTypeChildData = []
    },
    // 获取顾客标签
    customerLabelType(deptId) {
      this.$api.modules.custLabel.customerLabelType({
        'deptId': deptId
      }).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data
        }
      })
    },
    // 临客标签表格列表
    CustomerLabel() {
      const id = this.id
      this.$api.dept.CustomerLabel('get', { id: id }).then((res) => {
        if (res) {
          this.data = res.rows
        }
      })
    },
    // 转化意向度的方法
    Degree(str) {
      const obj = this.dict.type.degree_intention_list.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    // 添加跟进记录 列表
    async followuprecord() {
      this.tableData = []
      // 这是接口地址，
      await this.$api.modules.bookProject.followuprecord({ id: this.$route.query.id }).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      })
    },
    // 跟进时间
    add() {
      this.submitLoading = true
      if (this.flag) {
        this.flag = false
        this.flag = true
        if (this.customInfo.remark === '') {
          this.$message({
            message: '请输入内容!!!',
            type: 'warning'
          })
          return
        } else {
          // 这是接口地址，
          this.$api.modules.bookProject.addrecord({
            id: this.$route.query.id,
            remark: this.customInfo.remark
          }
          ).then(async res => {
            if (res) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.submitLoading = false
              this.followuprecord()
              this.customInfo.remark = ''
            }
          })
        }
      }
    },
    // 删除按钮
    async deletes(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.bookProject.delet(row.followId).then(async res => {
          if (res) {
            this.$message.success('删除成功')
            await this.followuprecord()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
//::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//  width: 6px; // 横向滚动条
//  height: 10px; // 纵向滚动条 必写
//}
::v-deep .el-textarea__inner {
  font-weight: bolder !important;
  color: #555555 !important;
}
// 滚动条的滑块
.customerInfo-container {
  width: 100%;
  box-sizing: border-box;

  .customerInfo-head {
    font-size: 14px;

    span {
      margin: 0 6px;

      &:nth-child(1) {
        font-weight: 700;
        font-size: 16px;
        font-family: "Verdana", "Tahoma", "Lucida Grande", "Microsoft YaHei",
        "Hiragino Sans GB", sans-serif;
      }
    }
  }

  .customerInfo-content {
    padding: 10px;
    box-sizing: border-box;
  }
}

.basicInformation-container {
  width: 100%;
  height: 100%;
  display: flex;

  .Concerns {
    width: 28%;
    // margin-right: 5px;
    margin: 0 10px;
    display: inline-flex;
    background-color: #ebfaff;

    .concerns-one {
      flex-direction: row;
    }

    .Concerns-title {
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      font-weight: bold;
      padding: 7px;
      margin-left: 7px;
    }

    .treatment {
      line-height: 34px;
      font-size: 12px;
      font-weight: 750;
      padding: 0 8px;
      border-top: 1px solid #cad3d6;
      background-color: #fffffc;
      margin: 0 10px;
    }
  }

  .el-link.el-link--primary {
    padding-left: 5px;
  }

  .el-textarea {
    width: 100%;
  }

  .el-card .is-always-shadow {
    height: 350px;
  }

  .el-card__body {
    padding: 35px;
  }

  .concerns-two {
    width: 100%;
  }

  .el-textarea {
    padding: 0 9px;
  }

  .el-link--inner {
    float: right;
  }
}

.el-collapse {
  width: 40%;
}

.el-card {
  margin-bottom: 10px;
}

.title {
  font-size: 14px;
  font-weight: bold;
  color: #555555;

  i {
    margin-right: 4px;
  }
}

.el-icon-circle-close {
  padding-left: 20px;
}

.container-basic {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-between;

  & > div {
    width: 32%;

    & > .title {
      font-size: 18px;
      font-weight: bold;
      color: #555555;
      margin-bottom: 14px;

      & > i {
        margin-right: 4px;
      }
    }

    &:last-child .basic-item-box {
      border-right: none;
    }
  }

  .basic-item-box li {
    margin: 10px 0;
    font-size: 13px;
  }
}

.follow-up {
  & > div {
    width: 48%;
  }
}

.short-message .basic-item-box {
  height: auto;
  border-right: none;
}

.basic-item-box {
  list-style: none;
  font-size: 12px;
  color: #333;
  border-right: 1px solid #cccccc;

  li {
    margin: 4px 0;
  }
}

.returnVisit {
  padding-right: 20px;
  box-sizing: border-box;
}

::v-deep .el-dialog__header {
  background-color: bisque;
}
</style>
