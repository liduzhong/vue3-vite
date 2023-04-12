const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { responseData, responseError, responsePaginationList } = require('../utils')
const { sqlSelect, sqlSelectInfo, sqlInsert, sqlUpdate, sqlDelete } = require('../mysql')
const { jwt: { secretKey, expires } } = require('../config')
// 登录接口
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const result = await sqlSelectInfo(`name = '${username}' and password = '${password}'`, '*', 'user')
  if (result) {
    // 生成token
    const token = jwt.sign({ username }, secretKey, { expiresIn: expires })
    res.send(responseData({ token }, '登录成功', true))
  } else {
    res.send(responseError('用户名或密码错误'))
  }
});


module.exports = {
  name: 'login',
  router: router
}