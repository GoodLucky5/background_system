import { getInfo, login, logout } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'
//重置路由的方法
import router, { anyRoutes, asyncRoutes, constantRoutes, resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    //菜单标记
    routes: [],
    //角色
    roles: [],
    buttons: [],
    //对比之后[项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由]
    resultAsyncRoutes: [],
    //最终展示的全部路由
    resultAllRoutes: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_INFO: (state, {name, avatar, routes, buttons, roles}) => {
    state.name = name
    state.avatar = avatar
    state.routes = routes//权限标记
    state.buttons = buttons//按钮权限
    state.roles = roles//角色
  },
  //最终计算出当前用户展示的路由（常量路由，异步路由，任意路由）
  SET_RESULTASYNCROUTES: (state, value) => {
    state.resultAsyncRoutes = value
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    //添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  async login ({commit}, userInfo) {
    const {username, password} = userInfo;
    const re = await login({username: username.trim(), password: password});
    if (re.code === 20000) {
      commit('SET_TOKEN', re.data.token);
      setToken(re.data.token);
      return Promise.resolve('ok');
    } else {
      return Promise.reject(new Error('error'));
    }
  },

  // get user info
  async getInfo ({commit, state}) {
    const re = await getInfo(state.token);
    if (re.code === 20000) {
      if (!re.data) {
        return Promise.reject('Verification failed, please Login again.')
      }
      commit('SET_INFO', re.data)
      commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, re.data.routes))
      return Promise.resolve('ok');
    } else {
      return Promise.reject(new Error('error'));
    }
  },

  // user logout
  async logout ({commit, state}) {
    const re = await logout(state.token);
    if (re.code === 20000) {
      removeToken(); // must remove  token  first
      resetRouter();
      commit('RESET_STATE');
      return Promise.resolve('ok');
    } else {
      return Promise.reject(new Error('error'));
    }
  },

  // remove token
  resetToken ({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}
//过滤当前用户
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    if (routes.includes(item.name)) {
      //判断是否有子级路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

