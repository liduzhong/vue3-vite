/**
 * 
 * @param {array} data 传入需要个格式化为tree的数据
 * @param {string} idField id字段名
 * @param {string} parentIdField 父级id字段名
 * @returns {array} tree返回格式化后的数据
 */
export const arrayToTree = (data = [], idField = 'id', parentIdField = 'parentId') => {
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


/**
 * 深拷贝对象
 * @param {object | array} data 传入需要复制的数据
 * @returns {object | array} 返回复制后的数据
 */
export function deepClone(data) {
  // 基本数据类型直接返回
  if (Object(data) !== data) return data
  const result = Array.isArray(data) ? [] : {}
  for (let key in data) {
    if (typeof data[key] === 'object') {
      result[key] = deepClone(data[key])
    } else {
      result[key] = data[key]
    }
  }
  return result
}

/**
 * 递归实现数组转树
 * @param {array} arr传入需要格式化的数据
 * @param {object} [options] 配置项 idField id字段名 parentIdField 父级id字段名
 * @param {number} pid 父级id
 * @returns {array} 返回格式化后的数据
 */

export function arrayToTree2(arr, options = { idField: 'id', parentIdField: 'pid' }, pid = null) {
  const tree = [];
  arr.forEach(item => {
    if (item[parentIdField] === pid) {
      tree.push({
        ...item,
        children: arrayToTree2(arr, options, item[idField])
      })
    }
  })
  return tree
}


/**
 * 递归树形结构转数组
 * @param {*} tree 格式化的树形结构
 * @returns 格式化后的数组
 * @example treeToArray([{id: 1, children: [{id: 2}]}]) // [{id: 1}, {id: 2}]
 */
export function treeToArray(tree) {
  let arr = [];
  tree.forEach(({ children, ...rest }) => {
    arr.push(rest)
    if (children && children.length) {
      arr = [...arr, ...treeToArray(children)]
    }
  })
  return arr
}


/**
 * 递归查找数组中最大值和最小值
 * @param {array} arr 传入需要查找的数组
 * @returns {object} 返回最大值和最小值对象
 * @example findMaxAndMin([1, 2, 3, 4, 5]) // { max: 5, min: 1 }
 */

export function findMaxAndMin(arr = []) {
  if (!arr.length) return null
  const [first, ...rest] = arr
  if (arr.length === 1) return { max: first, min: first }
  const { max, min } = findMaxAndMin(rest)
  return {
    max: Math.max(first, max),
    min: Math.min(first, min)
  }
}

/**
 * 递归函数来查找数组中的所有元素的和
 * @param {array} arr 传入需要查找的数组
 * @returns {number} 返回数组中所有元素的和
 * @example sum([1, 2, 3, 4, 5]) // 15
 */

export function sum(arr = []) {
  if (!arr.length) return 0
  const [first, ...rest] = arr
  return first + sum(rest)
}




/**
 * 裁剪数组
 * @param {array} arr 需要格式化的数组
 * @param {number} group 需要分割的组数
 * @returns {array} 返回格式化后的数组
 * @example chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 */
export function chunk(arr, group) {
  let newArr = []
  for (let i = 0; i <= arr.length; i += group) {
    newArr.push(arr.slice(i, i + group))
  }
  return newArr
}


/**
 * 将对象中键的下划线转换为驼峰，递归处理
 * @param {object} obj 
 * @returns {object} newObj
 * @example changeKeys({a_b: 1, c_d: {e_f: 2}}) // {aB: 1, cD: {eF: 2}}
 */
export function changeKeys(obj) {
  const newObj = {}
  for (let key in obj) {
    const value = obj[key]
    let newKey
    if (/\_(\w)/g.test(key)) {
      newKey = key.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
    } else {
      newKey = key
    }
    if (Object.prototype.toString.call(value) === '[object Object]') {
      newObj[newKey] = changeKeys(value)
    } else {
      newObj[newKey] = value
    }
  }
  return newObj
}

/**
 * 格式化价格
 * @param {string | number} 需要格式化的价格
    * @returns {string} 格式化后的价格
    * @example formatPrice(123456) // 123,456
    */
export function formatPrice(num) {
  const s = num.toString()
  let newStr = "",
    count = 0
  for (let i = s.length; i > 0; i--) {
    if (count % 3 === 0 && i != s.length) {
      newStr = s[i - 1] + "," + newStr
    } else {
      newStr = s[i - 1] + newStr
    }
    count++
  }
  return newStr
}

/**
 * 大数相加
 * @param {string} num1
 * @param {string} num2
 * @returns {string} 相加后的结果
 * @example bigNumPlus('123456789', '987654321') // 1111111110
 */

export function bigNumPlus(num1, num2) {
  const len = Math.max(num1.length, num2.length);
  num1 = num1.padStart(len, '0')
  num2 = num2.padStart(len, '0')
  let carry = 0;
  let sum = ''
  for (let i = len - 1; i >= 0; i--) {
    const n = +num1[i] + +num2[i] + carry
    carry = ~~(n / 10)
    sum = (n % 10) + sum
  }
  if (carry) {
    sum = carry + sum
  }
  return sum
}

/**
 * 大数相减
 * @param {string} num1
 * @param {string} num2
 * @returns {string} 相减后的结果
 * @example bigNumMinus('123456789', '987654321') // -864197532
 */
export function bigNumMinus(num1, num2) {
  if (num1.includes('-') || num2.includes('-')) throw new Error('不支持负数')
  if (+num1 === +num2) return num1
  const len = Math.max(num1.length, num2.length)
  let max = +num1 > +num2 ? num1 : num2,
    min = +num1 > +num2 ? num2 : num1
  min = min.padStart(len, '0')
  let flag = +num1 > +num2
  let carry = 0;
  let result = ''
  for (let i = len - 1; i >= 0; i--) {
    // 判断是否需要借位
    let n
    if (+max[i] + carry >= +min[i]) {
      n = +max[i] - +min[i] + carry
    } else {
      n = +max[i] + 10 - +min[i] + carry
      carry = -1
    }
    result = n + result
  }
  if (result.startsWith('0')) {
    // 通过search方法找到第一个不为0的索引
    // const index = result.search(/[^0]/)
    // result = result.slice(index)
    // 通过正则匹配将result中的前面的0全部替换掉
    result = result.replace(/^0+/, '')
  }
  return flag ? result : "-" + result
}
