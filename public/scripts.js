
$(document).ready(function(){

  $('#submitbtn').click(function() {
      var textsearch = $('input').val(); 
      $('.images').empty();
        $.get( 'images', {search: textsearch}, function(data) {  
            if($.isEmptyObject(data)) {
                $('.images').text("No match");
            }
            else {
                $.each(data, function(i, item) {
                    if(!data[i].animated) {
                        $('.images').append('<div><blockquote class="imgur-embed-pub" lang="en" data-id="a/'+data[i].id+'"><a href="//imgur.com/'+data[i].id+'">'+data[i].description+'</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>'); 
                        console.log(data[i].id);
                    }
                    if(data[i].animated) {
                        $('.images').append('<div><blockquote class="imgur-embed-pub" lang="en" data-id="'+data[i].id+'"><a href="//imgur.com/'+data[i].id+'">'+data[i].description+'</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>'); 
                        console.log(data[i].id);
                    }
                
                })
            }              
        });
  });
});

