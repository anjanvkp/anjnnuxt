import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if it hasn't been initialized yet
export const initFirebase = () => {
  const apps = getApps();
  
  if (!apps.length) {
    const config = {
      credential: cert({
        projectId: process.env.fb_projectId,
        clientEmail: process.env.fb_email,
        privateKey: process.env.fb_pvt_key?.replace(/\\n/g, '\n')
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    };
    
    return initializeApp(config);
  }
  
  return apps[0];
};