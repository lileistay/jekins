<template>
    <div class="headertable" style="position:relative">
        <ul class="Tab" style="position: absolute;right: 0px;z-index:10;width: 200px;" ref="Tab">
            <el-button type="primary" plain size="mini" @click="Nonurse()"
                style="width: 100px;font-size: 12px;">入出管理</el-button>
            <el-button type="primary" plain size="mini" @click="nurse()" style="width: 80px;font-size: 12px;">护理</el-button>
        </ul>
        <div v-if="flag">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!---------------- 全部  --------------->
                <el-tab-pane label="全部" name="firs">
                    <div class="header">
                        <slideSearch :options="options" :style="{ height: height }">
                            <div slot="btnBar">
                                <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getData">查询
                                </el-button>
                            </div>

                            <div class="right">
                                <div class="titmed">
                                    <span class="color-block-default" /> 已入住：{{ checkedIn }}

                                    <span class="color-block-free" /> 空闲：{{ free }}
                                    <span /> 入住率：{{ occupancy }}%
                                </div>
                                <!--房间-->
                                <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextMenu">
                                    <li v-if="showCheck" @click="customerRoom()">发起住院</li>

                                    <li v-if="showOther" @click="exchange">换床</li>
                                    <li v-if="hospitalList[0].inpatientStatus == 1" @click="changeHourse">申请出院</li>
                                    <li v-if="hospitalList[0].inpatientStatus == 2" @click="changeHourses">提交出院</li>
                                </ul>
                                <div style="margin: 0 10px">
                                    <el-card v-for="(item, index) in roomlist" :key="index" :class="roomCardClass(item)">
                                        <div slot="header" :class="headerClass(item)"
                                            @contextmenu.prevent="openMenu($event, item)">
                                            <div class="header">
                                                <div class="room" @click="information($event, item)">
                                                    <div class="header">
                                                        <div style="width: 20%;">
                                                            <img v-if="item.checkStatus === '2'"
                                                                src="../../assets/images/room1.png" width="18" height="19">

                                                            <img v-if="item.checkStatus === '0' || item.checkStatus === '1'"
                                                                src="../../assets/images/room3.png" width="17" height="18">
                                                        </div>
                                                        <div style="width: 76%; padding-top: 2px">
                                                            {{ item.roomType }}&nbsp;{{ item.roomNumber }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="item.checkStatus === '2'" class="horn">
                                                    <div class="ticks">
                                                        <img class="imgtick" src="../../assets/images/tick.png" width="18"
                                                            height="19">
                                                    </div>
                                                </div>

                                                <div v-if="item.checkStatus === '0' || item.checkStatus === '1'"
                                                    class="nothorn">
                                                    <div class="ticks">

                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="item.checkStatus === '2'" class="header mation">
                                                <div style="margin-left: 15px">
                                                    <p class="titme"> <span
                                                            style="width: 13px;height: 13px;display: inline-block;">
                                                            <img src="@/assets/images/user.png" alt=""
                                                                style="margin-top: 2px;">
                                                        </span> &nbsp;{{ item.customerName }}</p>
                                                    <div class="header" style="position:relative">
                                                        <div style="width: 20%"><img src="../../assets/images/surface2.png"
                                                                width="14" height="15"></div>
                                                        <div
                                                            style="font-size: 12px;color: #ffffff; margin-top: 0px;position: absolute;margin-left: 15px;">
                                                            &nbsp;{{ item.customAge }}岁</div>
                                                    </div>
                                                </div>
                                                <div style="margin-right: 15px">
                                                    <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation)
                                                    }}</p>

                                                </div>
                                            </div>
                                            <div v-if="item.checkStatus === '1'" class="header mation">
                                                <div style="margin-left: 15px">
                                                    <p class="titme"><i class="el-icon-user-solid" />&nbsp;{{
                                                        item.customerName }}</p>
                                                    <div class="header" style="position:relative">
                                                        <div style="width: 20%"><img src="../../assets/images/surface2.png"
                                                                width="14" height="15"></div>
                                                        <div
                                                            style="font-size: 12px;color: #ffffff; margin-top: 2px; position: absolute;margin-left: 15px;">
                                                            &nbsp;{{ item.customAge }}岁</div>
                                                    </div>
                                                </div>
                                                <div style="margin-right: 15px">
                                                    <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation)
                                                    }}</p>
                                                    <p class="titme">&nbsp;</p>
                                                </div>
                                            </div>
                                            <div v-if="item.checkStatus === '0'" class="header mation">
                                                <div style="margin-left: 15px">
                                                    <p class="titme"><span
                                                            style="width: 13px;height: 13px;display: inline-block;">
                                                            <img src="@/assets/images/user.png" alt=""
                                                                style="margin-top: 2px;">
                                                        </span>&nbsp;__________</p>
                                                    <div class="header" style="position:relative">
                                                        <div style="width: 20%"><img src="../../assets/images/surface2.png"
                                                                width="14" height="15"></div>
                                                        <div
                                                            style="font-size: 12px;color: #ffffff; margin-top: 2px; position: absolute;margin-left: 15px;">
                                                            __________</div>
                                                    </div>
                                                </div>
                                                <div style="margin-right: 15px">
                                                    <p class="titme" style="margin-left: 25px">民族：__________</p>

                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="item.checkStatus === '2'" class="header">
                                            <div class="statrs">

                                                <p class="titme line" style="color: #333333">床位号：{{ item.bedNumber }}
                                                </p>
                                                <p class="titme line" style="color: #333333">状态：{{
                                                    roomStatus(item.checkStatus) }}</p>

                                                <p class="titme line" style="color: #333333">
                                                    类型：住院中
                                                </p>
                                            </div>
                                            <div class="statrs">

                                                <p class="titme line" style="color: #333333">医生：{{
                                                    item.maternityMatronName }}</p>

                                                <p class="titme line" style="color: #333333">责任护士：{{ item.nurseName
                                                }}</p>

                                                <p class="titme line" style="color: #333333">住院押金：{{
                                                    item.deposit }}</p>
                                            </div>
                                        </div>
                                        <div v-if="item.checkStatus === '1'" class="header">
                                            <div class="statrs">

                                            </div>
                                            <div class="statrs">
                                                <p class="titme notLine" style="color: #333333">医生：</p>
                                                <p class="titme notLine" style="color: #333333">责任护士：</p>
                                                <p class="titme notLine" style="color: #333333">产康师：</p>
                                            </div>
                                        </div>
                                        <div v-if="item.checkStatus === '0'" class="header">
                                            <div class="statrs">
                                                <p class="titme notLine" style="color: #333333">床位号：{{ item.bedNumber }}</p>
                                                <p class="titme notLine" style="color: #333333">状态：</p>
                                                <p class="titme notLine" style="color: #333333">类型：</p>
                                            </div>
                                            <div class="statrs">
                                                <p class="titme notLine" style="color: #333333">医生：</p>
                                                <p class="titme notLine" style="color: #333333">责任护士：</p>
                                                <p class="titme notLine" style="color: #333333">住院押金：</p>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                            </div>
                        </slideSearch>
                    </div>
                </el-tab-pane>
                <!------------------楼层--------------------->
                <el-tab-pane v-for="item in list" :key="item.floorId" :label="item.floorNumber"
                    :name="'room' + item.floorId">
                    <div class="header">
                        <slideSearch :options="options" :style="{ height: height }">
                            <div slot="btnBar">
                                <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getData">查询
                                </el-button>
                            </div>
                            <div class="right">
                                <div class="titmed">
                                    <span class="color-block-default" /> 已入住：{{ checkedIn }}
                                    <!--<span class="color-block-success" /> 已预约：{{ appointment }}-->
                                    <span class="color-block-free" /> 空闲：{{ free }}
                                    <span /> 入住率：{{ occupancy }}%
                                </div>
                                <!--房间-->
                                <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextMenu">
                                    <li v-if="showCheck" @click="customerRoom()">发起住院</li>
                                    <!-- <li v-if="showOther" @click="swipeCard()">划卡</li> -->
                                    <!--<li v-if="showOther" @click="continued()">续住</li>-->
                                    <!--<li v-if="showOther" @click="exchangeHouses()">换房</li>-->
                                    <!-- <li v-if="showOther" @click="pauseDeduction()">暂停划扣</li>
                                    <li v-if="showOther" @click="checkOut()">{{ roomForm.checkStatus === '1' ? '退预约' : '退房'
                                    }}</li> -->
                                    <li v-if="showOther" @click="exchange">换床</li>
                                    <li v-if="hospitalList[0].inpatientStatus == 1" @click="changeHourse">申请出院</li>
                                    <li v-if="hospitalList[0].inpatientStatus == 2" @click="changeHourses">提交出院</li>

                                </ul>
                                <div style="margin: 0 10px">
                                    <el-card v-for="(item, index) in roomlist" :key="index" :class="roomCardClass(item)">
                                        <div slot="header" :class="headerClass(item)"
                                            @contextmenu.prevent="openMenu($event, item)">
                                            <div class="header">
                                                <div class="room" @click="information($event, item)">
                                                    <div class="header">
                                                        <div style="width: 20%;">
                                                            <img v-if="item.checkStatus === '2'"
                                                                src="../../assets/images/room1.png" width="18" height="19">
                                                            <!--                            <img v-if="item.checkStatus === '1'" src="../../../assets/images/room2.png" width="18" height="19">-->
                                                            <img v-if="item.checkStatus === '0' || item.checkStatus === '1'"
                                                                src="../../assets/images/room3.png" width="17" height="18">
                                                        </div>
                                                        <div style="width: 76%; padding-top: 2px">
                                                            {{ item.roomType }}&nbsp;{{ item.roomNumber }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="item.checkStatus === '2'" class="horn">
                                                    <div class="ticks">
                                                        <img class="imgtick" src="../../assets/images/tick.png" width="18"
                                                            height="19">
                                                    </div>
                                                </div>

                                                <div v-if="item.checkStatus === '0' || item.checkStatus === '1'"
                                                    class="nothorn">
                                                    <div class="ticks">

                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="item.checkStatus === '2'" class="header mation">
                                                <div style="margin-left: 15px">
                                                    <p class="titme"> <span
                                                            style="width: 13px;height: 13px;display: inline-block;">
                                                            <img src="@/assets/images/user.png" alt=""
                                                                style="margin-top: 2px;">
                                                        </span> &nbsp;{{ item.customerName }}</p>
                                                    <div class="header" style="position:relative">
                                                        <div style="width: 20%"><img src="../../assets/images/surface2.png"
                                                                width="14" height="15"></div>
                                                        <div
                                                            style="font-size: 12px;color: #ffffff; margin-top: 2px;position: absolute;margin-left: 15px;">
                                                            &nbsp;{{ item.customAge }}岁</div>
                                                    </div>
                                                </div>
                                                <div style="margin-right: 15px">
                                                    <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation)
                                                    }}</p>

                                                </div>
                                            </div>
                                            <div v-if="item.checkStatus === '1'" class="header mation">
                                                <div style="margin-left: 15px">
                                                    <p class="titme"><i class="el-icon-user-solid" />&nbsp;{{
                                                        item.customerName }}</p>
                                                    <div class="header">
                                                        <div style="width: 20%"><img src="../../assets/images/surface2.png"
                                                                width="14" height="15"></div>
                                                        <div
                                                            style="font-size: 12px;color: #ffffff; margin-top: 2px; margin-left: -20px">
                                                            &nbsp;{{ item.customAge }}岁</div>
                                                    </div>
                                                </div>
                                                <div style="margin-right: 15px">
                                                    <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation)
                                                    }}</p>
                                                    <p class="titme">&nbsp;</p>
                                                </div>
                                            </div>
                                            <div v-if="item.checkStatus === '0'" class="header mation">
                                                <div style="margin-left: 15px">
                                                    <p class="titme"><span
                                                            style="width: 13px;height: 13px;display: inline-block;">
                                                            <img src="@/assets/images/user.png" alt=""
                                                                style="margin-top: 2px;">
                                                        </span>&nbsp;__________</p>
                                                    <div class="header">
                                                        <div style="width: 20%"><img src="../../assets/images/surface2.png"
                                                                width="14" height="15"></div>
                                                        <div
                                                            style="font-size: 12px;color: #ffffff; margin-top: 2px; margin-left: -20px">
                                                            __________</div>
                                                    </div>
                                                </div>
                                                <div style="margin-right: 15px">
                                                    <p class="titme" style="margin-left: 25px">民族：__________</p>

                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="item.checkStatus === '2'" class="header">
                                            <div class="statrs">

                                                <p class="titme line" style="color: #333333">床位号：{{ item.bedNumber }}
                                                </p>
                                                <p class="titme line" style="color: #333333">状态：{{
                                                    roomStatus(item.checkStatus) }}</p>

                                                <p class="titme line" style="color: #333333">
                                                    类型：住院中
                                                </p>
                                            </div>
                                            <div class="statrs">

                                                <p class="titme line" style="color: #333333">医生：{{
                                                    item.maternityMatronName }}</p>

                                                <p class="titme line" style="color: #333333">责任护士：{{ item.nurseName
                                                }}</p>

                                                <p class="titme line" style="color: #333333">住院押金：{{
                                                    item.deposit }}</p>
                                            </div>
                                        </div>
                                        <div v-if="item.checkStatus === '1'" class="header">
                                            <div class="statrs">

                                            </div>
                                            <div class="statrs">
                                                <p class="titme notLine" style="color: #333333">医生：</p>
                                                <p class="titme notLine" style="color: #333333">责任护士：</p>
                                                <p class="titme notLine" style="color: #333333">产康师：</p>
                                            </div>
                                        </div>
                                        <div v-if="item.checkStatus === '0'" class="header">
                                            <div class="statrs">
                                                <p class="titme notLine" style="color: #333333">床位号：{{ item.bedNumber }}</p>
                                                <p class="titme notLine" style="color: #333333">状态：</p>
                                                <p class="titme notLine" style="color: #333333">类型：</p>
                                            </div>
                                            <div class="statrs">
                                                <p class="titme notLine" style="color: #333333">医生：</p>
                                                <p class="titme notLine" style="color: #333333">责任护士：</p>
                                                <p class="titme notLine" style="color: #333333">住院押金：</p>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                            </div>
                        </slideSearch>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <!--弹框-->
            <sgDialog title="顾客详细信息" size="560px" :dialog="dialogVisible" @handleClose="closeDialog">
                <div slot="out">
                    <el-form ref="form" :model="form" size="mini" label-width="120px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="姓名：">
                                    <span
                                        style="width: 140px; white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;">{{
                                            form.customerName }}</span>
                                </el-form-item>
                                <el-form-item label="民族：">
                                    <span style="width: 140px;">{{ nationName(form.nation) }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="年龄：">
                                    <span style="width: 140px;">{{ form.customAge }}岁</span>
                                </el-form-item>
                                <el-form-item label="预约/入住时间：">
                                    <span style="width: 140px;">{{ form.checkTime }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="饮食禁忌：">
                                    <span style="width: 400px;">{{ form.tabooRemarks === undefined ? '' : form.tabooRemarks
                                    }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </sgDialog>
            <sgDialog title="顾客入住" size="85%" out-top="2%" :dialog="showDialog" @handleClose="closeRoomDialog">
                <div slot="out">
                    <el-row>
                        <el-col :span="14">
                            <el-button size="mini" :class="{ bg: time == 3 }" @click="Arrived(0)"
                                style="visibility: hidden;">已预约顾客入住</el-button>
                            <el-button size="mini" :class="{ bg: increase == 4 }" @click="notArrived(1)"
                                style="visibility: hidden;">未预约顾客入住</el-button>
                            <el-card :class="{ active: number == 1 }" style="height: 707px">
                                <sg-table ref="tablecome" :sg-ref="'multipleTable'" :table-data="customerData"
                                    :pagination="pagination" :columns="columns" index="序号" selection size="mini"
                                    max-height="606" @size-change="sizeChange" @current-change="change"
                                    @row-click="rowClicks" @selection-change="handleSelectionChange">
                                    <div slot="searchBar">
                                        <el-form ref="searchForm" :model="searchBar" size="mini">
                                            <el-row>
                                                <el-col :span="5">
                                                    <el-form-item label="姓名" prop="customerName" label-width="45px">
                                                        <el-input v-model="searchBar.customerName" clearable
                                                            placeholder="请输入姓名" style="width: 100%" />
                                                    </el-form-item>
                                                </el-col>

                                                <el-col :span="2" style="margin-left: 20px">
                                                    <el-form-item>
                                                        <el-button icon="el-icon-search" size="mini" type="primary"
                                                            :disabled="btnDisabled"
                                                            @click.stop="getCustomerInfo()">搜索</el-button>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </div>
                                </sg-table>
                            </el-card>
                            <el-card :class="{ active: number == 0 }" style="height: 707px">
                                <sg-table ref="table" :sg-ref="'multipleTable'" :table-data="customerDatas"
                                    :pagination="pagination" :columns="columnss" index="序号" selection size="mini"
                                    max-height="606" @size-change="sizeChange" @current-change="change"
                                    @row-click="rowClick" @selection-change="handleSelectionChange">
                                    <div slot="searchBar">
                                        <el-form ref="searchForm" :model="formNot" size="mini">
                                            <el-row>
                                                <el-col :span="5">
                                                    <el-form-item label="姓名" prop="customerName" label-width="45px">
                                                        <el-input v-model="formNot.customerName" clearable
                                                            placeholder="请输入姓名" style="width: 100%" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-form-item label="电话" prop="customPhone" label-width="45px">
                                                        <el-input v-model="formNot.customPhone" clearable
                                                            placeholder="请输入电话" style="width: 100%" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-form-item label="现场咨询" prop="aestheticConsultant"
                                                        label-width="80px">
                                                        <el-select filterable v-model="formNot.aestheticConsultant"
                                                            clearable label-width="45px" placeholder="请选择现场咨询">
                                                            <el-option v-for="item in sysUserList" :key="item.value"
                                                                :label="item.label" :value="item.value" />
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="2" style="margin-left: 20px">
                                                    <el-form-item>
                                                        <el-button icon="el-icon-search" size="mini" type="primary"
                                                            :disabled="btnDisabled"
                                                            @click.stop="notgetCustomerInfo()">搜索</el-button>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </div>
                                </sg-table>
                            </el-card>
                        </el-col>
                        <el-col :span="10" style="padding-left: 20px">
                            <el-card style="height: 735px">
                                <el-form ref="roomForm" :model="roomForm" :rules="roomFormRules" size="mini"
                                    label-width="110px">
                                    <span style="font-size: 15px; font-weight: 600; padding-left: 20px">床位信息</span>
                                    <el-row style="margin-top: 20px">

                                        <el-col :span="12">
                                            <el-form-item label="房间类型">
                                                <el-input v-model="roomForm.roomType" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="房间编号">
                                                <el-input v-model="roomForm.roomNumber" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>

                                        <el-col :span="12">
                                            <el-form-item label="房间名称">
                                                <el-input v-model="roomNames" disabled size="mini" style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="床位号">
                                                <el-input v-model="roomForm.roomName" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <span style="font-size: 15px; font-weight: 600; padding-left: 20px">
                                        客户信息
                                        <span style="font-size: 14px;font-weight: 400;color: #1fa087">(点击左侧客户选择)</span>
                                    </span>
                                    <el-row style="margin-top: 20px">
                                        <el-col :span="12">
                                            <el-form-item label="姓名" prop="customerName">
                                                <el-input v-model="roomForm.customerName" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>

                                    </el-row>
                                    <el-row>

                                    </el-row>
                                    <el-row v-show="roomForm.roomReservationId !== undefined">
                                        <el-col :span="12">
                                            <el-form-item label="预计入住时间" prop="checkReservationTime">
                                                <el-input v-model="roomForm.checkReservationTime" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>

                                    </el-row>
                                    <span style="font-size: 15px; font-weight: 600; padding-left: 20px">入住信息</span>
                                    <el-row style="margin-top: 20px;overflow: hidden;">
                                        <div style="">
                                            <el-col :span="12">
                                                <el-form-item label="责任医生" prop="aestheticConsultant"
                                                    style="overflow: hidden;">
                                                    <el-select filterable v-model="roomForm.aestheticConsultant"
                                                        placeholder="请选择" style="width: 100%"
                                                        @change="aestheticConsultantList" clearable>
                                                        <el-option v-for="item in zerendoctor" :key="item.userId"
                                                            :label="item.nickName" :value="item.userId" />
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </div>
                                        <el-col :span="12">
                                            <el-form-item label="责任护士" prop="nurse" style="overflow: hidden;">
                                                <el-select filterable v-model="roomForm.nurse" placeholder="请选择"
                                                    style="width: 100%" @change="nurseList" clearable>
                                                    <el-option v-for="item in zerennurse" :key="item.value"
                                                        :label="item.label" :value="item.value" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>

                                    </el-row>
                                    <el-row>
                                        <el-col :span="15">
                                            <el-form-item label="入住时间" prop="checkReservationTime">
                                                <el-date-picker v-model="roomForm.checkReservationTime"
                                                    format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="date"
                                                    placeholder="选择日期" style="width:200px" />
                                            </el-form-item>
                                        </el-col>

                                    </el-row>
                                    <el-row>

                                    </el-row>
                                    <el-row>

                                    </el-row>
                                    <el-form-item style="position:absolute;bottom: 0;right: 30px;">
                                        <el-button type="primary" :loading="loadingSubmit" @click.stop="submitRoomForm"
                                            size="mini">确定</el-button>

                                        <el-button @click="closeRoomDialog" size="mini">取消</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </sgDialog>
            <sgDialog title="顾客换床" size="85%" out-top="2%" :dialog="showChangeDialog" @handleClose="closeChangeDialog">
                <div slot="out">
                    <el-row>
                        <el-col :span="14">
                            <el-card style="height: 735px">
                                <sg-table ref="changeTable" :sg-ref="'multipleTable'" :table-data="roomData"
                                    :pagination="roomPagination" :columns="roomColumns" index="序号" selection size="mini"
                                    max-height="650" @size-change="changeSizeChange" @current-change="changeCurrentChange"
                                    @row-click="changeRowClick" @selection-change="handleChangeSelectionChange">
                                    <div slot="searchBar">
                                        <el-form ref="changeRoom" :model="changeRoom" :inline="true" size="mini"
                                            :show-message="false">

                                            <el-form-item label="房间类型" prop="roomTypeId">
                                                <el-select filterable v-model="changeRoom.roomTypeId" clearable
                                                    placeholder="请选择房间类型">
                                                    <el-option v-for="item in roomTypeList" :key="item.roomTypeId"
                                                        :label="item.label" :value="item.value" />
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-button icon="el-icon-search" type="primary" :disabled="btnDisabled"
                                                    @click.stop="getRoomList()">搜索</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </sg-table>
                            </el-card>
                        </el-col>
                        <el-col :span="10" style="padding-left: 20px">
                            <el-card style="height: 735px">
                                <el-form ref="roomForm" :model="changeForm" :rules="changeFormRules" size="mini"
                                    label-width="110px">
                                    <span style="font-size: 15px; font-weight: 600; padding-left: 20px">
                                        客户信息
                                    </span>
                                    <el-row style="margin-top: 20px">
                                        <el-col :span="12">
                                            <el-form-item label="姓名" prop="customerName">
                                                <el-input v-model="changeForm.customerName" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="电话" prop="customPhone">
                                                <el-input v-model="changeForm.customPhone" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="卡号" prop="customCardNumber">
                                                <el-input v-model="changeForm.customCardNumber" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="年龄" prop="customAge">
                                                <el-input v-model="changeForm.customAge" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="当前入住床位号" prop="oldRoomName">
                                                <el-input v-model="changeForm.oldRoomName" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="房间类型" prop="roomDays">
                                                <el-input v-model="hospitalList[0].roomType" disabled size="mini"
                                                    style="width: 100%" />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row style="margin-top: 20px">

                                    </el-row>
                                    <el-row>

                                    </el-row>

                                    <el-form-item>
                                        <div class="notbutt">
                                            <div class="butt">
                                                <el-button type="primary" :loading="loadingSubmit"
                                                    @click.stop="submitChangeForm" size="mini">确定</el-button>
                                                <el-button @click="closeChangeDialog" size="mini">取消</el-button>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </sgDialog>
        </div>
        <div v-else>
            <div class="nurse_top" style="position: relative;">
                <div style="position: absolute;right: 0;">
                    <el-button type="primary" plain size="mini" @click="proofread"
                        style="height: 25px;line-height: 10px;">校对</el-button>
                    <el-button type="warning" plain size="mini" @click="duplicate()"
                        style="height: 25px;line-height: 10px;">抄送</el-button>
                    <el-button type="primary" plain size="mini" @click="detection()" class="detection"
                        style="height: 25px;line-height: 10px;">执行</el-button>
                    <el-button type="danger" plain size="mini" @click="advice()"
                        style="height: 25px;line-height: 10px;">医嘱停止</el-button>
                    <el-button type="primary" plain size="mini" @click="print()"
                        style="height: 25px;line-height: 10px;">护理打印</el-button>
                    <el-button type="primary" plain size="mini" @click="pharmacy()"
                        style="height: 25px;line-height: 10px;">药房配药查询</el-button>
                </div>
            </div>

            <div class="nurse_contain" style="">
                <div class="nurse_left">
                    <div class="nurse_search">
                        <label for="">检索：</label>
                        <el-input placeholder="请输入姓名" size="mini" style="width: 160px" v-model="Name"></el-input>
                        <el-button size="mini" style="width:75px;height: 30px;margin-left: 10px;" icon="el-icon-search"
                            type="primary" plain @click="search_left">搜索</el-button>
                    </div>
                    <div>患者列表</div>
                    <div class="patient_list">
                        <div style="width: 300px;">
                            <el-table :data="Nurse_left" stripe :row-style="{ height: '0' }"
                                :cell-style="{ padding: '3px' }"
                                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                                :span-method="arraySpanMethod" @row-click='selechColum' :height="heightnurse"
                                highlight-current-row ref="tablelistnurse">
                                <el-table-column prop="bedNumber" label="床号" width="100" align="center">
                                </el-table-column>
                                <el-table-column prop="customerName" label="姓名" width="100" align="center">

                                </el-table-column>
                                <el-table-column prop="wardNo" label="病区" width="100" align="center"> </el-table-column>

                            </el-table>
                        </div>
                    </div>
                </div>
                <!-- //右边模块 -->
                <div class="nurse_right">
                    <div class="nurse_right_top" style="background-color: antiquewhite;">
                        <div style="height: 10px;"></div>
                        <div style="display: flex;">
                            <div class="topContain"> 姓名：{{ customerNameList.customerName }}</div>
                            <div class="topContain"> 性别(年龄)：{{ customerNameList.customAge }}</div>
                            <div class="topContain"> 可用押金：<span>{{ customerNameList.residualDeposit }}</span></div>
                            <div class="topContain"> 病区床位：<span>{{ customerNameList.bedNumber }}</span></div>
                            <div style="margin-left: 10px;">住院天数：<span>{{ customerNameList.dayNum }}天</span></div>
                        </div>
                        <div style="height: 10px;"></div>
                        <div style="display: flex;">
                            <div class="topContain"> 科室：<span>{{ customerNameList.departmentName }}</span></div>
                            <div class="topContain"> 主治医生：<span>{{ customerNameList.doctorName }}</span></div>
                            <div class="topContain"> 护士：<span>{{ customerNameList.nursingPersonnel }}</span></div>
                            <div class="topContain" style="width: 220px;">入院时间：<span>{{ customerNameList.hospitalTime
                            }}</span></div>
                            <div class="topContain" style="width: 300px;"> 备注：<span>{{ customerNameList.remark }}</span>
                            </div>





                        </div>

                    </div>
                    <div class="nurse_right_center" style="margin-top: 5px;display:flex;align-items:center">
                        <div style="" class="leftbutton" v-for="(item, index) in rightbutton"
                            :style="{ background: item.back, color: item.color }" @click="listcolor(index)">
                            {{ item.name }}
                        </div>
                        <!-- <el-button type="primary" plain size="mini" @click="newadvices()">医嘱记录</el-button>
                        <el-button type="primary" plain size="mini" @click="newrecord()">记录查询</el-button>
                        <el-button type="primary" plain size="mini" @click="pricecost()">费用记录</el-button> -->
                        <span
                            style="width: 10px;height: 10px;background: #c6f9c3;display: inline-block;margin-left: 20px;"></span>提交
                        <span
                            style="width: 10px;height: 10px;background-color:rgb(193,210,240) ;display: inline-block;margin-left: 20px;"></span>校对

                        <span
                            style="width: 10px;height: 10px;background-color:#a899e6;display: inline-block;margin-left: 20px;"></span>待停止
                        <span
                            style="width: 10px;height: 10px;background-color:lightpink ;display: inline-block;margin-left: 20px;"></span>已停止
                        <span
                            style="width: 10px;height: 10px;background-color:#d19fe8 ;display: inline-block;margin-left: 20px;"></span>作废
                        <span
                            style="width: 10px;height: 10px;background-color:#eee ;display: inline-block;margin-left: 20px;"></span>已完成
                        <span
                            style="width: 10px;height: 10px;background-color:#a3e3ed ;display: inline-block;margin-left: 20px;"></span>已抄送

                    </div>
                    <!-- 医嘱记录 -->
                    <div v-if="advices">
                        <div style="margin-top: 5px;">
                            <span>开立时间：</span>
                            <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" size="mini">
                            </el-date-picker>
                            &nbsp;&nbsp;
                            <el-radio v-model="radio" label="">全部</el-radio>
                            <el-radio v-model="radio" label="0">长期</el-radio>
                            <el-radio v-model="radio" label="1">临时</el-radio>
                            <span>状态:</span>&nbsp;&nbsp;
                            <el-select v-model="value" placeholder="请选择" size="mini" @change="stateChange" clearable
                                filterable>
                                <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            &nbsp;&nbsp;<span>类别:</span>&nbsp;&nbsp;
                            <el-select v-model="valueType" placeholder="请选择" size="mini" @change="TypeChange" clearable
                                filterable >
                                <el-option v-for="item in Type" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="patient_list_right">
                            <div style="width: 100%;">
                                <el-table :data="listGroup" :cell-style="{ padding: '4.5px' }" :row-key="handles" border
                                    :row-class-name="tableRowClassName" @row-click='newselechColum' height="300"
                                    highlight-current-row ref="listGroup">
                                    <el-table-column type="index" width="50" align="center">
                                    </el-table-column>
                                    <el-table-column prop="executingState" label="状态" width="100" align="center">

                                    </el-table-column>
                                    <el-table-column prop="periodicType" label="期效" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.periodicType == '0' || scope.row.periodicType ==
                                                    '3' || scope.row.periodicType == '长期' ? '长期' : "临时" }}
                                            </div>
                                        </template>

                                    </el-table-column>
                                    <el-table-column prop="customerName" label="姓名" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                <a @click="customerclick(scope.row.id, scope.row)">{{ scope.row.customerName
                                                }}</a>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="开始时间" width="180" align="center">
                                    </el-table-column>
                                    <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
                                    </el-table-column>
                                    <el-table-column prop="materialSpec" label="规格" width="150" align="center">
                                    </el-table-column>
                                    <el-table-column prop="amount" label="总量" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="dosage" label="剂量" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="doseUnit" label="单位" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="unit" label="用药单位" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ methodsUnit(scope.row.unit) }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="frequency" label="频次" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="usageWay" label="用法" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    scope.row.usageWay == '1' ? '口服-外用' : scope.row.usageWay == '2' ? '水煎内服' :
                                                    scope.row.usageWay == '3' ? '皮试' : ""
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="dropVelocity" label="滴速" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="unitPrice" label="单价" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="totalPrice" label="金额" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="doctorName" label="医嘱医生" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="proofreaderName" label="校对人" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="proofreaderTime" label="校对时间" width="180" align="center">
                                    </el-table-column>
                                    <el-table-column prop="applyStopTime" label="申请停止时间" width="180" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ messgaesl(scope.row.applyStopTime) }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="applyStopName" label="申请停止人" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="stopTime" label="停止时间" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ messgaesl(scope.row.applyStopTime) }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="stopName" label="停止人" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="source" label="来源" width="100" align="center">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <div class="nurse_right_center" style="margin-top:10px">
                            <div style="" class="leftbutton" v-for="(item, index) in bottombutton"
                                :style="{ background: item.back, color: item.color }" @click="listcolorbutton(index)">
                                {{ item.name }}
                            </div>
                            <!-- <el-button type="primary" plain size="mini" @click="prices">计价内容</el-button>
                            <el-button type="primary" plain size="mini" @click="proofreadAll()">抄送记录</el-button>
                            <el-button type="primary" plain size="mini" @click="listEnforcementAll()">执行记录</el-button>
                            <el-button type="primary" plain size="mini" @click="doctorAdvice">医嘱计价</el-button>
                            <el-button type="primary" plain size="mini" @click="Save()">保存</el-button> -->
                        </div>
                        <br>



                        <div class="patient_list_right_bottom" v-if="listPricingContent" style="width: 1020px;">
                            <div style="width: 1020px;">
                                <el-table ref="tablelistmenu" :data="priceContain" stripe :row-style="{ height: '0' }"
                                    :cell-style="{ padding: '3px' }"
                                    :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :key="isUpdata"
                                    highlight-current-row>
                                    <el-table-column prop="source" label="增加计价" width="100" align="center">
                                        <template slot-scope="props">
                                            <el-button type="text" size="mini" style="width: 80px;" @click="addPrice"
                                                v-if="props.row.flag">增加计价</el-button></template>
                                    </el-table-column>
                                    <el-table-column prop="source" label="来源" width="90" align="center">
                                        <template>护士计价</template>
                                    </el-table-column>

                                    <el-table-column prop="itemName" label="名称" width="230" align="center">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.itemName" placeholder="请选择"
                                                @change="changePriceList($event, scope.row)" filterable size="mini"
                                                :disabled="scope.row.Isselect">
                                                <el-option v-for="item in newPriceoptions" :key="item.value"
                                                    :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="materialSpec" label="规格" width="90" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.specs == undefined ? scope.row.materialSpec : scope.row.specs
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="amount" label="数量" width="150" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-input-number size="mini" v-model="scope.row.amount" placeholder="请输入数量"
                                                    @input="changeInput($event, scope.row)"
                                                    :disabled="scope.row.Isselect"></el-input-number>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="doseUnit" label="单位" width="100"
                                        align="center"></el-table-column>
                                    <el-table-column prop="unitPrice" label="单价" width="100"
                                        align="center"></el-table-column>
                                    <el-table-column prop="totalPrice" label="金额" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ (scope.row.amount) * (scope.row.unitPrice) }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="doseUnit" label="操作" width="50" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="text" style="color:red" v-if="scope.row.Isselectol"
                                                @click="reduceclick(scope.row)">
                                                <img src="@/assets/images/deltel.png" style="width:20px;height:20px" />
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                        </div>
                        <!-- 抄送记录 -->
                        <div class="patient_list_right_bottom" v-if="listByGroupNum" style="width:860px ;">
                            <div style="width:860px">
                                <el-table :data="newlistByGroupNum" stripe :row-style="{ height: '0' }"
                                    :cell-style="{ padding: '3px' }"
                                    :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                                    <el-table-column type="selection" width="55" align="center">
                                    </el-table-column>
                                    <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
                                    </el-table-column>

                                    <el-table-column prop="copyPersonName" label="抄送人" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="copyPersonTime" label="抄送时间" width="200" align="center">
                                    </el-table-column>
                                    <el-table-column prop="executorName" label="执行人" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="executorTime" label="执行时间" width="200" align="center">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 执行记录 -->
                        <div class="patient_list_right_bottom" v-if="listEnforcement" style="width:100%">
                            <div style="width:100%">
                                <el-table :data="newlistEnforcement" stripe :row-style="{ height: '0' }"
                                    :cell-style="{ padding: '3px' }" height="220"
                                    :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                                    <el-table-column prop="periodicType" label="期效" width="100" align="center">
                                        <template slot-scope="scope">
                                            {{ scope.row.periodicType == '0' ? '长期' : "临时" }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="startTime" label="开始时间" width="200" align="center">
                                    </el-table-column>
                                    <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
                                    </el-table-column>
                                    <el-table-column prop="materialSpec" label="规格" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="amount" label="总量" width="150" align="center">
                                    </el-table-column>
                                    <el-table-column prop="doseUnit" label="单位" width="140" align="center">
                                    </el-table-column>

                                    <el-table-column prop="executorName" label="执行人" width="200" align="center">
                                    </el-table-column>
                                    <el-table-column prop="executorTime" label="执行时间" width="200" align="center">
                                    </el-table-column>

                                    <el-table-column prop="frequency" label="频次" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="usageWay" label="用法" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    scope.row.usageWay == '1' ? '口服-外用' : scope.row.usageWay == '2' ? '水煎内服' :
                                                    scope.row.usageWay == '3' ? '皮试' : ""
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="source" label="来源" width="100" align="center">
                                    </el-table-column>
                                </el-table>

                            </div>
                        </div>
                    </div>
                    <!-- 医嘱记录 -->
                    <!-- 记录查询 -->
                    <div v-if="record">
                        <div style="margin-top:10px ;">
                            <span>医嘱内容:</span>&nbsp;&nbsp;<el-input size="mini" style="width: 100px;"
                                v-model="newitemName"></el-input>
                            &nbsp;&nbsp;<span>项目类型:</span>&nbsp;&nbsp;
                            <el-select v-model="medicalAdviceType" placeholder="请选择" size="mini" clearable filterable>
                                <el-option v-for="item in project_type" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>

                            &nbsp;&nbsp;<span>扣费类型:</span>&nbsp;&nbsp;
                            <el-select v-model="receiveState" placeholder="请选择" size="mini" clearable filterable>
                                <el-option v-for="item in kfType" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" size="mini" style="margin-left: 20px;"
                                @click="searchRecord">搜索</el-button>
                        </div>
                        <div class="patient_list_right" :style="{ height: recordHeight + 'px' }">
                            <div style="width: 100%">
                                <el-table :data="hospitalCopyRecords" :row-style="{ height: '0' }"
                                    :cell-style="{ padding: '3px' }"
                                    :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :row-key="handle"
                                    :height="recordHeight" :row-class-name="tableRowClassName">
                                    <el-table-column prop="periodicType" label="操作" width="100" align="center">
                                        <template slot-scope="props">
                                            <el-button type="text"
                                                v-if="props.row.dataFlag == '2' && props.row.feeFlag !== '2'"
                                                @click="newcopyRecordId(props.row)">撤销</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="periodicType" label="期效" width="100" align="center">
                                        <template slot-scope="props">
                                            {{ props.row.periodicType }}
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="feeFlag" label="扣费状态" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.feeFlag == '1' ? '已扣费' : scope.row.feeFlag == '0' ? "未扣费" :
                                                    '已撤销'
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- //0医生2护士 -->
                                    <el-table-column prop="source" label="医嘱来源" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.dataFlag == '0' ? "医生录入" : '护士计价' }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="executingState" label="状态" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="itemName" label="医嘱内容" width="200" align="center">
                                    </el-table-column>
                                    <el-table-column prop="lastCopyTime" label="抄送时间" width="180" align="center">
                                    </el-table-column>
                                    <el-table-column prop="billerTime" label="扣费时间" width="180" align="center">
                                    </el-table-column>
                                    <el-table-column prop="executorTime" label="执行时间" width="180" align="center">
                                    </el-table-column>
                                    <el-table-column prop="materialSpec" label="规格" width="150" align="center">
                                    </el-table-column>
                                    <el-table-column prop="amount" label="总量" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="dosage" label="剂量" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="pairNum" label="付数" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="frequency" label="频次" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="usageWay" label="用法" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{
                                                    scope.row.usageWay == '1' ? '口服-外用' : scope.row.usageWay == '2' ? '水煎内服' :
                                                    scope.row.usageWay == '3' ? '皮试' : ""
                                                }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="skinFlag" label="皮试" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="dropVelocity" label="滴速" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="unitPrice" label="单价" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="unitPrice" label="实收" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="totalPrice" label="金额" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="expenseType" label="费用种类" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="startTime" label="开始时间" width="180" align="center">
                                    </el-table-column>
                                    <el-table-column prop="proofreaderName" label="校对人" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="stopName" label="停止人" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="stopTime" label="停止时间" width="100" align="center">
                                    </el-table-column>

                                    <el-table-column prop="urgentFlag" label="退费数" width="100" align="center">
                                    </el-table-column>
                                    <el-table-column prop="useCustomer" label="医嘱对象" width="100" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                {{ scope.row.useCustomer == '0' ? '本人' : '子女' }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="serialNum" label="医保编码" width="180" align="center">
                                    </el-table-column>


                                </el-table>
                            </div>
                        </div>
                    </div>
                    <!-- 记录查询 -->

                    <!-- 费用记录 -->
                    <div v-if="costs" style="margin-top: 5px;">
                        <el-radio v-model="radio_tree" label="0">费用清单</el-radio>
                        <el-radio v-model="radio_tree" label="1">费用汇总</el-radio>
                        <el-radio v-model="radio_tree" label="2">退费记录</el-radio>
                        <div style="display: flex;margin-top: 10px;">
                            <div class="costs_left_tree"
                                :style="{ width: '300px', height: recordHeight + 'px', overflowY: 'scroll' }" v-show="showsalls">
                                <span>分组统计:</span>&nbsp;&nbsp;
                                <el-select v-model="groupType" placeholder="请选择" size="mini" @change="groupTypesChange"
                                    filterable>
                                    <el-option v-for="item in groupTypes" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <br>
                                <br>
                                <el-tree :data="costs_tree" @current-change="handleClicks">

                                </el-tree>
                            </div>
                            <div style="width:1305px ;height: 550px;overflow: scroll;" v-show="showsall" class="kfrq">
                                <div :style="{ 'width': newHeight }">
                                    <el-table :data="fyList" stripe :row-style="{ height: '0' }"
                                        :cell-style="{ padding: '3px' }"
                                        :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :row-key="handle"
                                        :show-summary="true" v-show="shows" :summary-method="getSummaries">
                                        <el-table-column type="index" width="50">
                                        </el-table-column>
                                        <el-table-column prop="pricingTime" label="扣费日期" width="180" align="center">
                                        </el-table-column>
                                        <el-table-column prop="expenseType" label="费用种类" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="itemName" label="项目名称" width="210" align="center">
                                        </el-table-column>
                                        <el-table-column prop="materialSpec" label="规格" width="120" align="center">
                                        </el-table-column>
                                        <el-table-column prop="doseUnit" label="单位" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="amount" label="数量" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="unitPrice" label="单价" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="amountReceivable" label="应收金额" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="amountReceived" label="实收金额" width="100" align="center">
                                        </el-table-column>

                                        <el-table-column prop="operatorName" label="操作员" width="100" align="center">
                                        </el-table-column>



                                    </el-table>
                                    <el-table :data="fyListAll" stripe :row-style="{ height: '0' }"
                                        :cell-style="{ padding: '3px' }"
                                        :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :row-key="handle"
                                        :show-summary="true" v-show="newshows" :summary-method="getSummariesl">
                                        <el-table-column type="index" width="50">
                                        </el-table-column>
                                        <el-table-column prop="expenseType" label="费用种类" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="itemName" label="项目名称" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="materialSpec" label="规格" width="130" align="center">
                                        </el-table-column>
                                        <el-table-column prop="doseUnit" label="单位" width="150" align="center">
                                        </el-table-column>
                                        <el-table-column prop="amount" label="数量" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="unitPrice" label="单价" width="100" align="center">
                                        </el-table-column>
                                        <el-table-column prop="amountReceived" label="应收金额" width="100" align="center">
                                        </el-table-column>

                                        <el-table-column prop="serialNum" label="医保编码" width="100" align="center">
                                        </el-table-column>
                                    </el-table>
                                </div>


                            </div>
                            <div v-show="back">
                                <div style="width:605px ;height: 400px;overflow: scroll;">
                                    <div style="width: 700px;">
                                        <el-table :data="backListAll" stripe :row-style="{ height: '0' }"
                                            :cell-style="{ padding: '3px' }"
                                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                                            :row-key="handle" :show-summary="true">
                                            <el-table-column prop="createTime" label="退费时间" width="100" align="center">
                                            </el-table-column>
                                            <el-table-column prop="itemName" label="项目名称" width="100" align="center">
                                            </el-table-column>
                                            <el-table-column prop="materialSpec" label="规格" width="100" align="center">
                                            </el-table-column>
                                            <el-table-column prop="refundNum" label="退费数量" width="100" align="center">
                                            </el-table-column>
                                            <el-table-column prop="doseUnit" label="单位" width="100" align="center">
                                            </el-table-column>
                                            <el-table-column prop="amountReceived" label="实收金额" width="100" align="center">
                                            </el-table-column>
                                            <el-table-column prop="discountAmount" label="优惠金额" width="100" align="center">
                                            </el-table-column>

                                        </el-table>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- 费用记录 -->


                    <!-- //bottom -->
                </div>
            </div>
        </div>
        <router-view></router-view>

        <sgDialog title="出院申请" size="800px" out-top="2%" :dialog="Apply" @handleClose="closeRoomDialog">
            <div style="width: 100%;height: 600px;" slot="out">

                <el-form :model="ruleForm" :rules="leaverules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="客户信息:" prop="name">
                        <div style="width:100%;">
                            <div style="width: 100%;height: 20px;display: flex;">
                                <div
                                    style="width:100px;height:50px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                    患者：{{ bedRoomList.length == 0 ? '' : bedRoomList.customerName }}</div>
                                <div style="width:100px;height:20px;margin-left:5px ;">年龄：{{ bedRoomList.length == 0 ? '' :
                                    bedRoomList.customAge }}
                                </div>

                                <div style="width:130px;height:20px;">
                                    可用押金：{{ bedRoomList.length == 0 ? '' : bedRoomList.deposit }}</div>
                                <div style="width:100px;height:20px;margin-left: 20px;">住院号：{{ bedRoomList.inHospitalId }}
                                </div>
                                <div style="width:100px;height:20px;margin-left: 30px;">住院诊断：</div>
                            </div>
                            <div style="width: 100%;height: 20px;display: flex;">
                                <div style="width:100px;height:20px;">床位：{{ bedRoomList.length == 0 ? '' :
                                    bedRoomList.bedNumber }}
                                </div>
                                <div style="width:100px;height:20px">科室：{{ bedRoomList.departmentName }}</div>
                                <div style="width:150px;height:20px;margin-left:5px ;">主治医生：{{ bedRoomList.doctorName }}
                                </div>
                                <div style="width:130px;height:20px;margin-left: 50px;">
                                    护理人员：{{ bedRoomList.length == 0 ? '' : bedRoomList.nurseName }}</div>


                            </div>
                            <div style="width:300px;height:20px;margin-left: 0px;">
                                入院时间：{{ bedRoomList.length == 0 ? '' : bedRoomList.hospitalTime }}</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="诊断列表:" prop="">
                        <el-button size="mini" type="primary" @click="adddischarges"
                            style="height: 30px;">增加诊断内容</el-button>

                    </el-form-item>

                    <el-form-item label="" prop="">
                        <div style="width: 500px;height: 150px;overflow-y: scroll;" class="abc">
                            <el-table :data="discharges" stripe :row-style="{ height: '0' }"
                                :cell-style="{ padding: '3px' }"
                                :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :row-key="handle">
                                <el-table-column type="index" width="50">
                                </el-table-column>
                                <el-table-column prop="discharge" label="出院诊断" width="190" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.diagnosisResult" placeholder="请输入诊断结果" size="mini">

                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Result" label="治疗结果" width="250" align="center">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.cureResult" placeholder="请选择治疗结果" size="mini"
                                            filterable>
                                            <el-option v-for="item in condition" :key="item.value" :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>
                    <el-form-item label="出院信息：" prop="" style="height: 20px;">
                    </el-form-item>
                    <div style="display: flex;">
                        <span style="color:red;position: absolute;margin-left: 10px;margin-top: 12px;">*</span>
                        <el-form-item label="出院时间：" prop="">

                            <el-date-picker v-model="cytime" type="date" placeholder="选择日期" size="mini"
                                style="width:200px;">
                            </el-date-picker>
                        </el-form-item>
                        <span style="color:red;position: absolute;margin-left: 350px;margin-top: 12px;"> *</span>
                        <el-form-item label="出院情况：" prop="" style="margin-left: 40px;">

                            <el-select v-model="cytimeqk" placeholder="请选择" size="mini" filterable>
                                <el-option v-for="item in condition" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div style="display: flex;">
                        <span style="color:red;position: absolute;margin-left: 10px;margin-top: 12px;"> *</span>
                        <el-form-item label="出院方式：" prop="">

                            <el-select v-model="cytimefs" placeholder="请选择" size="mini" style="width: 50px;" filterable>
                                <el-option v-for="item in Discharge" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item label="备注：" prop="" style="position: absolute;margin-left:320px;">
                            <el-input size="mini" style="width: 280px;margin-left: 20px;" v-model="remarks" type="textarea"
                                placeholder="请输入备注"></el-input>

                        </el-form-item>
                    </div>
                    <div style="width: 100%;height: 100px;display: flex;justify-content: center;align-items: center;">
                        <el-button @click="Apply = false" size="mini">取 消</el-button>
                        <el-button type="primary" @click="Applys" size="mini">确 定</el-button>
                    </div>
                </el-form>
            </div>



        </sgDialog>

        <el-dialog title="医嘱计价" :visible.sync="DectorAdvice" width="70%" :before-close="handleClosedoctor">
            <div style="width: 90%;height: 300px;overflow-y: scroll;" class="AdvicePricenew">
                <el-table :data="newDectorAdvice" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                    :header-cell-style="{ background: '#eef1f6', color: '#606266' }" border @row-click='AdvicePriceMunber'
                    highlight-current-row ref="tablelistones">
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column prop="bedNumber" label="床号" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="customerName" label="姓名" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="source" label="来源" width="100" align="center">
                        <template>
                            <div>
                                医生录入
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="periodicType" label="期效" width="100" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.periodicType == '0' || scope.row.periodicType == '3' || scope.row.periodicType ==
                                '长期'
                                ? '长期' : "临时" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="usageWay" label="给药途径" width="100" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{
                                    scope.row.usageWay == '1' ? '口服-外用' : scope.row.usageWay == '2' ? '水煎内服' :
                                    scope.row.usageWay == '3' ? '皮试' : ""
                                }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="itemName" label="名称" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="materialSpec" label="规格" width="150" align="center">
                    </el-table-column>
                    <el-table-column prop="amount" label="总量" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="doseUnit" label="单位" width="100" align="center"></el-table-column>
                    <el-table-column prop="unitPrice" label="单价" width="80" align="center"></el-table-column>
                    <el-table-column prop="totalPrice" label="金额" width="100" align="center"></el-table-column>

                </el-table>
            </div>
            <div style="width: 89%;height: 300px;margin-top: 40px;overflow-y: scroll;" class="AdvicePricenewchildren">
                <el-table :data="newDectorAdvicePrice" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                    :header-cell-style="{ background: '#eef1f6', color: '#606266' }" border>
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column prop="source" label="增加计价内容" width="120" align="center">
                        <template slot-scope="props">
                            <el-button type="text" size="mini" style="width: 80px;" @click="addAdvice"
                                v-if="props.row.flag">增加计价</el-button></template>
                    </el-table-column>
                    <el-table-column prop="source" label="来源" width="100" align="center">
                        <template>护士计价</template>
                    </el-table-column>
                    <el-table-column prop="periodicType" label="期效" width="100" align="center">
                        <template slot-scope="scope">
                            {{ scope.periodicType == '0' ? '长期' : "临时" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="itemName" label="名称" width="230" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.itemName" placeholder="请选择"
                                @change="changePriceLists($event, scope.row)" size="mini" :disabled="scope.row.Isselect"
                                filterable>
                                <el-option v-for="item in newPriceoptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialSpec" label="规格" width="100" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.specs == undefined ? scope.row.materialSpec : scope.row.specs }}
                            </div>
                        </template>

                    </el-table-column>
                    <el-table-column prop="amount" label="数量" width="150" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-input-number size="mini" v-model="scope.row.amount" placeholder="请输入数量"
                                    @input="changeInputs($event, scope.row)"
                                    :disabled="scope.row.Isselect"></el-input-number>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="doseUnit" label="单位" width="100" align="center"></el-table-column>
                    <el-table-column prop="unitPrice" label="单价" width="100" align="center"></el-table-column>
                    <el-table-column prop="totalPrice" label="金额" width="100" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{ (scope.row.amount) * (scope.row.unitPrice) }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalPrice" label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" style="color:red" v-if="scope.row.istrueflag"
                                @click="reduceclickadvice(scope.row)">
                                <img src="@/assets/images/deltel.png" style="width:20px;height:20px" />
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DectorAdvice = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="DectorAdvicePrice" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import slideSearch from '@/components/SlideSearchBar/index'
import moment from 'moment'
import { math } from '@/utils/math'
import { cos } from 'mathjs'

export default {
    name: 'nurse',
    dicts: ['Room_status', 'nation_list'],
    components: { sgDialog, slideSearch, SgTable },
    data() {
        return {
            // this.periodicType=row.periodicType;
            // this.StartTime=row.startTime;
            // this.Endtime=row.endTime;
            amountsums: 0,
            selectDatatable: [],
            bottombutton: [
                {
                    name: "计价内容",
                    back: "#409eff",
                    color: '#fff'
                },
                {
                    name: "抄送记录",
                    back: "",
                    color: ''
                },
                {
                    name: "执行记录",
                    back: "",
                    color: ''
                },
                {
                    name: "医嘱计价",
                    back: "",
                    color: ''
                },
                {
                    name: "保存",
                    back: "",
                    color: ''
                },

            ],
            recordHeight: "",
            rightbutton: [
                {
                    name: "医嘱记录",
                    back: "#409eff",
                    color: '#fff'

                },
                {
                    name: "记录查询",
                    back: "",
                    color: ''

                },
                {
                    name: "费用记录",
                    back: "",
                    color: ''

                }
            ],
            history: "",
            foctor: '',
            newfoctor: "",
            amountsumssh: 0,
            amountsuys: 0,
            daysComputedTime: "",
            AdviceProject: [],
            PriceNumber: 0,
            Endtime: "",
            StartTime: "",
            periodicType: "",
            listId: "",
            isUpdata: '',
            topNumber: 0,
            priceId: 0,
            newPriceoptions: [
                {
                    label: "医药费",
                    value: '1'
                },
                {
                    label: "中药费",
                    value: "2"
                }
            ],
            newDectorAdvicePrice: [],
            ruleForm: {
                name: ""
            },
            leaverules: {
                // leaveHis:[ { required: true, message: '请选择出院时间', trigger: 'blur' },
                //   ],
                //   leaveQk: [
                //     { required: true, message: '请选择出院情况', trigger: 'blur' },
                // ],
                // leaveMe: [
                //     { required: true, message: '请选择出院方式', trigger: 'blur' },
                // ],
                // leaveRe: [
                //     { required: true, message: '请输入备注', trigger: 'blur' },
                // ],


            },
            bedRoomList: [],
            //医嘱计价列表
            newDectorAdvice: [],
            //医嘱计价
            DectorAdvice: false,
            discharges: [{
                diagnosisResult: '',
                cureResult: ""
            }],
            cytime: "" + this.getDate(),
            cytimeqk: "",
            cytimefs: "",
            discharge: "",
            Result: '',
            remarks: "",
            Discharge: [

            ],
            condition: [

            ],
            listPricingContent: true,
            Apply: false,
            listByGroupNum: false,
            listEnforcement: false,
            newlistByGroupNum: [],
            price_name: "",
            shows: true,
            newshows: false,
            back: false,
            costs_tree: [],
            advices: true,
            record: false,
            costs: false,
            showsall: true,
            showsalls: true,
            search: '',
            radio_tree: '0',
            backListAll: [],
            kfType: [
                {
                    value: '0',
                    label: '未扣费'
                },
                {
                    value: '1',
                    label: '已扣费'
                },
            ],
            project_type: [
                {
                    value: '0',
                    label: '项目'
                },
                {
                    value: '2',
                    label: '药品'
                },
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6
                }
            },
            groupTypes: [
                {
                    value: '0',
                    label: '费用种类'
                }, {
                    value: '1',
                    label: '日期费用'
                }, {
                    value: '2',
                    label: '费用日期'
                },
            ],
            //计价内容
            priceContain: [],
            //状态数据
            state: [{
                value: '0',
                label: '在用医嘱'
            }, {
                value: '1',
                label: '全部医嘱'
            }, {
                value: '2',
                label: '今日停止'
            }, {
                value: '3',
                label: '今日新开医嘱'
            }, {
                value: '4',
                label: '所有停止医嘱'
            },
            {
                value: '5',
                label: '所有作废医嘱'
            }],
            Sort: [{
                value: '6',
                label: '开始时间倒叙'
            }, {
                value: '7',
                label: '开始时间正序'
            }],
            Type: [
                {
                    value: '2',
                    label: '药品'
                },
                {
                    value: '0',
                    label: '项目'
                },
            ],
            Name: "",
            value: '',
            valueType: "",
            value1: [],
            radio: '',
            Nurse_left: [],
            //患者列表数据
            tableData: [{
                date: '2016',
                name: '王小虎',
                address: '上海市'
            }, {
                date: '2016',
                name: '王小虎',
                address: '上海市'
            }, {
                date: '2016',
                name: '王小虎',
                address: '上海市普'
            }, {
                date: '2016',
                name: '王小虎',
                address: '上海市'
            }],
            flag: true,//控制分床和护理
            // 换房搜索
            changeRoom: {
                roomName: '',
                floorId: '',
                roomTypeId: ''
            },
            time: 3, // 按钮样式
            increase: 0, // 按钮样式
            number: 0,
            checkedIn: 0,
            free: 0,
            appointment: 0,
            occupancy: 0,
            height: 0,
            changeForm: {
                id: 0,
                customerName: undefined,
                customPhone: undefined,
                customCardNumber: undefined,
                customAge: undefined,
                oldRoomId: undefined,
                oldRoomName: undefined,
                roomDays: undefined,
                waitId: undefined,
                roomId: undefined,
                floorNumber: undefined,
                roomType: undefined,
                roomNumber: undefined,
                roomName: undefined,
                defaultDays: undefined,
                defaultCharge: undefined
            },
            changeFormRules: {
                floorNumber: [{ required: true, message: '请选择楼层', trigger: 'change' }],
                roomType: [{ required: true, message: '请选择房间类型', trigger: 'change' }],
                roomNumber: [{ required: true, message: '请选择房间编号', trigger: 'change' }],
                roomName: [{ required: true, message: '请选择房间名称', trigger: 'change' }]
            },
            roomSearchBar: {},
            roomData: [],
            roomColumns: [
                {
                    lab: '房间名称',
                    val: 'roomName'
                },
                {
                    lab: '床位号',
                    val: 'bedNumber'
                },
                {
                    lab: '房间类型',
                    val: 'roomType'
                }
                // {
                //   lab: '默认天数',
                //   val: 'defaultDays'
                // },
                // {
                //   lab: '默认费用',
                //   val: 'defaultCharge'
                // },
                // {
                //   lab: '备注',
                //   val: 'remark'
                // }
            ],
            roomPagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true
            },
            changeSelectionData: [],
            rechargeableCard: [],
            showChangeDialog: false,
            loadingData: false,
            btnDisabled: false,
            checkDisabled: false,
            showDataDialog: false,
            loadingSubmit: false,
            customerData: [],
            columns: [
                {
                    lab: '姓名',
                    val: 'customerName'
                },
                {
                    lab: '手术名称',
                    val: 'operationName',
                    width: 140
                },
                {
                    lab: '卡号',
                    val: 'customCardNumber',
                    width: 160
                },
                {
                    lab: '住院时间',
                    val: 'hospitalTime',
                    width: 140
                },


                {
                    lab: '科室',
                    val: 'departmentName'
                },
            ],
            // 未预约
            columnss: [
                {
                    lab: '姓名',
                    val: 'customerName'
                },
                {
                    lab: '产品',
                    val: 'company'
                },
                {
                    lab: '电话',
                    val: 'customPhone'
                },
                {
                    lab: '现场咨询',
                    val: 'acName',
                    width: 90
                },
                {
                    lab: '项目',
                    val: 'projectName'
                }
            ],
            listname: "",
            // 未预约搜索
            formNot: {
                customPhone: '',
                customerName: '',
                aestheticConsultant: ''
            },
            // 未预约列表
            customerDatas: [],
            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true
            },
            roomForm: {
                id: 0,
                roomId: 0,
                floorNumber: '',
                roomType: '',
                roomNumber: '',
                roomName: '',
                defaultDays: '',
                defaultCharge: '',
                customerName: '',
                customPhone: '',
                customCardNumber: '',
                customAge: '',
                checkStatus: '',
                aestheticConsultant: '',
                nurse: '',
                maternityMatron: '',
                chanKangShi: '',
                checkReservationTime: this.getTodayData(),
                roomDays: '0',
                checkOutTime: '',
                remark: ''
            },
            roomFormRules: {
                customerName: [
                    { required: true, message: '请在左侧选择客户', trigger: 'blur' }
                ],
                customPhone: [
                    { required: true, message: '请在左侧选择客户', trigger: 'blur' }
                ],
                aestheticConsultant: [
                    { required: true, message: '请选择现场咨询', trigger: 'change' }
                ],
                nurse: [
                    { required: true, message: '请选择责任护士', trigger: 'change' }
                ],
                maternityMatron: [
                    { required: true, message: '请选择责任月嫂', trigger: 'change' }
                ],
                chanKangShi: [
                    { required: true, message: '请选择产康师', trigger: 'change' }
                ],
                checkReservationTime: [
                    { required: true, message: '请选择入住时间', trigger: 'blur' }
                ],
                roomDays: [
                    { required: true, message: '请输入入住天数', trigger: 'blur' }
                ]
            },
            searchBar: {
                customerName: '',
                customPhone: '',
                customCardNumber: '',
                checkReservationTime: this.getTodayData()
            },
            selectionData: [],
            sysUserList: [],
            zerennurse: [],
            yuesao: [],
            chks: [],
            showDialog: false,
            showBillDialog: false,
            activeName: 'firs',
            floorId: 0,
            roomType: [],
            list: [],
            nation: [],
            // 鼠标
            showOther: false,
            showCheck: true,
            visible: false,
            top: 0,
            left: 0,
            roomlist: [], // 房间
            dialogVisible: false, // 弹框
            form: {
                customerName: '',
                customSex: '',
                customAge: ''
            },
            // 查询列表
            options: {
                customerName: {
                    type: 'input',
                    label: '客户姓名',
                    clearable: true,
                },
                customPhone: {
                    type: 'input',
                    label: '手机号',
                    clearable: true,
                },
                nation: {
                    type: 'select',
                    label: '民族',
                    clearable: true,
                    options: []
                },
                checkStatus: {
                    type: 'select',
                    label: '房间状态',
                    clearable: true,
                    options: []
                }
            },
            todayData: '',
            floorList: [],
            roomTypeList: [
                {
                    value: "0",
                    label: '月子'
                },
                {
                    value: "1",
                    label: '整形'
                },
                {
                    value: "2",
                    label: '妇儿'
                }
            ],
            isAppointment: 0,
            nurseId: 0,
            customerNameList: '',
            //医嘱记录
            listGroup: [],
            //右侧查询id
            inHospitalId: '',
            createTimeStart: '',
            createTimeEnd: '',
            medicalAdviceState: '1',
            medicalAdviceType: '4',
            newitemName: '',
            medicalAdviceType: '',
            copyDepartmentName: '',
            receiveState: '',
            hospitalCopyRecords: [],
            groupType: "0",
            Source: "",
            count: 0,
            expenseType: "",
            itemName: "",
            pricingTime: '',
            fyList: [],
            fyListAll: [],
            groupNum: "",
            adviceGroupNum: "",
            newlistEnforcement: [],
            hospitalList: [{ roomType: "三人间" }],
            roomNames: "",
            zerendoctor: [],
            newHeight: "1260px",
            methoList: [],
            heightnurse: "",
        }
    },
    computed: {
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId;
            }
        }
    },
    watch: {
        radio_tree(value) {
            if (value == '0') {
                this.shows = true;
                this.newshows = false;
                this.back = false;
                this.showsalls = true;
                this.showsall = true
                this.newHeight = '1260px'
            }
            if (value == '1') {
                this.newHeight = '930px'
                this.showall = true;
                this.showsalls = true;
                this.showsall = true
                this.shows = false;
                this.newshows = true;
                this.back = false;
                let data = {};
                if (this.groupType == '0') {
                    data = {
                        inHospitalId: this.inHospitalId,
                        // expenseType: this.expenseType,
                        // itemName: this.itemName,
                        deptId: this.deptId
                    }
                } else if (this.groupType == '1') {
                    // alert('dsadgasgd')
                    data = {
                        inHospitalId: this.inHospitalId,
                        // expenseType: this.expenseType,
                        // itemName: this.itemName,
                        deptId: this.deptId
                    }
                } else {
                    data = {
                        inHospitalId: this.inHospitalId,
                        deptId: this.deptId
                    }
                }

                this.$api.confinementRoom.expenseSummaryList(data).then(res => {
                    this.fyListAll = res.rows;

                });
            }
            if (value == '2') {
                this.shows = false;
                this.newshows = false;
                this.showsall = false
                this.showsalls = false;
                this.back = true;
                let data = {
                    feeSource: '4',
                    inHospitalId: this.inHospitalId,
                    deptId: this.deptId
                }
                this.$api.confinementRoom.backList(data).then(res => {
                    this.backListAll = res.rows;

                });

            }
        },
        radio(value) {
            this.periodicType = value;
            this.RightgetData();
        },
        value1(newvalue, oldvalue) {
            if (this.value1 == null) {
                this.createTimeStart = '';
                this.createTimeEnd = '';
            } else {
                this.createTimeStart = this.newDate(this.value1[0]);
                this.createTimeEnd = this.newDate(this.value1[1]);
            }

            this.RightgetData();
        },

        visible(value) {
            if (value) {
                document.body.addEventListener('click', this.closeMenu)
            } else {
                document.body.removeEventListener('click', this.closeMenu)
            }
        },
        deptId(val) {
            this.deptId = val
            this.getData()
            this.nurse();
            this.getUserList(val)
            this.getCustomerInfo()
            this.gettable();

        }
    },
    mounted() {
        const height = document.documentElement.clientHeight - 210
        this.heightnurse = document.documentElement.clientHeight - 240
        if (height < 400) {
            this.height = 400 + 'px'
        } else {
            this.height = height + 'px'
        }
        sessionStorage.setItem('iSnurse', 'true');
        this.recordHeight = document.documentElement.clientHeight - 330
    },
    created() {

        const data = {
            status: '0',
            deptId: this.deptId
        }
        this.$api.product.productList(data).then(res => {
            if (res) {
                this.methoList = res.rows


            }
        })

        this.value1 = [this.timenow(), this.timenow()];
        this.cytime = this.getDate();
        this.deptId = this.$store.getters.departmentId
        this.getUserList(this.deptId)
        this.options.checkStatus.options = [{
            label: '已入住',
            value: '2'
        },
        {
            label: '空闲',
            value: '0'
        }]
        this.options.nation.options = this.dict.type.nation_list
        this.gettable();
        this.getData();
        this.$api.confinementRoom.leave_flag().then(res => {
            res.data.forEach(value => {
                let object = {};
                object.value = value.dictValue
                object.label = value.dictLabel
                this.Discharge.push(object)

            })
        });
        this.$api.confinementRoom.cure_result().then(res => {
            res.data.forEach(value => {
                let object = {};
                object.value = value.dictValue
                object.label = value.dictLabel;

                this.condition.push(object)

            })
        });
    },
    methods: {
        listcolorbutton(index) {
            this.bottombutton.forEach(value => {
                value.back = '#ecf5ff';
                value.color = '#409eff'
            })
            if (index == 0) {
                this.prices();
            }
            if (index == 1) {
                this.proofreadAll();
            }
            if (index == 2) {
                this.listEnforcementAll();
            }
            if (index == 3) {
                this.doctorAdvice()
            }
            if (index == 4) {
                this.Save();
            }
            this.bottombutton[index].back = '#409eff';
            this.bottombutton[index].color = '#fff'
        },
        listcolor(index) {
            this.rightbutton.forEach(value => {
                value.back = '#ecf5ff';
                value.color = '#409eff'
            })
            if (index == 0) {
                this.newadvices()
            }
            if (index == 1) {
                this.newrecord();
            }
            if (index == 2) {
                this.pricecost()
            }
            this.rightbutton[index].back = '#409eff';
            this.rightbutton[index].color = '#fff'
        },
        newcopyRecordId(row) {
            this.$confirm('确认撤销记录吗，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                this.$api.confinementRoom.updateCancelsExecutedRecord({
                    copyRecordId: row.copyRecordId
                }).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '撤销成功!'
                        });
                        this.newrecord()
                    }
                })

            }).catch((res) => {

            });
        },
        reduceclickadvice(row) {
            this.newDectorAdvicePrice.forEach((value, index) => {
                if (value.ids == row.ids) {
                    this.newDectorAdvicePrice.splice(index, 1)
                }
            })
        },
        reduceclick(row) {
            this.priceContain.forEach((value, index) => {
                if (value.ids == row.ids) {
                    this.priceContain.splice(index, 1)
                }
            })
        },
        handles(row) {
            switch (row.executingState) {
                case 0:
                    return row.executingState = '草稿'
                    break;
                case 1:
                    return row.executingState = '提交'
                    break;
                case 2:
                    return row.executingState = '校对'
                    break;
                case 3:
                    return row.executingState = '已抄送'
                    break;
                case 5:
                    return row.executingState = '已完成'
                    break;
                case 8:
                    return row.executingState = '作废'
                    break;
                case 6:
                    return row.executingState = '待停止'
                    break;
                case 7:
                    return row.executingState = '已停止'
                    break;
                //0:长期; 1:临时; 2:出院带药
            }
        },
        methodsUnit(val) {
            let strName = ''
            this.methoList.forEach(value => {
                if (val == value.productUnitId) {
                    strName = value.productUnitName
                }
            })
            return strName


        },
        aestheticConsultantList(e) {
            this.roomForm.aestheticConsultant = e;
        },
        nurseList(e) {
            this.roomForm.nurse = e;
        },
        getSummariesl(params) {
            let sums = [];
            const { columns, data } = params;
            columns.forEach(value => {
                sums.push('')
            })
            let count = 0;
            let ys = 0;
            // this.amountsumssh = 0;
            // this.amountsuys = 0;
            if (data.length == 0) {

            } else {
                data.forEach(value => {
                    count += Number(value.amount);
                    // this.amountsumssh += value.amountReceived
                    ys += value.amountReceived
                })
                sums[5] = count;
                sums[7] = ys;
                // sums[9] = this.amountsumssh;
                // sums[8] = this.amountsuys;
            }
            sums[0] = '合计'
            return sums;
        },
        getSummaries(params) {
            let sums = [];
            const { columns, data } = params;
            columns.forEach(value => {
                sums.push('')
            })
            this.amountsums = 0;
            this.amountsumssh = 0;
            this.amountsuys = 0;
            if (data.length == 0) {

            } else {
                data.forEach(value => {
                    this.amountsums += Number(value.amount);
                    this.amountsumssh += value.amountReceived
                    this.amountsuys += value.amountReceivable
                })
                sums[6] = this.amountsums;
                sums[9] = this.amountsumssh;
                sums[8] = this.amountsuys;
            }
            sums[0] = '合计'
            return sums;
        },
        messgaesl(val) {
            if (val == null) {

            } else {
                return val.split(' ')[0]
            }

        },
        customerclick(id, val) {
            this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, } })
        },
        changeHourses() {
            let data = {
                inHospitalId: this.hospitalList[0].inHospitalId,
            }
            this.$api.confinementRoom.hospitalInfot(data).then(res => {
                if (res.code == 200) {
                    this.getData();
                    this.$message.success('提交出院成功');
                }
            })


        },
        AdvicePriceMunber(row) {
            this.groupNum = row.groupNum;
            this.newDectorAdvicePrice = []
            if (row.periodicType == '长期') {
                this.periodicType = '0';
            } else {
                this.periodicType = '1';
            }
            if (row.flagselect == true) {
                this.groupNum = ''
                this.$refs.tablelistones.setCurrentRow(-1)
                this.newDectorAdvice.forEach(value => {
                    if (value.groupNum == row.groupNum) {
                        value.flagselect = false
                    }
                })
            } else {
                this.groupNum = row.groupNum
                this.newDectorAdvice.forEach(value => {
                    if (value.groupNum == row.groupNum) {
                        value.flagselect = true
                    } else {
                        value.flagselect = false;
                    }
                })
                this.$refs.tablelistones.setCurrentRow(row, true);
            }
            this.StartTime = row.startTime;
            this.Endtime = row.endTime;
            let datas = {
                groupNum: this.groupNum,
                deptId: this.deptId,
                detaFlag: '2',
                inHospitalId: this.inHospitalId
            }
            this.$api.confinementRoom.listPricingContent(datas).then(res => {
                // this.priceContain = []
                if (res.rows.length == 0) {
                    let str = '';
                    for (let i = 0; i < 8; i++) {
                        str += Math.floor(Math.random() * 10)
                    }
                    this.PriceNumber = 0;
                    this.newDectorAdvicePrice.push({
                        source: '护士计价',
                        periodicType: "",
                        itemName: "",
                        materialSpec: '',
                        amount: "",
                        doseUnit: "",
                        unitPrice: '',
                        totalPrice: "",
                        flag: true,
                        ids: str,
                    })
                } else {
                    this.newDectorAdvicePrice = res.rows;
                    this.newDectorAdvicePrice.forEach(value => {
                        value.Isselect = true
                    })
                    this.PriceNumber = this.newDectorAdvicePrice.length;
                    let str = '';
                    for (let i = 0; i < 8; i++) {
                        str += Math.floor(Math.random() * 10)
                    }
                    this.newDectorAdvicePrice.push({
                        source: '护士计价',
                        periodicType: "",
                        itemName: "",
                        materialSpec: '',
                        amount: "",
                        doseUnit: "",
                        unitPrice: '',
                        totalPrice: "",
                        flag: true,
                        ids: str,
                    })
                }
            })
        },
        //医嘱计价确定
        DectorAdvicePrice() {
            let newPrice = [];
            let that = this;
            this.newDectorAdvicePrice.forEach(value => {
                value.source = '护士计价';
                value.inHospitalId = this.inHospitalId;
                value.deptId = this.deptId;
                value.materialSpec = value.specs;
                // value.amount = value.priceNum,
                value.id = this.priceId;
                this.newPriceoptions.forEach(newvalue => {
                    if (value.itemName == newvalue.value) {
                        value.itemName = newvalue.label
                    }
                })
                let data = {
                    parentGroupNum: this.groupNum,
                    dataFlag: "2",
                    groupNum: this.groupNum,
                    periodicType: this.periodicType,
                    startTime: this.StartTime,
                    endTime: this.Endtime
                    //         Endtime:"",
                    // StartTime:"",
                    // periodicType:"",

                }
                let object = Object.assign(value, data)
                newPrice.push(object)
            });
            let newPriceNumber = [];
            for (let num = this.PriceNumber; num < newPrice.length; num++) {

                newPriceNumber.push(newPrice[num])
            }
            if (newPriceNumber.length == 0) {
                this.$message.warning('请先添加医嘱在进行计价');
                return
            }
            let flag = false;
            let newpriceList = [];
            if (newPriceNumber.length == 1) {
                newPriceNumber.forEach(value => {
                    if (value.expense == 0) {
                        flag = true;
                    }
                })
            } else {
                newPriceNumber.forEach(value => {
                    if (value.expense !== 0) {
                        newpriceList.push(value)
                    }
                    newPriceNumber = newpriceList;
                })
            }

            if (flag) {
                this.$message.warning("计价金额不能为0");
                return;
            }
            this.$api.confinementRoom.addBatch(newPriceNumber).then(res => {
                this.$message.success('医嘱计价成功');
                this.DectorAdvice = false;
                // this.priceContain = []
                // this.nurse();
                let datas = {
                    groupNum: this.groupNum,
                    deptId: this.deptId,
                    detaFlag: '2'
                }
                this.$api.confinementRoom.listPricingContent(datas).then(res => {

                    if (res.rows.length == 0) {
                        that.priceContain = []
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        that.priceContain.push({
                            source: '',
                            periodicType: "",
                            itemName: "",
                            materialSpec: '',
                            amount: "",
                            doseUnit: "",
                            unitPrice: '',
                            totalPrice: "",
                            flag: true,
                            ids: str,
                        })
                    } else {
                        that.priceContain = []

                        that.priceContain = res.rows;
                        that.priceContain.forEach(value => {
                            value.Isselect = true
                        })
                        this.PriceNumber = that.priceContain.length;
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        that.priceContain.push({
                            source: '',
                            periodicType: "",
                            itemName: "",
                            materialSpec: '',
                            amount: "",
                            doseUnit: "",
                            unitPrice: '',
                            totalPrice: "",
                            flag: true,
                            ids: str,
                        })
                    }
                    let newprice = {
                        searchType: "1",
                        deptId: this.deptId
                    }
                    this.$api.confinementRoom.projectList(newprice).then(res => {
                        let arr = [];
                        res.rows.forEach((value, index) => {
                            let object = {
                                value: value.itemId,
                                label: value.projectName
                            }
                            // this.priceContain[index].itemId=value.itemId;
                            // this.priceContain[index].productItemType=value.projectTypeId;
                            let newobject = Object.assign(value, object)
                            arr.push(newobject)
                        })
                        this.newPriceoptions = arr;
                        this.AdviceProject = this.deepClone(arr)
                    })



                })

            })
        },
        changeInputs($event, row) {
            if ($event == undefined) {

            } else {
                this.newDectorAdvicePrice.forEach((value, index) => {
                    if (value.ids == row.ids) {
                        this.newDectorAdvicePrice[index].totalPrice = Number(row.unitPrice) * Number($event);
                        this.newDectorAdvicePrice[index].expense = Number(row.unitPrice) * Number($event);
                    }
                })
                // this.isUpdata=Math.random();
            }
        },
        //医嘱计价
        changePriceLists(event, row) {
            let newPrice = '';
            let amount = 0;
            let unitPrice = 0;
            let totalPrice = 0;
            let expense = 0;
            let medicalAdviceType = 0;
            let doseUnit = '';
            let expenseTypeName = '';
            let specs = ""
            this.newPriceoptions.forEach(value => {
                if (value.itemId == event) {
                    newPrice = value.projectTypeId;
                    amount = value.priceNum;
                    unitPrice = value.priceOne;
                    medicalAdviceType = value.categoryId;
                    doseUnit = value.priceUnit;
                    expenseTypeName = value.expenseTypeName
                    totalPrice = Number(value.priceNum) * Number(value.priceOne);
                    expense = Number(value.priceNum) * Number(value.priceOne);
                    specs = value.specs
                }
            })
            this.newDectorAdvicePrice.forEach((value, index) => {
                if (value.ids == row.ids) {
                    this.newDectorAdvicePrice[index].itemId = event;
                    this.newDectorAdvicePrice[index].productItemType = newPrice;
                    this.newDectorAdvicePrice[index].amount = amount;
                    this.newDectorAdvicePrice[index].unitPrice = unitPrice;
                    this.newDectorAdvicePrice[index].totalPrice = totalPrice;
                    this.newDectorAdvicePrice[index].expense = expense;
                    this.newDectorAdvicePrice[index].useCustomer = '0';
                    this.newDectorAdvicePrice[index].doctorId = localStorage.getItem('userId');
                    this.newDectorAdvicePrice[index].doctorName = localStorage.getItem('username');
                    this.newDectorAdvicePrice[index].medicalAdviceType = medicalAdviceType
                    this.newDectorAdvicePrice[index].doseUnit = doseUnit
                    this.newDectorAdvicePrice[index].expenseType = expenseTypeName
                    this.newDectorAdvicePrice[index].specs = specs
                }
            })
        },
        addAdvice(row) {
            let str = '';
            for (let i = 0; i < 8; i++) {
                str += Math.floor(Math.random() * 10)
            }
            this.newDectorAdvicePrice.push({
                source: '护士计价',
                periodicType: "",
                itemName: "",
                materialSpec: '',
                amount: "",
                doseUnit: "",
                unitPrice: '',
                totalPrice: "",
                flag: false,
                ids: str,
                istrueflag: true
            })
        },
        getDate() {
            var date = new Date() // 获取时间
            var year = date.getFullYear() // 获取年
            var month = date.getMonth() + 1 // 获取月
            var strDate = date.getDate() // 获取日
            let newmonth = month < 10 ? '0' + month : month
            return year + '-' + newmonth + '-' + strDate
        },
        newselechColum(row) {
            if (row.periodicType == '长期') {
                this.periodicType = '0';
            } else {
                this.periodicType = '1';
            }
            this.StartTime = row.startTime;
            this.Endtime = row.endTime;
            if (row.flagselct == true) {
                this.groupNum = ''
                this.$refs.listGroup.setCurrentRow(-1)
                this.listGroup.forEach(value => {
                    value.flagselct = false
                })
            } else {
                this.groupNum = row.groupNum
                this.listGroup.forEach(value => {
                    if (value.ids == row.ids) {
                        value.flagselct = true
                    } else {
                        value.flagselct = false;
                    }
                })
                this.$refs.listGroup.setCurrentRow(row, true);
            }
            let datas = {
                groupNum: this.groupNum,
                deptId: this.deptId,
                detaFlag: '2',
                inHospitalId: row.inHospitalId
            }
            this.$api.confinementRoom.listPricingContent(datas).then(res => {
                this.priceContain = []
                if (res.rows.length == 0) {
                    let str = '';
                    for (let i = 0; i < 8; i++) {
                        str += Math.floor(Math.random() * 10)
                    }
                    this.PriceNumber = 0;
                    this.priceContain.push({
                        source: '',
                        periodicType: "",
                        itemName: "",
                        materialSpec: '',
                        amount: "",
                        doseUnit: "",
                        unitPrice: '',
                        totalPrice: "",
                        flag: true,
                        ids: str,
                    })
                } else {
                    this.priceContain = res.rows;
                    this.priceContain.forEach(value => {
                        value.Isselect = true
                    })
                    this.PriceNumber = this.priceContain.length;
                    let str = '';
                    for (let i = 0; i < 8; i++) {
                        str += Math.floor(Math.random() * 10)
                    }
                    this.priceContain.push({
                        source: '',
                        periodicType: "",
                        itemName: "",
                        materialSpec: '',
                        amount: "",
                        doseUnit: "",
                        unitPrice: '',
                        totalPrice: "",
                        flag: true,
                        ids: str,
                    })
                }
            })

        },
        tableRowClassName({ row, rowIndex }) {

            switch (row.executingState) {
                case '校对':
                    return 'warning-row'
                    break;
                case '提交':
                    return 'success-row'
                    break;
                case '待停止':
                    return 'stop_advice'
                    break;
                case '已停止':
                    return 'stop_success'
                case '作废':
                    return 'success-rowzf'
                case '已抄送':
                    return 'success-rowzfcs'
                case '计价医嘱':
                    return 'success-rowzfjj'
                case '已完成':
                    return 'success-rowzfwc'



            }
            //   if(row.executingState=='校对'){
            //     return 'warning-row';
            //   }

            // if (rowIndex === 1) {
            //     return 'warning-row';
            // } else if (rowIndex === 3) {
            //     return 'success-row';
            // }
            // return ''
        },
        changeInput($event, row) {
            // if($event,'呼呼呼呼')
            if ($event == undefined) {

            } else {
                this.priceContain.forEach((value, index) => {
                    if (value.ids == row.ids) {
                        this.priceContain[index].totalPrice = Number(row.unitPrice) * Number($event);
                        this.priceContain[index].expense = Number(row.unitPrice) * Number($event);
                    }

                })
                // this.isUpdata=Math.random();
            }

            // let h=this.priceContain;
            // this.priceContain=[];
            // this.priceContain=h;

        },
        changePriceList(enevt, row) {
            let newPrice = '';
            let amount = 0;
            let unitPrice = 0;
            let totalPrice = 0;
            let expense = 0;
            let medicalAdviceType = 0;
            let doseUnit = '';
            let expenseTypeName = '';
            let specs = '';
            this.newPriceoptions.forEach(value => {
                if (value.itemId == enevt) {
                    newPrice = value.projectTypeId;
                    amount = value.priceNum;
                    unitPrice = value.priceOne;
                    medicalAdviceType = value.categoryId;
                    doseUnit = value.priceUnit;
                    expenseTypeName = value.expenseTypeName
                    totalPrice = Number(value.priceNum) * Number(value.priceOne);
                    expense = Number(value.priceNum) * Number(value.priceOne);
                    specs = value.specs;
                }
            })
            this.priceContain.forEach((value, index) => {
                if (value.ids == row.ids) {
                    this.priceContain[index].itemId = enevt;
                    this.priceContain[index].productItemType = newPrice;
                    this.priceContain[index].amount = amount;
                    this.priceContain[index].unitPrice = unitPrice;
                    this.priceContain[index].totalPrice = totalPrice;
                    this.priceContain[index].expense = expense;
                    this.priceContain[index].useCustomer = '0';
                    this.priceContain[index].doctorId = localStorage.getItem('userId');
                    this.priceContain[index].doctorName = localStorage.getItem('username');
                    this.priceContain[index].medicalAdviceType = medicalAdviceType
                    this.priceContain[index].doseUnit = doseUnit
                    this.priceContain[index].expenseType = expenseTypeName
                    this.priceContain[index].specs = specs

                }
            })
        },
        DialogPrice() {

        },
        handleClosedoctor() {
            this.DectorAdvice = false
        },
        timenow() {
            var d = new Date(), str = '';
            str += d.getFullYear() + '-';
            str += d.getMonth() + 1 + '-';
            str += d.getDate();
            return str;
        },
        //医嘱计价
        doctorAdvice() {
            this.DectorAdvice = true;
            let that = this;
            let data = {
                inHospitalId: that.inHospitalId,
                pageNum: 1,
                pageSize: 20,
                createTimeStart: that.createTimeStart,
                createTimeEnd: that.createTimeEnd,
                periodicType: that.radio,
                medicalAdviceState: that.medicalAdviceState,
                medicalAdviceType: that.medicalAdviceType,
                deptId: this.deptId,
                dataFlag: '0'
            };
            this.$api.confinementRoom.listGroup(data).then(res => {
                if (res.rows.length == 0) {
                    this.newDectorAdvice = [];
                    this.newDectorAdvicePrice = []
                    return
                } else {
                    this.newDectorAdvicePrice = []
                    let Newdata = [];
                    res.rows.forEach(value => {
                        value.forEach(values => {
                            Newdata.push(values)
                        })
                    });
                    Newdata.forEach((value, index) => {
                        if (index == 0) {
                            value.flagselect = true
                        } else {
                            value.flagselect = false;
                        }
                    })
                    this.groupNum = Newdata[0].groupNum;
                    this.periodicType = Newdata[0].periodicType;
                    this.StartTime = Newdata[0].startTime
                    this.Endtime = Newdata[0].endTime
                    this.priceId = Newdata[0].id
                    that.newDectorAdvice = Newdata;
                    this.$refs.tablelistones.setCurrentRow(Newdata[0], true)
                    let datas = {
                        groupNum: this.groupNum,
                        deptId: this.deptId,
                        detaFlag: '2',
                        inHospitalId: this.inHospitalId
                    }
                    this.$api.confinementRoom.listPricingContent(datas).then(res => {
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        if (res.rows.length == 0) {
                            this.newDectorAdvicePrice.push({
                                source: '护士计价',
                                periodicType: "",
                                itemName: "",
                                materialSpec: '',
                                amount: "",
                                doseUnit: "",
                                unitPrice: '',
                                totalPrice: "",
                                flag: true,
                                ids: str
                            })
                            this.PriceNumber = 0
                        } else {
                            this.newDectorAdvicePrice = res.rows;
                            this.PriceNumber = this.newDectorAdvicePrice.length;
                            this.newDectorAdvicePrice.forEach(value => {
                                value.flag = false,
                                    value.Isselect = true;
                            })

                            this.newDectorAdvicePrice.push({
                                source: '护士计价',
                                periodicType: "",
                                itemName: "",
                                materialSpec: '',
                                amount: "",
                                doseUnit: "",
                                unitPrice: '',
                                totalPrice: "",
                                flag: true,
                                ids: str
                            })
                        }
                    })
                }

                // let arr = []
                // for (let i = 0; i < res.rows.length; i++) {
                //     let datas = {
                //         groupNum: res.rows[i][0].groupNum,
                //         deptId: this.deptId
                //     }

                //     this.$api.confinementRoom.listPricingContent(datas).then(res => {
                //         if (res.rows.length == 0) {
                //             arr.push([{ flag: true }])
                //         } else {

                //         }

                //     })

                // }
                // setTimeout(() => {
                //     let object = {}
                //     let Data = [];
                //     res.rows.forEach((value, index) => {
                //         object[index] = value.length
                //         value.forEach(values => {
                //             Data.push(values)
                //         })
                //     });
                //     let i = -1;
                //     let count = -1;
                //     let couns = 0;
                //     let AdviceDOctor;
                //     for (let x in object) {
                //         i += object[x];
                //         count++;
                //         if (count <= 0) {
                //             AdviceDOctor = Data.slice(0, res.rows[count].length).concat(arr[count]).concat(Data.slice(res.rows[count].length, Data.length));
                //         } else if (count > 0 && count < res.rows.length - 1) {

                //         } else {
                //             AdviceDOctor = AdviceDOctor.concat(arr[count])
                //         }
                //         arr[count].forEach((value, index) => {
                //             couns++;
                //         })
                //     }
                //     this.newDectorAdvice = AdviceDOctor;
                // }, 350)


            })
            //    newDectorAdvice
        },
        changeValue(value, index) {

        },
        changePriceType(file) {
            let Index = '';
            let conditions = document.querySelectorAll('.selectName');
            for (let i = 0; i < conditions.length; i++) {
                if (file.target === conditions[i]) {
                    Inde = i
                }
            }

            // let data={
            //     //这里是计价下拉框传参
            //     'Index':Index,
            // }
            // //计价选择后的值
            // this.$api.confinementRoom.nurseRightTop().then(res => {
            //     //这里写计价数据
            //     this.priceContain[Index]={ source: '', periodicType: "", itemName: "", materialSpec: '', amount: "", doseUnit: "", unitPrice: '', totalPrice: "", flag: false}
            //     });
        },
        selechColum(row, column, event) {
            let that = this;
            this.inHospitalId = row.inHospitalId;
            let time = row.hospitalTime;
            let newTime = time.substr(0, 10)
            this.daysComputedTime = this.daysComputed(newTime);
            let ids = {
                id: row.id,
                // deptId: this.deptId
            }
            this.$api.confinementRoom.nurseRightTop(ids).then(res => {
                this.customerNameList = res.data;
                const data = {
                    deptId: this.deptId,
                    status: '0'
                }
                this.$api.user.getUserList(data).then(res => {
                    if (res) {
                        res.data.forEach(item => {
                            item.label = item.nickName
                            item.value = item.userId
                        })
                        res.data.forEach(item => {
                            // this.zerennurse.push(item)
                            if (item.postCode == 'zerennurse') {
                                if (item.userId == this.customerNameList.nursingPersonnel) {
                                    this.customerNameList.nursingPersonnel = item.nickName
                                }
                            }
                        }) // 责任护士
                    }
                })
            });
            this.inHospitalId = row.inHospitalId;
            let data = {
                inHospitalId: that.inHospitalId,
                pageNum: 1,
                pageSize: 20,
                createTimeStart: that.createTimeStart,
                createTimeEnd: that.createTimeEnd,
                periodicType: that.radio,
                medicalAdviceState: that.medicalAdviceState,
                searchType: that.medicalAdviceType,
                // medicalAdviceType: that.medicalAdviceType,
                deptId: this.deptId,
                dataFlag: "0"

            };
            if (this.topNumber == 0) {
                this.$api.confinementRoom.listGroup(data).then(res => {
                    if (res.rows.length == 0) {
                        this.groupNum = '';
                        this.listGroup = [];
                        this.priceContain = [];
                        let datas = {
                            groupNum: this.groupNum,
                            deptId: this.deptId,
                            inHospitalId: this.inHospitalId
                        }

                        this.$api.confinementRoom.listPricingContent(datas).then(res => {
                            that.priceContain = res.rows;
                            this.PriceNumber = that.priceContain.length;
                            that.priceContain.forEach(value => {
                                value.Isselect = true
                            })
                            let str = '';
                            for (let i = 0; i < 8; i++) {
                                str += Math.floor(Math.random() * 10)
                            }
                            if (res.rows.length == 0) {
                                that.priceContain.push({ source: '', periodicType: "", itemName: "", materialSpec: '', amount: "", doseUnit: "", unitPrice: '', totalPrice: "", flag: true, ids: str })
                            } else {
                                that.priceContain.push({ source: '', periodicType: "", itemName: "", materialSpec: '', amount: "", doseUnit: "", unitPrice: '', totalPrice: "", flag: true, ids: str })
                            }
                            let newprice = {
                                searchType: "1",
                                deptId: this.deptId
                            }
                            this.$api.confinementRoom.projectList(newprice).then(res => {
                                let arr = [];
                                res.rows.forEach((value, index) => {
                                    let object = {
                                        value: value.itemId,
                                        label: value.projectName
                                    }
                                    // this.priceContain[index].itemId=value.itemId;
                                    // this.priceContain[index].productItemType=value.projectTypeId;
                                    let newobject = Object.assign(value, object)
                                    arr.push(newobject)
                                })
                                this.newPriceoptions = arr;
                                this.AdviceProject = this.deepClone(arr)
                            })
                            // if (that.priceContain, length == 0) {
                            //     that.priceContain.push({})
                            // }
                        })
                        return;
                    }
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach((values, index) => {
                            Data.push(values)
                        })
                    });

                    Data.forEach((value, index) => {
                        let str = '';
                    for (let i = 0; i < 8; i++) {
                        str += Math.floor(Math.random() * 10)
                    }
                    value.ids=str;
                        if (index == 0) {
                            value.flagselct = true
                        } else {
                            value.flagselct = false
                        }
                        if (value.periodicType == '0') {
                            value.periodicType = '长期'
                        }

                        if (value.periodicType == '3') {
                            value.periodicType = '长期'
                        }
                        if (value.periodicType == '1') {
                            value.periodicType = '临时'
                        }
                        if (value.periodicType == '4') {
                            value.periodicType = '临时'
                        }
                    })
                    this.$refs.listGroup.setCurrentRow(Data[0], true)
                    this.groupNum = Data[0].groupNum;
                    this.Source = Data[0].source;
                    this.StartTime = Data[0].startTime;
                    this.Endtime = Data[0].endTime;
                    if (Data[0].periodicType == '长期') {
                        this.periodicType = '0'
                    } else {
                        this.periodicType = '1'
                    }

                    that.listGroup = Data;
                    console.log(that.listGroup, '哈哈')
                    let datas = {
                        groupNum: this.groupNum,
                        deptId: this.deptId,
                        inHospitalId: this.inHospitalId
                    }

                    this.$api.confinementRoom.listPricingContent(datas).then(res => {
                        that.priceContain = res.rows;
                        this.PriceNumber = that.priceContain.length;
                        that.priceContain.forEach(value => {
                            value.Isselect = true
                        })
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        if (res.rows.length == 0) {
                            that.priceContain.push({ source: '', periodicType: "", itemName: "", materialSpec: '', amount: "", doseUnit: "", unitPrice: '', totalPrice: "", flag: true, ids: str })
                        } else {
                            that.priceContain.push({ source: '', periodicType: "", itemName: "", materialSpec: '', amount: "", doseUnit: "", unitPrice: '', totalPrice: "", flag: true, ids: str })
                        }
                        let newprice = {
                            searchType: "1",
                            deptId: this.deptId
                        }
                        this.$api.confinementRoom.projectList(newprice).then(res => {
                            let arr = [];
                            res.rows.forEach((value, index) => {
                                let object = {
                                    value: value.itemId,
                                    label: value.projectName
                                }
                                // this.priceContain[index].itemId=value.itemId;
                                // this.priceContain[index].productItemType=value.projectTypeId;
                                let newobject = Object.assign(value, object)
                                arr.push(newobject)
                            })
                            this.newPriceoptions = arr;
                            this.AdviceProject = this.deepClone(arr)
                        })
                        // if (that.priceContain, length == 0) {
                        //     that.priceContain.push({})
                        // }
                    })
                })
            } else if (this.topNumber == 1) {
                this.newrecord();
            } else {
                this.pricecost();
            }

        },
        nurse() {
            this.flag = false;
            let that = this;
            this.$refs.Tab.style.left = '10px'
            this.selectDatatable = [];
            let data = {
                customerName: this.Name,
                pageNum: 1,
                pageSize: 20,
                deptId: this.deptId,
                inpatientStatus: '1',
            };
            this.$api.confinementRoom.nurseLeft(data).then(res => {
                if (res.rows.length == 0) {
                    that.Nurse_left = [];
                    that.customerNameList = [];
                    that.listGroup = [];
                    that.priceContain = [];
                    return
                }
                this.$refs.tablelistnurse.setCurrentRow(res.rows[0], true)
                let time = res.rows[0].hospitalTime;
                let newTime = time.substr(0, 10)
                this.daysComputedTime = this.daysComputed(newTime);
                that.Nurse_left = res.rows;
                // for(let j=0;j<50;j++){
                //     that.Nurse_left.push(res.rows[0])
                // }
                that.nurseId = res.rows[0].id;
                that.inHospitalId = res.rows[0].inHospitalId;
                this.priceId = res.rows[0].id
                let ids = {
                    id: this.nurseId,
                    // deptId: this.deptId
                }
                let data = {
                    inHospitalId: that.inHospitalId,
                    pageNum: 1,
                    pageSize: 20,
                    createTimeStart: that.createTimeStart,
                    createTimeEnd: that.createTimeEnd,
                    periodicType: that.radio,
                    medicalAdviceState: that.medicalAdviceState,
                    // medicalAdviceType: that.medicalAdviceType,
                    deptId: this.deptId,
                    dataFlag: '0'
                };
                this.$api.confinementRoom.nurseRightTop(ids).then(res => {

                    that.customerNameList = res.data;
                    this.zerennurse.forEach(value => {
                        if (value.userId == this.customerNameList.nursingPersonnel) {
                            this.customerNameList.nursingPersonnel = value.label
                        }
                    })
                });
                this.$api.confinementRoom.listGroup(data).then(res => {

                    if (res.rows.length == 0) {
                        let datas = {
                            groupNum: '',
                            deptId: this.deptId,
                            detaFlag: '2',
                            inHospitalId: that.inHospitalId,
                        }
                        this.$api.confinementRoom.listPricingContent(datas).then(res => {

                            if (res.rows.length == 0) {
                                that.priceContain = []
                                let str = '';
                                for (let i = 0; i < 8; i++) {
                                    str += Math.floor(Math.random() * 10)
                                }
                                that.priceContain.push({
                                    source: '',
                                    periodicType: "",
                                    itemName: "",
                                    materialSpec: '',
                                    amount: "",
                                    doseUnit: "",
                                    unitPrice: '',
                                    totalPrice: "",
                                    flag: true,
                                    ids: str,
                                })
                            } else {
                                that.priceContain = []

                                that.priceContain = res.rows;
                                that.priceContain.forEach(value => {
                                    value.Isselect = true
                                })
                                this.PriceNumber = that.priceContain.length;
                                let str = '';
                                for (let i = 0; i < 8; i++) {
                                    str += Math.floor(Math.random() * 10)
                                }
                                that.priceContain.push({
                                    source: '',
                                    periodicType: "",
                                    itemName: "",
                                    materialSpec: '',
                                    amount: "",
                                    doseUnit: "",
                                    unitPrice: '',
                                    totalPrice: "",
                                    flag: true,
                                    ids: str,

                                })
                            }
                            let newprice = {
                                searchType: "1",
                                deptId: this.deptId
                            }
                            this.$api.confinementRoom.projectList(newprice).then(res => {
                                let arr = [];
                                res.rows.forEach((value, index) => {
                                    let object = {
                                        value: value.itemId,
                                        label: value.projectName
                                    }
                                    // this.priceContain[index].itemId=value.itemId;
                                    // this.priceContain[index].productItemType=value.projectTypeId;
                                    let newobject = Object.assign(value, object)
                                    arr.push(newobject)
                                })
                                this.newPriceoptions = arr;
                                this.AdviceProject = this.deepClone(arr)
                            })



                        })
                        return;
                    }
                    let Data = [];
                    res.rows.forEach(value => {
                        value.forEach((values, index) => {
                            Data.push(values)
                        })
                    });
                    Data.forEach((value, index) => {
                        let str = '';
                    for (let i = 0; i < 8; i++) {
                        str += Math.floor(Math.random() * 10)
                    }
                    value.ids=str;
                        if (index == 0) {
                            value.flagselct = true
                        } else {
                            value.flagselct = false;
                        }
                    })
                    this.$refs.listGroup.setCurrentRow(Data[0], true);
                    this.selectDatatable.push(Data[0]);
                    this.groupNum = Data[0].groupNum;
                    this.Source = Data[0].source;
                    this.StartTime = Data[0].startTime;
                    this.Endtime = Data[0].endTime;
                    this.periodicType = Data[0].periodicType
                    that.listGroup = Data;
                    let datas = {
                        groupNum: this.groupNum,
                        deptId: this.deptId,
                        detaFlag: '2',
                        inHospitalId: that.inHospitalId,
                    }
                    this.$api.confinementRoom.listPricingContent(datas).then(res => {

                        if (res.rows.length == 0) {
                            that.priceContain = []
                            let str = '';
                            for (let i = 0; i < 8; i++) {
                                str += Math.floor(Math.random() * 10)
                            }
                            that.priceContain.push({
                                source: '',
                                periodicType: "",
                                itemName: "",
                                materialSpec: '',
                                amount: "",
                                doseUnit: "",
                                unitPrice: '',
                                totalPrice: "",
                                flag: true,
                                ids: str,
                            })
                        } else {
                            that.priceContain = []

                            that.priceContain = res.rows;
                            that.priceContain.forEach(value => {
                                value.Isselect = true
                            })
                            this.PriceNumber = that.priceContain.length;
                            let str = '';
                            for (let i = 0; i < 8; i++) {
                                str += Math.floor(Math.random() * 10)
                            }
                            that.priceContain.push({
                                source: '',
                                periodicType: "",
                                itemName: "",
                                materialSpec: '',
                                amount: "",
                                doseUnit: "",
                                unitPrice: '',
                                totalPrice: "",
                                flag: true,
                                ids: str,

                            })
                        }
                        let newprice = {
                            searchType: "1",
                            deptId: this.deptId
                        }
                        this.$api.confinementRoom.projectList(newprice).then(res => {
                            let arr = [];
                            res.rows.forEach((value, index) => {
                                let object = {
                                    value: value.itemId,
                                    label: value.projectName
                                }
                                // this.priceContain[index].itemId=value.itemId;
                                // this.priceContain[index].productItemType=value.projectTypeId;
                                let newobject = Object.assign(value, object)
                                arr.push(newobject)
                            })
                            this.newPriceoptions = arr;
                            this.AdviceProject = this.deepClone(arr)
                        })



                    })

                });

                // that.priceContain
            })


        },
        // time格式为 '2018-08-01或2018/08/01或2018/8/1'
        daysComputed(time) {
            let oldTimeFormat = new Date(time)
            let nowDate = new Date()
            if (nowDate.getTime() - oldTimeFormat.getTime() > 0) {
                let times = nowDate.getTime() - oldTimeFormat.getTime()
                let days = parseInt(times / (60 * 60 * 24 * 1000))
                return days
            } else {
                this.$message.warning('住院日期大于当前日期，无法计算');
                return '0'
                // throw ('传入时间不能大于当前日期')
                // daysComputed('2017-11-1')
            }
        },


        deepClone(obj) {
            // 根据类型制造一个新的数组或对象 => 指向一个新的空间
            // 由于数组的typeof也是'object',所以用Array.isArray(obj)
            var new_obj = Array.isArray(obj) ? [] : {};
            // 首先判断obj的类型
            // 普通类型
            if (typeof obj != 'object') {
                // 这里不能直接返回obj,不然就是浅拷贝的性质
                return new_obj = obj
            }
            //引用类型
            //数组
            if (obj instanceof Array) {
                for (let i = 0; i < obj.length; i++) {
                    new_obj[i] = obj[i];
                    if (typeof new_obj[i] == 'object') {
                        this.deepClone(new_obj[i])
                    }
                }
            } else { //对象
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        // 对象中的数组和对象
                        if (typeof obj[key] == 'object') {
                            new_obj[key] = this.deepClone(obj[key]);
                        } else {//对象中没有引用类型
                            new_obj[key] = obj[key]
                        }
                    }
                }
            }
            return new_obj;
        },
        Isred() {

            return {
                "background": 'red'
            }
        },
        Applys() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (this.cytime == '' || this.cytime == null) {
                        this.$message.warning("请选择出院时间");
                        return
                    }
                    if (this.cytimefs == '') {
                        this.$message.warning("请选择出院方式");
                        return
                    }
                    if (this.cytimeqk == '') {
                        this.$message.warning("请选择出院情况");
                        return
                    }
                    let Start = '';
                    let newobject = ''
                    Start = this.newgetData(this.cytime)
                    let datas = {
                        leaveTime: Start,
                        leaveState: this.cytimeqk,
                        leaveFlag: this.cytimefs,
                        remark: this.remarks,
                        deptId: this.pagination.deptId,
                        deptId: this.deptId,
                        inpatientStatus: '2',
                        jdxxId: this.hospitalList[0].jdxxId,
                        hospitalDoctor: this.hospitalList[0].hospitalDoctor,
                        departmentId: this.hospitalList[0].departmentId,
                        inHospitalId: this.hospitalList[0].inHospitalId
                    }
                    newobject = Object.assign(this.hospitalList[0], datas);
                    newobject.hospitalDischargeDiagnoses = this.discharges;
                    this.$api.confinementRoom.updatedto(newobject).then(res => {
                        if (res.code == 200) {
                            this.$message.success('申请出院成功');
                        }
                        this.getData();
                        this.Apply = false
                    });
                } else {
                    return false;
                }
            });
            // let condition = document.querySelectorAll('.resource');
            // let conditions = document.querySelectorAll('.resources');
            // let arr = [];
            // let Start = '';
            // for (let i = 0; i < condition.length; i++) {
            //     if (i > 0) {
            //         let index = conditions[i].selectedIndex;
            //         let newcondition = {
            //             diagnosisResult: condition[i].value,
            //             cureResult: conditions[i].options[index].value
            //         };
            //         arr.push(newcondition)
            //     }
            // };
            // if (this.cytime == '') {

            // } else {
            //     Start = this.newgetData(this.cytime)
            // }
            // let datas = {
            //     leaveTime: Start,
            //     leaveState: this.cytimeqk,
            //     leaveFlag: this.cytimefs,
            //     remark: this.remarks,
            //     deptId: this.pagination.deptId,
            //     deptId: this.deptId,
            //     inpatientStatus: '2',
            // }
            // let newobject = '';
            // newobject = Object.assign(this.hospitalList[0], datas)
            // newobject.hospitalDischargeDiagnoses = []
            // arr.forEach(value => {
            //     let data = {
            //         diagnosisResult: value.diagnosisResult,
            //         cureResult: value.cureResult,
            //     }
            //     newobject.hospitalDischargeDiagnoses.push(data);discharges

            // });
            return
            // this.$api.confinementRoom.updatedto(newobject).then(res => {
            //     if (res.code == 200) {
            //         this.$message.success('申请出院成功');
            //     }
            //     this.getData();
            //     this.Apply = false
            // });

        },
        handleClose() {

        },
        adddischarges() {
            this.discharges.push({
                diagnosisResult: '',
                cureResult: ""
            })
        },
        //换房
        changeHourse() {
            // this.d
            this.discharges = [
                {
                    diagnosisResult: '',
                    cureResult: ""
                }
            ];
            this.cytime = this.timenow();
            this.cytimefs = '';
            this.cytimeqk = '';
            this.remarks = '';

            this.Apply = true;
            this.bedRoomList = this.hospitalList[0];
        },
        prices() {
            this.listPricingContent = true;
            this.listByGroupNum = false;
            this.listEnforcement = false;
        },
        proofreadAll() {
            this.listPricingContent = false;
            this.listByGroupNum = true;
            this.listEnforcement = false;
            let datas = {
                groupNum: this.groupNum,
                deptId: this.deptId,
                inHospitalId: this.inHospitalId
            }
            this.$api.confinementRoom.listByGroupNum(datas).then(res => {
                let Data = []
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                })
                this.newlistByGroupNum = Data;

            });

        },
        listEnforcementAll() {
            this.listPricingContent = false;
            this.listByGroupNum = false;
            this.listEnforcement = true;
            let datas = {
                groupNum: this.groupNum,
                deptId: this.deptId,
                inHospitalId: this.inHospitalId
            }
            this.$api.confinementRoom.listEnforcement(datas).then(res => {
                if (res.total == 0) {
                    this.newlistEnforcement = [];
                    return
                }
                let Data = []
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                })
                this.newlistEnforcement = Data;

            });
        },
        handleClicks(data, node, b) {
            let datas = {};

            if (this.groupType == '0') {
                if (node.childNodes.length == 0) {
                    // alert('121')
                    datas = {
                        inHospitalId: this.inHospitalId,
                        expenseType: node.parent.data.label.split(' ')[0],
                        itemName: data.label.split(' ')[0],
                        deptId: this.deptId
                    }
                } else {

                    datas = {
                        inHospitalId: this.inHospitalId,
                        expenseType: data.label.split(' ')[0],
                        itemName: '',
                        deptId: this.deptId
                    }
                }

                if (this.radio_tree == '1') {
                    this.fyListAll = []
                    this.$api.confinementRoom.expenseSummaryList(datas).then(res => {
                        this.fyListAll = res.rows;

                    });
                } else {
                    this.fyList = []
                    this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
                        this.fyList = res.rows;

                    });
                }
            }
            else if (this.groupType == this.inHospitalId) {

                if (node.childNodes.length == 0) {
                    datas = {
                        inHospitalId: this.inHospitalId,
                        expenseType: data.label.split(' ')[0],
                        pricingTime: node.parent.data.label.split(' ')[0],
                        deptId: this.deptId
                    }
                } else {
                    datas = {
                        inHospitalId: this.inHospitalId,
                        expenseType: data.label.split(' ')[0],
                        pricingTime: node.childNodes[0].label.split(' ')[0],
                        deptId: this.deptId
                    }
                }
                if (this.radio_tree == '1') {
                    // alert('21212')
                    this.fyListAll = []
                    this.$api.confinementRoom.expenseSummaryList(datas).then(res => {
                        this.fyListAll = res.rows;

                    });
                } else {
                    this.fyList = []
                    this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
                        this.fyList = res.rows;

                    });
                }


            } else {
                if (node.childNodes.length == 0) {

                    if (this.groupType == '2') {
                        datas = {
                            inHospitalId: this.inHospitalId,
                            expenseType: node.parent.data.label.split(' ')[0],
                            pricingTime: data.label.split(' ')[0],
                            deptId: this.deptId
                        }
                    }
                    if (this.groupType == '1') {
                        datas = {
                            inHospitalId: this.inHospitalId,
                            expenseType: data.label.split(' ')[0],
                            pricingTime: node.parent.data.label.split(' ')[0],
                            deptId: this.deptId
                        }
                    }

                } else {
                    if (this.groupType == '2') {
                        datas = {
                            inHospitalId: this.inHospitalId,
                            expenseType: data.label.split(' ')[0],
                            pricingTime: node.childNodes[0].data.label.split(' ')[0],
                            deptId: this.deptId
                        }
                    } else {
                        datas = {
                            inHospitalId: this.inHospitalId,
                            //记录返回
                            expenseType: node.childNodes[0].data.label.split(' ')[0],
                            // expenseType: "",
                            pricingTime: data.label.split(' ')[0],
                            deptId: this.deptId
                        }
                    }

                }

                if (this.radio_tree == '0') {
                    // alert('2222')
                    this.fyList = []
                    this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
                        this.fyList = res.rows;

                    });
                } else {
                    // alert('2222')
                    this.fyListAll = [];
                    this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
                        this.fyListAll = res.rows;

                    });
                }

            }

            // if()
        },
        addPrice() {
            // this.priceContain.push({ flag: false })；
            let str = '';
            for (let i = 0; i < 8; i++) {
                str += Math.floor(Math.random() * 10)
            }
            this.priceContain.push({
                source: '',
                periodicType: "",
                itemName: "",
                materialSpec: '',
                amount: "",
                doseUnit: "",
                unitPrice: '',
                totalPrice: "",
                flag: false,
                ids: str,
                Isselectol: true,
            })
        },
        groupTypesChange(value) {

            let that = this;
            let data = {
                inHospitalId: this.inHospitalId,
                groupType: value,
                deptId: this.deptId
            }
            this.$api.confinementRoom.expenseTypeGroup(data).then(res => {
                that.costs_tree = res.rows;
                let data = {};
                if (this.radio_tree == '0') {
                    if (value == '0') {
                        data = {
                            inHospitalId: this.inHospitalId,
                            // expenseType: that.costs_tree[0].label.split(' ')[0],
                            // itemName: that.costs_tree[0].children[0].label.split(' ')[0],
                            deptId: this.deptId
                        }
                        this.expenseType = that.costs_tree[0].label.split(' ')[0];
                        this.itemName = that.costs_tree[0].children[0].label.split(' ')[0]
                    } else if (value == '1') {
                        data = {
                            inHospitalId: this.inHospitalId,
                            // expenseType: that.costs_tree[0].children[0].label.split(' ')[0],
                            // pricingTime: that.costs_tree[0].label.split(' ')[0],
                            deptId: this.deptId
                        }
                        this.expenseType = that.costs_tree[0].children[0].label.split(' ')[0];
                        this.pricingTime = that.costs_tree[0].label.split(' ')[0]
                    } else {
                        data = {
                            inHospitalId: this.inHospitalId,
                            // expenseType: that.costs_tree[0].label.split(' ')[0],
                            // pricingTime: that.costs_tree[0].children[0].label.split(' ')[0],
                            deptId: this.deptId
                        }
                        this.expenseType = that.costs_tree[0].label.split(' ')[0]
                        this.pricingTime = that.costs_tree[0].children[0].label.split(' ')[0];
                    }

                    this.$api.confinementRoom.hospitalExpenseRecord(data).then(res => {
                        this.fyList = res.rows;
                    });
                } else if (this.radio_tree == '1') {
                    if (value == '0') {
                        data = {
                            inHospitalId: this.inHospitalId,
                            // expenseType: that.costs_tree[0].label.split(' ')[0],
                            // itemName: that.costs_tree[0].children[0].label.split(' ')[0],
                            deptId: this.deptId
                        }
                        this.expenseType = that.costs_tree[0].label.split(' ')[0];
                        this.itemName = that.costs_tree[0].children[0].label.split(' ')[0]
                    } else if (value == '1') {
                        data = {
                            inHospitalId: this.inHospitalId,
                            // expenseType: that.costs_tree[0].children[0].label.split(' ')[0],
                            // pricingTime: that.costs_tree[0].label.split(' ')[0],
                            deptId: this.deptId
                        }
                        this.expenseType = that.costs_tree[0].children[0].label.split(' ')[0];
                        this.pricingTime = that.costs_tree[0].label.split(' ')[0]
                    } else {
                        data = {
                            inHospitalId: this.inHospitalId,
                            // expenseType: that.costs_tree[0].label.split(' ')[0],
                            // pricingTime: that.costs_tree[0].children[0].label.split(' ')[0],
                            deptId: this.deptId
                        }
                        this.expenseType = that.costs_tree[0].label.split(' ')[0],
                            this.pricingTime = that.costs_tree[0].children[0].label.split(' ')[0]
                    }
                    this.$api.confinementRoom.expenseSummaryList(data).then(res => {
                        this.fyListAll = res.rows;

                    });

                }

                // that.hospitalCopyRecords=res.rows;

            })
        },
        searchRecord() {
            let that = this;
            let data = {
                itemName: this.newitemName,
                searchType: this.medicalAdviceType,
                // copyDepartmentName: this.copyDepartmentName,
                feeFlag: this.receiveState,
                inHospitalId: this.inHospitalId,
                deptId: this.deptId

            }
            this.$api.confinementRoom.hospitalCopyRecord(data).then(res => {
                let Data = [];
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                })
                Data.forEach(value => {
                    if (value.periodicType == '0') {
                        value.periodicType = '长期'
                    } else {
                        value.periodicType = '临时'
                    }
                })
                that.hospitalCopyRecords = Data;

            })
        },
        // <span @click="newadvices()">医嘱记录</span>
        //                 <span @click="newrecord()">记录查询</span>
        //                 <span @click="pricecost()">费用记录</span>
        newadvices() {
            this.advices = true;
            this.record = false;
            this.costs = false;
            this.topNumber = 0;
        },
        newrecord() {
            this.topNumber = 1;
            this.advices = false;
            this.record = true;
            this.costs = false;
            let that = this;
            let data = {
                itemName: this.newitemName,
                medicalAdviceType: this.medicalAdviceType,
                copyDepartmentName: this.copyDepartmentName,
                receiveState: this.receiveState,
                inHospitalId: this.inHospitalId,
                deptId: this.deptId

            }
            this.$api.confinementRoom.hospitalCopyRecord(data).then(res => {
                let Data = [];
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                })
                Data.forEach(value => {
                    if (value.periodicType == '0') {
                        value.periodicType = '长期'
                    } else {
                        value.periodicType = '临时'
                    }
                })
                that.hospitalCopyRecords = Data;


            })
            //  itemName medicalAdviceType copyDepartmentName receiveState
        },
        pricecost() {
            this.advices = false;
            this.record = false;
            this.costs = true;
            let that = this;
            this.topNumber = 2
            let data = {
                inHospitalId: this.inHospitalId,
                groupType: this.groupType,
                deptId: this.deptId
            }
            this.$api.confinementRoom.expenseTypeGroup(data).then(res => {
                if (res.rows.length == 0) {
                    that.costs_tree = []
                    that.fyList = [];
                    that.fyListAll = []
                    return
                }
                that.costs_tree = res.rows;
                this.expenseType = that.costs_tree[0].label.split(' ')[0];
                this.itemName = that.costs_tree[0].children[0].label.split(' ')[0];
                let datas = {
                    inHospitalId: this.inHospitalId,
                    // expenseType: this.expenseType,
                    // itemName: this.itemName,
                    deptId: this.deptId,
                }
                if (this.radio_tree == '0') {
                    this.$api.confinementRoom.hospitalExpenseRecord(datas).then(res => {
                        that.fyList = res.rows;
                        // that.hospitalCopyRecords=res.rows;

                    });
                }
                if (this.radio_tree == '1') {
                    this.fyListAll = []
                    // if (this.groupType == '0') {
                    //     let data = {
                    //         inHospitalId: this.inHospitalId,
                    //         deptId: this.deptId
                    //     }
                    //     this.$api.confinementRoom.expenseSummaryList(data).then(res => {
                    //         this.fyListAll = res.rows;

                    //     });
                    // }
                    // if (this.groupType == '1') {
                    //     let data = {
                    //         inHospitalId: this.inHospitalId,
                    //         deptId: this.deptId
                    //     }
                    this.$api.confinementRoom.expenseSummaryList(data).then(res => {
                        this.fyListAll = res.rows;

                    });
                    // }
                }
                // if(this.groupType=='2'){

                // }
                //                     this.$api.confinementRoom.expenseSummaryList(datas).then(res => {
                //                         this.fyListAll = res.rows;

                //                     });
                //                 }


            });



        },
        //保存计价
        Save() {

            let that = this;
            let str = '';
            for (let i = 0; i < 8; i++) {
                str += Math.floor(Math.random() * 10)
            }
            let newPrice = [];
            this.priceContain.forEach(value => {
                value.source = '护士计价';
                value.inHospitalId = this.inHospitalId;
                value.deptId = this.deptId;
                value.materialSpec = value.specs;
                // value.amount = value.priceNum,
                value.id = this.priceId;
                this.newPriceoptions.forEach(newvalue => {
                    if (value.itemName == newvalue.value) {
                        value.itemName = newvalue.label
                    }
                })
                let data = {
                    parentGroupNum: this.groupNum,
                    dataFlag: "2",
                    groupNum: this.groupNum,
                    periodicType: this.periodicType,
                    startTime: this.StartTime,
                    endTime: this.Endtime,
                    //         Endtime:"",
                    // StartTime:"",
                    // periodicType:"",

                }
                let object = Object.assign(value, data)
                newPrice.push(object)
            });
            let newPriceNumber = [];
            for (let num = this.PriceNumber; num < newPrice.length; num++) {
                newPriceNumber.push(newPrice[num])
            };
            if (newPriceNumber.length == 0) {
                this.$message.warning('请先添加医嘱在进行计价');
                return
            }
            let flag = false;
            let newpriceList = [];
            let Indexlist = ''
            if (newPriceNumber.length == 1) {
                newPriceNumber.forEach((value, index) => {
                    if (value.expense == 0) {
                        Indexlist = index
                        flag = true;
                    }
                })
            } else {
                newPriceNumber.forEach(value => {
                    if (value.expense !== 0) {
                        newpriceList.push(value)
                    }
                    newPriceNumber = newpriceList;
                })
            }

            if (flag) {
                this.$message.warning("计价金额不能为0");
                // that.$refs.tablelistmenu.setCurrentRow(this.priceContain[Indexlist],true)
                return;
            }
            this.$api.confinementRoom.addBatch(newPriceNumber).then(res => {
                if (res.code == 200) {
                    this.$message.success('护士计价成功');
                }

                this.priceContain = [];
                let datas = {
                    groupNum: this.groupNum,
                    deptId: this.deptId,
                    detaFlag: '2',
                    inHospitalId: this.inHospitalId
                }
                this.$api.confinementRoom.listPricingContent(datas).then(res => {

                    if (res.rows.length == 0) {
                        that.priceContain = []
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        that.priceContain.push({
                            source: '',
                            periodicType: "",
                            itemName: "",
                            materialSpec: '',
                            amount: "",
                            doseUnit: "",
                            unitPrice: '',
                            totalPrice: "",
                            flag: true,
                            ids: str,
                        })
                    } else {
                        that.priceContain = []

                        that.priceContain = res.rows;
                        that.priceContain.forEach(value => {
                            value.Isselect = true
                        })
                        this.PriceNumber = that.priceContain.length;
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        that.priceContain.push({
                            source: '',
                            periodicType: "",
                            itemName: "",
                            materialSpec: '',
                            amount: "",
                            doseUnit: "",
                            unitPrice: '',
                            totalPrice: "",
                            flag: true,
                            ids: str,
                        })
                    }
                    let newprice = {
                        searchType: "1",
                        deptId: this.deptId
                    }
                    this.$api.confinementRoom.projectList(newprice).then(res => {
                        let arr = [];
                        res.rows.forEach((value, index) => {
                            let object = {
                                value: value.itemId,
                                label: value.projectName
                            }
                            // this.priceContain[index].itemId=value.itemId;
                            // this.priceContain[index].productItemType=value.projectTypeId;
                            let newobject = Object.assign(value, object)
                            arr.push(newobject)
                        })
                        this.newPriceoptions = arr;
                        this.AdviceProject = this.deepClone(arr)
                    })



                })
            })
            // this.priceContain.inHospitalId = this.inHospitalId
            // this.$api.confinementRoom.addBatch(data).then(res => {

            // })
        },
        //状态改变
        stateChange(value) {
            this.medicalAdviceState = value
            this.RightgetData()
        },
        //类型改变
        TypeChange(value) {
            this.medicalAdviceType = value
            this.RightgetData()
        },
        //时间转换
        newDate(time) {
            var date = new Date(time)
            var y = date.getFullYear()
            var m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            var d = date.getDate()
            d = d < 10 ? '0' + d : d
            return y + '-' + m + '-' + d
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {


        },
        //自动加载右侧菜单
        RightgetData() {
            let that = this;
            if (this.inHospitalId == '') {
                return
            }
            let data = {
                inHospitalId: this.inHospitalId,
                pageNum: 1,
                pageSize: 20,
                createTimeStart: this.createTimeStart,
                createTimeEnd: this.createTimeEnd,
                periodicType: this.radio,
                medicalAdviceState: this.medicalAdviceState,
                searchType: this.medicalAdviceType,
                // medicalAdviceType: this.medicalAdviceType,
                deptId: this.deptId,
                dataFlag: 0,
            };

            this.$api.confinementRoom.listGroup(data).then(res => {
                if (res.rows.length == 0) {
                    that.listGroup = [];
                    that.priceContain = [];
                    return
                }
                let Data = [];
                res.rows.forEach(value => {
                    value.forEach(values => {
                        Data.push(values)
                    })
                })
                this.groupNum = Data[0].groupNum;
                this.Source = Data[0].source;
                this.StartTime = Data[0].startTime;
                this.Endtime = Data[0].endTime;
                this.periodicType = Data[0].periodicType
                that.listGroup = Data;
                let datas = {
                    groupNum: this.groupNum,
                    deptId: this.deptId,
                    detaFlag: '2'
                }
                this.$api.confinementRoom.listPricingContent(datas).then(res => {
                    if (res.rows.length == 0) {
                        that.priceContain = []
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        that.priceContain.push({
                            source: '',
                            periodicType: "",
                            itemName: "",
                            materialSpec: '',
                            amount: "",
                            doseUnit: "",
                            unitPrice: '',
                            totalPrice: "",
                            flag: true,
                            ids: str,
                        })
                    } else {
                        that.priceContain = []
                        that.priceContain = res.rows;
                        that.priceContain.forEach(value => {
                            value.Isselect = true
                        })
                        this.PriceNumber = that.priceContain.length;
                        let str = '';
                        for (let i = 0; i < 8; i++) {
                            str += Math.floor(Math.random() * 10)
                        }
                        that.priceContain.push({
                            source: '',
                            periodicType: "",
                            itemName: "",
                            materialSpec: '',
                            amount: "",
                            doseUnit: "",
                            unitPrice: '',
                            totalPrice: "",
                            flag: true,
                            ids: str,
                        })
                    }
                    let newprice = {
                        searchType: "1",
                        deptId: this.deptId
                    }
                    this.$api.confinementRoom.projectList(newprice).then(res => {
                        let arr = [];
                        res.rows.forEach((value, index) => {
                            let object = {
                                value: value.itemId,
                                label: value.projectName
                            }
                            // this.priceContain[index].itemId=value.itemId;
                            // this.priceContain[index].productItemType=value.projectTypeId;
                            let newobject = Object.assign(value, object)
                            arr.push(newobject)
                        })
                        this.newPriceoptions = arr;
                        this.AdviceProject = this.deepClone(arr)
                    })



                })

            })
        },
        newhandle(row) {
            switch (row.executingState) {
                case 0:
                    return '草稿'
                    break;
                case 1:
                    return '提交'
                    break;
                case 2:
                    return '校对'
                    break;
                case 3:
                    return '已抄送'
                    break;
                case 6:
                    return '待停止'
                    break;
                case 7:
                    return '已停止'
                    break;
                //0:长期; 1:临时; 2:出院带药
            }
        },
        handle(row) {
            //状态 0:草稿; 1.提交; 2:校对; 3:已抄送; 4:待执行; 5:已完成; 6:待停止; 7:已停止; 8:作废
            switch (row.executingState) {
                case 0:
                    return row.executingState = '草稿'
                    break;
                case 1:
                    return row.executingState = '提交'
                    break;
                case 2:
                    return row.executingState = '校对'
                    break;
                case 3:
                    return row.executingState = '已抄送'
                    break;
                case 5:
                    return row.executingState = '已完成'
                    break;
                case 8:
                    return row.executingState = '作废'
                    break;
                case 6:
                    return row.executingState = '待停止'
                    break;
                case 7:
                    return row.executingState = '已停止'
                    break;
                //0:长期; 1:临时; 2:出院带药
            }
            switch (row.periodicType) {
                case '0':
                    return row.periodicType = '长期'
                    break;
                case '1':
                    return row.periodicType = '临时'
                    break;
                case '2':
                    return row.periodicType = '出院带药'
                    break;
                case '3':
                    return row.periodicType = '长期'
                    break;
                case '4':
                    return row.periodicType = '临时'
                    break;
            }
        },
        //搜索护理左侧
        search_left() {
            let that = this;
            let data = {
                customerName: this.Name,
                pageNum: 1,
                pageSize: 20,
                deptId: this.deptId,
                inpatientStatus: '1',
            };
            this.$api.confinementRoom.nurseLeft(data).then(res => {
                that.Nurse_left = res.rows

            })
        },
        proofread() {
            this.$router.push('/proofread')
        },
        duplicate() {
            this.$router.push('/duplicate')
        },
        detection() {
            this.$router.push('/detection')
        },
        advice() {
            this.$router.push('/advice')
        },
        print() {
            this.$router.push('/print')
        },
        pharmacy() {
            this.$router.push('/pharmacy')
        },

        Nonurse() {
            this.$refs.Tab.style.right = '50px'
            this.$refs.Tab.style.left = ''
            this.flag = true


        },
        newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        },
        /**
         * @author Nevin
         * @date 2022/8/18
         * @Description: 获取房间类型
        */
        getRoomTypeList() {
            const data = {
                deptId: this.pagination.deptId,
                state: '0',
                floorId: '',
            }
            this.$api.confinementRoom.RoomTypeInfoList(data).then(res => {
                if (res) {
                    // this.roomTypeList = res.rows
                }
            })
        },
        /**
         * @author Nevin
         * @date 2022/8/18
         * @Description: 获取房间列表
        */
        getFloorList() {
            const data = {
                deptId: this.pagination.deptId,
                state: '0'
            }
            this.$api.confinementRoom.floorInfoList(data).then(res => {
                if (res) {
                    this.floorList = res.rows
                }
            })
        },
        /**
         * @author Nevin
         * @date 2022/7/4
         * @Description: 房子卡片class
        */
        roomCardClass(item) {
            if (item.checkStatus === '2') {
                return 'card'
            }
            if (item.checkStatus === '0' || item.checkStatus === '1') {
                return 'noCard'
            }
        },
        /**
         * @author Nevin
         * @date 2022/7/4
         * @Description:
        */
        headerClass(item) {
            if (item.checkStatus === '2') {
                return 'cardHeader'
            }
            if (item.checkStatus === '0' || item.checkStatus === '1') {
                return 'notCardHeader'
            }
        },
        /**
         * @author Nevin
         * @date 2022/6/13
         * @Description: 房间状态
        */
        roomStatus(str) {
            const obj = this.dict.type.Room_status.find(item => item.value === str)
            return obj ? obj.label : ''
        },
        /**
         * @author Nevin
         * @date 2022/6/13
         * @Description: 民族
         */
        nationName(str) {
            const obj = this.dict.type.nation_list.find(item => item.value === str)
            return obj ? obj.label : ''
        },
        /**
         * @author Nevin
         * @date 2022/7/1
         * @Description: 获取房间搜索
        */
        getRoomList() {
            this.loadingData = true
            var data = {
                deptId: this.deptId,
                businessType: this.changeRoom.roomTypeId,
                bedStatus: '0',
                // day: this.changeForm.roomDays,
                // roomName: this.changeRoom.roomName,
                // floorId: this.changeRoom.floorId,
                // roomTypeId: this.changeRoom.roomTypeId
            }
            this.$api.confinementRoom.RoomTypeInfoList(data).then(res => {
                if (res) {
                    this.roomData = res.rows;
                    this.roomPagination.total = res.total
                }
            }).finally(() => {
                this.loadingData = false
            })
        },
        /**
         * @author Nevin
         * @date 2022/7/11
         * @Description: 暂停划扣
        */
        pauseDeduction() {
            this.$api.billingList.updateRoomStart({
                'roomReservationId': this.roomForm.roomReservationId,
                'waitId': this.roomForm.waitId
            }).then(res => {
                if (res) {
                    submitChangeForm
                    this.$message.success(res.msg)
                }
            })
        },
        /**
         * @author Nevin
         * @date 2022/7/1
         * @Description: 换房提交
        */
        submitChangeForm() {
            // this.$refs.roomForm.validate((valid) => {
            //     if (valid) {
            // this.loadingSubmit = true
            // inhospitalID roomId roomname bedId bedName
            if (this.changeSelectionData.length == 0) {
                this.$message.warning("请选择一个床位信息");
                return
            }
            var data = {
                inHospitalId: this.hospitalList[0].inHospitalId,
                roomId: this.changeSelectionData[0].roomId,
                roomName: this.changeSelectionData[0].roomName,
                bedId: this.changeSelectionData[0].bedId,
                bedNumber: this.changeSelectionData[0].bedNumber,
            }


            this.$api.confinementRoom.hospitalInfo(data).then(res => {
                if (res) {
                    this.$message({
                        message: '换床成功',
                        type: 'success'
                    })
                    this.getData()
                    this.loadingSubmit = false
                    this.showChangeDialog = false
                }
            })
            // }
            // })
        },
        /**
         * @author Nevin
         * @date 2022/6/22
         * @Description: 划卡
        */
        swipeCard() {
            if (this.roomForm.checkStatus !== '2') {
                this.$message.warning('这个房间还是空的，不能去划卡(●ˇ∀ˇ●)')
            } else {
                this.$router.push({ path: 'birthRegistration', query: { customerName: this.roomForm.customerName } })
            }
        },
        /**
         * @author Nevin
         * @date 2022/6/22
         * @Description: 续住
        */
        continued() {

        },
        /**
         * @author Nevin
         * @date 2022/6/22
         * @Description: 退房/退预约
        */
        checkOut() {
            if (this.roomForm.checkStatus === '1') {
                this.$confirm('真的要取消这个预约嘛＞﹏＜？', '警告', {
                    confirmButtonText: '是的',
                    cancelButtonText: '再想想',
                    type: 'warning'
                }).then(async () => {
                    this.$api.confinementRoom.editRoomReservation({
                        roomReservationId: this.roomForm.roomReservationId,
                        checkStatus: '4'
                    }).then(res => {
                        if (res) {
                            this.getData()
                            this.$message.success(res.msg)
                        }
                    })
                })
            } else if (this.roomForm.checkStatus === '2') {
                this.$confirm('真的要退房嘛＞﹏＜？', '警告', {
                    confirmButtonText: '是的',
                    cancelButtonText: '再想想',
                    type: 'warning'
                }).then(async () => {
                    this.$api.confinementRoom.editRoomReservation({
                        roomReservationId: this.roomForm.roomReservationId,
                        checkStatus: '3'
                    }).then(res => {
                        if (res) {
                            this.getData()
                            this.$message.success(res.msg)
                        }
                    })
                })
            } else {
                this.$message.warning("这个房间没有入住/预约信息，不需要操作(●'◡'●)~")
            }
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 顾客入住
        */
        customerRoom() {
            this.getCustomerInfo()
            this.showDialog = true;
            this.roomForm.aestheticConsultant = ''
            this.roomForm.nurse = '';
            this.roomForm.customerName = ''
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 关闭开单弹窗
        */
        closeRoomDialog() {
            this.roomForm.customerName = ''
            this.roomForm.customPhone = ''
            this.roomForm.customCardNumber = ''
            this.roomForm.customAge = ''
            this.roomForm.checkStatus = ''
            this.roomForm.aestheticConsultant = ''
            this.roomForm.nurse = ''
            this.roomForm.maternityMatron = ''
            this.roomForm.chanKangShi = ''
            this.roomForm.checkReservationTime = this.getTodayData()
            this.roomForm.roomDays = ''
            this.roomForm.checkOutTime = ''
            this.roomForm.remark = ''
            this.searchBar = {
                customerName: '',
                customPhone: '',
                customCardNumber: ''
            }
            this.formNot.customerName = ''
            this.formNot.customPhone = ''
            this.formNot.aestheticConsultant = ''
            this.selectionData = []
            this.customerDatas = []
            this.showDialog = false
            this.Apply = false;
        },
        timeFmt(fmt, time) {
            if (!time) {
                return ''
            } else {
                if (!fmt) {
                    fmt = 'YYYY-mm-dd HH:MM:SS'
                }
                let ret
                var date = new Date(time)
                const opt = {
                    'Y+': date.getFullYear().toString(), // 年
                    'm+': (date.getMonth() + 1).toString(), // 月
                    'd+': date.getDate().toString(), // 日
                    'H+': date.getHours().toString(), // 时
                    'M+': date.getMinutes().toString(), // 分
                    'S+': date.getSeconds().toString() // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (const k in opt) {
                    ret = new RegExp('(' + k + ')').exec(fmt)
                    if (ret) {
                        fmt = fmt.replace(
                            ret[1],
                            ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
                        )
                    }
                }
                return fmt
            }
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 入住提交 弹框顾客入住
        */
        submitRoomForm() {
            // 获取当前时间 未预约顾客住院使用当前时间
            const yy = new Date().getFullYear()
            const mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
            const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
            const today = yy + '-' + mm + '-' + dd;
            if (this.roomForm.customerName == '') {
                this.$message.warning('请选择一名顾客');
                return
            }
            if (this.roomForm.aestheticConsultant == '') {
                this.$message.warning('请选择责任医生');
                return
            }
            if (this.roomForm.nurse == '') {
                this.$message.warning('请选择责任护士');
                return
            }
            if (this.roomForm.checkReservationTime == '' || this.roomForm.checkReservationTime == null) {
                this.$message.warning('请选择入住时间');
                return
            }
            //  if(typeof this.roomForm.aestheticConsultant=='string'){
            //     this.roomForm.aestheticConsultant=this.a;
            //     this.roomForm.nurse=this.b
            //  }
            let data = {
                hospitalDoctor: typeof this.roomForm.aestheticConsultant == 'string' ? this.foctor : this.roomForm.aestheticConsultant,
                nursingPersonnel: typeof this.roomForm.aestheticConsultant == 'string' ? this.newfoctor : this.roomForm.nurse,
                inHospitalId: this.inHospitalId,
                bedNumber: this.roomForm.roomName,
                roomType: this.roomForm.roomType,
                roomNumber: this.roomForm.roomNumber,
                roomName: this.roomNames,
                customerName: this.roomForm.customerName,
                nurse: this.roomForm.nurse,
                hospitalTime: this.roomForm.checkReservationTime ? this.roomForm.checkReservationTime + ' ' + this.timeFmt('HH:MM:SS', new Date()) : today + ' ' + this.timeFmt('HH:MM:SS', new Date()),
                checkReservationTime: this.roomForm.checkReservationTime ? this.roomForm.checkReservationTime : today,
                deptId: this.deptId,
                wardNo: this.hospitalList[0].roomName,
                roomId: this.hospitalList[0].roomId,
                bedId: this.hospitalList[0].bedId,
                bedNumber: this.hospitalList[0].bedNumber,
                inpatientStatus: '1',
                id: this.listname.id,

            }
            this.$api.confinementRoom.hospitalInfo(data).then(res => {
                if (res.code == 200) {
                    this.$message.success('入住成功');
                    this.getData();
                    this.showDialog = false
                }
            })
            // 表单校验
            // this.$refs['roomForm'].validate(valid => {
            //     if (valid) {
            //         // 入住日期加入住天数 计算退房时间
            //         let date = new Date(this.roomForm.checkReservationTime) // 入住日期
            //         date = date.getFullYear() + '-' +
            //             (date.getMonth() + 1) + '-' + // 这里加1是因为getMonth()的返回值是为0~11
            //             date.getDate()
            //         date = Date.parse(new Date(date)) / 1000 // 转换成时间戳，返回值是ms，除1000后转化成秒
            //         date += math.multiply((86400), this.roomForm.roomDays) // 一天是86400秒 入住天数
            //         const newDate = new Date(parseInt(date) * 1000) // 把时间戳转换成日期
            //         const time = newDate.getFullYear() + '-' + // 计算的值
            //             (newDate.getMonth() + 1) + '-' +
            //             newDate.getDate()
            //         // 拿到数据 id
            //         this.sysUserList.forEach(res => {
            //             if (this.roomForm.aestheticConsultant === res.label) {
            //                 this.roomForm.aestheticConsultant = res.value
            //             }
            //         })
            //         if (this.isAppointment === 1) {
            //             this.loadingSubmit = true
            //             var dataPost = {
            //                 id: this.roomForm.id === undefined ? this.selectionData[0].id : this.roomForm.id,
            //                 roomId: this.roomForm.roomId,
            //                 roomReservationId: this.roomForm.roomReservationId,
            //                 aestheticConsultant: this.roomForm.aestheticConsultant,
            //                 chanKangShi: this.roomForm.chanKangShi,
            //                 nurse: this.roomForm.nurse,
            //                 maternityMatron: this.roomForm.maternityMatron,
            //                 checkOutTime: time,
            //                 checkStatus: '2',
            //                 pauseDeduction: '0',
            //                 departmenId: this.selectionData[0].departmenId,
            //                 waitId: this.selectionData[0].waitId,
            //                 jdxxId: this.selectionData[0].jdxxId,
            //                 roomAmount: this.selectionData[0].totalPayment, // 金额
            //                 remainingAmount: this.selectionData[0].totalPayment, // 金额
            //                 subscribeTime: this.selectionData[0].checkReservationTime === undefined ? today : this.selectionData[0].checkReservationTime,
            //                 checkTime: this.roomForm.checkReservationTime,
            //                 roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
            //                 remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
            //                 remark: this.roomForm.remark,
            //                 departmentId: this.roomForm.departmentId
            //             }
            //             this.$api.confinementRoom.editRoomReservation(dataPost).then(res => {
            //                 if (res) {
            //                     this.getData()
            //                     this.$message.success(res.msg)
            //                     this.showDialog = false
            //                     this.resetForm()
            //                     this.Arrived()
            //                     // 清空 顾客入住信息
            //                     this.roomForm.customerName = ''
            //                     this.roomForm.customPhone = ''
            //                     this.roomForm.customCardNumber = ''
            //                     this.roomForm.customAge = ''
            //                     this.roomForm.checkStatus = ''
            //                     this.roomForm.aestheticConsultant = ''
            //                     this.roomForm.nurse = ''
            //                     this.roomForm.maternityMatron = ''
            //                     this.roomForm.chanKangShi = ''
            //                     this.roomForm.checkReservationTime = this.getTodayData()
            //                     this.roomForm.roomDays = ''
            //                     this.roomForm.checkOutTime = ''
            //                     this.roomForm.remark = ''
            //                     this.searchBar = {
            //                         customerName: '',
            //                         customPhone: '',
            //                         customCardNumber: ''
            //                     }
            //                     this.formNot.customerName = ''
            //                     this.formNot.customPhone = ''
            //                     this.formNot.aestheticConsultant = ''
            //                 }
            //             }).finally(() => {
            //                 this.loadingSubmit = false
            //             })
            //         } else {
            //             this.loadingSubmit = true
            //             var dataput = {
            //                 id: this.roomForm.id === undefined ? this.roomForm.id : this.selectionData[0].id,
            //                 roomId: this.roomForm.roomId,
            //                 roomReservationId: this.roomForm.roomReservationId,
            //                 aestheticConsultant: this.roomForm.aestheticConsultant,
            //                 chanKangShi: this.roomForm.chanKangShi,
            //                 nurse: this.roomForm.nurse,
            //                 maternityMatron: this.roomForm.maternityMatron,
            //                 checkOutTime: time,
            //                 checkStatus: '2',
            //                 pauseDeduction: '0',
            //                 totalAmount: this.roomForm.totalAmount,
            //                 departmenId: this.selectionData[0].departmenId,
            //                 waitId: this.selectionData[0].waitId,
            //                 jdxxId: this.selectionData[0].jdxxId,
            //                 roomAmount: this.roomForm.totalAmount, // 金额
            //                 remainingAmount: this.roomForm.totalAmount, // 金额
            //                 checkReservationTime: today,
            //                 subscribeTime: this.selectionData[0].checkReservationTime === undefined ? today : this.selectionData[0].checkReservationTime,
            //                 checkTime: this.roomForm.checkReservationTime,
            //                 roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
            //                 remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
            //                 remark: this.roomForm.remark,
            //                 departmentId: this.roomForm.departmentId
            //             }
            //             this.$api.confinementRoom.addRoomReservation(dataput).then(res => {
            //                 if (res) {
            //                     this.getData()
            //                     this.roomForm.checkReservationTime = ''
            //                     this.$message.success(res.msg)
            //                     this.showDialog = false
            //                     this.resetForm()
            //                     this.Arrived()
            //                     // 清空 顾客入住信息
            //                     this.roomForm.customerName = ''
            //                     this.roomForm.customPhone = ''
            //                     this.roomForm.customCardNumber = ''
            //                     this.roomForm.customAge = ''
            //                     this.roomForm.checkStatus = ''
            //                     this.roomForm.aestheticConsultant = ''
            //                     this.roomForm.nurse = ''
            //                     this.roomForm.maternityMatron = ''
            //                     this.roomForm.chanKangShi = ''
            //                     this.roomForm.roomDays = ''
            //                     this.roomForm.checkOutTime = ''
            //                     this.roomForm.remark = ''
            //                     this.searchBar = {
            //                         customerName: '',
            //                         customPhone: '',
            //                         customCardNumber: ''
            //                     }
            //                     this.formNot.customerName = ''
            //                     this.formNot.customPhone = ''
            //                     this.formNot.aestheticConsultant = ''
            //                 }
            //             }).finally(() => {
            //                 this.loadingSubmit = false
            //             })
            //         }
            //     }
            // })
        },
        /**
         * @author Nevin
         * @date 2022/6/13
         * @Description: 确定并开单
        */
        submitRoomFormBilling() {
            this.$refs['roomForm'].validate(valid => {
                if (valid) {
                    if (this.roomForm.roomReservationId !== undefined) {
                        this.loadingSubmit = true
                        this.$api.confinementRoom.editRoomReservation({
                            id: this.roomForm.id,
                            roomId: this.roomForm.roomId,
                            roomReservationId: this.roomForm.roomReservationId,
                            aestheticConsultant: this.roomForm.aestheticConsultant,
                            chanKangShi: this.roomForm.chanKangShi,
                            nurse: this.roomForm.nurse,
                            maternityMatron: this.roomForm.maternityMatron,
                            checkOutTime: this.roomForm.checkOutTime,
                            checkStatus: '2',
                            checkReservationTime: this.roomForm.checkReservationTime,
                            roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
                            remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
                            remark: this.roomForm.remark,
                            departmentId: this.roomForm.departmentId
                        }).then(res => {
                            if (res) {
                                this.getData();
                                this.$message.success(res.msg)
                                this.showDialog = false
                                this.$router.push({ path: 'confinementBilling', query: { billing: JSON.stringify(this.roomForm) } })
                                this.resetForm()
                            }
                        }).finally(() => {
                            this.loadingSubmit = false
                        })
                    } else {
                        this.loadingSubmit = true
                        this.$api.confinementRoom.addRoomReservation({
                            id: this.roomForm.id,
                            roomId: this.roomForm.roomId,
                            aestheticConsultant: this.roomForm.aestheticConsultant,
                            chanKangShi: this.roomForm.chanKangShi,
                            nurse: this.roomForm.nurse,
                            maternityMatron: this.roomForm.maternityMatron,
                            checkOutTime: this.roomForm.checkOutTime,
                            checkStatus: '2',
                            checkReservationTime: this.roomForm.checkReservationTime,
                            roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
                            remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
                            remark: this.roomForm.remark,
                            departmentId: this.roomForm.departmentId
                        }).then(res => {
                            if (res) {
                                this.getData()
                                this.$message.success(res.msg)
                                this.showDialog = false
                                this.$router.push({ path: 'confinementBilling', query: { billing: JSON.stringify(this.roomForm) } })
                                this.resetForm()
                                this.notgetCustomerInfo()
                            }
                        }).finally(() => {
                            this.loadingSubmit = false
                        })
                    }
                }
            })
        },

        /**
         * @author Nevin
         * @date 2022/6/15
         * @Description: 关闭换房弹窗
        */
        closeChangeDialog() {
            this.showChangeDialog = false
            this.changeForm = {
                id: 0,
                customerName: undefined,
                customPhone: undefined,
                customCardNumber: undefined,
                customAge: undefined,
                oldRoomId: undefined,
                oldRoomName: undefined,
                roomDays: undefined,
                waitId: undefined,
                roomId: undefined,
                floorNumber: undefined,
                roomType: undefined,
                roomNumber: undefined,
                roomName: undefined,
                defaultDays: undefined,
                defaultCharge: undefined
            }
            this.changeSelectionData = []
        },
        /**
         * @author Nevin
         * @date 2022/6/15
         * @Description: 储值选择
        */
        selectData(e) {
            this.rechargeableCard.forEach(item => {
                if (item.rechargeCardId === e) {
                    this.form.rechargeAmount = item.rechargeAmount
                    this.form.giftAmount = item.giftAmount
                    this.form.totaAmount = math.add(item.rechargeAmount, item.giftAmount)
                    this.form.paidAmount = item.rechargeAmount
                }
            })
        },
        /**
         * @author Nevin
         * @date 2022/7/11
         * @Description: 获取今天日期
        */
        getTodayData() {
            var time = new Date()
            var day = ('0' + time.getDate()).slice(-2)
            var month = ('0' + (time.getMonth() + 1)).slice(-2)
            this.todayData = time.getFullYear() + '-' + month + '-' + day
            return this.todayData
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 获取预约用户
        */
        getCustomerInfo() {
            let that = this;
            let data = {
                customerName: this.searchBar.customerName,
                pageNum: 1,
                pageSize: 20,
                deptId: this.deptId,
                inpatientStatus: '0',
            };
            this.$api.confinementRoom.nurseLeft(data).then(res => {
                this.customerData = res.rows;
                this.zerendoctor.forEach(value => {
                    // alert(this.roomForm.aestheticConsultant)
                    // if (value.userId == res.rows[0].hospitalDoctor) {
                    //     this.roomForm.aestheticConsultant = value.label;
                    // }
                })
                this.zerennurse.forEach(value => {
                    // if (value.userId == res.rows[0].nursingPersonnel) {
                    //     this.roomForm.nurse = value.label;
                    // }
                })
            })

            // this.$set(this.searchBar, 'deptId', this.deptId)
            // this.$set(this.searchBar, 'roomId', this.roomForm.roomId)
            // this.$set(this.searchBar, 'checkStatus', '1')
            // this.$api.billingList.selectRoomAppointment({
            //     ...this.pagination,
            //     ...this.searchBar
            // }).then(res => {
            //     if (res) {
            //         this.customerData = res.rows
            //         this.pagination.total = res.total
            //     }
            // })
        },
        // 未预约顾客入住
        notgetCustomerInfo() {
            var data = {
                deptId: this.deptId,
                customPhone: this.formNot.customPhone,
                customerName: this.formNot.customerName,
                aestheticConsultant: this.formNot.aestheticConsultant
            }
            data = Object.assign(data, this.pagination)
            this.$api.billingList.roomBill(data).then(res => {
                if (res) {
                    this.customerDatas = res.rows
                    this.pagination.total = res.total
                }
            })
        },
        timenow() {
            var d = new Date(), str = '';
            str += d.getFullYear() + '-';
            str += d.getMonth() + 1 + '-';
            str += d.getDate();
            return str;
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 重置表单
        */
        resetForm() {
            this.roomForm = {
                id: 0,
                roomId: 0,
                floorNumber: '',
                roomType: '',
                roomNumber: '',
                roomName: '',
                defaultDays: '',
                defaultCharge: '',
                customerName: '',
                customPhone: '',
                customCardNumber: '',
                customAge: '',
                checkStatus: '',
                aestheticConsultant: '',
                nurse: '',
                maternityMatron: '',
                chanKangShi: '',
                checkTime: '',
                roomDays: '',
                subscribeTime: '',
                checkOutTime: '',
                remark: '',
                departmentId: 0
            }
            this.formNot = {
                customPhone: '',
                customerName: '',
                aestheticConsultant: ''
            }
            this.$forceUpdate()
        },
        handleClick(tab) {
            this.floorId = tab.name.substr(4, tab.name.length)
            this.getData()
        },
        gettable() {
            this.$api.confinementRoom.floorInfoList({ deptId: this.deptId, state: '0' }).then(res => {
                if (res) {
                    this.list = res.rows
                    // this.activeName = this.list[0].floorId
                }
            })
        },
        // ---------------
        // 鼠标右键事件
        openMenu(e, item) {
            this.hospitalList = [];
            this.hospitalList.push(item)
            this.form = item;
            this.roomNames = this.hospitalList[0].roomName
            if (item.checkStatus === '2') {
                this.roomForm.id = item.id
                this.roomForm.checkStatus = item.checkStatus
                this.roomForm.roomReservationId = item.roomReservationId
                this.roomForm.customerName = item.customerName
                this.roomForm.customPhone = item.customPhone
                this.roomForm.customCardNumber = item.customCardNumber
                this.roomForm.customAge = item.customAge
                this.roomForm.checkReservationTime = item.checkReservationTime
                this.roomForm.roomId = item.roomId
                this.roomForm.floorNumber = item.floorNumber
                this.roomForm.roomType = item.roomType
                this.roomForm.roomNumber = item.roomNumber
                this.roomForm.roomName = item.bedNumber
                this.roomForm.roomDays = item.roomDays
                this.roomForm.defaultDays = item.defaultDays
                this.roomForm.defaultCharge = item.defaultCharge
                this.roomForm.departmentId = item.departmentId
                this.roomForm.waitId = item.waitId
                // 换房数据
                this.changeForm.id = item.id
                this.changeForm.customerName = item.customerName
                this.changeForm.customPhone = item.customPhone
                this.changeForm.customCardNumber = item.customCardNumber
                this.changeForm.customAge = item.customAge
                this.changeForm.oldRoomId = item.roomId
                this.changeForm.oldRoomName = item.bedNumber
                this.changeForm.roomDays = item.roomDays
                this.changeForm.waitId = item.waitId
                this.showOther = true
                this.showCheck = false
            } else if (item.checkStatus === '1') {
                this.roomForm.id = item.id
                this.roomForm.checkStatus = item.checkStatus
                this.roomForm.roomReservationId = item.roomReservationId
                this.roomForm.customerName = item.customerName
                this.roomForm.customPhone = item.customPhone
                this.roomForm.customCardNumber = item.customCardNumber
                this.roomForm.customAge = item.customAge
                this.roomForm.checkReservationTime = item.checkReservationTime
                this.roomForm.roomId = item.roomId
                this.roomForm.floorNumber = item.floorNumber
                this.roomForm.roomType = item.roomType
                this.roomForm.roomNumber = item.roomNumber
                this.roomForm.roomName = item.bedNumber
                this.roomForm.roomDays = item.roomDays
                this.roomForm.defaultDays = item.defaultDays
                this.roomForm.defaultCharge = item.defaultCharge
                this.roomForm.departmentId = item.departmentId
                this.roomForm.waitId = item.waitId
                this.showOther = false
                this.showCheck = true
            } else {
                this.roomForm.checkStatus = '0'
                this.roomForm.roomId = item.roomId
                this.roomForm.floorNumber = item.floorNumber
                this.roomForm.roomType = item.roomType
                this.roomForm.roomNumber = item.roomNumber
                this.roomForm.roomName = item.bedNumber
                this.roomForm.roomDays = item.roomDays
                this.roomForm.defaultDays = item.defaultDays
                this.roomForm.defaultCharge = item.defaultCharge
                this.showOther = false
                this.showCheck = true
            }
            const x = e.clientX
            const y = e.clientY
            this.top = y
            this.left = x
            this.visible = true
        },
        closeMenu() {
            this.visible = false
        },
        // 换房
        exchange() {
            this.getRoomList()
            // this.getFloorList()
            // this.getRoomTypeList()
            this.showChangeDialog = true
        },
        cancel() {
            this.visible = false
        },
        personal() {
            this.dialogVisible = true
        },
        getData() {
            this.loadingData = true
            if (this.activeName === 'firs') {
                this.floorId = null
            }
            const floorId = this.floorId
            const data = {}
            for (const k in this.options) {
                if (this.options[k].type === 'Tdatetime') {
                    if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
                        data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
                        data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
                        data[k] = null
                        data['end' + k] = null
                    }
                    if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
                        data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
                        data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (this.options[k].values.length === 0) {
                        data[k] = null
                        data['end' + k] = null
                    }
                } else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            /**
             * @author Nevin
             * @date 2022/6/14
             * @Description: 传公司ID，后期可能要改
             */
            let datas = { ...data, floorId: floorId, deptId: this.deptId, state: '0' };
            datas.bedStatus = datas.checkStatus;
            this.$api.confinementRoom.RoomTypeInfoList(datas).then(res => {
                if (res) {
                    res.rows.forEach(item => {
                        if (item.checkStatus === '1') {
                            this.$set(item, 'checkStatus', '2')
                        }
                    });
                    this.roomlist = res.rows;
                    this.free = 0
                    this.checkedIn = 0
                    this.occupancy = 0;
                    this.roomlist.forEach(item => {
                        if (item.checkStatus === '2') {
                            this.checkedIn = this.checkedIn + 1

                        } else {

                            this.free = this.free + 1
                        }
                    })
                    if (res.rows.length == 0) {
                        return
                    }
                    this.occupancy = math.multiply(math.divide(this.checkedIn, this.roomlist.length), 100).toFixed(1);

                }
            }).finally(() => {
                this.loadingData = false
            })
        },
        // 已预约顾客入住
        Arrived(index) {
            this.$forceUpdate()
            this.roomForm.checkReservationTime = this.getTodayData()
            this.searchBar.checkReservationTime = this.getTodayData()
            this.isAppointment = 1
            this.roomForm.customerName = ''
            this.roomForm.customPhone = ''
            this.roomForm.customCardNumber = ''
            this.roomForm.customAge = ''
            this.roomForm.checkStatus = ''
            this.roomForm.aestheticConsultant = ''
            this.roomForm.nurse = ''
            this.roomForm.maternityMatron = ''
            this.roomForm.chanKangShi = ''
            this.roomForm.roomDays = ''
            this.roomForm.checkOutTime = ''
            this.roomForm.remark = ''
            this.searchBar = {
                customerName: '',
                customPhone: '',
                customCardNumber: ''
            }

            this.formNot.customerName = ''
            this.formNot.customPhone = ''
            this.formNot.aestheticConsultant = ''
            this.number = index
            this.time = 3
            this.increase = 0
        },
        // 未预约顾客入住
        notArrived(index) {
            this.notgetCustomerInfo()
            this.isAppointment = 2
            this.roomForm.checkReservationTime = this.getTodayData()
            this.roomForm.customerName = ''
            this.roomForm.customPhone = ''
            this.roomForm.customCardNumber = ''
            this.roomForm.customAge = ''
            this.roomForm.checkStatus = ''
            this.roomForm.aestheticConsultant = ''
            this.roomForm.nurse = ''
            this.roomForm.maternityMatron = ''
            this.roomForm.chanKangShi = ''
            this.roomForm.roomDays = ''
            this.roomForm.checkOutTime = ''
            this.roomForm.remark = ''
            this.searchBar = {
                customerName: '',
                customPhone: '',
                customCardNumber: ''
            }
            this.formNot.customerName = ''
            this.formNot.customPhone = ''
            this.formNot.aestheticConsultant = ''
            this.number = index
            this.time = 0
            this.increase = 4
        },
        information(val, item) {
            if (item.checkStatus !== '0') {
                this.dialogVisible = true
                this.form = item
            }
        },
        closeDialog() {
            this.dialogVisible = false
            this.form = {
                customerName: '',
                customSex: '',
                customAge: 0,
                createTime: '',
                nation: '汉',
                createBy: '',
                xiang: '',
                remark: ''
            }
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 分页
        */
        change(e) {
            this.pagination.pageNum = e[1]
            this.getCustomerInfo() // 调用数据
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getCustomerInfo()
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 表格单选
         */
        handleSelectionChange(e) {
            if (e[1].length == 0) {
                this.roomForm.aestheticConsultant = "";
                this.roomForm.nurse = "";
                this.roomForm.customerName = "";
            } else {
                //     this.$refs.tablecome.$refs.multipleTable.clearSelection()
                // this.$refs.tablecome.$refs.multipleTable.toggleRowSelection(e[1].pop())
                this.foctor = e[1][(e[1].length) - 1].hospitalDoctor;
                this.newfoctor = e[1][(e[1].length) - 1].nursingPersonnel
                this.roomForm.aestheticConsultant = e[1][(e[1].length) - 1].hospitalDoctor
                this.roomForm.nurse = e[1][(e[1].length) - 1].nursingPersonnel;
                this.zerendoctor.forEach(value => {
                    // alert(this.roomForm.aestheticConsultant)
                    if (value.userId == this.roomForm.aestheticConsultant) {
                        this.roomForm.aestheticConsultant = value.label;
                    }
                })
                this.zerennurse.forEach(value => {
                    if (value.userId == this.roomForm.nurse) {
                        this.roomForm.nurse = value.label;
                    }
                })
                this.listname = e[1][(e[1].length) - 1]
            }

            this.selectionData = [];
            if (e[1].length == 0) {

            }
            else if (e[1].length > 1) {
                this.selectionData.push(e[1][e[1].length - 1]);
                this.roomForm.customerName = this.selectionData[0].customerName;
                this.inHospitalId = this.selectionData[0].inHospitalId;
                this.listname = e[1][e[1].length - 1];

            } else {
                this.selectionData.push(e[1][0]);
                this.roomForm.customerName = this.selectionData[0].customerName;
                this.inHospitalId = this.selectionData[0].inHospitalId;
                this.listname = e[1][0]
            }
            // this.selectionData = [];
            // this.selectionData.push(e[1][e[1].length-1]);
            // this.roomForm.customerName=this.selectionData[0].customerName
            // if (e[1].length > 1) {
            //     this.$refs.table.$refs.multipleTable.clearSelection()
            //     this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
            // }
            // this.selectionData.push(e[1].pop())
            // this.$delete(this.selectionData, 1)
            // if (this.selectionData[0] !== undefined) {
            //     this.roomForm.roomDays = this.selectionData[0].roomDays
            //     this.roomForm.aestheticConsultant = this.selectionData[0].acName
            //     this.roomForm.id = this.selectionData[0].id
            //     this.roomForm.customerName = this.selectionData[0].customerName
            //     this.roomForm.customPhone = this.selectionData[0].customPhone
            //     this.roomForm.customCardNumber = this.selectionData[0].customCardNumber
            //     this.roomForm.customAge = this.selectionData[0].customAge
            //     this.roomForm.departmentId = this.selectionData[0].departmentId
            //     this.roomForm.totalAmount = this.selectionData[0].totalAmount
            //     this.$forceUpdate()
            // }
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 行内点击选中
         */
        rowClick(e) {
            //  this.listId=e[1].id;
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])

        },
        rowClicks(e) {

            this.foctor = e[1].hospitalDoctor;
            this.newfoctor = e[1].nursingPersonnel
            this.roomForm.aestheticConsultant = e[1].hospitalDoctor
            this.roomForm.nurse = e[1].nursingPersonnel;
            this.zerendoctor.forEach(value => {
                // alert(this.roomForm.aestheticConsultant)
                if (value.userId == this.roomForm.aestheticConsultant) {
                    this.roomForm.aestheticConsultant = value.label;
                }
            })
            this.zerennurse.forEach(value => {
                if (value.userId == this.roomForm.nurse) {
                    this.roomForm.nurse = value.label;
                }
            })
            this.listname = e[1]

            this.$refs.tablecome.$refs.multipleTable.clearSelection()
            this.$refs.tablecome.$refs.multipleTable.toggleRowSelection(e[1])
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 分页
         */
        changeCurrentChange(e) {
            this.roomPagination.pageNum = e[1]
            this.getRoomList()
        },
        changeSizeChange(e) {
            this.roomPagination.pageSize = e[1]
            this.getRoomList()
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 表格单选
         */
        handleChangeSelectionChange(e) {
            this.changeSelectionData = []
            this.changeSelectionData.push(e[1][e[1].length - 1]);
            // if (e[1].length > 1) {
            //     this.$refs.changeTable.$refs.multipleTable.clearSelection()
            //     this.$refs.changeTable.$refs.multipleTable.toggleRowSelection(e[1].pop())
            // }
            // // this.changeSelectionData.push(e[1].pop())
            // this.$delete(this.changeSelectionData, 1)
            // if (this.changeSelectionData[0] !== undefined) {
            //     this.changeForm.floorNumber = this.changeSelectionData[0].floorNumber
            //     this.changeForm.roomId = this.changeSelectionData[0].roomId
            //     this.changeForm.roomType = this.changeSelectionData[0].roomType
            //     this.changeForm.roomNumber = this.changeSelectionData[0].roomNumber
            //     this.changeForm.roomName = this.changeSelectionData[0].roomName
            //     this.changeForm.defaultDays = this.changeSelectionData[0].defaultDays
            //     this.changeForm.defaultCharge = this.changeSelectionData[0].defaultCharge
            //     this.$forceUpdate()
            // }
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 行内点击选中
         */
        changeRowClick(e) {
            this.changeForm.oldRoomName = e[1].bedNumber;
            this.hospitalList[0].roomType = e[1].roomType
            this.$refs.changeTable.$refs.multipleTable.clearSelection()
            this.$refs.changeTable.$refs.multipleTable.toggleRowSelection(e[1])
        },
        /**
         * @author Nevin
         * @date 2022/6/11
         * @Description: 获取用户列表
        */
        getUserList(deptId) {
            // 人员添加公司Id  添加状态 添加岗位
            const data = {
                deptId: deptId,
                status: '0'
            }
            this.$api.user.getUserList(data).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.label = item.nickName
                        item.value = item.userId
                    })

                    // 现场
                    res.data.forEach(item => {
                        if (item.postCode == 'xczxs') {
                            this.sysUserList.push(item)
                        }
                    })
                    // ------- 岗位
                    res.data.forEach(item => {
                        if (item.postCode == 'chks') {
                            this.chks.push(item)
                        }
                    }) // 产康师
                    res.data.forEach(item => {
                        if (item.postCode == 'doctor') {
                            this.zerendoctor.push(item)
                        }
                    }) // 责任护士

                    res.data.forEach(item => {
                        // this.zerennurse.push(item)
                        if (item.postCode == 'zerennurse') {
                            this.zerennurse.push(item)
                        }
                    }) // 责任护士
                    res.data.forEach(item => {
                        if (item.postCode == 'yuesao') {
                            this.yuesao.push(item)
                        }
                    }) // 月嫂
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.leftbutton {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    margin-left: 20px;
    background: #ecf5ff;
    color: #409eff;
    border-radius: 5px;
}

::v-deep .patient_list_right th {
    padding: 4px !important;
    font-size: 14px
}

::v-deep .AdvicePricenew .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

::v-deep .patient_list .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

::v-deep .patient_list_right .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

::v-deep .patient_list_right_bottom .el-table__body tr.current-row>td {
    background-color: #90ee90 !important;
}

// .el-input__inner{
//     width: 100px !important;
// }
::v-deep .abc th {
    padding: 0 !important;
}

.forcement::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.forcement::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.forcement::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}

.kfrq::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.kfrq::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.kfrq::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}

.AdvicePricenewchildren::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.AdvicePricenewchildren::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.AdvicePricenewchildren::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}

.AdvicePricenew::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.AdvicePricenew::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.AdvicePricenew::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}

.patient_list::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.patient_list::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.patient_list::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}

.patient_list_right_bottom::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.patient_list_right_bottom::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.patient_list_right_bottom::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}

.topContain {
    width: 150px;
    height: 20px;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

::v-deep .el-input-number__decrease {
    display: none;
}

::v-deep .el-input-number__increase {
    display: none;
}

* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}

.el-button--primary:nth-of-type(3) {
    background-color: lightpink !important;
    border-color: lightpink !important;
    // border: transparent;
}

.el-button--primary:nth-of-type(5),
.el-button--primary:nth-of-type(6) {
    // background-color: mediumslateblue !important;
    // border-color: mediumslateblue !important;
    // border: transparent;
}

.patient_list_right_bottom {
    width: 800px;
    height: 220px;
    // border: 1px solid red;
    overflow: scroll;
    overflow-x: hidden;
    // background-color: red;
}

.patient_list_right {
    width: 100%;
    height: 300px;
    // border: 1px solid red;
    overflow: scroll;
    // background-color: red;
    margin-top: 10px;
}

.el-select {
    width: 200px !important;

    .el-input__inner {
        height: 30px !important;
    }
}

.nurse_right_center span {
    margin-right: 10px;
    cursor: pointer;
}

.nurse_right_top {
    height: 65px;
    // border: 1px solid black;
}

.nurse_right {
    width: calc(100% - 300px);
    height: calc(100% - 0px);
    // border: 1px solid palevioletred;
    // background-color: #999999;
}

.patient_list {
    width: 100%;
    height: calc(100% - 10px);
    position: relative;
    overflow: scroll;
    margin-top: 10px;
    overflow-x: hidden;
    //   overflow: scroll !important;
}

.nurse_left {
    width: 300px;
    height: 100%;
    // border: 1px solid red;
}

.nurse_contain {
    width: 100%;
    height: auto;
    display: flex;
}

.nurse_top {
    height: 30px;
    // border: 1px solid red;
    line-height: 30px;
}

.nurse_top span {
    margin-right: 10px;
    cursor: pointer;
}

* {
    list-style: none;
    cursor: pointer;
}

.Tab {
    height: 30px;
}

.Tab li {
    float: left;
    cursor: pointer;
}

.Tab li:nth-of-type(2) {
    margin-left: 20px;
}

.bill {
    display: none;
    position: absolute;
}

.text:hover {
    display: inline-block;
}

.cardHeader {
    background-color: #56dbb8;
}

.endCardHeader {
    background-color: #f19739;
}

.notCardHeader {
    background-color: #333333;
}

::v-deep .el-card__header {
    padding: 0;
}

.cumAge {
    width: 65%;
    color: #ffffff;
    font-size: 12px;
    margin-top: 2px;
    padding-left: -5px
}

//鼠标右键弹出位置
.contextMenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);
    text-align: center;
    width: 5%;
}

