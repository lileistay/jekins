<template>
  <!-- 批量发送短信  -->
  <div>
  <sg-dialog
    title="批量发送短信"
    title-icon="el-icon-menu"
    :dialog="showSendMessageDialog"
    @handleClose="closeDialog('closeDialog')"
  >
    <div slot="out">
      <el-form
        size="mini"
        label-width="120px"
      >
        <el-row>
          <el-col>
            <el-form-item label="短信客户数">
              <el-input readonly />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="关键字">
              <el-input placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划发送时间">
              <el-date-picker
                v-model="value"
                class="full-width"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板分类">
              <el-select
                v-model="value"
                class="full-width"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in 10"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板">
              <el-select
                v-model="value"
                class="full-width"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in 10"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="短信发送类型">
              <el-select
                v-model="value"
                class="full-width"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in 10"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板内容">
              <el-input
                type="textarea"
                :rows="3"
                resize="none"
                placeholder="请输入关键字"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="closeDialog">保存</el-button>
              <el-button type="danger" @click="colse">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </sg-dialog>
</div>
</template>

<script>
import SgDialog from '@/components/Dialog'
import { throttle } from '@/utils/throttleAndDebounce' // 节流
export default {
  name: 'SendMessage',
  components: { SgDialog },
  props: {
    showSendMessageDialog: {
      type: Boolean,
      default: false
    },
    selectionData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    closeDialog: throttle(function() {
      this.$emit('closeDialog')
    }),
    colse() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped lang="scss">
.full-width {
  width: 100%;
}
</style>
