<template>
  <div class="sg-dialog content" >
    <el-dialog v-lilei   :visible.sync="dialog" :width="size" center :top="outTop" append-to-body :before-close="handleClose"
      :close-on-click-modal="false" :close-on-press-escape="false" :modal="modal" :fullscreen="fullscreen"
      custom-class="sg-dialog" :destroy-on-close="true" @open="setEmit('open')" @opened="setEmit('opened')"
      @close="setEmit('close')" @closed="setEmit('closed')">
      <el-dialog :visible.sync="innerDialog" :width="innerSize" center :top="inTop" :fullscreen="innerFullscreen"
        append-to-body :before-close="innerHandleClose" :close-on-click-modal="false" :close-on-press-escape="false"
        :modal="modal" custom-class="sg-dialog">
        <div slot="title" class="dialogTit"><i :class="innerTitleIcon" />{{ innerTitle }}</div>
        <slot name="in" />
      </el-dialog>
      <div slot="title" class="dialogTit"><i :class="titleIcon" />{{ title }}
        <slot name="outTitle" />
      </div>
      <slot name="out" />
      <slot name="footer" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SgDialog',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    innerTitle: {
      type: String,
      default: '嵌套层标题'
    },
    titleIcon: {
      type: String,
      default: ''
    },
    innerTitleIcon: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean || String,
      default: true
    },
    innerFullscreen: {
      type: Boolean || String,
      default: false
    },
    fullscreen: {
      type: Boolean || String,
      default: false
    },
    dialog: {
      type: Boolean,
      default: false
    },
    innerDialog: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '800px'
    },
    innerSize: {
      type: String,
      default: '600px'
    },
    outTop: {
      type: String,
      default: '8%'
    },
    inTop: {
      type: String,
      default: '10%'
    }
  },
  mounted(){
  //   document.onselectstart = function(){
  //   return false;
  // }\
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    innerHandleClose() {
      this.$emit('innerHandleClose')
    },
    setEmit(event) {

      this.$emit(event)
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/index.scss";
::v-deep .el-dialog{
  position: absolute !important;
}
.sg-dialog {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.44), 0 0 6px rgba(0, 0, 0, 0.36);
  border-radius: 10px;

  /* border: 4px solid rgb(154, 224, 240) !important; */
  .el-dialog__body {
    padding: 20px !important;
    box-sizing: border-box;
    min-height: 135px;
    color: black;
  }

  .el-dialog__headerbtn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: $color-info;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -16px;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    transition: 0.25s;
  }

  .el-dialog__headerbtn:hover .el-dialog__close {
    transform: rotate(90deg);
    color: #fff;
  }

  .el-dialog__header {
    background-color: $primary;
    height: 8px;
    color: #fff;
    border-radius: 10px 10px 0 0;

  }

  .dialogTit {
    width: 100%;
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    margin-top: -13px;

    i {
      margin-right: 4px;
      font-size: 18px;
    }
  }
}
</style>
