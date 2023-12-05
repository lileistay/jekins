<template>
  <!--费用结算-->
  <div class="box">
    <div class="left" style="overflow:scroll">
      <span>分组统计:</span>&nbsp;&nbsp;
      <el-select filterable v-model="groupType" placeholder="请选择" size="mini" @change="groupTypesChange">
        <el-option v-for="item in groupTypes" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div >
        <el-tree :data="costs_tree" @current-change="handleClicks">

           </el-tree>
      </div>
 
    </div>
    <div class="right">
      <div style="width: 1260px;">
        <el-table :data="fyList" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :row-key="handle" :show-summary="true" :summary-method="getSummaries" height="570px">
          <el-table-column type="index" width="50" >
          </el-table-column>
          <el-table-column prop="pricingTime" label="扣费日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="expenseType" label="费用种类" width="100" align="center">
          </el-table-column>
          <el-table-column prop="itemName" label="项目名称" width="210" align="center">
          </el-table-column>
          <el-table-column prop="materialSpec" label="规格" width="120" align="center">
          </el-table-column>
          <el-table-column prop="doseUnit" label="单位" width="100" align="center">
          </el-table-column>
          <el-table-column prop="amount" label="数量" width="100" align="center">
          </el-table-column>
          <el-table-column prop="unitPrice" label="单价" width="100" align="center">
          </el-table-column>
          <el-table-column prop="amountReceivable" label="应收金额" width="100" align="center">
          </el-table-column>
          <el-table-column prop="amountReceived" label="实收金额" width="100" align="center">
          </el-table-column>
          <!-- <el-table-column prop="discountAmount" label="优惠金额" width="100" align="center">
          </el-table-column> -->
          <el-table-column prop="operatorName" label="操作员" width="100" align="center">
          </el-table-column>
          <!-- <el-table-column prop="doctorName" label="医嘱医生" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="feeSource" label="来源" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="medicalUser" label="医嘱对象" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="medicalSource" label="医嘱来源" width="100" align="center">
                                        </el-table-column> -->
          <!-- <el-table-column prop="dropVelocity" label="医保编码" width="100" align="center">
                                        </el-table-column> -->
          <!-- <el-table-column prop="unitPrice" label="医保比例" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="totalPrice" label="医保类型" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="doctorName" label="农保编码" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="medicalAdviceType" label="农保种类" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="medicalAdviceType" label="农保比例" width="100" align="center">
                                        </el-table-column> -->


        </el-table>
      </div>
    </div>
    <!-- <div class="box-top">
      <div class="title">收费单信息 [ BL202205280219 ]</div>
      <el-form size="mini" label-width="100px" style="margin-top: 10px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="创建时间:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="美学顾问:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="医生:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="病房号:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="下单人:">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注:">
          <el-input type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div class="box-footer">
      <div class="title">收费单明细信息</div>
      <el-table
        :data="tableData"
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="产品名称"
        />
        <el-table-column
          prop="name"
          label="价格1"
        />
        <el-table-column
          prop="address"
          label="价格2"
        />
        <el-table-column
          prop="address"
          label="价格"
        />
        <el-table-column
          prop="address"
          label="数量"
        />
        <el-table-column
          prop="address"
          label="合计金额"
        />
        <el-table-column
          prop="address"
          label="折扣"
        />
        <el-table-column
          prop="address"
          label="折后金额"
        />
        <el-table-column
          prop="address"
          label="执行时间"
        />
      </el-table>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'XpenseSettlement',
  data() {
    return {
      // tableData: [],
      costs_tree: [],
      fyList: [],
      groupTypes: [
        {
          value: '0',
          label: '费用种类'
        }, {
          value: '1',
          label: '日期费用'
        }, {
          value: '2',
          label: '费用日期'
        },
      ],
      groupType: "0",

    }
  },
  props: ['czHis'],
  watch: {
    'czHis': {
      deep: true,
      handler: function (newV) {
        this.nurse();
        // let data=[];
        // newV.list.forEach(value=>{
        //    value.forEach(values=>{
        //     data.push(values)
        //    })
        // })
        // this.listGroup=data;
      }
    },
    // deptId(val){
    //         this.deptId=val
    //         // this.search();
    //     }

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

    // this.deptId = localStorage.getItem('deptId');
    this.deptId = this.$store.getters.departmentId
  },
  methods: {
    getSummaries(params) {
            let sums = [];
            const { columns, data } = params;
            columns.forEach(value => {
                sums.push('')
            })
            this.amountsums = 0;
            this.amountsumssh = 0;
            this.amountsuys = 0;
            if (data.length == 0) {

            } else {
                data.forEach(value => {
                    this.amountsums += Number(value.amount);
                    this.amountsumssh += value.amountReceived
                    this.amountsuys += value.amountReceivable
                })
                sums[6] = this.amountsums;
                sums[9] = this.amountsumssh;
                sums[8] = this.amountsuys;
            }
            sums[0]='合计'
            return sums;
        },
    handle() {

    },
    groupTypesChange(value) {
      let that = this;
      let data = {
        inHospitalId: localStorage.getItem('inHospitalId'),
        groupType: value,
        deptId: this.deptId
      }
      this.$api.confinementRoom.expenseTypeGroup(data).then(res => {
        that.costs_tree = res.rows;
        let data = {};
        if (value == '0') {
          data = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            // expenseType: that.costs_tree[0].label.split(' ')[0],
            // itemName: that.costs_tree[0].children[0].label.split(' ')[0],
            deptId: this.deptId
          }
          this.expenseType = that.costs_tree[0].label.split(' ')[0];
          this.itemName = that.costs_tree[0].children[0].label.split(' ')[0]
        } else if (value == '1') {
          data = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            // expenseType: that.costs_tree[0].children[0].label.split(' ')[0],
            // pricingTime: that.costs_tree[0].label.split(' ')[0],
            deptId: this.deptId
          }
          this.expenseType = that.costs_tree[0].children[0].label.split(' ')[0];
          this.pricingTime = that.costs_tree[0].label.split(' ')[0]
        } else {
          data = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            // expenseType: that.costs_tree[0].label.split(' ')[0],
            // pricingTime: that.costs_tree[0].children[0].label.split(' ')[0],
            deptId: this.deptId
          }
          this.expenseType = that.costs_tree[0].label.split(' ')[0]
          this.pricingTime = that.costs_tree[0].children[0].label.split(' ')[0];
        }

        this.$api.confinementRoom.hospitalExpenseRecord(data).then(res => {
          this.fyList = res.rows;
        });



      })
    },
    handleClicks(data, node, b) {
      let datas = {};
      if (this.groupType == '0') {
        if (node.childNodes.length == 0) {
          datas = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            expenseType: node.parent.data.label.split(' ')[0],
            itemName: data.label.split(' ')[0],
            deptId: this.deptId
          }
        } else {
          datas = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            expenseType: data.label.split(' ')[0],
            itemName: '',
            deptId: this.deptId
          }
        }

        if (this.radio_tree == '1') {
          this.$api.confinementRoom.expenseSummaryList(datas).then(res => {
            this.fyListAll = res.rows;

          });
        } else {
          this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
            this.fyList = res.rows;

          });
        }
      }
      else if (this.groupType == '1') {
        if (node.childNodes.length == 0) {
          datas = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            expenseType: data.label.split(' ')[0],
            pricingTime: node.parent.data.label.split(' ')[0],
            deptId: this.deptId
          }
        } else {
          datas = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            expenseType: node.childNodes[0].label.split(' ')[0],
            pricingTime: data.label.split(' ')[0],
            deptId: this.deptId
          }
        }
        if (this.radio_tree == '1') {
          this.$api.confinementRoom.expenseSummaryList(datas).then(res => {
            this.fyListAll = res.rows;

          });
        } else {
          this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
            this.fyList = res.rows;

          });
        }


      } else {
        if (node.childNodes.length == 0) {
          datas = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            expenseType: node.parent.data.label.split(' ')[0],
            pricingTime: data.label.split(' ')[0],
            deptId: this.deptId
          }
        } else {
          datas = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            expenseType: data.label.split(' ')[0],
            pricingTime: node.childNodes[0].data.label.split(' ')[0],
            deptId: this.deptId
          }
        }
        this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
          this.fyList = res.rows;

        });
      }

    },
    nurse() {
      let that = this;
      let data = {
        inHospitalId: localStorage.getItem('inHospitalId'),
        groupType: this.groupType,
        deptId: localStorage.getItem('deptId')
      }
      this.$api.confinementRoom.expenseTypeGroup(data).then(res => {
        let result = JSON.parse(JSON.stringify(res.rows));
        that.costs_tree = result;
        if (that.costs_tree.length == 0) {
          that.fyList = []
        } else {
          this.expenseType = that.costs_tree[0].label.split(' ')[0];
          this.itemName = that.costs_tree[0].children[0].label.split(' ')[0];
          let datas = {
            inHospitalId: localStorage.getItem('inHospitalId'),
            deptId: localStorage.getItem('deptId')
          }
          this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
            that.fyList = res.rows;
            // that.hospitalCopyRecords=res.rows;

          });
        }




      });
    }
  },
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  position: fixed;
  height: 62%;
  // border: 1px solid black;
  display: flex;
}

.right {
  width: 1113px;
  height: 580px;
  // border: 1px solid black;
  overflow: scroll;
  overflow-y: hidden;

}

.right::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 7px;
}

.right::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
  background: #dcdcdc;
}

.right::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
  border-radius: 10px;
  background: transparent;
}


// .box {
//   display: flex;
//   flex-direction: column;
//   padding: 10px;
//   .box-top {
//     padding: 10px;
//     height: 100px;
//     border: 1px solid #c3ced5;
//     border-radius: 5px;
//     position: relative;
//     margin-bottom: 15px;
//   }
//   .title {
//     position: absolute;
//     margin-top: -22px;
//     margin-left: 10px;
//     background-color: #e0f0fb;
//   }
//   .box-footer {
//     padding: 10px;
//     height: 100px;
//     border: 1px solid #c3ced5;
//     border-radius: 5px;
//     position: relative;
//   }
// }
</style>
