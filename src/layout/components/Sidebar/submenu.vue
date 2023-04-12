<template>
  <a-sub-menu :key="menuInfo.key">
    <template #icon><MailOutlined /></template>
    <template #title>{{ menuInfo.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.key">
      <template v-if="!item.children">
        <a-menu-item :key="item.key">
          <template #icon>
            <PieChartOutlined />
          </template>
          {{ item.title }}
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :menu-info="item" :key="item.key" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script setup name="SubMenu">
import { defineProps } from 'vue'
import { PieChartOutlined, MailOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  menuInfo: {
    type: Object,
    default: () => ({}),
  },
})
</script>
