import axios from 'axios'
import { message } from 'ant-design-vue'


const request = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

request.interceptors.request.use(
  (config) => {
    return config
  }
)


request.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data
    if(code === 200) {
      return response.data
    } else if(code === 500){
      message.error(msg || '服务器错误')
      return Promise.reject(response.data)
    }
  }
)


export default request