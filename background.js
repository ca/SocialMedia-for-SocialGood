// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
var config = {
  apiKey: "AIzaSyB7TQxznzUlCmouFRUw8SYyBZDDq-kTJ8w",
  authDomain: "social-media-for-social-good.firebaseapp.com",
  databaseURL: "https://social-media-for-social-good.firebaseio.com",
  storageBucket: "social-media-for-social-good.appspot.com",
  messagingSenderId: "519091086531"
};
firebase.initializeApp(config);

var timer = null;
var counter = 0;
var databaseRef;
// var blacklist = [{website:null},{website:null}];

chrome.tabs.onActivated.addListener(function (info) {
  chrome.tabs.get(info.tabId, function(tab) {

    if (tab.url.indexOf('facebook') > -1 || tab.url.indexOf('twitter') > -1) {
      // Start a timer
      if (!timer) {
        timer = setInterval(function () {
          counter++;
          // Create a transaction to update the time spent on social media
          databaseRef.transaction(function(time) {
            if (time) {
              time = time + 1;
            }
            return (time || 0) + 1;
          });
          // alert(counter);
        }, 1000);
      }
    } else {
      clearInterval(timer);
      timer = null;
    }
  });
});

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    databaseRef = firebase.database().ref('users').child(user.uid).child('time');
    // blacklistRef = firebase.database().ref('users').child(user.uid).child('blacklist');
    // blacklistRef.once('value').then(function(snapshot) {
    //   // get the array of blacklisted items
    //   blacklist = snapshot.val();
    // });
  });
}

window.onload = function() {
  initApp();
};