.contextMenu li {
    margin: 8px;
    cursor: pointer;
}

.contextMenu li:hover {
    background-color: #F2F6FC;
}

.headertable {
    padding: 10px;
}

::v-deep .el-card__body {
    //background-color: #faa755;
    padding: 9px;
}

::v-deep .el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow {
    border-radius: 8px;
    //border: 1px solid #56dbb8;
}

::v-deep .el-table__cell {
    // padding: 0 !important;
}

.content {
    position: fixed;
    height: 80%;
}

.header {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    /*background-color: #56dbb8;*/
    .right {
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 100%;
        margin: 0 20px 40px 25px;
    }

    .titmed {
        margin: 0 15px 5px 15px;
    }
}

.horn {
    width: 0px;
    height: 0px;
    border-top: 22px solid #f19739;
    border-bottom: 14px solid #56dbb8;
    border-left: 35px solid #56dbb8;
    border-right: 23px solid #f19739;
    margin-top: -6px;
    margin-right: -1px;
}

.endhorn {
    width: 0px;
    height: 0px;
    border-top: 22px solid #ffffff;
    border-bottom: 14px solid #f19739;
    border-left: 35px solid #f19739;
    border-right: 23px solid #ffffff;
    margin-top: -6px;
    margin-right: -1px;
}

