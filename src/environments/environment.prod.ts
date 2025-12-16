export const environment = {
  production: true,
  oauthClientId: '794095666194-j1jl81fks7pl6a5v2mv557cs16hpsmkg.apps.googleusercontent.com',
  apiBaseUrl: 'https://rpr-verify-794095666194.asia-southeast1.run.app',
  apiUrl: 'https://rpr-verify-794095666194.asia-southeast1.run.app',  // Added for EscalationService
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
