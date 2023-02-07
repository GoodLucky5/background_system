import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import Api from '@/api' //引入api接口
import '@/icons' // icon
import '@/permission' // permission control
//全局组件
import CategorySelect from '@/components/CategorySelect'
import HintButton from '@/components/HintButton'
import Empty from '@/components/Empty'
//自定义指令
import VFocus from '@/derective/v-focus'

Vue.use(VFocus);//自定义指令
Vue.component(CategorySelect.name, CategorySelect);
Vue.component(HintButton.name, HintButton);
Vue.component(Empty.name, Empty)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently, MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const {mockXHR} = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, {locale})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$api = Api; //将api接口挂载到vue的原型上
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
