export const environment = {
  production: true,
  oauthClientId: '794095666194-j1jl81fks7pl6a5v2mv557cs16hpsmkg.apps.googleusercontent.com',
  apiBaseUrl: 'https://api.verify.rprcomms.com',
  apiUrl: 'https://api.verify.rprcomms.com',
  firebase: {
    apiKey: 'PLACEHOLDER_API_KEY',
    authDomain: 'PLACEHOLDER_AUTH_DOMAIN',
    projectId: 'PLACEHOLDER_PROJECT_ID',
    databaseURL: 'PLACEHOLDER_DATABASE_URL',
    storageBucket: 'PLACEHOLDER_STORAGE_BUCKET',
    messagingSenderId: 'PLACEHOLDER_MESSAGING_SENDER_ID',
    appId: 'PLACEHOLDER_APP_ID'
  },
  googleDrive: {
    clientId: "794095666194-fimj7pc39nmugc4rqt7bd3k490mrsu3q.apps.googleusercontent.com",
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.appdata'
    ]
  }
};
