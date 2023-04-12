<template>
  <!-- 筛选条件 -->
  <a-form ref="queryForm" :model="queryParams" layout="inline" autocomplete="off">
    <a-row class="w-full mb-2">
      <a-col :span="6">
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="queryParams.name" placeholder="请输入姓名" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="性别" name="gender">
          <a-select v-model:value="queryParams.gender" placeholder="请输入性别">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="0">女</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="住址" name="address">
          <a-input v-model:value="queryParams.address" placeholder="请输入地址" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="爱好" name="hobbys">
          <a-select v-model:value="queryParams.hobbys" placeholder="请选择爱好" mode="multiple">
            <a-select-option v-for="hobby in hobbyOptions" :key="hobby.value" :value="hobby.value">
              {{ hobby.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="w-full mb-2">
      <a-col :span="6">
        <a-form-item label="部门" name="depId">
          <a-cascader
            v-model:value="queryParams.depId"
            :options="departmentOptions"
            placeholder="请选择部门"
            :fieldNames="{ label: 'depName', value: 'depId' }"
          />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="创建日期" name="createTime">
          <a-range-picker
            v-model:value="queryParams.createTime"
            valueFormat="YYYY-MM-DD"
            class="w-full"
            :placeholder="['开始日期', '结束日期']"
          />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item>
          <a-space>
            <a-button type="primary" ghost @click="resetQuery">重置</a-button>
            <a-button type="primary" @click="handleQuery">搜索</a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <!-- 操作按钮 -->
  <a-space>
    <a-button type="primary" @click="handleAdd">添加用户</a-button>
    <a-button type="primary" danger ghost :disabled="!selectedRowKeys.length" @click="handleBatchDel"
      >批量删除</a-button
    >
  </a-space>

  <!-- 表格和数据 -->
  <a-table
    :loading="tableLoading"
    :dataSource="tableData"
    :columns="columns"
    :pagination="pagination"
    :row-selection="rowSelection"
    :rowKey="record => record.id"
    bordered
    @change="handleChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'avatar'">
        <a-image :width="100" :src="record.avatar" v-if="record.avatar" />
      </template>
      <template v-if="column.key === 'gender'">
        <span v-if="record.gender === 1">男</span>
        <span v-else-if="record.gender === 0">女</span>
      </template>
      <template v-if="column.key === 'depId'">
        {{ getDepName(record.depId) }}
      </template>
      <template v-if="column.key === 'hobbys'">
        <span>
          <a-tag v-for="hobby in record.hobbys" :key="hobby" color="success">
            {{ hobby }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button type="primary" @click="handleEdit(record.id)">编辑</a-button>
          <a-button type="primary" danger ghost @click="handleDelete(record.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>

  <!-- 编辑添加弹窗 -->
  <a-modal
    v-model:visible="visible"
    :title="isEdit ? '编辑用户' : '添加用户'"
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
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入姓名" />
      </a-form-item>

      <a-form-item label="登录密码" name="password">
        <a-input type="password" v-model:value="formState.password" placeholder="请输入密码" :disabled="isEdit" />
      </a-form-item>

      <a-form-item label="头像" name="avatar">
        <a-upload
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/api/file/upload"
          :before-upload="beforeUpload"
          @change="handleFileChange"
        >
          <img v-if="formState.avatar" :src="formState.avatar" alt="avatar" class="avatar" />
          <div v-else>
            <loading-outlined v-if="uploadLoading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item label="年龄" name="age">
        <a-input-number v-model:value="formState.age" placeholder="请输入年龄" :min="1" :max="100" />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入手机号码" />
      </a-form-item>
      <a-form-item label="性别" name="gender">
        <a-radio-group v-model:value="formState.gender">
          <a-radio :value="1">男</a-radio>
          <a-radio :value="0">女</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="部门" name="depId">
        <a-cascader
          v-model:value="formState.depId"
          :options="departmentOptions"
          placeholder="请选择部门"
          :fieldNames="{ label: 'depName', value: 'depId' }"
        />
      </a-form-item>

      <a-form-item label="爱好" name="hobbys">
        <a-select
          v-model:value="formState.hobbys"
          mode="multiple"
          placeholder="请选择爱好"
          :options="hobbyOptions"
        ></a-select>
      </a-form-item>

      <a-form-item label="住址" name="address">
        <a-textarea v-model:value="formState.address" placeholder="请输入住址" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>


<script setup>
// 在生产构建中将会分离出 chunk

const worker = new Worker(new URL('./worker.js', import.meta.url))
worker.onmessage = e => {
  const img = document.createElement('img')
  img.setAttribute('src', e.data)
  document.body.appendChild(img)
}

// import { ref, reactive, computed, nextTick, unref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { departmentList } from '@/api/department'
import { userList, addUser, updateUser, deleteUser, userInfo, batchDeleteUser } from '@/api/user'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { arrayToTree } from '@/utils'
// 筛选条件
const queryForm = ref()
const queryParams = reactive({
  name: undefined,
  createTime: undefined,
  hobbys: [],
  gender: undefined,
  depId: [],
  address: undefined,
})

const resetQuery = () => {
  queryForm.value.resetFields()
  fetchUserList()
}

const handleQuery = () => {
  pagination.current = 1
  fetchUserList()
}

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: total => `共 ${total} 条`,
})
const handleChange = ({ current, pageSize }) => {
  pagination.current = current
  pagination.pageSize = pageSize
  fetchUserList()
}
const tableData = ref([])
const tableLoading = ref(false)
// 获取表格数据
const fetchUserList = async () => {
  try {
    tableLoading.value = true
    const res = await userList({
      ...queryParams,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })

    tableData.value = res.data
    pagination.total = res.total
  } finally {
    tableLoading.value = false
  }
}
fetchUserList()

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
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: '部门',
    dataIndex: 'depId',
    key: 'depId',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '爱好',
    key: 'hobbys',
    dataIndex: 'hobbys',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const rules = {
  name: [
    {
      required: true,
      message: '请输入姓名!',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码!',
      trigger: 'change',
    },
  ],
  age: [
    {
      required: true,
      message: '请输入年龄!',
      trigger: 'change',
    },
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号码!',
      trigger: 'change',
    },
  ],
  gender: [
    {
      required: true,
      message: '请选择性别!',
      trigger: 'change',
    },
  ],
  hobbys: [
    {
      required: true,
      message: '请选择爱好!',
      trigger: 'change',
    },
  ],
  address: [
    {
      required: true,
      message: '请输入住址!',
      trigger: 'change',
    },
  ],
  avatar: [
    {
      required: true,
      message: '请上传头像!',
      trigger: 'change',
    },
  ],
  depId: [
    {
      required: true,
      message: '请选择部门!',
      trigger: 'change',
    },
  ],
}

