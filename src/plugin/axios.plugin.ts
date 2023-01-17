import axios from 'axios'
import { getCookie } from './cookie.plugin'

export const clientAxios = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})
