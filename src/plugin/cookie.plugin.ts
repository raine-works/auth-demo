export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const getCookieByName = (name: string, cookie: string) => {
  const value = `; ${cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const setCookie = (name: string, value: string, days?: number) => {
  let expires = ''
  if (days) {
    let date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
