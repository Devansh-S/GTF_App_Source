import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBtXnFAj2YBJnxXbXvtAt3h3bcblS1KUaE",
    authDomain: "gtfapp-eb372.firebaseapp.com",
    databaseURL: "https://gtfapp-eb372.firebaseio.com",
    projectId: "gtfapp-eb372",
    storageBucket: "gtfapp-eb372.appspot.com",
    messagingSenderId: "961355962531",
    appId: "1:961355962531:web:31520bc4120f103f1d8716",
    measurementId: "G-PVZ0QY8L1K"
};
const fireB = firebase.initializeApp(config);
export default fireB;