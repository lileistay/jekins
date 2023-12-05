<template>
  <!--  参数设置-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay">
      <template v-slot:company>
        <input type="file" class="filelist" @change="change" style="visibility: hidden;" accept=".pem">
        <div class="dept-table">
          <el-button type="primary" size="mini" class="subbutton" @click="submitForm('numberValidateForm')"
            :disabled="issubmit">保存</el-button>
          <el-form :model="numberValidateForm" ref="numberValidateForm" :rules="rules" label-width="120px"
            class="demo-ruleForm form">
            <el-row>
              <el-col :span="6">
                <el-form-item label="商户号" prop="mchId">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.mchId" autocomplete="off" size="mini"
                      placeholder="请输入商户号" :disabled="isedit1"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(1)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证书地址" prop="privateKeyPath">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.privateKeyPath" autocomplete="off" size="mini"
                      placeholder="请上传证书" style="width: 280px;" disabled="">
                    </el-input>
                    <el-button size="mini" type="primary" style="margin-left: 20px;height: 26px;margin-top: 8px"
                      @click="upload" :disabled="issubmit">上传证书</el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证书序列号" prop="mchSerialNo">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.mchSerialNo" autocomplete="off" size="mini"
                      placeholder="请输入证书序列号" :disabled="isedit2"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(2)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="v3密钥" prop="payKey">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.payKey" autocomplete="off" size="mini"
                      placeholder="请输入v3密钥" :disabled="isedit3"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(3)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 二级 -->
            <el-row>
              <el-col :span="6">
                <el-form-item label="企业微信Id" prop="mafagId">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.mafagId" autocomplete="off" size="mini"
                      placeholder="请输入企业微信Id" :disabled="isedit4"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(4)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="企业微信" prop="mafagSecret">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.mafagSecret" autocomplete="off" size="mini"
                      placeholder="请输入企业微信" :disabled="isedit5"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(5)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通讯录同步" prop="txlSecret">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.txlSecret" autocomplete="off" size="mini"
                      placeholder="请输入通讯录同步" :disabled="isedit6"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(6)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="appId" prop="appAgentid">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.appAgentid" autocomplete="off" size="mini"
                      placeholder="请输入appId" :disabled="isedit7"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(7)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 三级 -->
            <el-row>
              <el-col :span="6">
                <el-form-item label="远程地址密钥" prop="stoken">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.stoken" autocomplete="off" size="mini"
                      placeholder="请输入远程地址密钥" :disabled="isedit8"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(8)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="AESKey" prop="sencodingAesKey">
                  <div class="forminp">
                    <el-input v-model.number="numberValidateForm.sencodingAesKey" autocomplete="off" size="mini"
                      placeholder="请输入EncodingAESKey" :disabled="isedit9"></el-input>
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline"
                      @click="editorList(9)"></el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否结账单表头" prop="sencodingAesKey">
                  <div class="forminp" style="display: flex;align-items: center;">
                    <el-radio v-model="numberValidateForm.radio" label="0" :disabled="isedit10"
                      style="margin-left: 20px;">否</el-radio>
                    <el-radio v-model="numberValidateForm.radio" label="1" :disabled="isedit10">是</el-radio>
                    <!-- <el-input v-model.number="numberValidateForm.sencodingAesKey" autocomplete="off" size="mini"
                      placeholder="请输入EncodingAESKey" :disabled="isedit9"></el-input> -->
                    <el-button size="mini" class="editbutton" icon="el-icon-edit-outline" @click="editorList(10)"
                      style="margin-left: 95px;"></el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>

      </template>

    </Tree>
  </div>
</template>

<script>

import Treeselect from '@riophae/vue-treeselect'

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'

import toolbars from '@/utils/markDownToolbars'


