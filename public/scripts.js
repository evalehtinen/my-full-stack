
$(document).ready(function(){

  $('#submitbtn').click(function() {
      var textsearch = $('input').val();
      $('.image').text(textsearch);      
        $.get( 'images', {search: textsearch}, function(data) {
          $('.image').text(data);      
          
        });
  });
});