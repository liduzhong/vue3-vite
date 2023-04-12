const express = require('express')
const SparkMD5 = require('spark-md5')
const path = require('path');
const router = express.Router()
const { responseData, responseError, responsePaginationList } = require('../utils')
const { sqlSelect, sqlSelectInfo, sqlInsert, sqlUpdate, sqlDelete } = require('../mysql')
const { oss: ossConfig } = require('../config')
//引入必要依赖
const fs = require('fs')
const OSS = require('ali-oss')
//初始化阿里云oss
const client = new OSS(ossConfig)

// 上传文件到oss,返回url
router.post('/upload', async (req, res) => {
  const files = req.files
  const length = files.length
  let count = 0
  let errors = [], success = []
  const resolveData = () => {
    if (count === length) {
      const msg = errors.length ? errors.join(',') : ''
      const data = success.length === 1 ? success[0] : success
      res.send(responseData(data, msg))
    }
  }
  files.forEach(file => {
    fs.readFile(file.path, async (err, data) => {
      if (err) {
        count++
        errors.push(err.message)
        resolveData()
        return;
      }
      const result = await client.put(file.originalname, data)
      count++
      success.push({ url: result.url, name: result.name })
      resolveData()
    });
  });
});

// 分片上传
router.post('/fragment_upload', async (req, res) => {
  const blob = req.files[0]
  const { hash, filename, total, index } = req.body

  await new Promise((resolve, reject) => {
    // 创建可写流，用于写入文件
    const stream = fs.createWriteStream(path.resolve(__dirname, `../fragments/${index + '_' + hash}`), {
      flags: index === '0' ? 'w' : 'a'
    });
    // 读取上传的文件切片，写入到完整的文件中
    fs.createReadStream(blob.path).pipe(stream);
    stream.on('finish', () => {
      resolve()
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })

  // 如果是最后一块文件切片，表示文件已经上传完成，进行文件合并
  if (parseInt(index) === parseInt(total)) {
    mergeFiles(hash, filename, total, () => {
      // 上传到oss
      fs.readFile(path.resolve(__dirname, `../uploads/${filename}`), async (err, data) => {
        if (err) {
          res.send(responseError(err.message))
          return;
        }
        // const result = await client.multipartUpload('user.js', path.normalize(__dirname + '/user.js'));
        const { res: { requestUrls = [] }, name } = await client.multipartUpload(filename, data)
        res.send(responseData({ url: requestUrls[0] ? requestUrls[0].split('?uploadId')[0] : '', name }, '文件上传成功'))
      });
    })
    return
  }
  res.send(responseData(null, '分片上传成功'))
});

// 获取分片上传信息
router.post('/check_fragment', async (req, res) => {
  const { hash } = req.body
  const fragmentsPath = path.resolve(__dirname, `../fragments`);
  const readdir = fs.readdirSync(fragmentsPath)
  const fragments = readdir.filter(item => item.indexOf(hash) > -1)
  res.send(responseData({ startIndex: fragments.length }))
});



function fileExists(path) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}


// 合并分片
async function mergeFiles(hash, filename, total, cb) {
  const filePath = path.resolve(__dirname, `../uploads/${filename}`);
  const writeStream = fs.createWriteStream(filePath);
  for (let i = 0; i < total; i++) {
    const chunkPath = path.resolve(__dirname, `../fragments/${(i + 1) + '_' + hash}`);
    const isFileExists = await fileExists(chunkPath)
    if (isFileExists) {
      const readStream = fs.createReadStream(chunkPath);
      readStream.pipe(writeStream, { end: false });
      await new Promise((resolve, reject) => {
        readStream.on('end', () => {
          fs.unlink(chunkPath, (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      });
    }
  }
  writeStream.end();
  cb && cb()
}



module.exports = {
  name: 'file',
  router: router
}