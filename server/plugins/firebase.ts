import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin';
import { initFirebase } from '../utils/firebase';

export default defineNitroPlugin(() => {
  console.log('Initializing Firebase Admin...');
  initFirebase();
  console.log('Firebase Admin initialized');
});