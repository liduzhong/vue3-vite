const connection = require('./connection')
const { formatObjectAsString, formatObjectAsFieldAndValue } = require('./utils')


/**
 * mysql 查询数据
 * @param string condition 查询的条件
 * @param {string|Array} field 查询的字段
 * @param string table 查询的表名
 * @param int page 第几页
 * @param int limit 每页多少条
 * @param string order 排序
 * @param string db 查询的数据库
 * @return object 返回查询到的数据的对象
 */
const sqlSelect = (condition = '', field, table, order = '', page, limit = -1, db = '') => {
  return new Promise(async (resolve, reject) => {
    // const _condition = formatObjectAsString(condition, 'and', true)
    const _field = Array.isArray(field) ? field.join(',') : field
    let sql = `select ${_field} from ${table}`
    if (condition) {
      sql += ` where ${condition}`
    }
    if (order) {
      sql += ` order by ${order}`
    }
    if (limit && limit != -1 && page) {
      sql += ` limit ${(page - 1) * limit}, ${limit}`
    }
    if (db) {
      sql += ` from ${db}`
    }
    const total = await sqlCount('', _field, table)
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return;
      }
      resolve({ result, total })
    })
  })
}

/**
 * mysql 查询一条数据详情
 * @param string condition 查询的条件
 * @param {string|Array} field 查询的字段
 * @param string table 查询的表名
 * @param string db 查询的数据库
 * @return object 返回查询到的数据的对象
 */
const sqlSelectInfo = (condition = '', field, table, db = '') => {
  return new Promise(async (resolve, reject) => {
    const _field = Array.isArray(field) ? field.join(',') : field
    let sql = `select ${_field} from ${table}`
    if (condition) {
      sql += ` where ${condition}`
    }
    if (db) {
      sql += ` from ${db}`
    }
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return;
      }
      resolve(result[0])
    })
  })
}


/**
 * mysql 统计数据
 * @param string condition 统计的条件
 * @param {string|Array} field 查询的字段
 * @param string table 统计的表名
 * @param string db 统计的数据库
 */

const sqlCount = (condition = '', field, table, db = '') => {
  return new Promise((resolve, reject) => {
    const _field = Array.isArray(field) ? field.join(',') : field
    let sql = `select count(${_field}) as count from ${table}`
    if (condition) {
      sql += ` where ${condition}`
    }
    if (db) {
      sql += ` from ${db}`
    }
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return;
      }
      resolve(result[0].count)
    })
  })
}

/**
 * mysql 插入数据
 * @param object data 插入的字段对象
 * @param string table 插入的表名
 * @param string db 插入的数据库
 * @return object 返回插入的数据的对象
 */

const sqlInsert = (data, table, db = '') => {
  return new Promise((resolve, reject) => {
    const { field, value } = formatObjectAsFieldAndValue(data)
    let sql = `insert into ${table} (${field}) values (${value})`
    if (db) {
      sql += ` from ${db}`
    }
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return;
      }
      resolve(result)
    })
  })
}

/**
 * mysql 更新数据
 * @param object data 插入的字段
 * @param string condition 更新的条件
 * @param string table 更新的表名
 * @param string db 更新的数据库
 * @return object 返回更新的数据的对象
 */

const sqlUpdate = (condition, data, table, db = '') => {
  return new Promise((resolve, reject) => {
    const _value = formatObjectAsString(data)
    let sql = `update ${table} set ${_value}`
    if (condition) {
      sql += ` where ${condition}`
    }
    if (db) {
      sql += ` from ${db}`
    }
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

/**
 * mysql 删除数据
 * @param string condition 删除的条件
 * @param string table 删除的表名
 * @param string db 删除的数据库
 * @return object 返回删除的数据的对象
 */

const sqlDelete = (condition, table, db = '') => {
  return new Promise((resolve, reject) => {
    let sql = `delete from ${table}`
    if (condition) {
      sql += ` where ${condition}`
    }
    if (db) {
      sql += ` from ${db}`
    }
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}





module.exports = {
  sqlSelect,
  sqlCount,
  sqlSelectInfo,
  sqlInsert,
  sqlUpdate,
  sqlDelete
}