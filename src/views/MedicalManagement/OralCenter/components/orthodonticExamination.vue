<template>
  <!--正畸检查-->
  <div class="container">
    <div class="leftBox">
      <el-tree :data="data" :props="defaultProps" node-key="id" :default-expanded-keys="newdatas"
        :default-checked-keys="selectnewdata" :show-checkbox="newdata" icon-class="el-icon-d-arrow-right"
        @node-click="handleNodeClick" @check="setChecked" />
      <el-tree :data="facedata" :props="defaultProps" node-key="id" :show-checkbox="newfacedata"
        icon-class="el-icon-d-arrow-right" @node-click="handleNodeClickface" :default-checked-keys="[2]"
        @check="facesetChecked"></el-tree>
      <el-tree :data="organization" :props="defaultProps" node-key="id" :show-checkbox="neworganization"
        icon-class="el-icon-d-arrow-right" @node-click="newhandleNodeClick" @check="neworganizationsetChecked" />
      <el-tree :data="denture" :props="defaultProps" node-key="id" :show-checkbox="newdenture"
        icon-class="el-icon-d-arrow-right" @node-click="ylhandleNodeClick" @check="newdenturesetChecked"
        :default-checked-keys="[2]"
        />
    </div>
    <div class="rightBox">
      <div class="One-box">
        <div class="inspect-Box title-box">
          <p>一般检查</p>
          <div>
            <span v-if="!dataFlag">
              <el-button size="mini" icon="el-icon-edit-outline" type="primary" @click="edit">编辑</el-button>
            </span>

            <span v-else>
              <el-button type="primary" size="mini" @click="submit">保存</el-button>
              <el-button type="primary" size="mini" @click="cancle">取消</el-button>
            </span>

          </div>
        </div>
        <div class="inspect-buttom title">
          <div v-for="(item, index) in list" :key="index">
            <div v-show="item.flag">
              <span>{{ item.name }}</span>
              <span v-if="item.name == '主诉'">
                <span v-if="item.flags">
                  <el-input v-model="formList.mainAppeal" placeholder="请输入....." style="width:400px;margin-left:70px" size="mini" />
                </span>
                <span style="margin-left: 10px" v-else>{{ basicList.mainAppeal }}</span>
              </span>
              <span v-if="item.name == '口腔检查'">
                <span v-if="item.flags">
                    <span style="margin-left:45px" class="Left">不良习惯:</span>
                    <el-select filterable size="mini" class="left_s" v-model="formList.BLXG">
                      <el-option
                        v-for="item in dict.type.BLXG"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span class="Left">口腔卫生:</span>
                    <el-select filterable size="mini" class="left_s" v-model="formList.KQWS">
                      <el-option
                        v-for="item in dict.type.KQWS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                </span>
                <span v-else>
                  <span class="infoRight" v-if="basicList.kqjcBlxgDetails">不良习惯:{{basicList.kqjcBlxgDetails}}</span>
                  <span class="infoRight" v-if="basicList.kqjcCqwsDetails">口腔卫生:{{basicList.kqjcCqwsDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '发育情况'">
                <span v-if="item.flags">
                    <span style="margin-left:45px" class="Left">颈椎:</span>
                    <el-select filterable size="mini" class="left_s" v-model="formList.JZ">
                      <el-option
                        v-for="item in dict.type.JZ"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span class="Left" style="margin-left:75px">手腕骨:</span>
                    <el-select filterable size="mini" class="left_s" v-model="formList.SWG">
                      <el-option
                        v-for="item in dict.type.SWG"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span class="Left">月经:</span>
                    <el-select filterable size="mini" class="left_s" v-model="formList.YJ">
                      <el-option
                        v-for="item in dict.type.YJ"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <div style="margin-top:10px;">
                      <span class="Left" style="margin-left:100px">初潮:</span>
                      <el-input v-model="formList.CC" placeholder="请输入....." style="width:400px;margin-left:20px"
                                size="mini" />
                    </div>
                </span>
                <span v-else>
                  <span class="infoRight" v-if="basicList.fyqkJzDetails">颈椎:{{basicList.fyqkJzDetails}}</span>
                  <span class="infoRight" v-if="basicList.fyqkSwgDetails">手腕骨:{{basicList.fyqkSwgDetails}}</span>
                  <span class="infoRight" v-if="basicList.fyqkYjDetails">月经:{{basicList.fyqkYjDetails}}</span>
                  <span class="infoRight" v-if="basicList.fyqkCc">初潮:{{basicList.fyqkCc}}</span>
                </span>
              </span>
              <span v-if="item.name == '以前治疗情况' ">
                <span v-if="item.flags">
                <span class="Left" style="margin-left:15px">矫正史:</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.JZS">
                  <el-option
                    v-for="item in dict.type.JZS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="Left" style="margin-left:65px">经治医生:</span>
                <el-input v-model="formList.ZLYS" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span class="Left" style="margin-left:15px">拔牙情况:</span>
                <el-input v-model="formList.BYQK" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="basicList.yqzlJzsDetails">矫正史:{{basicList.yqzlJzsDetails}}</span>
                  <span class="infoRight" v-if="basicList.yqzlJzys">经治医生:{{basicList.yqzlJzys}}</span>
                  <span class="infoRight" v-if="basicList.yqzlByqk">拔牙情况:{{basicList.yqzlByqk}}</span>
                </span>
              </span>
              <span v-if="item.name == '乳牙情况'">
                <span v-if=" item.flags">
                <span style="margin-left:45px" class="Left">龋齿 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.QC">
                  <el-option
                    v-for="item in dict.type.QC"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:70px" class="Left">早失:</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.ZS">
                  <el-option
                    v-for="item in dict.type.ZS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:45px" class="Left">错颌:</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.CH">
                  <el-option
                    v-for="item in dict.type.CH"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                  <span class="infoRight" v-if="basicList.ryqkQcDetails">龋齿:{{basicList.ryqkQcDetails}}</span>
                  <span class="infoRight" v-if="basicList.ryqkZsDetails">早失:{{basicList.ryqkZsDetails}}</span>
                  <span class="infoRight" v-if="basicList.ryqkCeDetails">错颌:{{basicList.ryqkCeDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '替牙情况'">
                 <span v-if="item.flags">
                <span style="margin-left:45px" class="Left">龋齿 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.QCS">
                  <el-option
                    v-for="item in dict.type.QC"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:70px" class="Left">早失:</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.ZSS">
                  <el-option
                    v-for="item in dict.type.ZS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  /></el-select>
                <span style="margin-left:45px" class="Left">错颌:</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.CHS">
                  <el-option
                    v-for="item in dict.type.CH"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                   <span class="infoRight" v-if="basicList.tyqkQcDetails">龋齿:{{basicList.tyqkQcDetails}}</span>
                  <span class="infoRight" v-if="basicList.tyqkZsDetails">早失:{{basicList.tyqkZsDetails}}</span>
                  <span class="infoRight" v-if="basicList.tyqkCeDetails">错颌:{{basicList.tyqkCeDetails}}</span>
                </span>
              </span>
             <span v-if="item.name == '唇腭裂' ">
               <span v-if="item.flags">
                <span style="margin-left:60px" class="Left">唇裂 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.CL">
                  <el-option
                    v-for="item in dict.type.CL"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:70px" class="Left">腭裂:</span>
                <el-select filterable size="mini" class="left_s" v-model="formList.EL">
                  <el-option
                    v-for="item in dict.type.EL"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
               <span v-else>
                 <span class="infoRight" v-if="basicList.celClDetails">唇裂:{{basicList.celClDetails}}</span>
                  <span class="infoRight" v-if="basicList.celElDetails">腭裂:{{basicList.celElDetails}}</span>
               </span>
             </span>
              <span v-if="item.name == '其他' ">
                <span v-if=" item.flags">
                <el-input v-model="formList.OTHER" placeholder="请输入....." style="width:400px;margin-left:70px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="basicList.other">其他:{{basicList.other}}</span>
                </span>
              </span>
              <el-divider />
            </div>
          </div>
        </div>
      </div>
      <!-- 面部-->
      <div class="One-box">
        <div class="title-box">
          <div>面部</div>
          <div>
            <span v-if="!faceFlag">
              <el-button size="mini" icon="el-icon-edit-outline" type="primary" @click="faceedit">编辑</el-button>
            </span>

            <span v-else>
              <el-button type="primary" size="mini" @click="faceSubmit">保存</el-button>
              <el-button type="primary" size="mini" @click="facecancle">取消</el-button>
            </span>

          </div>
        </div>

        <div class="main-box">

          <Upload :upload="upload" :limit="1" title="正面" @remove="oploadImgDel"  @successFile="successFile"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1" title="正面微笑" @remove="oploadImgDel2"   @successFile="successFile1"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1" title="侧位像" @remove="oploadImgDel3" @successFile="successFile2"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1" title="右侧面45度" @remove="oploadImgDel4" @successFile="successFile3"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1" title="左侧面45度" @remove="oploadImgDel5" @successFile="successFile4"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1"  title="面部影像其他" @remove="oploadImgDel6" @successFile="successFile5"  :fileSize="10"></Upload>

        </div>
        <div class="title">
          <div v-for="(item, index) in newlist" :key="index">
            <div v-show="item.flag">
              <span>{{ item.name }}</span>
              <span v-if="item.name == '正貌'  ">
                <span v-if="item.flags">
                <span style="margin-left:60px" class="Left">正面型 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListface.ZMX">
                  <el-option
                    v-for="item in dict.type.ZMX"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">颏餍窝 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formListface.KYW">
                  <el-option
                    v-for="item in dict.type.KYW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">唇形 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListface.CX">
                  <el-option
                    v-for="item in dict.type.CX"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div style="height:10px"></div>
                <span style="margin-left:90px" class="Left">对称性:</span>
                <el-input v-model="formListface.zmDcx" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:55px" class="Left">微笑唇齿位:</span>
                <el-input v-model="formListface.zmWxccw" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:25px" class="Left">放松唇齿位:</span>
                <el-input v-model="formListface.zmFsccw" placeholder="请输入....." style="width:190px;margin-left:20px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="faceList.zmZmxDetails">正面型:{{faceList.zmZmxDetails}}</span>
                  <span class="infoRight" v-if="faceList.zmKywDetails">颏餍窝:{{faceList.zmKywDetails}}</span>
                  <span class="infoRight" v-if="faceList.zmCxDetails">唇形:{{faceList.zmCxDetails}}</span>
                  <span class="infoRight" v-if="faceList.zmDcx">对称性:{{faceList.zmDcx}}</span>
                  <span class="infoRight" v-if="faceList.zmWxccw">微笑唇齿位:{{faceList.zmWxccw}}</span>
                  <span class="infoRight" v-if="faceList.zmFsccw">放松唇齿位:{{faceList.zmFsccw}}</span>
                </span>
              </span>
              <span v-if="item.name == '侧貌'">
                <span v-if="item.flags">
                <span style="margin-left:60px" class="Left">面型 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListface.MX">
                  <el-option
                    v-for="item in dict.type.MX"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">鼻唇角 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListface.BCJ">
                  <el-option
                    v-for="item in dict.type.BCJ"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">颏唇沟 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListface.KCG">
                  <el-option
                    v-for="item in dict.type.KCG"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div style="height:10px"></div>
                <span style="margin-left:90px" class="Left">颏位 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListface.KW">
                  <el-option
                    v-for="item in dict.type.KW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                   <span class="infoRight" v-if="faceList.cmMxDetails">面型:{{faceList.cmMxDetails}}</span>
                  <span class="infoRight" v-if="faceList.cmBcjDetails">鼻唇角:{{faceList.cmBcjDetails}}</span>
                  <span class="infoRight" v-if="faceList.cmKcgDetails">颏唇沟:{{faceList.cmKcgDetails}}</span>
                  <span class="infoRight" v-if="faceList.cmKwDetails">颏位:{{faceList.cmKwDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '其他' ">
                <span v-if=" item.flags">
                <el-input v-model="formListface.OTHER" placeholder="请输入....." style="width:400px;margin-left:70px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="faceList.other">其他:{{faceList.other}}</span>
                </span>
              </span>


              <el-divider />
            </div>
          </div>
        </div>
      </div>
      <!--  颌骨及软组织-->
      <div class="One-box">
        <div class="inspect-Box title-box">
          <p>颌骨及软组织</p>
          <div>
            <span v-if="!neworganizationFlag">
              <el-button size="mini" icon="el-icon-edit-outline" type="primary"
                @click="neworganizationedit">编辑</el-button>
            </span>

            <span v-else>
              <el-button type="primary" size="mini" @click="neworganizationSubmit">保存</el-button>
              <el-button type="primary" size="mini" @click="neworganizationcancle">取消</el-button>
            </span>
          </div>
        </div>
        <div class="inspect-buttom title">
          <div v-for="(item, index) in newlists" :key="index">
            <div v-show="item.flag">
              <span>{{ item.name }}</span>
              <span v-if=" item.name == '颌骨'" >
                <span v-if="item.flags">
                <span style="margin-left:60px" class="Left">上颌骨 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formListorganization.SHG">
                  <el-option
                    v-for="item in dict.type.HG"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">下颌骨 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formListorganization.XHG">
                  <el-option
                    v-for="item in dict.type.HG"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">下颌角 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListorganization.XHJ">
                  <el-option
                    v-for="item in dict.type.HJ"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                  <span class="infoRight" v-if="heguList.hgShgDetails">上颌骨:{{heguList.hgShgDetails}}</span>
                  <span class="infoRight" v-if="heguList.hgXhgDetails">下颌骨:{{heguList.hgXhgDetails}}</span>
                  <span class="infoRight" v-if="heguList.hgShjDetails">下颌角:{{heguList.hgShjDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '软组织' ">
                <span v-if=" item.flags">
                <span style="margin-left:60px" class="Left">舌体:</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListorganization.ST">
                  <el-option
                    v-for="item in dict.type.ST"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">上唇:</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListorganization.SC">
                  <el-option
                    v-for="item in dict.type.SXT"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">下唇 :</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListorganization.XC">
                  <el-option
                    v-for="item in dict.type.SXT"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div style="height:10px"></div>
                <span style="margin-left:90px" class="Left">舌系带:</span>
                <el-input v-model="formListorganization.SXD" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:55px" class="Left">唇系带:</span>
                <el-input v-model="formListorganization.CXD" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:25px" class="Left">扁桃体:</span>
                <el-input v-model="formListorganization.BTTS" placeholder="请输入....." style="width:190px;margin-left:20px" size="mini" />
                <div style="height:10px"></div>
                <span style="margin-left:90px" class="Left">腺样体:</span>
                <el-input v-model="formListorganization.XYT" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:55px" class="Left">腭盖:</span>
                <el-input v-model="formListorganization.EG" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="heguList.rzzStDetails">舌体:{{heguList.rzzStDetails}}</span>
                  <span class="infoRight" v-if="heguList.rzzSxd">舌系带:{{heguList.rzzSxd}}</span>
                  <span class="infoRight" v-if="heguList.rzzCxd">唇系带:{{heguList.rzzCxd}}</span>
                  <span class="infoRight" v-if="heguList.rzzBtt">扁桃体:{{heguList.rzzBtt}}</span>
                  <span class="infoRight" v-if="heguList.rzzXyt">腺样体:{{heguList.rzzXyt}}</span>
                  <span class="infoRight" v-if="heguList.rzzEg">腭盖:{{heguList.rzzEg}}</span>
                </span>
              </span>
              <span v-if="item.name == '颞下颌关节' ">
                 <span v-if="item.flags">
                <span style="margin-left:20px" class="Left">疼痛 左:</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListorganization.TTZ">
                  <el-option
                    v-for="item in dict.type.LXYW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">疼痛 右:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListorganization.TTY">
                  <el-option
                    v-for="item in dict.type.LXYW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">弹响 左:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListorganization.TXZ">
                  <el-option
                    v-for="item in dict.type.LXYW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div style="height:10px"></div>
                <span style="margin-left:90px" class="Left">弹响 右:</span>
               <el-select filterable size="mini" class="left_s" v-model="formListorganization.TXY">
                  <el-option
                    v-for="item in dict.type.LXYW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                    <span class="infoRight" v-if="heguList.nxhgjTtzDetails">疼痛 左:{{heguList.nxhgjTtzDetails}}</span>
                  <span class="infoRight" v-if="heguList.nxhgjTtyDetails">疼痛 右:{{heguList.nxhgjTtyDetails}}</span>
                  <span class="infoRight" v-if="heguList.nxhgjTtzDetails">弹响 左:{{heguList.nxhgjTtzDetails}}</span>
                  <span class="infoRight" v-if="heguList.nxhgjTxyDetails">弹响 右:{{heguList.nxhgjTxyDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '下颌运动' ">
                <span v-if="item.flags">
                <span style="margin-left:60px" class="Left">张口:</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListorganization.ZK">
                  <el-option
                    v-for="item in dict.type.KBK"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">闭口:</span>
               <el-select filterable size="mini" class="left_s" v-model="formListorganization.BK">
                  <el-option
                    v-for="item in dict.type.KBK"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">开口度:</span>
                <el-input v-model="formListorganization.KKD" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="heguList.xhydZkDetails">张口:{{heguList.xhydZkDetails}}</span>
                  <span class="infoRight" v-if="heguList.xhydBkDetails">闭口:{{heguList.xhydBkDetails}}</span>
                  <span class="infoRight" v-if="heguList.xhydZkd">开口度:{{heguList.xhydZkd}}</span>
                </span>
              </span>
              <span v-if="item.name == '呼吸道' ">
                <span v-if=" item.flags">
                <span style="margin-left:60px" class="Left">呼吸道:</span>
             <el-select filterable size="mini" class="left_s" v-model="formListorganization.HXD">
                  <el-option
                    v-for="item in dict.type.HXD"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">程度:</span>
                 <el-select filterable size="mini" class="left_s" v-model="formListorganization.CD">
                  <el-option
                    v-for="item in dict.type.HXDCD"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">其他:</span>
                <el-input v-model="formListorganization.QT" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="heguList.hxdDetails">呼吸道:{{heguList.hxdDetails}}</span>
                  <span class="infoRight" v-if="heguList.hxdCdDetails">程度:{{heguList.hxdCdDetails}}</span>
<!--                  <span class="infoRight" v-if="heguList.other">其他:{{heguList.other}}</span>-->
                </span>
              </span>
              <span v-if="item.name == '其他' ">
                <span v-if="item.flags">
                <el-input v-model="formListorganization.QT" placeholder="请输入....." style="width:400px;margin-left:70px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="heguList.other">其他:{{heguList.other}}</span>
                </span>
              </span>

              <el-divider />
            </div>
          </div>

        </div>
      </div>
      <!--      牙列-->
      <div class="One-box">
        <div class="title-box">
          <div>牙列</div>
          <div>
            <span v-if="!newdentureFlag">
              <el-button size="mini" icon="el-icon-edit-outline" type="primary" @click="newdentureedit">编辑</el-button>
            </span>

            <span v-else>
              <el-button type="primary" size="mini" @click="newdentureSubmit">保存</el-button>
              <el-button type="primary" size="mini" @click="newdenturecancle">取消</el-button>
            </span>

          </div>
        </div>

        <div class="main-box">
          <Upload :upload="upload" :limit="1"  title="正面" @remove="toothImgDel" @successFile="gettoothSuccess"  :fileSize="10" :fileList="newfilelist"></Upload>
          <Upload :upload="upload" :limit="1"  title="正面微笑" @remove="toothImgDel2" @successFile="gettoothSuccess2"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1"  title="侧位像" @remove="toothImgDel3" @successFile="gettoothSuccess3"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1"  title="右侧面45度" @remove="toothImgDel4" @successFile="gettoothSuccess4"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1"  title="左侧面45度" @remove="toothImgDel5" @successFile="gettoothSuccess5"  :fileSize="10"></Upload>
          <Upload :upload="upload" :limit="1"  title="面部影像其他" @remove="toothImgDel6" @successFile="gettoothSuccess6"  :fileSize="10"></Upload>
        </div>
        <div class="title">
          <div v-for="(item, index) in lists" :key="index">
            <div v-show="item.flag">
              <span>{{ item.name }}</span>
              <span v-if="item.name == '拥挤程度' ">
                <span v-if="item.flags">
                <span style="margin-left:90px" class="Left">上牙列:</span>
                <el-input v-model="formListnewdenture.yjcdSyl" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:55px" class="Left">下牙列:</span>
                <el-input v-model="formListnewdenture.yjcdXyl" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:25px" class="Left">多生牙:</span>
                <el-input v-model="formListnewdenture.yjcdDsy" placeholder="请输入....." style="width:190px;margin-left:20px" size="mini" />
                <div style="height:10px"></div>
                <span style="margin-left:150px" class="Left">缺失:</span>
                <el-input v-model="formListnewdenture.yjcdQs" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />
                <span style="margin-left:65px" class="Left">个别牙错位:</span>
                <el-input v-model="formListnewdenture.yjcdCw" placeholder="请输入....." style="width:190px;margin-left:20px" size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="toothList.yjcdSyl">上牙列:{{toothList.yjcdSyl}}</span>
                  <span class="infoRight" v-if="toothList.yjcdXyl">下牙列:{{toothList.yjcdXyl}}</span>
                  <span class="infoRight" v-if="toothList.yjcdDsy">多生牙:{{toothList.yjcdDsy}}</span>
                  <span class="infoRight" v-if="toothList.yjcdQs">缺失:{{toothList.yjcdQs}}</span>
                  <span class="infoRight" v-if="toothList.yjcdCw">个别牙错位:{{toothList.yjcdCw}}</span>
                </span>
              </span>
              <span v-if="item.name == 'Bolton指数' ">
                <span v-if=" item.flags">

                <span style="margin-left:80px" class="Left">前牙比:</span>
                <el-input v-model="formListnewdenture.boltonQyb" placeholder="请输入...(正常值:78+1.7)" style="width:200px;margin-left:20px"
                          size="mini" />
                <span style="margin-left:55px" class="Left">全牙比:</span>
                <el-input v-model="formListnewdenture.boltonQbyb" placeholder="请输入...(正常值:91.5+1.5)" style="width:200px;margin-left:20px"
                          size="mini" />
              </span>
                <span v-else>
                  <span class="infoRight" v-if="toothList.boltonQyb">前牙比:{{toothList.boltonQyb}}</span>
                  <span class="infoRight" v-if="toothList.boltonQbyb">全牙比:{{toothList.boltonQbyb}}</span>
                </span>
              </span>
              <span v-if="item.name == '牙弓关系' ">
                <span v-if=" item.flags">
                <span style="margin-left:90px" class="Left">左侧磨牙:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.yggxZcmy">
                  <el-option
                    v-for="item in dict.type.MY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                  <!--                <el-input v-model="formListnewdenture.yggxZcmy" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />-->
                <span style="margin-left:50px" class="Left">左侧尖牙:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.yggxZcjy">
                  <el-option
                    v-for="item in dict.type.JY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                  <!--                <el-input v-model="formListnewdenture.yggxZcjy" placeholder="请输入....." style="width:200px;margin-left:20px" size="mini" />-->
                <span style="margin-left:25px" class="Left">前牙覆盖 :</span>
                <el-select filterable size="mini" style="width: 150px;" class="left_s" v-model="formListnewdenture.yggxQyfg">
                  <el-option
                    v-for="item in dict.type.HXDCD"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                  <!--                <el-input v-model="formListnewdenture.yggxQyfg" placeholder="请输入....." style="width:150px;margin-left:20px" size="mini" />-->
                <div style="height:10px"></div>
                <span style="margin-left:100px" class="Left">右侧磨牙:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.yggxYcmy">
                  <el-option
                    v-for="item in dict.type.MY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:60px" class="Left">右侧尖牙:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.yggxYcjy">
                  <el-option
                    v-for="item in dict.type.JY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                   <span class="infoRight" v-if="toothList.yggxZcmyDetails">左侧磨牙:{{toothList.yggxZcmyDetails}}</span>
                  <span class="infoRight" v-if="toothList.yggxZcjyDetails">左侧尖牙:{{toothList.yggxZcjyDetails}}</span>
                  <span class="infoRight" v-if="toothList.yggxQyfgDetails">前牙覆盖:{{toothList.yggxQyfgDetails}}</span>
                  <span class="infoRight" v-if="toothList.yggxYcmyDetails">右侧磨牙:{{toothList.yggxYcmyDetails}}</span>
                  <span class="infoRight" v-if="toothList.yggxYcjyDetails">右侧尖牙:{{toothList.yggxYcjyDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '横向' ">
                <span v-if=" item.flags">
                <span style="margin-left:115px" class="Left"> 牙弓形态:</span>
               <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.hxYgxt">
                  <el-option
                    v-for="item in dict.type.HXDCD"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:50px" class="Left">后牙:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.hxHy">
                  <el-option
                    v-for="item in dict.type.HY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:25px" class="Left">尖牙 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.hxJy">
                  <el-option
                    v-for="item in dict.type.JY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                   <span class="infoRight" v-if="toothList.hxYgxtDetails">牙弓形态:{{toothList.hxYgxtDetails}}</span>
                  <span class="infoRight" v-if="toothList.hxHyDetails">后牙:{{toothList.hxHyDetails}}</span>
                  <span class="infoRight" v-if="toothList.hxJyDetails">尖牙:{{toothList.hxJyDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '垂直向' ">
                <span v-if=" item.flags">
                <span style="margin-left:110px" class="Left">前牙覆颌:</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.czxQyfh">
                  <el-option
                    v-for="item in dict.type.HXDCD"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                  <span class="infoRight" v-if="toothList.czxQyfhDetails">前牙覆颌:{{toothList.czxQyfhDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '牙弓中线' ">
                <span v-if="item.flags">
                <span style="margin-left:115px" class="Left"> 上颌 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.ygzxSh">
                  <el-option
                    v-for="item in dict.type.YGZXSXH"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left:50px" class="Left">下颌 :</span>
                <el-select filterable size="mini" class="left_s" v-model="formListnewdenture.ygzxXh">
                  <el-option
                    v-for="item in dict.type.YGZXSXH"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
                <span v-else>
                  <span class="infoRight" v-if="toothList.ygzxShDetails">上颌:{{toothList.ygzxShDetails}}</span>
                  <span class="infoRight" v-if="toothList.ygzxXhDetails">下颌:{{toothList.ygzxXhDetails}}</span>
                </span>
              </span>
              <span v-if="item.name == '其他'">
                <span v-if="item.flags">
                  <el-input v-model="formListnewdenture.QT" placeholder="请输入....." style="width:400px;margin-left:70px" size="mini" />
                </span>
                <span v-else>
                  <span class="infoRight" v-if="toothList.other">{{toothList.other}}</span>
                </span>
              </span>

              <el-divider />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {json} from "body-parser";
import upload from '@/components/Upload'
import store from '@/store'
import Upload from "@/components/newUpload/index";
export default {
  dictsC:['BLXG','KQWS','JZ','SWG','YJ','JZS','QC','ZS','CH','CL','EL',
  'ZMX','KYW','CX','MX','BCJ','KCG','KW','HG','HJ','ST','SXC','LXYW','KBK','HXD'
    ,'HXDCD','SXT','YGZXSXH','HXDCD','JY','HY','HXDCD','MY'],
  name: 'OrthodonticExamination',
  components:{
    // upload,
    Upload
  },
  props:['xflag'],
  mounted(){
    document.querySelector('.rightBox').scrollTop='320'
          document.querySelector('.rightBox').addEventListener('scroll',function(e){
          },this)
  },
created() {
},
  computed: {
    uploadDisabled:function() {
      return this.fileList.length >0
    },
  },
  watch:{
      xflag(val){
        console.log(val)
        if (val==0){
          this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
          this.getbasicInfo()//一般检查详情
          this.getfaceInfo()//面部详情
          this.heguInfo()//颌骨详情
          this.toothInfo()//牙列详情
        }
      }
  },
  data() {
    return {
      fileList: [],
      customName: "",
      newfilelist:[{
        name:'dsads',
        url:"http://192.168.0.110:9300/statics/2023/07/25/20230725183958A075.png"
      }],
      sysUserList:[],
      list: [
        { name: '主诉', flag: true, flags: false },
        { name: '口腔检查', flag: true, flags: false },
        { name: '发育情况', flag: true, flags: false },
        { name: '以前治疗情况', flag: true, flags: false },
        { name: '乳牙情况', flag: true, flags: false },
        { name: '替牙情况', flag: true, flags: false },
        { name: '唇腭裂', flag: true, flags: false },
        { name: '其他', flag: true, flags: false },
      ],
      newlist: [
        { name: '正貌', flag: true, flags: false },
        { name: '侧貌', flag: true, flags: false },
        { name: '其他', flag: true, flags: false },
      ],
      newlists: [
        { name: '颌骨', flag: true, flags: false },
        { name: '软组织', flag: true, flags: false },
        { name: '颞下颌关节', flag: true, flags: false },
        { name: '下颌运动', flag: true, flags: false },
        { name: '呼吸道', flag: true, flags: false },
        { name: '其他', flag: true, flags: false },
      ],
      lists: [
        { name: '拥挤程度', flag: true, flags: false },
        { name: 'Bolton指数', flag: true, flags: false },
        { name: '牙弓关系', flag: true, flags: false },
        { name: '横向', flag: true, flags: false },
        { name: '垂直向', flag: true, flags: false },
        { name: '牙弓中线', flag: true, flags: false },
        { name: '其他', flag: true, flags: false },
      ],
      newdata: false,//控制一般检查选中
      newfacedata: false,//控制面部选中
      neworganization: false,//控制组织选中
      newdenture: false,//控制牙列选中
      newdatas: [],//控制一般检查展开
      selectnewdata: [],//控制一般检查全部选中
      dataFlag: false,//控制一般检查展开收缩
      faceFlag: false,//控制面部展开收缩
      neworganizationFlag: false,//控制组织选中
      newdentureFlag: false,//控制牙列选中
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ssjs: "",
      imageUrl: '',
      //一般检查
      data: [{
        label: '一般检查',
        id: 1,
        children: [{
          label: '主诉',
          id: 2,
        },
        {
          label: '口腔检查',
          id: 3
        },
        {
          label: '发育情况',
          id: 4
        },
        {
          label: '以前治疗情况',
          id: 5,
        },
        {
          label: '乳牙情况',
          id: 6,
        },
        {
          label: '替牙情况',
          id: 7,
        },
        {
          label: '唇腭裂',
          id: 8,
        },
        {
          label: '其他',
          id: 9,
        }
        ]
      }],
      //面部
      facedata: [
        {
          label: '面部',
          id: 1,
          children: [{
            label: '面部影像上传',
            id: 2,
            disabled: true,
          }, {
            label: '正貌',
            id: 3
          }
            , {
            label: '侧貌',
            id: 4
          }
            , {
            label: '其他',
            id: 5,
          }

          ]
        }
      ],
      //颌骨及软组织
      organization: [
        {
          label: '颌骨及软组织',
          id: 1,
          children: [

            {
              label: '颌骨',
              id: 2,
            }, {
              label: '软组织',
              id: 3
            }, {
              label: '颞下颌关节',
              id: 4
            }, {
              label: '下颌运动',
              id: 5
            }
            , {
              label: '呼吸道',
              id: 6
            }
            , {
              label: '其他',
              id: 7
            }


          ]
        }
      ],
      //牙列
      denture: [
        {
          label: '牙列',
          id:1,
          children: [
            {
              label: '牙列影像上传',
              id:2,
              disabled:true
            }, {
              label: '拥挤程度',
              id:3
            }, {
              label: 'Bolton指数',
              id:4
            }, {
              label: '牙弓关系',
              id:5
            }
            , {
              label: '横向',
              id:6
            }
            , {
              label: '垂直向',
              id:7
            }
            , {
              label: '牙弓中线',
              id:8
            }
            , {
              label: '其他',
              id:9
            }

          ]
        }
      ],
      // 一般检查的数据下拉框
      formList:{
        BLXG:'',
        KQWS:'',
        JZ:'',
        SWG:'',
        YJ:'',
        JZS:'',
        QC:'',
        ZS:'',
        CH:'',
        CL:'',
        QCS:'',
        ZSS:'',
        CHS:'',
        EL:'',
        CC:"",
        ZLYS:'',
        BYQK:'',
        OTHER:'',
        mainAppeal:''
      },
      doctorList:{},
      Xflag:'',
      // 上传图片参数
      headers: { Authorization: 'Bearer ' + store.getters.userInfo.token },
      basicImage:'http://192.168.0.110:9300',
      dialogVisible:false,
      actionUrl:'/api/file/upload',
      uploadBoolean:false,
      uploadBoolean2:false,
      uploadBoolean3:false,
      uploadBoolean4:false,
      uploadBoolean5:false,
      uploadBoolean6:false,
      imageUrl1:'',
      imageUrl2:'',
      imageUrl3:'',
      imageUrl4:'',
      imageUrl5:'',
      imageUrl6:'',
      formListface:{},//面部
      faceImageList:[],
      Xflagface:0,
      Xflagorganization:0,//颌骨
      formListorganization:{},
      formListnewdenture:{},//牙列
      Xflagnewdenture:0,

      toothImageList:[],
      imageUrltooth:'',//正面照片
      imageUrltooth6:'',//正面微笑
      imageUrltooth2:'',//侧位像
      imageUrltooth3:'',//右侧面45度
      imageUrltooth4:'',//左侧面45度
      imageUrltooth5:'',//面部影像其他
      uploadBooleantooth:false,//上传禁用
      uploadBooleantooth2:false,//上传禁用
      uploadBooleantooth3:false,//上传禁用
      uploadBooleantooth4:false,//上传禁用
      uploadBooleantooth5:false,//上传禁用
      uploadBooleantooth6:false,//上传禁用，
      basicList:{},//一般检查详情
      faceList:{},//面部详情
      toothList:{},//牙列详情
      heguList:{},//颌骨详情,
      upload:{
        url:"/api/file/upload"
      },
      drag:false,
    }
  },
  methods: {
    successFile(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'1',
        photoName:file.name
      }
      this.faceImageList.push(lists)
    },
    successFile1(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'2',
        photoName:file.name
      }
      this.faceImageList.push(lists)
    },
    successFile2(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'3',
        photoName:file.name
      }
      this.faceImageList.push(lists)
    },
    successFile3(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'4',
        photoName:file.name
      }
      this.faceImageList.push(lists)
    },
    successFile4(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'5',
        photoName:file.name
      }
      this.faceImageList.push(lists)
    },
    successFile5(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'6',
        photoName:file.name
      }
      this.faceImageList.push(lists)
    },
    // 一般检查详情
    getbasicInfo(){
      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getInfoByDeptRegnId(query).then(res=>{
        if(res.data){
          this.basicList=res.data
        }
      })
    },
    // 面部详情
    getfaceInfo(){
      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getFaceInfoByDeptRegnId(query).then(res=> {
        if (res.data) {
          this.faceList=res.data
        }
      })
    },
    //颌骨详情
    heguInfo(){
      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getJawboneInfoByDeptRegnId(query).then(res=> {
        if (res.data) {
          this.heguList=res.data
        }
      })
    },
    // 牙列详情
    toothInfo(){
      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getDentureInfoByDeptRegnId(query).then(res=> {
        if (res.data) {
          this.toothList=res.data
        }
      })
    },
    newdelete(){
      console.log('ggg')
    },
    // 牙列正面照片
    gettoothSuccess(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'1',
        photoName:file.name
      }
      this.toothImageList.push(lists)
    },
    // 牙列正面照片
    gettoothSuccess2(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'2',
        photoName:file.name
      }
      this.toothImageList.push(lists)
    },
    // 牙列正面照片
    gettoothSuccess3(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'3',
        photoName:file.name
      }
    },
    // 牙列正面照片
    gettoothSuccess4(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'4',
        photoName:file.name
      }
      this.toothImageList.push(lists)
    },
    // 牙列正面照片
    gettoothSuccess5(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'5',
        photoName:file.name
      }
      this.toothImageList.push(lists)
    },
    // 牙列正面照片
    gettoothSuccess6(file){
      let lists={
        fileSuffix:file.fileSuffix,
        photoAddr:file.url,
        photoType:'6',
        photoName:file.name
      }
      this.toothImageList.push(lists)
    },
    // 删除牙列照片
    toothImgDel(val){
      let str=val.response.data.url
      this.toothImageList=this.toothImageList.filter(item=>item.photoAddr!= str)
    },
    // 删除牙列照片
    toothImgDel2(val){
      let str=val.response.data.url
      this.toothImageList=this.toothImageList.filter(item=>item.photoAddr!= str)
    },
    // 删除牙列照片
    toothImgDel3(val){
      let str=val.response.data.url
      this.toothImageList=this.toothImageList.filter(item=>item.photoAddr!= str)
    },
    // 删除牙列照片
    toothImgDel4(val){
      let str=val.response.data.url
      this.toothImageList=this.toothImageList.filter(item=>item.photoAddr!= str)
    },
    // 删除牙列照片
    toothImgDel5(val){
      let str=val.response.data.url
      this.toothImageList=this.toothImageList.filter(item=>item.photoAddr!= str)
    },
    // 删除牙列照片
    toothImgDel6(val){
      let str=val.response.data.url
      this.toothImageList=this.toothImageList.filter(item=>item.photoAddr!= str)
    },
    // 一般检查保存
    submit(){

      const query={
        mainAppeal:this.formList.mainAppeal,
        kqjcBlxg:this.formList.BLXG,
        kqjcCqws:this.formList.KQWS,
        fyqkJz:this.formList.JZ,
        fyqkSwg:this.formList.SWG,
        fyqkYj:this.formList.YJ,
        fyqkCc:this.formList.CC,
        yqzlJzs:this.formList.JZS,
        yqzlJzys:this.formList.ZLYS,
        yqzlByqk:this.formList.BYQK,
        ryqkCe:this.formList.CH,
        ryqkQc:this.formList.QC,
        ryqkZs:this.formList.ZS,
        tyqkCe:this.formList.CHS,
        tyqkQc:this.formList.QCS,
        tyqkZs:this.formList.ZSS,
        celCl:this.formList.CL,
        celEl:this.formList.EL,
        other:this.formList.OTHER,
        deptRegnId:this.doctorList.deptRegnId,
        id:this.doctorList.id,
        deptId:this.doctorList.deptId,
        correctingId:this.formList.correctingId?this.formList.correctingId:''
      }
      if (this.Xflag==0){
        this.$api.modules.kouqiang.dentalCorrectingInfoAdd(query).then(res=>{
          console.log(res,'新增')
          this.cancle()
          this.edit()
          this.getbasicInfo()
        })
      }else {
        this.$api.modules.kouqiang.dentalCorrectingInfoEdit(query).then(res=>{
          console.log(res,'修改')
          this.cancle()
          this.edit()
          this.getbasicInfo()
        })
      }
    },
    // yiban
    edit() {
      this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
      this.dataFlag = !this.dataFlag;
      if (this.dataFlag) {
        this.newdata = true;
        this.list.forEach(value => {
          value.flags = true;
        })
        this.newdatas.push(1);
        this.selectnewdata.push(1);
        setTimeout(() => {
          if (!document.querySelectorAll('.el-icon-d-arrow-right')[0].parentNode.children[1].className.includes('is-checked')) {
            document.querySelectorAll('.el-icon-d-arrow-right')[0].parentNode.children[1].click()
          }
        }, 10)
        const query={
          deptRegnId:this.doctorList.deptRegnId
        }
        this.$api.modules.kouqiang.getInfoByDeptRegnId(query).then(res=>{
          if(res.data){
            this.Xflag=1
            this.formList={
              mainAppeal:res.data.mainAppeal,
              BLXG:res.data.kqjcBlxg,
                KQWS:res.data.kqjcCqws,
                JZ:res.data.fyqkJz,
                SWG:res.data.fyqkSwg,
                YJ:res.data.fyqkYj,
                JZS:res.data.yqzlJzs,
                QC:res.data.ryqkQc,
                ZS:res.data.ryqkZs,
                CH:res.data.ryqkCe,
                CL:res.data.celCl,
                QCS:res.data.tyqkQc,
                ZSS:res.data.tyqkZs,
                CHS:res.data.tyqkCe,
                EL:res.data.celEl,
                CC:res.data.fyqkCc,
                ZLYS:res.data.yqzlJzys,
                BYQK:res.data.yqzlByqk,
                OTHER:res.data.other,
              correctingId:res.data.correctingId
            }
          }else {
            this.Xflag=0
            this.formList={}
          }
        })
      }
    },
    cancle() {
      this.selectnewdata = [];
      this.dataFlag = false;
      this.newdata = false;
      this.newdatas.splice(0, 1);
      let arr = [];
      let len = document.querySelectorAll('.el-icon-d-arrow-right');
      for (let i = 0; i < len.length; i++) {
        if (len[i].parentNode.parentNode.parentNode.className.includes('el-tree-node__children')) {

        } else {
          arr.push(len[i].parentNode.parentNode.parentNode)
        }

      }
      arr[0].children[0].children[0].children[0].click()
      this.list.forEach(value => {
        value.flags = false;
        value.flag = true;
      })


    },
    handleAvatarSuccess(){

    },
    // 删除面部上传的图片
    oploadImgDel(val){
      let str=val.response.data.url
      this.faceImageList=this.faceImageList.filter(item=>item.photoAddr!= str)
    },
    oploadImgDel2(val){
      let str=val.response.data.url
      this.faceImageList=this.faceImageList.filter(item=>item.photoAddr!= str)
    },
    oploadImgDel3(val){
      let str=val.response.data.url
      this.faceImageList=this.faceImageList.filter(item=>item.photoAddr!= str)
    },
    oploadImgDel4(val){
      let str=val.response.data.url
      this.faceImageList=this.faceImageList.filter(item=>item.photoAddr!= str)
    },
    oploadImgDel5(val){
      let str=val.response.data.url
      this.faceImageList=this.faceImageList.filter(item=>item.photoAddr!= str)
    },
    oploadImgDel6(val){
      let str=val.response.data.url
      this.faceImageList=this.faceImageList.filter(item=>item.photoAddr!= str)
    },
    // 正面文件上传成功
    handleAvatarSuccess1(file) {
      let lists={
        fileSuffix:file.data.fileSuffix,
        photoAddr:file.data.url,
        photoType:'1',
        photoName:file.data.name
      }
      this.faceImageList.push(lists)
      this.imageUrl1 = this.basicImage + file.data.url;
      if (this.imageUrl1){
        this.uploadBoolean = true
      }
      this.$message.success('上传成功')
    },
    handleAvatarSuccess2(file) {
      let lists={
        fileSuffix:file.data.fileSuffix,
        photoAddr:file.data.url,
        photoType:'2',
        photoName:file.data.name
      }
      this.faceImageList.push(lists)
      this.imageUrl2 = this.basicImage + file.data.url;
      if (this.imageUrl2){
        this.uploadBoolean2 = true
      }
      this.$message.success('上传成功')
    },
    handleAvatarSuccess3(file) {
      let lists={
        fileSuffix:file.data.fileSuffix,
        photoAddr:file.data.url,
        photoType:'3',
        photoName:file.data.name
      }
      this.faceImageList.push(lists)
      this.imageUrl3 = this.basicImage + file.data.url;
      if (this.imageUrl3){
        this.uploadBoolean3 = true
      }
      this.$message.success('上传成功')
    },
    handleAvatarSuccess4(file) {
      let lists={
        fileSuffix:file.data.fileSuffix,
        photoAddr:file.data.url,
        photoType:'4',
        photoName:file.data.name
      }
      this.faceImageList.push(lists)
      this.imageUrl4 = this.basicImage + file.data.url;
      if (this.imageUrl4){
        this.uploadBoolean4 = true
      }
      this.$message.success('上传成功')
    },
    handleAvatarSuccess5(file) {
      let lists={
        fileSuffix:file.data.fileSuffix,
        photoAddr:file.data.url,
        photoType:'5',
        photoName:file.data.name
      }
      this.faceImageList.push(lists)
      this.imageUrl5 = this.basicImage + file.data.url;
      if (this.imageUrl5){
        this.uploadBoolean5 = true
      }
      this.$message.success('上传成功')
    },
    handleAvatarSuccess6(file) {
      let lists={
        fileSuffix:file.data.fileSuffix,
        photoAddr:file.data.url,
        photoType:'6',
        photoName:file.data.name
      }
      this.faceImageList.push(lists)
      this.imageUrl6 = this.basicImage + file.data.url;
      if (this.imageUrl6){
        this.uploadBoolean6 = true
      }
      this.$message.success('上传成功')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList,'111');
    },
    newdenturesetChecked(data,checked){
      if (data.id == 1) {
        if (data.id == 1 && checked.checkedKeys.length == 9) {
          this.lists.forEach(value => {
            value.flags = true;
            value.flag = true;
          })
        } else {
          this.lists.forEach(value => {
            value.flags = false;
            value.flag = false;
          })
        }
      } else {
        if (checked.checkedKeys.indexOf(data.id) == -1) {
          this.lists.forEach(value => {
            if (value.name == data.label) {
              value.flag = false
            }
          })
        } else {
          this.lists.forEach(value => {
            if (value.name == data.label) {
              value.flag = true
            }
          })
        }
      }
    },
    // 牙列编辑
    newdentureedit() {
      this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
      this.newdentureFlag = !this.newdentureFlag;
      this.newdenture = true;
      let arr = [];
      this.lists.forEach(value => {
        value.flags = true;
        value.flag = true;
      })
      setTimeout(() => {
        let len = document.querySelectorAll('.el-icon-d-arrow-right');
        for (let i = 0; i < len.length; i++) {
          if (len[i].parentNode.parentNode.parentNode.className.includes('el-tree-node__children')) {

          } else {
            arr.push(len[i].parentNode.parentNode.parentNode)
          }
        }
        if (arr[3].children[0].children[0].children[0].className.includes('expanded')) {

        } else {
          arr[3].children[0].children[0].children[0].click()
        }


        if (!arr[3].children[0].children[0].children[1].className.includes('is-checked')) {
          arr[3].children[0].children[0].children[1].click();

        }
      }, 10)
      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getDentureInfoByDeptRegnId(query).then(res=>{
        if(res.data){
          this.Xflagnewdenture=1
          this.formListnewdenture={
            yjcdSyl:res.data.yjcdSyl,
            yjcdXyl:res.data.yjcdXyl,
            yjcdDsy:res.data.yjcdDsy,
            yjcdQs:res.data.yjcdQs,
            yjcdCw:res.data.yjcdCw,
            boltonQyb:res.data.boltonQyb,
            boltonQbyb:res.data.boltonQbyb,
            yggxZcmy:res.data.yggxZcmy,
            yggxZcjy:res.data.yggxZcjy,
            yggxQyfg:res.data.yggxQyfg,
            yggxYcmy:res.data.yggxYcmy,
            yggxYcjy:res.data.yggxYcjy,
            hxYgxt:res.data.hxYgxt,
            hxHy:res.data.hxHy,
            hxJy:res.data.hxJy,
            czxQyfh:res.data.czxQyfh,
            ygzxSh:res.data.ygzxSh,
            ygzxXh:res.data.ygzxXh,
            HXD:res.data.hxd,
            QT:res.data.other,
            dentureId:res.data.dentureId
          }
          res.data.photoInfoList.forEach(item=>{
            if (item.photoType==1){
              this.imageUrltooth=this.basicImage +item.photoAddr
            }else if (item.photoType==2){
              this.imageUrltooth2=this.basicImage +item.photoAddr
            }else if (item.photoType==3){
              this.imageUrltooth3=this.basicImage +item.photoAddr
            }else if (item.photoType==4){
              this.imageUrltooth4=this.basicImage +item.photoAddr
            }else if (item.photoType==5){
              this.imageUrltooth5=this.basicImage +item.photoAddr
            }else if (item.photoType==6){
              this.imageUrltooth6=this.basicImage +item.photoAddr
            }
          })
        }else {
          this.Xflagnewdenture=0
          this.formListnewdenture={}
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.photoType) && res.set(arr.photoType, 1))
    },
    // 牙列保存
    newdentureSubmit(){
      this.toothImageList=this.unique(this.toothImageList)
      let arrstr = '';
      this.toothImageList.forEach((value, index) => {
        if (index == this.toothImageList.length - 1) {
          arrstr += JSON.stringify(value)
        } else {
          arrstr += JSON.stringify(value) + ','
        }
      })
      const query={
        yjcdSyl:this.formListnewdenture.yjcdSyl,
        yjcdXyl:this.formListnewdenture.yjcdXyl,
        yjcdDsy:this.formListnewdenture.yjcdDsy,
        yjcdQs:this.formListnewdenture.yjcdQs,
        yjcdCw:this.formListnewdenture.yjcdCw,
        boltonQyb:this.formListnewdenture.boltonQyb,
        boltonQbyb:this.formListnewdenture.boltonQbyb,
        yggxZcmy:this.formListnewdenture.yggxZcmy,
        yggxZcjy:this.formListnewdenture.yggxZcjy,
        yggxQyfg:this.formListnewdenture.yggxQyfg,
        yggxYcmy:this.formListnewdenture.yggxYcmy,
        yggxYcjy:this.formListnewdenture.yggxYcjy,
        hxYgxt:this.formListnewdenture.hxYgxt,
        hxHy:this.formListnewdenture.hxHy,
        hxJy:this.formListnewdenture.hxJy,
        czxQyfh:this.formListnewdenture.czxQyfh,
        ygzxSh:this.formListnewdenture.ygzxSh,
        ygzxXh:this.formListnewdenture.ygzxXh,
        other:this.formListnewdenture.QT,
        deptRegnId:this.doctorList.deptRegnId,
        photoInfo:arrstr,
        id:this.doctorList.id,
        deptId:this.doctorList.deptId,
        dentureId:this.formListnewdenture.dentureId?this.formListnewdenture.dentureId:''
      }
      if (this.Xflagnewdenture==0){
        this.$api.modules.kouqiang.dentalDentureInfoAdd(query).then(res=>{
          console.log(res,'新增')
          this.neworganizationcancle()
          this.newdentureedit()
          this.toothInfo()
        })
      }else {
        this.$api.modules.kouqiang.dentalDentureInfoEdit(query).then(res=>{
          console.log(res,'修改')
          this.neworganizationcancle()
          this.newdentureedit()
          this.toothInfo()

        })
      }
    },
    // 牙列取消
    newdenturecancle() {
      this.newdentureFlag = false;
      this.newdenture = false;
      let arr = [];
      this.lists.forEach(value => {
        value.flags = false;
        value.flag = true
      })
      let len = document.querySelectorAll('.el-icon-d-arrow-right');
      for (let i = 0; i < len.length; i++) {
        if (len[i].parentNode.parentNode.parentNode.className.includes('el-tree-node__children')) {

        } else {
          arr.push(len[i].parentNode.parentNode.parentNode)
        }
      }
      arr[3].children[0].children[0].children[0].click()

    },
    neworganizationsetChecked(data, checked) {
      if (data.id == 1) {
        if (data.id == 1 && checked.checkedKeys.length == 7) {
          this.newlists.forEach(value => {
            value.flags = true;
            value.flag = true;
          })
        } else {
          this.newlists.forEach(value => {
            value.flags = false;
            value.flag = false;
          })
        }
      } else {
        if (checked.checkedKeys.indexOf(data.id) == -1) {
          this.newlists.forEach(value => {
            if (value.name == data.label) {
              value.flag = false
            }
          })
        } else {
          this.newlists.forEach(value => {
            if (value.name == data.label) {
              value.flag = true
            }
          })
        }
      }
    },
    // 颌骨编辑
    neworganizationedit() {
      this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
      this.neworganizationFlag = !this.neworganizationFlag;
      this.neworganization = true;
      let arr = [];
      this.newlists.forEach(value => {
        value.flags = true;
        value.flag = true;
      })
      setTimeout(() => {
        let len = document.querySelectorAll('.el-icon-d-arrow-right');
        for (let i = 0; i < len.length; i++) {
          if (len[i].parentNode.parentNode.parentNode.className.includes('el-tree-node__children')) {

          } else {
            arr.push(len[i].parentNode.parentNode.parentNode)
          }
        }
        if (arr[2].children[0].children[0].children[0].className.includes('expanded')) {

        } else {
          arr[2].children[0].children[0].children[0].click()
        }


        if (!arr[2].children[0].children[0].children[1].className.includes('is-checked')) {
          arr[2].children[0].children[0].children[1].click();

        }
      }, 10)

      const query={
        deptRegnId:this.doctorList.deptRegnId
      }
      this.$api.modules.kouqiang.getJawboneInfoByDeptRegnId(query).then(res=>{
        if(res.data){
          this.Xflagorganization=1
          this.formListorganization={
            SHG:res.data.hgShg,
            XHG:res.data.hgXhg,
            XHJ:res.data.hgShj,
            ST:res.data.rzzSt,
            SC:res.data.rzzSc,
            XC:res.data.rzzXc,
            SXD:res.data.rzzSxd,
            CXD:res.data.rzzCxd,
            BTTS:res.data.rzzBtt,
            XYT:res.data.rzzXyt,
            EG:res.data.rzzEg,
            CD:res.data.hxdCd,
            TTZ:res.data.nxhgjTtz,
            TTY:res.data.nxhgjTty,
            TXY:res.data.nxhgjTxy,
            TXZ:res.data.nxhgjTxz,
            ZK:res.data.xhydZk,
            BK:res.data.xhydBk,
            KKD:res.data.xhydZkd,
            HXD:res.data.hxd,
            QT:res.data.other,
            jawboneId:res.data.jawboneId
          }
        }else {
          this.Xflagorganization=0
          this.formListorganization={}
        }
      })
    },
    // 颌骨保存
    neworganizationSubmit(){
      const query={
        hgShg:this.formListorganization.SHG,
        hgXhg:this.formListorganization.XHG,
        hgShj:this.formListorganization.XHJ,
        rzzSt:this.formListorganization.ST,
        rzzSc:this.formListorganization.SC,
        rzzXc:this.formListorganization.XC,
        rzzSxd:this.formListorganization.SXD,
        rzzCxd:this.formListorganization.CXD,
        rzzBtt:this.formListorganization.BTTS,
        rzzXyt:this.formListorganization.XYT,
        rzzEg:this.formListorganization.EG,
        nxhgjTtz:this.formListorganization.TTZ,
        nxhgjTty:this.formListorganization.TTY,
        nxhgjTxy:this.formListorganization.TXY,
        nxhgjTxz:this.formListorganization.TXZ,
        xhydZk:this.formListorganization.ZK,
        xhydBk:this.formListorganization.BK,
        xhydZkd:this.formListorganization.KKD,
        hxd:this.formListorganization.HXD,
        other:this.formListorganization.QT,
        hxdCd:this.formListorganization.CD,
        deptRegnId:this.doctorList.deptRegnId,
        id:this.doctorList.id,
        deptId:this.doctorList.deptId,
        jawboneId:this.formListorganization.jawboneId?this.formListorganization.jawboneId:''
      }
      if (this.Xflagorganization==0){
        this.$api.modules.kouqiang.dentalJawboneInfoAdd(query).then(res=>{
          this.neworganizationcancle()
          this.neworganizationedit()
          this.heguInfo()
        })
      }else {
        this.$api.modules.kouqiang.dentalJawboneInfoEdit(query).then(res=>{
          this.neworganizationcancle()
          this.neworganizationedit()
          this.heguInfo()
        })
      }
    },

    neworganizationcancle() {
      this.neworganizationFlag = false;
      this.neworganization = false;
      let arr = [];
      this.newlists.forEach(value => {
        value.flags = false;
        value.flag = true
      })
      let len = document.querySelectorAll('.el-icon-d-arrow-right');
      for (let i = 0; i < len.length; i++) {
        if (len[i].parentNode.parentNode.parentNode.className.includes('el-tree-node__children')) {

        } else {
          arr.push(len[i].parentNode.parentNode.parentNode)
        }
      }
      arr[2].children[0].children[0].children[0].click()
    },
    facesetChecked(data, checked) {
      if (data.id == 1) {
        if (data.id == 1 && checked.checkedKeys.length == 5) {
          this.newlist.forEach(value => {
            value.flags = true;
            value.flag = true;
          })
        } else {
          this.newlist.forEach(value => {
            value.flags = false;
            value.flag = false;
          })
        }
      } else {
        if (checked.checkedKeys.indexOf(data.id) == -1) {
          this.newlist.forEach(value => {
            if (value.name == data.label) {
              value.flag = false
            }
          })
        } else {
          this.newlist.forEach(value => {
            if (value.name == data.label) {
              value.flag = true
            }
          })
        }
      }
    },
    facecancle() {
      this.faceFlag = false;
      this.newfacedata = false;
      let arr = [];
      this.newlist.forEach(value => {
        value.flags = false;
        value.flag = true
      })
      let len = document.querySelectorAll('.el-icon-d-arrow-right');
      for (let i = 0; i < len.length; i++) {
        if (len[i].parentNode.parentNode.parentNode.className.includes('el-tree-node__children')) {

        } else {
          arr.push(len[i].parentNode.parentNode.parentNode)
        }
      }
      arr[1].children[0].children[0].children[0].click()

    },
    // 面部编辑
    faceedit() {
      this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
      this.faceFlag = !this.faceFlag;
      this.newfacedata = true;
      let arr = [];
      this.newlist.forEach(value => {
        value.flags = true;
        value.flag = true;
      })
      if (this.faceFlag) {
        setTimeout(() => {
          let len = document.querySelectorAll('.el-icon-d-arrow-right');
          for (let i = 0; i < len.length; i++) {
            if (len[i].parentNode.parentNode.parentNode.className.includes('el-tree-node__children')) {

            } else {
              arr.push(len[i].parentNode.parentNode.parentNode)
            }
          }
          if (arr[1].children[0].children[0].children[0].className.includes('expanded')) {

          } else {
            arr[1].children[0].children[0].children[0].click()
          }


          if (!arr[1].children[0].children[0].children[1].className.includes('is-checked')) {
            arr[1].children[0].children[0].children[1].click();

          }


        }, 10)
        const query={
          deptRegnId:this.doctorList.deptRegnId
        }
        this.$api.modules.kouqiang.getFaceInfoByDeptRegnId(query).then(res=>{
          if(res.data){
            this.Xflagface=1
            this.formListface={
              ZMX:res.data.zmZmx,
              KYW:res.data.zmKyw,
              CX:res.data.zmCx,
              zmDcx:res.data.zmDcx,
              zmWxccw:res.data.zmWxccw,
              zmFsccw:res.data.zmFsccw,
              MX:res.data.cmMx,
              BCJ:res.data.cmBcj,
              KCG:res.data.cmKcg,
              KW:res.data.cmKw,
              OTHER:res.data.other,
              faceId:res.data.faceId
            }
            res.data.photoInfoList.forEach(item=>{
              if (item.photoType==1){
                this.imageUrl1=this.basicImage +item.photoAddr
                this.uploadBoolean = true
              }else if (item.photoType==2){
                this.imageUrl2=this.basicImage +item.photoAddr
              }else if (item.photoType==3){
                this.imageUrl3=this.basicImage +item.photoAddr
              }else if (item.photoType==4){
                this.imageUrl4=this.basicImage +item.photoAddr
              }else if (item.photoType==5){
                this.imageUrl5=this.basicImage +item.photoAddr
              }else if (item.photoType==6){
                this.imageUrl6=this.basicImage +item.photoAddr
              }
            })
          }else {
            this.Xflagface=0
            this.formListface={}
          }
        })
      }

    },
    // 面部保存
    faceSubmit(){
      this.faceImageList=this.unique(this.faceImageList)
      let arrstr = '';
      this.faceImageList.forEach((value, index) => {
        if (index == this.faceImageList.length - 1) {
          arrstr += JSON.stringify(value)
        } else {
          arrstr += JSON.stringify(value) + ','
        }
      })
      const query={
        zmZmx:this.formListface.ZMX,
        zmKyw:this.formListface.KYW,
        zmCx:this.formListface.CX,
        zmDcx:this.formListface.zmDcx,
        zmWxccw:this.formListface.zmWxccw,
        zmFsccw:this.formListface.zmFsccw,
        cmMx:this.formListface.MX,
        cmBcj:this.formListface.BCJ,
        cmKcg:this.formListface.KCG,
        KW:this.formListface.cmKw,
        deptRegnId:this.doctorList.deptRegnId,
        id:this.doctorList.id,
        deptId:this.doctorList.deptId,
        faceId:this.formListface.faceId?this.formListface.faceId:'',
        photoInfo:arrstr
      }
      if (this.Xflagface==0){
        this.$api.modules.kouqiang.dentalFaceInfoAdd(query).then(res=>{
          console.log(res,'新增')
          this.facecancle()
          this.faceedit()
          this.getfaceInfo()
        })
      }else {
        this.$api.modules.kouqiang.dentalFaceInfoEdit(query).then(res=>{
          console.log(res,'修改')
          this.facecancle()
          this.faceedit()
          this.getfaceInfo()
        })
      }
    },
    setChecked(data, checked, deep) {
      if (data.id == 1) {
        if (data.id == 1 && checked.checkedKeys.length == 9) {
          this.list.forEach(value => {
            value.flags = true;
            value.flag = true;
          })
        } else {
          this.list.forEach(value => {
            value.flags = false;
            value.flag = false;
          })
        }
      } else {
        if (checked.checkedKeys.indexOf(data.id) == -1) {
          this.list.forEach(value => {
            if (value.name == data.label) {
              value.flag = false
            }
          })
        } else {
          this.list.forEach(value => {
            if (value.name == data.label) {
              value.flag = true
            }
          })
        }
      }

    },


    handleClick() {

    },

    newhandleNodeClick() {
      document.querySelector('.rightBox').scrollTop=650
    },
    handleNodeClick() {
      document.querySelector('.rightBox').scrollTop=0
    },
    ylhandleNodeClick() {
      document.querySelector('.rightBox').scrollTop=900
    },
    handleNodeClickface() {
      document.querySelector('.rightBox').scrollTop=330
    },
    beforeAvatarUpload() {

    }
  },
}
</script>

<style scoped lang="scss">
.Left {
  margin-left: 45px;
}

.left_s {
  margin-left: 20px;
}

.container {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.leftBox {
  height: 600px;
  width: 20%;
  padding: 0 10px;
  margin-right: 10px;
  border: 1px solid #dddddd;
  overflow-y: scroll;
}

.rightBox {
  width: 100%;
  height: 600px;
  overflow-y: scroll;
  flex: 1;

  .One-box {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #dddddd;
  }

  .main-box {
    margin-top: 10px;
    padding: 0 10px;
    display: flex;
  }

  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 40px;
    background-color: #ebfaff;
  }

  .title {
    margin-top: 10px;
    padding: 0 10px;
    font-size: 14px;
  }
}

::v-deep .avatar-uploader .el-upload {
  margin-right: 10px;
  //border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

::v-deep .el-divider--horizontal {
  margin: 6px 0 !important;
}

// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
//.title_del {
//  width: 146px;
//  height: 146px;
//  background-color: rgba(0, 0, 0, .5);
//  opacity: 0.7;
//  position: absolute;
//  top: 0;
//  display: none;
//
//}
//.el-upload--picture-card:hover .title_del{
//  display: block;
//}
//.busic_img {
//  width: 630px;
//  min-height: 142px;
//  display: flex;
//  flex-wrap: wrap;
//  margin-left: 10px;
//
//}
//.disabled .el-upload--picture-card {
//  display: none;
//}
.avatar-uploader >>>.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload-list__item-actions:hover span {
  display: inline-block;
}
//.el-icon-zoom-in:before {
//  content: "\E626";
//}
//.el-icon-delete:before {
//  content: "\E612";
//}
.el-upload-list__item-actions:hover {
  opacity: 1;
}
.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0,0,0,.5);
  transition: opacity .3s;
}
.avatar-uploader >>>.el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  //font-size: 28px;
  color: #c8cacd;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 100%;
 height: 100%;
  display: block;
}
.upload-icon {
  position: absolute;
  top: 12%;
  margin-left: -14px;
  margin-top: -20px;
}
.dialogBox >>>.el-dialog{
  top: 30% !important;
  width: 30%;
}
.infoRight{
  margin-left: 60px;
}
</style>
