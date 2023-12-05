<template>
  <el-dialog
    title="新增"
    :visible="showDialog"
    @close="ddd"
  >
    <el-form
      label-width="120px"
      size="small "
    >
      <el-form-item label="自定义代码类型">
        <el-input style="width:50%" />
      </el-form-item>
      <el-form-item label="自定义类型名称">
        <el-input style="width:50%" />
      </el-form-item>
      <el-form-item label="自定义类型描述">
        <el-input style="width:50%" />
      </el-form-item>
      <el-form-item label="是否显示">
        <el-select style="width:50%">
          <el-option label="是" value="是" />
          <el-option label="否" value="否">否</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    ddd() {
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
</style>
