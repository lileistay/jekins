<template>
  <div>
    <!-- <div class="nurse_top">
      <span @click="proofread">执行</span>
    </div> -->
    <div class="nurse_top" style="position: relative;">
      <div style="position: absolute;right:50px;top:3px">
        <el-button type="primary" plain size="mini" @click="proofread" style="height: 25px;line-height: 10px;">执行</el-button>
      </div>
    </div>

    <div class="nurse_contain" style="margin-top: 4px;">
      <div class="nurse_left">
        <div class="nurse_search">
          <label for="" style="margin-left: 7px;">检索：</label>
          <el-input placeholder="请输入姓名" size="mini" style="width: 160px" v-model="Name"></el-input>
          <el-button style="width:75px;height: 30px;margin-left: 10px;" icon="el-icon-search" type="primary" plain size="mini" @click="search">搜索</el-button>
        </div>
        <div class="patient_list">
          <div style="width: 300px;">
            <el-table :data="Nurse_left" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @row-click='selechColum' highlight-current-row ref="tablelist" :height="heightdete">
              <el-table-column prop="bedNumber" label="床号" width="100" align="center">
              </el-table-column>
              <el-table-column prop="customerName" label="姓名" width="100" align="center">
              </el-table-column>
              <el-table-column prop="wardNo" label="病区" width="100" align="center"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- //右边模块 -->
      <div class="nurse_right">
        <div class="nurse_right_top" style="background-color: antiquewhite;">
          <div style="height: 10px;"></div>
          <div style="display: flex;">
            <div class="topContain"> 姓名：{{ customerNameList.customerName }}</div>
            <div class="topContain"> 性别(年龄)：{{ customerNameList.customAge }}</div>
            <div class="topContain"> 可用押金：<span>{{ customerNameList.residualDeposit }}</span></div>
            <div class="topContain"> 病区床位：<span>{{ customerNameList.bedNumber }}</span></div>
            <!-- 姓名：<span>{{ customerNameList.customerName }}</span>&emsp;&emsp;性别(年龄)：<span>{{
                            customerNameList.customAge }}</span>&emsp;&emsp;
                            病人性质：<span>李磊</span>
                            可用押金：<span>{{ customerNameList.residualDeposit
                            }}</span>&emsp;&emsp;
                            住院号：<span>李磊</span>&emsp;&emsp;
                            病区床位：<span>{{ customerNameList.wardNo }}</span> -->
          </div>
          <div style="height: 10px;"></div>
          <div style="display: flex;">
            <div class="topContain"> 科室：<span>{{ customerNameList.departmentName }}</span></div>
                            <div class="topContain"> 主治医生：<span>{{ customerNameList.doctorName }}</span></div>
            <div class="topContain"> 护士：<span>{{ customerNameList.nursingPersonnel }}</span></div>
            <div class="topContain" style="width: 220px;">入院时间：<span>{{ customerNameList.hospitalTime }}</span></div>
            <div class="topContain"> 备注：<span>{{ customerNameList.remark }}</span></div>
            <!-- <div class="topContain"> 押金警示：<span></span></div> -->


            <!-- 科室：<span>暂无</span>&emsp;&emsp;统治医生：<span>暂无</span>&emsp;&emsp;护士：<span>{{
                            customerNameList.nursingPersonnel
                        }}</span>&emsp;&emsp;入院时间：<span>{{ customerNameList.createTime
}}</span>&emsp;&emsp;备注：<span>{{
    customerNameList.remark }}</span>&emsp;&emsp;押金警示：<span>暂无</span> -->

          </div>
          <!-- <span>扣费人：</span>
    <el-select v-model="detection" placeholder="请选择">
    <el-optionselList
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select> -->

        </div>
        <div style="margin-top:5px"></div>
        <span style="margin-top: 10px;margin-left:10px">扣费标准：</span>
        <el-select filterable v-model="copyType" placeholder="请选择" size="mini" @change="stateChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div class="patient_list_right" style="margin-top: 12px;">
          <div style="width:100%">
            <el-table :data="tableData" stripe ref="table" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @select="selCopy" @select-all="selList"
              @selection-change="handleSelectionChange" @row-click='selechColums' border :height="newheight">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column prop="periodicType" label="期效" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.row.periodicType=='0'||scope.row.periodicType=='3'?'长期':'临时' }}
                </template>
              </el-table-column>
              
              <el-table-column prop="feeFlag" label="扣费状态" width="100" align="center">
                <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.feeFlag == '1' ? '已扣费' : "未扣费" }}
                                            </div>
                                        </template>
              </el-table-column>
              <el-table-column prop="bedNumber" label="床号" width="100" align="center">
              </el-table-column>
              <el-table-column prop="customerName" label="姓名" width="100" align="center">
                <template slot-scope="scope">
                                            <div>
                                                <a @click="customerclick(scope.row.id, scope.row)">{{ scope.row.customerName }}</a>
                                            </div>
                                        </template>
              </el-table-column>
              <el-table-column prop="useCustomer" label="医嘱对象" width="100" align="center">
                <template slot-scope="scope">
                                    {{ scope.row.useCustomer == '0' ? '本人' : '子女' }}
                                </template>
              </el-table-column>
              <el-table-column prop="lastCopyTime" label="抄送时间" width="180" align="center">
              </el-table-column>
              <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
              </el-table-column>
              <el-table-column prop="materialSpec" label="规格" width="100" align="center">
              </el-table-column>
              <el-table-column prop="amount" label="总量" width="100" align="center">
              </el-table-column>
              <el-table-column prop="dosage" label="剂量" width="100" align="center">
              </el-table-column>
              <el-table-column prop="frequency" label="频次" width="100" align="center">
              </el-table-column>
              <el-table-column prop="usageWay" label="用法" width="100" align="center">
                <template slot-scope="scope">
                                            <div>
                                              {{ scope.row.usageWay=='1'?'口服-外用':scope.row.usageWay=='2'?'水煎内服':scope.row.usageWay=='3'?'皮试':"" }}
                                            </div>
                                        </template>
              </el-table-column>
              <el-table-column prop="unit" label="用药单位" width="100" align="center">
                <template slot-scope="scope">
                                            <div>
                                                {{ methodsUnit(scope.row.unit) }}
                                            </div>
                                        </template>
              </el-table-column>
              <el-table-column prop="skinFlag" label="皮试" width="100" align="center">
              </el-table-column>
              <el-table-column prop="dropVelocity" label="滴速" width="100" align="center">
              </el-table-column>
              <!-- <el-table-column prop="dropVelocity" label="医生嘱托" width="100" align="center">
              </el-table-column>
              <el-table-column prop="executeDepartment" label="执行科室" width="100" align="center">
              </el-table-column> -->
              <el-table-column prop="doctorName" label="处方医生" width="100" align="center">
              </el-table-column>
              <el-table-column prop="unitPrice" label="单价" width="100" align="center">
              </el-table-column>
              <el-table-column prop="totalPrice" label="金额" width="100" align="center">
              </el-table-column>
              <el-table-column prop="amountReceived" label="实收金额" width="100" align="center">
              </el-table-column>
              <!-- <el-table-column prop="discountAmount" label="优惠金额" width="100" align="center">
              </el-table-column>
              <el-table-column prop="discountAmount" label="费用种类" width="100" align="center">
              </el-table-column> -->
              <!-- <el-table-column prop="periodicType" label="费用种类" width="100" align="center">
              </el-table-column> -->
            </el-table>
          </div>
        </div>


        <!-- //bottom -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'proofread',
  data() {
    return {
      newheight:"",
      options: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '今日抄送'
      },],

      value: '',
      Name: "",
      copyType: "0",
      Nurse_left: [],
      nurseId: "",
      inHospitalId: "",
      copyState: "",
      tableData: [],
      customerNameList: '',
      Rows: [],
      methoList:[],
      heightdete:"",
    }
  },
  watch:{
    deptId(val){
      this.deptId=val 
      this.search();
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
    created(){
      const data = {
        status: '0',
        deptId: this.deptId
      }
        this.$api.product.productList(data).then(res => {
        if (res) {  
            this.methoList=res.rows
             

            }})
            let h= window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
            this.newheight=h-270;
            this.heightdete=h-208
    },
  mounted() {
    this.search();
    this.deptId = this.$store.getters.departmentId
  },
  methods: {
    methodsUnit(val){
           let strName=''
          this.methoList.forEach(value=>{
                if(val==value.productUnitId){
                    strName=value.productUnitName
                }
             })
                 return strName
    

        },
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, }})
    },
    selechColums(row) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row)
    },
    handleSelectionChange(row) {
      this.Rows = row;
    },
    selList(row) {
      this.Rows = row;
    },
    selechColum(row, column, event) {
      this.inHospitalId = row.inHospitalId;
      let ids = {
        id: row.id
      };
      this.$api.confinementRoom.nurseRightTop(ids).then(res => {
        this.customerNameList = res.data;
        let data = { copyType: this.copyType, inHospitalId: this.inHospitalId, deptId: this.deptId, }
        this.$api.confinementRoom.listPricingExecute(data).then(res => {
          let Data = [];
          res.rows.forEach(value => {
            value.forEach(values => {
              Data.push(values)
            })
          });
          const data = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.user.getUserList(data).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    res.data.forEach(item => {
                        // this.zerennurse.push(item)
                        if (item.postCode == 'zerennurse') {
                          if(item.userId==this.customerNameList.nursingPersonnel){
                            this.customerNameList.nursingPersonnel=item.nickName
                          }
                        
                        }
                    }) // 责任护士
                }
            })
          this.tableData = Data;
        })
      });
    },
    selCopy(select, row) {
      this.Rows.push(row)
    },
    stateChange(value) {
      let data = { copyType: value, inHospitalId: this.inHospitalId, deptId: this.deptId }
      this.$api.confinementRoom.listPricingExecute(data).then(res => {
        let Data = [];
        res.rows.forEach(value => {
          value.forEach(values => {
            Data.push(values)
          })
        });
        this.tableData = Data;
      })
    },
    proofread() {
      if (this.Rows.length == 0) {
        this.$message.warning('请至少选择一条执行数据');
        return
      }
      let data = this.Rows;
      data.forEach(value => {
        value.executingState = '5';
      })
      this.$api.confinementRoom.editBatchStates(data).then(res => {
        if (res.code == 200) {
          this.newexport();
          this.$message.success('执行成功');
        }
      })
    },
    newexport() {
      let data = { copyType: this.copyType, inHospitalId: this.inHospitalId, deptId: this.deptId, }
      this.$api.confinementRoom.listPricingExecute(data).then(res => {

        let Data = [];
        res.rows.forEach(value => {
          value.forEach(values => {
            Data.push(values)
          })
        });
        this.tableData = Data;
      })
    },
    search() {
      let data = {
        customerName: this.Name,
        pageNum: 1,
        pageSize: 20,
        inpatientStatus:'1',
        deptId:this.deptId
      }
      this.$api.confinementRoom.nurseLeft(data).then(res => {
        this.Nurse_left = res.rows;
        
        if (res.rows.length == 0) {
          return
        }else{
          this.$refs.tablelist.setCurrentRow(res.rows[0],true)
        }
        this.inHospitalId = res.rows[0].inHospitalId;
        this.copyState = res.rows[0].copyState;
        this.nurseId = res.rows[0].id;
        let ids = {
          id: this.nurseId
        };
        this.$api.confinementRoom.nurseRightTop(ids).then(res => {
          this.customerNameList = res.data;
          const data = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.user.getUserList(data).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    res.data.forEach(item => {
                        // this.zerennurse.push(item)
                        if (item.postCode == 'zerennurse') {
                          if(item.userId==this.customerNameList.nursingPersonnel){
                            this.customerNameList.nursingPersonnel=item.nickName
                          }
                        
                        }
                    }) // 责任护士
                }
            })
        });
        let data = { copyType: this.copyType, inHospitalId: this.inHospitalId, deptId: this.deptId, }
        this.$api.confinementRoom.listPricingExecute(data).then(res => {

          let Data = [];
          res.rows.forEach(value => {
            value.forEach(values => {
              Data.push(values)
            })
          });
          this.tableData = Data;
        })

      })
    }
  },
}
</script>
<style scoped lang="scss">
::v-deep .patient_list .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

