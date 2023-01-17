import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export const useUserStore = defineStore('user', {
  state: (): User => {
    return {
      id: '',
      email: '',
      first_name: '',
      last_name: '',
      created_at: '',
      updated_at: ''
    }
  },

  actions: {
    update(payload: User) {
      this.id = payload.id
      this.email = payload.email
      this.first_name = payload.first_name
      this.last_name = payload.last_name
      this.created_at = payload.created_at
      this.updated_at = payload.updated_at
    }
  }
})
