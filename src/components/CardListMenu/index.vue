<template>
  <div class="card-list-menu">
    <div class="content">
      <div class="card-list-menu-title">
        {{ title }}
      </div>
      <div class="card-list-menu-content">
        <ul>
     
          <li v-for="(data, index) in data" :key="index" @click="stepPath(data)">
            {{ data.meta.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import id from 'element-ui/src/locale/lang/id'

export default {
  name: 'CardListMenu',
  props: {
    data: {
      type: Array,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    departmentList: {
      type: Array,
      default: () => []
    },
    valr: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      ids: 0
    }
  },
  methods: {
    stepPath(d) {
      // 路由传值
      // valr 拿到点击事时的目录
      this.departmentList.forEach(ite => {
        // 判断名字是否对应类型
        if (ite.departmentName === this.valr.title) {
          this.ids = ite.departmentId
        }
      })
      const departmentId = this.ids
      if (d.query) {
        const query = JSON.parse(d.query)
        this.$router.push({
          path: '/' + d.path,
          query: Object.assign(query, { departmentId })
        })
      } else if (departmentId) {
        this.$router.push({
          path: '/' + d.path,
          query: { departmentId }
        })
      } else {
        this.$router.push({ path: '/' + d.path })
      }
    }
  }
}
</script>

<style scoped lang="scss">
$bg: #d7f3ee;
$border-radius: 8px;
$padding: 20px 8px;
$title-font-size: 18px;
$title-font-color: #666666;
$menu-item-height: 30px;
$menu-item-bg: #a8e5da;
$menu-item-color: #666666;
$menu-item-hover-color: #48bcac;
.card-list-menu {
  width: 100%;
  height: auto;
  position: relative;
  padding: $padding;
  box-sizing: border-box;

  .content {
    height: auto;
    background-color: $bg;
    border-radius: $border-radius;

    .card-list-menu-title {
      position: absolute;
      top: 8px;
      left: 30px;
      font-size: $title-font-size;
      font-weight: bold;
      color: $title-font-color;
    }

    .card-list-menu-content {
      padding: 24px 20px;
      box-sizing: border-box;

      ul {
        width: 100%;
        list-style: none;

        li {
          position: relative;
          width: 100%;
          height: $menu-item-height;
          background-color: $menu-item-bg;
          padding: 0 16px;
          line-height: $menu-item-height;
          border-radius: 4px;
          overflow: hidden;
          box-sizing: border-box;
          color: $menu-item-color;
          margin: 5px 0;
          cursor: pointer;

          a {
            text-decoration: none;
            color: $menu-item-color;
          }
        }

        li:before {
          position: absolute;
          left: 0;
          width: 4px;
          height: 100%;
          top: 0;
          content: "";
          background-color: #1abc9c;
        }

        li:hover a {
          color: $menu-item-hover-color;
        }
      }
    }
  }
}
</style>
