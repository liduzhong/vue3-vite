import request from "../utils/request"

export const userList = (params) => request({
  url: "/user/user_list",
  method: "get",
  params
})

export const addUser = (data) => request({
  url: "/user/add_user",
  method: "post",
  data
})

export const updateUser = (data) => request({
  url: "/user/update_user",
  method: "post",
  data
})

export const deleteUser = (id) => request({
  url: "/user/delete_user",
  method: "post",
  data: { id }
})


export const userInfo = (id) => request({
  url: "/user/user_info",
  method: "get",
  params: { id }
})

export const batchDeleteUser = (id) => request({
  url: "/user/batch_delete_user",
  method: "post",
  data: { id }
})