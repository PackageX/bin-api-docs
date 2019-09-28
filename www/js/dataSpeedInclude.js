$(function(){

  var includes = $('[data-include]');

  jQuery.each(includes, function(){

    var file = 'views/' + $(this).data('include') + '.html';

    $(this).load(file);

  });

  var onReadyTime = Date.now();

  console.log("----- 11onReadyTime = " + onReadyTime);

  $('#onReadyBoardTime').val(onReadyTime - baseTime);

  console.log("----- 11onReadyTime = " + (onReadyTime - baseTime));
  console.log("----- 11onReadyBoardTime = " + $('#onReadyBoardTime').val());

});


$( document ).ready(function() {

  var onReadyTime = Date.now();

  console.log("----- onReadyTime = " + onReadyTime);

  //$('#onReadyBoardTime').val(onReadyTime - baseTime);

  console.log("----- onReadyTime = " + (onReadyTime - baseTime));
  console.log("----- onReadyBoardTime = " + $('#onReadyBoardTime').val());

});
