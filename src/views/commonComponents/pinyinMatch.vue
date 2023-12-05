<template>
  <div>测试模糊搜索
    <el-select filterable :filter-method="handleFilter">
      <el-option v-for="item in orderDetails" :key="item.id" :label="item.codeName" :value="item.id" />
    </el-select>
  </div>
</template>

<script>
import PinyinMatch from 'pinyin-match'
export default {
  data() {
    return {
      orderDetails: [
        {
          id: 1,
          codeName: '兰州'
        }
      ],
      copyOrderDetails: null

    }
  },
  created() {
    // 复制
    this.copyOrderDetails = Object.assign(this.orderDetails)
  },
  methods: {
    handleFilter(val) {
      // 对绑定数据赋值
      if (val) {
        this.orderDetails = this.copyOrderDetails.filter((item) => {
          // 如果直接包含输入值直接返回true
          if (item.codeName) {
            if (item.codeName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
              return true
            }
            // 输入值拼音d
            return PinyinMatch.match(item.codeName, val)
          }
        })
      } else {
        this.orderDetails = this.copyOrderDetails
      }
    }
  }
}
</script>

<style>

</style>
