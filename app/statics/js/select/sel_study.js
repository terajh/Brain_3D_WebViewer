function allChk(obj) {
    var chkObj = document.getElementsByName("RowCheck");
    var rowCnt = chkObj.length - 1;
    var check = obj.checked;
    if (check) {﻿
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