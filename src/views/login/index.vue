<template>
  <div class="login-form">
    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{
        style: {
          width: '80px',
        },
      }"
      autocomplete="off"
      @finish="hanldeLogin"
    >
      <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item name="remember">
        <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">登 录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const formState = reactive({
  username: '',
  password: '',
  remember: true,
})
const loading = ref(false)
const formRef = ref()
const hanldeLogin = values => {
  formRef.value.validateFields().then(async valid => {
    if (!valid) return
    try {
      loading.value = true
      await userStore.Login(values)
      router.push({ path: '/' })
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #efefef;
}
</style>