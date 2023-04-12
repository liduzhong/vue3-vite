import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import router from '@/router'
import { useUserStore } from '@/stores/modules/user'
import { usePermStore } from '@/stores/modules/permission'

const whiteList = ['/login', '/register']

NProgress.configure({ showSpinner: false })
// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const userStore = useUserStore()
      const permStore = usePermStore()
      userStore.GetInfo().then(res => {
        // 获取路由列表
        permStore.GenerateRoutes().then((routers) => {
          // 动态添加路由
          router.addRoute(routers)
          next({ ...to, replace: true })
        })
      })
      next()
    }
  } else {
    // 不在白名单中的路由，重定向到登录页
    if (whiteList.indexOf(to.path) === -1) {
      next({ path: `/login?redirect=${to.fullPath}` })
      NProgress.done()
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})


router.onError((err) => {
  NProgress.done()
})