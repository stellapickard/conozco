

// IMAGE UPLOAD FUNCTION



// END OF NON-ANGULAR CODE


var app = angular.module("ConozcoApp", ["ngRoute","firebase"]);

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
		tempalteUrl: "templates/feed_general.html",
		controller: "generalfeed_controller"
	})

	$routeProvider.when("/admin", {
		templateUrl: "templates/admin.html",
		controller: "admin_controller"
	})

});

// LOGIN_CONTROLLER

app.controller('login_controller', ["$scope", "$firebaseAuth","$location",
  function($scope, $firebaseAuth, $location) {
    $scope.authObj = $firebaseAuth();

 //    //checking if user is signed in or not
	// $scope.authObj.$onAuthStateChanged(function(firebaseUser){
	// 	if (firebaseUser){
	// 		console.log('Signed in as = '+firebaseUser.uid);
	// 		//$location.path("/profile");
	// 	}
	// });

    $scope.authObj.$signInWithPopup("google").then(function(result) {
	  	console.log("Signed in as:", result.user.uid);
	  	$location.path("/profile");
	}).catch(function(error) {
	  	console.error("Authentication failed:", error);
	});
  }
]);

	





// PROFILE_CONTROLLER

app.controller('profile_controller', function($scope, $http){
	$(document).ready(function(){
		console.log( "ready!" );

	// WEB PAGE AUTO SIZE FUNCTION
	// function autoResizeDiv()
	//         {
	//             document.getElementById('#main').css.height = window.innerHeight +'px';
	//         }
	//         window.onresize = autoResizeDiv;
	//         autoResizeDiv();

	// PROFILE PAGE SWAP OUT FUNCTION

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

// closing tag of on ready function
	});
});

// WORKFEED_CONTROLLER

app.controller('workfeed_controller', function($scope, $http){




});

// GENERALFEED_CONTROLLER

app.controller('generalfeed_controller', function($scope, $http){




});

// ADMIN_CONTROLLER

app.controller('admin_controller', function($scope, $http){

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


});
