<template>
  <!--护理记录-->
  <div class="box">
    <div class="box-title">
      <div>
        <el-form size="mini" label-width="100px">
          <el-row>
            <el-col>
              <el-form-item label="选择日期：" style="margin-bottom: 0">
                <el-date-picker style="width: 70%;" type="date" placeholder="选择日期" v-model="value1" />
                <el-button size="mini" style="margin-left: 10px" @click="search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-button size="mini" @click="add">添加</el-button>
      </div>
    </div>
    <div class="box-footer">
      <div style="width: 1320px;height: 480px;" class="box-footer_children">
        <div style="width: 1770px;">
          <el-table :data="Nurse_left" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @row-click='selechColum'>
            <el-table-column prop="createTime" label="时间" width="170" align="center">
              <!-- <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.createTime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </template> -->
            </el-table-column>
            <el-table-column prop="tc" label="T(℃)" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.tc" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="p" label="P/HR (次/分)" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.p" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="r" label="R (次/分)" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.r" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="bpL" label="BP (mmHg)" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.bpL" disabled></el-input>
              </template> </el-table-column>
            <!-- <el-table-column prop="wardNo" label="SPO2H (%)" width="100" align="center"> </el-table-column> -->
            <el-table-column prop="ys" label="意识" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.ys" disabled></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="rnr" label="入_内容" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.rnr" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="rl" label="入_量(ml)" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.rl" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="cnr" label="出_内容" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.cnr" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="cl" label="出_量(ml)" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.cl" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="qktt" label="切口疼痛" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.qktt" disabled></el-input>
              </template> </el-table-column>
            <el-table-column prop="qkfl" label="腹痛" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.qkfl" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="lzng" label="留置尿管" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.lzng" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="lzztb" label="留置镇痛泵" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.lzztb" disabled></el-input>
              </template> </el-table-column>
            <el-table-column prop="ydfmw" label="阴道分泌物" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.ydfmw" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="kqylg" label="口腔引流管" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.kqylg" disabled></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="wardNo" label="其他情况记录" width="100" align="center"> </el-table-column> -->
            <el-table-column prop="createUserId" label="记录人" width="100" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.createUserId" disabled></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="wardNo" label="操作" width="100" align="center">
                    <template slot-scope="scope">
                         <el-button type="text" @click="newdelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column> -->
          </el-table>
        </div>



      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NursingRecords',
  data() {
    return {
      tableData: [],
      value1: "",
      Nurse_left: [],
      Advice: [],
    }
  },
  props:['czHis'],
  watch: {
    $route() {
      this.search();
    },
    'czHis': {
      deep:true,
      handler(val){
        this.search();
      }

    }
  },
  created() {
    this.search();
    this.value1 = '';
  },
  methods: {
    timenow() {
      var d = new Date(), str = '';
      str += d.getFullYear() + '-';
      str += d.getMonth() + 1 + '-';
      str += d.getDate();
      return str;
    },
    selechColum() {

    },
    newDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    add() {
      this.$router.push({ path: 'nurseList' })
    },
    
    search() {
      let data = ''
      let val= JSON.parse(localStorage.getItem('val'));
      if (this.value1 == '' || this.value1 == null) {
        data = {
          createTime: '',
          inHospitalId:val.inHospitalId

        }
      } else {
        data = {
          createTime: this.newDate(this.value1) + ' ' + '00:00:00',
          inHospitalId:val.inHospitalId
        }
      }

      this.$api.confinementRoom.singRecords(data).then(resol => {
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
            this.Advice = res.data;
            this.Nurse_left = resol.rows;
            this.Nurse_left.forEach(value => {
              this.Advice.forEach(values => {
                if (value.createUserId == values.value) {
                  value.createUserId = values.label
                }
              })
            })

          }
        })


      })

    }
  },
}
</script>

<style scoped lang="scss">
* {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  font-size: 14px;
}

.box-footer_children::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 7px;
}

.box-footer_children::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
  background: #dcdcdc;
}

.box-footer_children::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
  border-radius: 10px;
  background: transparent;
}

.box-footer_children {
  overflow: scroll;
  overflow-y: hidden;
}

.box {
  padding: 10px;

  .box-title {
    padding: 0 10px;
    //width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1abc9c;
  }

  .box-footer {
    padding: 10px;
    height: 512px;
    border: 1px solid #c3ced5;
    overflow: hidden;
  }
}
</style>
