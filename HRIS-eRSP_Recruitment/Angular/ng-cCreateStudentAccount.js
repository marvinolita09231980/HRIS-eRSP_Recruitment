
//**********************************************************************************
// PROJECT NAME     :   SMIS
// VERSION/RELEASE  :   SMIS Release #1
// PURPOSE          :   Code Behind for Create Student Account
//**********************************************************************************
// REVISION HISTORY
//**********************************************************************************
// AUTHOR                    DATE            PURPOSE
//----------------------------------------------------------------------------------
// Joseph M. Tombo Jr      06/212/2020     Code Creation
//----------------------------------------------------------------------------------
ng_eSMIS_App.controller("cCreateStudetAccount_ctrlr", function (commonScript, $scope, $compile, $http, $filter) {
    var s = $scope
    var h = $http
    var cs = commonScript

    var userid      = "";
    s.list_of_roles = [];
    s.isAdd         = false;
    s.show_lrn      = true;
    s.account_type  = "";
    s.is_exist      = false;
    function init()
    {

         //$("#modal_generating_remittance").modal();
        //**********************************************
        //**********************************************
        // Initialize data during page loads
        //**********************************************
        $('#chck_status').closest('div').removeClass("checked");
        $('#chck_status').prop('checked', false);
        $('#chck_change_pass').closest('div').removeClass("checked");
        $('#chck_change_pass').prop('checked', false);

        h.post("../cCreateAccount/InitializeData").then(function (d)
        {
            if (d.data.message == "success")
            {

                ////**********************************************
                ////  Show/Hide ADD, EDIT, DELETE button 
                ////**********************************************
                //s.allowAdd      = d.data.um.allow_add
                //s.allowDelete   = d.data.um.allow_delete
                //s.allowEdit     = d.data.um.allow_edit
                //s.allowView     = d.data.um.allow_view
                s.list_of_roles = d.data.roles_list;
                s.img_p         = d.data.imgDataURL;

                $('#txtb_expirydate .input-group.date').datepicker({
                    todayBtn: "linked",
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    format: "yyyy-mm-dd"
                });

                s.txtb_student_lname        = d.data.account_info.last_name;
                s.txtb_student_fname        = d.data.account_info.first_name;
                s.txtb_student_mname        = d.data.account_info.middle_name;
                s.txtb_student_sname        = d.data.account_info.suffix_name;
                s.txtb_student_gender       = d.data.account_info.gender;
                s.txtb_student_lnr          = d.data.account_info.lnr;
                s.txtb_student_id           = d.data.account_info.details_id;
                s.txtb_email_address        = d.data.account_info.email_address;
                //d.data.from_table = "P"
                s.account_type = d.data.from_table;
                if (d.data.username.exist_flag == "N")
                {
                    s.txtb_current_pass     = makeRandomPassword(8);
                    s.txtb_confirm_password = s.txtb_current_pass;
                    s.txtb_user_id          = d.data.username.username;
                    s.ddl_user_roles        = s.account_type == "S" ? "901":"";
                    $('#chck_status').closest('div').addClass("checked");
                    $('#chck_status').prop('checked', true);
                    $('#chck_change_pass').closest('div').addClass("checked");
                    $('#chck_change_pass').prop('checked', true);
                }
                else
                {
                    
                    s.ddl_user_roles        = d.data.account_info.role_id;
                    s.txtb_user_id          = d.data.username.username;
                    s.txtb_current_pass     = d.data.current_password;
                    s.txtb_confirm_password = d.data.current_password;
                    s.txtb_expirydate = Date.parse(d.data.account_info.expirydate) != "1900-01-01" ? Date.parse(d.data.account_info.expirydate) : "";
                    d.data.account_info.user_status ? $('#chck_status').closest('div').addClass("checked") : $('#chck_status').closest('div').removeClass("checked");
                    d.data.account_info.locked_account ? $('#chck_change_lock').closest('div').addClass("checked") : $('#chck_change_lock').closest('div').removeClass("checked");
                    d.data.account_info.change_password ? $('#chck_change_pass').closest('div').addClass("checked") : $('#chck_change_pass').closest('div').removeClass("checked");
                    $("#addFinal").html('<i class="fa fa-eye"> </i> View');
                    $("#addFinal").removeClass('btn-success');
                    $("#addFinal").addClass('btn-primary');
                    s.is_exist = true;
                }
                
                if (d.data.from_table == "S")
                {
                    $('#h1_info').html("STUDENT ACCOUNT INFORMATION");
                    $('#lbl_id_info').html("<b> Student ID:</b>");
                    s.show_lrn = true
                }
                else
                {
                    $('#h1_info').html("PERSONNEL ACCOUNT INFORMATION");
                    $('#lbl_id_info').html("<b> Personnel ID:</b>");
                    s.show_lrn = false;
                }

                $("#modal_generating_remittance").modal("hide");
            }
            else
            {
                swal("No Profile Selected", { icon: "warning"});
                setTimeout(function () {
                    var url = "../cStudentInformation"
                    window.location.href = url;
                }, 3000);
            }
            cs.loading("hide")
        });
    }
    init()

    

    s.clear_time_out = function ()
    {
        if (s.account_type == "S")
        {
            window.location.href = "../cStudentInformation"
        }
        else if (s.account_type == "P") {
            window.location.href = "../cPersonnelInfo"
        }
        else{
            window.location.href = "../"
        }
    }
     //************************************//
    //***      Generate Random Passwor ****//
    //************************************//
    function makeRandomPassword(length)
    {
        var result = "";
        var characters_l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var characters_p = "abcdefghijklmnopqrstuvwxyz";
        var numbers = "1234567890";
        var sp_char = ".@*$";
        var l = ((length - 2) / 2);
        var p = ((length - 2) / 2);
        for (var i = 0; i < l;i++)
        {
            result += characters_l.charAt(Math.floor(Math.random() * characters_l.length));
        }
        for (var i = 0; i < p; i++) {
            result += characters_p.charAt(Math.floor(Math.random() * characters_p.length));
        }
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        result += sp_char.charAt(Math.floor(Math.random() * sp_char.length));
        return result;
    }

    //************************************//
    //***       Open Add Modal        ****//
    //************************************//
    //s.btn_add_click = function ()
    //{
    //    clearentry();
    //    ValidationResultColor("ALL", false);
    //    s.isAdd = true;
    //    s.ModalTitle = "Add New Record";
    //    btn = document.getElementById('add');
    //    btn.innerHTML = '<i class = "fa fa-spinner fa-spin"></i> Add';
    //    h.post("../cCreateStatudentAccount/initAddEdit",
    //        {
    //            password: ""
    //        }).then(function (d) {
    //            if (d.data.message == "success") {
    //                s.list_of_no_account = d.data.empl_no_account;
    //                s.list_of_roles = d.data.roles_list;
    //                btn.innerHTML = '<i class="fa fa-plus-circle"> </i> Add';
    //                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
    //            }
    //            else {
    //                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
    //            }
    //        });

    //}

    //************************************// 
    //*** Save New Record              
    //**********************************// 
    s.btn_save_click = function () {
        if (ValidateFields("A"))
        {
            if (!s.is_exist)
            {
                btn = document.getElementById('addFinal');
                btn.innerHTML = '<i class = "fa fa-spinner fa-spin"></i> Save';
                var data = {
                    user_id: s.txtb_user_id
                    , user_password: s.txtb_current_pass
                    , empl_id: s.txtb_student_id
                    , user_status: ($("#chck_status").is(':checked') == true ? 1 : 0)
                    , locked_account: ($("#chck_change_lock").is(':checked') == true ? 1 : 0)
                    , change_password: ($("#chck_change_pass").is(':checked') == true ? 1 : 0)
                    , created_dttm: moment(new Date())
                    , created_by: ""
                    , updated_dttm: ""
                    , updated_by: ""
                    , expirydate: $('#txtb_expirydate').val().trim()
                    , account_type: s.account_type
                }
                var role_data =
                {
                    user_id: s.txtb_user_id
                    , role_id: s.ddl_user_roles
                }

                h.post("../cCreateAccount/Save",
                    {
                        data: data
                        , role_data: role_data
                    }).then(function (d)
                    {
                        if (d.data.message == "success")
                        {
                            $("#addFinal").html('<i class="fa fa-eye"> </i> View');
                            $("#addFinal").removeClass('btn-success');
                            $("#addFinal").addClass('btn-primary');
                            s.is_exist = true;
                            swal("How are you going to Send account information?", {
                                title: "Account Successfully Created!",
                                icon: "success",
                                buttons: true,
                                buttons:
                                {
                                    sendEmail: {
                                        text: "Send To Email",
                                        className: "btn-warning"
                                    },
                                    //, sendSMS: "Send SMS"
                                    showManualy: "Show Manually",
                                    cancel: "Close"
                                },
                                closeOnClickOutside:false
                            }).then(function(d) {
                                switch (d) {
                                    case "sendEmail":
                                        {
                                            $("#loading_msg").html("SENDING");
                                            $("#modal_generating_remittance").modal("show");
                                            h.post("../cCreateAccount/SendToEmail",
                                                {
                                                    email_to: s.txtb_email_address
                                                    , data: data
                                                }).then(function (dx)
                                                {
                                                    if (dx.data.message == "success") {
                                                        $("#modal_generating_remittance").modal("hide");
                                                        swal("Email successfully Sent", { icon: "success", });
                                                    }
                                                });
                                            break;
                                        }
                                    case "sendSMS":
                                        alert("Information was sent to Phone");
                                        break;
                                    case "showManualy":
                                        {
                                            $('#modalLabelSmall').html("ACCOUNT INFORMATION");
                                            s.ModalTitle = "ACCOUNT INFORMATION";
                                            $('#txtb_name').val(s.txtb_student_fname + " " + s.txtb_student_lname);
                                            $('#txtb_username_display').val(s.txtb_user_id);
                                            $('#txtb_password_display').val(s.txtb_current_pass);
                                            $('#show_accountInformation_modal').modal({ backdrop: 'static', keyboard: false });
                                            break;
                                        }
                                }
                            });
                            s.txtb_email_address.trim() == "" ? $('button.swal-button.swal-button--sendEmail').prop("disabled", "disabled") : $('button.swal-button.swal-button--sendEmail').prop("disabled", "");
                        }
                        else {
                            swal(d.data.message, { icon: "warning", });
                        }
                    })
            }
            else
            {
                var data = {
                    user_id: s.txtb_user_id
                    , user_password: s.txtb_current_pass
                    , empl_id: s.txtb_student_id
                    , user_status: ($("#chck_status").is(':checked') == true ? 1 : 0)
                    , locked_account: ($("#chck_change_lock").is(':checked') == true ? 1 : 0)
                    , change_password: ($("#chck_change_pass").is(':checked') == true ? 1 : 0)
                    , created_dttm: ""
                    , created_by: ""
                    , updated_dttm: ""
                    , updated_by: ""
                    , expirydate: $('#txtb_expirydate').val().trim()
                    , account_type: s.account_type
                }  
                swal("How are you going to Send account information?", {
                    title: "Existing Account",
                    icon: "success",
                    buttons: true,
                    buttons:
                    {
                       
                        sendEmail: {
                            text: "Send To Email",
                            className:"btn-warning"},
                        //, sendSMS: "Send SMS"
                         showManualy: "Show Manually",
                        cancel: {
                            text: "Close",
                            value: null,
                            visible: true,
                            className: "",
                            closeModal: true,
                        }
                    },
                    closeOnClickOutside: false
                }).then(function(d) {
                    switch (d) {
                        case "sendEmail":
                            $("#loading_msg").html("SENDING");
                            $("#modal_generating_remittance").modal("show");
                            h.post("../cCreateAccount/SendToEmail",
                                {
                                    email_to: s.txtb_email_address
                                    , data: data
                                }).then(function (dx) {
                                    if (dx.data.message == "success") {
                                        $("#modal_generating_remittance").modal("hide");
                                        swal("Email successfully Sent", { icon: "success", });
                                    }
                                });
                            break;
                        case "sendSMS":
                            alert("Information was sent to Phone");
                            break;
                        case "showManualy":
                            {
                                $('#modalLabelSmall').html("ACCOUNT INFORMATION");
                                s.ModalTitle = "ACCOUNT INFORMATION";
                                $('#txtb_name').val(s.txtb_student_fname + " " + s.txtb_student_lname);
                                $('#txtb_username_display').val(s.txtb_user_id);
                                $('#txtb_password_display').val(s.txtb_current_pass);
                                $('#show_accountInformation_modal').modal({ backdrop: 'static', keyboard: false });
                                break;
                            }
                    }
                });
                s.txtb_email_address.trim() == "" ? $('button.swal-button.swal-button--sendEmail').prop("disabled", "disabled") : $('button.swal-button.swal-button--sendEmail').prop("disabled", "");
            }
            
        }
    }
    //***********************************************************//
    //***Field validation for remittance type before opening add modal
    //***********************************************************// 
    function ValidateFields(action_mode) {
        //Action modes are A for adding data, E for Editing data
        var return_val = true;
        ValidationResultColor("ALL", false);
        //if (action_mode == "A") {
        if ($('#ddl_user_roles').val() == "")
        {
            ValidationResultColor("ddl_user_roles", true);
            return_val = false;
        }
        if ($("#txtb_user_id").val().trim() == "") {
            ValidationResultColor("txtb_user_id", true);
            return_val = false;
        }

        if ($("#txtb_current_pass").val().trim() == "") {
            ValidationResultColor("txtb_current_pass", true);
            return_val = false;
        }
        else if (s.validateNewPass() == false) {
            $("#txtb_current_pass").addClass("required");
            return_val = false;
        }
        else if ($("#txtb_confirm_password").val().trim() == "") {
            ValidationResultColor("txtb_confirm_password", true);
            return_val = false;
        }
        else if (s.validateConfirmNP() == false)
        {
            $("#txtb_confirm_password").addClass("required");
            return_val = false;
        }
        return return_val;
    }
    //***********************************************************//
    //***Field validation for remittance type before opening add modal
    //***********************************************************// 
    function ValidationResultColor(par_object_id, par_v_result)
    {
        if (par_v_result)
        {
            //Add class to the obect that need to focus as a required..
            $("#" + par_object_id).addClass("required");
            $("#lbl_" + par_object_id + "_req").text("Required Field");
        }
        else
        {
            //remove of refresh the object form being required

            $("#txtb_user_id").removeClass("required");
            $("#lbl_txtb_user_id_req").text("");

            $("#ddl_user_roles").removeClass("required");
            $("#lbl_ddl_user_roles_req").text("");

            $("#txtb_current_pass").removeClass("required");
            $("#lbl_txtb_current_pass_req").text("");

            $("#txtb_confirm_password").removeClass("required");
            $("#lbl_txtb_confirm_password_req").text("");

        }
    }

    s.validateCurrentPass = function ()
    {
        var invalid_password = false;
        if (s.txtb_current_pass.trim() == "") {
            $("#txtb_current_pass").removeClass("required");
            //s.aShow = false;
            //s.spnrCPShow = false;
        }
        else {
            $("#txtb_current_pass").addClass("required");
            $("#lbl_txtb_current_pass_req").text("Not ok");
        }
    }

    s.validateNewPass = function () {
        var regex_number    = /\d+/g;
        var regex_upper     = /[A-Z]/;
        var regex_lower     = /[a-z]/;
        var regex_spchar    = /[^a-zA-Z0-9\s]/;
        var valid_pass      = true;
        if ((regex_number.test($("#txtb_current_pass").val().trim()) == false
            || regex_upper.test($("#txtb_current_pass").val().trim()) == false
            || regex_lower.test($("#txtb_current_pass").val().trim()) == false
            || regex_spchar.test($("#txtb_current_pass").val().trim()) == false)) {
            $("#lbl_txtb_current_pass_req").text("New Password require's combination of uppercase, lowercase, and number including atleast 1 special character.");
            valid_pass = false;

        }
        else {

            $("#lbl_txtb_current_pass_req").text("");
            valid_pass = true;
        }
        return valid_pass;
    }

    s.validateConfirmNP = function ()
    {
        var confirm = true;
        if (s.txtb_current_pass == s.txtb_confirm_password && s.txtb_confirm_password != "") {
            confirm = true;
            $("#lbl_txtb_confirm_password_req").text("");
            $("#txtb_txtb_confirm_password_pass").removeClass("required");

        }
        else {
            $("#lbl_txtb_confirm_password_req").text("Password not match!");
            $("#txtb_txtb_confirm_password_pass").addClass("required");
            confirm = false;
        }
        return confirm;
    }


    function get_page(empl_id) {
        var nakit_an = false;
        var rowx = 0;
        $('#datalist_grid tr').each(function () {
            $.each(this.cells, function (cells) {
                if (cells == 0) {
                    if ($(this).text() == empl_id) {
                        nakit_an = true;
                        return false;
                    }
                }
            });
            if (nakit_an) {
                $(this).addClass("selected");
                return false;
            }
            rowx++;
        });
        return nakit_an;
    }
    //************************************// 
    //*** Open Edit Modal         
    //**********************************// 
    s.btn_edit_action = function (row_id) {
        clearentry();

        //s.ddl_personnel_name    = s.datalistgrid[row_id].empl_id;


        h.post("../cCreateStatudentAccount/initAddEdit", {
            password: s.datalistgrid[row_id].user_password
        }).then(function (d) {
            if (d.data.message == "success") {
                s.list_of_no_account = d.data.empl_no_account;
                s.list_of_roles = d.data.roles_list;

                s.txtb_personnel_name = s.datalistgrid[row_id].personnel_name_format2;
                s.txtb_user_id = s.datalistgrid[row_id].user_id;
                s.ddl_user_roles = s.datalistgrid[row_id].role_id;
                s.txtb_current_pass = d.data.password;
                s.txtb_confirm_password = d.data.password;

                if (s.datalistgrid[row_id].user_status == true) {
                    $('#chck_status').closest('div').addClass("checked");
                    $('#chck_status').prop('checked', true);

                }
                if (s.datalistgrid[row_id].locked_account == true) {
                    $('#chck_change_lock').closest('div').addClass("checked");
                    $('#chck_change_lock').prop('checked', true);
                }
                if (s.datalistgrid[row_id].change_password == true) {
                    $('#chck_change_pass').closest('div').addClass("checked");
                    $('#chck_change_pass').prop('checked', true);
                }


                s.isAdd = false;
                s.ModalTitle = "Edit Existing Record";
                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
                $('#edit').attr('ngx-data', row_id);
            }
            else {
                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
            }
        });
    }
    //************************************// 
    //*** Delete Record              
    //**********************************// 
    s.btn_del_row = function (row_index) {
        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cCreateStatudentAccount/Delete",
                        {
                            user_id: s.datalistgrid[row_index].user_id
                            , role_id: s.datalistgrid[row_index].role_id
                        }).then(function (d) {
                            if (d.data.message == "success") {
                                s.datalistgrid = s.datalistgrid.delete(row_index);
                                s.oTable.fnClearTable();
                                if (s.datalistgrid.length != 0) {
                                    s.oTable.fnAddData(s.datalistgrid);
                                }
                                swal("Your record has been deleted!", { icon: "success", });
                            }
                            else {
                                swal("Data already deleted by other user/s!", { icon: "warning", });
                                s.datalistgrid = s.datalistgrid.delete(row_index);
                                s.oTable.fnClearTable();
                                if (s.datalistgrid.length != 0) {
                                    s.oTable.fnAddData(s.datalistgrid);
                                }
                            }
                        })
                }
            });
    }

    s.btn_print = function ()
    {
         var controller  = "Reports";
        var action      = "Index";
        var ReportName  = "";
        var SaveName    = "Crystal_Report";
        var ReportType  = "inline";
        var ReportPath  = "~/Reports/cryAccountInfo/";
        var sp          = "";

        ReportName  = "cryAccountInfo";
        ReportPath  = ReportPath + "" + ReportName + ".rpt";
        sp          = "sp_account_info_report,Acount";
        $('#modal_generating_report').modal("hide");
        h.post("../cCreateAccount/SetHistoryPage",
            {
                empl_id: s.txtb_student_id,
                username: s.txtb_user_id,
                password: s.txtb_current_pass,
                account_type: s.account_type

            }).then(function (d)
        {
            location.href = "../" + controller + "/" + action + "?ReportName=" + ReportName
                + "&SaveName=" + SaveName
                + "&ReportType=" + ReportType
                + "&ReportPath=" + ReportPath
                + "&Sp=" + sp
        });
    }

    Array.prototype.delete = function (code) {
        return this.filter(function (d, k) {
            return k != code
        })
    }

    s.ddl_personnel_change = function (var_empl_id) {
        if (var_empl_id != "") {
            s.txtb_user_id = "U" + var_empl_id;
        }
        else s.txtb_user_id = "";
    }

    function clearentry() {
        s.txtb_module_name = "";
        s.txtb_user_id = "";
        s.ddl_personnel_name = "";
        s.ddl_user_roles = "";
        s.txtb_current_pass = "";
        s.txtb_confirm_password = "";
        $('#chck_status').closest('div').removeClass("checked");
        $('#chck_change_lock').closest('div').removeClass("checked");
        $('#chck_change_pass').closest('div').removeClass("checked");
    }
})