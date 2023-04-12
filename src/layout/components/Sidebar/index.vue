<template>
  <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
    <div class="logo" />
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
    >
      <template v-for="item in sidebarRoutes" :key="item.path">
        <template v-if="!item.children">
          <a-menu-item :key="item.path">
            <template #icon>
              <PieChartOutlined />
            </template>
            {{ item.title }}
          </a-menu-item>
        </template>
        <template v-else>
          <sub-menu :key="item.path" :menu-info="item" />
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>


<script setup>
import { PieChartOutlined, MailOutlined } from '@ant-design/icons-vue'
import { usePermStore } from '@/stores/modules/permission'
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  },
  openKeys: {
    type: Array,
    default: () => [],
  },
})

// const selectedKeys = ref(['1'])
// const openKeys = ref(['2'])

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const SubMenu = {
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  template: `
    <a-sub-menu :key="menuInfo.key">
      <template #icon><MailOutlined /></template>
      <template #title>{{ menuInfo.title }}</template>
      <template v-for="item in menuInfo.children" :key="item.key">
        <template v-if="!item.children">
          <a-menu-item :key="item.key">
            <router-link :to="item.path">
            <template #icon>
              <PieChartOutlined />
            </template>
            {{ item.title }}
            </router-link>
          </a-menu-item>
        </template>
        <template v-else>
          <sub-menu :menu-info="item" :key="item.key" />
        </template>
      </template>
    </a-sub-menu>
  `,
  components: {
    PieChartOutlined,
    MailOutlined,
  },
}

const permStore = usePermStore()

const filterRoutes = (menus, path = '') => {
  menus.forEach(menu => {
    if (menu.hidden) {
      menus.splice(menus.indexOf(menu), 1)
    }

    menu.path = menu.path.startsWith('/') ? path + menu.path : path + '/' + menu.path
    if (menu.children && menu.children.length) {
      filterRoutes(menu.children, menu.path)
    }
  })
  return menus
}
// q: 为什么这里的 menus 会是空数组？
const sidebarRoutes = computed(() => filterRoutes(permStore.routes))

// const menus = computed(() => permStore.routes)
</script>
