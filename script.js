var config = {
	apiKey: "AIzaSyBT1BopiYEPs2ztZxep9Q8fu_IxPiJd0j0",
	authDomain: "conozco-1358.firebaseapp.com",
	databaseURL: "https://conozco-1358.firebaseio.com",
	storageBucket: "conozco-1358.appspot.com",
};
firebase.initializeApp(config);

var app = angular.module("ConozcoApp", ["ngRoute","firebase", "angular.filter"]);

var currentUserToken = "";
var test;

var currentUser = "";
var currentToken = "";



// ROUTE CONFIGURATION

app.config(function($routeProvider){


	$routeProvider.when ("/", {
		templateUrl: "templates/login.html",
		controller: "login_controller"
	})

	$routeProvider.when("/profile", {
		templateUrl: "templates/profile.html",
		controller: "profile_controller"
	})

	$routeProvider.when("/work", {
		templateUrl: "templates/feed_work.html",
		controller: "workfeed_controller"
	})

	$routeProvider.when("/general", {
		templateUrl: "templates/feed_general.html",
		controller: "generalfeed_controller"
	})

	$routeProvider.when("/admin", {
		templateUrl: "templates/admin.html",
		controller: "admin_controller"
	})

});

// LOGIN_CONTROLLER

app.controller('login_controller', function($scope, $firebaseAuth, $location, $firebaseObject) {
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			console.log("Signed in as:", firebaseUser.displayName);
			$scope.loggedIn = true;
		} 
		else {
			console.log("Not Signed In");
			$scope.loggedIn = false;
		}
	});

	$scope.signIn = function() {
		auth.$signInWithPopup("google").then(function(result) {
			var ggUser = result.user;
			var ref = firebase.database().ref().child("Users").child(ggUser.uid);
			var user = $firebaseObject(ref);

			user.uid = ggUser.uid;
			user.email = ggUser.email;
			user.name = ggUser.displayName;
			user.$save().then(function(){
				console.log("User Saved");
			});


		}).catch(function(error) {
			console.error("Authentication failed:", error);
		});

	}

	$scope.signOut = function(){
		auth.$signOut();
	}

	$scope.workLink = function(){
		$location.path("/work")
	}
	$scope.genLink = function(){
		$location.path("/general")
	}
	$scope.profLink = function(){
		$location.path("/profile")
	}

});
// PROFILE_CONTROLLER

app.controller('profile_controller', function($scope, $http, $firebaseArray, $location, $firebaseAuth){
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			console.log("Signed in as:", firebaseUser.displayName);
			$scope.fireUser = firebaseUser;
			$scope.firstName = firebaseUser.displayName.split(' ')[0];
		} 
		else {
			console.log("Not Signed In");
			$location.path("/");
		}
	});


	
	// EMPLOYEE ONBOARDING 
	var employeeRef = firebase.database().ref().child("employees");
	$scope.employees = $firebaseArray(employeeRef);
	console.log($scope.employees);
	$scope.newEmployee = {};
	
	$scope.addEmployee = function (){
		$scope.employee.$add($scope.newEmployee);
	}; 

	// PROFILE IMAGE & PEDIGREE SWAP OUT FUNCTION

	

	$('.default_display').mouseover(function(){
		$(this).find('.hover_display').css('display','block');
	});

	$('.default_display').mouseout(function(){
		$(this).find('.hover_display').css('display','none');
	});


	// ON CLICK FUNCTION FOR MOBILE DESIGN
	$('.default_display').click(function(){
		if ($(this).find('.hover_display').css('display') === "none"){
			$(this).find('.hover_display').css('display', 'block')
		} else {
			$(this).find('.hover_display').css('display', 'none');
		}
	});

// END OF CONTROLLER - LEAVE IMAGE UPLOAD CODE OUTSIDE CONTROLLER

});

function imgUploadFunction(){
	var x = document.getElementById("photo_upload");
	var txt = "";
	if ('files' in x) {
		if (x.files.length == 0) {
			txt = "";
		} else {
			for (var i = 0; i < x.files.length; i++) {
				txt += "<br><strong>" + (i+1) + " file</strong><br>";
				var file = x.files[i];
				if ('name' in file) {
					txt += "Name: " + file.name + "<br>";
				}
				if ('size' in file) {
					txt += "Size: " + file.size + " bytes <br>";
				}
			}
		}
	}
	else {
		if (x.value == "") {
			txt += "Please select an image";
		} else {
			txt += "The files property is not supported by your browser!";
			txt  += "<br>The path of the selected file: " + x.value; 
           // If the browser does not support the files property, it will return the path of the selected file instead.
         }
       }
       document.getElementById("img_upload").innerHTML = txt;
     }


