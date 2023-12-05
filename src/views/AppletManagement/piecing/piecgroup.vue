<template>
  <div>
    <slideSearch :options="options" @getSearchpeople="getSearchpeople" @clickNative="clickNative">
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getData(true)"
          @keydown.enter.native="getData(true)">查询
        </el-button>

      </div>
      <slot>
        <sg-table ref="table" size="mini" :row-key="getRow" :sg-ref="'multipleTable'" :expand-row-keys="expands"
          :highlight-current-row="true" :table-data="tableData" :columns="columns" :show-header="false"
          :pagination="pagination" :header-style="{ backgroundColor: '#f5eae4' }" :default-expand-all="isExpandAll"
          highlight-current-row @selection-change="handleSelectionChange" @size-change="sizeChange"
          @current-change="change" @expand-change="expandChange">
          <div slot="searchBar" class="searchBar">
            <div>统计信息 </div>

          </div>
          <div slot="header" style="width: 100%">
            <div style="font-size: 14px">
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
            </div>

          </div>
          <template #custom="data">
            <div v-if="data.props === 'projectName'" class="name">
              项目名称：{{ data.custom.projectName }}
            </div>
            <div v-if="data.props === 'orderSn'" class="name">
              {{ activityType == '1' ? "开团单号" : "秒杀单号" }} ：{{ data.custom.orderSn }}
            </div>
            <div v-if="data.props === 'createTime'" class="name">
              {{ activityType == '1' ? "开团时间" : "秒杀时间" }} ：{{ data.custom.createTime }}
            </div>
            <div v-if="data.props === 'customerName' && activityType == '1'" class="name">
              团长：{{ data.custom.customerName }}
            </div>
            <div v-if="data.props === 'payStatus' && activityType == '1'" class="name">
              是否成团：<span v-if="data.custom.payStatus == 3">是</span>
              <span v-else>否</span>
            </div>
          </template>
          <template #expands="data">
            <div style="font-size: 13px;">
              <div class="child">
                <span>购买时间</span>
                <span>项目名称</span>
                <span>项目规格</span>
                <span>购买人</span>
                <span>购买电话</span>
                <span>推荐人</span>
                <span>归属人</span>
                <span>原价</span>
                <span>{{ activityType == '1' ? "拼团价" : "秒杀价" }}</span>
                <span>状态</span>
                <span>操作</span>
              </div>
              <div class="child" v-for="(item, index) in data.expands.pintuanActivityOrdersVos" :key="index"
                style="display: flex;align-items: center;">
                <span>{{ item.createTime }}</span>
                <span>{{ item.projectName }}</span>
                <span>{{ item.specs }}</span>
                <span>{{ item.customerName }}</span>
                <span>{{ item.customPhone }}</span>
                <span>{{ item.createBy }}</span>
                <span>{{ item.belongingName }}</span>
                <span>{{ item.originalPrice }}</span>
                <span>{{ item.amountPayable }}</span>
                <span v-if="activityType == '1'"><show-dict-data :options="dict.type.pinggroup_status"
                    :value="item.payStatus" /></span>
                <span v-if="activityType == '2'">{{ getstatus(item.payStatus) }}</span>
                <span style="display: flex;">
                  <span v-if="item.payStatus == '3'" style="color: #5f94de;cursor: pointer;"
                    @click="shopback(item)">核销</span>
                  <span v-if="item.payStatus == '3'" style="color: #67c23a;cursor: pointer;"
                    @click="shopsend(item)">发货</span>
                </span>
              </div>
              <div class="child1" v-if="activityType=='1'">
                <span>拼团人数：{{ data.expands.totalpeople }}</span>
                <span>已完成人数：{{ data.expands.peopleNumber }}</span>
                <span>待完成人数：{{ data.expands.remainingPeopleNumber }}</span>
                <span>合计成交金额：{{ data.expands.totalmoney }}</span>
              </div>
            </div>

          </template>
        </sg-table>
      </slot>

    </slideSearch>
    <sgDialog :title="shoptitle" size="350px" out-top="2%" :dialog="showproject" @handleClose="closeRoomDialogtooth">
      <div slot="out">
        <div class="backhome">
          <span v-if="showprojectFlag"><span style="color: red;">*</span> 核销码</span>
          <span v-else><span style="color: red;">*</span>快递单号</span>
          <el-input style="width: 200px;margin-left: 20px;" size="mini" v-model="listgroup"></el-input>
        </div>
        <div class=""
          style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="ok">确定</el-button>
            <el-button @click="showproject = false" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { todayTime } from "../../../utils/time";
