<script setup lang="ts">
import { ref, watch } from 'vue'
import { clientAxios } from '../plugin/axios.plugin'
import { router } from '../routers/vue.router'

interface NewUser {
  [key: string]: any
}

const newUser = ref({
  email: '',
  emailError: false,
  password: '',
  passwordError: false,
  confirmPassword: '',
  confirmPasswordError: false,
  firstName: '',
  firstNameError: false,
  lastName: '',
  lastNameError: false
} as NewUser)

watch(
  () => newUser.value.confirmPassword,
  (val: string) => {
    if (val !== newUser.value.password) {
      newUser.value.confirmPasswordError = true
    } else {
      newUser.value.confirmPasswordError = false
    }
  }
)

const submit = async () => {
  let readyToSubmit: boolean = false
  for (const key in newUser.value) {
    if (!key.includes('Error')) {
      if (!newUser.value[key]) {
        newUser.value[key + 'Error'] = true
        readyToSubmit = false
      } else {
        newUser.value[key + 'Error'] = false
        readyToSubmit = true
      }
    }
  }
  if (readyToSubmit) {
    const newUserRes = await clientAxios({
      method: 'POST',
      url: '/register',
      data: {
        email: newUser.value.email,
        password: newUser.value.password,
        first_name: newUser.value.firstName,
        last_name: newUser.value.lastName
      }
    })
    if (newUserRes.status === 200) {
      router.push('/login')
    } else {
      console.error(newUserRes.data)
    }
  }
}
</script>

<template>
  <div
    class="h-screen flex justify-center items-center bg-slate-900 text-white"
  >
    <div class="flex flex-col bg-slate-800 py-6 px-8 rounded-lg">
      <label for="email">Email</label>
      <input
        name="email"
        type="email"
        :class="`s-input ${
          newUser.emailError ? 'border-2 border-red-500' : ''
        }`"
        v-model="newUser.email"
      />

      <label for="password">Password</label>
      <input
        name="password"
        type="password"
        :class="`s-input ${
          newUser.passwordError ? 'border-2 border-red-500' : ''
        }`"
        v-model="newUser.password"
      />

      <label for="confirmPassword">Confirm Password</label>
      <input
        name="confirmPassword"
        type="password"
        :class="`s-input ${
          newUser.confirmPasswordError ? 'border-2 border-red-500' : ''
        }`"
        v-model="newUser.confirmPassword"
      />

      <label for="firstName">First Name</label>
      <input
        name="firstName"
        type="text"
        :class="`s-input ${
          newUser.firstNameError ? 'border-2 border-red-500' : ''
        }`"
        v-model="newUser.firstName"
      />

      <label for="lastName">Last Name</label>
      <input
        name="lastName"
        type="text"
        :class="`s-input ${
          newUser.lastNameError ? 'border-2 border-red-500' : ''
        }`"
        v-model="newUser.lastName"
      />

      <button class="py-2 px-2 rounded-lg bg-blue-900 mt-4" @click="submit">
        Register
      </button>
      <router-link class="text-center underline mt-4" to="/login"
        >Login</router-link
      >
    </div>
  </div>
</template>

<style>
.s-input {
  @apply bg-slate-900;
  @apply outline-none;
  @apply rounded-lg;
  @apply mb-2;
  @apply py-2;
  @apply px-4;
  @apply border-2;
  @apply border-transparent;
}
</style>
