const state = {
  wind: {}
}
const mutations = {
  SET_HEIGHT: (state, view) => {
    state.wind.height = view
  },
  SET_WIND: (state, view) => {
    state.wind = view.wind
  }
}
const actions = {
  wind(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_WIND', payload)
      resolve()
    })
  }

}
export default {
  state,
  mutations,
  actions
}
