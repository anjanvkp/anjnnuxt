export default defineNuxtRouteMiddleware(async (to, from) => {
  const publicRoutes = ['/', '/login', '/register', '/about', '/contact'];
  if (publicRoutes.includes(to.path)) return;

  const accessCookie = useCookie('token');
  const refreshCookie = useCookie('refreshToken');

  let accessToken = accessCookie.value;
  const refreshToken = refreshCookie.value;

  if (!accessToken && !refreshToken) {
    return navigateTo('/login');
  }

  // If there's no access token but there is a refresh token, attempt to refresh
  if (!accessToken && refreshToken) {
    try {
      const response = await $fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken }
      });

      if (response.accessToken) {
        accessToken = response.accessToken;
        accessCookie.value = response.accessToken;
      } else {
        return navigateTo('/login');
      }
    } catch (error) {
      return navigateTo('/login');
    }
  }

  if (!accessToken) {
    return navigateTo('/login');
  }

  // Check if the current access token is expired
  if (checkTokenExpired(accessToken)) {
    if (refreshToken) {
      try {
        const response = await $fetch('/api/auth/refresh', {
          method: 'POST',
          body: { refreshToken }
        });

        if (response.accessToken) {
          accessToken = response.accessToken;
          accessCookie.value = response.accessToken;
        } else {
          return navigateTo('/login');
        }
      } catch (error) {
        return navigateTo('/login');
      }
    } else {
      return navigateTo('/login');
    }
  }

  function checkTokenExpired(token: string): boolean {
    try {
      const payload = decodeToken(token);
      if (!payload || !payload.exp) return true;
      const expTime = payload.exp * 1000;
      return Date.now() > expTime;
    } catch (error) {
      return true;
    }
  }

  function decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      if (process.server) {
        return JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
      } else {
        return JSON.parse(atob(payloadBase64));
      }
    } catch (error) {
      return null;
    }
  }
});