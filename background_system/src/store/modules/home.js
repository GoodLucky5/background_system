import MockRequest from '@/utils/mock-request'

export default {
  namespaced: true,
  state: {
    data: {}
  },
  mutations: {
    //收集数据
    SET_DATA (state, value) {
      state.data = value
    }
  },
  actions: {
    //获取数据
    async getData ({commit}) {
      const res = await MockRequest.get('/home/list')
      if (res.code === 20000) {
        commit('SET_DATA', res.data)
      }
    }
  },
  getters: {}
}
