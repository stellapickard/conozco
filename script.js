var app = angular.module("ConozcoApp", ["ngRoute","firebase", "angular.filter"]);

// Initialize Firebase (Replace Keys with Any New Firebase Project, Will Work)
// When making a new Firebase project, make sure to go to Rules tab
// in the Realtime Database and set both read and write to true
// You can modify this later with permissions

var config = {
	apiKey: "AIzaSyBT1BopiYEPs2ztZxep9Q8fu_IxPiJd0j0",
	authDomain: "conozco-1358.firebaseapp.com",
	databaseURL: "https://conozco-1358.firebaseio.com",
	storageBucket: "conozco-1358.appspot.com",
};
firebase.initializeApp(config);

var SENT_URL = 'https://twinword-sentiment-analysis.p.mashape.com/analyze/';		

// Honestly....not sure what this is for...
app.filter('keylength', function(){
  return function(input){
  	if(!angular.isObject(input)){
      return 0;
    }
    return Object.keys(input).length;
  }
});

// ROUTE CONFIGURATION

app.config(function($routeProvider){


	$routeProvider.when ("/", {
		templateUrl: "templates/login.html",
		controller: "login_controller"
	})

	// $routeProvider.when("/profile", {
	// 	templateUrl: "templates/profile.html",
	// 	controller: "profile_controller"
	// })

	$routeProvider.when("/work", {
		templateUrl: "templates/feed_work.html",
		controller: "workfeed_controller"
	})

	$routeProvider.when("/general", {
		templateUrl: "templates/feed_general.html",
		controller: "generalfeed_controller"
	})

	// $routeProvider.when("/admin", {
	// 	templateUrl: "templates/admin.html",
	// 	controller: "admin_controller"
	// })

});

// LOGIN_CONTROLLER

app.controller('login_controller', function($scope, $firebaseAuth, $location, $firebaseObject) {
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			console.log("Signed in as:", firebaseUser.displayName);
						console.log(firebaseUser);
			$scope.loggedIn = true;
			$location.path("/work");
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
			user.admin = false;
			user.$save();


		}).catch(function(error) {
			console.error("Authentication failed:", error);
		});

	}

	$scope.workLink = function(){
		$location.path("/work")
	}
	$scope.genLink = function(){
		$location.path("/general")
	}

});

