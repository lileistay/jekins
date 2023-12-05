<template>
  <div class="waterfall">
    <card-list-menu v-for="(data,index) in data" :key="index" class="waterfall-item" :department-list="departmentList" :title="data.meta.title" :valr="data.meta" :data="data.children" />
  </div>
</template>

<script>
import CardListMenu from '@/components/CardListMenu/index'
export default {
  name: 'Waterfall',
  components: {
    CardListMenu
  },
  props: {
    data: {
      type: Array
    },
    departmentList: {
      type: Array,
      default: () => []
    }
  }
}

</script>

<style scoped lang="scss">
.waterfall{
  width: 100%;
  height: 100%;
  column-count: 3;
  column-gap: 0;
  box-sizing: border-box;
  padding: 10px;

  .waterfall-item {
    width: 100%;
    break-inside: avoid;
  }
}
</style>
