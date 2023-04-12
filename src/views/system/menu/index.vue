<template>
  <!-- 筛选条件 -->
  <a-form ref="queryForm" :model="queryParams" layout="inline" autocomplete="off">
    <a-row class="w-full mb-2">
      <a-col :span="6">
        <a-form-item label="菜单名称" name="menuName">
          <a-input v-model:value="queryParams.menuName" placeholder="请输入菜单名称" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="菜单状态" name="status">
          <a-select v-model:value="queryParams.status" placeholder="请选择菜单状态">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">停用</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="显示状态" name="visible">
          <a-select v-model:value="queryParams.visible" placeholder="请选择显示状态">
            <a-select-option value="0">显示</a-select-option>
            <a-select-option value="1">隐藏</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item>
          <a-space>
            <a-button type="primary" ghost @click="resetQuery">重置</a-button>
            <a-button type="primary" @click="fetchMenuList">搜索</a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <!-- 操作按钮 -->
  <a-space>
    <a-button type="primary" @click="handleAdd">新增菜单</a-button>
  </a-space>

  <!-- 表格和数据 -->
  <a-table
    :loading="tableLoading"
    :dataSource="tableData"
    :columns="columns"
    :pagination="false"
    :rowKey="record => record.id"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'menuName'">
        {{ record.menuName }}
      </template>
      <template v-else-if="column.key === 'icon'"> </template>
      <template v-else-if="column.key === 'ordNum'">
        {{ record.orderNum }}
      </template>
      <template v-else-if="column.key === 'perms'">
        {{ record.perms }}
      </template>
      <template v-else-if="column.key === 'path'">
        {{ record.path }}
      </template>
      <template v-else-if="column.key === 'status'">
        <a-badge
          :status="record.status === '0' ? 'success' : 'error'"
          :text="record.status === '0' ? '正常' : '停用'"
        />
      </template>
      <template v-else-if="column.key === 'visible'">
        <a-badge
          :status="record.visible === '0' ? 'success' : 'error'"
          :text="record.visible === '0' ? '显示' : '隐藏'"
        />
      </template>
      <template v-else-if="column.key === 'createTime'">
        {{ record.createTime }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button type="primary" @click="handleEdit(record.id)">编辑</a-button>
          <a-button type="primary" @click="handleRowAdd(record.id)">新增</a-button>
          <a-button type="primary" danger ghost @click="handleDelete(record.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>

  <!-- 编辑添加弹窗 -->
  <a-modal
    width="680px"
    v-model:visible="visible"
    :title="isEdit ? '修改菜单' : '新增菜单'"
    @ok="handleOk"
    @cancel="resetForm"
    :confirmLoading="confirmLoading"
    cancelText="取消"
    okText="确定"
    centered
  >
    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
      :rules="rules"
    >
      <!-- <a-form-item label="上级菜单" name="parentId"> -->
      <!-- <a-input v-model:value="formState.parentId" placeholder="请输入姓名" /> -->
      <!-- </a-form-item> -->

      <a-form-item label="菜单类型" name="menuType">
        <a-radio-group v-model:value="formState.menuType" name="menuType">
          <a-radio value="M">目录</a-radio>
          <a-radio value="C">菜单</a-radio>
          <a-radio value="F">按钮</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- <a-form-item label="菜单图标" name="icon">
        
      </a-form-item> -->

      <a-form-item label="菜单名称" name="menuName">
        <a-input v-model:value="formState.menuName" placeholder="请输入菜单名称" />
      </a-form-item>
      <a-form-item label="显示排序" name="orderNum">
        <a-input-number v-model:value="formState.orderNum" :min="0" />
      </a-form-item>
      <a-form-item label="路由地址" name="path" v-if="formState.menuType !== 'F'">
        <a-input v-model:value="formState.path" placeholder="请输入路由地址" />
      </a-form-item>

      <a-form-item label="组件路径" name="component" v-if="formState.menuType === 'C'">
        <a-input v-model:value="formState.component" placeholder="请输入组件路径" />
      </a-form-item>

      <a-form-item label="权限字符" name="perms" v-if="formState.menuType !== 'M'">
        <a-input v-model:value="formState.perms" placeholder="请输入权限字符" />
      </a-form-item>

      <a-form-item label="路由参数" name="query" v-if="formState.menuType === 'C'">
        <a-input v-model:value="formState.query" placeholder="请输入组件路径" />
      </a-form-item>

      <a-form-item label="是否外链" name="isFrame" v-if="formState.menuType !== 'F'">
        <a-radio-group v-model:value="formState.isFrame" name="isFrame">
          <a-radio value="0">是</a-radio>
          <a-radio value="1">否</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="是否缓存" name="isCache" v-if="formState.menuType === 'C'">
        <a-radio-group v-model:value="formState.isCache" name="isCache">
          <a-radio value="0">缓存</a-radio>
          <a-radio value="1">不缓存</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="显示状态" name="visible" v-if="formState.menuType !== 'F'">
        <a-radio-group v-model:value="formState.visible" name="visible">
          <a-radio value="0">显示</a-radio>
          <a-radio value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="菜单状态" name="status" v-if="formState.menuType !== 'F'">
        <a-radio-group v-model:value="formState.status" name="status">
          <a-radio value="0">正常</a-radio>
          <a-radio value="1">停用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>


<script setup>
import { message, Modal } from 'ant-design-vue'
import { departmentList } from '@/api/department'
import { menuList, addMenu, updateMenu, deleteMenu, menuInfo, batchDeleteMenu } from '@/api/menu'
import { arrayToTree } from '@/utils'
// 筛选条件
const queryForm = ref()
const queryParams = reactive({
  menuName: undefined,
  status: undefined,
  visible: undefined,
})

const resetQuery = () => {
  queryForm.value.resetFields()
  fetchMenuList()
}

const tableData = ref([])
const tableLoading = ref(false)
// 获取表格数据
const fetchMenuList = async () => {
  try {
    tableLoading.value = true
    const res = await menuList({
      ...queryParams,
    })
    const formatData = arrayToTree(res.data)
    tableData.value = formatData
  } finally {
    tableLoading.value = false
  }
}
fetchMenuList()

// 回显部门数据
const getDepName = (ids = []) => {
  const depName = ids
    .map(id => {
      const target = originalDepartmentList.value.find(item => item.depId === id)
      return target ? target.depName : ''
    })
    .join(' / ')
  return depName
}
// 表格数据
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
  },
  // {
  //   title: '图标',
  //   dataIndex: 'icon',
  //   key: 'icon',
  // },
  {
    title: '排序',
    dataIndex: 'orderNum',
    key: 'orderNum',
  },
  {
    title: '权限标识',
    dataIndex: 'perms',
    key: 'perms',
  },
  {
    title: '组件路径',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '菜单状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '显示状态',
    dataIndex: 'visible',
    key: 'visible',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
]

