<template>
  <!--住院记账-->
  <div class="box">
    <div class="box-title">
      <div>
        <el-form size="mini" label-width="100px">
          <el-row>
            <el-col>
              <el-form-item label="选择日期：" style="margin-bottom: 0">
                <el-date-picker
                  style="width: 70%;"
                  type="date"
                  placeholder="选择日期"
                />
                <el-button size="mini" style="margin-left: 10px">搜索</el-button>
              </el-form-item>
            </el-col>
            
          </el-row>
        </el-form>
      </div>
      <div>
        <el-button size="mini">搜索</el-button>
      </div>
    </div>
    <div />
  </div>
</template>

<script>
export default {
  name: 'InpatientBookkeeping'
}
</script>

<style scoped lang="scss">
.box {
  padding: 10px;
  .box-title {
    padding: 0 10px;
    //width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #587fa1;
  }
}
</style>
