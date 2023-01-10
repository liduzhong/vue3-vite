const sleep = (duration) => new Promise(resolve => { setTimeout(resolve, duration) })

const responseData = (data = null, msg = 'success', code = 200,) => {
  return {
    data,
    msg,
    code,
  }
}

const responseError = (msg = 'error from server') => {
  return {
    msg,
    code: 500
  }
}


const responsePaginationList = (rows, total = 0, code = 200, msg = 'success') => {
  return {
    code,
    total: total,
    data: rows,
    msg,
  }
}

/**
 * @param {*} object obj 需要格式化的对象
 * @param {*} string connector 连接符号，默认为逗号
 * @param {*} string fllterEmpty 是否需要过滤值为空的字段，默认为false
 * @returns string 返回格式化后的字符串 example: name = 'myname' and age = 12
 */
const formatObjectAsString = (obj, connector = ',', fllterEmpty = false) => {
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
    if (typeof value === 'string') {
      result += `${key} = '${value}' ${connector} `;
    } else {
      result += `${key} = ${value} ${connector} `;
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



module.exports = {
  sleep,
  responseData,
  responseError,
  responsePaginationList,
  formatObjectAsString,
  formatObjectAsFieldAndValue,
}