// WORKFEED CONTROLLER

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

	$scope.signOut = function(){
		auth.$signOut();
	}

	var url = 'https://twinword-sentiment-analysis.p.mashape.com/analyze/';

	var feedRef = firebase.database().ref().child("work_feed");
	$scope.announcements = $firebaseArray(feedRef);
	$scope.newAnnouncement = {};
	$scope.newComment = {};
	
	$scope.callSentAjax = function(text, callback){
		$.ajax({
      type: "GET",
      url: SENT_URL,
      headers: {"X-Mashape-Key":"IU5RDQiu0omshnKfW2nXe6Qe891Hp16W0Vjjsnwn8zDAeD07gY"},
      data: { text: text },
      dataType: "json",
      success: function(response) {
        $scope.newAnnouncement.postSent = (response.score).toFixed(2);
        callback();
      },
      error: function(err) {
        alert("Error with Sentiment Call");
      }
    });
	}

	$scope.postAnnouncement = function (){
		var d = new Date();
		$scope.newAnnouncement.postName = $scope.fireUser.displayName;
		$scope.newAnnouncement.postPic = $scope.fireUser.photoURL;
		$scope.newAnnouncement.postDate = {
			date: (d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()),
			time: (d.getHours()+":"+d.getMinutes())
		};
		$scope.callSentAjax($scope.newAnnouncement.text, function(){
			$scope.announcements.$add($scope.newAnnouncement);
			$scope.newAnnouncement = {};
		});
	};

	$scope.postComment = function (announcement, comment) {
		var d = new Date();
		$scope.newComment = {
			text: comment,
			poster: $scope.fireUser.displayName,
			postDate: {
				date: (d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()),
				time: (d.getHours()+":"+d.getMinutes())
			}
		}
		var commentsRef = firebase.database().ref("work_feed/"+announcement.$id).child('comments');
		commentsRef.push().set($scope.newComment);
		$scope.newComment = {};
	};

	$scope.onClick = function(announcement) {	
		var scoreRef = firebase.database().ref('work_feed/'+announcement.$id).child('scores');
		scoreRef.push().set($scope.score);
	};
	
	$scope.workLink = function(){
		$location.path("/work")
	}
	$scope.genLink = function(){
		$location.path("/general")
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
		}
	});

	$scope.signOut = function(){
		auth.$signOut();
	}

	var url = 'https://twinword-sentiment-analysis.p.mashape.com/analyze/';

	var feedRef = firebase.database().ref().child("general_feed");
	$scope.announcements = $firebaseArray(feedRef);
	$scope.newAnnouncement = {};
	$scope.newComment = {};
	
	$scope.callSentAjax = function(text, callback){
		$.ajax({
      type: "GET",
      url: SENT_URL,
      headers: {"X-Mashape-Key":"IU5RDQiu0omshnKfW2nXe6Qe891Hp16W0Vjjsnwn8zDAeD07gY"},
      data: { text: text },
      dataType: "json",
      success: function(response) {
        $scope.newAnnouncement.postSent = (response.score).toFixed(2);
        callback();
      },
      error: function(err) {
        alert("Error with Sentiment Call");
      }
    });
	}

	$scope.postAnnouncement = function (){
		var d = new Date();
		$scope.newAnnouncement.postName = $scope.fireUser.displayName;
		$scope.newAnnouncement.postPic = $scope.fireUser.photoURL;
		$scope.newAnnouncement.postDate = {
			date: (d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()),
			time: (d.getHours()+":"+d.getMinutes())
		};
		$scope.callSentAjax($scope.newAnnouncement.text, function(){
			$scope.announcements.$add($scope.newAnnouncement);
			$scope.newAnnouncement = {};
		});
	};

	$scope.postComment = function (announcement, comment) {
		var d = new Date();
		$scope.newComment = {
			text: comment,
			poster: $scope.fireUser.displayName,
			postDate: {
				date: (d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()),
				time: (d.getHours()+":"+d.getMinutes())
			}
		}
		var commentsRef = firebase.database().ref("general_feed/"+announcement.$id).child('comments');
		commentsRef.push().set($scope.newComment);
		$scope.newComment = {};
	};

	$scope.onClick = function(announcement) {	
		var scoreRef = firebase.database().ref('general_feed/'+announcement.$id).child('scores');
		scoreRef.push().set($scope.score);
	};
	
	$scope.workLink = function(){
		$location.path("/work")
	}
	$scope.genLink = function(){
		$location.path("/general")
	}
	
});




// // ADMIN_CONTROLLER

// app.controller('admin_controller', function($scope, $http, $firebaseAuth ,$firebaseArray, $location) {
// 	var auth = $firebaseAuth();

// 	auth.$onAuthStateChanged(function(firebaseUser) {
// 		if (firebaseUser) {
// 			console.log("Signed in as:", firebaseUser.displayName);
// 		} 
// 		else {
// 			console.log("Not Signed In");
// 			$location.path("/");
// 		}
// 	});

// 	var employeeRef = firebase.database().ref().child("employees");
// 	$scope.employee = $firebaseArray(employeeRef);

// 	$scope.newEmployee = {};
	
// 	$scope.addEmployee = function (){
// 		$scope.employee.$add($scope.newEmployee);
// 	};

// });


// // PROFILE_CONTROLLER

// app.controller('profile_controller', function($scope, $http, $firebaseArray, $location, $firebaseAuth){
// 	var auth = $firebaseAuth();

// 	auth.$onAuthStateChanged(function(firebaseUser) {
// 		if (firebaseUser) {
// 			console.log("Signed in as:", firebaseUser.displayName);
// 			$scope.fireUser = firebaseUser;
// 			$scope.firstName = firebaseUser.displayName.split(' ')[0];
// 		} 
// 		else {
// 			console.log("Not Signed In");
// 			$location.path("/");
// 		}
// 	});

	
// 	function rebindHovers() {
// 		$('.default_display').mouseover(function(){
// 			$(this).find('.hover_display').css('display','block');
// 		});

// 		$('.default_display').mouseout(function(){
// 			$(this).find('.hover_display').css('display','none');
// 		});
// 	}

	
// 	// EMPLOYEE ONBOARDING 
// 	var employeeRef = firebase.database().ref().child("employees");
// 	$scope.employees = $firebaseArray(employeeRef);
// 	$scope.newEmployee = {};

// 	$scope.employees.$watch(function() {
// 	  	setTimeout(function(){ 
// 	  		rebindHovers();
// 	  	}, 1000);
//   	});
  	
	
// 	$scope.addEmployee = function (){
// 		$scope.employee.$add($scope.newEmployee);
// 	}; 



//  });