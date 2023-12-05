<template>
  <div>
    <template v-for="(item,index) in options">
      <template v-if="values.includes(item.value)">
        <span :key="index">{{ item.label }}</span>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ShowDictData',
  props: {
    options: {
      type: Array,
      default: null
    },
    value: [Number, String, Array]
  },
  computed: {
    values() {
      if (this.value !== null && typeof this.value !== 'undefined') {
        return Array.isArray(this.value) ? this.value : [String(this.value)]
      } else {
        return []
      }
    }
  }
}
</script>
