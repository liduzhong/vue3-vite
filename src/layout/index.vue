<template>
  <a-layout class="h-screen">
    <Sidebar :collapsed="collapsed"></Sidebar>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 20px">
        <div class="flex items-center justify-between">
          <div class="collapsed">
            <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
            <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          </div>
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              {{ userStore.name }}
              <a-avatar :src="userStore.avatar" :size="32" class="mr-2">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <DownOutlined class="text-gray-600" />
            </a>
            <template #overlay>
              <a-menu @click="handleUser">
                <a-menu-item key="user"> 个人中心 </a-menu-item>
                <a-menu-item key="logout" class="text-red-500"> 退出登录 </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import Sidebar from './components/Sidebar/index.vue'
const userStore = useUserStore()
const router = useRouter()

const collapsed = ref(false)

const handleUser = async ({ key }) => {
  switch (key) {
    case 'user':
      router.push('/system/user/profile')
      break
    case 'logout':
      await userStore.Logout()
      router.push('/login')
      message.success('退出成功')
      break
  }
}
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
