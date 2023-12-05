<template>
  <div>
    <div class="nurse_top" style="position: relative;">
      <div style="position: absolute;right:20px;top:3px">
        <el-button type="primary" plain size="mini" @click="Newproofread" style="height: 25px;line-height: 10px;">校对</el-button>
        <el-button type="primary" plain  size="mini" @click="backproofread" style="height: 25px;line-height: 10px;">回退</el-button>
        <!-- <el-button type="primary" size="mini" @click="skin">皮试</el-button> -->
        <!-- <span @click="Newproofread">校对</span>
      <span @click="backproofread">回退</span>
      <span @click="skin">皮试</span> -->
      </div>

    </div>
    <div class="nurse_contain" style="margin-top: 4px;">
      <div class="nurse_left">
        <div class="nurse_search">
          <label for="" style="margin-left: 7px;">检索：</label>
          <el-input placeholder="请输入姓名" size="mini" style="width: 160px" v-model="Name"></el-input>
          <el-button style="width:75px;height: 30px;margin-left: 10px;" icon="el-icon-search" type="primary" plain size="mini" @click="search">搜索</el-button>
        </div>
        <div style="margin-left: 7px;">患者列表</div>
        <div class="patient_list">
          <div style="width: 300px;">
            <el-table :data="tableData" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @row-click="selechColum" :height="heightprro" highlight-current-row ref="tablelist">
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
            <div class="topContain" style="width: 500px;"> 备注：<span>{{ customerNameList.remark }}</span></div>
            <!-- <div class="topContain"> 押金警示：<span></span></div> -->


            <!-- 科室：<span>暂无</span>&emsp;&emsp;统治医生：<span>暂无</span>&emsp;&emsp;护士：<span>{{
                            customerNameList.nursingPersonnel
                        }}</span>&emsp;&emsp;入院时间：<span>{{ customerNameList.createTime
}}</span>&emsp;&emsp;备注：<span>{{
    customerNameList.remark }}</span>&emsp;&emsp;押金警示：<span>暂无</span> -->

          </div>
          <!-- <div>住院天数：<span>李磊</span></div> -->
        </div>
        <div>
          <span style="margin-left:10px">校对人：</span>
          <el-select filterable v-model="Names" placeholder="请选择" size="mini">
            <el-option v-for=" (item, index) in newoptions" :key="index" :label="item.nickName" :value="item.userId">
            </el-option>
          </el-select>
          <!-- <el-input placeholder="请输入校对人" size="mini" style="width: 180px" v-model="Names"></el-input> -->
          &nbsp;&nbsp;<span>期效：</span>
          <el-select filterable v-model="proofreads" placeholder="请选择" size="mini">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button style="width:75px;height: 30px;margin-left:15px;height:30px;margin-top:5px" icon="el-icon-search" type="primary" plain size="mini" @click="searchList()">搜索</el-button>
        </div>
        <div class="patient_list_right" style="margin-top: 10px;">
          <div style="width: 100%">
            <el-table :data="tableDatas" ref="table" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @selection-change="handleSelectionChange"
              :row-key="handle" @row-click='selechColums' @select-all="selList" :height="newheight" >
              <!-- <el-table-column prop="createBy" label="床号" width="100" align="center">
            </el-table-column> -->
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column prop="customerName" label="姓名" width="100" align="center">
                <template slot-scope="scope">
                                            <div>
                                                <a @click="customerclick(scope.row.id, scope.row)">{{ scope.row.customerName }}</a>
                                            </div>
                                        </template>
              </el-table-column>
              <el-table-column prop="periodicType" label="期效" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.row.periodicType=='0'||scope.row.periodicType=='3'?'长期':'临时' }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="开始时间" width="180" align="center">
              </el-table-column>
              <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
              </el-table-column>
              <el-table-column prop="materialSpec" label="规格" width="150" align="center">
              </el-table-column>
              <el-table-column prop="amount" label="总量" width="100" align="center">
              </el-table-column>
              <!-- <el-table-column prop="doseUnit" label="单位" width="100"
                                        align="center"></el-table-column> -->
              <el-table-column prop="dosage" label="剂量" width="100" align="center">
              </el-table-column>
              <el-table-column prop="doseUnit" label="单位" width="100" align="center">
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
              <el-table-column prop="pairNum" label="用药单位" width="100" align="center">

                <template slot-scope="scope">
                                            <div>
                                                {{ methodsUnit(scope.row.unit) }}
                                            </div>
                                        </template>
              </el-table-column>
              <!-- <el-table-column prop="decoction" label="煎法" width="100" align="center">
              </el-table-column> -->
              <el-table-column prop="dropVelocity" label="滴速" width="100" align="center">
              </el-table-column>
              <!-- <el-table-column prop="dropVelocity" label="医生嘱托" width="100" align="center">
              </el-table-column>
              <el-table-column prop="executeDepartment" label="执行科室" width="100" align="center">
              </el-table-column> -->
              <el-table-column prop="skinFlag" label="皮试" width="100" align="center">
              </el-table-column>
              <el-table-column prop="unitPrice" label="单价" width="100" align="center">
              </el-table-column>
              <el-table-column prop="totalPrice" label="金额" width="100" align="center">
              </el-table-column>
              <el-table-column prop="expenseType" label="费用种类" width="100" align="center">
              </el-table-column>
              <el-table-column prop="doctorName" label="处方医生" width="100" align="center">
              </el-table-column>
              <el-table-column prop="endTime" label="结束时间" width="180" align="center">
              </el-table-column>
              <!-- <el-table-column prop="name" label="姓名" width="100" align="center">
            </el-table-column>
            <el-table-column prop="address" label="病区" width="100" align="center"> </el-table-column>
            <el-table-column prop="address" label="病人" width="100" align="center"> </el-table-column>
            <el-table-column prop="date" label="床号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" align="center">
            </el-table-column>
            <el-table-column prop="address" label="病区" width="100" align="center"> </el-table-column>
            <el-table-column prop="address" label="病人" width="100" align="center"> </el-table-column>
            <el-table-column prop="date" label="床号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" align="center">
            </el-table-column>
            <el-table-column prop="address" label="病区" width="100" align="center"> </el-table-column>
            <el-table-column prop="address" label="病人" width="100" align="center"> </el-table-column>
            <el-table-column prop="date" label="床号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" align="center">
            </el-table-column>
            <el-table-column prop="address" label="病区" width="100" align="center"> </el-table-column>
            <el-table-column prop="address" label="病人" width="100" align="center"> </el-table-column>
            <el-table-column prop="date" label="床号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" align="center">
            </el-table-column>
            <el-table-column prop="address" label="病区" width="100" align="center"> </el-table-column>
            <el-table-column prop="address" label="病人" width="100" align="center"> </el-table-column>
            <el-table-column prop="date" label="床号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" align="center">
            </el-table-column>
            <el-table-column prop="address" label="病区" width="100" align="center"> </el-table-column>
            <el-table-column prop="address" label="病人" width="100" align="center"> </el-table-column>
            <el-table-column prop="date" label="床号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" align="center">
            </el-table-column> -->

            </el-table>
          </div>
        </div>


        <!-- //bottom -->
      </div>
    </div>

    <el-dialog title="皮试结果" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" height="500px">
      <div style="height:500px">
        <div><span>病人信息:</span><br><br>

          <div>
            <span>卡号：</span> <span>姓名：{{ customerNameList.customerName }}</span> <span>性别：</span>
            <div><span>年龄：{{ customerNameList.customAge }}</span> <span>科室：</span> <span>医生:</span></div>
          </div>
        </div>
        <div>
          <br>
          <span>皮试信息：</span><br><br>
          <div><span>药品名称：</span><span>药品规格：</span></div>
          <div>皮试结果： <el-radio v-model="radio_tree" label="0">阴性</el-radio>
            <el-radio v-model="radio_tree" label="1">阳性</el-radio>
            <span>皮试批号：</span> <el-input size="mini" style="width: 150px;" placeholder="请输入皮试批号"
              v-model="skinNumber"></el-input>
            <div><span>皮试说明：{{ radio_tree == 0 ? '阴性' : '阳性' }}</span></div>
            <div><span>开始时间：</span> <el-date-picker v-model="startTime" type="date" placeholder="选择日期" size="mini"
                style="width: 150px;">
              </el-date-picker><span style="margin-left:20px">结束时间：</span> <el-date-picker v-model="endTime" type="date"
                placeholder="选择日期" size="mini" style="width: 150px;">
              </el-date-picker></div>
          </div>
          <br><br>
          <div> <span>历史记录：</span>
            <div style="width: 100%;height:200px;border:1px solid black;overflow: scroll;">
              <div style="width: 840px;">
                <el-table :data="skinList" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                  :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                  @selection-change="handleSelectionChange">
                  <!-- <el-table-column prop="createBy" label="床号" width="100" align="center">
            </el-table-column> -->
                  <!-- <el-table-column type="selection" width="55" align="center">
              </el-table-column> -->
                  <el-table-column prop="createTime" label="日期" width="180" align="center">
                  </el-table-column>
                  <el-table-column prop="itemBatchNum" label="药品批号" width="100" align="center">
                  </el-table-column>
                  <el-table-column prop="skinState" label="结果" width="100" align="center">
                  </el-table-column>
                  <el-table-column prop="remark" label="说明" width="100" align="center">
                  </el-table-column>
                  <el-table-column prop="startTime" label="开始时间" width="180" align="center">
                  </el-table-column>
                  <el-table-column prop="updateTime" label="结束时间" width="180" align="center">
                  </el-table-column>
                </el-table>
              </div>

            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'proofread',
  data() {
    return {
      proofread: '',
      newheight:20,
      proofreads: '',
      startTime: "",
      endTime: "",
      skinNumber: '',
      skinList: [],
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '长期'
      }, {
        value: '1',
        label: '临时'
      }],
      value: '1',
      tableData: [],
      tableDatas: [],
      Name: "",
      nurseId: '',
      customerNameList: '',
      Names: "",
      newoptions: [],
      editBatch: [],
      dialogVisible: false,
      radio_tree: '0',
      deptId: "",
      inHospitalId: "",
      NameId:"",
      methoList:[],
      heightprro:"",


    }
  },
  created() {
    
    this.deptId = this.$store.getters.departmentId;
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
            this.newheight=h-270
            this.heightprro=h-208;
  },
  mounted() {
   
    this.search();
    let data = {
      status: 0,
      deptId:this.deptId
    }
    this.$api.confinementRoom.getUserList(data).then(res => {
      let arr=[];
      res.data.forEach(value=>{
         if(arr.length==0){
          arr.push(value)
         }else{
          let flag=false;
          arr.forEach(newvalue=>{
             if(newvalue.userId==value.userId){
                flag=true
             }
          })
          if(!flag){
            arr.push(value)
          }
         }
      })

      this.newoptions=arr
      let name=localStorage.getItem('userId');
      this.newoptions.forEach(value=>{
         if(value.userId==name){
          this.Names=value.nickName
          this.NameId=value.userId
         }
      })
     
    })
  },
  methods: {
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
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
    selList(sel){
    this.editBatch=sel;
    },
    selechColums(row) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row)
    },
    selechColum(row, column, event) {
      let ids = {
        id: row.id
      }
      this.inHospitalId = row.inHospitalId
      this.$api.confinementRoom.nurseRightTop(ids).then(res => {
        this.customerNameList = res.data;
        const datas = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.user.getUserList(datas).then(res => {
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
        let data = {
          periodicType: this.proofreads,
          executingState: '1',
          deptId: this.deptId,
          inHospitalId: this.inHospitalId
        }
        this.$api.confinementRoom.MedicalAdvice(data).then(res => {
          let Data = [];
          res.rows.forEach(value => {
            value.forEach(values => {
              Data.push(values)
            })
          })
          this.tableDatas = Data;
          this.$refs.table.setCurrentRow(Data[0],true)
        });
      });
    },
    handle(row) {
      switch (row.periodicType) {
        case 0:
          return row.periodicType = '长期'
          break;
        case 1:
          return row.periodicType = '临时'
          break;
        case 2:
          return row.periodicType = '校对'
          break;
        case 3:
          return row.periodicType = '已抄送'
          break;
        //0:长期; 1:临时; 2:出院带药
      }
    },
    newDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      var s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
    },

    ok() {
  
      let data = {
        "id": this.editBatch[0].id,
        "useId": this.editBatch[0].medicalAdviceId,
        "skinState": this.radio_tree,
        "itemBatchNum": this.skinNumber,
        "startTime": this.newDate(this.startTime),
        "endTime": this.newDate(this.endTime),
      }
      this.dialogVisible = false;
      this.$api.confinementRoom.hospitalSkinTest(data).then(res => {
        if (res.code !== 200) {
          this.$message.error('保存失败')
        } else {
          this.$message.success('保存成功');
          this.searchList()
        }
      })
    },
    handleClose() {
      this.dialogVisible = false;
    },
    skin() {
      if (this.editBatch.length == 0) {
        this.$message.warning('请选择一条数据');
        return
      }
      this.dialogVisible = true;
      let data = {
        id: this.nurseId
      }
      this.$api.confinementRoom.skinList(data).then(res => {
        this.skinList = res.rows
      })
    },
    handleSelectionChange(row) {
      console.log(row,'dsad')
      this.editBatch = row;
    },
    Newproofread() {
      if (this.editBatch.length == 0) {
        this.$message.warning('选择校对数据');
        return
      }
      // proofreaderId
      if(this.Names==''){
        this.$message.warning('选择校对人');
        return
      }
      // console.log(this.editBatch, '黄赌毒')
      // return;
      if(typeof this.Names=='number'){

      }else{
          this.Names=this.NameId
      }
      this.editBatch.forEach(value => {
        value.executingState = '2',
        value.proofreaderId=this.Names
      })
      this.$api.confinementRoom.editBatchState(this.editBatch).then(res => {
        if (res.code == 200) {
          this.newround();
          this.$message.success('校对成功')
        }
      })
    },
    backproofread() {
      if (this.editBatch.length == 0) {
        this.$message.warning('选择回退数据');
        return
      }
      this.editBatch.forEach(value => {
        value.executingState = '0'
      })
      this.$api.confinementRoom.editBatchState(this.editBatch).then(res => {
        if (res.code == 200) {
          this.$message.success('回退成功');
          this.newround();
        }
      })
    },
    searchList() {
      let that = this;
      let data = {
        // proofreaderId: this.Names,
        periodicType: this.proofreads,
        executingState: '1',
        deptId: this.deptId,
        inHospitalId:this.inHospitalId
      }
      this.$api.confinementRoom.MedicalAdvice(data).then(res => {
        let Data = [];
        res.rows.forEach(value => {
          value.forEach(values => {
            Data.push(values)
          })
        })
        that.tableDatas = Data;
      });
    },
    newround() {
      let that = this;
      let executingState = {
        executingState: '1',
        deptId: this.deptId,
        inHospitalId: this.inHospitalId,
        inpatientStatus: '1',
      }
      this.$api.confinementRoom.MedicalAdvice(executingState).then(res => {
        if (res.rows.length == 0) {
          that.tableDatas = [];
          return
        }
        let Data = [];
        res.rows.forEach(value => {
          value.forEach(values => {
            Data.push(values)
          })
        })
        that.tableDatas = Data;
      });

    },
    search() {
      let that = this;
      let data = {
        customerName: this.Name,
        pageNum: 1,
        pageSize: 20,
        inpatientStatus: '1',
        deptId:this.deptId
      };
      this.$api.confinementRoom.nurseLeft(data).then(res => {
        that.tableData = res.rows;
        this.$refs.tablelist.setCurrentRow(res.rows[0],true)
        if (res.rows.length == 0) {
          return
        }
        that.nurseId = res.rows[0].id;
        that.inHospitalId = res.rows[0].inHospitalId
        let ids = {
          id: that.nurseId
        };
        let executingState = {
          executingState: '1',
          deptId: this.deptId,
          inHospitalId: this.inHospitalId,

        }
        this.$api.confinementRoom.nurseRightTop(ids).then(res => {
          that.customerNameList = res.data;
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
                          if(item.userId==that.customerNameList.nursingPersonnel){
                            that.customerNameList.nursingPersonnel=item.nickName
                          }
                        
                        }
                    }) // 责任护士
                }
            })
        });
        this.$api.confinementRoom.MedicalAdvice(executingState).then(res => {
          if (res.rows.length == 0) {
            that.tableDatas=[]
            return
          }
          let Data = [];
          res.rows.forEach(value => {
            value.forEach(values => {
              Data.push(values)
            })
          })

          that.tableDatas = Data;
        });

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
* {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  font-size: 14px;
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

.patient_list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
  border-radius: 10px;
  background: transparent;
}
.patient_list_right_bottom {
  width: 1100px;
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

.nurse_top span {
  margin-right: 10px;
  cursor: pointer;
}

.topContain {
  width: 150px;
  height: 20px;
  margin-left: 10px;
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>