const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const { responseData, responseError, responsePaginationList, formatObjectAsString, formatObjectAsFieldAndValue, generateTree } = require('../utils')
const { sqlSelect, sqlSelectInfo, sqlInsert, sqlUpdate, sqlDelete } = require('../mysql')

// 获取用户列表
router.get('/menu_list', async (req, res) => {
  const { menuName, status, visible } = req.query
  const condition = formatObjectAsString({ menuName, status, visible }, 'like', 'and', true)
  const { result, total } = await sqlSelect(condition, '*', 'menu', 'createTime DESC')
  // 一些数据处理
  result.forEach(item => {
    item.createTime && (item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'))
  })
  res.send(responsePaginationList(result, condition ? result.length : total))
})

// 获取用户信息
router.get('/menu_info', async (req, res) => {
  const { id } = req.query
  const result = await sqlSelectInfo(`id = ${id}`, '*', 'menu')
  result.createTime && (result.createTime = dayjs(result.createTime).format('YYYY-MM-DD HH:mm:ss'))
  res.send(responseData(result))
})

// 增加一条用户信息
router.post('/add_menu', async (req, res) => {
  const { parentId, menuName, path, orderNum, menuType, icon, status, visible, component, query, isFrame, isCache, perms, } = req.body
  await sqlInsert({ parentId, menuName, path, orderNum, menuType, icon, status, visible, component, query, isFrame, isCache, perms, createTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }, 'menu')
  res.send(responseData(null, '添加成功', true))

})

// 修改一条用户信息
router.post('/update_menu', async (req, res) => {
  const { id, parentId, menuName, path, orderNum, menuType, icon, status, visible, component, query, isFrame, isCache, perms, } = req.body
  await sqlUpdate(`id = ${id}`, { parentId, menuName, path, orderNum, menuType, icon, status, visible, component, query, isFrame, isCache, perms }, 'menu')
  res.send(responseData(null, '修改成功', true))
})

// 删除一条用户信息
router.post('/delete_menu', async (req, res) => {
  const { id } = req.body
  await sqlDelete(`id = ${id}`, 'menu')
  res.send(responseData(null, '删除成功', true))
})

// 批量删除用户信息
router.post('/batch_delete_menu', async (req, res) => {
  const { id } = req.body
  await sqlDelete(`id in (${id})`, 'menu')
  res.send(responseData(null, `删除成功`, true))
})


// 获取路由
router.get('/get_routers', async (req, res) => {
  const { result } = await sqlSelect('', '*', 'menu')
  // 处理菜单
  const menus = result.filter(item => item.menuType !== 'F').map(item => ({
    id: item.id,
    parentId: item.parentId,
    meta: {
      icon: item.icon,
      link: item.isFrame === '1' ? null : item.path,
      title: item.menuName,
      noCache: item.isCache === '1'
    },
    component: item.menuType === 'M' ? 'Layout' : item.component,
    title: item.menuName,
    path: item.menuType === 'M' ? '/' + item.path : item.path,
    hidden: item.visible === '1',
  }))
  const tree = generateTree(menus)
  res.send(responseData(delRoutersAttr(tree)))
})

// 删除路由tree中的id和parentId属性
function delRoutersAttr(tree) {
  const newTree = []
  tree.forEach(item => {
    let { id, parentId, children, ...rest } = item
    if (children && children.length) {
      rest.children = delRoutersAttr(children)
    }
    newTree.push(rest)
  })
  return newTree
}

module.exports = {
  name: 'menu',
  router: router
}