<template>
  <div>
    <div>
      <el-form ref="form" style="display: none" :model="form" label-width="100px" size="mini">
        <el-form-item label="分院信息：">
          <el-select filterable v-model="form.deptId" placeholder="请选择">
            <el-option label="兰州时光激光整形美容医院" value="0" />
            <el-option label="西宁时光" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="taber" v-for="(item, index) in infant" :key="index">
        <div class="titem"><i class="el-icon-edit-outline" /> {{ item.name }}治疗记录</div>
        <div v-if="item.values.length > 0">
          <sg-table ref="table" size="mini" border highlight-current-row :table-data="item.values" :columns="columns"
            max-height="240">
            <div slot="searchBar"></div>
            <template #custom="data">
              <div v-if="data.props === 'treatmentStatus'">
                <show-dict-data :options="dict.type.treatment_status" :value="data.custom.treatmentStatus" />
              </div>
            </template>
          </sg-table>
        </div>
        <p class="item" v-else>暂无{{ item.name }}治疗信息</p>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import SgTable from '@/components/Table'
import vm from '@/utils/util'
export default {
  props: ['ids'],
  dicts: ['sys_user_sex', 'treatment_type', 'treatment_status'],
  components: {
    SgTable
  },
  data() {
    return {
      //皮肤中心
      skintable: [],
      //整形中心
      newtable: [],
      //无创治疗记录
      noninvasive: [],
      //口腔治疗记录
      mouth: [],
      //产康中心治疗记录
      Chankang: [],
      //私密中心治疗记录
      privacy: [],
      //微创治疗记录
      minimally: [],
      //放射科治疗记录
      radiate: [],
      //检验科治疗记录
      clinical: [],
      //母婴中心治疗记录
      infant: [],
      form: {
        deptId: ''
      },
      table: [],
      columns: [
        {
          lab: '客户',
          val: 'customerName',
          width: 80
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '项目',
          val: 'projectName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '回访类型',
          val: 'typeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '治疗状态',
          val: 'treatmentStatus',
          custom: 'treatmentStatus',
          width: 70
        },
        {
          lab: '计划治疗次数',
          val: 'estimateScribingNum',
          width: 95
        },
        {
          lab: '当次治疗次数',
          val: 'thisScribingNum',
          width: 95
        },
        {
          lab: '产康师/洗浴师',
          val: 'doctorName',
          width: 100
        },
        {
          lab: '现场咨询',
          val: 'acName',
          width: 90
        },
        {
          lab: '责任月嫂',
          val: 'nursingName',
          width: 90
        },
        {
          lab: '责任护士',
          val: 'circulatingName',
          width: 90
        },
        {
          lab: '实际执行人',
          val: 'executorName',
          width: 100
        },
        {
          lab: '分诊人',
          val: 'tpName',
          width: 100
        },
        {
          lab: '分诊时间',
          val: 'triagePersonTime',
          width: 165
        },
        {
          lab: '分诊备注',
          val: 'remark',
          width: 151,
          showOverflowTooltip: true
        },
        {
          lab: '治疗时间',
          val: 'treatStartTime',
          width: 165
        }
      ],
      deptOptions: undefined
    }
  },
  watch: {
    // 根据名称筛选公司树
    deptId(val) {
      this.deptId = val
    },
    deptName(val) {
      this.$refs.tree.filter(val)
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
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getTreeselect();
  },
  methods: {
    Comethehospital(id) {
      this.infant=[];
      this.$api.dept.DepartmentList({ deptId: this.deptId }, 'get').then((res) => {
        res.rows.forEach(value => {
          if (value.isDepartment == '0') { }
          else {
            let object = { name: value.departmentName, values: [], departmentId: value.departmentId };
            this.infant.push(object)
          }
        })
        this.$api.medical.selectTreatment({ deptId: this.deptId, id: id }).then(res => {
          res.rows.forEach(value => {
            this.infant.forEach(newvalue => {
              if (value.departmentId == newvalue.departmentId) {
                newvalue.values.push(value)
              }
            })
          })
        })
      })

    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 退出
    remode() {
      // this.$router.go(-1);
      vm.$emit('closeTag', this.$route.path)
      // this.closeTag()
      // this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
.back {
  width: 99%;
  height: 67px;
  border: 1px solid #c7c7c7;
  margin-bottom: 8px;

  .titem {
    height: 30px;
    font-size: 14px;
    font-weight: 700;
    line-height: 30px;
    padding-left: 20px;
    background-color: #ebfaff;
    border-bottom: 1px solid #c7c7c7;
  }

  .item {
    font-size: 12px;
    padding-left: 20px;
    line-height: 30px;
  }
}

.taber {
  width: 99%;
  height: 100%;
  border: 1px solid #c7c7c7;
  margin-bottom: 10px;

  .titem {
    font-size: 15px;
    font-weight: 700;
    line-height: 40px;
    padding-left: 20px;
    background-color: #ebfaff;
    border-bottom: 1px solid #c7c7c7;
  }

  .item {
    font-size: 12px;
    padding-left: 20px;
    line-height: 30px;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30px;
  //background-color: #fff;
  z-index: 1000;

  .content {
    position: fixed;
    right: 20px;
  }
}
</style>
