import { createApp } from 'vue'
import Antd, { ConfigProvider } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './permission.js'
import App from './App.vue'
import router from '@/router'
import store from '@/stores'
// import './assets/main.css'// app.js
import './assets/tailwind.css'

// 引入全局自定义指令
const directives = import.meta.glob('@/directives/*.js')
for (const directive in directives) {
  const name = directive.split('/').pop().split('.').shift()
  directives[directive]().then((mod) => {
    app.directive(name, mod.default)
  })
}

const app = createApp(App)
// 导入SvgIcon组件
import SvgIcon from "@/components/SvgIcon/index.vue";
import 'virtual:svg-icons-register'
app.component('svg-icon', SvgIcon)
app.use(ConfigProvider)
app.use(store)
app.use(router)
app.use(Antd)
app.mount('#app');