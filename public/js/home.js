

var name, email, photoUrl, uid, emailVerified;
var device_mac_key;
var listCurrentStatus;
var currentStatus;
var select = document.getElementById("select_devices");
var chkDeviceSTT1 = document.getElementById("chkDevice1");
var chkDeviceSTT2 = document.getElementById("chkDevice2");
var chkDeviceSTT3 = document.getElementById("chkDevice3");
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
    
  		name = user.displayName;
  		email = user.email;
  		photoUrl = user.photoURL;
  		emailVerified = user.emailVerified;
  		uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
		console.log("  Provider-specific UID: " + uid);
		console.log("  Name: " + name);
    	console.log("  Email: " + email);                 	
 		
 		var database = firebase.database().ref(uid);
 		var urlRef = database.child("/devices"); 		

 		urlRef.on("value", function(snapshot) {
 			console.log(JSON.stringify(snapshot)); 			
			var select_index = select.selectedIndex;
			while (select.options.length > 0) {
				select.remove(0);
			}
			listCurrentStatus = snapshot.val();
			snapshot.forEach(function(child) {
				if(select_index == -1) //kiem tra neu la lan dau tien load page
				{
					select_index = 0;
					device_mac_key = child.key;
				}
				select.options[select.options.length] = new Option(child.val().name, child.key);
			});

			if(select_index > -1)
			{
				select.selectedIndex = select_index; //gan lai index truoc do
			}

			if(select.selectedIndex > -1)
			{
				snapshot.forEach(function(child) {
					//console.log("child.key: " + child.key);
					if(child.key == device_mac_key)
					{
						console.log("find ok " + device_mac_key + " : " + child.key);
						currentStatus = child.val().status;
																		
						if ((currentStatus & 0x01) == 0) {
							$("#chkDevice1").prop('checked', false);
						}
						else
							$("#chkDevice1").prop('checked', true);
						//-------------------
						if ((currentStatus & 0x02) == 0) {
							$("#chkDevice2").prop('checked', false);
						}
						else
							$("#chkDevice2").prop('checked', true);
						//-------------------
						if ((currentStatus & 0x04) == 0) {
							$("#chkDevice3").prop('checked', false);
						}
						else
							$("#chkDevice3").prop('checked', true);
					}
				});
			}

 		});

	} else {
    	console.log("No user is signed in.");
    	location.href = "/login";
  	}
});

select.onchange = function(){

	device_mac_key = select.value;
	console.log("selectedIndex: ", select.selectedIndex);
	console.log("device_mac_key: " + device_mac_key);

	var jsonStr = JSON.stringify(listCurrentStatus);
	var obj = JSON.parse(jsonStr);
	currentStatus = obj[device_mac_key]['status'];

	console.log("currentStatus: " + currentStatus);
	
	if ((currentStatus & 0x01) == 0) {
		chkDeviceSTT1.checked  = false;
	}
	else
		chkDeviceSTT1.checked  = true;
	//-------------------
	if ((currentStatus & 0x02) == 0) {
		chkDeviceSTT2.checked  = false;
	}
	else
		chkDeviceSTT2.checked  = true;
	//-------------------
	if ((currentStatus & 0x04) == 0) {
		chkDeviceSTT3.checked  = false;
	}
	else
		chkDeviceSTT3.checked  = true;
};

$("#chkDevice1").click(function(){
	var estado = $(this).is(':checked');
	console.log("chkDevice1: ", estado);	
	if(select.selectedIndex > -1)
	{	
		if(estado == true)	
		{
			currentStatus |= 0x01;
		}
		else 
		{
			currentStatus &= 0xFE;
		}	
		console.log(currentStatus);

		var updates = {};
		updates["devices/"+ device_mac_key +"/status/"] = currentStatus;
		console.log(updates);
		if(uid)
		{
			firebase.database().ref(uid).update(updates);
		}
	}
});

$("#chkDevice2").click(function(){
	var estado = $(this).is(':checked');
	console.log("chkDevice2: ", estado);

	if(select.selectedIndex > -1)
	{	
		if(estado == true)	
		{
			currentStatus |= 0x02;
		}
		else 
		{
			currentStatus &= 0xFD;
		}	
		console.log(currentStatus);

		var updates = {};
		updates["devices/"+ device_mac_key +"/status/"] = currentStatus;
		console.log(updates);
		if(uid)
		{
			firebase.database().ref(uid).update(updates);
		}
	}
});

$("#chkDevice3").click(function(){
	var estado = $(this).is(':checked');
	console.log("chkDevice3: ", estado);

	if(select.selectedIndex > -1)
	{	
		if(estado == true)	
		{
			currentStatus |= 0x04;
		}
		else 
		{
			currentStatus &= 0xFB;
		}	
		console.log(currentStatus);

		var updates = {};
		updates["devices/"+ device_mac_key +"/status/"] = currentStatus;
		console.log(updates);
		if(uid)
		{
			firebase.database().ref(uid).update(updates);
		}
	}
});

$("#logout").click(function(){
	
	console.log("logout");	
	// [START signout]
	firebase.auth().signOut();
	// [END signout]
	location.href = "/";
});
