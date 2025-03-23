import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const accessCookie = useCookie('token')
  const refreshCookie = useCookie('refreshToken')

  nuxtApp.hook('app:created', () => {
    const originalFetch = globalThis.$fetch
    globalThis.$fetch = async (request, options = {}) => {
      try {
        return await originalFetch(request, options)
      } catch (error: any) {
        if (error.status === 401 && refreshCookie.value) {
          try {
            // Attempt to refresh the token
            const response = await originalFetch('/api/auth/refresh', {
              method: 'POST',
              body: { refreshToken: refreshCookie.value }
            })

            if (response.accessToken) {
              // Update the access token
              accessCookie.value = response.accessToken

              // Retry the original request with the new token
              if (options.headers) {
                (options.headers as any).Authorization = `Bearer ${response.accessToken}`
              } else {
                options.headers = {
                  Authorization: `Bearer ${response.accessToken}`
                }
              }

              return await originalFetch(request, options)
            }
          } catch (refreshError) {
            // If refresh fails, redirect to login
            navigateTo('/login')
          }
        }
        throw error
      }
    }
  })
})