.nothorn {
    width: 0px;
    height: 0px;
    border-top: 22px solid #333333;
    border-bottom: 14px solid #333333;
    border-left: 35px solid #333333;
    border-right: 23px solid #333333;
    margin-top: -6px;
    margin-right: -1px;
}

.ticks {
    display: flex;

    .imgtick {
        margin-top: -17px;
    }
}

.imgticks {
    display: flex;
}

.mation {
    margin-top: 5px;
}

.card {
    width: 280px;
    display: inline-block;
    margin: 10px 20px;
    border: 1px solid #56dbb8;
}

.card:hover {
    transform: translate(0, -5px)
}

.endCard {
    width: 280px;
    display: inline-block;
    margin: 10px 20px;
    border: 1px solid #f19739;
}

.endCard:hover {
    transform: translate(0, -5px)
}

.noCard {
    width: 280px;
    display: inline-block;
    margin: 10px 20px;
    border: 1px solid #333333;
}

.noCard:hover {
    transform: translate(0, -5px)
}

.room {
    float: left;
    cursor: pointer;
    width: 122px;
    height: 20px;
    font-size: 12px;
    background-color: #ffffff;
    border-radius: 0 5px 5px 0;
    margin-top: 8px;
}

//.titme{
//  font-size: 14px;
//  margin-left: 15px;
//  margin-bottom: 15px
//}
.statrs {
    width: 50%;
    margin: 5px 0;
    padding: 0 3px;
}

