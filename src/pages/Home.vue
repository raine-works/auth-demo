<script setup lang="ts">
import { useUserStore } from '../store/user.store'

const user = useUserStore()
</script>

<template>
  <div>
    <p>Hello {{ user.first_name }}</p>
  </div>
</template>
