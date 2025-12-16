export const environment = {
  production: true,
  oauthClientId: '794095666194-ggusorgqvmgkqjbenlgr2adr1n3jchjs.apps.googleusercontent.com',
  apiBaseUrl: 'https://[TARGET-PROJECT-A-CLOUD-RUN-ENDPOINT].run.app',
  firebase: {
    projectId: 'rpr-verify-b',
    apiKey: 'AIzaSyC9yImskFScuBxHyPHpCYvwr_A3CpvLR90',
    authDomain: 'rpr-verify-b.firebaseapp.com',
    databaseURL: 'https://rpr-verify-b.firebaseio.com',
    storageBucket: 'rpr-verify-b.appspot.com',
    messagingSenderId: '794095666194',
    appId: '1:794095666194:web:53d30da820b709635844cb'
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
