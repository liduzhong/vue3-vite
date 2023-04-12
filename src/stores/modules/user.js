import { defineStore } from 'pinia'
import { login } from '@/api/login'
import { getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: getToken(),
    name: '',
    avatar: ''
  }),
  getters: {
    isLogin: (state) => !!state.token
  },
  actions: {
    Login(userInfo) {
      const { username, password } = userInfo
      return new Promise(async (resolve, reject) => {
        try {
          const res = await login({ username: username.trim(), password: password })
          const token = res.data.token
          this.token = token
          setToken(token)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    Logout() {
      return new Promise(async (resolve) => {
        this.token = ''
        removeToken()
        resolve()
      })
    },
    GetInfo() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await getUserInfo()
          const { data } = res
          if (!data) {
            reject('验证失败，请重新登录')
          }
          const { name, avatar } = data
          this.name = name
          this.avatar = avatar
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
