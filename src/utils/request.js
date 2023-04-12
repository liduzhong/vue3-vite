import axios from 'axios'
import { message, Modal } from 'ant-design-vue'
import router from '../router'
import errorCode from './errorCode'
import { useUserStore } from '@/stores/modules/user'
import { getToken } from './auth'
// 是否显示重新登录
export let isRelogin = { show: false };
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 60000,
})

request.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    const token = getToken()
    if (token && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  }
)


request.interceptors.response.use(
  (response) => {
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || response.data.msg || errorCode['default']
    // 是否提示接口返回的信息
    const showMsg = response.data.show
    // 二进制数据则直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response.data
    }
    // 401: 登录失效
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        Modal.confirm({
          title: '系统提示',
          content: '登录失效，请重新登录',
          okText: '重新登录',
          centered: true,
          onOk: async () => {
            // TODO:登录后重定向问题
            const userStore = useUserStore()
            await userStore.Logout()
            router.push({ path: '/login', })
            isRelogin.show = false
          },
          onCancel: () => {
            isRelogin.show = false
          }
        })
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      message.error(msg)
      return Promise.reject(msg)
    } else if (code !== 200) {
      message.error(msg)
      return Promise.reject('error')
    } else {
      if (showMsg) {
        message.success(msg)
      }
      return response.data
    }
  },
  (error) => {
    let { message: msg } = error;
    if (msg == "Network Error") {
      msg = "后端接口连接异常"
    } else if (msg.includes("timeout")) {
      msg = "系统接口请求超时"
    } else if (msg.includes("Request failed with status code")) {
      msg = "系统接口" + msg.substr(msg.length - 3) + "异常"
    }
    message.error(message)
    return Promise.reject(error)
  }
)


export default request