.line {
    padding-bottom: 8px;
    border-bottom: 1px dashed #56dbb8;
}

.endLine {
    padding-bottom: 8px;
    border-bottom: 1px dashed #f19739;
}

.notLine {
    padding-bottom: 8px;
    border-bottom: 1px dashed #333333;
}

.titme {
    padding-top: 1px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #ffffff;
}

.titmes {
    padding-top: 1px;
    margin-bottom: 4px;
    font-size: 12px;
}

/*小方块*/
.color-block-default {
    display: inline-block;
    width: 14px;
    height: 10px;
    background-color: #56dbb8;
    border-radius: 2px;
    border: 1px solid #56dbb8;
}

.color-block-success {
    display: inline-block;
    width: 14px;
    height: 10px;
    background-color: #fcbf64;
    border-radius: 2px;
    border: 1px solid #fcbf64;
}

.color-block-free {
    display: inline-block;
    width: 14px;
    height: 10px;
    background-color: #333333;
    border-radius: 2px;
    border: 1px solid #333333;
}

.bg {
    background-color: #3aa1ff;
    color: #fff;
}

::v-deep thead .el-table-column--selection .cell {
    display: none;
}

.active {
    display: none;
}

.notbutt {
    position: relative;
}

.butt {
    position: absolute;
    right: 50px;
    bottom: -500px;
}

::v-deep .warning-row {

    background: rgb(193, 210, 240) !important;
}


::v-deep .stop_advice {
    background-color: #cc99ff !important
}

::v-deep .stop_success {
    background-color: lightpink !important
}

::v-deep .success-row {
    background-color: #c6f9c3 !important;
}

::v-deep .success-rowzf {
    background-color: #d19fe8 !important;
}

::v-deep .success-rowzfjj {
    background-color: #00a0e9 !important;
}

::v-deep .success-rowzfwc {
    background-color: #eee !important;
}

::v-deep .success-rowzfcs {
    background-color: #a3e3ed !important;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 8px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    background: transparent;
}

// ::v-deep .el-input__icon{
//     display: none !important;
// }
// ::v-deep .el-input__inner{
//     padding: 15px !important;
// }
// ::v-deep .el-input--suffix {
//     width: 160px !important;
// }</style>
