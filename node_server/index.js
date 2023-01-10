const express = require('express')
const app = express()
const fs = require('fs')
const { port } = require('./config')
const bodyParser = require('body-parser')
const multer = require('multer')
// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())
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
app.use('/public', express.static('./node_server/public'));

//设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Content-Type', 'text/plain; charset=utf-8');
  // 如果需要支持cookie，就要加入 
  res.header('Access-Control-Allow-Credentials', true);
  next()
})

// 导入各个模块的api
fs.readdirSync(__dirname + '/routers').forEach(file => {
  const fileName = file.replace(/\.js$/, '')
  const { name, router } = require('./routers/' + fileName)
  app.use(`/${name}`, router)
})


const server = app.listen(port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('服务器已启动，访问地址为 http://%s:%s', host, port)
});