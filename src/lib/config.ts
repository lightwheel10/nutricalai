const getEnvVariable = (key: string): string => {
  const value = process.env[`NEXT_PUBLIC_${key}`] || process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value;
};

export const firebaseConfig = {
  apiKey: getEnvVariable('FIREBASE_API_KEY'),
  authDomain: getEnvVariable('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVariable('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVariable('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVariable('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVariable('FIREBASE_APP_ID'),
  measurementId: getEnvVariable('FIREBASE_MEASUREMENT_ID'),
};

console.log('Firebase Config:', firebaseConfig);