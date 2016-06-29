
// WEB PAGE AUTO SIZE FUNCTION
// function autoResizeDiv()
//         {
//             document.getElementById('main').style.height = window.innerHeight +'px';
//         }
//         window.onresize = autoResizeDiv;
//         autoResizeDiv();

// PROFILE PAGE SWAP OUT FUNCTION

$(document).ready(function() {
    console.log( "ready!" );


    $("default_display").mousehover(function(){
        var d = document.getElementById("default_display");
        var h = document.getElementById("hover_display");

        if( d.style.display === "block" ) {
            d.style.display = "none";
            h.style.display = "block";
        }
    });

    $("hover_display").mouseout(function(){
        var d = document.getElementById(default_display);
        var h = document.getElementById(hover_display);

        if (d.style.display === "none"){
            d.style.display = "block";
            h.style.display = "none";
        }

    });

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