const hobbyOptions = [{ value: '唱' }, { value: '跳' }, { value: 'rap' }, { value: '篮球' }]

const departmentOptions = ref([])
const originalDepartmentList = ref([])

const fetchDepartmentList = async () => {
  const res = await departmentList({ current: 1, pageSize: -1 })
  originalDepartmentList.value = res.data || []
  departmentOptions.value = arrayToTree(res.data || [], 'depId', 'pId')
}
fetchDepartmentList()

// 弹窗
const defaultFormState = {
  id: undefined,
  name: undefined,
  age: undefined,
  phone: undefined,
  gender: 1,
  address: undefined,
  avatar: undefined,
  password: undefined,
  depId: [],
  hobbys: [],
}
const formRef = ref()
const visible = ref(false)
const formState = ref({ ...defaultFormState })
const confirmLoading = ref(false)
const isEdit = computed(() => formState.value.id !== undefined)
const selectedRowKeys = ref([])

const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
  }
})
// 设置弹窗显示状态
const setModalState = (state = true) => {
  visible.value = state
}
// 重置表单
const resetForm = async () => {
  formState.value = { ...defaultFormState }
  formRef.value.clearValidate()
}

const onSelectChange = changableRowKeys => {
  selectedRowKeys.value = changableRowKeys
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
        isEdit.value ? await updateUser(params) : await addUser(params)
        await fetchUserList()
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
// 批量删除
const handleBatchDel = () => {
  Modal.confirm({
    title: '确认删除',
    content: '删除后不可恢复，确认删除这些数据吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        await batchDeleteUser(selectedRowKeys.value.join(','))
        selectedRowKeys.value = []
        fetchUserList()
      } catch (error) {}
    },
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
        await deleteUser(id)
        selectedRowKeys.value = selectedRowKeys.value.filter(k => k !== id)
        fetchUserList()
      } catch (error) {}
    },
  })
}

// 编辑一行
const handleEdit = async id => {
  try {
    const res = await userInfo(id)
    // Object.assign(formState, res.data)
    formState.value = res.data
    setModalState()
  } catch (error) {}
}

const handleAdd = async () => {
  setModalState()
}

// 上传文件
const uploadLoading = ref(false)

const handleFileChange = info => {
  if (info.file.status === 'uploading') {
    uploadLoading.value = true
    return
  }
  if (info.file.status === 'done') {
    formState.value.avatar = info.file.response.data.url
    uploadLoading.value = false
  }
  if (info.file.status === 'error') {
    uploadLoading.value = false
    message.error('上传失败')
  }
}
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传jpg或png格式!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小需要小于2M!')
  }
  return isJpgOrPng && isLt2M
}
</script>


<style scoped>
.avatar {
  width: 102px;
  height: 102px;
}
</style>
