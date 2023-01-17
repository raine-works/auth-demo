<script setup lang="ts">
import { onMounted } from 'vue'
import { clientAxios } from '../plugin/axios.plugin'
import { useUserStore } from '../store/user.store'
import { router } from '../routers/vue.router'
import dayjs from 'dayjs'

const user = useUserStore()

const logout = async () => {
  const logoutRes = await clientAxios({
    method: 'POST',
    url: 'logout',
    data: {
      email: user.email
    }
  })
  if (logoutRes.status === 200) {
    user.$reset()
    router.push('/login')
  } else {
    console.error(logoutRes.data)
  }
}

const getGreeting = () => {
  const hour = dayjs().get('hour')
  if (hour >= 0 && hour < 12) {
    return `Good morning ${user.first_name}`
  } else if (hour >= 12 && hour < 5) {
    return `Good afternoon ${user.first_name}`
  } else {
    return `Good evening ${user.first_name}`
  }
}

onMounted(() => {
  getGreeting()
})
</script>

<template>
  <div class="flex justify-between bg-slate-800 p-2">
    <div>{{ getGreeting() }}</div>
    <div>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>