// WORKFEED_CONTROLLER

app.controller('workfeed_controller', function($scope, $http, $firebaseAuth, $firebaseArray, $location){
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			console.log("Signed in as:", firebaseUser.displayName);
			$scope.fireUser = firebaseUser;
			$scope.firstName = firebaseUser.displayName.split(' ')[0];
		} 
		else {
			console.log("Not Signed In");
			$location.path("/");
		}
	});

	var feedRef = firebase.database().ref().child("work_feed");
	$scope.announcements = $firebaseArray(feedRef);
	$scope.newAnnouncement = {};
	$scope.newComment ={};
	
	

	$scope.postAnnouncement = function (){
		$scope.newAnnouncement.postName = $scope.fireUser.displayName;
		$scope.newAnnouncement.postPic = $scope.fireUser.photoURL;
		$scope.newAnnouncement.postDate = "";
		$scope.announcements.$add($scope.newAnnouncement);
		$scope.newAnnouncement = {};
	};

	$scope.postComment = function (announcement) {
		var commentsRef = firebase.database().ref("work_feed/"+announcement.$id).child('comments');
		commentsRef.push().set($scope.newComment);
		$scope.newComment={};
	};

	//SCORE COUNTER TOOL WHICH WORKS

	// $scope.score = 0;

	// $scope.onClick = function() {	
	// $scope.score += 1;
	// console.log($scope.score);
	// };

	//NOW TRYING TO SAVE TO FIREBASE
	//console.log($scope.announcements);
	$scope.score = 0;

	$scope.onClick = function(announcement) {	
		test = announcement;
		var scoreRef = firebase.database().ref('work_feed/'+announcement.$id).child('scores');
		$scope.score += 1;
		console.log(scoreRef);
		scoreRef.push().set($scope.score);
	};
	
	$scope.workLink = function(){
		$location.path("/work")
	}
	$scope.genLink = function(){
		$location.path("/general")
	}
	$scope.profLink = function(){
		$location.path("/profile")
	}

});

// GENERALFEED_CONTROLLER

app.controller('generalfeed_controller', function($scope, $http, $firebaseAuth, $firebaseArray, $location){
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			console.log("Signed in as:", firebaseUser.displayName);
			$scope.fireUser = firebaseUser;
			$scope.firstName = firebaseUser.displayName.split(' ')[0];
		} 
		else {
			console.log("Not Signed In");
			$location.path("/");
		};
	});

	var feedRef = firebase.database().ref().child("general_feed");
	$scope.announcements = $firebaseArray(feedRef);
	$scope.newAnnouncement = {};
	$scope.newComment ={
		text: ""
	};

	$scope.postAnnouncement = function (){
		$scope.newAnnouncement.postName = $scope.fireUser.displayName;
		$scope.newAnnouncement.postPic = $scope.fireUser.photoURL;
		$scope.newAnnouncement.postDate = "";
		$scope.announcements.$add($scope.newAnnouncement);
		$scope.newAnnouncement = {};
	};

	$scope.postComment = function (announcement) {
		var commentsRef = firebase.database().ref("general_feed/"+announcement.$id).child('comments');
		commentsRef.push().set($scope.newComment);
		$scope.newComment={};

	};
	
	$scope.workLink = function(){
		$location.path("/work")
	}
	$scope.genLink = function(){
		$location.path("/general")
	}
	$scope.profLink = function(){
		$location.path("/profile")
	}

});

// ADMIN_CONTROLLER

app.controller('admin_controller', function($scope, $http, $firebaseAuth ,$firebaseArray, $location) {
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			console.log("Signed in as:", firebaseUser.displayName);
		} 
		else {
			console.log("Not Signed In");
			$location.path("/");
		}
	});

	var employeeRef = firebase.database().ref().child("employees");
	$scope.employee = $firebaseArray(employeeRef);

	$scope.newEmployee = {};
	
	$scope.addEmployee = function (){
		$scope.employee.$add($scope.newEmployee);
	};

});