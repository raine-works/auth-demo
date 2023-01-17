<script setup lang="ts">
import { ref } from 'vue'
import { router } from '../routers/vue.router'
import { clientAxios } from '../plugin/axios.plugin'
import { setCookie } from '../plugin/cookie.plugin'
import { useUserStore } from '../store/user.store'

const user = useUserStore()

const userCredentials = ref({
  email: '',
  password: ''
})

const login = async () => {
  const loginRes = await clientAxios({
    method: 'POST',
    url: '/login',
    data: userCredentials.value
  })
  if (loginRes.status === 200) {
    setCookie('access_token', loginRes.data.access_token)
    const userRes = await clientAxios.get(`/user/${loginRes.data.user_id}`)
    user.update(userRes.data)
    router.push('/')
  }
}
</script>

<template>
  <div>
    <input v-model="userCredentials.email" />
    <input v-model="userCredentials.password" />
    <button @click="login">Login</button>
  </div>
</template>
