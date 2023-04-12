
import request from "../utils/request"

export const login = (data) => request({
  url: "/login/login",
  method: "post",
  data
})