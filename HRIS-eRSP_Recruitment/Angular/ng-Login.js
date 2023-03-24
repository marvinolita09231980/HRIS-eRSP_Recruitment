


angular.module('ng_eRSP_App2',[]).controller("LoginCtrlr", function ($scope, $http, $filter) {
    var s = $scope
    var h = $http
    

    s.lgn = {
         username : ""
        ,password : ""
    }

    function init() {
        h.post("../Login/isUserLogin").then(function (d) {
            
            if (d.data.isLogin == 1) {
                location.href = "../cMainPage/Index"
            }
        })
    }
    init()
    s.btn_Login_Submit = function (lgn) {
        
        if (ValidateFields(s.lgn))
        {
            h.post("../Login/Login_Validation", { username: s.lgn.username, password: s.lgn.password }).then(function (d) {
                if(d.data.cred.length > 0)
                {
                    if (d.data.success > 0) {
                            if (d.data.cred[0].log_in_flag == "X") {
                                swal("Invalid Password!", { icon: "error", });
                            }
                            else if (d.data.cred[0].log_in_flag == "I") {
                                swal("Inactive user account!", { icon: "error", });
                            }
                            else{

                                if (d.data.cred[0].change_password == true) {
                                    swal({
                                        title: "First Login Notification?",
                                        text: "This is your first time to login!\n" +
                                               "For security reason we require you to change your password.\n" +
                                               "Would you like to redirect to http://192.168.6.49:18 to change your password?",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                    }).then(function (willDelete) {
                                        if (willDelete) {
                                            location.href = "http://192.168.6.49:18"
                                        }
                                        else {
                                            location.href = "../Login/Index"
                                        }
                                    });
                                }
                                else {
                                    location.href = "../cMainPage/Index"
                                }
                            }
                    }
                    else if (d.data.success == 2) {
                        swal("Account not found!", { icon: "error", });
                    }
                    else if (d.data.success == 0) {
                  
                        swal("Validation Error!", { icon: "error", });
                    }
                }
                else
                {
                    swal("User not define", { icon: "error", });
                }

                
              


            })
        }
       
          
        

    }



    function ValidateFields(obj) {
        var retval = 0;
        var bol = false
        var i_key = Object.keys(obj)
        //var i_val = Object.keys(obj).map(function (itm) { return obj[itm]; });

        for (var x = 0; x < i_key.length; x++) {
            var i_val = $("#" + i_key[x]).val()

            if ($("#" + i_key[x])[0] != undefined) {
                if ($("#" + i_key[x])[0].hasAttribute("required")) {

                    if (elEmpty(i_val)) {
                        required(i_key[x])
                        retval = retval + 1
                    }
                    else {
                        notrequired(i_key[x]);
                    }
                }
            }
        }

        if (retval == 0) {
            bol = true
        }
        else {
            bol = false
        }

        return bol
    }

    function elEmpty(data) {
        if (data == null || data == "" || data == undefined) {
            return true
        }
        else {
            return false
        }

    }

    function required(n, wn) {
        $("#" + n).css({
            "border-color": "red",
            "border-width": "1px",
            "border-style": "solid"
        })
        var element = this.D_cl(n)[0];
        var div = this.D_id(n);
        var el = this.D_cE("span")
        el.className += n;
        el[iH] = wn;
        el[st][c] = "red";
        el[st][csF] = "right";

        if (this.elEmpty(element)) {
            this.insertAfter(div, el);
        }
        else {
            element[pN][rC](element);
            this.insertAfter(div, el);
        }
    }
    function notrequired(n) {

        $("#" + n).css({
            "border-color": "E5E6E7",
            "border-width": "1px",
            "border-style": "solid"
        })
        $("." + n).addClass("hidden")
    }


})