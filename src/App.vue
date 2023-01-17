<script setup lang="ts">
import { useUserStore } from './store/user.store'
import { clientAxios } from './plugin/axios.plugin'
import { onMounted } from 'vue'

const user = useUserStore()

onMounted(async () => {
  if (!user.id) {
    await clientAxios.get('/verify').then((res) => {
      user.$patch({ id: res.data.id })
    })
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
