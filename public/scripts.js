
$(document).ready(function(){

  $('#submitbtn').click(function() {
      var textsearch = $('input').val(); 
      $('.images').empty();
        $.get( 'images', {search: textsearch}, function(data) {            
            $.each(data, function(i, item) {
                $('.images').append('<div><blockquote class="imgur-embed-pub" lang="en" data-id="a/'+data[i].id+'"><a href="//imgur.com/'+data[i].id+'">'+data[i].description+'</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>'); 
                console.log(data[i].id);
            })
              
        });
  });
});

//<blockquote class="imgur-embed-pub" lang="en" data-id="2GuAESk"><a href="//imgur.com/2GuAESk">My face when I do my taxes and figure out how little I made as an illustrator this year... O.C.</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>