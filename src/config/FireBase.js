import firebase from 'firebase';

var config = {
    apiKey: "API-KEY-HERE",
    authDomain: "florayion.firebaseapp.com",
    databaseURL: "https://florayion.firebaseio.com",
    projectId: "florayion",
    storageBucket: "florayion.appspot.com",
    messagingSenderId: "866204326214",
    appId: "1:866204326214:web:06d3bac4cd710b8f69ad47",
    measurementId: "G-EQ9Z60REKF"
};
const fireB = firebase.initializeApp(config);
export default fireB;
