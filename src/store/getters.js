const getters = {
  // 用户的信息
  userInfo: state => state.userInfo.userInfo,
  user: state => state.userInfo.user,
  height: state => state.wind.wind,
  roles: state => state.userInfo.roles,
  routes: state => state.permission.routes,
  permissions: state => state.permission.permission,
  sidebarRouters: state => state.permission.sidebarRouters,
  isFresh: state => state.permission.isFresh,
  isLocalScreen: state => state.permission.isLocalScreen,
  triageSelectionData: state => state.triageAndTreatment.triageSelectionData,
  treatmentSelectionData: state => state.triageAndTreatment.treatmentSelectionData,
  directTreatmentSelectionData: state => state.triageAndTreatment.directTreatmentSelectionData,
  departmentId: state => state.department.departmentId,
  isReload: state => state.department.isReload,
  istrueShowFlag:state=>state.department.istrueShowFlag,
  FalseisReload: state => state.department.FalseisReload,
  Homepage: state => state.department.Homepage,
  Loginconnect: state => state.department.Loginconnect,
  treedepartmentId:state=> state.department.treedepartmentId,
  rembertable:state=>state.triageAndTreatment.rembertable,
  loadmessage:state=>state.department.loadmessage,
  onlinelist:state=>state.department.onlinelist,
  onlineuplist:state=>state.department.onlineuplist,
  setShowButton:state=>state.triageAndTreatment.setShowButton
}
export default getters
