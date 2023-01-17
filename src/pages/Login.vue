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
  <div
    class="h-screen flex justify-center items-center bg-slate-900 text-white"
  >
    <div class="flex flex-col bg-slate-800 py-6 px-8 rounded-lg">
      <label for="email">Email</label>
      <input name="email" class="s-input" v-model="userCredentials.email" />

      <label for="password">Password</label>
      <input
        for="password"
        class="s-input"
        v-model="userCredentials.password"
      />
      <button class="py-2 px-2 rounded-lg bg-blue-900 mt-4" @click="login">
        Login
      </button>

      <router-link class="text-center underline mt-4" to="/register"
        >Register</router-link
      >
    </div>
  </div>
</template>
