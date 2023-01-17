<script setup lang="ts">
import { useUserStore } from './store/user.store'
import { clientAxios } from './plugin/axios.plugin'
import { onMounted } from 'vue'

const user = useUserStore()

onMounted(async () => {
  if (!user.id) {
    const auth = await clientAxios.get('/verify')
    if (auth.status === 200) {
      user.$patch({ id: auth.data.id })
    }
  }
  if (!user.email) {
    const userRes = await clientAxios.get(`/user/${user.id}`)
    user.update(userRes.data)
  }
})
</script>

<template>
  <router-view />
</template>
