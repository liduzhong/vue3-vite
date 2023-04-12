const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const { responseData, responseError, responsePaginationList, formatObjectAsString, formatObjectAsFieldAndValue } = require('../utils')
const { sqlSelect, sqlSelectInfo, sqlInsert, sqlUpdate, sqlDelete } = require('../mysql')
const jwt = require('jsonwebtoken')
const { jwt: { secretKey } } = require('../config')

// 获取用户列表
router.get('/user_list', async (req, res) => {
  const { current = 1, pageSize = 10, name, age, gender, address, hobbys = [], createTime = [], depId = [] } = req.query
  const formatParams = formatObjectAsString({ name, age, gender, address, hobbys: hobbys.join(','), depId: depId.join(',') }, 'like', 'and', true)
  const searchByCreateTime = createTime.length ? `createTime between '${createTime[0]}' and '${createTime[1]}'` : ''
  const condition = formatParams && searchByCreateTime ? `${formatParams} and ${searchByCreateTime}` : formatParams || searchByCreateTime
  const { result, total } = await sqlSelect(condition, '*', 'user', 'createTime DESC', current, pageSize)
  // 一些数据处理
  result.forEach(item => {
    item.hobbys ? (item.hobbys = item.hobbys.split(',')) : (item.hobbys = [])
    item.depId ? (item.depId = item.depId.split(',').map(Number)) : (item.depId = [])
    item.createTime && (item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'))
  })
  res.send(responsePaginationList(result, condition ? result.length : total))
})

// 获取用户信息
router.get('/user_info', async (req, res) => {
  const { id } = req.query
  const result = await sqlSelectInfo(`id = ${id}`, '*', 'user')
  result.hobbys ? (result.hobbys = result.hobbys.split(',')) : (result.hobbys = [])
  result.depId ? (result.depId = result.depId.split(',').map(Number)) : (result.depId = [])
  result.createTime && (result.createTime = dayjs(result.createTime).format('YYYY-MM-DD HH:mm:ss'))
  res.send(responseData(result))
})

// 增加一条用户信息
router.post('/add_user', async (req, res) => {
  const { name, age, phone, gender, address, password, hobbys = [], avatar, depId = [] } = req.body
  await sqlInsert({ name, depId, avatar, password, age, phone, gender, address, hobbys: hobbys.join(','), depId: depId.join(','), createTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }, 'user')
  res.send(responseData(null, '添加成功', true))

})

// 修改一条用户信息
router.post('/update_user', async (req, res) => {
  const { name, age, phone, gender, password, address, hobbys = [], id, avatar, depId = [] } = req.body
  await sqlUpdate(`id = ${id}`, { name, age, password, phone, gender, address, depId, hobbys: hobbys.join(','), depId: depId.join(','), avatar }, 'user')
  res.send(responseData(null, '修改成功', true))
})

// 删除一条用户信息
router.post('/delete_user', async (req, res) => {
  const { id } = req.body
  await sqlDelete(`id = ${id}`, 'user')
  res.send(responseData(null, '删除成功', true))
})

// 批量删除用户信息
router.post('/batch_delete_user', async (req, res) => {
  const { id } = req.body
  await sqlDelete(`id in (${id})`, 'user')
  res.send(responseData(null, `删除成功`, true))
})

// 获取登录用户信息
router.get('/get_info', async (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ''
  // 验证token
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      res.send(responseError('登录过期，请重新登录'))
    } else {
      const { username } = decoded
      const result = await sqlSelectInfo(`name = '${username}'`, '*', 'user')
      const { password, ...rest } = result
      res.send(responseData(rest))
    }
  })
})

module.exports = {
  name: 'user',
  router: router
}