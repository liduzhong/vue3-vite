const express = require('express')
const router = express.Router()
const { responseData, responseError, responsePaginationList, } = require('../utils')
const { sqlSelect, sqlSelectInfo, sqlInsert, sqlUpdate, sqlDelete } = require('../mysql')

// 获取用户列表
router.get('/list', async (req, res) => {
  const { current = 1, pageSize = -1, } = req.query
  const { result, total } = await sqlSelect('', '*', 'department', '', current, pageSize)
  res.send(responsePaginationList(result, total))
})

module.exports = {
  name: 'department',
  router: router
}