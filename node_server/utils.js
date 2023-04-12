const sleep = (duration) => new Promise(resolve => { setTimeout(resolve, duration) })

const responseData = (data = null, msg = '', show = false, code = 200,) => ({ data, msg, code, show })

const responseError = (msg = 'error from server', code = 500) => ({ msg, code })

const responsePaginationList = (rows, total = 0, msg = '', show = false, code = 200,) => ({ code, total: total, data: rows, msg, show })

/**
 * @param {*} object obj 需要格式化的对象
 * @param {*} string fieldConnector 字段连接符号，默认为=号
 * @param {*} string connector 连接符号，默认为逗号
 * @param {*} string fllterEmpty 是否需要过滤值为空的字段，默认为false
 * @param {*} string fuzzy当使用like模糊匹配时，需要在哪里加上百分号，默认为all,两边都加,start只在前面加,end只在后面加
 * @returns string 返回格式化后的字符串 example: name = 'myname' and age = 12
 */
const formatObjectAsString = (obj, fieldConnector = '=', connector = ',', fllterEmpty = false, fuzzy = 'all') => {
  let result = '';
  const symbolLen = connector.length + 2;  // 连接符号的长度 + 2个空格
  for (let [key, value] of Object.entries(obj)) {
    // 如果值为空，且需要过滤空值，则跳过
    if (value === null || value === undefined || value === '') {
      if (fllterEmpty) {
        continue;
      } else {
        // 传的字段的值为空
        value = null
      }
    }
    // 开启模糊匹配
    if (fieldConnector === 'like') {
      if (fuzzy === 'all') {
        value = `%${value}%`
      } else if (fuzzy === 'start') {
        value = `${value}%`
      } else if (fuzzy === 'end') {
        value = `%${value}`
      }
    }
    if (typeof value === 'string') {
      result += `${key} ${fieldConnector} '${value}' ${connector} `;
    } else {
      result += `${key} ${fieldConnector} ${value} ${connector} `;
    }
  }
  return result.slice(0, -(symbolLen));  // 返回字符串，并去掉最后一个 " and "
}


/**
 * @param {*} object obj 需要格式化的对象
 * @returns object 返回格式化后的数据 example: {field:`name,age`, value: `'myname',12`}
 */
const formatObjectAsFieldAndValue = (obj) => {
  let result = { field: '', value: '' };
  for (let [key, value] of Object.entries(obj)) {
    // 如果值为空，且需要过滤空值，则跳过
    if (value === null || value === undefined || value === '') {
      // 传的字段的值为空
      value = null
    }

    result.field += `${key},`
    if (typeof value === 'string') {
      result.value += `'${value}',`
    } else {
      result.value += `${value},`
    }
  }
  result.field = result.field.slice(0, -1);  // 去掉最后一个逗号
  result.value = result.value.slice(0, -1);  // 去掉最后一个逗号
  return result
}

/**
 * 
 * @param {array} data 传入需要个格式化为tree的数据
 * @param {string} idField id字段名
 * @param {string} parentIdField 父级id字段名
 * @returns {array} tree返回格式化后的数据
 */
const generateTree = (data = [], idField = 'id', parentIdField = 'parentId') => {
  if (!Array.isArray(data)) throw new Error('data must be array, generateTree')
  const tree = []
  const lookup = {}
  data.forEach(item => {
    lookup[item[idField]] = { ...item }
  })

  data.forEach(item => {
    if (item[parentIdField] === 0) {
      tree.push(lookup[item[idField]])
    } else {
      if (!lookup[item[parentIdField]].children) {
        lookup[item[parentIdField]].children = []
      }
      lookup[item[parentIdField]].children.push(lookup[item[idField]])
    }
  })

  return tree
}




module.exports = {
  sleep,
  responseData,
  responseError,
  responsePaginationList,
  formatObjectAsString,
  formatObjectAsFieldAndValue,
  generateTree,
}