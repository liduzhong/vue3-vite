const express = require('express')
const router = express.Router()
const { responseData, responseError, responsePaginationList } = require('../utils')
const { sqlSelect, sqlSelectInfo, sqlInsert, sqlUpdate, sqlDelete } = require('../mysql')

//引入必要依赖
const fs = require('fs')
const OSS = require('ali-oss')
const multer = require('multer')
//初始化阿里云oss
const client = new OSS({
  // 以华南3（广州）为例，region填写为oss-cn-guangzhou。
  region: 'oss-cn-hangzhou',
  // 填写AK和AS
  accessKeyId: 'LTAI5tNpFeWyvybtCAoNXKBy',
  accessKeySecret: 'VVPEsE9POX7iIe0XGH10iZB3I9AVfB',
  // 填写待配置跨域资源共享规则的Bucket名称。
  bucket: 'kendu'
})

// 上传文件到oss,返回url
router.post('/upload', async (req, res) => {
  try {
    const file = req.files[0]
    fs.readFile(file.path, async (err, data) => {
      if (err) {
        res.send(responseError())
        return;
      }
      const result = await client.put(file.originalname, data)
      res.send(responseData({ url: result.url, name: result.name }))
    });
  } catch (e) {

  }
});


module.exports = {
  name: 'file',
  router: router
}