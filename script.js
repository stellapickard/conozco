var app = angular.module("ConozcoApp", ["ngRoute","firebase", "angular.filter"]);

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

// app.filter('reverse', function() {
//   return function(items) {
//     return items.slice().reverse();
//   };
// });

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


// WORKFEED_CONTROLLER

app.controller('workfeed_controller', function($scope, $http, $firebaseAuth, $firebaseArray){

	var feedRef = firebase.database().ref().child("work_feed");
	$scope.announcements = $firebaseArray(feedRef);
	$scope.newWorkAnn = {};

	$scope.postWorkAnn = function (){
		$scope.announcements.$add($scope.newWorkAnn);
		$scope.newWorkAnn = {};
	};

	var commentRef = firebase.database().ref().child("work_comments");
	$scope.workComments = $firebaseArray(commentRef);

	$scope.postWorkComment = function (){
		$scope.workComments.$add($scope.newWorkComment);
	};



});

// GENERALFEED_CONTROLLER

app.controller('generalfeed_controller', function($scope, $http, $firebaseAuth, $firebaseArray){

	var feedRef = firebase.database().ref().child("general_feed");
	$scope.announcements = $firebaseArray(feedRef);
	$scope.newAncmnt = {};

	$scope.postAncmnt = function (){
		console.log($scope.newAncmnt);
		$scope.announcements.$add($scope.newAncmnt);
		$scope.newAncmnt = {};
	};

});

// ADMIN_CONTROLLER

app.controller('admin_controller', function($scope, $http, $firebaseArray) {
	

 var employeeRef = firebase.database().ref().child("employees");
 $scope.employee = $firebaseArray(employeeRef);

$scope.newEmployee = {};
	
		$scope.addEmployee = function (){
			$scope.employee.$add($scope.newEmployee);
		}

// START OF IMAGE UPLOAD CODE

// var img2fire = angular.module('img2fire', ['firebase', 'angular.filter']);

// img2fire.controller("base64Ctrl", function($scope, $firebaseArray) {
  
  var ref = new Firebase("https://base64images.firebaseio.com/");

  var img = new Firebase("https://base64images.firebaseio.com/images");
  $scope.imgs = $firebaseArray(img);

  var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
  $scope.uploadFile = function() {
    var sFileName = $("#nameImg").val();
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          var filesSelected = document.getElementById("nameImg").files;
          if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];

            var fileReader = new FileReader();

            fileReader.onload = function(fileLoadedEvent) {
              var textAreaFileContents = document.getElementById(
                "textAreaFileContents"
              );


              $scope.imgs.$add({
                date: Firebase.ServerValue.TIMESTAMP,
                base64: fileLoadedEvent.target.result
              });
            };

            fileReader.readAsDataURL(fileToLoad);
          }
          break;
        }
      }

      if (!blnValid) {
        alert('File is not valid');
        return false;
      }
    }

    return true;
  }

  // $scope.deleteimg = function(imgid) {
  //   var r = confirm("Do you want to remove this image ?");
  //   if (r == true) {
  //     $scope.imgs.forEach(function(childSnapshot) {
  //       if (childSnapshot.$id == imgid) {
  //           $scope.imgs.$remove(childSnapshot).then(function(ref) {
  //             ref.key() === childSnapshot.$id; // true
  //           });
  //       }
  //     });
  //   }
  // }







// END OF CONTROLLER - LEAVE IMAGE UPLOAD OUT OF THE CONTROLLER

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
