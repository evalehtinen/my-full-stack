
$(document).ready(function(){
  $.get('date', function(data) {
      $('.refreshed').text(data);
      console.log("JAAHASD");
  });
    
    //Since we are not using form, the entery key doesnt use submit button by deafult. This fixes it.
    $(function() {
        $('#searchtext').keypress(function (e) {
            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                $('input[type=submit]').click();
                return false;
            } else {
                return true;
            }
        });
    });
    //On click, request image data from server and render them to embeds.
    $('#submitbtn').click(function() {
        var textsearch = $('input').val(); 
        $('.images').empty();
        
        $.get( 'images', {search: textsearch}, function(data) {  
            if($.isEmptyObject(data)) {
                $('.images').text("No match");
            }
            else {
                $.each(data, function(i, item) {
                    if(data[i].id && !data[i].animated) {
                        $('.images').append('<div class="image-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="a/'+data[i].id+'"><a href="//imgur.com/'+data[i].id+'">'+data[i].description+'</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>'); 
                        console.log(data[i].id);
                    }
                    if(data[i].id && data[i].animated) {
                        $('.images').append('<div class="image-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="'+data[i].id+'"><a href="//imgur.com/'+data[i].id+'">'+data[i].description+'</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>'); 
                        console.log(data[i].id);
                    }                
                });
            }              
        });
    });
    $('#refreshbtn').click(function() {
        console.log("benis");
        $.get( 'refresh', function(data) {
            $('.refreshed').text(data);
        });
    });
});

