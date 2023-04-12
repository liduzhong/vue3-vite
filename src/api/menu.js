import request from "../utils/request"


export const menuList = (params) => request({
  url: "/menu/menu_list",
  method: "get",
  params
})

export const addMenu = (data) => request({
  url: "/menu/add_menu",
  method: "post",
  data
})


export const updateMenu = (data) => request({
  url: "/menu/update_menu",
  method: "post",
  data
})

export const deleteMenu = (id) => request({
  url: "/menu/delete_menu",
  method: "post",
  data: { id }
})


export const menuInfo = (id) => request({
  url: "/menu/menu_info",
  method: "get",
  params: { id }
})

export const batchDeleteMenu = (id) => request({
  url: "/menu/batch_delete_menu",
  method: "post",
  data: { id }
})

export const getMenuInfo = () => request({
  url: "/menu/get_info",
  method: "get",
})

// 获取路由
export const getRouters = () => {
  return request({
    url: '/menu/get_routers',
    method: 'get'
  })
}