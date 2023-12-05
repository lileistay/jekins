<template>
  <el-tree
    ref="tree"
    class="el-tree"
    :data="options"
    :props="defaultProps"
    highlight-current
    :node-key="id"
    :check-on-click-node="false"
    :expand-on-click-node="false"
    @node-click="handleNodeClick"
  />
</template>

<script>
export default {
  name: 'SgTree',
  components: {},
  props: {
    options: {
      type: Object
    },
    defaultProps: {
      type: Object
    },
    id: {
      type: String || Number
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$emit('update', data)
    }
  }
}
</script>

<style scoped>
.el-tree {
  padding: 0 15px;
}
</style>
