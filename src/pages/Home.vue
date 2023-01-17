<script setup lang="ts">
import { useUserStore } from '../store/user.store'
import NavBar from '../components/NavBar.vue'

const user = useUserStore()
</script>

<template>
  <div class="h-screen bg-slate-900 text-white">
    <NavBar />
  </div>
</template>
