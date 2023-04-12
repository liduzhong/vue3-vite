const express = require('express')
const app = express()
const fs = require('fs')
const { port, jwt: { secretKey } } = require('./config')
const bodyParser = require('body-parser')
const { expressjwt } = require('express-jwt')
// console.log('expressJwt: ', expressJwt);
const cors = require('cors')
// 引入express-async-errors，使得express支持async/await
require('express-async-errors')
const { responseError } = require('./utils')
const multer = require('multer')
// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// 不需要token白名单
const whiteList = ['/login/login', '/public', '/file/upload', '/file/fragment_upload', '/file/check_fragment']
app.use(bodyParser.json())
app.use(cors())
app.use(urlencodedParser)
app.use(multer({
  dest: '/tmp/',
  // 解决上传文件中文乱码问题
  fileFilter(req, file, callback) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    callback(null, true)
  }
}).array('file'))
// 服务器静态资源访问目录
app.use('/public', express.static(__dirname + '/public'));
// 使用express-jwt中间件，验证token,不需要token验证的接口使用.unless({ path: [/^\/api\//] })
app.use(expressjwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: whiteList }))

//设置跨域访问
// app.all('*', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,delete");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header('Content-Type', 'text/plain; charset=utf-8');
//   // 如果需要支持cookie，就要加入 
//   res.header('Access-Control-Allow-Credentials', true);
//   next()
// })

// 导入各个模块的api
fs.readdirSync(__dirname + '/routers').filter(file => file !== '.DS_Store').forEach(file => {
  const fileName = file.replace(/\.js$/, '')
  const { name, router } = require('./routers/' + fileName)
  app.use(`/${name}`, router)
})



// 全局监听路由错误信息
app.use((err, req, res, next) => {
  console.log('err: ', err);
  if (err.name === 'UnauthorizedError') {
    return res.send(responseError('token验证失败', 401))
  }
  res.send(responseError(err.message))
})


const server = app.listen(port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('服务器已启动，访问地址为 http://%s:%s', host, port)
});