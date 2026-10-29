importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCS6LZeWX0qmi3O1BN9dD4u8yGVu9N0Fi8",
  authDomain: "edusa-a6efe.firebaseapp.com",
  projectId: "edusa-a6efe",
  storageBucket: "edusa-a6efe.firebasestorage.app",
  messagingSenderId: "104983276558",
  appId: "1:104983276558:web:3a5bf7016666d3e873a2e0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification.title || 'MzansiAcademy';
  const options = {
    body: payload.notification.body,
    tag: 'mzansi-push'
  };
  self.registration.showNotification(title, options);
});
