const state = {
  // 分诊登记的所选数据
  triageSelectionData: [],
  // 发起治疗的多选数据
  treatmentSelectionData: [],
  // 不做登记，直接发起治疗的多选数据
  directTreatmentSelectionData: [],
  //记录表格数据
  rembertable: {},
  //设置显示单号
  setShowButton: '',
}
const mutations = {
  TRIAGE_SELECTION_DATA(state, data) {
    state.triageSelectionData = data
  },
  TREATMENT_SELECTION_DATA(state, data) {
    state.treatmentSelectionData = data
  },
  DIRECT_TREATMENT_SELECTION_DATA(state, data) {
    state.directTreatmentSelectionData = data
  },
  SET_TABLE_DATA(state, data) {
    state.rembertable[data.name] = data.data;
  },
  //设置全局显示单号
  SETBUTTON(state, view) {
    state.setShowButton = view.setShowButton
  },
  TriageAndTreatment: (state, view) => {
    for (const k in view) {
      state[k] = view[k]
    }
  },
}
const actions = {
  triageAndTreatment(context, selectionData){
    return new Promise((resolve) => {
      context.commit('TriageAndTreatment', selectionData)
      resolve()
    })
  },
  setTriageSelectionData(context, selectionData) {
    return new Promise((resolve) => {
      context.commit('TRIAGE_SELECTION_DATA', selectionData)
      resolve()
    })
  },
  setTreatmentSelectionData(context, selectionData) {
    return new Promise((resolve) => {
      context.commit('TREATMENT_SELECTION_DATA', selectionData)
      resolve()
    })
  },
  setDirectTreatmentSelectionData(context, selectionData) {
    return new Promise((resolve) => {
      context.commit('DIRECT_TREATMENT_SELECTION_DATA', selectionData)
      resolve()
    })
  },
  settabledata(context, selectionData) {
    return new Promise((resolve) => {
      context.commit('SET_TABLE_DATA', selectionData)
      resolve()
    })

  },
  //设置单号是否显示
  setbutton(context, payload) {
    return new Promise((resolve) => {
      context.commit('SETBUTTON', payload)
      resolve()
    })
  },
}
export default {
  state,
  mutations,
  actions
}