export default {
  name: 'parameter',
  components: {
    Treeselect,
    Tree
  },
  data() {
    return {
      toolbars: toolbars,  // markdown提示栏
      addflag: true,
      configId: "",
      deptName: undefined,
      issubmit: true,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      props: { multiple: true },
      deptId: undefined,
      // 表单数据
      numberValidateForm: {
        mchId: '',
        mchSerialNo: "",
        privateKeyPath: "",
        payKey: '',
        mafagId: '',
        mafagSecret: '',
        txlSecret: '',
        appAgentid: '',
        stoken: '',
        sencodingAesKey: '',
        radio: '0'
      },
      rules: {
        // mchId: [
        //   { required: true, message: '请输入商户号', trigger: 'blur' },
        // ],
        // mchSerialNo: [
        //   { required: true, message: '请输入证书序列号', trigger: 'blur' },
        // ],
        // privateKeyPath: [
        //   { required: true, message: '请上传证书', trigger: 'blur' },
        // ],
        // payKey: [
        //   { required: true, message: '请输入v3密钥', trigger: 'blur' },
        // ],
        // mafagId: [
        //   { required: true, message: '请输入企业微信Id', trigger: 'blur' },
        // ],
        // mafagSecret: [
        //   { required: true, message: '请输入企业微信', trigger: 'blur' },
        // ],
        // txlSecret: [
        //   { required: true, message: '请输入通讯录同步', trigger: 'blur' },
        // ],
        // appAgentid: [
        //   { required: true, message: '请输入APPId', trigger: 'blur' },
        // ],
        // stoken: [
        //   { required: true, message: '请输入远程地址密钥', trigger: 'blur' },
        // ],
        // sencodingAesKey: [
        //   { required: true, message: '请输入EncodingAESKey', trigger: 'blur' },
        // ]
      },
      isedit1: true,
      isedit2: true,
      isedit3: true,
      isedit4: true,
      isedit5: true,
      isedit6: true,
      isedit7: true,
      isedit8: true,
      isedit9: true,
      isedit10: true,
    }
  },
  watch: {
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
    // console.log(0.67.toFixed(1))
  },
  methods: {
    change(e) {
      let fromdata = new FormData();
      fromdata.append('file', e.target.files[0]);
      this.$api.confinementRoom.unload(fromdata).then(res => {
        if (res.code == 200) {
          this.$message.success('上传成功');
          this.numberValidateForm.privateKeyPath = res.data.localPath + res.data.url
        }

      })
      e.target.value = '';
    },
    upload() {
      document.querySelector('.filelist').click();
    },
    submitForm(no) {
      this.$refs[no].validate((valid) => {
        if (valid) {
          this.numberValidateForm.deptId = this.deptId
          if (this.addflag) {
            this.$api.confinementRoom.configInfoadd(this.numberValidateForm).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
              }
            })
          } else {
            this.numberValidateForm.configId = this.configId
            this.$api.confinementRoom.configInfoedit(this.numberValidateForm).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    changeCompay(id, data) {
      this.isedit1 = true;
      this.isedit2 = true;
      this.isedit3 = true;
      this.isedit4 = true;
      this.isedit5 = true;
      this.isedit6 = true;
      this.isedit7 = true;
      this.isedit8 = true;
      this.isedit9 = true;
      this.isedit10 = true;
      this.numberValidateForm = {
        mchId: '',
        mchSerialNo: "",
        privateKeyPath: "",
        payKey: '',
        mafagId: '',
        mafagSecret: '',
        txlSecret: '',
        appAgentid: '',
        stoken: '',
        sencodingAesKey: '',
        radio:'0'
      }
      if (!data.children) {
        this.deptId = id
        this.issubmit = false;
        this.$api.confinementRoom.configInfo({
          deptId: id,
        }).then(res => {
          if (!res.data) {
            this.addflag = true;
          } else {
            this.numberValidateForm = {
              mchId: res.data.mchId,
              mchSerialNo: res.data.mchSerialNo,
              privateKeyPath: res.data.privateKeyPath,
              payKey: res.data.payKey,
              mafagId: res.data.mafagId,
              mafagSecret: res.data.mafagSecret,
              txlSecret: res.data.txlSecret,
              appAgentid: res.data.appAgentid,
              stoken: res.data.stoken,
              sencodingAesKey: res.data.sencodingAesKey,
              radio:res.data.radio

              // mafagSecret: [
              //   { required: true, message: '请输入企业微信', trigger: 'blur' },
              // ],
              // txlSecret: [
              //   { required: true, message: '请输入通讯录同步', trigger: 'blur' },
              // ],
              // appAgentid: [
              //   { required: true, message: '请输入APPId', trigger: 'blur' },
              // ],
              // stoken: [
              //   { required: true, message: '请输入远程地址密钥', trigger: 'blur' },
              // ],
              // sencodingAesKey: [
              //   { required: true, message: '请输入EncodingAESKey', trigger: 'blur' },
              // ]

            }
            this.addflag = false;
            this.configId = res.data.configId
          }
        })
      } else {
        this.issubmit = true;
      }


      // this.getData()
    },
    // 节点点击事件
    handleNodeClick(data) {
      if (this.deptId !== data.id) {
        this.deptId = data.id

      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptId = res.data[0].id
          this.deptOptions = res.data

        }
      })
    },
    editorList(i) {
      switch (i) {
        case 1: this.isedit1 = false;
          break;
        case 2: this.isedit2 = false;
          break;
        case 3: this.isedit3 = false;
          break;
        case 4: this.isedit4 = false;
          break;
        case 5: this.isedit5 = false;
          break;
        case 6: this.isedit6 = false;
          break;
        case 7: this.isedit7 = false;
          break;
        case 8: this.isedit8 = false;
          break;
        case 9: this.isedit9 = false;
          break;
        case 10: this.isedit10 = false;
          break;
      }
    },

  }
}
</script>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.department-list {
  width: 250px;
  padding: 5px;
  box-sizing: border-box;

  .down-tree {
    height: 730px;
    display: block;
    overflow-y: scroll;
  }

  .el-tree {
    background-color: #f8f8f8;
  }
}

.dept-table {
  width: calc(100% - 0px);
  position: relative;
}

// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}

.form {
  padding: 20px 20px 20px 0px;
}

.subbutton {
  position: absolute;
  right: 20px;
  top: -15px;
}

.editbutton {
  margin-left: 20px;
  height: 26px;
  margin-top: 8px
}

.forminp {
  width: 100%;
  height: 40px;
  display: flex
}
</style>