::v-deep .patient_list_right .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}
* {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  font-size: 14px;
}
.patient_list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
  border-radius: 10px;
  background: transparent;
}
.patient_list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 7px;
}
.patient_list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
  background: #dcdcdc;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 8px;
    z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 20px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px #999; */
    background: transparent;
    /* border-radius: 2px; */
}
.patient_list_right_bottom {

  height: 250px;
  // border: 1px solid red;
  overflow: scroll;
  // background-color: red;
}

.patient_list_right {
  width: calc(100% - 280px);
}

.el-select {
  width: 200px !important;

  .el-input__inner {
    height: 30px !important;
  }
}

.nurse_right_center span {
  margin-right: 10px;
  cursor: pointer;
}

.nurse_right_top {
  height: 60px;
  // border: 1px solid black;
}

.nurse_right {
  width: calc(100% - 40px);
  height: calc(100% - 0px);
  // border: 1px solid palevioletred;
  // background-color: #999999;
}

.patient_list {
  width: 100%;
  height: calc(100% - 10px);
  position: relative;
  overflow: scroll;
  margin-top: 10px;
  overflow-x: hidden;

}

.nurse_left {
  width: 300px;
  height: 100%;
  // border: 1px solid red;
}

.nurse_contain {
  position: fixed;
  width: 100%;
  height: calc(100% - 170px);
  // border: 1px solid black;
  display: flex;
}

.nurse_top {
  height: 30px;
  // border: 1px solid red;
  line-height: 30px;
}

.topContain {
  width: 150px;
  height: 20px;
  margin-left: 10px;
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.nurse_top span {
  margin-right: 10px;
  cursor: pointer;
}</style>