// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  runtimeConfig: {
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    emailFrom: process.env.EMAIL_FROM,
    MONGO_URI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    // Firebase Admin config
    projectId: process.env.fb_projectId,
    clientEmail: process.env.fb_email,
    privateKey: process.env.fb_pvt_key?.replace(/\\n/g, '\n')
  },

  serverDir: './server',

  // Initialize database connections on server startup
  nitro: {
    plugins: ['~/server/utils/dbConnect', '~/server/plugins/firebase']
  }
})
