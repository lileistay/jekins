<template>
  <div class="container-basic follow-up">
    <div>
      <div class="title"><i class="el-icon-s-promotion" />近期回访计划</div>
      <ul class="basic-item-box returnVisit">
        <el-timeline>
          <el-timeline>
            <!-- :timestamp="activity.actualReturnvisitTime" -->
            <el-timeline-item
              v-for="(activity, index) in list"
              v-show="activity.isExecute==0"
              :key="index"
              :type="activity.returnExecutorUserName"
            >
              <el-card v-if="activity.isExecute=='0'">
                计划时间:{{ activity.planReturnTime }}
                <div style="boreder:1px solid red" class="bos">
                  <table border="1" cellspacing="0" class="boders">
                    <tr>
                      <td> 计划回访人: {{ activity.planReturnUserName }} | 是否一次性回访:{{ disposable(activity.isOneReturnVisit) }}</td>
                      <td width="20%" rowspan="2" align="center">
                        <el-button type="text" @click="merge(activity.numberId)">合并</el-button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        回访目的：{{ activity.returnVisit }}
                      </td>
                    </tr>
                  </table>
                </div>
              </el-card>
              <!-- 计划回访人:  {{activity.returnExecutorUserName}} | 是否一次性回访:{{activity.isOneReturnVisit==0?'多次':'一次性'}} -->
            </el-timeline-item>
          </el-timeline>
        </el-timeline>
      </ul>
    </div>
    <div>
      <div class="title"><i class="el-icon-s-order" />历次回访记录</div>
      <ul class="basic-item-box">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in list"
            v-show="activity.isExecute==1"
            :key="index"
            :type="activity.returnExecutorUserName"
          >
            <el-card v-if="activity.isExecute=='1'">
              {{ activity.actualReturnvisitTime }}
              <div
                style="boreder:1px solid red"
                class="bos"
              >
                <table
                  border="1"
                  cellspacing="0"
                  class="boders"
                >
                  <!-- 原因：{{activity.isThrough=='0'?activity.notThroughReason:activity.throughLevel}} -->
                  <tr>
                    <td> 拨打结果: {{ activity.isThrough==1?'打通':'未打通' }} |

                      原因：{{ activity.isThrough=='1'?gtefter(activity.throughLevel):notThroughReason(activity.notThroughReason) }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      回访目的：{{ activity.returnVisit }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      回访执行人：{{ activity.returnExecutorUserName }} | 计划回访人：{{ activity.planReturnUserName }} | 一次性回访：{{ disposable(activity.isOneReturnVisit) }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      回访反馈:{{ activity.returnVisitFeedback }}
                    </td>
                  </tr>
                </table>
              </div>
            </el-card>
            <!-- 计划回访人:  {{activity.returnExecutorUserName}} | 是否一次性回访:{{activity.isOneReturnVisit==0?'多次':'一次性'}} -->
          </el-timeline-item>
        </el-timeline>
        <!-- </el-timeline-item> -->
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ReturnRecord',
  inject: ['reload'],
  dicts: ['through_level', 'not_through_reason', 'whether'],

  props: {
    huifang: {
      type: Array,
      default: []
    },
    noHospital: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: {},
      options: {
        throughLevel: [], // 打通等级
        notThroughReason: []// 未打通原因
      }

    }
  },
  watch: {
    huifang(newValue) {
      this.list = newValue;
    },
  },
  created() {
    this.options.throughLevel = this.dict.type.through_level
    this.options.notThroughReason = this.dict.type.not_through_reason
  },
  methods: {
    merge(numberId) {
      if (this.noHospital === '0') {
        // 未到院
        this.$api.netPower.returnVisitRecordMerge({
          numberId: numberId
        }).then(res => {
          if (res) {
            this.$forceUpdate()
            this.$message.success('合并成功')
            this.$emit('changeList')
            // this.$router.go(0)
            // this.reload()
          }
        })
      } else {
        // 已到院
        this.$api.netPower.returnVisitHospitalMerge({
          numberId: numberId
        }).then(res => {
          if (res) {
            this.$forceUpdate()
            this.$message.success('合并成功')
            this.$emit('changeList')
            // this.$router.go(0)
            // this.reload()
          }
        })

      }
    },
    gtefter(str) {
      const obj = this.options.throughLevel.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    notThroughReason(str) {
      const obj = this.options.notThroughReason.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    // 是否一次性到院
    disposable(str) {
      const obj = this.dict.type.whether.find(item => item.value == str)

      return obj ? obj.label : ''
    }
  }
}
</script>

<style scoped lang="scss">
.container-basic {
  width: 98%;
  display: flex;
  justify-content: space-between;

  & > div {
    width: 32%;

    & > .title {
      font-size: 14px;
      font-weight: bold;
      color: #555555;
      margin-bottom: 10px;

      & > i {
        margin-right: 4px;
      }
    }

    &:last-child .basic-item-box {
      border-right: none;
    }
  }
}
.follow-up {
  & > div {
    width: 48%;
  }
}
.basic-item-box {
  list-style: none;
  font-size: 12px;
  color: #333;
  border-right: 1px solid #cccccc;
  margin-top: 10px;
  .bos {
    .boders {
      width: 100%;
      border: 1px solid #dcdfe6;
      tr td {
        border: 1px solid #dcdfe6;
      }
    }
  }

  li {
    margin: 4px 0;
  }
}
.returnVisit {
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
