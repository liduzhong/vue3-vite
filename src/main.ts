import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd,{ConfigProvider} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import App from './App.vue'
import router from './router'

// import './assets/main.css'// app.js
import './assets/tailwind.css'
const app = createApp(App)

app.use(ConfigProvider)
app.use(createPinia())
app.use(router)
app.use(Antd).mount('#app');