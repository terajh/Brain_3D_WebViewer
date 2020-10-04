function tocheckpw(){
    var pw = document.getElementById("inputPassword").value;
    var pwck = document.getElementById("pwcheck").value;

    if (pw != pwck){
        document.getElementById("pwsame").innerHTML = 'Different above';
        $('input[name=inputPassword]').val('');
        $('input[name=checkPassword]').val('');
        return false;
    }
}

function check_sub(){
    alert('Click IDcheck button, please.');
};

function check_email(){
    var joinId = document.getElementById("inputEmail").value;
    document.getElementById("pwsame").innerHTML = '';

    if(joinId != ""){
        $.ajax({
            type : 'POST',
            url : 'checkId',
            data : JSON.stringify({"dueId":joinId}),
            contentType: 'application/json',
            success : function(response) {
                console.log(response);
                if(response == 0){
                    alert('This email is available.');
                    $('#btn').show();
                    $('#btn1').hide();
                }else{
                    alert('This email is already in use');
                    $('input[name=inputEmail]').val('');
                    $('#btn').hide();
                    $('#btn1').show();
                }
            },
            error : function() {
                alert('fail to check email');
            }
        });
    }else{
        alert('Input your email, please');
    }
};