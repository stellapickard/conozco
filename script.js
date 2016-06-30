// NON-ANGULAR CODE FOR PROFILE PAGE IMAGE SWAP OUT, PHOTO UPLOAD AND FULL PAGE BACKGROUND 

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

// IMAGE UPLOAD FUNCTION

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

// END OF NON-ANGULAR CODE

var app = angular.module("ConozcoApp", ["ngRoute"]);

// ROUTE CONFIGURATION

app.config(function($routeProvider){
    $routeProvider

    .when ("/", {
        templateUrl: "/login.html",
        controller: "login_controller"
    })

    .when("/profile", {
        templateUrl: "template/profile.html",
        controller: "profile_controller"
    })

    .when("/workfeed", {
        templateUrl: "template/feed_work.html",
        controller: "workfeed_controller"
    })

    .when("/generalfeed", {
        tempalteUrl: "template/feed_general.html",
        controller: "generalfeed_controller"
    })

    .when("/admin", {
        templateUrl: "template/admin.html",
        controller: "admin_controller"
    })

});

// LOGIN_CONTROLLER 

ConozcoApp.controller('login_controller', function($scope, $http){




});

// PROFILE_CONTROLLER

ConozcoApp.controller('profile_controller', function($scope, $http){




});

// WORKFEED_CONTROLLER

ConozcoApp.controller('workfeed_controller', function($scope, $http){




});

// GENERALFEED_CONTROLLER

ConozcoApp.controller('generalfeed_controller', function($scope, $http){




});

// ADMIN_CONTROLLER

ConozcoApp.controller('admin_controller', function($scope, $http){




});


