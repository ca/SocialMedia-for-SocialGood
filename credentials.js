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

// function saveSettings () {
//   var arrayOfSocials = document.getElementById('socials').split(',');
//   for (i=0; i<arrayOfSocials.length; i++) {
//     arrayOfSocials[i] = arrayOfSocials[i].replace(/ /g,'');
//     updateBlacklist(arrayOfSocials[i]);
//   }
// }

function displayNotSignIn() {
  document.getElementById('notSignedIn').style.opacity = 1;
  document.getElementById('notSignedIn').style.display = "block";
}
function hideNotSignIn(){
	document.getElementById('notSignedIn').style.opacity = 0;
	document.getElementById('notSignedIn').style.display = "none";
	displaySignedIn();
}
function displaySignedIn() {
	document.getElementById('signedIn').style.opacity = 1;
	document.getElementById('signedIn').style.display = "block";		
}
function hideSignedIn() {
  document.getElementById('signedIn').style.opacity = 0;
  document.getElementById('signedIn').style.display = "none";    
}

// function updateBlacklist (site) {
//   var blacklistRef = firebase.database().ref('/users/' + userId + '/blacklist').push();
//   blacklistRef.set({
//       website: site
//   });
// }

function initApp() {
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      displaySignedIn();
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      // [START_EXCLUDE]

      var socialMediaTime = firebase.database().ref('/users/' + uid + '/time');
      socialMediaTime.on('value', function(snapshot) {
        var donation = '$' + Math.ceil((snapshot.val() / 60)); // $1 every minute
        document.getElementById('time').innerHTML = donation;
      });

      document.getElementsByClassName('profile-pic')[0].src = photoURL;

      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      displayNotSignIn();
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = 'null';
      // [END_EXCLUDE]
    }
    document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

window.onload = function() {
  initApp();
};