import slideSearch from '@/components/SlideSearchBar/index'
import sgDialog from '@/components/Dialog/index'
import moment from "moment/moment";
export default {
  dicts: ['pinggroup_status', 'refund_state'],
  name: "piecgroup",
  components: {
    SgTable,
    slideSearch,
    sgDialog
  },
  data() {
    return {
      expands: [], // 存放展开行的ID
      showproject: false,
      activityType: "1",
      shoptitle: '',
      showprojectFlag: false,
      paoIdlist: "",
      listgroup: "",
      columns: [
        {
          lab: 'a',
          val: 'print',
          expands: {}
        },
        {
          lab: '项目名称',
          val: 'projectName',
          custom: 'projectName',

        },
        {
          lab: '开团单号',
          val: 'orderSn',
          custom: 'orderSn'
        },
        {
          lab: '开团时间',
          val: 'createTime',
          custom: 'createTime'
        },
        {
          lab: '团长',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '是否成团',
          val: 'payStatus',
          custom: 'payStatus'
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      form: {},
      isExpandAll: true,
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '开团时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        activityType: {
          type: 'select',
          clearable: true,
          options: [
            {
              value: "1",
              label: "拼团"
            },
            {
              value: "2",
              label: "秒杀"
            },
          ],
          label: '订单类型:',
          values: '1'
        },
        orderSn: {
          type: 'input',
          label: '开团单号:'
        },
        productId: {
          type: 'select',
          clearable: true,
          options: [],
          label: '项目名称:'
        },
        createBy: {
          type: 'selectsearch',
          label: '推荐人',
          clearable: true,
          options: []
        },
        belongingName: {
          type: 'selectsearch',
          clearable: true,
          options: [],
          label: '归属人'
        },
        refundState: {
          type: 'select',
          clearable: true,
          options: [],
          label: '退款状态:'
        },
        payStatus: {
          type: 'select',
          clearable: true,
          options: [],
          label: '拼团状态:'
        }
      },
      deptList: [],
      xFlagname: '',
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
      this.getData()
    }
  },
  created() {
    this.getData()
    this.getproject()
    console.log(this.dict.type.refund_state)
    this.options.refundState.options = this.dict.type.refund_state
    this.options.payStatus.options = this.dict.type.pinggroup_status
  },
  methods: {
    getstatus(item) {
      if (item == 1) {
        return '待付款'
      }
      if (item == 2) {
        return '拼团中'

      }
      if (item == 3) {
        return '秒杀成功'

      }
      if (item == 5) {
        return '已退款'
      }
      if (item == 6) {
        return '待退款'
      }
      if (item == 8) {
        return '已完成'
      }
    },
    ok() {
      if (this.listgroup == '' || this.listgroup == null) {
        if (!this.showprojectFlag) {
          this.$message.warning('请输入快递单号')
        } else {
          this.$message.warning('请输入核销码')
        }

        return
      }
      this.$api.confinementRoom.updateProductsOrShipments({
        chooseType: !this.showprojectFlag ? 2 : 1,
        expressNumber: String(this.listgroup),
        paoId: Number(this.paoIdlist)
      }).then(res => {
        if (res.code == 200) {
          if (this.showprojectFlag) {
            this.$message.success('核销成功');

          } else {
            this.$message.success('发货成功')
          }
          this.showproject = false;
          this.getData()
        }
      })
    },
    shopsend(item) {
      this.showproject = true;
      this.showprojectFlag = false;
      this.shoptitle = '发货信息';
      this.paoIdlist = item.paoId;
      this.listgroup = ''
    },
    shopback(item) {
      this.showproject = true;
      this.showprojectFlag = true;
      this.shoptitle = '核销信息';
      this.paoIdlist = item.paoId;
      this.listgroup = ''
    },
    closeRoomDialogtooth() {
      this.showproject = false;
    },
    getproject() {
      const query = {
        deptId: this.deptId
      }
      this.$api.modules.groupGoods.groupGoodsInfoList(query).then(res => {
        if (res.code == 200) {
          res.rows.forEach(item => {
            item.label = item.projectName
            item.value = item.productId
          })
          let arr = this.unique(res.rows)
          this.options.productId.options = arr
        }
      })
    },
    // 去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.productId) && res.set(arr.productId, 1))
    },
    // 区分下拉
    clickNative(item) {
      this.xFlagname = item.label
    },
    //远程搜索
    getSearchpeople(query) {
      // 当input里面的值大于两个的时候触法搜索
      if (query.length > 2) {
        this.loading = true
        //  一秒后再搜索
        setTimeout(() => {
          this.loading = false
          this.$api.modules.netPower.selectRecommend({ namephonecard: query }).then(res => {
            if (res) {
              console.log(res.data, 'res.data')
              // this.sharepeole = res.data
              res.data.forEach(item => {
                item.label = item.refereeName + item.refereePhone
                item.value = item.id
              })
              if (this.xFlagname == '推荐人') {
                this.options.createBy.options = res.data
              } else if (this.xFlagname == '归属人') {
                this.options.belongingName.options = res.data
              }
            }
          })
        }, 1000)
      }
    },
    getData(isSearch) {
      var data = {}
      this.submitLoadings = true
      this.tableData = [];
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      const query = {
        params: {
          beginTime: data.createTime,
          endTime: data.endcreateTime,
        },
        deptId: this.deptId,
        orderSn: data.orderSn,
        productId: data.productId,
        belongingId: data.belongingName,
        referenceId: data.createBy,
        refundState: data.refundState,
        payStatus: data.payStatus,
        activityType: data.activityType
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.activityType = data.activityType
      this.$api.modules.groupGoods.activityOrdersList({ ...this.pagination, ...query }).then(res => {
        if (res) {
          if (res.rows.length > 0) {
            res.rows.forEach(item => {
              item.totalpeople = Number(item.peopleNumber) + Number(item.remainingPeopleNumber)
              let money = 0
              item.pintuanActivityOrdersVos.forEach((val, index) => {
                if (val.payStatus == 2 || val.payStatus == 3) {
                  money += Number(item.pintuanActivityOrdersVos[index].amountPayable)
                }
              })
              item.totalmoney = money
            })
          }
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 返回列表的唯一值
    getRow(row) {
      return row.paoId
    },
    expandChange(row) {
      this.isExpandAll = !this.isExpandAll
    },
    // 分页组件
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
  }
}
</script>

<style scoped lang="scss">
.backhome {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
}

.child {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #EBEEF5;

  span {
    display: block;
    width: 150px;
    text-align: left;
    margin: 5px 0px;
    font-size: 12px;

    //border-right: 1px solid #cccccc;
  }
}

.name {
  color: red;
  font-size: 13px;
}

::v-deep .el-table__row td {
  background: #fff2de !important;
}

.child1 {
  text-align: right;
  margin: 10px 0px;
  margin-right: 20px;

  span {
    margin-right: 10px;
    color: red;
    font-size: 13px;

  }
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  height: 100px !important;
  color: #999;
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 70px !important;
}
</style>