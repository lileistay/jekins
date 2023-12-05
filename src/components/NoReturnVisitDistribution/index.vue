<template>
  <el-dialog
    title="提示"
    :visible="dialogVisible"
    width="30%"
    @close="btnCanel"
  >
    <el-form
      size="mini"
      label-width="120px"
    >
      <el-form-item label="已选择回访数量">
        <el-input
          v-model="selectionData.length"
          disabled
          style="width:85%"
        />
      </el-form-item>
      <el-form-item label="变更备注">
        <el-input
          v-model="form.returnChangeRemarks"
          type="textarea"
          style="width:85%"
        />
      </el-form-item>
      <el-form-item label="计划回访人">
        <el-select
          v-model="form.planReturnUser"
          style="width: 85%"
          clearable
        >
          <el-option
            v-for="item in sysUserList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer">
      <el-button
        size="mini"
        @click="btnCanel"
      >取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="add"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {

  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    selectionData: {
      type: Array,
      default: () => []
    },
    noReturnVisit: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sysUserList: [],
      form: {}
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
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
  },
  methods: {
    add() {
      if (this.noReturnVisit === '0') {
        let numberIds = ''
        this.selectionData.forEach(item => {
          numberIds += item.numberId + ','
        })
        numberIds = numberIds.substr(0, numberIds.length - 1)
        const id = this.form.planReturnUser
        this.$api.netPower.noReturnVisit({
          id: id,
          numberIds: numberIds
        }).then(res => {
          if (res) {
            this.$emit('update:dialogVisible', false)
            this.$message.success('分配成功！')
          }
        })
      } else {
        let numberIds = ''
        this.selectionData.forEach(item => {
          numberIds += item.numberId + ','
        })
        numberIds = numberIds.substr(0, numberIds.length - 1)
        const id = this.form.planReturnUser
        this.$api.netPower.noReassignment({
          id: id,
          numberIds: numberIds
        }).then(res => {
          if (res) {
            this.$emit('update:dialogVisible', false)
            this.$message.success('分配成功！')
          }
        })
      }
      this.form = {} // 清空表单
      this.$emit('getList')
    },
    btnCanel() {
      // this.selectionData = []
      this.form = {}
      this.$emit('update:dialogVisible', false)
    },
    // 获取用户列表
    getUserList(deptId) {
      // 人员添加公司Id  添加状态
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
           // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    }
  }
}
</script>

<style>
</style>
