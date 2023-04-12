
import request from "../utils/request"

export const upload = (data) => request({
  url: "/file/upload",
  method: "post",
  data
})