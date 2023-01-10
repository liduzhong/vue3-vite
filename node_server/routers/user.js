const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const { responseData, responseError, responsePaginationList, } = require('../utils')
const { sqlSelect, sqlSelectInfo, sqlInsert, sqlUpdate, sqlDelete } = require('../mysql')

// 获取用户列表
router.get('/user_list', async (req, res) => {
  try {
    const { current = 1, pageSize = 10, name, age, gender, address, hobbys = [] } = req.query
    const { result, total } = await sqlSelect({ name, age, gender, address, hobbys: hobbys.join(',') }, '*', 'user', 'createTime DESC', current, pageSize)
    // 一些数据处理
    result.forEach(item => {
      item.hobbys ? (item.hobbys = item.hobbys.split(',')) : (item.hobbys = [])
      item.createTime && (item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'))
    })
    res.send(responsePaginationList(result, total))
  } catch (err) {
    res.send(responseError(err.message))
  }
})

// 获取用户信息
router.get('/user_info', async (req, res) => {
  try {
    const { id } = req.query
    const result = await sqlSelectInfo(`id = ${id}`, '*', 'user')
    result.hobbys ? (result.hobbys = result.hobbys.split(',')) : (result.hobbys = [])
    result.createTime && (result.createTime = dayjs(result.createTime).format('YYYY-MM-DD HH:mm:ss'))
    res.send(responseData(result))
  } catch (err) {
    res.send(responseError(err.message))
  }
})

// 增加一条用户信息
router.post('/add_user', async (req, res) => {
  try {
    const { name, age, phone, gender, address, hobbys = [], avatar } = req.body
    await sqlInsert({ name, avatar, age, phone, gender, address, hobbys: hobbys.join(','), createTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }, 'user')
    res.send(responseData())
  } catch (err) {
    res.send(responseError(err.message))
  }

})

// 修改一条用户信息
router.post('/update_user', async (req, res) => {
  try {
    const { name, age, phone, gender, address, hobbys, id, avatar } = req.body
    await sqlUpdate(`id = ${id}`, { name, age, phone, gender, address, hobbys: hobbys.join(','), avatar }, 'user')
    res.send(responseData())
  } catch (err) {
    res.send(responseError(err.message))
  }
})

// 删除一条用户信息
router.post('/delete_user', async (req, res) => {
  try {
    const { id } = req.body
    await sqlDelete(`id = ${id}`, 'user')
    res.send(responseData())
  } catch (err) {
    res.send(responseError(err.message))
  }
})

// 批量删除用户信息
router.post('/batch_delete_user', async (req, res) => {
  try {
    const { id } = req.body
    await sqlDelete(`id IN (${id})`, 'user')
    res.send(responseData())
  } catch (err) {
    res.send(responseError(err.message))
  }
})

module.exports = {
  name: 'user',
  router: router
}