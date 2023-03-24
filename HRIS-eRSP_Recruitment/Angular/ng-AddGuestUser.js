


ng_eRSP_App.controller("cAddGuestUser_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.header_title = "APPLICANT LIST"
    s.civil_status = []
    s.guest_id = ""
    //s.gu.g_status = "0"
    s.gu = {
          g_user_id: ""
        , g_status: ""
        , last_name: ""
        , first_name: ""
        , middle_name: ""
        , civil_status: ""
        , gender: ""
        , birth_date: ""
        , g_address: ""
        , agency: ""
        , position : ""
    }
    function setValue(id,value)
    {
        $("#" + id).val(value);
        s.gu[id] = value;
    }
    function init() {
      
        h.post("../cGuestUserInfo/AddUserInitialize").then(function (d) {
            if (d.data.icon == "success") {
               
                
                s.civil_status = d.data.civil_status
                if (d.data.edit)
                {
                    
                    d.data.ob.populateFields(s.gu, 0);
                    var gstatus = d.data.ob[0].g_status
                    if (gstatus == true) {
                        s.gu.g_status = "1"
                        $("#g_status").val("1");

                    }
                    else {
                        s.gu.g_status = "0"
                        $("#g_status").val("0");

                    }
                }
                else {
                    s.gu.g_user_id = d.data.guest_id[0]
                    s.gu.g_status = "0"
                    $("#g_status").val("0");
                }


                
               
            }
        })
    }

 
    init()
   
    s.BackToGrid = function () {
        location.href = "cGuestUserInfo/Index";
    }
   
    s.saveGuestUser = function (gu) {
        var bit = gu.g_status == "1" ? true : false;
        if (cs.ValidateFields(s.gu)){
            h.post("cGuestUserInfo/saveGuestUserInfo", { gu: gu ,bit:bit}).then(function (d) {
                if (d.data.edit == false)
                {
                    cs.clearFields(s.gu)
                    s.gu.g_user_id = d.data.guest_id[0]
                }
                
                 swal(d.data.message, { icon: d.data.icon })
                
            })
        }
    }
})


