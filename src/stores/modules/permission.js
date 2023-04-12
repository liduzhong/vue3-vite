import { defineStore } from 'pinia'
import { getRouters } from '@/api/menu'
import { constantRoutes } from '@/router'
export const usePermStore = defineStore({
  id: 'perm',
  state: () => ({
    routes: []
  }),
  getters: {
    // sidebarRoutes: (state) => state.routes
  },
  actions: {
    GenerateRoutes() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await getRouters()
          const routes = [...constantRoutes, ...res.data]
          this.routes = routes
          resolve(res.data)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
