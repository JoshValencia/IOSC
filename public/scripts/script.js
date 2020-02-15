var timeOut = $('#timeout')
var btnArea = $('#buttons_area');
var timeIn = $('#timein');
var rbutton = $('.r-button');
var buttons = document.querySelector('#buttons_area button');

$(document).ready(function(){
    rbutton.hide();
    $(window).scroll(function(){
        if($(window).scrollTop()>480){
            $('#nav').addClass('scrollColor');
        }else{
            $('#nav').removeClass('scrollColor');
        }
    });

    



    // $("#nav").on('click', function(event) {

    //     // Make sure this.hash has a value before overriding default behavior
    //     if (this.hash !== "") {
    //       // Prevent default anchor click behavior
    //       event.preventDefault();
    
    //       // Store hash
    //       var hash = this.hash;
    
    //       // Using jQuery's animate() method to add smooth page scroll
    //       // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    //       $('html, body').animate({
    //         scrollTop: $(hash).offset().top
    //       }, 800, function(){
       
    //         // Add hash (#) to URL when done scrolling (default click behavior)
    //         window.location.hash = hash;
    //       });
    //     } // End if
    //   });

});


timeIn.click(function() {
    timeIn.hide();
    rbutton.show();
});

timeOut.click(function() {
    rbutton.hide();
    timeIn.show();
})