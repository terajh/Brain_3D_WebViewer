$(function() {
  $('#btnSignUp').click(function() {
    console.log("Hello");
    $.ajax({
      url: 'signUp',
      data: $('form').serialize(),
      type: 'POST',
      success: function(response) {
          console.log(response);
      },
      error: function(error) {
          console.log(error);
      }
    });
  });
});