export default defineNuxtRouteMiddleware(async (to, from) => {
  // Define public routes that don’t require authentication.
  const publicRoutes = ['/', '/login', '/register', '/about', '/contact'];
  if (publicRoutes.includes(to.path)) return;

  // Retrieve tokens from cookies.
  // The useCookie composable returns type `Ref<string | null>` typically.
  const accessCookie = useCookie('token');
  const refreshCookie = useCookie('refreshToken');

  // Extract token values.
  let accessToken = accessCookie.value;
  const refreshToken = refreshCookie.value;

  // If neither token exists, redirect to login.
  if (!accessToken && !refreshToken) {
    return navigateTo('/login');
  }

  // If there’s no access token but there is a refresh token, attempt to refresh it.
  if (!accessToken && refreshToken) {
    const newToken = await attemptRefresh(refreshToken);
    if (newToken) {
      accessToken = newToken;
      accessCookie.value = newToken;
    }
  }

  // At this point, if accessToken is still falsy, redirect to login.
  if (!accessToken) {
    return navigateTo('/login');
  }

  // Now check if the current access token is expired.
  // Here we use a non-null assertion (!) because we already ensured accessToken exists.
  if (checkTokenExpired(accessToken)) {
    // If expired, attempt to refresh it if a refresh token exists.
    if (refreshToken) {
      const newToken = await attemptRefresh(refreshToken);
      if (newToken) {
        accessToken = newToken;
        accessCookie.value = newToken;
      } else {
        return navigateTo('/login');
      }
    } else {
      return navigateTo('/login');
    }
  }

  // --- Helper Functions ---

  // Decode and check if the token is expired.
  function checkTokenExpired(token: string): boolean {
    try {
      const payload = decodeToken(token);
      if (!payload || !payload.exp) return true;
      // The exp field is in seconds; convert to milliseconds.
      const expTime = payload.exp * 1000;
      return Date.now() > expTime;
    } catch (error) {
      return true;
    }
  }

  // Decode the JWT payload.
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

  // Attempt to refresh the access token using the refresh token.
  async function attemptRefresh(token: string): Promise<string | null> {
    try {
      const response = await $fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: token }
      });
      return response.accessToken;
    } catch (error) {
      return null;
    }
  }
});