// Initialize Firebase
var config = {
    apiKey: "AIzaSyDWiafsTdMJYjDNVl3jtr52-JJ60KKBCv4",
    authDomain: "iky-home.firebaseapp.com",
    databaseURL: "https://iky-home.firebaseio.com",
    projectId: "iky-home",
    storageBucket: "iky-home.appspot.com",
    messagingSenderId: "174056644537"
};
firebase.initializeApp(config);


firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.log("User is signed in.");
		window.location.href = "/home"
    }
    else
    {
    	console.log("No user is signed in.");
    }
});

function login() {
	var email = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	if (email.length < 4) {
		alert('Vui lòng nhập địa chỉ email.');
		return;
	}
	if (password.length < 4) {
		alert('Vui lòng nhập mật khẩu.');
		return;
	}
	// Sign in with email and pass.
	// [START authwithemail]
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode === 'auth/wrong-password') {
			alert('Nhập sai mật khẩu.');
		} else {
			alert(errorMessage);
		}
		console.log(error);		
		// [END_EXCLUDE]
	});
	// [END authwithemail]
}

document.getElementById('login-button').addEventListener('click', login, false);