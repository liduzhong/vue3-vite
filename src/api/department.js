
import request from "../utils/request"

export const departmentList = (params) => request({
  url: "/department/list",
  method: "get",
  params
})