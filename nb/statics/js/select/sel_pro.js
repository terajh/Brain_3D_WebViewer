function allChk(obj) {
    var chkObj = document.getElementsByName("RowCheck");
    var rowCnt = chkObj.length - 1;
    var check = obj.checked;
    if (check) {
        for (var i = 0; i <= rowCnt; i++) {
            if (chkObj[i].type == "checkbox") {
                chkObj[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i <= rowCnt; i++) {
            if (chkObj[i].type == "checkbox") {
                chkObj[i].checked = false;
            }
        }
    }
}

function fn_userDel() {
    var userid = "";
    var memberChk = document.getElementsByName("RowCheck");
    var chked = false;
    var indexid = false;

    var num_delete = 0;
    for (i = 0; i < memberChk.length; i++) {
        if (memberChk[i].checked) {
            num_delete += 1
        }
    }

    var ridList = new Array(num_delete)
    for (i = 0; i < memberChk.length; i++) {
        if (memberChk[i].checked) {
            ridList[i] = memberChk[i].value;
        }
    }
    if (num_delete != 0) {
        $.ajax({
            type: 'POST',
            url: 'del_project',
            data: JSON.stringify({
                "deleteList": ridList
            }),

            contentType: 'application/json',
            success: function(response, status) {
                alert('success to delete');
                window.location.reload();
                return;
            },
            error: function() {
                alert('fail to delete');
                return;
            }
        });

    } else {
        alert('nothing checked');
    }

}

function create_pro() {
    var searchName = document.getElementById("new_pro").value;
    location.href = "/new_project";
}