const rules = {
  menuName: [
    {
      required: true,
      message: '请输入菜单名称!',
      trigger: 'change',
    },
  ],
  orderNum: [
    {
      required: true,
      message: '请输入排序!',
      trigger: 'change',
    },
  ],
  path: [
    {
      required: true,
      message: '请输入路由地址!',
      trigger: 'change',
    },
  ],
}

// 弹窗
const defaultFormState = {
  parentId: 0,
  menuName: undefined,
  path: undefined,
  orderNum: 0,
  menuType: 'M',
  icon: undefined,
  status: '0',
  visible: '0',
  component: undefined,
  query: undefined,
  isFrame: '1',
  isCache: '1',
  perms: undefined,
}
const formRef = ref()
const visible = ref(false)
const formState = ref({ ...defaultFormState })
const confirmLoading = ref(false)
const isEdit = computed(() => formState.value.id !== undefined)
const selectedRowKeys = ref([])

// 设置弹窗显示状态
const setModalState = (state = true) => {
  visible.value = state
}
// 重置表单
const resetForm = async () => {
  formState.value = { ...defaultFormState }
  formRef.value.clearValidate()
}

// 添加数据
const handleOk = () => {
  formRef.value
    .validateFields()
    .then(async valid => {
      if (!valid) return
      try {
        confirmLoading.value = true
        const params = { ...formState.value }
        isEdit.value ? await updateMenu(params) : await addMenu(params)
        await fetchMenuList()
        setModalState(false)
        resetForm()
      } catch (error) {
      } finally {
        confirmLoading.value = false
      }
    })
    .catch(error => {
      message.error('请填写必填信息')
    })
}

// 删除一行
const handleDelete = id => {
  Modal.confirm({
    title: '确认删除',
    content: '删除后不可恢复，确认删除此数据吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteMenu(id)
        selectedRowKeys.value = selectedRowKeys.value.filter(k => k !== id)
        fetchMenuList()
      } catch (error) {}
    },
  })
}

// 编辑一行
const handleEdit = async id => {
  try {
    const res = await menuInfo(id)
    // Object.assign(formState, res.data)
    formState.value = res.data
    setModalState()
  } catch (error) {}
}

// 编辑一行
const handleRowAdd = async id => {
  formState.value = { ...defaultFormState, parentId: id }
  setModalState()
}

const handleAdd = async () => {
  setModalState()
}
</script>


<style>
</style>
